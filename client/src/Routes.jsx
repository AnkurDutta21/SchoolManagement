import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import Auth from "./pages/Auth";
import ProtectedRoutes from "./utils/protectedRoutes";


const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Home />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/auth",
    element: (
      // <ProtectedRoutes>
      <MainLayout>
        <Auth />
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
