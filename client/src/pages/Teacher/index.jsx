import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';
import { FaPlus } from 'react-icons/fa';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const { getApiData, deleteApiData } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers(currentPage);
  }, [currentPage, itemsPerPage]);

  const fetchTeachers = async (page) => {
    const response = await getApiData(`${URL + ENDPOINTS.TEACHER}?page=${page}&limit=${itemsPerPage}`);
    if (response?.success) {
      const formattedTeachers = response.data.teachers.map(teacher => ({
        ...teacher,
        assignedClassName: teacher.assignedClass.length > 0 ? teacher.assignedClass[0].name : ''
      }));
      setTeachers(formattedTeachers);
      setTotalPages(response?.data?.totalPages);
      successToast(response.message);
    } else {
      errorToast(response?.message || 'Failed to fetch teachers');
    }
  };

  const handleEdit = (id) => {
    navigate(`/teacher/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.TEACHER + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      fetchTeachers(currentPage);
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/teacherdetails/${id}`);
  };

  const handleCreate = () => {
    navigate('/teacher/new');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fields = ['name', 'gender', 'dob', 'contactDetails', 'salary', 'assignedClassName'];

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Teachers Table</h2>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <FaPlus className="mr-2" />
          Create Teacher
        </button>
      </div>
      <DynamicTable
        data={teachers}
        fields={fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showView={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default TeacherTable;
