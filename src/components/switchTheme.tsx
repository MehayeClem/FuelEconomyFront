import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function SwitchTheme() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div>
			Theme: {theme}
			<button
				onClick={() => {
					theme === 'light' ? setTheme('dark') : setTheme('light');
				}}
			>
				Switch theme
			</button>
		</div>
	);
}
