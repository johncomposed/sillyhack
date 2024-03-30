import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const characterAssistant: CreateAssistantDTO = {
  name: "Ashley",
   // How many seconds of silence to wait before ending the call. 10-600 Defaults to 30.
  silenceTimeoutSeconds: 600,
  // The minimum number of seconds after user speech to wait before the assistant starts speaking. 0-2 Defaults to 0.4.
  responseDelaySeconds: 0.1,
  // The number of words to wait for before interrupting the assistant. Words like "stop", "actually", "no", etc. will always interrupt immediately regardless of this value. Words like "okay", "yeah", "right" will never interrupt. 1-10 Defaults to 2.
  numWordsToInterruptAssistant: 10,
  model: {
    model: 'mixtral-8x7b-32768',
    provider: 'groq',
    temperature: 0.7,
    maxTokens: 60,
    messages: [
      {
        content: [
          `I'm trying to make a very good first impression to someone, but you're there to undermine, interrupt me, and disagree with what I say.`,
          `You are sarcastic, and aggressive. You have no respect for me and interrupt me quickly when I'm speaking.`,
          `Do not address me. You should always address your comments to my audience, not me.`,
          `Make sure the third party knows that when I speak, I am full of shit and not worthy of their time.`, 
          `If you're not sure what to comment on, make up an embarrassing fact about me.`
        ].join(' '),
        role: 'system',
      },
      {
        content: `What is this guy trying to say this time?`,
        role: 'assistant'
      }
    ],
    functions: [],
  },
  voice: {
    provider: "11labs",
    voiceId: "y6LBjsAZlsXBg7O8pN91", // alex?
  },
};
