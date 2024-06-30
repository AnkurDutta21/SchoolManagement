import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';
import { FaPlus } from 'react-icons/fa';

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const { getApiData, deleteApiData } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await getApiData(URL + ENDPOINTS.CLASSES);
      if (response?.success) {
        setClasses(response.data.classes);
        successToast(response.message);
      } else {
        errorToast(response?.message || 'Failed to fetch classes');
      }
    };
    
    fetchClasses();
  }, []);

  const fields = ['name', 'year', 'studentFees', 'maxStudents'];

  const handleEdit = (id) => {
    navigate(`/class/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.CLASSES + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      setClasses(prevClasses => prevClasses.filter(classItem => classItem.id !== id));
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/classdetails/${id}`);
  };

  const handleCreate = () => {
    navigate('/class/new');
  };

  return (
    <div className="px-4 py-2">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Class Table</h2>
      <button
        onClick={handleCreate}
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
      >
        <FaPlus className="mr-2" />
        Create Class
      </button>
    </div>
      <DynamicTable 
        data={classes} 
        fields={fields} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView}
        showView={true}  
      />
    </div>
  );
};

export default ClassTable;
