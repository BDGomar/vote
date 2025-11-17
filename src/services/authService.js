import axios from 'axios';
import { ENDPOINTS, defaultHeaders, getAuthHeaders } from '../config/apiConfig';

const handleRequest = async (request) => {
  try {
    const response = await request;
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status ?? 500,
      data: error.response?.data ?? { message: 'Erreur serveur inattendue' },
    };
  }
};

export const login = (matricule, password) =>
  handleRequest(
    axios.post(
      ENDPOINTS.login,
      { matricule, password },
      { headers: defaultHeaders },
    ),
  );

export const register = (matricule, password, passwordConfirmation) =>
  handleRequest(
    axios.post(
      ENDPOINTS.register,
      { matricule, password, password_confirmation: passwordConfirmation },
      { headers: defaultHeaders },
    ),
  );

export const logout = (token) =>
  handleRequest(
    axios.post(ENDPOINTS.logout, null, {
      headers: getAuthHeaders(token),
    }),
  );

export const getCurrentUser = (token) =>
  handleRequest(
    axios.get(ENDPOINTS.profile, {
      headers: getAuthHeaders(token),
    }),
  );

