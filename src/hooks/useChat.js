import { useState, useRef, useCallback } from 'react';
import { sendToOpenAI } from '../services/openai';
import { getSystemPrompt } from '../constants/systemPrompt';
import { executeTool } from '../services/fhirApi';

const ACTION_MAP = {
  "View Active Conditions":          "conditions",
  "View Latest Observations":        "lab",
  "View Active Medications":         "medications",
  "View Last 12 months encounters":  "encounters",
  "View Care Gaps":                  "caregaps",
};

export default function useChat() {
  // UI messages: array of { role: "user"|"bot", text, isStreaming?, userMessage? }
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState(null);

  // Mutable refs for state that doesn't need re-renders
  const conversationHistoryRef = useRef([]);
  const currentPatientRef = useRef(null);
  const pendingChipActionRef = useRef(null);

  // Helper to add a message to the UI
  const addMessage = useCallback((role, text, extra = {}) => {
    setMessages(prev => [...prev, { role, text, ...extra }]);
  }, []);

  // Helper to update the last bot message (for streaming)
  const updateLastBotMessage = useCallback((text, extra = {}) => {
    setMessages(prev => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0 && updated[lastIdx].role === 'bot') {
        updated[lastIdx] = { ...updated[lastIdx], text, ...extra };
      }
      return updated;
    });
  }, []);

  // The core agent loop — mirrors the original agentLoop exactly
  const agentLoop = useCallback(async (userMessage, displayMessage) => {
    const history = conversationHistoryRef.current;
    history.push({ role: "user", content: userMessage });

    // Keep only the last 20 messages, starting from a clean user message boundary
    const sliced = history.slice(-20);
    const firstUserIdx = sliced.findIndex(m => m.role === "user");
    const trimmedHistory = firstUserIdx > 0 ? sliced.slice(firstUserIdx) : sliced;

    const apiMessages = [
      { role: "system", content: getSystemPrompt() },
      ...trimmedHistory
    ];

    setIsTyping(true);
    let streamBubbleCreated = false;
    let chunkAccum = "";

    try {
      while (true) {
        chunkAccum = "";

        const result = await sendToOpenAI(
          apiMessages,
          // onTextChunk
          (chunk) => {
            if (!streamBubbleCreated) {
              setIsTyping(false);
              // Add a streaming bot message
              addMessage('bot', '', { isStreaming: true, userMessage: displayMessage || userMessage });
              streamBubbleCreated = true;
            }
            chunkAccum += chunk;
            updateLastBotMessage(chunkAccum, { isStreaming: true, userMessage: displayMessage || userMessage });
          },
          // onRateLimitWait
          (waitSec, waiting) => {
            if (waiting) {
              setRateLimitMessage(`Rate limit reached. Retrying in ${waitSec}s...`);
            } else {
              setRateLimitMessage(null);
            }
          }
        );

        const isToolCall = result.finish_reason === "tool_calls" ||
                           (result.tool_calls && result.tool_calls.length > 0);

        if (isToolCall) {
          streamBubbleCreated = false; // reset for next iteration

          const assistantMsg = {
            role:       "assistant",
            content:    result.content || null,
            tool_calls: result.tool_calls
          };
          apiMessages.push(assistantMsg);
          history.push(assistantMsg);

          // Handle end_chat
          const endCall = result.tool_calls.find(tc => tc.function.name === "end_chat");
          if (endCall) {
            const args = JSON.parse(endCall.function.arguments || "{}");
            setIsTyping(false);
            addMessage('bot', args.farewell_message || "Thank you for using CareBridge. Have a great day!");
            return;
          }

          // Execute all tool calls in parallel
          const toolResults = await Promise.all(
            result.tool_calls.map(async (tc) => {
              const args = JSON.parse(tc.function.arguments || "{}");
              const { result: toolResult, patientInfo } = await executeTool(tc.function.name, args);

              // Track patient from search results
              if (patientInfo) {
                currentPatientRef.current = patientInfo;
              }

              return {
                role:         "tool",
                tool_call_id: tc.id,
                content:      JSON.stringify(toolResult)
              };
            })
          );

          apiMessages.push(...toolResults);
          history.push(...toolResults);
          setIsTyping(true); // show typing again while AI processes tool results

        } else {
          // Final text response
          const finalText = result.content || "";
          history.push({ role: "assistant", content: finalText });

          if (streamBubbleCreated) {
            // Finalize the streaming bubble
            updateLastBotMessage(finalText, { isStreaming: false, userMessage: displayMessage || userMessage });
          } else {
            setIsTyping(false);
            addMessage('bot', finalText, { userMessage: displayMessage || userMessage });
          }
          break;
        }
      }
    } catch (err) {
      setIsTyping(false);
      addMessage('bot', `Sorry, I encountered an error: ${err.message}. Please try again.`);
      console.error("Agent error:", err);
    }
  }, [addMessage, updateLastBotMessage]);

  // Handle user sending a message
  const handleSend = useCallback(async (text) => {
    addMessage('user', text);

    setIsBotResponding(true);

    // Build internal query if a chip action is pending
    let internalQuery = text;
    const pendingAction = pendingChipActionRef.current;
    if (pendingAction) {
      pendingChipActionRef.current = null;

      let patientRef = text;
      const cp = currentPatientRef.current;
      if (cp) {
        const typedLower = text.toLowerCase();
        const nameLower  = cp.name.toLowerCase();
        const firstName  = nameLower.split(" ")[0];
        if (typedLower.includes(firstName) || typedLower === "yes" || typedLower === "yeah" || typedLower === "same") {
          patientRef = cp.id || cp.name;
        }
      }

      const queries = {
        "conditions":  `Show active conditions for patient ${patientRef}`,
        "lab":         `Latest observations for the patient ${patientRef}`,
        "medications": `List medications for patient ${patientRef}`,
        "encounters":  `Show encounters for patient ${patientRef}`,
        "caregaps":    `Show care gaps for patient ${patientRef}`
      };
      internalQuery = queries[pendingAction] || text;
    }

    await agentLoop(internalQuery, text);

    setIsBotResponding(false);
  }, [addMessage, agentLoop]);

  // Handle predefined chip selection
  const handleChipSelect = useCallback(async (label) => {
    addMessage('user', label);

    // Store pending action
    if (ACTION_MAP[label]) {
      pendingChipActionRef.current = ACTION_MAP[label];
    }

    setIsBotResponding(true);
    await agentLoop(label, label);
    setIsBotResponding(false);
  }, [addMessage, agentLoop]);

  // Clear chat
  const clearChat = useCallback(() => {
    conversationHistoryRef.current = [];
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    isBotResponding,
    rateLimitMessage,
    handleSend,
    handleChipSelect,
    clearChat,
  };
}
