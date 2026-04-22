import { useSettingsStore } from '../store/useSettingsStore';

type Translations = {
  [key: string]: {
    en: string;
    ru: string;
  };
};

export const translations: Translations = {
  'Quick Links': { en: 'Quick Links', ru: 'Быстрые ссылки' },
  'Favorites': { en: 'Favorites', ru: 'Избранное' },
  'Add Link': { en: 'Add Link', ru: 'Добавить ссылку' },
  'Timer': { en: 'Timer', ru: 'Таймер' },
  'Settings': { en: 'Settings', ru: 'Настройки' },
  'Toggle Theme': { en: 'Toggle Theme', ru: 'Сменить тему' },
  'History': { en: 'History', ru: 'История' },
  'Appearance': { en: 'Appearance', ru: 'Внешний вид' },
  'Language': { en: 'Language', ru: 'Язык' },
  'Weather Sidebar': { en: 'Weather Sidebar', ru: 'Виджет Погоды' },
  'Show daily and weekly forecast widget.': { en: 'Show daily and weekly forecast widget.', ru: 'Показывать виджет ежедневной и еженедельной погоды.' },
  'Quick Notes Sidebar': { en: 'Quick Notes Sidebar', ru: 'Заметки' },
  'Show scratchpad for temporary notes.': { en: 'Show scratchpad for temporary notes.', ru: 'Показывать блокнот для быстрых заметок.' },
  'Track Action History': { en: 'Track Action History', ru: 'История Действий' },
  'Keep a local log of recent searches and link clicks.': { en: 'Keep a local log of recent searches and link clicks.', ru: 'Вести локальный журнал недавних поисков и переходов по ссылкам.' },
  'Eco Mode': { en: 'Eco Mode', ru: 'Эко-режим' },
  'Disable heavy animations and blurs to save battery and increase performance.': { en: 'Disable heavy animations and blurs to save battery and increase performance.', ru: 'Отключать тяжелые анимации и блюр для экономии заряда и увеличения производительности.' },
  'Font Family': { en: 'Font Family', ru: 'Шрифт' },
  'Custom Wallpaper URL': { en: 'Custom Wallpaper URL', ru: 'URL Своих Обоев' },
  'Leave empty to use the dynamic Aurora background.': { en: 'Leave empty to use the dynamic Aurora background.', ru: 'Оставьте пустым для использования динамического фона Аврора.' },
  'Recent Actions': { en: 'Recent Actions', ru: 'Недавние действия' },
  'Clear all': { en: 'Clear all', ru: 'Очистить' },
  'No history recorded yet.': { en: 'No history recorded yet.', ru: 'История пока пуста.' },
  'Search the web...': { en: 'Search the web...', ru: 'Поиск...' },
  'What\'s on your mind?': { en: 'What\'s on your mind?', ru: 'О чём думаете?' },
  'Daily Focus': { en: 'Daily Focus', ru: 'Главная задача на день' },
  'Edit': { en: 'Edit', ru: 'Редактировать' },
  'Pin': { en: 'Pin', ru: 'Закрепить' },
  'Unpin': { en: 'Unpin', ru: 'Открепить' },
  'Delete': { en: 'Delete', ru: 'Удалить' },
  'Title': { en: 'Title', ru: 'Название' },
  'URL': { en: 'URL', ru: 'Ссылка (URL)' },
  'Group': { en: 'Group', ru: 'Группа' },
  'Save Changes': { en: 'Save Changes', ru: 'Сохранить Изменения' },
  'Type a command or search...': { en: 'Type a command or search...', ru: 'Введите команду или поисковый запрос...' },
  'Open Weather': { en: 'Open Weather', ru: 'Открыть погоду' },
  'Open Notes': { en: 'Open Notes', ru: 'Открыть заметки' },
  'Start Pomodoro': { en: 'Start Pomodoro', ru: 'Запустить Помодоро' },
  'Change Theme': { en: 'Change Theme', ru: 'Сменить тему' },
  'FOCUS': { en: 'FOCUS', ru: 'ФОКУС' },
  'BREAK': { en: 'BREAK', ru: 'ОТДЫХ' },
  'min': { en: 'min', ru: 'мин' },
  'Good morning': { en: 'Good morning', ru: 'Доброе утро' },
  'Good afternoon': { en: 'Good afternoon', ru: 'Добрый день' },
  'Good evening': { en: 'Good evening', ru: 'Добрый вечер' },
  'Good night': { en: 'Good night', ru: 'Доброй ночи' },
  'Set your daily focus': { en: 'Set your daily focus', ru: 'Установите главную цель на день' },
  'Search Google...': { en: 'Search Google...', ru: 'Поиск...' },
  'Current Weather': { en: 'Current Weather', ru: 'Текущая погода' },
  'Feels like': { en: 'Feels like', ru: 'Ощущается как' },
  'TODAY': { en: 'TODAY', ru: 'СЕГОДНЯ' },
  '7-DAY FORECAST': { en: '7-DAY FORECAST', ru: 'ПРОГНОЗ НА 7 ДНЕЙ' },
  'Today': { en: 'Today', ru: 'Сегодня' },
  'Weather': { en: 'Weather', ru: 'Погода' },
  'Search...': { en: 'Search...', ru: 'Поиск...' },
  'Search YouTube...': { en: 'Search YouTube...', ru: 'Искать в YouTube...' },
  'Search GitHub...': { en: 'Search GitHub...', ru: 'Искать в GitHub...' },
  'Select Search Engine': { en: 'Select Search Engine', ru: 'Выберите Поисковик' },
  'Search with': { en: 'Search with', ru: 'Искать в' },
  'Notes': { en: 'Notes', ru: 'Заметки' },
  'Quick Notes': { en: 'Quick Notes', ru: 'Быстрые Заметки' },
  'Saved locally': { en: 'Saved locally', ru: 'Сохраняется на устройстве' },
  'Write your notes here... (Saves automatically)': { en: 'Write your notes here... (Saves automatically)', ru: 'Пишите ваши мысли тут... (Всё сохраняется автоматически)' }
};

export function useTranslation() {
  const language = useSettingsStore(s => s.language) || 'ru';
  
  return (key: string) => {
    if (!translations[key]) {
      console.warn(`Missing translation for key: "${key}"`);
      return key;
    }
    return translations[key][language] || translations[key].en;
  };
}
