import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import { CommentsProvider } from "@/contexts/CommentsProvider.tsx";
import { ActiveFormProvider } from "@/contexts/ActiveFormProvider.tsx";
import { NowProvider } from "@/contexts/NowProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentsProvider>
      <ActiveFormProvider>
        <NowProvider>
          <App />
        </NowProvider>
      </ActiveFormProvider>
    </CommentsProvider>
  </StrictMode>,
);
