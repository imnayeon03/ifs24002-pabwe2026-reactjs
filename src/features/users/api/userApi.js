// src/features/users/api/userApi.js
import { callApi } from "../../../helpers/apiHelper";

export const fetchUsers = () => callApi("/users", { method: "GET" });
export const getUsers = fetchUsers;

export const fetchMe = () => callApi("/users/me", { method: "GET" });
export const getProfile = fetchMe;

export const updateProfile = (data) =>
  callApi("/users/me", { method: "PUT", body: data });

export const updateProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return callApi("/users/me/photo", { method: "POST", form: formData });
};

export const updatePassword = (data) =>
  callApi("/users/me/password", { method: "PUT", body: data });