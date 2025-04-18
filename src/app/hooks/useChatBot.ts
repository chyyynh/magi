// hooks/useChatBot.ts
import { useReducer, useState, useRef, useEffect } from "react";
import { getProposal, type Proposal } from "@/app/utils/proposalUtils";
import { getGeminiDecision } from "@/app/utils/aiService";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useAccount, useWalletClient } from "wagmi";

// Define a clearer type for buttons
export interface MessageButton {
  text: string;
  action: "snapshot vote" | "send_example_proposal"; // Allowed actions
  data: string; // URL for example, decision for vote
  reason?: string; // Optional reason
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "system";
  isAIResult?: boolean;
  timestamp: Date;
  isLoading?: boolean;
  buttons?: MessageButton[]; // Use the new type
}

type MessageAction =
  | { type: "ADD"; payload: Message }
  | { type: "UPDATE"; id: string; updater: (msg: Message) => Message }
  | { type: "RESET"; payload: Message[] };

const messageReducer = (state: Message[], action: MessageAction): Message[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((msg) =>
        msg.id === action.id ? action.updater(msg) : msg
      );
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

export function useChatBot(
  onProposalLoaded: (
    proposal: Proposal | null,
    geminiDecisionLoading: boolean,
    geminiDecision: string | null
  ) => void
) {
  const [input, setInput] = useState("");
  const [messages, dispatch] = useReducer(messageReducer, [
    {
      id: "welcome",
      text: "Welcome to MAGI System. Please enter a Snapshot proposal link or ID. You can also try an example:",
      sender: "system",
      timestamp: new Date(),
      buttons: [
        {
          text: "Try Aave Proposal [ARFC] Launch GHO on Gnosis Chain",
          action: "send_example_proposal",
          data: "https://snapshot.box/#/s:aavedao.eth/proposal/0x62996204d8466d603fe8c953176599db02a23f440a682ff15ba2d0ca63dda386",
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiDecision, setGeminiDecision] = useState<string | null>(null);
  const [, /* geminiDecisionLoading */ setGeminiDecisionLoading] =
    useState(false); // 新增此狀態
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    dispatch({ type: "ADD", payload: message });
  };

  const updateMessage = (id: string, updater: (msg: Message) => Message) => {
    dispatch({ type: "UPDATE", id, updater });
  };

  const handleVote = async () => {
    if (!walletClient || !address) {
      alert("請先連結錢包");
      return;
    }

    const client = new snapshot.Client712("https://hub.snapshot.org");
    const web3 = new Web3Provider(window.ethereum);
    const index = proposal?.choices.indexOf(geminiDecision as string);
    console.log("Proposal Choices:", proposal?.choices);
    console.log(`space: ${proposal?.space.id} choice: ${index}`);

    try {
      const receipt = (await client.vote(web3, address, {
        space: proposal?.space.id || "",
        proposal: proposal?.id || "",
        type: "single-choice",
        choice: index !== undefined ? index + 1 : 0, // Ensure index is valid
      })) as { id: string }; // Explicitly type the receipt object

      addMessage({
        id: Date.now().toString(),
        text: `✅ 已成功投票到提案: ${receipt.id}`,
        sender: "system",
        timestamp: new Date(),
      });
      console.log("投票成功:", receipt);
    } catch (err) {
      console.error("投票錯誤:", err);
      addMessage({
        id: Date.now().toString(),
        text: `投票失敗: ${
          (err as { error_description?: string }).error_description ||
          "請檢查提案 ID 和選擇"
        }`,
        sender: "system",
        timestamp: new Date(),
      });
    }
  };

  // Core logic for processing a message (refactored from handleSendMessage)
  const processMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return; // Check the provided text

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText, // Use the provided text
      sender: "user",
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput(""); // Clear input after adding user message

    if (messageText.includes("snapshot") || messageText.startsWith("0x")) {
      const loadingMsgId = (Date.now() + 1).toString();
      addMessage({
        id: loadingMsgId,
        text: "Fetching proposal data...",
        sender: "system",
        timestamp: new Date(),
        isLoading: true,
      });

      setIsLoading(true); // Set loading state
      setGeminiDecisionLoading(true);
      onProposalLoaded(null, true, null); // Notify parent component

      try {
        const result = await getProposal(messageText); // Use messageText
        updateMessage(loadingMsgId, (msg) => ({
          ...msg,
          text: result.message,
          isLoading: false,
        }));

        if (result.success && result.data) {
          const proposal = result.data;
          setProposal(proposal);
          onProposalLoaded(proposal, true, null); // Notify parent component

          addMessage({
            id: Date.now().toString(),
            text: `Proposal "${proposal.title}" loaded into MAGI system. ${
              proposal.choices?.length || 0
            } choices available.`,
            sender: "system",
            timestamp: new Date(),
          });

          const geminiDecisionResult = await getGeminiDecision(proposal);
          const decision = geminiDecisionResult.decision || null; // Ensure it's null or string

          setGeminiDecision(decision);

          addMessage({
            id: Date.now().toString(),
            text: `Gemini Decision: ${geminiDecisionResult.decision}: ${geminiDecisionResult.reason}`,
            sender: "system",
            timestamp: new Date(),
            buttons: [
              {
                text: "Snapshot Vote",
                action: "snapshot vote",
                reason: geminiDecisionResult.reason, // Use actual reason
                data: decision || "", // Use decision or empty string
              },
            ],
          });
          setGeminiDecisionLoading(false); // Set geminiDecisionLoading to false
          onProposalLoaded(proposal, false, decision); // Notify parent component
        } else {
          // Handle case where getProposal succeeded but returned no data or error message
          setGeminiDecisionLoading(false);
          onProposalLoaded(null, false, null);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
        updateMessage(loadingMsgId, (msg) => ({
          ...msg,
          text: "Error fetching proposal. Please check the ID and try again.",
          isLoading: false,
        }));
        setGeminiDecisionLoading(false); // Ensure loading state is reset on error
        onProposalLoaded(null, false, null); // Notify parent component on error
      } finally {
        setIsLoading(false); // Clear loading state
        // Don't clear input here, already cleared above
      }
    } else {
      addMessage({
        id: Date.now().toString(),
        text: "Please enter a valid Snapshot proposal link or ID (starting with 0x).",
        sender: "system",
        timestamp: new Date(),
      });
      // Don't clear input here, already cleared above
    }
  };

  const handleSendMessage = async () => {
    await processMessage(input); // Call the core logic with current input
  };

  // New function for the button action
  const handleSendExampleProposal = async (url: string) => {
    if (isLoading) return; // Don't allow if already processing
    await processMessage(url); // Call the core logic with the URL
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleVote,
    handleSendExampleProposal, // Expose the new function
  };
}
