import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

async function main() {
  // 1. Primary login
  const loginRes = await api.post("/api/login", {
    username: "Admin",
    password: "Zed2025",
  });
  console.log("Login response headers:", loginRes.headers); // <-- Add this line
  const setCookie = loginRes.headers["set-cookie"];
  if (!setCookie) throw new Error("No Set-Cookie header from login");
  const zedSession = setCookie.find((c) => c.startsWith("zed_session="));
  if (!zedSession) throw new Error("No zed_session cookie found");
  const cookieValue = zedSession.split(";")[0]; // zed_session=abc123securetoken

  // 2. Secondary verification
  const verifyRes = await api.post(
    "/api/verify",
    {
      username: "Admin",
      method: "secure_phrase",
      phrase: "XOCLON_SECURE_2025",
    },
    {
      headers: { Cookie: cookieValue },
    }
  );
  console.log("Secondary verification:", verifyRes.data);

  // 3. Authenticated message
  const msgRes = await api.post(
    "/api/conversations/123/messages",
    {
      content: "What is the capital of France?",
      role: "user",
    },
    {
      headers: { Cookie: cookieValue },
    }
  );
  console.log("AI response:", msgRes.data);
}

main().catch((err) => {
  console.error(err.response ? err.response.data : err);
});