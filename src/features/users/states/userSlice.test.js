import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import userReducer, {
  fetchUsers,
  isProfile,
  isChangeProfile,
  isChangeProfilePhoto,
  isChangeProfilePassword,
  setProfile,
  clearProfile,
  setUsers,
} from "./userSlice";
import defaultReducer from "./reducer";
import { isAuthLogout } from "../../auth/states/reducer";
import * as userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("userSlice", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: { users: userReducer },
    });
  });

  it("reducer.js re-exports userReducer", () => {
    expect(defaultReducer).toBe(userReducer);
  });

  it("synchronous actions update state correctly", () => {
    store.dispatch(setProfile({ id: 1, name: "Budi" }));
    expect(store.getState().users.profile).toEqual({ id: 1, name: "Budi" });

    store.dispatch(setUsers([{ id: 1 }]));
    expect(store.getState().users.users).toEqual([{ id: 1 }]);

    store.dispatch(clearProfile());
    expect(store.getState().users.profile).toBeNull();

    store.dispatch(isAuthLogout());
    expect(store.getState().users).toEqual({
      users: [],
      profile: null,
      loading: false,
      error: null,
    });
  });

  describe("fetchUsers thunk", () => {
    it("sukses memuat daftar pengguna", async () => {
      userApi.fetchUsers.mockResolvedValue({ data: { users: [{ id: 1, name: "User 1" }] } });
      await store.dispatch(fetchUsers());
      expect(store.getState().users.users).toEqual([{ id: 1, name: "User 1" }]);
      expect(store.getState().users.loading).toBe(false);
    });

    it("gagal memuat daftar pengguna", async () => {
      userApi.fetchUsers.mockRejectedValue(new Error("Network error"));
      await store.dispatch(fetchUsers());
      expect(showErrorDialog).toHaveBeenCalledWith("Network error");
      expect(store.getState().users.error).toBe("Network error");
      expect(store.getState().users.loading).toBe(false);
    });
  });

  describe("isProfile thunk", () => {
    it("sukses memuat profil", async () => {
      userApi.fetchMe.mockResolvedValue({ data: { user: { id: 2, name: "Siti" } } });
      await store.dispatch(isProfile());
      expect(store.getState().users.profile).toEqual({ id: 2, name: "Siti" });
    });

    it("gagal memuat profil", async () => {
      userApi.fetchMe.mockRejectedValue(new Error("Gagal profil"));
      await store.dispatch(isProfile());
      expect(store.getState().users.error).toBe("Gagal profil");
    });
  });

  describe("isChangeProfile thunk", () => {
    it("sukses memperbarui profil", async () => {
      userApi.updateProfile.mockResolvedValue({ data: { ok: true } });
      userApi.fetchMe.mockResolvedValue({ data: { user: { id: 1, name: "Baru" } } });
      await store.dispatch(isChangeProfile({ name: "Baru" }));
      expect(showSuccessDialog).toHaveBeenCalledWith("Profil berhasil diperbarui!");
      expect(store.getState().users.loading).toBe(false);
    });

    it("gagal memperbarui profil", async () => {
      userApi.updateProfile.mockRejectedValue(new Error("Gagal update"));
      await store.dispatch(isChangeProfile({ name: "Baru" }));
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal update");
      expect(store.getState().users.loading).toBe(false);
    });
  });

  describe("isChangeProfilePhoto thunk", () => {
    it("sukses memperbarui foto profil", async () => {
      userApi.updateProfilePhoto.mockResolvedValue({ status: true, data: {} });
      userApi.fetchMe.mockResolvedValue({ data: { user: { id: 1 } } });
      await store.dispatch(isChangeProfilePhoto(new File([], "p.jpg")));
      expect(showSuccessDialog).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");
      expect(store.getState().users.loading).toBe(false);
    });

    it("gagal saat status false dengan pesan error", async () => {
      userApi.updateProfilePhoto.mockResolvedValue({ status: false, message: "Foto terlalu besar" });
      await store.dispatch(isChangeProfilePhoto(new File([], "p.jpg")));
      expect(showErrorDialog).toHaveBeenCalledWith("Foto terlalu besar");
      expect(store.getState().users.loading).toBe(false);
    });

    it("gagal saat API melempar exception", async () => {
      userApi.updateProfilePhoto.mockRejectedValue(new Error("Upload fail"));
      await store.dispatch(isChangeProfilePhoto(new File([], "p.jpg")));
      expect(showErrorDialog).toHaveBeenCalledWith("Upload fail");
      expect(store.getState().users.loading).toBe(false);
    });
  });

  describe("isChangeProfilePassword thunk", () => {
    it("sukses memperbarui password", async () => {
      userApi.updatePassword.mockResolvedValue({ data: {} });
      await store.dispatch(isChangeProfilePassword({ old_password: "a", new_password: "b" }));
      expect(showSuccessDialog).toHaveBeenCalledWith("Password berhasil diubah!");
      expect(store.getState().users.loading).toBe(false);
    });

    it("gagal memperbarui password", async () => {
      userApi.updatePassword.mockRejectedValue(new Error("Password lama salah"));
      await store.dispatch(isChangeProfilePassword({ old_password: "a", new_password: "b" }));
      expect(showErrorDialog).toHaveBeenCalledWith("Password lama salah");
      expect(store.getState().users.loading).toBe(false);
    });
  });
});
