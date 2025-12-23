import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://vizuara-ml-assignment.onrender.com/';

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData);
  return response.data;
};

export const getEDA = async (filename, target_column) => {
  const response = await axios.post(`${API_URL}/eda`, { filename, target_column });
  return response.data;
};

export const runPipeline = async (config) => {
  const response = await axios.post(`${API_URL}/run_pipeline`, config);
  return response.data;
};
