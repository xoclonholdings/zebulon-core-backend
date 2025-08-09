// Automated test for /chat endpoint
const http = require('http');

function postChat(message, cb) {
  const data = JSON.stringify({ message });
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const req = http.request(options, res => {
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        cb(null, json);
      } catch (e) {
        cb(new Error('Invalid JSON response: ' + body));
      }
    });
  });
  req.on('error', error => cb(error));
  req.write(data);
  req.end();
}

function logStep(step, prompt, reply) {
  console.log(`\n[${step}]`);
  console.log('Prompt:', prompt);
  console.log('Zed:', reply);
}

// Test sustained conversation
const prompts = [
  'Hello, Zed!',
  'Can you remember what I just said?',
  'Tell me a joke.',
  'What can you do?',
  'Goodbye!'
];

function runTest(i, prevRes) {
  if (i >= prompts.length) {
    console.log('\n✅ 5-turn sustained conversation test passed!');
    process.exit(0);
  }
  postChat(prompts[i], (err, res) => {
    logStep(i + 1, prompts[i], res && res.reply);
    if (err || !res.reply) {
      console.error(`❌ Test failed at turn ${i + 1}`, err || res);
      process.exit(1);
    }
    runTest(i + 1, res);
  });
}

runTest(0);
