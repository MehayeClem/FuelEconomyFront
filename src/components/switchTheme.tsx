import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FaCog, FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const nextTheme = theme === 'dark' ? 'light' : 'dark';

	return (
		<div
			className="theme__container"
			onClick={() => {
				setTheme(nextTheme);
			}}
		>
			<div className="theme__card">
				<div className="theme__icon">
					{theme === 'dark' ? <FaMoon /> : <FaSun />}
				</div>
			</div>
		</div>
	);
}
