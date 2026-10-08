import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { renderWithProviders, stateWith } from "../../../test-utils";
import * as userSlice from "../states/userSlice";

vi.mock("../states/userSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchUsers: vi.fn(() => ({ type: "users/fetchUsers" })),
  };
});

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan spinner saat loading", () => {
    const { container } = renderWithProviders(<UsersPage />, {
      preloadedState: stateWith({ users: { loading: true, users: [] } }),
    });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("menampilkan daftar pengguna dengan dan tanpa avatar kustom", () => {
    const users = [
      { id: 1, name: "Ali", email: "ali@del.ac.id", avatar: "http://ali.png" },
      { id: 2, name: "Budi", email: "budi@del.ac.id", avatar: null },
    ];
    renderWithProviders(<UsersPage />, {
      preloadedState: stateWith({ users: { loading: false, users } }),
    });
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(userSlice.fetchUsers).toHaveBeenCalled();
  });
});
