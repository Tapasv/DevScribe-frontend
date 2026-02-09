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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category?.name || slug}
        </h1>
        {category?.description && (
          <p className="text-lg text-gray-600">{category.description}</p>
        )}
        <p className="text-gray-600 mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No posts found in this category.</p>
            </div>
          )}
        </div>

        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;