{
	function getDiff(date) {
		const N2 = (n) => ("0" + n).slice(-2);
		let t = new Date(new Date(date) - new Date());

		const d = {};
		t = Math.floor(t / 1000);
		d.s = N2(t % 60);
		t = Math.floor((t - d.s) / 60);
		d.m = N2(t % 60);
		t = Math.floor((t - d.m) / 60);
		d.h = N2(t % 24);
		d.d = Math.floor((t - d.h) / 24).toString();
		return d;
	}
}
