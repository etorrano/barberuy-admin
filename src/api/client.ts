import { CreateUserPayload, User } from "@/models/user.model";
import axios from "axios";

const API_URL = "http://localhost:3000";

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);

  return response.data;
};

export const addUser = (user: CreateUserPayload) => {
  return axios.post(`${API_URL}/auth/register`, user);
};

export const getUsers = (): Promise<User[]> => {
  return axios.get(`${API_URL}/auth`);
};
