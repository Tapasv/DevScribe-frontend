import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getMyPosts } from '../services/api';
import PostCard from '../components/PostCard';

function Profile() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    website: '',
    location: '',
    avatar: null,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        avatar: null,
      });
    }

    getMyPosts()
      .then(res => {
        setMyPosts(res.data.results || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  if (!profile) {
    return (
      <div className="container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} />
              ) : (
                profile.username.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>
            <p className="profile-username">@{profile.username}</p>
            <span className="profile-role">
              {profile.role === 'author' ? '✍️ Author' : '📖 Reader'}
            </span>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{profile.total_posts}</div>
                <div className="profile-stat-label">Posts</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{profile.total_views}</div>
                <div className="profile-stat-label">Views</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{profile.total_comments}</div>
                <div className="profile-stat-label">Comments</div>
              </div>
            </div>

            {profile.bio && (
              <div className="profile-bio">
                <h3>Bio</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {(profile.location || profile.website) && (
              <div className="profile-info">
                {profile.location && (
                  <div className="profile-info-item">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <div className="profile-info-item">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">Website</a>
                  </div>
                )}
              </div>
            )}

            <div className="profile-actions">
              <button onClick={() => setEditing(!editing)} className="btn btn-primary btn-block">
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              {profile.role === 'author' && (
                <Link to="/create-post" className="btn btn-secondary btn-block">
                  Create New Post
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="profile-main">
          {editing ? (
            <div className="card" style={{padding: '2rem'}}>
              <h3 className="profile-section-title">Edit Profile</h3>

              {message.text && (
                <div className={message.type === 'success' ? 'form-success' : 'form-error'}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    rows="4"
                    className="form-textarea"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="profile-section-title">
                {profile.role === 'author' ? 'My Posts' : 'Activity'}
              </h3>

              {profile.role === 'author' ? (
                loading ? (
                  <p>Loading posts...</p>
                ) : myPosts.length > 0 ? (
                  <div className="profile-posts">
                    {myPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="profile-empty">
                    <p>You haven't created any posts yet.</p>
                    <Link to="/create-post" className="btn btn-primary">
                      Create Your First Post
                    </Link>
                  </div>
                )
              ) : (
                <div className="profile-empty">
                  <p>Your reading activity will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;