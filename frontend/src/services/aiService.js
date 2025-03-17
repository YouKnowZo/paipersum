import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/ai';

const getAISummary = async (documentId) => {
  const response = await axios.get(`${API_URL}/summary/${documentId}`);
  return response.data;
};

const aiService = {
  getAISummary,
};

export default aiService;
