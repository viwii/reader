import GlobalVar from "../const/GlobalVar";
import { EventDis } from "../Helpers/EventDis";
import { CircularMaskProgressBar } from "../common/CircularMaskProgressBar";

export class CountDownNode /*extends layaMaxUI_1.ui.roleNodes.CountDownNodeUI*/ {
    maskNode: any;
    lastTime: number;
    withAni: boolean;
    minTime: number;
    timeStop: boolean;
    ani_0: any;
    ani_1: any;
    text_lastTime: any;
    text_lastTime_light: any;
    destroyed: boolean;
    constructor(lastTime, withAni = false) {
        //super();
        this.maskNode = new CircularMaskProgressBar();
        this.lastTime = 0;
        this.withAni = false;
        this.minTime = 5;
        this.timeStop = false;
        this.lastTime = lastTime;
        this.minTime = lastTime > 30 ? 10 : 5;
        this.withAni = withAni;
        this.setUI();
    }
    /**开始倒计时 */            
    startTiming() {
        // this.maskNode.percent = 1;//进度条遮罩
        // this.maskNode.tweenValue(0.05, this.lastTime * 1000);//进度条遮罩
        Laya.timer.loop(1e3, this, this._CurrentSecondTiming);
    }
    /**当前秒计时 */            
    _CurrentSecondTiming() {
        if (this.lastTime == 1) {
            Laya.timer.clearAll(this);
        }
        this.playtimeAni();
    }
    /**播放数字跳动动画 */            
    playtimeAni() {
        this.lastTime--;
        this.setUI();
        if (this.lastTime <= 0) {
            this.playDestroyAni();
            EventDis.Instance.dispatchEvent(GlobalVar.ROOM_SPECIAL_FISH_AUTO_END);
            return;
        }
        if (this.lastTime > this.minTime) {
            this.ani_0.play(0, false);
        } else {
            this.ani_1.play(0, false);
        }
    }
    /**设置显示数字 */            setUI() {
        this.text_lastTime.text = this.text_lastTime_light.text = this.lastTime.toString();
        if (this.lastTime == 0) return;
    }
    /**播放消失动画 */            playDestroyAni() {
        this.timeStop = true;
        Laya.timer.clearAll(this);
        Laya.Tween.to(this, {
            alpha: 0
        }, 500, undefined, new Laya.Handler(this, this.doDestroy));
        this.doDestroy();
    }
    doDestroy() {
        // this.maskNode.dispose();//进度条遮罩
        // this.maskNode = undefined;//进度条遮罩
        Laya.timer.clearAll(this);
        this.destroy();
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
    /**停止倒计时 */            
    stopTiming() {
        if (!!!this || this.destroyed || this.lastTime <= 0 || this.timeStop) return;
        // this.maskNode.clearTween();//进度条遮罩
                        this.playDestroyAni();
    }
}