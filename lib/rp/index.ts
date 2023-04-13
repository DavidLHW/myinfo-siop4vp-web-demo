import { W3CVerifiablePresentation } from "@sphereon/ssi-types";
import {
  RP,
  PresentationVerificationResult,
  RevocationVerification,
  PassBy,
  SubjectType,
  ResponseType,
  SigningAlgo,
  Scope,
  SupportedVersion,
} from "@sphereon/did-auth-siop";

const verifyPresentation = async (
  vp: W3CVerifiablePresentation
): Promise<PresentationVerificationResult> => {
  //   const keyPair = await Ed25519VerificationKey2020.from(VC_KEY_PAIR);
  //   const suite = new Ed25519Signature2020({ key: keyPair });
  //   suite.verificationMethod = keyPair.id;
  //   // If the credentials are not verified individually by the library,
  //   // it needs to be implemented. In this example, the library does it.
  //   const { verified } = await vc.verify({
  //     presentation: vp,
  //     suite,
  //     challenge: "challenge",
  //     documentLoader: new DocumentLoader().getLoader(),
  //   });
  //   return Promise.resolve({ verified });
  return { verified: true };
};

const rpKeys = {
  hexPrivateKey: process.env.RP_PRIVATE_KEY_HEX as string,
  did: process.env.RP_DID as string,
  kid: process.env.RP_DID_KID as string,
  alg: process.env.RP_DID_ALG as SigningAlgo,
};

export const rp = RP.builder({ requestVersion: SupportedVersion.SIOPv2_D11 })
  .withRedirectUri("http://localhost:3000/auth")
  .withRequestByValue()
  .withPresentationVerification(verifyPresentation)
  //   .withWellknownDIDVerifyCallback(verifyCallback)
  .withRevocationVerification(RevocationVerification.NEVER)
  .withInternalSignature(
    rpKeys.hexPrivateKey,
    rpKeys.did,
    rpKeys.kid,
    rpKeys.alg
  )
  .addDidMethod("ethr")
  .withClientMetadata({
    idTokenSigningAlgValuesSupported: [SigningAlgo.EDDSA],
    requestObjectSigningAlgValuesSupported: [
      SigningAlgo.EDDSA,
      SigningAlgo.ES256,
    ],
    responseTypesSupported: [ResponseType.ID_TOKEN],
    scopesSupported: [Scope.OPENID_DIDAUTHN, Scope.OPENID],
    subjectTypesSupported: [SubjectType.PAIRWISE],
    subject_syntax_types_supported: ["did", "did:ethr"],
    vpFormatsSupported: { jwt_vc: { alg: [SigningAlgo.EDDSA] } },
    passBy: PassBy.VALUE,
  })
  .withPresentationDefinition({
    definition: {
      id: "123",
      input_descriptors: [
        {
          id: "123",
          schema: [
            {
              uri: "https://www.w3.org/2018/credentials#VerifiableCredential", //example
            },
          ],
        },
      ],
    },
  })
  .build();
