// show a popup with mask that dims and covers the whole screen
import { useState, useEffect } from "react";
import styled from "styled-components";
import CloseIcon from "@/components/svg/Cross";
import QRCode from "react-qr-code";
import Loading from "./svg/Loading";

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Popup = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;
  min-height: 300px;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;

// elemenets in container should be centered and take up the whole space
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ toggle }: { toggle: () => void }) => {
  const [encodedUri, setEncodedUri] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/siop/auth").then(async (res) => {
      const encodedUri = await res.json();
      setEncodedUri(encodedUri);
    });
  }, []);

  return (
    <Mask>
      <Popup>
        <PopupHeader>
          <CloseIcon onClick={toggle} />
        </PopupHeader>
        <Container>
          {encodedUri ? (
            <QRCode value={JSON.stringify(encodedUri)} />
          ) : (
            <Loading />
          )}
        </Container>
      </Popup>
    </Mask>
  );
};
