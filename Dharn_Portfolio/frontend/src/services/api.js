const axios = require("axios");

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

module.exports = API