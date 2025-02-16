import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Chat from "./chat/Chat";

describe("App Component", () => {
  test("renders Home component on initial load", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to Anonymous Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Chat Room/i)).toBeInTheDocument();
  });

  test("renders Chat component when navigating to /chat/:roomId", () => {
    render(
      <MemoryRouter initialEntries={["/chat/12345"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<Chat />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Chat Room:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
  });
});
