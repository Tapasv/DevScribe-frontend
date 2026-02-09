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
        
        // Check if user is the author
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
        setCategories(catRes.data);
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              required
              rows="3"
              className="input-field"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              maxLength="300"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              required
              rows="15"
              className="input-field"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="input-field"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            {currentImage && (
              <div className="mb-2">
                <img src={currentImage} alt="Current" className="w-48 h-32 object-cover rounded" />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Published
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Delete Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Delete Post
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 mb-4">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
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