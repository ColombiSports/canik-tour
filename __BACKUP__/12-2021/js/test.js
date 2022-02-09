// 1 zéro à gauche
function fixLength(number) {
	return ("0" + number).slice(-2);
}

// Set the date we're counting down
let now = new Date();
let date = getNextDate(now, [new Date("2021-11-19"), new Date("2021-12-11"), new Date("2022-01-14"), new Date("2022-05-13")]);
createTimer(now, date);

function getNextDate(now, dates) {
	let diff, i;
	for (i = 0; i < dates.length; i++) {
		diff = getDiff(now, dates[i]);
		if (diff.days >= 0) return dates[i];
	}
	return null;
}

function getDiff(from, to) {
	if (!from || !to) return;

	let diff = {}; // Initialisation du retour
	let tmp = to.getTime() - from.getTime();

	tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
	diff.secs = tmp % 60; // Extraction du nombre de secondes

	tmp = Math.floor((tmp - diff.secs) / 60); // Nombre de minutes (partie entière)
	diff.mins = tmp % 60; // Extraction du nombre de minutes

	tmp = Math.floor((tmp - diff.mins) / 60); // Nombre d'heures (entières)
	diff.hours = tmp % 24; // Extraction du nombre d'heures

	tmp = Math.floor((tmp - diff.hours) / 24); // Nombre de jours restants
	diff.days = tmp;

	return diff;
}

// Create a timer and update the countdown every second
function createTimer(now, date) {
	let diff = getDiff(now, date);
	let prefix = document.getElementById("countdown_prefix");
	let countdown = document.getElementById("countdown");

	// Pas de date tout est passé
	if (diff == null) {
		prefix.innerHTML = "Revenez bientôt";
		countdown.innerHTML = "DATE A VENIR";
		return;
	}
	// Est la date
	if (diff.days == 0) {
		prefix.innerHTML = "Etape en cours";
		countdown.innerHTML = "VENEZ NOUS VOIR";
		return;

		// Show count down in french
	} else {
		// Stock interval ID
		prefix.innerHTML = "Prochaine étape dans :";

		let id = setInterval(function () {
			// Output the result in a html element
			countdown.innerHTML = "<div>" + diff.days + " jours " + fixLength(diff.hours) + " heures et " + fixLength(diff.mins) + " minutes</div>";
			diff = getDiff(new Date(), date);
		}, 1000);
	}
}
