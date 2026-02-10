function CommentList({ comments }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <div className="comment-avatar">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="comment-info">
              <h4>{comment.name}</h4>
              <span>{formatDate(comment.created_at)}</span>
            </div>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;