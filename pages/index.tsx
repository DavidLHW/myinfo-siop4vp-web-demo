import { useState, useEffect } from "react";
import AuthenticationModal from "../components/AuthenticationModal";
import jsonpack from "jsonpack";
import Nav from "../components/Nav";
import Landing from "../components/pages/Landing";
import SecretPage from "../components/pages/SecretPage";
import ClassifiedPage from "../components/pages/ClassifiedPage";
import { Col, Container, Row } from "react-bootstrap";
import { AuthorizationResponsePayload } from "@sphereon/did-auth-siop";
import { CredentialMapper } from "@sphereon/ssi-types";
import Link from "next/link";

export type AppState = {
  showAuthenticationModal?: boolean;
  payload?: AuthorizationResponsePayload;
};

const App = () => {
  const [state, setState] = useState<AppState>({});
  const _stateStorageKey = "state-onto-app";

  useEffect(() => {
    initState();
    saveState();
  });

  const initState = () => {
    let storedState = sessionStorage.getItem(_stateStorageKey);
    if (storedState != null) {
      loadState(storedState);
    } else {
      setState({ showAuthenticationModal: false });
    }
  };

  const loadState = (storedState: string) => {
    setState(jsonpack.unpack(storedState) as AppState);
  };

  const saveState = () => {
    sessionStorage.setItem(_stateStorageKey, jsonpack.pack(state));
  };

  const showLoginDialog = () => {
    setState({ showAuthenticationModal: true });
  };

  const hideLoginDialog = () => {
    setState({ showAuthenticationModal: false });
  };

  const completeSignIn = (payload: AuthorizationResponsePayload) => {
    setState({ showAuthenticationModal: false, payload });
  };

  const signOut = () => {
    setState({ payload: undefined });
  };

  const signInOutButtons = () => {
    const payload = state.payload!;

    if (payload) {
      const presentation = CredentialMapper.toWrappedVerifiablePresentation(
        Array.isArray(payload.vp_token)
          ? payload.vp_token[0]
          : payload.vp_token!
      );
      const subjects =
        presentation?.presentation?.verifiableCredential[0].credential
          .credentialSubject!; // Although rare, a VC can have more than one subject
      const subject = Array.isArray(subjects) ? subjects[0] : subjects!;
      return (
        <Container fluid>
          <Row className="align-items-center">
            <Col className="col">
              <h5>
                {subject.firstName} {subject.lastName as string} (
                {"company" in subject
                  ? subject.company
                  : "emailAddress" in subject
                  ? subject.emailAddress
                  : "demo"}
                )
              </h5>
            </Col>
            <Col className="col-1">
              <button
                style={{
                  width: "90%",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={signOut}
              >
                Sign out
              </button>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container fluid>
          <Row>
            <Col className="col-10">
              <img
                style={{ height: 30 }}
                src="https://sphereon.com/content/themes/sphereon/assets/img/logo-wit.svg?auto=compress&cs=tinysrgb&h=10"
                alt="new"
              />
            </Col>
            <Col className="col-1">
              <button
                style={{
                  width: "90%",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={showLoginDialog}
              >
                Sign in
              </button>
            </Col>
          </Row>
        </Container>
      );
    }
  };

  const payload = state.payload!;

  return (
    <div>
      <style type="text/css">
        {`
          .btn-sphereon {
            background-color: #e8261f;
            color: white;
            border-radius: 0px;
          }
          .btn-sphereon:hover {
            background-color: #ba1e19;
            color: white;
            border-radius: 0px;
          }

          .btn-sphereon2 {
            background-color: #352575;
            color: white;
            border-radius: 0px;
          }

          .btn-sphereon2:hover {
              background-color: #ba1e19;
              color: white;
              border-radius: 0px;
          }
        `}
      </style>
      <header className="App-header">{signInOutButtons()}</header>
      <div style={{ display: "flex" }}>
        <Nav payload={payload} />
        <Link href="/secret">
          <SecretPage payload={payload} />
        </Link>
        <Link href="/classified">
          <ClassifiedPage payload={payload} />
        </Link>
        <Link href="/">
          <Landing />
        </Link>
        <AuthenticationModal
          show={state.showAuthenticationModal as boolean}
          onCloseClicked={hideLoginDialog}
          onSignInComplete={completeSignIn}
        />
      </div>
    </div>
  );
};

export default App;
