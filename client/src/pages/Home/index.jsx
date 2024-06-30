import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import { errorToast, successToast } from '../../utils/showToast';
import { PieChart } from '../../components/charts/pieChart';
import graph from '../../assets/graph.png';
import { AiOutlineArrowRight } from 'react-icons/ai';

const Home = () => {
  const navigate =useNavigate()
  const { getApiData, loading, error } = useFetchData();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getApiData(URL + ENDPOINTS.ALLCOUNTS);
      if (response?.success) {
        setData(response?.data);
        successToast(response?.message);
        console.log(data);
      } else {
        errorToast(response?.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{data?.classes || 0}</div>
            <div className="text-gray-500">Total Classes</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{data?.students || 0}</div>
            <div className="text-gray-500">Total Students</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{data?.teachers || 0}</div>
            <div className="text-gray-500">Total Teachers</div>
          </div>
        </div>
        <div className="flex flex-row items-center jutify-center w-3/5 m-auto">
          <div className='flex flex-col items-center'>
          <img src={graph} alt="graph" className="w-full max-w-md" />
          <div className="text-blue-500 hover:underline cursor-pointer mb-4 flex flex-row items-center" onClick={()=>navigate('/analytics')}>Go to Analytics<AiOutlineArrowRight/></div>
          </div>
          <div className="w-full max-w-md">
            <PieChart male={data?.genderCounts?.male || 0} female={data?.genderCounts?.female || 0} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;