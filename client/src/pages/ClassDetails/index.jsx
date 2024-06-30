import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import { ENDPOINTS, URL } from "../../utils/apiService";
import { errorToast, successToast } from "../../utils/showToast";
import { PieChart } from "../../components/charts/pieChart";
import Loader from "../../utils/Loader";

const ClassDetails = () => {
  const { id } = useParams();
  const { getApiData, loading } = useFetchData();
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
          errorToast(classResponse?.message || "Failed to fetch class data");
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
          errorToast(genderResponse?.message || "Failed to fetch gender data");
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
        errorToast("Failed to fetch gender data");
      }
    };

    fetchData();
    fetchGenderData();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Class Details - {classData?.name}</h1>

      {classData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Class Information</h2>
            <p>Year: {classData.year}</p>
            <div>
              <h3 className="font-semibold mt-4">Teachers:</h3>
              {classData?.teacher.length > 0 ? (
                <ul className="list-disc list-inside">
                  {classData?.teacher.map((teacher) => (
                    <li key={teacher._id}>{teacher.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No teachers assigned to this class</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mt-4">Students:</h3>
              {classData?.students.length > 0 ? (
                <ul className="list-disc list-inside mb-2">
                  {classData?.students.map((student) => (
                    <li key={student._id}>{student.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mb-3">No students enrolled in this class</p>
              )}
            </div>
            <p className="mb-3">Max Students Allowed: {classData.maxStudents}</p>
            <p className="mb-3">Total Student Fees: ${classData.studentFees}</p>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2 text-center">Gender Distribution</h2>
              <PieChart male={genderData?.maleCount || 0} female={genderData?.femaleCount || 0} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">No data found</p>
      )}
    </div>
  );
};

export default ClassDetails;
