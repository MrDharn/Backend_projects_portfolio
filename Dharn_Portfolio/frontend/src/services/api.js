const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// 1. Contact Route -> POST /contact
export const sendContactMessage = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit contact message');
  }
  return data;
};

// 2. GitHub Route -> GET /github
export const getGithubRepositories = async () => {
  const response = await fetch(`${API_BASE_URL}/github`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch repositories');
  return data;
};

// 3. Project Routes -> GET /projects & GET /projects/feature
export const getProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch projects');
  return data;
};

export const getFeaturedProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects/feature`); // Matches projectRoute.route('/feature')
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch featured projects');
  return data;
};

// 4. Resume Route -> GET /resume
export const downloadResumeFile = async () => {
  const response = await fetch(`${API_BASE_URL}/resume`);
  if (!response.ok) throw new Error('Resume download failed');

  // Handle binary PDF blob download
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'Daniel_resume.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};