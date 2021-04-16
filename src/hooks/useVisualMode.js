import { useState } from "react";

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (next, replace = false) => {
    setMode(next);
    const historyCopy = [...history];
    if (replace) {
      historyCopy.pop();
    }
    setHistory([...historyCopy, next])
  }

  const back = () => {
    if (history.length > 1) {
      const historyCopy = [...history];
      historyCopy.pop();
      setMode(historyCopy[historyCopy.length - 1]);
      setHistory(historyCopy);
    }
  }

  return { mode, transition, back };
};

export default useVisualMode;