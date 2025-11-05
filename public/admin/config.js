// config.js
// Automatically detect whether running locally or on Render
const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://restaurant-management-system-k8tg.onrender.com';
