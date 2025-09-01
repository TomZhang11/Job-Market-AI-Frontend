import ChatMessage from "./ChatMessage";

// the chat history between user and ai

export default function ChatHistory({ context }) {
  return (
    <div className="w-full h-full overflow-y-auto chat-scroll pt-16 pb-20">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {context.map(([q, a], i) => (
          <div key={i} className="space-y-4">
            <ChatMessage role="user" text={q} />
            <ChatMessage role="ai" text={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
