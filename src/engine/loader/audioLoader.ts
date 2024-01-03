export function loadAudio(path: string): Promise<HTMLAudioElement> {
    const audio = new Audio();
    return new Promise(res => {
        audio.addEventListener('canplaythrough', () => {
            res(audio)
        });
        audio.src = path;
    });
}
