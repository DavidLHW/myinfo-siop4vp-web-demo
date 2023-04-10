import React, { useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { AuthStatusResponse, GenerateAuthRequestURIResponse } from "@/types";
import {
  CreateElementArgs,
  QRType,
  URIData,
  ValueResult,
} from "@sphereon/ssi-sdk-qr-react";
import agent from "../agent";
import { AuthorizationResponsePayload } from "@sphereon/did-auth-siop";

export type AuthenticationQRProps = {
  onAuthRequestRetrieved: () => void;
  onSignInComplete: (payload: AuthorizationResponsePayload) => void;
};

const AuthenticationQR: React.FC<AuthenticationQRProps> = ({
  onAuthRequestRetrieved,
  onSignInComplete,
}) => {
  const [authRequestURIResponse, setAuthRequestURIResponse] = useState<
    GenerateAuthRequestURIResponse | undefined
  >(undefined);
  const [qrCode, setQrCode] = useState<JSX.Element | undefined>(undefined);
  const [timedOutRequestMappings, setTimedOutRequestMappings] = useState<
    Set<{
      authRequestURIResponse: GenerateAuthRequestURIResponse;
      qrCode: JSX.Element;
    }>
  >(new Set());

  const definitionId =
    process.env.PRESENTATION_DEF_ID || "9449e2db-791f-407c-b086-c21cc677d2e0";
  const qrExpirationMs =
    parseInt(process.env.REACT_APP_QR_CODE_EXPIRES_AFTER_SEC! ?? 120) * 1000;

  const generateNewQRCode = async () => {
    try {
      const authRequestURIResponse = await generateAuthRequestURI();
      const qrCode = await agent.uriElement(
        createQRCodeElement(authRequestURIResponse)
      );
      registerState(authRequestURIResponse, qrCode);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let refreshTimerHandle: NodeJS.Timeout;

    if (!qrCode) {
      generateNewQRCode();
      refreshTimerHandle = setTimeout(() => refreshQRCode(), qrExpirationMs);
    }

    return () => {
      if (refreshTimerHandle) {
        clearTimeout(refreshTimerHandle);
      }
    };
  }, [qrCode]);

  const generateAuthRequestURI = async () => {
    const response = await axios.get(
      uriWithBase(`/webapp/definitions/${definitionId}/auth-request-uri`)
    );
    const generateResponse = await response.data;
    if (response.status !== 200) {
      throw Error(generateResponse.message);
    }
    return generateResponse;
  };

  const createQRCodeElement = (
    authRequestURIResponse: GenerateAuthRequestURIResponse
  ): CreateElementArgs<QRType.URI, URIData> => {
    const qrProps: CreateElementArgs<QRType.URI, URIData> = {
      data: {
        type: QRType.URI,
        object: authRequestURIResponse.authRequestURI,
        id: authRequestURIResponse.correlationId,
      },
      onGenerate: (result: ValueResult<QRType.URI, URIData>) => {},
      renderingProps: {
        bgColor: "white",
        fgColor: "#352575",
        level: "L",
        size: 200,
        title: "Sign in",
      },
    };
    return qrProps;
  };

  const refreshQRCode = () => {
    console.log("Timeout expired, refreshing QR code...");
    if (qrExpirationMs > 0) {
      if (authRequestURIResponse && qrCode) {
        timedOutRequestMappings.add({ authRequestURIResponse, qrCode });
      }
      generateNewQRCode();
    }
  };

  const registerState = (
    authRequestURIResponse: GenerateAuthRequestURIResponse,
    qrCode: JSX.Element
  ) => {
    if (
      authRequestURIResponse.correlationId ===
      authRequestURIResponse.correlationId
    ) {
      return;
    }

    if (!timedOutRequestMappings.has({ authRequestURIResponse, qrCode })) {
      timedOutRequestMappings.add({ authRequestURIResponse, qrCode });
    }
    setQrCode(qrCode);
    setAuthRequestURIResponse(authRequestURIResponse);
    pollAuthStatus(authRequestURIResponse);
  };

  const pollAuthStatus = async (
    authRequestURIResponse: GenerateAuthRequestURIResponse
  ) => {
    let pollingResponse = await axios.post(uriWithBase("/webapp/auth-status"), {
      correlationId: authRequestURIResponse?.correlationId,
      definitionId: authRequestURIResponse.definitionId,
    });

    const interval = setInterval(async (args) => {
      const authStatus: AuthStatusResponse = pollingResponse.data;
      if (!qrCode) {
        clearInterval(interval);
        return generateNewQRCode();
      } else if (!authStatus) {
        return;
      } else if (
        timedOutRequestMappings.has({ authRequestURIResponse, qrCode })
      ) {
        try {
          console.log("Cancelling timed out auth request.");
          await axios.delete(
            uriWithBase(
              `/webapp/definitions/${authRequestURIResponse?.definitionId}/auth-requests/${authRequestURIResponse?.correlationId}`
            )
          );
          timedOutRequestMappings.delete({ authRequestURIResponse, qrCode });
        } catch (error) {
          console.log(error);
        }
      }
      if (authStatus.status === "sent") {
        onAuthRequestRetrieved();
      } else if (authStatus.status === "verified") {
        clearInterval(interval);
        return onSignInComplete(authStatus.payload!);
      } else if (
        pollingResponse.status >= 400 ||
        authStatus.status === "error"
      ) {
        clearInterval(interval);
        return Promise.reject(authStatus.error ?? pollingResponse.data);
      } else {
        console.log(`status during polling: ${JSON.stringify(authStatus)}`);
      }

      pollingResponse = await axios.post(uriWithBase("/webapp/auth-status"), {
        correlationId: authRequestURIResponse?.correlationId,
        definitionId: authRequestURIResponse?.definitionId,
      });
      console.log(JSON.stringify(pollingResponse));
    }, 2000);
  };

  return qrCode ? (
    <div>{qrCode}</div>
  ) : (
    <Oval color="#352575" height="100" width="100" />
  );
};

export default AuthenticationQR;
