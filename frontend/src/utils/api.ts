import axios from 'axios';

const API_URL = "https://task-manager-mern-assessment.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (title: string) => {
  const response = await api.post('/tasks', { title });
  return response.data;
};

export const updateTask = async (id: number, isCompleted: boolean) => {
  const response = await api.put(`/tasks/${id}`, { isCompleted });
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

// Update task title
export const editTaskTitle = async (id: number, newTitle: string) => {
  const response = await api.put(`/tasks/${id}`, { title: newTitle });
  return response.data;
};