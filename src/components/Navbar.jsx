import React, { useState } from "react";
import OwnerLoginModal from "../pages/OwnerLoginModal";
import ProviderLoginModal from "../pages/ProviderLoginModal";

const Navbar = () => {
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [showProviderLogin, setShowProviderLogin] = useState(false);

  return (
    <nav style={{ padding: "10px", background: "#f5f5f5" }}>
      <button onClick={() => setShowOwnerLogin(true)}>Owner Login</button>
      <button onClick={() => setShowProviderLogin(true)}>Provider Login</button>

      <OwnerLoginModal
        isOpen={showOwnerLogin}
        onClose={() => setShowOwnerLogin(false)}
      />
      <ProviderLoginModal
        isOpen={showProviderLogin}
        onClose={() => setShowProviderLogin(false)}
      />
    </nav>
  );
};

export default Navbar;
