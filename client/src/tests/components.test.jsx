import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Button from "../components/Button";
import Textbox from "../components/Textbox";
import Title from "../components/Title";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {
  formatDate,
  dateTimeAgo,
  getInitials,
  PRIORITY_STYLES,
  TASK_TYPE,
} from "../utils";

// ─── UTILITY FUNCTION TESTS ──────────────────────────────────────────────────

describe("Utility: getInitials", () => {
  test("returns initials from a full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  test("returns one initial for single name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  test("handles empty string", () => {
    expect(getInitials("")).toBe("");
  });

  test("handles undefined", () => {
    expect(getInitials()).toBe("");
  });

  test("only uses first two words", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});

describe("Utility: formatDate", () => {
  test("formats a valid date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });

  test("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  test("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });
});

describe("Utility: dateTimeAgo", () => {
  test("returns 'Just now' for very recent dates", () => {
    const result = dateTimeAgo(new Date().toISOString());
    expect(result).toBe("Just now");
  });

  test("returns empty string for null", () => {
    expect(dateTimeAgo(null)).toBe("");
  });

  test("returns hours ago for older dates", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = dateTimeAgo(twoHoursAgo);
    expect(result).toContain("h ago");
  });
});

describe("Utility: PRIORITY_STYLES", () => {
  test("has styles for all priority levels", () => {
    expect(PRIORITY_STYLES.high).toBeTruthy();
    expect(PRIORITY_STYLES.medium).toBeTruthy();
    expect(PRIORITY_STYLES.normal).toBeTruthy();
    expect(PRIORITY_STYLES.low).toBeTruthy();
  });
});

describe("Utility: TASK_TYPE", () => {
  test("has classes for all stages", () => {
    expect(TASK_TYPE.todo).toBeTruthy();
    expect(TASK_TYPE["in progress"]).toBeTruthy();
    expect(TASK_TYPE.completed).toBeTruthy();
  });
});

// ─── COMPONENT TESTS ─────────────────────────────────────────────────────────

describe("Component: Title", () => {
  test("renders title text", () => {
    render(<Title title="My Dashboard" />);
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Title title="Test" className="custom-class" />);
    const titleElement = screen.getByText("Test");
    expect(titleElement).toBeInTheDocument();
  });
});

describe("Component: Button", () => {
  test("renders label correctly", () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button label="Disabled" onClick={onClick} disabled />);
    const button = screen.getByText("Disabled");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("shows spinner when loading", () => {
    render(<Button label="Load" loading />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("renders with type submit", () => {
    render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});

describe("Component: Textbox", () => {
  test("renders with label", () => {
    render(<Textbox label="Email" name="email" register={{}} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  test("renders input with placeholder", () => {
    render(<Textbox placeholder="Enter email" name="email" register={{}} />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  test("shows error message", () => {
    render(<Textbox name="email" register={{}} error="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("renders password input type", () => {
    render(<Textbox type="password" name="password" register={{}} />);
    // Passwords don't have role="textbox", so we query by type attribute
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeTruthy();
    expect(input).toHaveAttribute("name", "password");
  });
});

describe("Component: ConfirmationDialog", () => {
  test("does not render when closed", () => {
    render(
      <ConfirmationDialog
        open={false}
        setOpen={vi.fn()}
        onClick={vi.fn()}
        msg="Delete this?"
      />
    );
    expect(screen.queryByText("Delete this?")).not.toBeInTheDocument();
  });

  test("renders when open", () => {
    render(
      <ConfirmationDialog
        open={true}
        setOpen={vi.fn()}
        onClick={vi.fn()}
        msg="Are you sure?"
      />
    );
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  test("calls onClick when confirm button clicked", () => {
    const onClick = vi.fn();
    render(
      <ConfirmationDialog
        open={true}
        setOpen={vi.fn()}
        onClick={onClick}
        msg="Confirm?"
      />
    );
    // Specifically target the button to avoid matching text in the 'msg' prop
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(onClick).toHaveBeenCalled();
  });

  test("calls setOpen(false) when cancel clicked", () => {
    const setOpen = vi.fn();
    render(
      <ConfirmationDialog
        open={true}
        setOpen={setOpen}
        onClick={vi.fn()}
        msg="Cancel?"
      />
    );
    // Specifically target the button role to avoid ambiguity with the message text
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});