export function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise(res => {
        const img = new Image();
        img.addEventListener('load', () => {
            res(img);
        });
        img.src = path;
    });
}
