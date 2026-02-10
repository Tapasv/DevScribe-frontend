import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByCategory, getCategory } from '../services/api';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function CategoryPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPostsByCategory(slug),
      getCategory(slug)
    ])
      .then(([postsRes, categoryRes]) => {
        setPosts(postsRes.data.results || postsRes.data);
        setCategory(categoryRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="category-header">
        <h1 className="category-title">{category?.name || slug}</h1>
        {category?.description && (
          <p className="category-description">{category.description}</p>
        )}
        <p className="category-post-count">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <div className="sidebar-grid">
        <div>
          {posts.length > 0 ? (
            <div className="profile-posts">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="profile-empty">
              <p>No posts found in this category.</p>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

export default CategoryPage;