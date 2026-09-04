import React, { useState } from 'react';
import { api } from '../services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, msg: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: '', error: false });

    try {
      const response = await api.sendContact(formData);
      if (response.status === 'success') {
        setStatus({ loading: false, msg: 'Message sent successfully!', error: false });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, msg: response.message || 'Failed to send message', error: true });
      }
    } catch (err) {
      setStatus({ loading: false, msg: 'Network error. Please try again later.', error: true });
    }
  };

  return (
    <section className="max-w-2xl bg-slate-900/40 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Send a Message</h2>
        <p className="text-slate-400 text-sm">Directly triggers backend validation and Nodemailer services.</p>
      </div>

      {status.msg && (
        <div
          className={`p-3 rounded text-xs font-mono ${
            status.error
              ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Subject</label>
          <input
            type="text"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Message</label>
          <textarea
            required
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors"
        >
          {status.loading ? 'Dispatching Payload...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}