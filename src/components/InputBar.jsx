import { useRef, useState } from "react";
import fileSvg from "../assets/file.svg";
import globeSvg from "../assets/globe.svg";

export default function InputBar({ onSubmit, isLoading, placeholder, fadeClass, floatingClass, onToggleWebSearch, onResumeUploaded }) {
  const pRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [webSearchSelected, setWebSearchSelected] = useState(false);

  // focus inpput bar
  const handleClick = () => {
    pRef.current?.focus();
  };

  // submit to backend, use onSubmit function from parent
  const submit = () => {
    const query = pRef.current?.textContent?.trim() ?? "";
    if (!query) return;
    onSubmit(query, webSearchSelected, () => {
      if (pRef.current) pRef.current.textContent = "";
      setIsEmpty(true);
      setWebSearchSelected(false);
    });
  };

  // enter is pressed for input bar
  const handleKeyDown = (e) => {
    // if loading, do nothing
    if (isLoading && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      return;
    }
    // if enter, submit to backend
    if (e.key === "Enter") {
      // if shift is pressed, newline
      if (e.shiftKey) {
        document.execCommand("insertLineBreak");
        e.preventDefault();
        return;
      }
      e.preventDefault();
      submit();
    }
  };

  // wrapper for submit to prevent form submission to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  // when input bar changes, modify isEmpty state
  const handleInput = () => {
    const content = pRef.current?.textContent ?? "";
    setIsEmpty(content === "" || content === "\n");
  };

  return (
    <div className={`absolute left-1/2 bottom-6 -translate-x-1/2 w-full max-w-2xl px-4 transition-transform duration-700 ease-in-out ${floatingClass}`}>
      <form
        className="relative flex items-center w-full min-h-14 border border-gray-300 rounded-[28px] text-gray-500 cursor-text"
        onClick={handleClick}
        onSubmit={handleSubmit}
      >
        {/* Always-mounted hidden file input for resume uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            if (onResumeUploaded) onResumeUploaded(file);
            if (e.target) e.target.value = "";
          }}
        />
        <div className="relative ml-2 mr-2">
          {/* options area */}
          {showOptions && (
            <div className="absolute bottom-full mb-2 left-0 inline-flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm w-max z-10">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 whitespace-nowrap w-max hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                  setShowOptions(false);
                }}
              >
                <img src={fileSvg} alt="" className="w-4 h-4" />
                <span className="text-black">Upload resume</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 whitespace-nowrap w-max hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setWebSearchSelected((v) => {
                    const next = !v;
                    if (onToggleWebSearch) onToggleWebSearch(next);
                    return next;
                  });
                  setShowOptions(false);
                }}
                aria-pressed={webSearchSelected}
              >
                <img src={globeSvg} alt="" className="w-4 h-4" />
                <span className={webSearchSelected ? "text-blue-600" : "text-black"}>Web search</span>
              </button>
            </div>
          )}
          {/* show options button */}
          <button
            type="button"
            className="bg-transparent text-black text-3xl font-thin rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Open agent options"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions((v) => !v);
            }}
          >
            +
          </button>
        </div>
        {/* placeholder */}
        {isEmpty && (
          <span className={`absolute left-12 text-gray-400 pointer-events-none transition-opacity duration-300 ${fadeClass}`}>
            {placeholder}
          </span>
        )}
        {/* input bar */}
        <p
          ref={pRef}
          className="ml-0 outline-none text-gray-900 min-h-[1.5em] flex-1 py-4 whitespace-pre-wrap break-words min-w-0"
          contentEditable="plaintext-only"
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          style={{
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          }}
        ></p>
        {/* submit button */}
        <button
          type="submit"
          className="bg-black rounded-full w-8 h-8 flex items-center justify-center text-white ml-auto mr-2 cursor-pointer shrink-0"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
