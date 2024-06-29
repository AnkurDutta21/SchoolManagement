import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const { getApiData, deleteApiData } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await getApiData(URL + ENDPOINTS.TEACHER);
      if (response?.success) {
        const formattedTeachers = response.data.teachers.map(teacher => ({
          ...teacher,
          assignedClassName: teacher.assignedClass.length > 0 ? teacher.assignedClass[0].name : ''
        }));
        setTeachers(formattedTeachers);
        successToast(response.message);
      } else {
        errorToast(response?.message || 'Failed to fetch teachers');
      }
    };
    
    fetchTeachers();
  }, []);

  const fields = ['name', 'gender', 'dob', 'contactDetails', 'salary', 'assignedClassName'];

  const handleEdit = (id) => {
    navigate(`/teacher/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.TEACHER + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher._id !== id));
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/teacher/${id}`);
  };

  const handleCreate = () => {
    navigate('/teacher/new');
  };

  return (
    <div>
      <h2>Teachers Table</h2>
      <button onClick={handleCreate}>Create Teacher</button>
      <DynamicTable 
        data={teachers} 
        fields={fields} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView} 
      />
    </div>
  );
};

export default TeacherTable;
