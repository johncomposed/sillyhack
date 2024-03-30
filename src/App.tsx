import clsx from "clsx";
import { Conversation, VapiButton, vapi } from "./features/Assistant";
import { useVapi, CALL_STATUS } from "./features/Assistant";
import { useEffect, useRef, useState } from "react";

const thinkingEmoji = '🙄'
const defaultEmoji = '🙂'
const openEmoji = "😮"
const closeEmoji = "😐"

const emojiMap = {
  "😮": ["o", "e"],
  "😐": ["b", "p", "m", " "],
  "🙂": ["c", "g", "j", "k", "n", "r", "s", "t", "v", "x", "z"],
  "😲": ["d", "l"],
  "😯": ["q", "u", "w", "y"],
  "😀": ["a", "i"]
};

const charEmojiMap = Object.entries(emojiMap).reduce((charMap, [emoji, chars]) => {
  chars.forEach(char => {
    charMap[char] = emoji;
  })
  return charMap
}, {
  '': defaultEmoji
} as Record<string, string>)

export const toEmoji = (char: string = '') => {
  return charEmojiMap[char.toLowerCase()]
};

function useTimeout(callback: () => void, delay: number | null) {
  const timeoutRef = useRef<number | null>(null);
  const savedCallback =  useRef<() => void>(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => {if (timeoutRef.current) window.clearTimeout(timeoutRef.current);}
    }
  }, [delay]);
  return timeoutRef;
};


function useInterval(callback: () => void, delay: number | null) {
  const intervalRef = useRef<number | null>(null);
  const savedCallback = useRef<() => void>(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => { if (savedCallback.current) savedCallback.current(); }
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(tick, delay);
      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
    }
  }, [delay]);

  return intervalRef;
}

const shadowN = 6
const textShadow = [
  `-${shadowN}px -${shadowN}px 0 #000,`,
  `${shadowN}px -${shadowN}px 0 #000,`,
  `-${shadowN}px ${shadowN}px 0 #000,`,
  `${shadowN}px ${shadowN}px 0 #000,`,
  `${shadowN + 2}px ${shadowN + 5}px 0px black`
].join(' ')



function getRandomBetween(min:number, max:number) {
  return Math.random() * (max - min) + min;
}

function App() {
  const [randomStop, setRandomStop] = useState<number|null>(null)
  const { isSpeechActive, toggleCall, messages, callStatus, activeTranscript, isMuted, toggleMute, audioLevel } = useVapi();
  const assistantMessages = messages.filter(m => m.role === "assistant");
  const [emoji, setEmoji] = useState(defaultEmoji)
  const activeButNotTalking = callStatus === CALL_STATUS.ACTIVE && !isSpeechActive;

  // useEffect(() => {
  //   const muted = isMuted();
  //   // if (muted || callStatus!== CALL_STATUS.ACTIVE || )
  //   setRandomStop(getRandomBetween(4000, 7000));
  // }, [callStatus, isSpeechActive])


  useInterval(() => {
    setEmoji(emoji === closeEmoji ? openEmoji : closeEmoji);
  }, isSpeechActive ? 150 : null)

  useInterval(() => {
    setEmoji(emoji === defaultEmoji ? (getRandomBetween(0,4) > 3 ? thinkingEmoji : defaultEmoji) : defaultEmoji);
  }, activeButNotTalking ? 2000 : null)

  return (
    <main className="flex h-screen relative flex-col items-center justify-center">
      <div className={clsx("emoji", {
        'animate': isSpeechActive
      })} style={{textShadow, fontSize: 300, filter: 'hue-rotate(220deg)'}}>
        {emoji}
      </div>
      <div
        id="card-footer"
        className="flex justify-center absolute bottom-0 left-0 right-0 py-4"
      >
        <VapiButton
          audioLevel={audioLevel}
          callStatus={callStatus}
          toggleCall={toggleCall}
        />
      </div>
    </main>
  );
}

export default App;
