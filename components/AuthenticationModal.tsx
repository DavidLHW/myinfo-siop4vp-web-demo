import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import AuthenticationQR from "./AuthenticationQR";
import { AuthorizationResponsePayload } from "@sphereon/did-auth-siop";

export type AuthenticationModalProps = {
  show?: boolean;
  onCloseClicked?: () => void;
  onSignInComplete: (payload: AuthorizationResponsePayload) => void;
};

const AuthenticationModal = ({
  show,
  onCloseClicked,
  onSignInComplete,
}: AuthenticationModalProps) => {
  const [authRequestRetrieved, setAuthRequestRetrieved] = useState(false);
  const scanText = "Please scan the QR code with your app.";
  const authText = "Please approve the request in your app.";

  const handleClose = () => {
    onCloseClicked?.();
  };

  return (
    <Modal
      show={show}
      animation={true}
      style={{
        height: "100%",
        marginTop: "150px",
      }}
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#352575",
          color: "white",
          alignItems: "center",
        }}
      >
        <Modal.Title>Authentication</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Row>
            <Col className="d-flex justify-content-center">
              <h6>{authRequestRetrieved ? authText : scanText}</h6>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center"
              style={{ paddingTop: "10px" }}
            >
              <AuthenticationQR
                onAuthRequestRetrieved={() => {
                  setAuthRequestRetrieved(true);
                }}
                onSignInComplete={(payload) => onSignInComplete(payload)}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthenticationModal;
