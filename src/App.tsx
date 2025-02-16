import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Chat from "./chat/Chat";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page (Main Landing Page) */}
        <Route path="/" element={<Home />} />

        {/* Chat Room Page */}
        <Route path="/chat/:roomId" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
