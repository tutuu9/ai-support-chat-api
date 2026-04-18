#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const TEST_USER = {
  name: process.env.TEST_USER_NAME || 'Jan Test',
  email: process.env.TEST_USER_EMAIL || 'jan.test@example.com',
  password: process.env.TEST_USER_PASSWORD || '123456',
};

const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL || '',
  password: process.env.ADMIN_PASSWORD || '',
};

let passed = 0;
let failed = 0;

function logStep(title) {
  console.log(`\n=== ${title} ===`);
}

function ok(message) {
  passed += 1;
  console.log(`✅ ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`❌ ${message}`);
}

async function request(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  return { response, data };
}

async function assertRequest(title, method, path, options, expectedStatuses) {
  logStep(title);
  const { response, data } = await request(method, path, options);

  if (expectedStatuses.includes(response.status)) {
    ok(`${method} ${path} -> ${response.status}`);
  } else {
    fail(`${method} ${path} -> expected ${expectedStatuses.join(' or ')}, got ${response.status}`);
    console.log('Response:', data);
  }

  return { response, data };
}

async function main() {
  console.log(`Testing API at: ${BASE_URL}`);

  const registerResult = await assertRequest(
    'Register test user',
    'POST',
    '/api/auth/register',
    { body: TEST_USER },
    [201, 400]
  );

  if (registerResult.response.status === 400) {
    const msg = typeof registerResult.data === 'object' ? registerResult.data?.message : registerResult.data;
    console.log(`ℹ️ Register returned 400 (this can be normal on rerun): ${msg}`);
  }

  const loginResult = await assertRequest(
    'Login test user',
    'POST',
    '/api/auth/login',
    {
      body: {
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    },
    [200]
  );

  const userToken = loginResult.data?.token;
  if (!userToken) {
    fail('User token was not returned. Stopping tests.');
    printSummary();
    process.exit(1);
  }

  await assertRequest(
    'Get current user',
    'GET',
    '/api/auth/me',
    { token: userToken },
    [200]
  );

  const createChatResult = await assertRequest(
    'Create chat',
    'POST',
    '/api/chats',
    {
      token: userToken,
      body: { title: 'Test support chat' },
    },
    [201]
  );

  const chatId = createChatResult.data?.chat?._id;
  if (!chatId) {
    fail('Chat ID was not returned. Stopping tests.');
    printSummary();
    process.exit(1);
  }

  await assertRequest(
    'Send message (should also trigger AI if enabled)',
    'POST',
    '/api/messages',
    {
      token: userToken,
      body: {
        chatId,
        text: 'Hello, I need help with my order',
      },
    },
    [201]
  );

  await assertRequest(
    'Get message history',
    'GET',
    `/api/messages/${chatId}/messages`,
    { token: userToken },
    [200]
  );

  if (ADMIN_USER.email && ADMIN_USER.password) {
    const adminLoginResult = await assertRequest(
      'Login admin user',
      'POST',
      '/api/auth/login',
      {
        body: {
          email: ADMIN_USER.email,
          password: ADMIN_USER.password,
        },
      },
      [200]
    );

    const adminToken = adminLoginResult.data?.token;

    if (adminToken) {
      await assertRequest(
        'Disable AI for chat',
        'PATCH',
        `/api/chats/${chatId}/ai-settings`,
        {
          token: adminToken,
          body: { aiEnabled: false },
        },
        [200]
      );

      await assertRequest(
        'Update global system prompt',
        'PATCH',
        '/api/ai-settings/system-prompt',
        {
          token: adminToken,
          body: {
            systemPrompt: 'You are a helpful support assistant. Keep answers short.',
          },
        },
        [200]
      );
    } else {
      fail('Admin token was not returned. Skipping admin-only tests.');
    }
  } else {
    console.log('\nℹ️ ADMIN_EMAIL / ADMIN_PASSWORD not set. Admin-only tests were skipped.');
  }

  await assertRequest(
    'Send second message',
    'POST',
    '/api/messages',
    {
      token: userToken,
      body: {
        chatId,
        text: 'Can you help me again?',
      },
    },
    [201]
  );

  printSummary();
}

function printSummary() {
  console.log('\n====================');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('====================');
}

main().catch((error) => {
  console.error('\nUnexpected script error:');
  console.error(error);
  process.exit(1);
});