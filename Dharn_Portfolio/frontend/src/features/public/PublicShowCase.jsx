import React, { useState, useEffect } from 'react';
import ProjectCard from '../../components/ProjectCard';
import ContactForm from '../../components/ContactForm';
import { api } from '../../services/api';

export default function PublicShowcase() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects()
      .then((data) => setProjects(data.data || []))
      .catch((err) => console.error('Failed to load projects:', err));
  }, []);

  const handleResumeDownload = () => {
    const apiBase = `${import.meta.env.VITE_API_BASE_URL}/api/v1` || 'http://localhost:3000/api/v1';
    window.open(`${apiBase}/resume`, '_blank');
  };

  return (
    <div className="space-y-16">
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono text-xs">
          <span>Available for Backend & Systems Roles and Internship</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Engineering Expandable Infrastructures & Fault-Tolerant APIs
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Backend Specialist focused on Node.js, Express, MongoDB, and distributed systems. I build secure, maintainable microservices and high-efficiency backend pipelines.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleResumeDownload}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors font-mono text-sm"
          >
            Download Resume
          </button>
          <a
            href="#projects"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium rounded-lg transition-colors text-sm"
          >
            Explore Projects
          </a>
        </div>
      </section>

      <section id="projects" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-100">Featured Architecture & Systems</h2>
          <p className="text-slate-400 text-sm">Real-world applications and backend engineering projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj._id} project={proj} />
          ))}
        </div>
      </section>

      <ContactForm />
    </div>
  );
}