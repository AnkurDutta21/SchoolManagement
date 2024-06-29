import { useState } from "react";
import axios from "axios";

const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("Token");
    if (token) {
      headers["Authorization"] = token;
    }
    return headers;
  };

  const handleError = (err) => {
    if (err.response) {
      setError({
        message: err.response.data.message || "Server responded with an error",
        status: err.response.status,
      });
    } else if (err.request) {
      setError({ message: "No response received from server" });
    } else {
      setError({ message: err.message });
    }
  };

  const getApiData = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, { headers: getHeaders() });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const postApiData = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, data, { headers: getHeaders() });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const patchApiData = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(url, data, { headers: getHeaders() });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApiData = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(url, { headers: getHeaders() });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getApiData,
    postApiData,
    patchApiData,
    deleteApiData,
    loading,
    error,
  };
};

export default useFetchData;
