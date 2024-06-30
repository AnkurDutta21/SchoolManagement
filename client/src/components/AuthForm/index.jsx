import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useFetchData from '../../hooks/useFetchData';
import { ENDPOINTS, URL } from '../../utils/apiService';
import { errorToast, successToast } from '../../utils/showToast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader';

const DynamicAuthForm = ({ formType, setFormType }) => {
    const navigate = useNavigate();
    const { postApiData, loading } = useFetchData();

    const isSignup = formType === 'signup';

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        ...(isSignup && {
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
            name: Yup.string().required('Name is required'),
        }),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (isSignup) {
                const response = await postApiData(URL + ENDPOINTS.REGISTER, values);
                successToast(response?.message || 'Signup successful');
                setFormType('login');
            } else {
                const response = await postApiData(URL + ENDPOINTS.LOGIN, values);
                if (response?.success) {
                    console.log(response, ';;;')
                    localStorage.setItem("Token", response?.data?.token);
                    localStorage.setItem("UserName", response?.data?.user);
                    successToast(response?.message || 'Login successful');
                    console.log('Navigating to home...');
                    navigate('/');
                } else {
                    errorToast(response?.error || 'Login failed');
                }
            }
        } catch (error) {
            errorToast(error?.response?.data?.error || error?.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        <Loader />
    }
    return (
        <div className="max-w-md mx-auto mt-10">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {isSignup && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs italic" />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs italic" />
                        </div>
                        {isSignup && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <Field
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs italic" />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline shadow-md w-full"
                                disabled={isSubmitting}
                            >
                                {isSignup ? 'Sign Up' : 'Login'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default DynamicAuthForm;
