export class OpacityEasing {
    private readonly _elements: Element[];

    private _fadingIn: boolean = false;
    private _msecDuration: number = 0;
    private _doneCallback: Function | undefined;
    private _startTime: number | undefined;

    constructor(elements: Element[]) {
        this._elements = [...elements];
        this.update = this.update.bind(this);
    }

    public fadeIn(msecDuration: number, done: Function): void {
        this._fadingIn = true;
        this.fadeCore(msecDuration, done);
    }

    public fadeOut(msecDuration: number, done: Function): void {
        this._fadingIn = false;
        this.fadeCore(msecDuration, done);
    }

    private fadeCore(msecDuration: number, done: Function): void {
        this._msecDuration = msecDuration;
        this._doneCallback = done;

        requestAnimationFrame(this.update);
    }

    private update(time: number): void {
        if (this._startTime === undefined) {
            this._startTime = time;
        }

        const elapsed = time - this._startTime;
        const done = elapsed >= this._msecDuration;
        const fraction = Math.min(1.0, (elapsed * 1.0) / this._msecDuration);
        const opacity = this._fadingIn ? fraction : 1.0 - fraction;

        if (!done) {
            const opacityStr = opacity.toString();
            this._elements.forEach((e) => e.setAttribute("opacity", opacityStr));
        } else {
            const opacityStr = this._fadingIn ? "1.0" : "0.0";
            this._elements.forEach((e) => e.setAttribute("opacity", opacityStr));
            this._doneCallback!();
        }

        !done && requestAnimationFrame(this.update);
    }
}
