import React from 'react';

export default function ProjectCard({ project }) {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-100">{project.title}</h3>
        {project.downloadCount > 0 && (
          <span className="font-mono text-xs text-slate-500">
            Downloads: {project.downloadCount}
          </span>
        )}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.technologies?.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2 font-mono text-xs">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            Source Code →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}