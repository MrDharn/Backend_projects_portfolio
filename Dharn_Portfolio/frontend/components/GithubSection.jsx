import React, { useState, useEffect } from 'react';

const GithubSection = ({ apiBaseUrl }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/github/repos`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiBaseUrl]);

  return (
    <section className="section-container border-top">
      <h2 className="section-title">Live GitHub Repositories</h2>

      {loading ? (
        <p className="loading-state">Fetching live repository data...</p>
      ) : (
        <div className="repos-grid">
          {repos.map((repo) => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-card">
              <div>
                <h4 className="repo-name">{repo.name}</h4>
                <p className="repo-desc">{repo.description || 'No description available'}</p>
              </div>
              
              <div className="repo-meta">
                <span>{repo.language || 'Code'}</span>
                <div className="repo-stats">
                  <span>★ {repo.stargazers_count}</span>
                  <span>⌥ {repo.forks_count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default GithubSection;