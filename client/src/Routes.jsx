import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";


const routes = [
  {
    path: "/",
    element: (
      // <ProtectedRoutes>
      <MainLayout>
      <Home />
    </MainLayout>
    // </ProtectedRoutes>
    ),
  },
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
