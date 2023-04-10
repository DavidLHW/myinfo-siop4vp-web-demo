import { AuthorizationResponsePayload } from "@sphereon/did-auth-siop";

export type ProtectedResourceProps = {
  payload: AuthorizationResponsePayload;
};

export default ({ payload }: ProtectedResourceProps) => {
  const isAuthenticated = (): boolean => {
    return payload !== undefined;
  };

  const accessDenied = () => {
    return (
      <div className="App">
        <img src="access-denied.jpg" alt="logo" width="50%" />
      </div>
    );
  };

  return !isAuthenticated() ? accessDenied() : null;
};
