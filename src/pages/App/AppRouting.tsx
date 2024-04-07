import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import Planet from 'src/pages/Planet/Planet';
import MoviePage from "src/pages/MoviePage/MoviePage";

const rootRoutes: RouteObject[] = [
  {
    path: 'planet/:planetId',
    Component: Planet,
  },
  {
    path: 'movies',
    Component: MoviePage as any,
  },
  {
    path: '*',
    element: <Navigate to="/movies" />,
  },
];
const router = createBrowserRouter(rootRoutes);

function AppRouting() {
  return <RouterProvider router={router} />;
}
export default AppRouting;
