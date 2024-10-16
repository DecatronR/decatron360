import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Registration from "../Register/RegistrationForm";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";
import axios from "axios";
import { vi } from "vitest";

// Mocking the necessary modules
const baseUrl = process.env.BASE_URL;
const mockEnqueueSnackbar = vi.fn();

vi.mock("axios");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockRouter = { replace: vi.fn() };
useRouter.mockReturnValue(mockRouter);

vi.mock("notistack", async () => {
  const originalNotistack = await vi.importActual("notistack");
  return {
    ...originalNotistack,
    useSnackbar: () => ({
      enqueueSnackbar: mockEnqueueSnackbar,
    }),
  };
});

describe("Registration Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields correctly", () => {
    render(
      <SnackbarProvider>
        <Registration />
      </SnackbarProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("allows user to fill in the form fields", () => {
    render(
      <SnackbarProvider>
        <Registration />
      </SnackbarProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "buyer" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByLabelText(/role/i)).toHaveValue("buyer");
    expect(screen.getByLabelText("Password")).toHaveValue("password123");
    expect(screen.getByLabelText("Confirm Password")).toHaveValue(
      "password123"
    );
  });

  it("submits the form and registers successfully", async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <SnackbarProvider>
        <Registration />
      </SnackbarProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "buyer" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/auth/otp");
    });
    expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/auth/register`, {
      name: "John Doe",
      email: "john@example.com",
      role: "buyer",
      phone: "08063247818",
      password: "password123",
      confirmpassword: "password123",
    });
  });

  it("shows error if registration fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Registration failed"));

    render(
      <SnackbarProvider>
        <Registration />
      </SnackbarProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "buyer" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        expect.stringContaining("Registration failed"),
        {
          variant: "error",
        }
      );
    });
  });
});
