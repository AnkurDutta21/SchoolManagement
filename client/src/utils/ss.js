import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';

const DynamicTable = () => {
  const [teachersData, setTeachersData] = useState({
    teachers: [],
    totalPages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`/api/teachers?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await response.json();
      setTeachersData(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Handle error state or retry logic
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchTeachers(pageNumber);
  };

  const getFieldValue = (item, field) => {
    const keys = field.split('.');
    let value = item;
  
    for (let key of keys) {
      value = value[key];
    }
    if (field === 'dob') {
      return formatDate(value);
    }
  
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table headers */}
        <thead className="bg-gray-50">
          <tr>
            {/* Render your table headers based on fields */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            {/* Add other headers as needed */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {teachersData.teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.name}
              </td>
              {/* Render other fields dynamically */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onView(teacher._id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onEdit(teacher._id)}
                  className="text-yellow-600 hover:text-yellow-900 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(teacher._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(teachersData.currentPage - 1)}
            disabled={teachersData.currentPage === 1}
            className={`px-3 py-1 mr-2 ${teachersData.currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'} rounded`}
          >
            Previous
          </button>
          {/* Next page button */}
          <button
            onClick={() => handlePageChange(teachersData.currentPage + 1)}
            disabled={teachersData.currentPage === teachersData.totalPages}
            className={`px-3 py-1 ${teachersData.currentPage === teachersData.totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'} rounded`}
          >
            Next
          </button>
        </div>
        {/* Page info */}
        <div className="text-gray-500">
          Page {teachersData.currentPage} of {teachersData.totalPages}
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
