import { loadAudio } from "../loader/audioLoader";

export class AudioLibrary {
    private clips: Map<string, HTMLAudioElement>;

    constructor() {
        this.clips = new Map();
    }

    public get(name: string): any {
        return this.clips.get(name);
    }

    public async loadSound(name: string, path: string) {
        const audio = await loadAudio(path);
        this.clips.set(name, audio);
    }

    public play(name: string) {
       const found = this.clips.get(name);
       if (found) {
           found.currentTime = 0;
           found.play();
       }
    }
    
    public stop(name: string) {
       const found = this.clips.get(name);
       if (found) {
           found.pause();
           found.currentTime = 0;
       }
    }
}

