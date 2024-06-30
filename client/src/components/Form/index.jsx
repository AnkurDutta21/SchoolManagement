import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import { successToast, errorToast } from '../../utils/showToast';

const DynamicForm = () => {
  const { entity, id } = useParams();
  const { getApiData, postApiData, putApiData } = useFetchData();
  const [initialValues, setInitialValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const entityFields = {
    student: {
      initialValues: {
        name: '',
        gender: '',
        dob: '',
        contactDetails: '',
        feesPaid: '',
        class: '',
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        dob: Yup.date().required('Date of Birth is required'),
        contactDetails: Yup.string().required('Contact Details is required'),
        feesPaid: Yup.number().required('Fees Paid is required'),
        class: Yup.string().required('Class is required'),
      }),
    },
    teacher: {
      initialValues: {
        name: '',
        gender: '',
        dob: '',
        contactDetails: '',
        salary: '',
        assignedClass: [],
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        dob: Yup.date().required('Date of Birth is required'),
        contactDetails: Yup.string().required('Contact Details is required'),
        salary: Yup.number().required('Salary is required'),
        assignedClass: Yup.array().min(1, 'Assigned Class is required').of(
          Yup.object().shape({
            value: Yup.string().required(),
            label: Yup.string().required(),
          })
        ).required('Assigned Class is required'),
      }),
    },
    class: {
      initialValues: {
        name: '',
        year: '',
        studentFees: '',
        maxStudents: '',
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        year: Yup.number().required('Year is required'),
        studentFees: Yup.number().required('Student Fees is required'),
        maxStudents: Yup.number().required('Max Students is required'),
      }),
    },
  };

  const fetchClasses = async () => {
    try {
      const response = await getApiData(`${URL}${ENDPOINTS.CLASSES}`);
      if (response?.success) {
        setClasses(response.data.classes);
      } else {
        errorToast(response?.message || 'Failed to fetch classes');
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchEntityData = async () => {
      if (id) {
        const response = await getApiData(`${URL}/api/v1/${entity}/${id}`);
        if (response?.success) {
          let initialValues = { ...entityFields[entity].initialValues };

          if (entity === 'student' || entity === 'teacher') {
            initialValues.name = response.data.name || '';
            initialValues.gender = response.data.gender || '';
            initialValues.contactDetails = response.data.contactDetails || '';
            initialValues.feesPaid = response.data.feesPaid || '';
            if (response.data.dob) {
              initialValues.dob = new Date(response.data.dob).toISOString().split('T')[0];
            }
          }

          if (entity === 'teacher') {
            initialValues.salary = response.data.salary || '';
            initialValues.assignedClass = response.data.assignedClass?.map(cls => ({ value: cls._id, label: cls.name })) || [];
          } else if (entity === 'student') {
            initialValues.class = response.data.class?._id || '';
          }

          if (entity === 'class') {
            initialValues = {
              name: response.data.name || '',
              year: response.data.year || '',
              studentFees: response.data.studentFees || '',
              maxStudents: response.data.maxStudents || '',
            };
          }

          setInitialValues(initialValues);
          setIsEditing(true);
        } else {
          errorToast(response?.message || 'Failed to fetch details');
        }
      } else {
        setInitialValues(entityFields[entity].initialValues);
      }
    };

    fetchEntityData();
  }, [id, entity]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: entityFields[entity].validationSchema,
    onSubmit: async (values) => {
      try {
        if (entity === 'teacher') {
          values.assignedClass = values.assignedClass.map(cls => cls.value);
        }

        let response;
        if (isEditing) {
          response = await putApiData(`${URL}/api/v1/${entity}/${id}`, values);
        } else {
          response = await postApiData(`${URL}/api/v1/${entity}`, values);
        }

        if (response?.success) {
          successToast(response.message);
          navigate(`/${entity}`);
        } else {
          errorToast(response?.message || 'Failed to save details');
        }
      } catch (error) {
        errorToast(error.message);
      }
    },
  });

  const fields = Object.keys(entityFields[entity].initialValues);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={formik.handleSubmit} className="max-w-lg w-full p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}` : `Create ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}</h2>
        {fields.map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field === 'dob' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {field === 'gender' ? (
              <select
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : field === 'class' ? (
              <select
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
                ))}
              </select>
            ) : field === 'assignedClass' ? (
              <Select
                isMulti
                name={field}
                value={formik.values[field]}
                onChange={value => formik.setFieldValue(field, value)}
                onBlur={formik.handleBlur}
                options={classes.map(classItem => ({ value: classItem._id, label: classItem.name }))}
                className="mt-1"
              />
            ) : (
              <input
                type={field === 'dob' ? 'date' : 'text'}
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
            )}
          </div>
        ))}
        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {isEditing ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
