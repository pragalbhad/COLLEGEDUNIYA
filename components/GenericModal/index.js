import React from "react";
import { Modal, Button } from "react-bootstrap";

const GenericModal = ({ 
  show, 
  onClose, 
  title, 
  children, 
  size = "md" 
}) => {
  return (
    <Modal show={show} onHide={onClose} size={size} centered className="modal">
      <Modal.Header closeButton>
        <Modal.Title className="modle-title">{title && title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children} 
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
