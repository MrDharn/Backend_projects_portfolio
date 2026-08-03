import React, { useState, useEffect } from 'react';

const ProjectsSection = ({ apiBaseUrl }) => {
  const [projects, setProjects] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const [projectsRes, featuredRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects`),
          fetch(`${apiBaseUrl}/api/projects/featured`)
        ]);

        const projectsData = await projectsRes.json();
        const featuredData = await featuredRes.json();

        setProjects(projectsData.data || []);
        setFeatured(featuredData.data || []);
      } catch (err) {
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [apiBaseUrl]);

  const displayedProjects = activeTab === 'featured' ? featured : projects;

  return (
    <section className="section-container">
      <div className="section-header flex-between">
        <div>
          <h2 className="section-title">Backend Systems & APIs</h2>
          <p className="section-subtitle">Production-ready API architectures and database designs.</p>
        </div>

        {/* Filter Tabs */}
        <div className="tab-group">
          <button
            onClick={() => setActiveTab('featured')}
            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
          >
            Featured ({featured.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Projects ({projects.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading API Projects...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="projects-grid">
          {displayedProjects.map((project) => (
            <div key={project._id || project.id} className="project-card">
              <div className="card-top">
                <div className="card-badges">
                  <span className="badge-tag">{project.category || 'REST API'}</span>
                  {project.isFeatured && <span className="featured-star">★ Featured</span>}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {/* Tech Badges */}
                {project.technologies && (
                  <div className="tech-pills">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-pill">{tech}</span>
                    ))}
                  </div>
                )}

                {/* API Endpoints Block */}
                {project.endpoints && project.endpoints.length > 0 && (
                  <div className="endpoint-box">
                    <p className="endpoint-heading">Key Endpoints:</p>
                    {project.endpoints.map((ep, idx) => (
                      <div key={idx} className="endpoint-row">
                        <span className="http-method">{ep.method}</span>
                        <span className="endpoint-path">{ep.path}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-actions">
                {project.postmanUrl && (
                  <a href={project.postmanUrl} target="_blank" rel="noreferrer" className="link-primary">
                    Postman Docs &rarr;
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="link-secondary">
                    GitHub Repo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;