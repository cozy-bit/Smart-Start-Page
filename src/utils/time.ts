import { format } from 'date-fns';

export function getGreeting(date: Date): { text: string; icon: string } {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: '🌅' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', icon: '☀️' };
  } else if (hour >= 17 && hour < 22) {
    return { text: 'Good evening', icon: '🌇' };
  } else {
    return { text: 'Good night', icon: '🌙' };
  }
}

export function formatTime(date: Date): string {
  // 14:30
  return format(date, 'HH:mm');
}

export function formatDate(date: Date): string {
  // Monday, April 14
  return format(date, 'EEEE, MMMM do');
}
