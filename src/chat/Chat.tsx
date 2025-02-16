import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import './Chat.css';
import { Message } from '../types/message';

const Chat: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy link");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }

  const onClickCopyLink = () => {
    setCopyButtonText("Copied!");
    navigator.clipboard.writeText(`${BASE_URL}/chat/${roomId}`);
    setTimeout(() => {
      setCopyButtonText("Copy link");
    }, 3000);
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  // Dynamically determine the WebSocket URL
  const BASE_URL = window.location.origin;
  const WS_PROTOCOL = BASE_URL.startsWith("https") ? "wss" : "ws";
  const WS_URL = `${WS_PROTOCOL}://${BASE_URL.replace(/^https?:\/\//, "").replace(/:\d+$/, "")}:3000?room=${roomId}`;

  useEffect(() => {
    console.log(`Connecting to WebSocket: ${WS_URL}`);

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.warn("WebSocket closed. Reconnecting...");
      setTimeout(() => {
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
          ws.current = new WebSocket(WS_URL);
        }
      }, 3000); // Reconnect after 3 seconds
    };

    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
          ws.current?.close();
        } else if (data.message) {
          setMessages((prev) => [...prev, {text: data.message, isMine: false}]);
        }
      } catch (error) {
        console.error("Invalid JSON received:", event.data);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [WS_URL]);

  const sendMessage = () => {
    if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(input));
      setMessages((prev) => [...prev, {text: input, isMine: true}]);
      setInput("");
    }
  };

  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> Anonymous Chat - 
            <a href="#" onClick={() => onClickCopyLink()}> {copyButtonText}</a> - 
            <a href={`/`}> Create chat room</a>
          </div>
          <div className="msger-header-options">
            <span><i className="fas fa-cog"></i></span>
          </div>
        </header>

        <main className="msger-chat" ref={messagesEndRef}>

          {messages.map((msg, index) => (
            <div className={msg.isMine ? "msg right-msg" : "msg left-msg"} key={index}>
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-time">12:45</div>
              </div>

              <div className="msg-text">
                { msg.text }
              </div>
            </div>
          </div>
          ))}

        </main>

        <form className="msger-inputarea">
          <input type="text" className="msger-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your message..." />
          <button type="button" onClick={sendMessage} className="msger-send-btn">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
