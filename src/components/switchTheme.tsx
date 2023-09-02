import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
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
			{/* <button
				onClick={() => {
					theme === 'light' ? setTheme('dark') : setTheme('light');
				}}
			>
				Switch theme
			</button> */}
			<select value={theme} onChange={e => setTheme(e.target.value)}>
				<option value="system">System</option>
				{mounted && (
					<>
						<option value="dark">Dark</option>
						<option value="light">Light</option>
					</>
				)}
			</select>
		</div>
	);
}
