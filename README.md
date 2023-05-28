- Без js страница адаптивна и корректно отображается, но отсутствует функционал. 
- Вместо «Insert the link» отображается выделенная красным фраза «You need enable javascript»
- Фон формы становится более тусклым и с ней нельзя взаимодействовать.
- Переключение табов невозможно.
- Если js включен, то форма заменяется на React элемент.
- Валидация формы пропускает только названия формате «http://» или «https://» и наличием символов, исключая пробел. 
- Потом валидация ссылки с запросом на url, в это время кнопка не активна и показывается лоадер.
- При неверной ссылке показывается сообщение с типом ошибки.
- При успешной валидации открывается плеер с источником аудио из ссылки.
- При буферизации показывается лоадер в виде бегущей линии.
- Так же прогресс бар показывает не только текущее время, но и прогресс буферизации.
- Прогресс бар и регулятор громкости можно изменять с помощью кликов и перетаскивания, как мышкой, так и на тач-экранах.
- По нажатию “Back”, пользователь возвращается к форме.
- Ссылки, прошедшие валидацию, сохраняются в localStorage и под формой ввода отображаются последние 4.
- Их можно выбрать стрелочками на клавиатуре и подставить, нажав enter.
- Иллюстрации автоматически соединяются линиями, их может быть произвольное количество. Но только две колонки и иллюстрации должны быть одинакового размера, в пределах своей колонки. 
- Таблица реализованы с помощью тега table. 

В проекте использовались:
- React, TypeScript и CSS модули.
- Сборщик Vite
- Autoprefixer

https://splendid-madeleine-c15712.netlify.app - результат

https://github.com/nickfluffybr/test-assignment-open-media - исходный код


Реализованные дополнительные задания:

6. Реализовать отображение истории запросов (введённых источников).
