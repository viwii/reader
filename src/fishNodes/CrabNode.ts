import { FishNode } from "./FishNode";
import { UIUtils } from "../game/utils/UIUtils";
import { ConfigerHelper } from "../Helpers/ConfigerHelper";
import { BattleData } from "../datas/BattleData";
import { FishLineData } from "../datas/FishLineData";
import { SceneManager } from "../common/SceneManager";
import GlobalConst from "../const/GlobalConst";
import { FishData } from "../datas/FishData";
import { EventDis } from "../Helpers/EventDis";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";

/**
 * 螃蟹boss类
 */ 
export class CrabNode extends FishNode{
    flipAngle: number;
    lineId: any;
    constructor() {
        super();
        this.flipAngle = 0;
        //若鱼线翻转，则角度加180
    }
    initFish(param) {
        this.isNotLeaving = true;
        this.visible = false;
        this.lineIdx = "pangxie";
        this.fishUniqId = param.fishUniqId;
        this.name = "fish" + this.fishUniqId;
        this.type = 27;
        this.lineSpeed = 20;
        this._showScale = 2;
        this.scale(this._showScale, this._showScale);
        this.deadPos = new Laya.Point();
        this.lastPos = new Laya.Point();
        this.lockPsInside = ConfigerHelper.Instance.getCachedValueByKey("fishlocker", [ "lock", this.type, "lock" ]);
        this.configInfo = ConfigerHelper.Instance.getCachedValue("fish", "FishTypeID", this.type, "fish");
        this.characterType = Number(this.configInfo.type);
        this.zOrder = this.configInfo.top * 10;
        this.frameName = this.configInfo.Res;
        this.lineId = param.lineId;
        this.interval = Number(this.configInfo.framespeed);
        this.hasDead = this.beginDead = false;
        this.flipAngle = BattleData.Instance.isFlip ? 180 : 0;
        this.pointItem = FishLineData.Instance.fishLineObj[this.lineIdx];
        var startDiff = param.startDiff || 0;
        this.frameName = this.configInfo.Res;
        UIUtils.createFish(this.frameName, this.configInfo.FrameCount, this, () => {
            FishData.fishNodesObj[this.fishUniqId] = this;
            SceneManager.Instance.addToLayer(this, GlobalConst.roLayer);
            this.fishShow(!startDiff);
            this.curStep = this.getStepByTime(0, startDiff);
            this.keepOnLine();
            Laya.timer.once(this.lineSpeed * 2, this, function() {
                this.visible = true;
            });
            EventDis.Instance.addEvntListener("leave_room", this, this.destroy);
            EventDis.Instance.addEvntListener("switchSceneId", this, this.destroy);
        });
    }
    updateFishLine() {
        let isOnShow = Laya.stage.isVisibility;
        if (this.isOnHide && !isOnShow) return;
        !isOnShow && !this.isOnHide && this.fishOnHide();
        this.isOnHide && isOnShow && this.fishOnShow();
        var curStep = this.getLineStep();
        if (curStep >= this.pointItem.length) {
            this.deadPos.x = this.x;
            this.deadPos.y = this.y;
            EventDis.Instance.dispatchEvent("fishDead", this.fishUniqId);
            this.destroy();
            return;
        }
        var item = this.pointItem[curStep];
        var pos = {
            x: item[0],
            y: item[1]
        };
        var frameRate = item[2] * 2;
        //帧速
        // var stayTime = item[3] * 1000; //停留时间
        var flip = item[4];
        //掉头不翻转
        var speed = item[5];
        //游动速率
        this.transPos(pos);
        // this.updateNum++ % 2 == 0 &&
                        this.getCrabDir(pos, this.lastPos, flip);
        this.lastPos.x = pos.x;
        this.lastPos.y = pos.y;
        this.pos(pos.x, pos.y);
        this.updateLockP();
        this.checkFrame(frameRate);
        // this.checkStay(stayTime);
                        this.checkSpeed(speed);
    }
    getLineStep() {
        return this.curStep++;
    }

    transPos(pos?, type?) {
        pos.x *= GlobalConst.stageW;
        pos.y *= GlobalConst.stageH;
        if (this.lineId == 0) {
            pos.x = GlobalConst.stageW - pos.x;
            pos.y = GlobalConst.stageH - pos.y;
        }
        if (BattleData.Instance.isFlip) {
            pos.y = 750 - pos.y;
        }
    }
    getCrabDir(pos, lastPos, flip) {
        if (!this.lastPos) return;
        var angle = GlobalFunc.radToangle(Math.atan2(pos.y - lastPos.y, pos.x - lastPos.x)) + this.flipAngle;
        if (flip != 0) {
            this.rotation = angle;
        } else {
            this.rotation = angle - 180;
        }
    }
    checkFrame(frameRate) {
        if (frameRate != this.interval) {
            this.setInterVal(frameRate);
        }
    }
    checkStay(stayTime) {
        if (stayTime != 0) {
            Laya.timer.clear(this, this.updateFishLine);
            Laya.timer.once(stayTime, this, this.keepOnLine);
        }
    }
    checkSpeed(speed) {
        if (speed != this.lineSpeed) {
            this.lineSpeed = speed;
            this.keepOnLine();
        }
    }
    pauseLine() {
        Laya.timer.clear(this, this.updateFishLine);
        Laya.timer.clear(this, this.keepOnLine);
        this.stopInterval();
    }
    //根据偏移时间求出当前step
    getStepByTime(startStep, passTime) {
        var sumTime = 0;
        for (var i = startStep; i < this.pointItem.length; ++i) {
            if (sumTime >= passTime) break;
            // sumTime += (this.pointItem[i][3] * 1000 + this.pointItem[i][5]);
                                sumTime += this.pointItem[i][5];
        }
        return i;
    }
    fishOnShow() {
        this.isOnHide = false;
        var nowTime = GlobalFunc.getClientTime();
        var deltaTime = nowTime - this.hideTime;
        this.curStep = this.getStepByTime(this.curStep, deltaTime);
        this.keepOnLine();
        // this.visible = true;
                }
    fishOnHide() {
        this.isOnHide = true;
        this.hideTime = GlobalFunc.getClientTime();
        // this.visible = false;
                }
}