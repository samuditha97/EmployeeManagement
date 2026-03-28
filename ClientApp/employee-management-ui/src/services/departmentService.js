import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/department`

export const getDepartments = () => axios.get(API_URL);
export const getDepartmentById = (id) => axios.get(`${API_URL}/${id}`);
export const addDepartment = (data) => axios.post(API_URL, data);
export const updateDepartment = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteDepartment = (id) => axios.delete(`${API_URL}/${id}`);