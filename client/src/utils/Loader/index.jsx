import React from 'react';
import loader from '../../assets/loader.gif'

const Loader = () => {
  return (
  <div className="fixed top-20 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-100">
      <img src={loader} alt="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default Loader;