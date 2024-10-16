import "@testing-library/jest-dom";
global.URL.createObjectURL = vi.fn(() => "mocked-url");
