import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { ThemeProvider } from 'next-themes';
import '../sass/main.scss';
export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	);
}
