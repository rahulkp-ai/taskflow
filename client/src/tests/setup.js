// import "@testing-library/jest-dom";
// import { vi } from "vitest";

// // Mock react-router-dom
// vi.mock("react-router-dom", async () => {
//   const actual = await vi.importActual("react-router-dom");
//   return {
//     ...actual,
//     useNavigate: () => vi.fn(),
//     useParams: () => ({}),
//     useLocation: () => ({ pathname: "/" }),
//   };
// });

// // Mock sonner toasts
// vi.mock("sonner", () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//     info: vi.fn(),
//   },
//   Toaster: () => null,
// }));

// // Suppress console.error noise in tests
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (args[0]?.includes?.("Warning:")) return;
//     originalError(...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });

import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll } from "vitest";

// Mock ResizeObserver for Headless UI components (Dialog/Transition)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: "/" }),
  };
});

// Mock sonner toasts
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

// Suppress console.error noise in tests (specifically React act warnings)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.("Warning:")) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});