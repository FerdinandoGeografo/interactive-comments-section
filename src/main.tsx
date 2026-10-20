import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CommentsProvider } from "./contexts/CommentsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentsProvider>
      <App />
    </CommentsProvider>
  </StrictMode>,
);
