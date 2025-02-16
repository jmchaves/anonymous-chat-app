import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

// Mock `navigator.clipboard.writeText`
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock Fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ roomId: "test-room-id" }),
  })
) as jest.Mock;

// Mock useNavigate to avoid real navigation
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  // Add other components or hooks as needed for your tests
}));

describe("Home Component", () => {
  test("renders the welcome message and button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to Anonymous Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Chat Room/i)).toBeInTheDocument();
  });

  test("creates a room and displays the room link", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const button = screen.getByText(/Create Chat Room/i);
    fireEvent.click(button);

    // Wait for the room ID to be set
    await waitFor(() => expect(screen.getByText(/Share this link with a friend:/i)).toBeInTheDocument());

    // Check if room link is displayed
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toContain("/chat/test-room-id");
  });

  test("copies the room link to clipboard when 'Copy' is clicked", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const button = screen.getByText(/Create Chat Room/i);
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/Share this link with a friend:/i)).toBeInTheDocument());

    const copyButton = screen.getByText(/Copy/i);
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("/chat/test-room-id"));
  });

  test("navigates to chat when 'Enter Chat' is clicked", async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => jest.fn(),
      // Add other components or hooks as needed for your tests
    }));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const button = screen.getByText(/Create Chat Room/i);
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/Share this link with a friend:/i)).toBeInTheDocument());

    const enterChatButton = screen.getByText(/Enter Chat/i);
    fireEvent.click(enterChatButton);

    expect(mockNavigate).toHaveBeenCalledWith("/chat/test-room-id");
  });
});
