import axios from "axios";

//register(formData)
export const register = async (data) =>
  await axios.post("http://localhost:5432/register", data);

//login(formData)
export const login = async (formData) =>
  await axios.post("http://localhost:5432/login", formData);

//currentUser(localStorage.getItem("token"));
export const currentUser = async (token) =>
  await axios.get("http://localhost:5432/getProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentAdmin(localStorage.getItem("token"));
export const currentAdmin = async (token) =>
  await axios.post("http://localhost:5432/currentAdmin",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentInspector(localStorage.getItem("token"));
export const currentInspector = async (token) =>
  await axios.post("http://localhost:5432/currentInspector",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentSuperior(localStorage.getItem("token"));
export const currentSuperior = async (token) =>
  await axios.post("http://localhost:5432/currentSuperior",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//updateUser(userData,localStorage.getItem("token"))
export const updateUser = async (userData, token) =>
  await axios.put("http://localhost:5432/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
