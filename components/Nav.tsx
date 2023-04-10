import Link from "next/link";
import { ProtectedResourceProps } from "./pages/ProtectedResource";

interface NavProps extends ProtectedResourceProps {}

export default ({ payload }: NavProps) => {
  const isAuthenticated = (): boolean => {
    return payload !== undefined;
  };

  const protectedResources = () => {
    if (isAuthenticated()) {
      return (
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <li>
            <Link href="/secret" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "90%",
                  backgroundColor: "red",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                secret page
              </button>
            </Link>
          </li>
          <li>
            <Link href="/classified" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "90%",
                  backgroundColor: "red",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                classified page
              </button>
            </Link>
          </li>
        </div>
      );
    } else {
      return (
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <li>
            <Link href="/classified" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "90%",
                  backgroundColor: "red",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                classified page
              </button>
            </Link>
          </li>
        </div>
      );
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        width: "14em",
        height: "60em",
        background: "rgb(53 52 56 / 95%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "90%",
                backgroundColor: "red",
                color: "white",
                marginBottom: 10,
              }}
            >
              Home
            </button>
          </Link>
        </li>
        {protectedResources()}
      </ul>
    </div>
  );
};
