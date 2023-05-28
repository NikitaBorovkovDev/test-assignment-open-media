import { createRoot } from 'react-dom/client';
import Form from './components/Form';

document.addEventListener('DOMContentLoaded', () => {
	const domNode = document.getElementById('audio-player') as HTMLElement;
	const root = createRoot(domNode);
	root.render(<Form />);

	const buttons = Array.from(
		document.querySelectorAll('.technical-requirements__table-button')
	);
	const bodies = Array.from(
		document.querySelectorAll('.technical-requirements__table-body')
	);

	const activeButtonClass = 'technical-requirements__table-button_active';
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const isButton = target.closest(
			'.technical-requirements__table-button'
		);
		if (isButton && !isButton.classList.contains(activeButtonClass)) {
			buttons.forEach((button, buttonIndex) => {
				if (isButton === button) {
					buttons.forEach((item, index) => {
						if (index !== buttonIndex) {
							item.classList.remove(activeButtonClass);
						} else {
							item.classList.add(activeButtonClass);
						}
					});
					bodies.forEach((body, bodyIndex) => {
						if (bodyIndex !== buttonIndex) {
							body.classList.add('hide');
						} else {
							body.classList.remove('hide');
						}
					});
				}
			});
		}
	});
});
