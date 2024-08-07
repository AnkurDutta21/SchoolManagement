import React from 'react';
import { FaEdit, FaTrash, FaEye, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import Pagination from '../Pagination';

const DynamicTable = ({
  data,
  fields,
  onEdit,
  onDelete,
  onView,
  showView,
  currentPage,
  totalPages,
  onPageChange,
  setItemsPerPage,
  sortField,
  sortOrder,
  onSortChange
}) => {

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
        <thead className="bg-gray-50">
          <tr>
            {fields.map((field, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSortChange(field.field || field)}
              >
                {field.label || field}
                {sortField === (field.field || field) && (
                  sortOrder === 'asc' ? <FaSortAlphaUp className="inline ml-2" /> : <FaSortAlphaDown className="inline ml-2" />
                )}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={fields.length + 1} className="px-6 py-4 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id}>
                {fields.map((field, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    {getFieldValue(item, field.field || field)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {showView && (
                    <button
                      onClick={() => onView(item._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View"
                    >
                      <FaEye />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item._id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-2"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default DynamicTable;
