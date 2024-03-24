import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';

import MovieList from 'src/MovieList/MovieList';
import Planet from 'src/Planet/Planet';

const rootRoutes: RouteObject[] = [
  {
    path: 'planet/:planetId',
    Component: Planet,
  },
  {
    path: 'movies',
    Component: MovieList,
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
