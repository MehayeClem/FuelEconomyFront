import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function Home() {
	useEffect(() => {
		if (Cookies.get('refresh-token')) {
			toast.success('Bienvenu !');
		}
	}, []);

	return (
		<>
			<h1>Exemple de Thème Sombre</h1>

			<div className="card">
				<h1 className="headline">Headline</h1>
				<span className="subheadline">Subheadline</span>
				<p className="text">Text</p>
			</div>

			<button className="button">Button</button>
			<div>
				<span className="error">Error</span>
				<span className="warning">Warning</span>
				<span className="success">Success</span>
			</div>
		</>
	);
}
