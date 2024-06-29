import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const { getApiData, deleteApiData } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await getApiData(URL + ENDPOINTS.STUDENT);
      if (response?.success) {
        const formattedStudents = response?.data?.students.map(student => ({
          ...student,
          class: Array.isArray(student?.class) ? student?.class.map(c => c.name).join(', ') : student?.class?.name
        }));
        setStudents(formattedStudents);
        successToast(response.message);
      } else {
        errorToast(response?.message || 'Failed to fetch students');
      }
    };
    
    fetchStudents();
  }, []);

  const fields = ['name', 'gender', 'dob', 'contactDetails', 'feesPaid', 'class'];

  const handleEdit = (id) => {
    navigate(`/student/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.STUDENT + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/student/${id}`);
  };

  const handleCreate = () => {
    navigate('/student/new');
  };

  return (
    <div>
      <h2>Students Table</h2>
      <button onClick={handleCreate}>Create Student</button>
      <DynamicTable 
        data={students} 
        fields={fields} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView} 
      />
    </div>
  );
};

export default StudentTable;
