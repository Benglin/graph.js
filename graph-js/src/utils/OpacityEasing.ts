export interface EasingRange {
    msecDuration: number;
    min?: number;
    max?: number;
}

export class OpacityEasing {
    private readonly _elements: Element[];

    private _fadingIn: boolean = false;
    private _doneCallback: Function | undefined;
    private _startTime: number | undefined;
    private _range: EasingRange = { msecDuration: 300 };

    constructor(elements: Element[]) {
        this._elements = [...elements];
        this.update = this.update.bind(this);
    }

    public fadeIn(range: EasingRange, done: Function): void {
        this._fadingIn = true;
        this.fadeCore(range, done);
    }

    public fadeOut(range: EasingRange, done: Function): void {
        this._fadingIn = false;
        this.fadeCore(range, done);
    }

    private fadeCore(range: EasingRange, done: Function): void {
        this._range.msecDuration = range.msecDuration;
        this._range.min = range.min || 0.0;
        this._range.max = range.max || 1.0;
        this._doneCallback = done;

        requestAnimationFrame(this.update);
    }

    private update(time: number): void {
        if (this._startTime === undefined) {
            this._startTime = time;
        }

        const elapsed = time - this._startTime;
        const done = elapsed >= this._range.msecDuration;
        let fraction = Math.min(1.0, (elapsed * 1.0) / this._range.msecDuration);
        fraction = this._fadingIn ? fraction : 1.0 - fraction;

        const min = this._range.min as number;
        const max = this._range.max as number;
        const opacity = min + fraction * (max - min);

        if (!done) {
            const opacityStr = opacity.toString();
            this._elements.forEach((e) => e.setAttribute("opacity", opacityStr));
        } else {
            const min = this._range.min as number;
            const max = this._range.max as number;
            const opacityStr = this._fadingIn ? max : min;
            this._elements.forEach((e) => e.setAttribute("opacity", opacityStr.toString()));
            this._doneCallback!();
        }

        !done && requestAnimationFrame(this.update);
    }
}
