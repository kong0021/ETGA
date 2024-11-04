import React, { useState } from 'react';
import { sendMessageToChatbot } from "../api";
import '../styles/Chatbot.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'AI Chatbot',
      content: 'Hi, I am your AI Chatbot, you can ask me anything.',
      type: 'received',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Function to format the bot's message and replace **text** with <b> tags and each point to a new line
  const formatMessage = (messageContent) => {
    // Replace double asterisks with <b> tags and add new lines with <br> or <li> tags
    const formattedContent = messageContent
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Replace **text** with <b>text</b>
      .replace(/(\d\.\s+)/g, '<br>$1');        // Add line breaks before each numbered point
    return { __html: formattedContent };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user's message to the chat
    const updatedMessages = [...messages, { sender: 'You', content: inputMessage, type: 'sent' }];
    setMessages(updatedMessages);

    // Send message to Django API
    try {
      const data = await sendMessageToChatbot(inputMessage);
      // Add the chatbot's response to the chat
      setMessages([...updatedMessages, { sender: 'AI Chatbot', content: data.response, type: 'received' }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }

    // Clear the input field
    setInputMessage('');
  };

  return (
    <div className="chat-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card flex-grow-1">
        <div className="card-header bg-primary text-white">Chat</div>
        <div className="card-body messages-box" style={{ flex: 1, overflowY: 'auto' }}>
          <ul className="list-unstyled messages-list" style={{ paddingLeft: 0 }}>
            {messages.map((message, index) => (
              <li
                key={index}
                className={`message ${message.type}`}
                style={{ marginBottom: '15px', listStyle: 'none' }}
              >
                <div className="message-text" style={{ padding: '10px', borderRadius: '5px', backgroundColor: message.type === 'sent' ? '#dcf8c6' : '#f1f0f0' }}>
                  <div className="message-sender">
                    <b>{message.sender}</b>
                  </div>
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={formatMessage(message.content)}  // Use this to render formatted HTML
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <form className="message-form" onSubmit={handleSubmit} style={{ display: 'flex', position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px', backgroundColor: '#f8f9fa' }}>
        <div className="input-group" style={{ display: 'flex', flex: 1 }}>
          <input
            type="text"
            className="form-control message-input"
            style={{ flex: 1, borderRadius: 0, borderRight: 'none' }}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-primary btn-send" style={{ borderRadius: 0 }}>
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;