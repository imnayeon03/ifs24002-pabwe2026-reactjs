import { beforeEach, expect, it, vi } from "vitest";
import {
  fetchUsers,
  getUsers,
  fetchMe,
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updatePassword,
} from "./userApi";
import { callApi } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ callApi: vi.fn().mockResolvedValue({ ok: true }) }));
beforeEach(() => vi.clearAllMocks());

it("fetchUsers -> GET /users", async () => {
  await fetchUsers();
  expect(callApi).toHaveBeenCalledWith("/users", { method: "GET" });
  expect(getUsers).toBe(fetchUsers);
});

it("fetchMe -> GET /users/me", async () => {
  await fetchMe();
  expect(callApi).toHaveBeenCalledWith("/users/me", { method: "GET" });
  expect(getProfile).toBe(fetchMe);
});

it("updateProfile -> PUT /users/me", async () => {
  await updateProfile({ name: "Budi" });
  expect(callApi).toHaveBeenCalledWith("/users/me", { method: "PUT", body: { name: "Budi" } });
});

it("updateProfilePhoto -> POST /users/me/photo with formData", async () => {
  const file = new File(["dummy"], "photo.png", { type: "image/png" });
  await updateProfilePhoto(file);
  expect(callApi).toHaveBeenCalledWith("/users/me/photo", {
    method: "POST",
    form: expect.any(FormData),
  });
});

it("updatePassword -> PUT /users/me/password", async () => {
  await updatePassword({ old_password: "1", new_password: "2" });
  expect(callApi).toHaveBeenCalledWith("/users/me/password", {
    method: "PUT",
    body: { old_password: "1", new_password: "2" },
  });
});
