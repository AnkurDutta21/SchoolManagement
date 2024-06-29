import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
        assignedClass: '',
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        dob: Yup.date().required('Date of Birth is required'),
        contactDetails: Yup.string().required('Contact Details is required'),
        salary: Yup.number().required('Salary is required'),
        assignedClass: Yup.string().required('Assigned Class is required'),
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

          initialValues.name = response.data.name || '';
          initialValues.gender = response.data.gender || '';
          initialValues.contactDetails = response.data.contactDetails || '';
          initialValues.feesPaid = response.data.feesPaid || '';

          if (entity === 'student' || entity === 'teacher') {
            if (response.data.dob) {
              initialValues.dob = new Date(response.data.dob).toISOString().split('T')[0];
            }
          }

          if (entity === 'teacher') {
            initialValues.salary = response.data.salary || '';
            initialValues.assignedClass = response.data.assignedClass?._id || '';
          } else {
            initialValues.class = response.data.class?._id || '';
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
        let response;
        if (isEditing) {
          if (entity === 'teacher') {
            const assignedClassId = values.assignedClass;
            values = { ...values, assignedClass: assignedClassId };
          } else {
            const classId = values.class;
            values = { ...values, class: classId };
          }

          response = await putApiData(`${URL}/api/v1/${entity}/${id}`, values);
        } else {
          console.log(values,'lll')
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
    <form onSubmit={formik.handleSubmit}>
      <h2>{isEditing ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}` : `Create ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}</h2>
      {fields.map((field) => (
        <div key={field}>
          <label>{field === 'dob' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
          {field === 'gender' ? (
            <select
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : field === 'class' || field === 'assignedClass' ? (
            <select
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select {field === 'assignedClass' ? 'Assigned Class' : 'Class'}</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
              ))}
            </select>
          ) : (
            <input
              type={field === 'dob' ? 'date' : 'text'}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
          )}
          {formik.touched[field] && formik.errors[field] && (
            <div style={{ color: 'red' }}>{formik.errors[field]}</div>
          )}
        </div>
      ))}
      <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default DynamicForm;
