import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import DynamicTable from '../../components/Table';
import { successToast, errorToast } from '../../utils/showToast';
import { FaPlus } from 'react-icons/fa';
import Loader from '../../utils/Loader';

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('year');
  const [sortOrder, setSortOrder] = useState('asc');
  const { getApiData, deleteApiData,loading } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses(currentPage, sortField, sortOrder);
  }, [currentPage, itemsPerPage, searchQuery, sortField, sortOrder]);

  const fetchClasses = async (page) => {
    const response = await getApiData(
      `${URL + ENDPOINTS.CLASSES}?page=${page}&limit=${itemsPerPage}&className=${searchQuery}&sortBy=${sortField}&order=${sortOrder}`
    );
    if (response?.success) {
      setClasses(response.data.classes);
      setTotalPages(response?.data?.totalPages);
      successToast(response.message);
    } else {
      errorToast(response?.message || 'Failed to fetch classes');
    }
  };

  const handleEdit = (id) => {
    navigate(`/class/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await deleteApiData(URL + ENDPOINTS.CLASSES + `/${id}`);
    if (response?.success) {
      successToast(response?.message);
      fetchClasses(currentPage);
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (field) => {
    const newOrder = field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    fetchClasses(currentPage);
  };
  if (loading) {
    return <Loader />;
  }
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
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by class name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        
      </div>
      <DynamicTable
        data={classes}
        fields={['name', 'year', 'studentFees', 'maxStudents']}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showView={true}
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

export default ClassTable;
