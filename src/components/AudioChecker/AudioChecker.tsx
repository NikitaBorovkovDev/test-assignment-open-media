import CommonClasses from '../CommonStyles.module.css';

interface IProps {
	setError: (message: string) => void;
	onClose: () => void;
	setOk: () => void;
	url: string | undefined;
}

const AudioChecker = (props: IProps) => {
	let errorText: string | null = null;

	const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
		const audioElement = e.target as HTMLAudioElement;
		switch (audioElement.error?.code) {
			case MediaError.MEDIA_ERR_ABORTED:
				errorText = 'Playback aborted by the user';
				break;
			case MediaError.MEDIA_ERR_NETWORK:
				errorText = 'Network error occurred while loading the media';
				break;
			case MediaError.MEDIA_ERR_DECODE:
				errorText = 'Error occurred during media decoding';
				break;
			case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
				errorText = 'Link is not supported';
				break;
			default:
				errorText = 'Something went wrong';
				break;
		}
		props.setError(errorText);
		props.onClose();
	};
	return (
		<audio
			preload="true"
			src={props.url}
			className={CommonClasses['link-check']}
			onError={handleError}
			onCanPlay={() => {
				props.setOk();
				props.onClose();
			}}></audio>
	);
};

export default AudioChecker;
