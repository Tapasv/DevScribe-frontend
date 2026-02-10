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
    <aside className="sidebar">
      <div className="sidebar-widget">
        <h3>Categories</h3>
        <ul>
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`}>
                  <span>{cat.name}</span>
                  <span className="category-count">{cat.post_count}</span>
                </Link>
              </li>
            ))
          ) : (
            <li>No categories yet</li>
          )}
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3>Popular Posts</h3>
        {popularPosts && popularPosts.length > 0 ? (
          popularPosts.map(post => (
            <div key={post.id} className="popular-post">
              {post.image && (
                <img src={post.image} alt={post.title} className="popular-post-image" />
              )}
              <div className="popular-post-content">
                <Link to={`/post/${post.slug}`}>
                  <h4 className="popular-post-title">{post.title}</h4>
                </Link>
                <p className="popular-post-views">{post.views} views</p>
              </div>
            </div>
          ))
        ) : (
          <p>No popular posts yet</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;