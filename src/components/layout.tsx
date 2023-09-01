import React from 'react';
import Header from './header';
import { LayoutProps } from '../types/layout';

export default function Layout({ children }: LayoutProps) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
