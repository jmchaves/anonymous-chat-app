import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get the current domain dynamically
  const BASE_URL = window.location.origin;
  const API_URL = `${BASE_URL.replace(":3001", "").replace(":3000", "").replace(/^https/, 'http')}:3000`;

  const createRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/create-room`);
      const data: { roomId: string } = await res.json();
      setRoomId(data.roomId);
    } catch (error) {
      console.error("Error creating room:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 style={{marginBottom: "10px"}}>Welcome to Anonymous Chat</h2>
      <button onClick={createRoom} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Creating..." : "Create Chat Room"}
      </button>

      {roomId && (
        <div style={{ marginTop: "20px" }}>
          <p>Share this link with a friend:</p>
          <input
            type="text"
            value={`${BASE_URL}/chat/${roomId}`}
            readOnly
            style={{ width: "300px", padding: "5px" }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(`${BASE_URL}/chat/${roomId}`)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            Copy
          </button>
          <button
            onClick={() => navigate(`/chat/${roomId}`)}
            style={{ marginLeft: "10px", padding: "5px", marginTop: "5px" }}
          >
            Enter Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
