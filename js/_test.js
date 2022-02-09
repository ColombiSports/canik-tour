window.onload = function () {
	const items = document.querySelectorAll(".ambassador-item");
	console.log(items);
	for (const item of items) {
		const company = item.querySelector(".ambassador-data h1").innerText;

		const address = item.querySelector(".ambassador-data p");
		const tel = address.removeChild(address.lastChild).textContent.trim();

		console.log(address);
	}
};
