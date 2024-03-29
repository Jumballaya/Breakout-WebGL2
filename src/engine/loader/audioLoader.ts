const BASE = import.meta.env.BASE_URL || '/';

export function loadAudio(path: string): Promise<HTMLAudioElement> {
    const audio = new Audio();
    return new Promise(res => {
        audio.addEventListener('canplaythrough', () => {
            res(audio)
        });
        audio.src = BASE + path;
    });
}
