import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import LoadingSpinner from '../components/LoadingSpinner';

function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
      <Link to="/" className="text-primary-600 hover:text-primary-700">
        Return to Home
      </Link>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isAuthor = user?.id === post.author.id;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          {post.category && (
            <>
              <li>
                <Link to={`/category/${post.category.slug}`} className="hover:text-primary-600">
                  {post.category.name}
                </Link>
              </li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-900 truncate">{post.title}</li>
        </ol>
      </nav>

      {/* Post Header */}
      <header className="mb-8">
        {post.category && (
          <Link 
            to={`/category/${post.category.slug}`}
            className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 hover:bg-primary-200 transition"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {post.author.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.username}</p>
                <p className="text-sm">{formatDate(post.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {post.views} views
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                {post.comment_count} comments
              </span>
            </div>
          </div>

          {isAuthor && (
            <Link
              to={`/edit-post/${post.slug}`}
              className="btn-secondary flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </Link>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full rounded-lg shadow-lg mb-8"
        />
      )}

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Comments ({post.comment_count || 0})
        </h2>

        <div className="space-y-8">
          <CommentList comments={post.comments} />
          <CommentForm postId={post.id} />
        </div>
      </div>
    </article>
  );
}

export default PostDetail;