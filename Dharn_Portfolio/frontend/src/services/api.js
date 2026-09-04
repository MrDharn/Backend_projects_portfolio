const API_BASE = "http://localhost:3000/api/v1";

export const api = {
  // Public
  getProjects: () => fetch(`${API_BASE}/projects`).then((r) => r.json()),

  sendContact: (data) =>
    fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Auth
  loginAdmin: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then((r) => r.json()),

  // Admin Protected
  getMetrics: (token) =>
    fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()),

  createProject: (data, token) =>
    fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  deleteProject: (id, token) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()),
};
