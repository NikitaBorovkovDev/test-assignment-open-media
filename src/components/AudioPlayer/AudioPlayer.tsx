import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import MainPanel from '../MainPanel/MainPanel';
import classes from './AudioPlayer.module.css';
import commonClasses from '../CommonStyles.module.css';

interface IProps {
	url: string;
	back: () => void;
	setLinks: React.Dispatch<React.SetStateAction<string[] | null>>;
}
export interface IProgressBuffer {
	start: number;
	end: number;
}
export interface IProgress {
	percent: number;
	currentTime: number;
}

const AudioPlayer = (props: IProps) => {
	// currentTime в процентах, для отображения и percent для прогресс бара. Когда в scr стрим (duration === Infinity), то percent будет 0%
	const [progress, setProgress] = useState<IProgress>({
		percent: 0,
		currentTime: 0,
	});
	// отображение буферизации в процентах
	const [progressBuffer, setProgressBuffer] = useState<IProgressBuffer>({
		start: 0,
		end: 0,
	});
	const [loading, setLoading] = useState(true);
	const [isPause, setIsPause] = useState(true);

	const audioRef = useRef<HTMLAudioElement>(null);

	// добавление рабочей ссылки в localStorage
	useEffect(() => {
		const savedLinks = localStorage.getItem('savedLinks');
		const links: string[] = savedLinks ? JSON.parse(savedLinks) : [];

		if (!(!links.length && links[links.length - 1] === props.url)) {
			if (links.length > 4) {
				links.slice(-4);
			}

			const index = links.findIndex((item) => item === props.url);

			if (index === -1) {
				if (links.length === 4) {
					links.shift();
				}
			} else {
				links.splice(index, 1);
			}
			links.push(props.url);
			localStorage.setItem('savedLinks', JSON.stringify(links));
			props.setLinks(links.reverse());
		}
	}, []);

	// функция хелпер, для более удобной работы с setProgress
	const setCurrentTime = (time: number) => {
		setProgress((prev) => {
			return { currentTime: time ? time : 0, percent: prev.percent };
		});
	};

	const updateProgress = () => {
		if (
			audioRef.current &&
			audioRef.current.duration &&
			audioRef.current.duration !== Infinity &&
			audioRef.current.currentTime
		) {
			const percent =
				(audioRef.current.currentTime / audioRef.current.duration) *
				100;
			if (percent) {
				setProgress({
					currentTime: audioRef.current.currentTime,
					percent,
				});
			}
		} else if (audioRef.current && audioRef.current.duration === Infinity) {
			setCurrentTime(audioRef.current.currentTime);
		}
	};

	const handlePlay = () => {
		if (audioRef.current) {
			if (isPause) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
			setIsPause(() => !isPause);
		}
	};

	// прогресс буферизации
	const handleProgress = () => {
		const duration = audioRef.current?.duration;
		if (
			duration &&
			audioRef.current &&
			audioRef.current.buffered.length &&
			audioRef.current.duration !== Infinity
		) {
			const progress =
				(audioRef.current.currentTime / audioRef.current.duration) *
				100;
			const buffer = audioRef.current.buffered;
			let bufferStart = 0;
			let bufferEnd = 0;
			// в цикле выбирается буфер для currentTime
			for (let i = 0; i < buffer.length; i++) {
				if (
					progress >= (buffer.start(i) / duration) * 100 &&
					progress <= (buffer.end(i) / duration) * 100
				) {
					bufferStart = (buffer.start(i) / duration) * 100;
					bufferEnd = (buffer.end(i) / duration) * 100;
					break;
				}
			}
			const percentLoaded = bufferEnd - bufferStart;
			setProgressBuffer({ start: bufferStart, end: percentLoaded });
		}
	};

	return (
		<div className={commonClasses['audio-player__container']}>
			<button
				onClick={props.back}
				className={clsx(
					classes['audio-player__back-button'],
					'font-light'
				)}>
				Back
			</button>
			{/* можно добавить кнопку которая будет обновлять трансляцию 
			<button
				onClick={() => {
					audioRef.current!.src = props.url;
					audioRef.current!.play();
				}}
				className="font-light audio-player__back-button">
				buttton
			</button> */}
			<div
				className={clsx(
					classes['audio-player__player-panel'],
					loading ? classes['loader'] : ''
				)}>
				<button
					className={classes['audio-player__player-panel-play']}
					onClick={handlePlay}>
					{isPause ? (
						<svg
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M0 40V0H4.34286L40 18.7952V20.9639L4.34286 40H0Z"
								fill="white"
							/>
						</svg>
					) : (
						<svg
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect x="4" width="4" height="40" fill="white" />
							<rect x="32" width="4" height="40" fill="white" />
						</svg>
					)}
				</button>
				<MainPanel
					progress={progress}
					setProgress={setProgress}
					setCurrentTime={setCurrentTime}
					buffer={progressBuffer}
					audio={audioRef.current}
					handleProgress={handleProgress}
				/>
			</div>
			<audio
				tabIndex={0}
				aria-hidden="true"
				ref={audioRef}
				src={props.url}
				onTimeUpdate={updateProgress}
				onProgress={handleProgress}
				onError={() => console.log('err')}
				onCanPlay={() => setLoading(false)}
				onWaiting={() => setLoading(true)}
				className={commonClasses['link-check']}></audio>
		</div>
	);
};

export default AudioPlayer;
