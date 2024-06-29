import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './layout/MainLayout';
import Auth from './pages/Auth';
import ProtectedRoutes from './utils/protectedRoutes';
import ClassTable from './pages/Class';
import StudentTable from './pages/Student';
import TeacherTable from './pages/Teacher';
import DynamicForm from './components/Form/index';

const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Home />
        </MainLayout>
      </ProtectedRoutes>
    )
  },
  {
    path: '/auth',
    element: (
      <MainLayout>
        <Auth />
      </MainLayout>
    )
  },
  {
    path: '/class',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <ClassTable />
        </MainLayout>
      </ProtectedRoutes>
    )
  },
  {
    path: '/student',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <StudentTable />
        </MainLayout>
      </ProtectedRoutes>
    )
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <TeacherTable />
        </MainLayout>
      </ProtectedRoutes>
    )
  },
  {
    path: '/:entity/new',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <DynamicForm />
        </MainLayout>
      </ProtectedRoutes>
    )
  },
  {
    path: '/:entity/:id',
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <DynamicForm />
        </MainLayout>
      </ProtectedRoutes>
    )
  }
];

const Router = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Router;
