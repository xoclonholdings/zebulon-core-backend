// Zebulon conversation integration
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;

async function runConversation() {
  const messages = [
    "Hello Zed!",
    "What is the capital of Ghana?",
    "Can you summarize our conversation so far?",
    "Give me a step-by-step guide to making tea.",
    "Thank you!"
  ];
  let passed = true;
  for (let i = 0; i < messages.length; i++) {
    const res = await fetch(`${BASE_URL}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messages[i], mode: 'agent' })
    });
    if (!res.ok) {
      console.error(`❌ Request failed for message ${i+1}:`, messages[i]);
      passed = false;
      continue;
    }
    const data = await res.json();
    if (!data.message || typeof data.message !== 'string') {
      console.error(`❌ Invalid response for message ${i+1}:`, data);
      passed = false;
    } else if (
      data.message.startsWith('[ZED Error]') ||
      data.message.includes('server is working correctly') ||
      data.message.toLowerCase().includes('you said')
    ) {
      console.error(`❌ AI did not answer for message ${i+1}:`, data.message);
      passed = false;
    } else {
      console.log(`✅ [${i+1}]`, data.message);
    }
  }
  if (passed) {
  // All conversation checks passed
    process.exit(0);
  } else {
  // Some conversation checks failed
    process.exit(1);
  }
}

runConversation();
