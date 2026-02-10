import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    role: 'reader',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      navigate('/');
    } else {
      setErrors(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        {errors.non_field_errors && (
          <div className="form-error">{errors.non_field_errors}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">First Name *</label>
              <input
                id="first_name"
                type="text"
                required
                className="form-input"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              {errors.first_name && <p className="form-error">{errors.first_name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">Last Name *</label>
              <input
                id="last_name"
                type="text"
                required
                className="form-input"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              {errors.last_name && <p className="form-error">{errors.last_name}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username *</label>
            <input
              id="username"
              type="text"
              required
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password *</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="form-label">Confirm Password *</label>
            <input
              id="password2"
              type="password"
              required
              className="form-input"
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            />
            {errors.password2 && <p className="form-error">{errors.password2}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">I want to register as *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="reader"
                  name="role"
                  value="reader"
                  checked={formData.role === 'reader'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <label htmlFor="reader">
                  <strong>Reader</strong>
                  <span>I want to read and comment on posts</span>
                </label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="author"
                  name="role"
                  value="author"
                  checked={formData.role === 'author'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <label htmlFor="author">
                  <strong>Author</strong>
                  <span>I want to publish my own posts</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;