export function formatDateToFrench(userDate: string): string {
	const date = new Date(userDate);
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	};

	return date.toLocaleDateString('fr-FR', options);
}

export function calculateTimeDifference(lastUpdate: string): string {
	const lastUpdateDate = new Date(lastUpdate);
	const currentDate = new Date();

	const timeDifferenceMilliseconds =
		currentDate.getTime() - lastUpdateDate.getTime();

	const secondsDifference = Math.floor(timeDifferenceMilliseconds / 1000);
	const minutesDifference = Math.floor(secondsDifference / 60);
	const hoursDifference = Math.floor(minutesDifference / 60);
	const daysDifference = Math.floor(hoursDifference / 24);

	if (daysDifference >= 1) {
		return `Dernière mise à jour il y a ${daysDifference} jour${
			daysDifference !== 1 ? 's' : ''
		}`;
	} else if (hoursDifference >= 1) {
		return `Dernière mise à jour il y a ${hoursDifference} heure${
			hoursDifference !== 1 ? 's' : ''
		}`;
	} else if (minutesDifference >= 1) {
		return `Dernière mise à jour il y a ${minutesDifference} minute${
			minutesDifference !== 1 ? 's' : ''
		}`;
	} else {
		return `Dernière mise à jour il y a ${secondsDifference} seconde${
			secondsDifference !== 1 ? 's' : ''
		}`;
	}
}
