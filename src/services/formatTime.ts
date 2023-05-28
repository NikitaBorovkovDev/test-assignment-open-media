const formatTime = (time: number) => {
	// Функция для форматирования времени в формат "минуты:секунды"
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60)
		.toString()
		.padStart(2, '0');
	return `${minutes > 0 ? minutes : '0' + minutes}:${seconds}`;
};
export default formatTime;
