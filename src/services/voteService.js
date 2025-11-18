import axios from 'axios';
import { ENDPOINTS, getAuthHeaders } from '../config/apiConfig';

export const submitVote = async (candidatId, token, options = {}) => {
  const { isNullVote = false } = options;
  if (!token) {
    return { success: false, message: 'Token manquant. Veuillez vous reconnecter.' };
  }

  try {
    const payload = isNullVote
      ? { is_null_vote: true }
      : { candidat_id: candidatId };

    const voteResponse = await axios.post(
      ENDPOINTS.vote,
      payload,
      { headers: getAuthHeaders(token) },
    );

    const statsResponse = await axios.get(ENDPOINTS.voteStats, {
      headers: getAuthHeaders(token),
    });

    return {
      success: true,
      vote: voteResponse.data?.vote,
      message: voteResponse.data?.message ?? 'Vote enregistré',
      total_votes: statsResponse.data?.total_votes,
      null_votes: statsResponse.data?.null_votes ?? 0,
      candidates: statsResponse.data?.candidates ?? [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message ?? 'Erreur inconnue',
    };
  }
};

export const fetchVoteStats = async () => {
  const response = await axios.get(ENDPOINTS.voteStats);
  return response.data;
};

