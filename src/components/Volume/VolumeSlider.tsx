import { useEffect, useRef, useState } from 'react';
import classes from './Volume.module.css';

interface IProps {
	audio: HTMLAudioElement | null;
}
const VolumeSlider = (props: IProps) => {
	const { audio } = props;

	const [isDraggingVolumeMouse, setIsDraggingVolumeMouse] = useState(false);
	const [isDraggingVolumeTouch, setIsDraggingVolumeTouch] = useState(false);

	// значение громкости в процентах
	const [volume, setVolume] = useState(25);

	const sliderRef = useRef<HTMLDivElement | null>(null);
	const pointRef = useRef<HTMLSpanElement | null>(null);

	const handleVolumeDragStartMouse = () => {
		setIsDraggingVolumeMouse(() => true);
	};
	const handleVolumeDragStartTouch = (e: React.TouchEvent) => {
		if (e.currentTarget === pointRef.current)
			setIsDraggingVolumeTouch(true);
	};
	useEffect(() => {
		const handleMouseUp = () => {
			setIsDraggingVolumeMouse(false);
		};
		const handleTouchUp = () => {
			setIsDraggingVolumeTouch(false);
		};

		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchend', handleTouchUp);
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchend', handleTouchUp);
		};
	}, []);

	useEffect(() => {
		if (isDraggingVolumeMouse) {
			document.addEventListener('mousemove', handleMove);
		} else {
			document.removeEventListener('mousemove', handleMove);
		}
		if (isDraggingVolumeTouch) {
			document.addEventListener('touchmove', handleMove);
		} else {
			document.removeEventListener('touchmove', handleMove);
		}

		return () => {
			document.removeEventListener('touchmove', handleMove);
			document.removeEventListener('mousemove', handleMove);
		};
	}, [isDraggingVolumeMouse, isDraggingVolumeTouch]);

	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (isDraggingVolumeMouse || isDraggingVolumeTouch) {
			const sliderRect = sliderRef.current?.getBoundingClientRect();
			let offsetX: number;
			if (isDraggingVolumeTouch) {
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
					audio.volume = newValue;
					setVolume(newValue * 100);
				}
			}
		}
	};

	const handleVolumeClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (audio) {
			const volumeBar = event.currentTarget;
			const clickedVolume =
				(event.clientX - volumeBar.getBoundingClientRect().left) /
				volumeBar.offsetWidth;
			audio.volume = clickedVolume;
			setVolume(clickedVolume * 100);
		}
	};
	return (
		<div
			ref={sliderRef}
			className={classes['audio-player__volume']}
			onClick={handleVolumeClick}>
			<div className={classes['audio-player__volume-line']}>
				<div
					className={classes['audio-player__volume-current']}
					style={{ width: `${volume}%` }}>
					<span
						ref={pointRef}
						className={classes['audio-player__volume-point']}
						onTouchStart={handleVolumeDragStartTouch}
						onMouseDown={handleVolumeDragStartMouse}>
						<svg
							width="16"
							height="12"
							viewBox="0 0 16 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect width="16" height="12" fill="black" />
						</svg>
					</span>
				</div>
			</div>
		</div>
	);
};

export default VolumeSlider;
