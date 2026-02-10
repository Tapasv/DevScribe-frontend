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
    <div className="comment-form">
      <h3>Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Comment *</label>
          <textarea
            id="content"
            rows="5"
            className="form-textarea"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      {status.message && (
        <div className={status.type === 'success' ? 'form-success' : 'form-error'}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default CommentForm;