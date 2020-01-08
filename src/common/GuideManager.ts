import { EventDis } from "../Helpers/EventDis";

export class GuideManager{
    enable: boolean;
    componets: any[];
    guideStep: number;
    isForce: boolean;
    isDisLock: boolean;
    isDisFreeze: boolean;
    type: any;
    gameContainer: Laya.Sprite;
    hitArea: Laya.HitArea;
    interactionArea: Laya.Sprite;
    guideContainer: Laya.Sprite;
    guideDatas: any;
    viewFinger:any;
    static _Instance:any;
    static get Instance(){
        if (GuideManager._Instance == null){
            GuideManager._Instance = new GuideManager;
        }

        return GuideManager._Instance;
    }
    constructor() {
        this.enable = true;
        this.componets = [];
        this.guideStep = 0;
        this.isForce = true;
        //强制引导有黑底，必须点圈
                        this.isDisLock = false;
        this.isDisFreeze = false;
        this.enable = true;
    }
    initGuide(type, componets, isForce = true) {
        this.type = type;
        this.isForce = isForce;
        this.componets = componets;
        this.gameContainer = new Laya.Sprite();
        this.gameContainer.width = Laya.stage.width;
        this.gameContainer.height = Laya.stage.height;
        Laya.stage.addChild(this.gameContainer);
        this.gameContainer.on(Laya.Event.CLICK, this, this.doGuide);
        Laya.stage.removeChild(this.viewFinger);
        // Laya.stage.removeChild(this.viewTip);
        // this.viewTip = new GuideTipView(desc);
        // this.viewTip.visible = !!desc && (desc != "");
        //this.viewFinger = new GuideFinger_1.GuideFinger();
        this.viewFinger.x -= 100;
        // this.viewTip.x = FishData.mySeatNode.x;
        // this.viewTip.bottom = 150;
                        this.hitArea = new Laya.HitArea();
        this.hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        this.interactionArea = new Laya.Sprite();
        this.interactionArea.blendMode = "destination-out";
        var maskArea = new Laya.Sprite();
        this.guideContainer = new Laya.Sprite();
        this.guideContainer.cacheAs = "bitmap";
        maskArea.alpha = .5;
        maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        if (isForce) {
            Laya.stage.addChild(this.guideContainer);
            this.guideContainer.addChild(maskArea);
        }
        this.guideContainer.mouseEnabled = true;
        this.guideContainer.hitArea = this.hitArea;
        //设置叠加模式
                        this.guideContainer.addChild(this.interactionArea);
        Laya.stage.addChild(this.viewFinger);
        this.doGuide();
    }
    doGuide() {
        if (this.guideStep == this.componets.length) {
            EventDis.Instance.delAllEvnt(this);
            Laya.timer.clearAll(this);
            Laya.stage.removeChild(this.guideContainer);
            Laya.stage.removeChild(this.gameContainer);
            Laya.stage.removeChild(this.viewFinger);
            this.componets[this.guideStep - 1].handle.run();
            //多个点击的时候最后一个
                                this.guideStep = 0;
        } else {
            this.updatePos();
            if (this.isForce) {
                this.hitArea.unHit.clear();
                let x = this.viewFinger.x + this.viewFinger.width / 2;
                let y = this.viewFinger.y + this.viewFinger.height / 2;
                this.interactionArea.graphics.clear();
                this.interactionArea.graphics.drawCircle(x, y, 90, "#000000");
                this.hitArea.unHit.drawCircle(x, y, 90, "#000000");
            }
            this.guideStep++;
        }
    }
    updatePos() {
        let target = this.componets[this.guideStep];
        if (target.isMiddle) {
            this.viewFinger.centerX = 50;
            this.viewFinger.centerY = 0;
            return;
        }
        this.viewFinger.x = target.pos.x - this.viewFinger.width / 2 + target.width / 2;
        this.viewFinger.y = target.pos.y - this.viewFinger.height / 2 + target.height / 2;
    }
    getGuideData(type) {
        return this.guideDatas[type];
    }
    close() {
        this.guideStep = 0;
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
        Laya.stage.removeChild(this.guideContainer);
        Laya.stage.removeChild(this.gameContainer);
        Laya.stage.removeChild(this.viewFinger);
    }
}