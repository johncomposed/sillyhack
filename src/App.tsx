import clsx from "clsx";
import { Conversation, VapiButton, vapi } from "./features/Assistant";
import { useVapi, CALL_STATUS } from "./features/Assistant";
import { useEffect, useRef, useState } from "react";



const thinkingEmoji = '🙄'
const defaultEmoji = '🙂'
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


function Character(props: {latestMessage: string, callStatus: CALL_STATUS}) {
  const {latestMessage, callStatus} = props;
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    console.log('updated msg', latestMessage)
    setMsgIndex(latestMessage.length);
  }, [latestMessage])

  const char = latestMessage[latestMessage.length - msgIndex]||'';
  const emoji = toEmoji(char) || thinkingEmoji;

  // console.log(char, emoji);

  useInterval(() => {
    setMsgIndex(Math.max(msgIndex-1, 0))
  }, msgIndex > 0 ? 75 : null)

  // function onMessage(msg: any) {
  //   const conversation = msg.conversation || [];
  //   const isUpdate = msg.type === "conversation-update";
  //   if (!isUpdate || !conversation.length) return;
  //   const lastMsg = conversation.slice(-1)[0];

  //   if (lastMsg.role === 'assistant' && lastMsg.content !== latestMsg) {
  //     // console.log('M: ', msg)
  //     setLatest(lastMsg.content);
  //     setMsgIndex(lastMsg.content.length);
  //   }
  // };

  // useEffect(() => {
  //   vapi.on("message", onMessage);
  //   return () => {
  //     vapi.off("message", onMessage);
  //   };
  // });


  return (
    <div className={clsx("emoji", {
      'wave-hand': callStatus === CALL_STATUS.ACTIVE
    })} style={{textShadow, fontSize: 300, filter: 'hue-rotate(220deg)'}}>
      {emoji}
    </div>
  )
}


function getRandomBetween(min:number, max:number) {
  return Math.random() * (max - min) + min;
}

function App() {
  const [randomStop, setRandomStop] = useState(getRandomBetween(4000, 7000))
  const { toggleCall, messages, callStatus, activeTranscript, isMuted, toggleMute, audioLevel } = useVapi();
  const assistantMessages = messages.filter(m => m.role === "assistant");

  useEffect(() => {
    console.log(messages)
    setRandomStop(getRandomBetween(4000, 7000));
  }, [assistantMessages.length])


  useTimeout(() => {
    console.log('TIMEOUT', randomStop);
    if (!isMuted()) toggleMute(true);
  }, randomStop)


  return (
    <main className="flex h-screen relative flex-col items-center justify-center">
      <Character latestMessage={assistantMessages.slice(-1)[0]?.content || ''} callStatus={callStatus} />
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
