import { createContext } from "react";

export const identities = [
  { name: "Milan Chauhan", email: "milan@creatorgig.demo", role: "Creator" },
  { name: "Rahul Sharma", email: "rahul@creatorgig.demo", role: "Client" },
  { name: "Aman Verma", email: "aman@creatorgig.demo", role: "Client" },
  { name: "Priya Singh", email: "priya@creatorgig.demo", role: "Client" },
];

export const DemoUserContext = createContext(null);
