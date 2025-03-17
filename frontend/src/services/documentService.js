import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/documents';

const uploadDocument = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getDocuments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const documentService = {
  uploadDocument,
  getDocuments,
};

export default documentService;
