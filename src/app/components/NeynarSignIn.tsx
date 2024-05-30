import React, { useEffect } from 'react';

const NeynarSignIn = ({ clientId, onSignInSuccess }: { clientId: string, onSignInSuccess: () => void }) => {
  useEffect(() => {
    // Function to handle successful sign-in
    (window as any).onSignInSuccess = onSignInSuccess;

    // Create script element for Neynar sign-in
    const script = document.createElement('script');
    script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove script and event handler
    return () => {
      document.body.removeChild(script);
      (window as any).onSignInSuccess = undefined;
    };
  }, [onSignInSuccess]);

  return (
    <div
      className="neynar_signin"
      data-client_id={clientId}
      data-success-callback="onSignInSuccess"
      data-theme="dark"
    />
  );
};

export default NeynarSignIn;
