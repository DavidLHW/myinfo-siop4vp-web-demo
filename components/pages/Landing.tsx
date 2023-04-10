export default () => {
  return (
    <>
      <div className="App" style={{ width: 750 }}>
        <h2 style={{ textAlign: "left" }}>Myinfo OpenID4VP and SIOPv2 demo</h2>

        <p style={{ textAlign: "left" }}>
          This demo is fetching claims of the authorized users, from an
          associated 'wallet' app that securely holds the data as Verifiable
          Credentials (VCs).
        </p>

        <p style={{ textAlign: "left" }}>
          An example of company data as a Verifiable Credentials could be a
          driver's license, bank account details and educational certificates.
          The data is validated and digitally signed in the process of issuing a
          Verifiable Credential by so-called "Issuers". Typically these are
          trusted parties. After issuance they are stored in the SSI-Wallet
          (SPA).
        </p>

        <p style={{ textAlign: "left" }}>
          By then sharing this data as a Verifiable Presentations, the
          requesting party, a "Verifier" – like for example a Bank – receiving
          the data can automatically import the data and verify its
          authenticity.
        </p>
      </div>
    </>
  );
};
