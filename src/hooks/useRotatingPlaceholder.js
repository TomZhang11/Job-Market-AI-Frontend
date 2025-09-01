import { useEffect, useState } from "react";

// the rotating text in the placeholder of the input bar

export default function useRotatingPlaceholder(items, intervalMs = 4000, fadeMs = 200) {
  const [index, setIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  // timer that rotates the text in the placeholder
  useEffect(() => {
    const t = setInterval(() => {
      setFadeClass("opacity-0");
      const to = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setFadeClass("opacity-100");
      }, fadeMs);
      return () => clearTimeout(to);
    }, intervalMs);

    return () => clearInterval(t);
  }, [items.length, intervalMs, fadeMs]);

  return { placeholder: items[index], fadeClass };
}
