import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateCandidateModal = ({ show, onHide, candidate, onUpdate }) => {
  const [name, setName] = useState('');
  const [constituency, setConstituency] = useState('');

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setConstituency(candidate.constituency);
    }
  }, [candidate]);

  const handleUpdate = () => {
    onUpdate(candidate.cnic, name, constituency);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Constituency</Form.Label>
            <Form.Control
              type="text"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleUpdate}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCandidateModal;
