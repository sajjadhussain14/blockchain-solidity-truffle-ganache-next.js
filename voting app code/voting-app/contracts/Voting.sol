// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Voting {
    struct Candidate {
        string name;
        string cnic;
        string constituency;
        address candidateAccount;
    }

    Candidate[] public candidates;
    mapping(string => uint) private cnicToIndex;
    mapping(string => bool) private cnicExists;
    mapping(address => bool) private accountExists;

    function addCandidate(
        string memory _cnic,
        string memory _name,
        string memory _constituency,
        address _candidateAccount
    ) public {
        require(!cnicExists[_cnic], "CNIC already exists.");
        require(!accountExists[_candidateAccount], "Account already exists.");

        candidates.push(
            Candidate({
                name: _name,
                cnic: _cnic,
                constituency: _constituency,
                candidateAccount: _candidateAccount
            })
        );

        uint index = candidates.length - 1;
        cnicToIndex[_cnic] = index;
        cnicExists[_cnic] = true;
        accountExists[_candidateAccount] = true;
    }

    function updateCandidate(
        string memory _cnic,
        string memory _name,
        string memory _constituency
    ) public {
        require(cnicExists[_cnic], "Candidate with this CNIC does not exist.");

        uint index = cnicToIndex[_cnic];
        candidates[index].name = _name;
        candidates[index].constituency = _constituency;
    }

    function deleteCandidate(string memory _cnic) public {
        require(cnicExists[_cnic], "Candidate with this CNIC does not exist.");

        uint indexToDelete = cnicToIndex[_cnic];
        uint lastIndex = candidates.length - 1;

        // Update mappings for the candidate to delete
        cnicExists[_cnic] = false;
        accountExists[candidates[indexToDelete].candidateAccount] = false;
        delete cnicToIndex[_cnic];

        if (indexToDelete != lastIndex) {
            // Move the last candidate to the position of the candidate to delete
            candidates[indexToDelete] = candidates[lastIndex];
            cnicToIndex[candidates[lastIndex].cnic] = indexToDelete;
        }

        // Remove the last element
        candidates.pop();
    }
    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }

    function getCandidate(
        uint index
    )
        public
        view
        returns (string memory, string memory, string memory, address)
    {
        require(index < candidates.length, "Index out of bounds.");

        Candidate memory candidate = candidates[index];
        return (
            candidate.name,
            candidate.cnic,
            candidate.constituency,
            candidate.candidateAccount
        );
    }
}
