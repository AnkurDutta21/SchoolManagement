import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';

const DynamicTable = ({ data, fields, onEdit, onDelete, onView, showView }) => {
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              {fields.map((field, index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap">
                  {getFieldValue(item, field)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {showView && (
                  <button
                    onClick={() => onView(item._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <FaEye />
                  </button>
                )}
                <button
                  onClick={() => onEdit(item._id)}
                  className="text-yellow-600 hover:text-yellow-900 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
