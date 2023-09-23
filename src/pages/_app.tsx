import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';
export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<Layout>
				<ToastContainer />
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	);
}
