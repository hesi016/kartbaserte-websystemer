import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./modules/components/App";

//INngangspunkt for React applikasjonen vår. Oppkobling HTML -> REACT
createRoot(document.getElementById("root")!).render(<App />);
