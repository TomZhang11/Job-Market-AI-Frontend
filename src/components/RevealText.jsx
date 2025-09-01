import { useEffect, useState } from "react";

// reveals 1 char at a time in the msg box

export default function RevealText({ text }) {
  const [visibleCount, setVisibleCount] = useState(0);

  // timer that reveals 1 char
  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;
    const total = text.length;
    const maxDurationMs = 2000;
    const minPerCharMs = 8;
    const perCharMs = Math.max(
      minPerCharMs,
      Math.min(30, Math.floor(maxDurationMs / Math.max(1, total)))
    );

    const interval = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= total) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, perCharMs);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{text ? text.slice(0, visibleCount) : ""}</span>;
}
