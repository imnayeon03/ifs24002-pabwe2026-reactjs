import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./ProfilePage";
import { renderWithProviders, stateWith } from "../../../test-utils";
import * as userSlice from "../states/userSlice";

vi.mock("../states/userSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isProfile: vi.fn(() => ({ type: "users/isProfile" })),
    isChangeProfile: vi.fn(() => ({ type: "users/isChangeProfile" })),
    isChangeProfilePhoto: vi.fn(() => ({ type: "users/isChangeProfilePhoto" })),
    isChangeProfilePassword: vi.fn(() => ({ type: "users/isChangeProfilePassword" })),
  };
});

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan loading saat profil belum tersedia", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: stateWith({ users: { profile: null } }),
    });
    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("menampilkan data profil dan submit update profile", async () => {
    const profile = { id: 1, name: "Budi", email: "budi@del.ac.id", avatar: "http://photo.jpg" };
    renderWithProviders(<ProfilePage />, {
      preloadedState: stateWith({ users: { profile } }),
    });

    expect(screen.getByLabelText("Nama Lengkap")).toHaveValue("Budi");
    expect(screen.getByLabelText("Email")).toHaveValue("budi@del.ac.id");

    await userEvent.clear(screen.getByLabelText("Nama Lengkap"));
    await userEvent.type(screen.getByLabelText("Nama Lengkap"), "Budi Baru");
    await userEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    expect(userSlice.isChangeProfile).toHaveBeenCalledWith({
      name: "Budi Baru",
      email: "budi@del.ac.id",
    });
  });

  it("mengirim form ubah password", async () => {
    const profile = { id: 1, name: "Budi", email: "budi@del.ac.id" };
    renderWithProviders(<ProfilePage />, {
      preloadedState: stateWith({ users: { profile } }),
    });

    await userEvent.type(screen.getByLabelText("Password Lama"), "oldPass");
    await userEvent.type(screen.getByLabelText("Password Baru"), "newPass");
    await userEvent.click(screen.getByRole("button", { name: "Perbarui Password" }));

    expect(userSlice.isChangeProfilePassword).toHaveBeenCalledWith({
      old_password: "oldPass",
      new_password: "newPass",
    });
    expect(screen.getByLabelText("Password Lama")).toHaveValue("");
    expect(screen.getByLabelText("Password Baru")).toHaveValue("");
  });

  it("mengunggah foto profil dan mengabaikan saat dibatalkan", async () => {
    const profile = { id: 1, name: "Budi", email: "budi@del.ac.id" };
    const { container } = renderWithProviders(<ProfilePage />, {
      preloadedState: stateWith({ users: { profile } }),
    });

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["dummy"], "photo.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);
    expect(userSlice.isChangeProfilePhoto).toHaveBeenCalledWith(file);

    userSlice.isChangeProfilePhoto.mockClear();
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(userSlice.isChangeProfilePhoto).not.toHaveBeenCalled();
  });
});
