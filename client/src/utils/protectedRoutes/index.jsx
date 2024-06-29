import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
const ProtectedRoutes = ({ children }) => {
  
const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate()
    }
  }, []);

  if (localStorage.getItem('Token')) {
    return children;
  } else {
    return null;
  }
};

export default ProtectedRoutes;