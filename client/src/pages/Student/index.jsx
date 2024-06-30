import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';
import { FaPlus } from 'react-icons/fa';
import Loader from '../../utils/Loader';
import { debounce } from '../../utils/debounce';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [genderFilter, setGenderFilter] = useState('');
  const { getApiData, deleteApiData, loading } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents(currentPage, sortField, sortOrder);
  }, [currentPage, itemsPerPage, searchQuery, sortField, sortOrder, genderFilter]);

  const fetchStudents = async (page) => {
    const response = await getApiData(
      `${URL + ENDPOINTS.STUDENT}?page=${page}&limit=${itemsPerPage}&studentName=${searchQuery}&sortBy=${sortField}&order=${sortOrder}&gender=${genderFilter}`
    );
    if (response?.success) {
      const formattedStudents = response?.data?.students.map(student => ({
        ...student,
        class: Array.isArray(student?.class) ? student?.class.map(c => c.name).join(', ') : student?.class?.name
      }));
      setStudents(formattedStudents);
      setTotalPages(response?.data?.totalPages);
      successToast(response.message);
    } else {
      errorToast(response?.message || 'Failed to fetch students');
    }
  };

  const handleEdit = (id) => {
    navigate(`/student/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.STUDENT + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      fetchStudents(currentPage);
    } else {
      errorToast(response?.message);
    }
  };

  const handleView = (id) => {
    navigate(`/studentdetails/${id}`);
  };

  const handleCreate = () => {
    navigate('/student/new');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (field) => {
    const newOrder = field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    fetchStudents(currentPage);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const fields = ['name', 'gender', 'dob', 'contactDetails', 'feesPaid', 'class'];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Students Table</h2>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <FaPlus className="mr-2" />
          Create Student
        </button>
      </div>
      <div className="flex items-center mb-4 space-x-4 gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter student name"
            value={searchInput}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-600 mr-2">Gender:</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <DynamicTable
        data={students}
        fields={fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showView={false}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setItemsPerPage={setItemsPerPage}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default StudentTable;
