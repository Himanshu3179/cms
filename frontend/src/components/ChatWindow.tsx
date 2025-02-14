import React, { useState, useEffect, useRef } from "react";
import { RefreshCcw, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatWindowProps {
  messages: { role: string; content: string }[];
  onSendMessage: (message: string) => void;
  onRefreshChat: () => void;
  isGenerating: boolean; // ✅ New prop to track loading state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onRefreshChat,
  isGenerating, // ✅ Receive loading state
}) => {
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]); // ✅ Scroll down when new messages or loading state changes

  return (
    <div className=" w-3/4 flex flex-col h-[80vh] border border-gray-600 rounded-lg bg-white">
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col text-center text-gray-700 h-full pt-28 items-center justify-center">
            <p className="text-lg font-semibold mb-2">
              Welcome to the AI Editor Chat!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg shadow ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-800 self-end"
                    : "bg-gray-50 text-gray-900 border border-gray-300"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown className="prose">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}

            {/* ✅ Show "Generating..." under the last user message */}
            {isGenerating && (
              <div className="mb-4 p-3 rounded-lg shadow bg-gray-200 text-gray-600 self-start">
                Generating...
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t border-gray-600 bg-gray-50 rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-2 border border-gray-600 rounded-lg shadow-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            onClick={onRefreshChat}
            className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
