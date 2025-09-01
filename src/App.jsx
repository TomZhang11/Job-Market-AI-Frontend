import { useState } from "react";
import ChatHistory from "./components/ChatHistory";
import InputBar from "./components/InputBar";
import useRotatingPlaceholder from "./hooks/useRotatingPlaceholder";

function App() {
  // placeholders for the input bar
  const placeholders = [
    "What is the most popular front end framework?",
    "What technology is used alongside Docker?",
    "What skills should I learn to land a ML internship?",
    "Is Typescript or Javascript more popular?"
  ]
  const placeholdersWebSearch = [
    "What is the newest frontend framework?",
    "What features are added in Langchain 2.1?",
    "What companies are hiring ML interns right now?",
    "What are the latest trends in AI jobs this week?",
    "Show recent news on JavaScript frameworks"
  ]
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState([]); // [(str, str)]
  const activePlaceholders = isWebSearch ? placeholdersWebSearch : placeholders;
  const { placeholder, fadeClass } = useRotatingPlaceholder(activePlaceholders);

  // submit query to backend
  const submitQuery = async (query, webSearchSelected, clearInput) => {
    if (isLoading) return;
    setIsLoading(true);
    setContext(prev => [...prev, [query, ""]]);
    // scroll to bottom of chat history
    requestAnimationFrame(() => {
      const scrollers = document.getElementsByClassName('chat-scroll');
      if (scrollers && scrollers[0]) {
        scrollers[0].scrollTo({ top: scrollers[0].scrollHeight, behavior: 'smooth' });
      }
    });
    clearInput();

    // get response from backend
    let finalResponse = "";
    try {
      const response = await fetch("http://jobmarket-ai-backend-a6cqg6enhufkcuf0.canadacentral-01.azurewebsites.net/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, web_search: Boolean(webSearchSelected) })
      });

      if (!response.ok) {
        finalResponse = "LLM rate limit reached, please try again later";
      } else {
        const json = await response.json();
        const data = (json && typeof json === 'object') ? (json.response ?? "") : "";
        finalResponse = data === ""
          ? "No relevant data were found based on your query, please try another prompt"
          : data;
      }
    } catch (e) {
      console.error(e);
      finalResponse = "There was an error, please try again later";
    } finally {
      setContext(prev => {
        if (prev.length === 0) return prev;
        const next = prev.slice();
        const [q] = next[next.length - 1];
        next[next.length - 1] = [q, finalResponse];
        return next;
      });
      setIsLoading(false);
    }
  };

  // submit resume to backend
  const submitResume = async (file) => {
    if (!file || isLoading) return;
    const fixedQuery = "What skills am I missing that tech companies usually expect?";
    setIsLoading(true);
    setContext(prev => [...prev, [fixedQuery, ""]]);
    requestAnimationFrame(() => {
      const scrollers = document.getElementsByClassName('chat-scroll');
      if (scrollers && scrollers[0]) {
        scrollers[0].scrollTo({ top: scrollers[0].scrollHeight, behavior: 'smooth' });
      }
    });

    let finalResponse = "";
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const response = await fetch("http://jobmarket-ai-backend-a6cqg6enhufkcuf0.canadacentral-01.azurewebsites.net/upload_resume", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        finalResponse = "LLM rate limit reached, please try again later";
      } else {
        const json = await response.json();
        const data = (json && typeof json === 'object') ? (json.response ?? "") : "";
        finalResponse = data === ""
          ? "No relevant data were found based on your query, please try another prompt"
          : data;
      }
    } catch (e) {
      console.error(e);
      finalResponse = "There was an error, please try again later";
    } finally {
      setContext(prev => {
        if (prev.length === 0) return prev;
        const next = prev.slice();
        const [q] = next[next.length - 1];
        next[next.length - 1] = [q, finalResponse];
        return next;
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen px-4">
      {/* Floating Project Name */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-black text-2xl md:text-3xl font-semibold tracking-wide select-none">
        Job Market AI
      </div>
      {/* Chat History */}
      {context.length > 0 && (
        <ChatHistory context={context} />
      )}
      {/* Input Bar */}
      <InputBar
        onSubmit={submitQuery}
        isLoading={isLoading}
        placeholder={placeholder}
        fadeClass={fadeClass}
        floatingClass={context.length === 0 ? 'translate-y-[-40vh]' : 'translate-y-0'}
        onToggleWebSearch={(on) => setIsWebSearch(Boolean(on))}
        onResumeUploaded={(file) => submitResume(file)}
      />
    </div>
  )
}

export default App
