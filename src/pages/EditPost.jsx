import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPost, updatePost, deletePost, getCategories } from '../services/api';

function EditPost() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    image: null,
    published: true,
  });
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    Promise.all([
      getPost(slug),
      getCategories()
    ])
      .then(([postRes, catRes]) => {
        const post = postRes.data;
        
        if (post.author.id !== user?.id) {
          navigate('/');
          return;
        }

        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category?.id || '',
          image: null,
          published: post.published,
        });
        setCurrentImage(post.image);
        const data = catRes.data.results || catRes.data;
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate('/');
      });
  }, [slug, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await updatePost(slug, formData);
      navigate(`/post/${response.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update post');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(slug);
      navigate('/profile');
    } catch (err) {
      setError('Failed to delete post');
      setShowDeleteConfirm(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h1 className="create-post-title">Edit Post</h1>

        {error && (
          <div className="form-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt *</label>
            <textarea
              required
              rows="3"
              className="form-textarea"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              maxLength="300"
            />
            <p className="char-count">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea
              required
              rows="15"
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image</label>
            {currentImage && (
              <div style={{marginBottom: '1rem'}}>
                <img src={currentImage} alt="Current" style={{width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px'}} />
                <p style={{fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem'}}>Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <label htmlFor="published">Published</label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger">
              Delete Post
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="delete-actions">
                <button onClick={handleDelete} className="btn btn-danger">
                  Yes, Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPost;