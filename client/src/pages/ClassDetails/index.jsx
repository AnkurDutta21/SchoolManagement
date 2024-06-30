import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import { ENDPOINTS, URL } from "../../utils/apiService";
import { errorToast, successToast } from "../../utils/showToast";
import { PieChart } from "../../components/charts/pieChart";

const ClassDetails = () => {
  const { id } = useParams();
  const { getApiData, loading, error } = useFetchData();
  const [classData, setClassData] = useState(null);
  const [genderData, setGenderData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await getApiData(`${URL}${ENDPOINTS.CLASSES}/${id}`);
        if (classResponse?.success) {
          setClassData(classResponse.data);
          successToast(classResponse.message);
        } else {
          errorToast(classResponse?.message);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        errorToast("Failed to fetch class data");
      }
    };

    const fetchGenderData = async () => {
      try {
        const genderResponse = await getApiData(`${URL}${ENDPOINTS.GENDERDATA}/${id}`);
        if (genderResponse?.success) {
          setGenderData(genderResponse.data);
          successToast(genderResponse.message);
        } else {
          errorToast(genderResponse?.message);
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
        errorToast("Failed to fetch gender data");
      }
    };

    fetchData();
    fetchGenderData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Class Details - {classData?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Class Information</h2>
          <p>Year: {classData?.year}</p>
          <div>
            <h3 className="font-semibold mt-4">Teachers:</h3>
            <ul className="list-disc list-inside">
              {classData?.teacher.map((teacher) => (
                <li key={teacher._id}>{teacher.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mt-4">Students:</h3>
            <ul className="list-disc list-inside">
              {classData?.students.map((student) => (
                <li key={student._id}>{student.name}</li>
              ))}
            </ul>
          </div>
          <p>Max Students Allowed: {classData?.maxStudents}</p>
          <p>Total Student Fees: ${classData?.studentFees}</p>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2 text-center">Gender Distribution</h2>
            <PieChart male={genderData?.maleCount} female={genderData?.femaleCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
