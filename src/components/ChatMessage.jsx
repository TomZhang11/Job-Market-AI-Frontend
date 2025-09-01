import RevealText from "./RevealText";
import TypingIndicator from "./TypingIndicator";

// the message box that is either a user or the ai

export default function ChatMessage({ role, text }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gray-100 text-black whitespace-pre-wrap break-words px-4 py-2 rounded-lg max-w-xs lg:max-w-md msg-in-right">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3">
      <img src="/tom.jpg" alt="AI Agent" className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="bg-gray-100 text-black whitespace-pre-wrap break-words px-4 py-2 rounded-lg max-w-xs lg:max-w-md msg-in-left">
        {text && text !== "" ? <RevealText text={text} /> : <TypingIndicator />}
      </div>
    </div>
  );
}
