import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="text-xl mt-4">Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:underline block mt-4">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
