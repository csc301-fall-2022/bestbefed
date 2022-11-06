import React, { useEffect } from "react";
import { useSignOut } from "react-auth-kit";

function Logout() {
  const signOut = useSignOut();

  useEffect(() => {
    signOut();
    window.location.href = "https://bestbefed.ca";
  });

  return <></>;
}

export default Logout;
