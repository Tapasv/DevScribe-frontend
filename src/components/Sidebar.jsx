import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getPopularPosts } from '../services/api';

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    getCategories()
      .then(res => {
        const data = res.data.results || res.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));

    getPopularPosts()
      .then(res => {
        const data = res.data.results || res.data;
        setPopularPosts(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Categories</h3>
        <ul className="space-y-2">
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  to={`/category/${cat.slug}`}
                  className="flex items-center justify-between text-gray-700 hover:text-primary-600 transition"
                >
                  <span>{cat.name}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {cat.post_count}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No categories yet</li>
          )}
        </ul>
      </div>

      {/* Popular Posts */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Popular Posts</h3>
        <ul className="space-y-4">
          {popularPosts && popularPosts.length > 0 ? (
            popularPosts.map(post => (
              <li key={post.id}>
                <Link 
                  to={`/post/${post.slug}`}
                  className="flex space-x-3 group"
                >
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {post.views} views
                    </p>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No popular posts yet</li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;