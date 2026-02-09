import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary inline-block">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;