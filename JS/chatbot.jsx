// Select DOM elements
const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggle");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;


// Auto open chatbot on page load
// window.addEventListener("load", () => {
//   document.body.classList.add("show-chatbot");
// });

// Your Google API Key
const API_KEY = "AIzaSyCKZ3CMROXXQUpWDoH6dSR3fRzfRU99Ytk"; // 🔑 Replace with your Gemini API key

// Create chat <li> element
const createChatLi = (message, classname) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", classname);

  let chatContent =
    classname === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Generate response from Google Gemini API
const generateResponse = async (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      requestOptions
    );

    const data = await res.json();
    console.log("API Response:", data);

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.content?.[0]?.text) {
      messageElement.textContent = data.candidates[0].content[0].text;
    } else {
      messageElement.textContent = "⚠️ No response from API.";
    }
  } catch (error) {
    console.error(error);
    messageElement.classList.add("error");
    messageElement.textContent =
      "❌ Something went wrong. Check API key or request format.";
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

// Handle sending chat
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Reset input
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user message
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Show "Thinking..." and call API
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 500);
};

// Adjust textarea height
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Send chat on Enter key
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

// Toggle chatbot visibility
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);


