import { useCallback } from 'react';

type AlertLevel = 'info' | 'warning' | 'critical' | 'success';

const alertTone = (level: AlertLevel) => {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequency = level === 'critical' ? 760 : level === 'warning' ? 620 : level === 'success' ? 880 : 520;

    oscillator.type = level === 'critical' ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(level === 'critical' ? 0.13 : 0.08, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + (level === 'critical' ? 0.45 : 0.28));
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + (level === 'critical' ? 0.48 : 0.3));
    oscillator.onended = () => void context.close();
  } catch {
    // Audio is optional; restricted browser contexts can still show the UI alert.
  }
};

export const useMissionAlerts = () => {
  const announce = useCallback((title: string, message: string, level: AlertLevel = 'info') => {
    alertTone(level);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = level === 'critical' ? 0.85 : 1;
      window.speechSynthesis.speak(speech);
    }

    if ('Notification' in window) {
      const showNotification = () => {
        if (Notification.permission === 'granted') new Notification(title, { body: message, tag: 'aerorescue-mission-alert' });
      };
      if (Notification.permission === 'default') void Notification.requestPermission().then(showNotification);
      else showNotification();
    }
  }, []);

  return { announce };
};
