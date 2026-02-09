function CommentList({ comments }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h4 className="font-semibold text-gray-900">{comment.name}</h4>
              <p className="text-sm text-gray-600">{formatDate(comment.created_at)}</p>
            </div>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;