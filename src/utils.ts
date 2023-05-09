import { dev } from '$app/environment';

export const scheme = dev ? "http" : "https";

export function getAudioElement() {
  const elem = document.getElementById('audio-source');
  if (elem === null) {
    return null;
  }
  return elem as HTMLAudioElement;
}

export function calculateMinuteSecond(seconds: number) {
  let secs = Math.floor(seconds);
  let secsLeftover = secs % 60;
  let minutes = (secs - secsLeftover) / 60;

  let secondsFormatted = secsLeftover < 10 ? `0${secsLeftover}` : `${secsLeftover}`;
  let minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${minutesFormatted}:${secondsFormatted}`;
}

export function interceptKeys(extraActions: [string, () => void][] = []): (event: KeyboardEvent) => void {
  return (event) => {
    const tagName = document.activeElement?.tagName ?? '';
    const audio = getAudioElement();
    const actions = new Map([
      ...extraActions,
      ['Space', () => {
        if (audio !== null) {
          audio.paused ? audio.play() : audio.pause();
        }
      }],
      ['KeyM', () => {
        if (audio !== null) {
          audio.muted = !audio.muted;
        }
      }],
      [
        'ArrowLeft',
        () => {
          if (audio !== null) {
            audio.currentTime -= 5;
          }
        }
      ],
      [
        'ArrowRight',
        () => {
          const audio = getAudioElement();
          if (audio !== null) {
            audio.currentTime += 5;
          }
        }
      ]
    ]);
    if (tagName !== 'INPUT' && actions.has(event.code)) {
      event.preventDefault();
      event.stopPropagation();
      const action = actions.get(event.code) ?? null;
      if (action !== null) {
        action();
      }
    }
  }
}