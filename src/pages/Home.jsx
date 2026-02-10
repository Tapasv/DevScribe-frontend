import { useState, useEffect } from 'react';
import { getPosts, getFeaturedPosts } from '../services/api';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPosts(),
      getFeaturedPosts()
    ])
      .then(([postsRes, featuredRes]) => {
        setPosts(postsRes.data.results || postsRes.data);
        setFeaturedPosts(featuredRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      {featuredPosts.length > 0 && (
        <section className="featured-section">
          <h2 className="featured-title">Featured Posts</h2>
          <div className="featured-grid">
            {featuredPosts.slice(0, 3).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="sidebar-grid">
        <div>
          <h2 className="profile-section-title">Latest Posts</h2>
          <div className="profile-posts">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

export default Home;