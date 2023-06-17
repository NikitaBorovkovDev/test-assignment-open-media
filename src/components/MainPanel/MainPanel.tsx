import { memo, useEffect, useRef, useState } from 'react';
import VolumeSlider from '../Volume/VolumeSlider';
import formatTime from 'src/services/formatTime';
import { IProgress, IProgressBuffer } from '../AudioPlayer/AudioPlayer';
import classes from './MainPanel.module.css';

interface IProps {
	audio: HTMLAudioElement | null;
	handleProgress: () => void;
	buffer: IProgressBuffer;
	progress: IProgress;
	setProgress: React.Dispatch<React.SetStateAction<IProgress>>;
	setCurrentTime: (time: number) => void;
}

const MainPanel = memo((props: IProps) => {
	const {
		audio,
		handleProgress,
		buffer,
		progress,
		setProgress,
		setCurrentTime,
	} = props;

	const [isDraggingTimeMouse, setIsDraggingTimeMouse] = useState(false);
	const [isDraggingTimeTouch, setIsDraggingTimeTouch] = useState(false);

	const timeRef = useRef<HTMLDivElement | null>(null);
	const pointRef = useRef<HTMLSpanElement | null>(null);

	// обновить отображение буферизации
	useEffect(() => {
		if (audio && audio.duration !== Infinity) handleProgress();
	}, [progress]);

	useEffect(() => {
		const handleMouseUp = () => {
			setIsDraggingTimeMouse(false);
		};
		const handleTouchUp = () => {
			setIsDraggingTimeTouch(false);
		};

		document.addEventListener('touchend', handleTouchUp);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('touchend', handleTouchUp);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		if (isDraggingTimeMouse) {
			document.addEventListener('mousemove', handleMove);
		} else {
			document.removeEventListener('mousemove', handleMove);
		}
		if (isDraggingTimeTouch) {
			document.addEventListener('touchmove', handleMove);
		} else {
			document.removeEventListener('touchmove', handleMove);
		}

		return () => {
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('touchmove', handleMove);
		};
	}, [isDraggingTimeMouse, isDraggingTimeTouch]);

	const handleTimeDragMouseStart = () => {
		setIsDraggingTimeMouse(true);
	};

	const handleTimeDragStartTouch = (e: React.TouchEvent) => {
		if (e.currentTarget === pointRef.current) setIsDraggingTimeTouch(true);
	};

	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (isDraggingTimeMouse || isDraggingTimeTouch) {
			const sliderRect = timeRef.current?.getBoundingClientRect();
			let offsetX: number;
			if (isDraggingTimeTouch) {
				const event = e as TouchEvent;
				const touch = event.touches[0];
				const clientX = touch.clientX;
				offsetX = clientX - sliderRect!.left;
			} else {
				const event = e as MouseEvent;
				offsetX = event.clientX - sliderRect!.left;
			}
			if (offsetX >= 0) {
				const width = sliderRect!.width;
				const newValue = Math.max(0, Math.min(offsetX / width, 1));

				if (audio) {
					if (audio.duration !== Infinity) {
						audio.currentTime = audio.duration * newValue;
						setProgress({
							percent: newValue * 100,
							currentTime: audio.currentTime,
						});
					}
				}
			}
		}
	};

	const handleProgressClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (audio) {
			if (audio.duration !== Infinity) {
				const progressBar = event.currentTarget;

				const clickedTime =
					(event.clientX - progressBar.getBoundingClientRect().left) /
					progressBar.offsetWidth;
				audio.currentTime = audio.duration * clickedTime;
				setProgress({
					currentTime: audio.currentTime,
					percent: clickedTime * 100,
				});
			} else if (audio.duration === Infinity) {
				setCurrentTime(audio.currentTime);
			}
		}
	};

	return (
		<>
			<div
				className={classes['audio-player__player-panel-progress-bar']}
				ref={timeRef}
				onClick={handleProgressClick}
				onTouchStart={handleTimeDragStartTouch}
				onMouseDown={handleTimeDragMouseStart}>
				<div className={classes['audio-player__progress-bar-line']}>
					<div
						className={classes['audio-player__progress-bar-buffer']}
						style={{
							width: `calc(${buffer.end}%)`,
							left: `calc(${buffer.start}% + 7px)`,
						}}></div>
					<div
						className={
							classes['audio-player__progress-bar-current-time']
						}
						style={{ width: `${progress.percent}%` }}>
						<span
							ref={pointRef}
							className={
								classes['audio-player__progress-bar-point']
							}
							onTouchStart={handleTimeDragStartTouch}
							onMouseDown={handleTimeDragMouseStart}>
							<svg
								width="16"
								height="12"
								viewBox="0 0 16 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<rect
									width="16"
									height="12"
									rx="6"
									fill="white"
								/>
							</svg>
						</span>
					</div>
				</div>
			</div>

			<div className={classes['audio-player__time-and-volume-container']}>
				<div>
					{progress.currentTime
						? formatTime(progress.currentTime)
						: '00:00'}
				</div>
				<VolumeSlider audio={audio} />
			</div>
		</>
	);
});

export default MainPanel;
