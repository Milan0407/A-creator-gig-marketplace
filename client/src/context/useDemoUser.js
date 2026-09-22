import { useContext } from "react";
import { DemoUserContext } from "./demoUserStore.js";

export const useDemoUser = () => {
  const context = useContext(DemoUserContext);
  if (!context) throw new Error("useDemoUser must be used inside DemoUserProvider");
  return context;
};
