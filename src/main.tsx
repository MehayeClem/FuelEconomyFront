import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//Import du style
import './styles/style.scss';

//Import des pages
import Login from './pages/Login.tsx';
import Error404 from './pages/Error404.tsx';

//Import des middlewares
import Auth from './components/Auth.tsx';

//Création d'un React Router
const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />,
		errorElement: <Error404 />
	},
	{
		path: '/',
		element: <Auth />,
		errorElement: <Error404 />
	}
]);

//Liaison entre l'html et les pages en React
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
