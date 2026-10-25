"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/*
 * CopilotKit is disabled for now.
 *
 * The chat integration is kept in the commented block at the bottom of this
 * file so it can be restored later. The packages are still installed, but
 * nothing from CopilotKit is imported or rendered, so it is not part of the
 * client bundle.
 *
 * To re-enable it:
 *   1. Uncomment the two imports below.
 *   2. Create the `/api/copilotkit` runtime route and set the model API key.
 *   3. Uncomment the `CopilotChat` code at the bottom and render
 *      `<CopilotChat />` inside `EnquiryProvider`.
 *
 * import {
 *   CopilotKit,
 *   CopilotPopup,
 *   CopilotChatToggleButton,
 *   useCopilotChatConfiguration,
 * } from "@copilotkit/react-core/v2";
 * import "@copilotkit/react-core/v2/styles.css";
 */

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

  return (
    <EnquiryContext.Provider value={value}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }

  return context;
}

/*
 * ---------------------------------------------------------------------------
 * CopilotKit integration (disabled for now)
 * ---------------------------------------------------------------------------
 *
 * Original implementation, kept for reference:
 *
 * const emptySubscribe = () => () => {};
 *
 * // CopilotKit generates ids with `crypto.randomUUID()` while rendering, which
 * // Cache Components flags during prerender. Rendering the widget only after
 * // hydration keeps the page prerenderable without changing what visitors see.
 * function useIsClient() {
 *   return useSyncExternalStore(
 *     emptySubscribe,
 *     () => true,
 *     () => false,
 *   );
 * }
 *
 * function MehndiChatButton() {
 *   const config = useCopilotChatConfiguration();
 *
 *   if (!config?.setModalOpen) return null;
 *
 *   return (
 *     <button
 *       onClick={() => config.setModalOpen(!config.isModalOpen)}
 *       aria-label="Open Janu's Mehndi Assistant"
 *       style={{
 *         position: "fixed",
 *         bottom: "24px",
 *         right: "24px",
 *         zIndex: 9999,
 *         width: "64px",
 *         height: "64px",
 *         borderRadius: "50%",
 *         border: "3px solid #fce7c8",
 *         background: "linear-gradient(135deg, #166534, #15803d)",
 *         color: "white",
 *         fontSize: "30px",
 *         cursor: "pointer",
 *         boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
 *         display: "flex",
 *         alignItems: "center",
 *         justifyContent: "center",
 *       }}
 *     >
 *       🌿
 *     </button>
 *   );
 * }
 *
 * // CopilotKit types `toggleButton` as its own forwardRef component. A plain
 * // function component works at runtime, so keep the custom launcher and satisfy
 * // the slot type without changing behaviour.
 * const ChatToggleButton =
 *   MehndiChatButton as unknown as typeof CopilotChatToggleButton;
 *
 * function CopilotChat() {
 *   const isClient = useIsClient();
 *
 *   if (!isClient) return null;
 *
 *   return (
 *     <CopilotKit runtimeUrl="/api/copilotkit" agent="prebuilt-popup">
 *       <CopilotPopup
 *         agentId="prebuilt-popup"
 *         defaultOpen={false}
 *         toggleButton={ChatToggleButton}
 *         labels={{
 *           modalHeaderTitle: "🌿 Janu's Mehndi Buddy",
 *           chatInputPlaceholder: "Ask Janu about Mehndi...",
 *           welcomeMessageText:
 *             "Hey Mehndi lover! 🌳 How can I help you today?",
 *           chatDisclaimerText: "✨ A little Mehndi magic, just for you!",
 *         }}
 *       />
 *     </CopilotKit>
 *   );
 * }
 */
