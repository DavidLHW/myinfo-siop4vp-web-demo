import { useState } from "react";
import Button from "@/components/common/Button";
import QrPopup from "@/components/QrPopup";
import styled from "styled-components";

const Wrapper = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;

  position: relative;
  padding: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
`;

export default () => {
  const [showQr, setShowQr] = useState(false);

  const toggleShowQr = () => {
    setShowQr(!showQr);
  };

  return (
    <Wrapper>
      <Header>
        <h2>Myinfo Siop4vp Web Demo</h2>
      </Header>
      <ButtonContainer>
        <Button onClick={toggleShowQr}>Show QR</Button>
      </ButtonContainer>
      {showQr && <QrPopup toggle={toggleShowQr} />}
    </Wrapper>
  );
};
