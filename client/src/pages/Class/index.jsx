import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const { getApiData, deleteApiData } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await getApiData(URL + ENDPOINTS.CLASS);
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
    const response = await deleteApiData(URL + ENDPOINTS.CLASS + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      setClasses(prevClasses => prevClasses.filter(classItem => classItem.id !== id));
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/class/${id}`);
  };

  const handleCreate = () => {
    navigate('/class/new');
  };

  return (
    <div>
      <h2>Classes Table</h2>
      <button onClick={handleCreate}>Create Class</button>
      <DynamicTable 
        data={classes} 
        fields={fields} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView} 
      />
    </div>
  );
};

export default ClassTable;
