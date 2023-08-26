export default function AppLayout({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Fuel Economy</title>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body>{children}</body>
		</html>
	);
}
