import axios from 'axios';
import { ENDPOINTS } from '../config/apiConfig';

export const fetchCandidats = async () => {
  const response = await axios.get(ENDPOINTS.candidats);
  return response.data?.data ?? [];
};

export const fetchCandidatById = async (id) => {
  const response = await axios.get(`${ENDPOINTS.candidats}/${id}`);
  return response.data?.data;
};

