import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RentForm from "../Properties/RentForm";
import axios from "axios";
import { SnackbarProvider } from "notistack";
import { vi } from "vitest";
import { useRouter } from "next/navigation";

const mockEnqueueSnackbar = vi.fn();

vi.mock("axios");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("notistack", async () => {
  const originalNotistack = await vi.importActual("notistack");
  return {
    ...originalNotistack,
    useSnackbar: () => ({
      enqueueSnackbar: mockEnqueueSnackbar,
    }),
  };
});

describe("RentForm Component", () => {
  const mockFetchData = {
    data: [
      { _id: "1", propertyType: "House", _slug: "house" },
      { _id: "2", propertyType: "Apartment", _slug: "apartment" },
    ],
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockFetchData);
    sessionStorage.setItem("userId", "12345");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render the form with correct fields", async () => {
    render(
      <SnackbarProvider>
        <RentForm />
      </SnackbarProvider>
    );

    // Assert the title of the form is displayed
    expect(screen.getByText(/Add Property For Rent/i)).toBeInTheDocument();

    // Check if the select fields are rendered
    const propertyTypeSelect = screen.getByLabelText(/Property Type/i);
    expect(propertyTypeSelect).toBeInTheDocument();

    // Verify default loading state shows Spinner
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    // Wait for data fetch to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(5);
    });

    // After fetching data, the dropdowns should be populated
    expect(screen.getByText(/House/i)).toBeInTheDocument();
    expect(screen.getByText(/Apartment/i)).toBeInTheDocument();
  });

  it("should update form field values when input changes", async () => {
    render(
      <SnackbarProvider>
        <RentForm />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(5);
    });

    const titleInput = screen.getByLabelText(/Listing Name/i);
    fireEvent.change(titleInput, { target: { value: "Beautiful House" } });
    expect(titleInput.value).toBe("Beautiful House");
  });

  it("should submit the form when all required fields are filled", async () => {
    // Create a mock implementation of FormData
    const mockFormData = {
      append: vi.fn(),
    };

    // Spy on the global FormData constructor and return the mock object
    vi.spyOn(global, "FormData").mockImplementation(() => mockFormData);

    axios.post.mockResolvedValue({ data: { message: "Success" } });

    render(
      <SnackbarProvider>
        <RentForm />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(5);
    });

    // Simulate filling out the form fields
    fireEvent.change(screen.getByLabelText(/Listing Name/i), {
      target: { value: "Luxury Villa" },
    });
    fireEvent.change(screen.getByLabelText(/Property Condition/i), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByLabelText(/Property Type/i), {
      target: { value: "house" },
    });
    fireEvent.change(screen.getByLabelText(/Property Usage/i), {
      target: { value: "Residential" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Awesome luxury villa" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: /state/i }), {
      target: { value: "lagos" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: /lga/i }), {
      target: { value: "ikeja" },
    });

    fireEvent.change(screen.getByPlaceholderText(/neighbourhood/i), {
      target: { value: "Victoria Island" },
    });

    fireEvent.change(screen.getByLabelText(/Beds/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Baths/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "1000000" },
    });
    fireEvent.change(screen.getByLabelText(/Virtual Tour/i), {
      target: { value: "https://my.matterport.com/show/?m=virtual-tour-id" },
    });
    fireEvent.change(screen.getByLabelText(/Video/i), {
      target: { value: "https://www.youtube.com/watch?v=video-id" },
    });

    // Simulate submitting the form
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockFormData.append).toHaveBeenCalledWith("userID", "12345");
      expect(mockFormData.append).toHaveBeenCalledWith("title", "Luxury Villa");
      expect(mockFormData.append).toHaveBeenCalledWith("listingType", "house");
      expect(mockFormData.append).toHaveBeenCalledWith("state", "lagos");
      expect(mockFormData.append).toHaveBeenCalledWith("lga", "ikeja");
      expect(mockFormData.append).toHaveBeenCalledWith(
        "neighbourhood",
        "Victoria Island"
      );
      expect(mockFormData.append).toHaveBeenCalledWith("size", "500");
      expect(mockFormData.append).toHaveBeenCalledWith(
        "propertyDetails",
        "Awesome luxury villa"
      );
      expect(mockFormData.append).toHaveBeenCalledWith("NoOfBedRooms", "2");
      expect(mockFormData.append).toHaveBeenCalledWith("NoOfKitchens", "2");
      expect(mockFormData.append).toHaveBeenCalledWith("price", "1000000");
      expect(mockFormData.append).toHaveBeenCalledWith(
        "virtualTour",
        "https://my.matterport.com/show/?m=virtual-tour-id"
      );
      expect(mockFormData.append).toHaveBeenCalledWith(
        "video",
        "https://www.youtube.com/watch?v=video-id"
      );

      // More assertions based on your form fields
      expect(axios.post).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("should handle image upload and validation", async () => {
    render(
      <SnackbarProvider>
        <RentForm />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(5);
    });

    const fileInput = screen.getByLabelText(/Upload Image/i);
    const file = new File(["dummy content"], "house.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("house.jpg")).toBeInTheDocument();
    });
  });

  it("should display an error message if form submission fails", async () => {
    axios.post.mockRejectedValue({ response: { data: { message: "Error" } } });

    render(
      <SnackbarProvider>
        <RentForm />
      </SnackbarProvider>
    );

    fireEvent.submit(screen.getByTestId("rent-form"));
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        expect.stringContaining("Failed to list new property"),
        {
          variant: "error",
        }
      );
    });
  });
});
