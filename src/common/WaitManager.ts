import GlobalConst from "../const/GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import {ui} from "../ui/layaMaxUI"

export class WaitManager{
    overTimeStr: number;
    maxWaitTime: number;
    waitEvent: string;
    waitTimeCount: number;
    waitState: number;
    loadingLayer: any;
    maskNode: any;
    static _Instance:any;
    static get Instance(){
        if (WaitManager._Instance == null){
            WaitManager._Instance = new WaitManager;
        }

        return WaitManager._Instance;
    }
    constructor() {
        this.overTimeStr = 0;
    }

    init() {
        var _this = this;
        this.maxWaitTime = 5;
        this.waitEvent = "";
        this.waitTimeCount = 0;
        this.waitState = 0;
        this.loadingLayer = new ui.common.commonWaitingNodeUI();
        this.loadingLayer.ani1.play(0, true);
        this.loadingLayer.mouseThrough = false;
        this.loadingLayer.mouseEnabled = true;
        Laya.stage.addChild(this.loadingLayer);
        this.loadingLayer.zOrder = 6000;
        this.loadingLayer.visible = false;
        this.ShowMaskLayer(this.loadingLayer, undefined, new Laya.Handler(this, function() {
            _this.loadingLayer.visible = false;
        }));
        this.maskNode = this.loadingLayer.getChildByName("mask");
        // this.maskNode.visible = false;
        this.loadingLayer.box1.visible = false;
        this.loadingLayer.box2.visible = false;
        this.loadingLayer.box3.visible = true;
    };
    //特殊时候直接强制关闭，但是不推荐这么做
    HideWaitingImageForce() {
        Laya.stage.timer.clear(this, this.checkWaitState);
        this.waitEvent = "";
        this.maxWaitTime = 0;
        this.waitTimeCount = 0;
        this.loadingLayer && (this.loadingLayer.visible = false);
        this.waitState = 0;
        this.overTimeStr = 0;
    };
    //根据等待名来决定是否隐藏
    hideWaitLayer(waitName) {
        if (waitName != this.waitEvent) return;
        this.HideWaitingImageForce();
    };

    FshowWaitMaskLayer(waitName, maxTime) {
        if (maxTime === void 0) {
            maxTime = 5;
        }
        this.loadingLayer.visible = true;
        this.maxWaitTime = maxTime;
        this.waitEvent = waitName;
        this.waitState = 0;
        this.waitTimeCount = 0;
        this.maskNode.visible = true;
        Laya.stage.timer.loop(1e3, this, this.checkWaitState);
    };
    showWaitLayer(waitName, maxTime, overTimeStr) {
        console.log("showWaitLayer!");
        if (this.loadingLayer.visible) return;
        if (maxTime === void 0) {
            maxTime = 60;
        }
        this.loadingLayer.visible = true;
        this.maxWaitTime = maxTime;
        this.overTimeStr = overTimeStr;
        this.waitEvent = waitName;
        this.waitState = 0;
        this.waitTimeCount = 0;
        this.maskNode && (this.maskNode.visible = false);
        Laya.stage.timer.loop(1e3, this, this.checkWaitState);
    };
    checkWaitState() {
        this.waitTimeCount++;
        if (this.waitTimeCount >= this.maxWaitTime) {
            this.HideWaitingImageForce();
            EventDis.Instance.dispatchEvent("wait_overTime", this.overTimeStr);
        }
    };
    //可以设置是否点击空白触发回调，关闭父窗口
    ShowMaskLayer(node, isMask, clickHandler) {
        console.log("ShowMaskLayer!");
        if (isMask === void 0) {
            isMask = true;
        }
        if (clickHandler === void 0) {
            clickHandler = null;
        }
        var spr = new Laya.Sprite();
        spr.zOrder = -1;
        // g_SceneManager.addToLayer(spr,GlobalConst.maskLayer);
                            node.addChild(spr);
        spr.alpha = .65;
        var graphics = new Laya.Graphics();
        graphics.drawRect(0, 0, GlobalConst.stageW, GlobalConst.stageH, "#000000");
        spr.graphics = graphics;
        spr.size(GlobalConst.stageW, GlobalConst.stageH);
        var hitArea = new Laya.HitArea();
        hitArea.hit = graphics;
        spr.hitArea = hitArea;
        spr.name = "mask";
        if (!isMask) {
            spr.on(Laya.Event.CLICK, null, function() {
                spr.removeSelf();
                if (clickHandler) {
                    clickHandler.run();
                }
            });
        }
    };
}