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

    // Fetch user's posts
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.username} className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>
              <p className="text-gray-600">@{profile.username}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                profile.role === 'author' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {profile.role === 'author' ? '✍️ Author' : '📖 Reader'}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Posts</span>
                <span className="font-bold text-gray-900">{profile.total_posts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Views</span>
                <span className="font-bold text-gray-900">{profile.total_views}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Comments</span>
                <span className="font-bold text-gray-900">{profile.total_comments}</span>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-700 text-sm">{profile.bio}</p>
              </div>
            )}

            {profile.location && (
              <div className="mt-4 flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {profile.location}
              </div>
            )}

            {profile.website && (
              <div className="mt-2">
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Website
                </a>
              </div>
            )}

            <button
              onClick={() => setEditing(!editing)}
              className="btn-primary w-full mt-6"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>

            {profile.role === 'author' && (
              <Link to="/create-post" className="btn-secondary w-full mt-2">
                Create New Post
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {editing ? (
            <div className="card p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    className="input-field"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="input-field"
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {profile.role === 'author' ? 'My Posts' : 'Activity'}
              </h3>

              {profile.role === 'author' ? (
                loading ? (
                  <p>Loading posts...</p>
                ) : myPosts.length > 0 ? (
                  <div className="space-y-6">
                    {myPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
                    <Link to="/create-post" className="btn-primary inline-block">
                      Create Your First Post
                    </Link>
                  </div>
                )
              ) : (
                <div className="card p-12 text-center">
                  <p className="text-gray-600">Your reading activity will appear here.</p>
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