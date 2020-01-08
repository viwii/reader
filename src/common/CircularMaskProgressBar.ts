//圆形遮罩进度条
export class CircularMaskProgressBar extends Laya.EventDispatcher {
    _percent: number;
    _totalTime: number;
    sa: number;
    ea: number;
    _isReverse: boolean;
    target: any;
    mx: any;
    my: any;
    rad: any;
    label: any;
    mask: any;
    update: any;
    tween: laya.utils.Tween;
    constructor(isReverse = true) {
        super();
        this._percent = 0;
        this._totalTime = 1e3;
        this.sa = -89;
        this.ea = 269;
        this._isReverse = true;
        this._isReverse = isReverse;
    }
    get totalTime() {
        return this._totalTime;
    }
    set totalTime(value) {
        if (this._totalTime == value) return;
        this._totalTime = value;
    }
    get isReverse() {
        return this._isReverse;
    }
    set isReverse(value) {
        if (this._isReverse == value) return;
        this._isReverse = value;
    }
    bindTarget(target, mx, my, rad, label) {
        if (this.target) this.target.off(Laya.Event.UNDISPLAY, this, this.dispose);
        if (target) target.off(Laya.Event.UNDISPLAY, this, this.dispose);
        this.target = target;
        target.once(Laya.Event.UNDISPLAY, this, this.dispose);
        this.mx = mx;
        this.my = my;
        this.rad = rad || target.width / 2;
        label && (this.label = label);
        this.updateValue();
    }
    set percent(value) {
        if (this._percent == value) return;
        this._percent = value;
        this.updateValue();
    }
    get percent() {
        return this._percent;
    }
    get currentAngle() {
        let angle = this._percent * this.totalAngle;
        return this._isReverse ? this.ea - angle : this.sa + angle;
    }
    updateValue() {
        if (!this.mask) {
            this.mask = new Laya.Sprite();
        }
        let g = this.mask.graphics;
        g.clear();
        let angle = this._percent * this.totalAngle;
        if (this._percent < 1) {
            if (!this._isReverse) {
                g.drawPie(this.mx, this.my, this.rad, this.sa, this.sa + angle, "#ff0000");
            } else {
                g.drawPie(this.mx, this.my, this.rad, this.ea - angle, this.ea, "#ff0000");
            }
        } else {
            g.drawCircle(this.mx, this.my, this.rad, "#ff0000");
        }
        this.target && (this.target.mask = this.mask);
        this.label && (this.label.text = Math.floor(this._percent * 100) + "%");
        this.update && this.update.run();
        this.event(Laya.Event.CHANGED);
    }
    tweenValue(value, duration, complete) {
        this.clearTween();
        duration = duration || (value - this._percent) * this._totalTime;
        this.tween = Laya.Tween.to(this, {
            percent: value
        }, duration, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
            complete && complete.run();
            this.tween = null;
        }));
    }
    clearTween() {
        if (this.tween) {
            this.tween.clear();
            this.tween = null;
        }
    }
    set startAngle(value) {
        this.sa = value;
    }
    set endAngle(value) {
        this.ea = value;
    }
    get totalAngle() {
        return this.ea - this.sa;
    }
    dispose() {
        this.clearTween();
        if (this.target) this.target.off(Laya.Event.UNDISPLAY, this, this.dispose);
        this.target && (this.target.mask = null);
        this.target = null;
        this.mask && this.mask.destroy(true);
        this.mask = null;
        this.label && this.label.destroy(true);
        this.label = null;
        this.update = undefined;
    }
}