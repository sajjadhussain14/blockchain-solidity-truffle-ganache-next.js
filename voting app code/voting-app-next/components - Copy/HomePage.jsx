"use client"
import { useEffect, useState } from "react";
import web3 from "../utils/web3";
import voting from "../utils/votingApp";
import UpdateCandidateModal from "./UpdateCandidateModal";

export default function HomePage() {
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidateCNIC, setCandidateCNIC] = useState('');
  const [candidateConstituency, setCandidateConstituency] = useState('');
  const [candidateAccount, setCandidateAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await web3.eth.getAccounts();

        setAccounts(accounts);
        await fetchCandidates();
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };
    init();
  }, []);

  const fetchCandidates = async () => {
    try {
      const candidateCount = await voting.methods.getCandidatesCount().call();
      

      const candidatesArray = [];
      for (let i = 0; i < candidateCount; i++) {
        const candidate = await voting.methods.getCandidate(i).call();
       
        candidatesArray.push({
          name: candidate[0],
          cnic: candidate[1],
          constituency: candidate[2],
          candidateAccount: candidate[3]
        });
      }
      setCandidates(candidatesArray);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const addCandidate = async () => {
    try {
      const existingCandidate = candidates.find(candidate => candidate.cnic === candidateCNIC || candidate.candidateAccount === candidateAccount);
      if (existingCandidate) {
        setError('Cannot add duplicate candidate');
        setTimeout(() => setError(''), 3000); 
        return;
      }

      await voting.methods.addCandidate(candidateCNIC, candidateName, candidateConstituency, candidateAccount).send({ from: accounts[0] });
      await fetchCandidates();
      setCandidateName('');
      setCandidateCNIC('');
      setCandidateConstituency('');
      setCandidateAccount('');
      setError('');
    } catch (error) {
      console.error("Error adding candidate:", error);
      setError('Error adding candidate');
      setTimeout(() => setError(''), 3000); 
    }
  };

  const deleteCandidate = async (cnic) => {
    try {
      console.log("Deleting candidate with CNIC:", cnic);
      const receipt = await voting.methods.deleteCandidate(cnic).send({ from: accounts[0] });
      console.log("Delete transaction receipt:", receipt);
      await fetchCandidates(); // Update candidate list after deletion
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const openUpdateModal = (candidate) => {
    setEditingCandidate(candidate);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setEditingCandidate(null); // Reset editing candidate state
  };

  const updateCandidate = async (cnic, name, constituency) => {
    try {
      await voting.methods.updateCandidate(cnic, name, constituency).send({ from: accounts[0] });
      await fetchCandidates();
      setShowUpdateModal(false); // Close modal on successful update
    } catch (error) {
      console.error("Error updating candidate:", error);
      setError('Error updating candidate');
      setTimeout(() => setError(''), 3000); 
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Voting DApp</h1>
      <div className="mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={candidateCNIC}
              onChange={(e) => setCandidateCNIC(e.target.value)}
              placeholder="Enter candidate CNIC"
            />
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={candidateConstituency}
              onChange={(e) => setCandidateConstituency(e.target.value)}
              placeholder="Enter candidate constituency"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={candidateAccount}
              onChange={(e) => setCandidateAccount(e.target.value)}
              placeholder="Enter candidate account address"
            />
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col-md-12">
            <button className="btn btn-primary w-100" onClick={addCandidate}>Add Candidate</button>
          </div>
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
      <div className="row">
        <div className="col">
          <h2>Candidates List</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">CNIC</th>
                <th scope="col">Constituency</th>
                <th scope="col">Account Address</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{candidate.name}</td>
                  <td>{candidate.cnic}</td>
                  <td>{candidate.constituency}</td>
                  <td>{candidate.candidateAccount}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => openUpdateModal(candidate)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteCandidate(candidate.cnic)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Candidate Modal */}
      <UpdateCandidateModal
        show={showUpdateModal}
        onHide={closeUpdateModal}
        candidate={editingCandidate}
        onUpdate={updateCandidate}
      />
    </div>
  );
}
