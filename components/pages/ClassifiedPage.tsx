import { ProtectedResourceProps } from "./ProtectedResource";
import React from "react";

interface ClassifiedPageProps extends ProtectedResourceProps {}

export default ({ payload }: ClassifiedPageProps) => {
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

  return isAuthenticated() ? (
    <div
      className="App"
      style={{
        backgroundImage: `url("930-W.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100%",
      }}
    >
      <img src="classified.svg" alt="logo" />
      <h5>The classified page</h5>
    </div>
  ) : (
    accessDenied()
  );
};
