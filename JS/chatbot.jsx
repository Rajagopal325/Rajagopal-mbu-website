const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggle");
const onloadToggle = document.querySelector(".onload-toggle");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;  
const inputInitHeight = chatInput.scrollHeight;
const API_KEY =
  "AIzaSyCKZ3CMROXXQUpWDoH6dSR3fRzfRU99Ytk"; //1c3ce17a91cb4f07b076219e2a734006
//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
//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
//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
// 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

const createChatLi = (message, classname) => {
  // Create a chat <li> element with passed message and className
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

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; //https://api.openai.com/v1/chat/completions
  const messageElement = incomingChatLi.querySelector("p");
  const personal = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ "role": "system", "content": userMessage },
        {"role": "user" , "content" : userMessage},
      ],
    })
  };

  //Send POST request to API ,get reponse
  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data  => {
        messageElement.textContent =data.choices[0].message.content;
    })
    .catch((error) => {
      // if(personal === "Hello" || "Hi" || "Hlo" || "hello" || "hlo" || "hi" || "hello lucky" || "Hello lucky"){
      //   messageElement.textContent = "Hello! How can i help you...";
      // }
      messageElement.classList.add("error");
      messageElement.textContent ="Oops ! Something went wrong . Please try again!. API is not supporting or Account de-ac";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));

  };

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //    append the user message with the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0,chatbox.scrollHeight);

  setTimeout(() => {
    // Display Thinking... while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600 /* Time : 1000 = 1sec, 2000= 2sec ...*/);
};

chatInput.addEventListener("input", () => {
  // Adjust textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {

  //If enter key is pressed without shift key and the window width is greater than 800px, handle the chat
   if (e.key === "Enter" && !e.ShiftKey){
    e.preventDefault();
    handleChat();
   }
});

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);

onloadToggle.addEventListener("load", (event1) =>document.body.classList.add("show-chatbot"));
onload = (event1) => document.body.classList.toggle("show-chatbot");


