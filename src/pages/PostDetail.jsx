import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import LoadingSpinner from '../components/LoadingSpinner';

function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(slug)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!post) return (
    <div className="container-small">
      <div className="not-found">
        <h1>404</h1>
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isAuthor = user?.id === post.author.id;

  return (
    <article className="post-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        {post.category && (
          <>
            <Link to={`/category/${post.category.slug}`}>{post.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span>{post.title}</span>
      </nav>

      <header className="post-detail-header">
        {post.category && (
          <Link to={`/category/${post.category.slug}`} className="post-category">
            {post.category.name}
          </Link>
        )}

        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          <div className="post-author">
            <div className="post-author-avatar">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="post-author-info">
              <span className="post-author-name">{post.author.username}</span>
              <span className="post-author-date">{formatDate(post.created_at)}</span>
            </div>
          </div>

          <div className="post-detail-stats">
            <span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {post.views} views
            </span>
            <span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {post.comment_count} comments
            </span>
          </div>

          {isAuthor && (
            <Link to={`/edit-post/${post.slug}`} className="btn btn-secondary post-edit-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </Link>
          )}
        </div>
      </header>

      {post.image && (
        <img src={post.image} alt={post.title} className="post-detail-image" />
      )}

      <div className="post-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="comments-section">
        <h2 className="comments-title">Comments ({post.comment_count || 0})</h2>
        <CommentList comments={post.comments} />
        <CommentForm postId={post.id} />
      </div>
    </article>
  );
}

export default PostDetail;