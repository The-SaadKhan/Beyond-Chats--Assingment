import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const articleService = {
  // Get all articles
  getAllArticles: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/articles`, { params });
    return response.data;
  },

  // Get single article
  getArticle: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  },

  // Get enhanced version of article
  getEnhancedArticle: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}/enhanced`);
    return response.data;
  },

  // Create article
  createArticle: async (articleData) => {
    const response = await axios.post(`${API_BASE_URL}/articles`, articleData);
    return response.data;
  },

  // Update article
  updateArticle: async (id, articleData) => {
    const response = await axios.put(`${API_BASE_URL}/articles/${id}`, articleData);
    return response.data;
  },

  // Delete article
  deleteArticle: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  }
};
