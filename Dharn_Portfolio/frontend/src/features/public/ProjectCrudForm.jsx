import React, { useState } from 'react';

export default function ProjectCrudForm({ onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github: '',
    demo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ title: '', description: '', technologies: '', github: '', demo: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 text-xs font-mono">
      <h2 className="font-bold text-sm text-slate-100">Add New Project</h2>
      <div>
        <label className="block text-slate-400 mb-1">Project Title</label>
        <input
          type="text"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Description</label>
        <textarea
          required
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Technologies (comma-separated)</label>
        <input
          type="text"
          placeholder="Node.js, Express, MongoDB"
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-slate-400 mb-1">GitHub Repository</label>
          <input
            type="url"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Live Demo URL</label>
          <input
            type="url"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={formData.demo}
            onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors"
      >
        Save & Publish Project
      </button>
    </form>
  );
}