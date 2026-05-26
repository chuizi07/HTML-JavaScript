window.onload = function() {
	const hourHand = document.querySelector('.hourHand');
	const minuteHand = document.querySelector('.minuteHand');
	const secondHand = document.querySelector('.secondHand');
	const time = document.querySelector('.time');

	function pad(n) {
		return n < 10 ? '0' + n : '' + n;
	}

	function setDate() {
		const now = new Date();
		const second = now.getSeconds();
		const minute = now.getMinutes();
		const hour = now.getHours();

		// 秒针：每60秒循环，不无限累加
		const secondDeg = ((second / 60) * 360) + 90;
		secondHand.style.transform = `rotate(${secondDeg}deg)`;

		// 分针 + 秒针偏移
		const minuteDeg = ((minute / 60) * 360) + ((second / 60) * 6) + 90;
		minuteHand.style.transform = `rotate(${minuteDeg}deg)`;

		// 时针 + 分针偏移
		const hourDeg = ((hour / 12) * 360) + ((minute / 60) * 30) + 90;
		hourHand.style.transform = `rotate(${hourDeg}deg)`;

		// 数字时间补零显示
		time.innerHTML = '<span><strong>' + pad(hour) + '</strong> : ' + pad(minute) + ' : <small>' + pad(second) + '</small></span>';
	}

	setInterval(setDate, 1000);
	setDate();
};
