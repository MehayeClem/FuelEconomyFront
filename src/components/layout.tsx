import React from 'react';
import Header from './header';
import { LayoutProps } from '../types/layout';
import { useRouter } from 'next/router';
export default function Layout({ children }: LayoutProps) {
	const router = useRouter();
	return (
		<>
			{router.asPath === '/login' || router.asPath === '/register' ? (
				''
			) : (
				<Header />
			)}
			<main>{children}</main>
		</>
	);
}
