import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { FishData } from "../datas/FishData";
import { BulletNode } from "./BulletNode";

export class TrackBulletNode extends BulletNode{
    lockFishId: number;
    loopInterval: number;
    daoDanHandler: any;
    isCaught: boolean;
    trackFish: any;
    rotation: number;
    seatIndex: any;
    y: number;
    x: number;
    constructor() {
        super();
        this.lockFishId = 0;
        this.loopInterval = 40;
        this.daoDanHandler = undefined;
    }
    doTrackFire(trackFish) {
        if (this.isCaught || !this.lockFishId) return;
        this.trackFish = trackFish;
        Laya.timer.loop(this.loopInterval, this, this.trackLoop);
    }
    trackLoop() {
        if (this.isCaught) {
            this.destroy();
            return;
        }
        var trackPos = new Laya.Point(0, 0);
        if (!this.trackFish || this.trackFish.beginDead || !this.trackFish.isInScreen) {
            Laya.timer.clear(this, this.trackLoop);
            this.trackFish = null;
            this.lockFishId = 0;
            var angle = 90 - this.rotation;
            this.shootTo(angle);
            return;
        } else {
            var pos = GlobalFunc.changeLockP(this.trackFish);
            trackPos = new Laya.Point(pos.x, pos.y);
        }
        var speed = GlobalFunc.getBulletSpeed();
        var distance = GlobalFunc.pGetDistance(this, trackPos);
        if (distance <= 50) {
            this.showNet(this.trackFish);
            var isSelf = this.seatIndex == FishData.mySeatIndex;
            this.trackFish.onCaught(isSelf);
            Laya.timer.clear(this, this.trackLoop);
        } else {
            var duration = distance / speed * 1e3;
            //这里因为要转换为gl坐标的y,height-y ，所以y是反过来的
                                var angle = Math.atan2(this.y - trackPos.y, trackPos.x - this.x) / Math.PI * 180;
            let minus = 90 - angle - this.rotation;
            if (Math.abs(minus) > 1) {
                this.rotation = minus > 1 ? this.rotation + 1 : this.rotation - 1;
            } else {
                this.rotation = 90 - angle;
            }
            Laya.Tween.to(this, {
                x: trackPos.x,
                y: trackPos.y
            }, duration / 1.5);
        }
    }
}