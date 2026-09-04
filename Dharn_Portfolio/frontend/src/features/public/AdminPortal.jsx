import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminMetrics from './AdminMetrics';
import ProjectCrudForm from './ProjectCrudForm';
import { api } from '../../services/api';

export default function AdminPortal({ token, setToken }) {
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token) return;

    api.getMetrics(token)
      .then((data) => setMetrics(data.data))
      .catch((err) => console.error('Metrics error:', err));

    api.getProjects()
      .then((data) => setProjects(data.data || []))
      .catch((err) => console.error('Projects error:', err));
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleAddProject = async (formData) => {
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim())
    };

    try {
      const response = await api.createProject(payload, token);
      if (response.status === 'success') {
        setProjects([...projects, response.data]);
      }
    } catch (err) {
      console.error('Failed to add project:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await api.deleteProject(id, token);
      if (response.status === 'success') {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (!token) {
    return <AdminLogin setToken={setToken} />;
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <span className="text-xs text-emerald-400 uppercase tracking-widest">Authenticated Session</span>
          <h1 className="text-lg font-bold text-slate-100">System Dashboard & Management</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      <AdminMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProjectCrudForm onSave={handleAddProject} />

        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-bold text-sm text-slate-100">Active Portfolio Projects ({projects.length})</h2>
          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p._id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200">{p.title}</span>
                  <p className="text-slate-400 line-clamp-1">{p.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteProject(p._id)}
                  className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}