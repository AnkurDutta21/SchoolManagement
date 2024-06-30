import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, setItemsPerPage }) => {

  const handlePageSizeChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    onPageChange(1);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <span className="mr-2 text-sm">Rows per page:</span>
        <select
          onChange={handlePageSizeChange}
          className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>
      <div>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 focus:outline-none focus:bg-gray-400 mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
