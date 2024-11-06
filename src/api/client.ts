import { CreateSalesPointPayload, SalesPoint } from "@/models/salespoint.model";
import { CreateUserPayload, User } from "@/models/user.model";
import { CreateWorkshiftPayload, Workshift } from "@/models/workshift.model";
import axios from "axios";

const API_URL = "http://localhost:3000";

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);

  return response.data;
};

export const addUser = (user: CreateUserPayload) => {
  return axios.post(`${API_URL}/auth/register`, user);
};

export const editUser = (id: string | undefined, user: CreateUserPayload) => {
  return axios.patch(`${API_URL}/auth/${id}`, user);
};

export const deleteUser = (id: string | undefined) => {
  return axios.delete(`${API_URL}/auth/${id}`);
};

export const getUsers = (): Promise<User[]> => {
  return axios.get(`${API_URL}/auth`);
};

export const addWorkshift = (workshift: CreateWorkshiftPayload) => {
  return axios.post(`${API_URL}/workshifts`, workshift);
};

export const editWorkshift = (
  id: string | undefined,
  workshift: CreateWorkshiftPayload
) => {
  return axios.patch(`${API_URL}/workshifts/${id}`, workshift);
};

export const getWorkshifts = (): Promise<Workshift[]> => {
  return axios.get(`${API_URL}/workshifts`);
};

export const deleteWorkshift = (id: string | undefined) => {
  return axios.delete(`${API_URL}/workshifts/${id}`);
};

export const addSalesPoint = (salespoint: CreateSalesPointPayload) => {
  return axios.post(`${API_URL}/salespoints`, salespoint);
};

export const editSalesPoint = (
  id: string | undefined,
  salespoint: CreateSalesPointPayload
) => {
  return axios.patch(`${API_URL}/salespoints/${id}`, salespoint);
};

export const getSalesPoints = (): Promise<SalesPoint[]> => {
  return axios.get(`${API_URL}/salespoints`);
};

export const deleteSalesPoint = (id: string | undefined) => {
  return axios.delete(`${API_URL}/salespoints/${id}`);
};
