"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CopilotKit, CopilotPopup,useCopilotChatConfiguration  } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

type EnquiryContextValue = {
  selectedService: string;
  selectService: (service: string) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState("");

  const value = useMemo(
    () => ({ selectedService, selectService: setSelectedService }),
    [selectedService],
  );
function MehndiChatButton() {
  const config = useCopilotChatConfiguration();

  if (!config?.setModalOpen) return null;

  return (
    <button
      onClick={() => config.setModalOpen(!config.isModalOpen)}
      aria-label="Open Janu's Mehndi Assistant"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        border: "3px solid #fce7c8",
        background: "linear-gradient(135deg, #166534, #15803d)",
        color: "white",
        fontSize: "30px",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      🌿
    </button>
  );
}
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="prebuilt-popup">
    <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
    <CopilotPopup
        agentId="prebuilt-popup"
         defaultOpen={false}
        toggleButton={MehndiChatButton}
        labels={{
          modalHeaderTitle: "🌿 Janu's Mehndi Buddy",
    chatInputPlaceholder: "Ask Janu about Mehndi...",
    welcomeMessageText: "Hey Mehndi lover! 🌳 How can I help you today?",
    chatDisclaimerText: "✨ A little Mehndi magic, just for you!",
        }}
      />
    </CopilotKit>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }

  return context;
}
