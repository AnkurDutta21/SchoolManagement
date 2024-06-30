import React, { useState, useEffect } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import { errorToast, successToast } from '../../utils/showToast';
import BarChart from '../../components/charts/barChart';
import Loader from '../../utils/Loader';

function ProfitAnalysis() {
  const { getApiData, loading, error } = useFetchData();
  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('month');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await getApiData(URL + ENDPOINTS.GETPROFIT);
    if (response.success) {
      console.log("API Response: ", response);
      setData(response?.data);
      successToast(response?.message);
    } else {
      errorToast(response?.message);
    }
  };

  return (
    <div>
        <div className="mb-4 mt-8 ml-5">
        <button
          className={`text-blue-500 ${chartType === 'month' ? 'font-bold' : ''}`}
          onClick={() => setChartType('month')}
        >
          Month
        </button>
        <span className="mx-2">|</span>
        <button
          className={`text-blue-500 ${chartType === 'year' ? 'font-bold' : ''}`}
          onClick={() => setChartType('year')}
        >
          Year
        </button>
      </div>

      {data ? (
        <div className="chart-container" style={{ width: '100%', height: '400px' }}>
          <BarChart
            salary={data?.totalSalary || 0}
            fees={data?.totalFees || 0}
            isYearly={chartType === 'year'}
          />
        </div>
      ) : (
        <Loader/>
      )}
    </div>
  );
}

export default ProfitAnalysis;
