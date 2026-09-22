import { useEffect, useState } from "react";
import { DemoUserContext, identities } from "./demoUserStore.js";

export const DemoUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("creatorGigDemoUser");
    return identities.find((user) => user.email === saved) || identities[0];
  });

  useEffect(() => {
    localStorage.setItem("creatorGigDemoUser", currentUser.email);
  }, [currentUser]);

  return (
    <DemoUserContext.Provider value={{ currentUser, identities, setCurrentUser }}>
      {children}
    </DemoUserContext.Provider>
  );
};
