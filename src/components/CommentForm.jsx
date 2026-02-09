import { useState } from 'react';
import { createComment } from '../services/api';

function CommentForm({ postId, onCommentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await createComment({ ...formData, post: postId });
      setStatus({ 
        type: 'success', 
        message: 'Comment submitted successfully! It will appear after approval.' 
      });
      setFormData({ name: '', email: '', content: '' });
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Error submitting comment. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            className="input-field"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Comment *
          </label>
          <textarea
            id="content"
            rows="5"
            className="input-field"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      {status.message && (
        <div className={`mt-4 p-4 rounded-lg ${
          status.type === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default CommentForm;