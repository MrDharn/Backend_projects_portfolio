import React, { useState } from 'react';

const ContactAndResume = ({ apiBaseUrl }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to send message');

      setStatus({ loading: false, success: 'Message sent successfully! Check your inbox for confirmation.', error: null });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  };

  const handleResumeDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/resume/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Daniel_resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download resume. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="section-container border-top">
      <div className="contact-grid">
        
        {/* Info & Resume Column */}
        <div className="contact-info">
          <h2 className="section-title">Work with Daniel</h2>
          <p className="contact-desc">
            Looking for a backend engineer to design REST APIs, set up WebSockets, or manage database schemas? Download my resume or send a message directly.
          </p>

          <button onClick={handleResumeDownload} disabled={downloading} className="btn btn-secondary">
            {downloading ? 'Preparing Download...' : '📄 Download Daniel\'s Resume'}
          </button>
        </div>

        {/* Form Column */}
        <div className="form-card">
          <h3 className="form-title">Send a Message</h3>

          {status.success && <div className="alert alert-success">{status.success}</div>}
          {status.error && <div className="alert alert-error">{status.error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="4"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={status.loading} className="btn btn-primary">
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactAndResume;