import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/employee`;

export const getEmployees = (pageNumber = 1, pageSize = 10) =>
  axios.get(`${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
export const getEmployeeById = (id) => axios.get(`${API_URL}/${id}`);
export const addEmployee = (data) => axios.post(API_URL, data);
export const updateEmployee = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);