import App from '../pages/App';
import { Navigate, useLocation } from 'react-router-dom';

/*
	Récupère le token dans le localstorage du navigateur
	Récupère aussi la dernière localisation de l'utilisateur
	Permet de verifier si l'utilisateur s'est bien connecté :
		- Si oui -> Affiche la main page
		- Si non -> Redirection de l'utilisateur sur la page de login et sauvegarde de sa dernière localisation afin de le rediriger quand il sera connecté
*/
const Auth = () => {
	const isAuthenticated = localStorage.getItem('token') !== null;
	const location = useLocation();

	return isAuthenticated ? (
		<App />
	) : (
		<Navigate to="/login" replace state={{ path: location.pathname }} />
	);
};

export default Auth;
