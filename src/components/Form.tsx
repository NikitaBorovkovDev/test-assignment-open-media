import { useEffect, useRef, useState } from 'react';
import AudioChecker from './AudioChecker/AudioChecker';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import clsx from 'clsx';

interface iShowError {
	isError: boolean;
	errorMessage: string | null;
}

const Form = () => {
	// input value
	const [link, setLink] = useState('');
	const [linkChecking, setLinkChecking] = useState(false);
	// массив строк из localStorage
	const [links, setLinks] = useState<string[] | null>(null);
	// история запросов
	const [linksMenuOpen, setLinksMenuOpen] = useState(false);
	const [showPlayer, setShowPlayer] = useState(false);
	// для навигации клавишами в истории запросов
	const [selectedElementIndex, setSelectedElementIndex] = useState(-1);
	const [showError, setShowError] = useState<iShowError>({
		isError: false,
		errorMessage: null,
	});
	// элементы истории запросов
	const [linksElements, setLinksElements] = useState<JSX.Element[] | null>(
		null
	);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (showError.isError && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showError]);

	// сброс выделения в истории
	useEffect(() => {
		if (!linksMenuOpen) setSelectedElementIndex(-1);
	}, [linksMenuOpen]);

	// создание элементов истории из localStorage
	useEffect(() => {
		const savedLinks = localStorage.getItem('savedLinks');
		const currentLinks: string[] = savedLinks ? JSON.parse(savedLinks) : [];
		if (links) {
			setLinksElements(
				links.map((item, index) => {
					return (
						<li
							onClick={() => {
								setLink(item);
								setSelectedElementIndex(index);
								setLinksMenuOpen(false);
							}}
							tabIndex={-1}
							key={index}
							className="form__history-item"
							style={
								selectedElementIndex === index
									? { border: '1px solid #000' }
									: {}
							}>
							{item}
						</li>
					);
				})
			);
		} else {
			currentLinks.reverse();
			setLinks(currentLinks);
		}
	}, [selectedElementIndex, links]);

	const handleSubmit = (
		e:
			| React.FormEvent<HTMLFormElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		// поле ввода ссылки в формате “https://” или “http://” и содержит один или более символов, кроме пробелов
		const regex = /^https?:\/\/\S+$/;
		if (!regex.test(link)) {
			setShowError({ isError: true, errorMessage: 'Wrong link' });
		} else {
			setLinkChecking(() => true);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				if (selectedElementIndex !== -1 && linksElements)
					setSelectedElementIndex((prevIndex) => prevIndex - 1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				if (
					linksElements &&
					linksElements.length - 1 > selectedElementIndex
				) {
					setSelectedElementIndex((prevIndex) => prevIndex + 1);
				}
				break;
			case 'Enter':
				if (linksMenuOpen) {
					e.preventDefault();
					if (links && selectedElementIndex !== -1) {
						setLink(links[selectedElementIndex]);
						setLinksMenuOpen(false);
					}
				}
				break;
			default:
				break;
		}
	};
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLinkChecking(false);
		setShowError({
			isError: false,
			errorMessage: null,
		});
		setLink(e.target.value);
		setLinksMenuOpen(true);
	};

	return (
		<>
			{/* создание невидимого плеера, для проверки ссылки */}
			{linkChecking ? (
				<AudioChecker
					url={link}
					setError={(message: string) => {
						setShowError({ isError: true, errorMessage: message });
						setShowPlayer(() => false);
					}}
					setOk={() => {
						setShowPlayer(() => true);
						setShowError({ isError: false, errorMessage: null });
					}}
					onClose={() => setLinkChecking(() => false)}
				/>
			) : null}

			{!showPlayer ? (
				<div className="form">
					<h3 className="font-light form__heading">
						Insert the link
					</h3>
					<form
						className={clsx(
							'form__container',
							showError.isError ? 'form__error-icon' : ''
						)}
						onSubmit={handleSubmit}>
						<input
							ref={inputRef}
							type="text"
							className={clsx(
								'font-light form__input',
								showError.isError ? 'form-input-error' : ''
							)}
							placeholder="https://"
							onChange={handleOnChange}
							value={link}
							onBlur={() => setLinksMenuOpen(false)}
							onFocus={() => setLinksMenuOpen(true)}
							onKeyDown={handleKeyDown}
						/>
						<button
							// из-за onBlur у input не срабатывает submit по нажатию на кнопку
							onMouseDown={(e) => {
								if (
									e.currentTarget.classList.contains(
										'form__button'
									)
								)
									handleSubmit(e);
							}}
							type="submit"
							className="form__button">
							{linkChecking ? (
								<span className="form__spinner"></span>
							) : (
								<span className="form__icon"></span>
							)}
						</button>
						{showError.isError ? (
							<mark className="form__error-element">
								{showError.errorMessage}
							</mark>
						) : null}
					</form>
					<ul
						// нужно чтобы форма не закрывалась при клике внутри неё
						onMouseDown={(e) => {
							if (
								e.currentTarget.classList.contains(
									'form__history-list'
								)
							) {
								e.preventDefault();
							}
						}}
						style={
							linksMenuOpen &&
							!showError.isError &&
							linksElements &&
							linksElements.length > 0
								? { display: 'block' }
								: { display: 'none' }
						}
						className="form__history-list">
						{linksElements}
					</ul>
				</div>
			) : (
				<AudioPlayer
					url={link}
					setLinks={setLinks}
					back={() => setShowPlayer(false)}
				/>
			)}
		</>
	);
};

export default Form;
