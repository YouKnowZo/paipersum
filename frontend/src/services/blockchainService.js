import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/blockchain';

const verifyDocument = async (documentId, documentHash) => {
  const response = await axios.post(`${API_URL}/verify`, { documentId, documentHash });
  return response.data;
};

const getVerificationStatus = async (documentId) => {
  const response = await axios.get(`${API_URL}/status/${documentId}`);
  return response.data;
};

const blockchainService = {
  verifyDocument,
  getVerificationStatus,
};

export default blockchainService;
