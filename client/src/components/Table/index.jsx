import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const DynamicTable = ({ data, fields, onEdit, onDelete, onView }) => {
  return (
    <div>
      <h2>Table</h2>
      <table>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {fields.map((field, index) => (
                <td key={index}>
                  {getFieldValue(item, field)}
                </td>
              ))}
              <td>
                <button onClick={() => onView(item._id)}>
                  <FaEye />
                </button>
                <button onClick={() => onEdit(item._id)}>
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(item._id)}>
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

const getFieldValue = (item, field) => {
  const keys = field.split('.');
  let value = item;

  for (let key of keys) {
    value = value[key];
  }

  return value;
};

export default DynamicTable;
