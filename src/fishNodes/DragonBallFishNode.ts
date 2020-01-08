import { FishNode } from "./FishNode";
import { UIUtils } from "../game/utils/UIUtils";
import { FishData } from "../datas/FishData";
import GlobalConst from "../const/GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import { SceneManager } from "../common/SceneManager";

export class DragonBallFishNode extends FishNode{
    dragonBody: Laya.Image;
    constructor() {
        super();
    }
    fishShow(isTween) {
        this.body = new Laya.Animation();
        this.body.blendMode = "lighter";
        this.addChild(this.body);
        this.startPlay();
        if (isTween) {
            this.scale(.1, .1);
            Laya.Tween.to(this, {
                scaleX: this._showScale,
                scaleY: this._showScale
            }, 400);
        }
        let src = "res/icon/fish290_body.png";
        this.dragonBody = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(src));
        this.dragonBody.pos(-200, -180);
        this.addChild(this.dragonBody);
    }
    //鱼死亡动画
    deadAction(callBack, seatIndex) {
        // if (!this.body) return;
        var attribute = {
            alpha: 0
        };
        if (!!this.specialFishData) {
            // UIUtils.showDisplay("DragonInterface", this, () => {
            //     let dialog = new DragonInterface(seatIndex != undefined ? seatIndex : FishData.mySeatIndex);
            //     // this.body.interval = 120;
            //                             this.setInterVal(120);
            //     Laya.Tween.to(this.dragonBody, attribute, 1e3, laya.utils.Ease.quadOut, Laya.Handler.create(this, this.doOpenInterface, [ dialog ]));
            // });
        } else {
            Laya.Tween.to(this.dragonBody, attribute, 1e3);
            Laya.Tween.to(this.body, attribute, 1e3, undefined, Laya.Handler.create(this, this.doDestroy));
        }
        !!callBack && callBack.run();
    }
    /**打开五龙寻宝弹窗 */            
    doOpenInterface(dialog) {
        Laya.timer.once(800, this, () => {
            let pos = this.body.localToGlobal(new Laya.Point(this.selfW / 2, this.selfH / 2));
            this.body.removeSelf();
            dialog.init(pos, this.body, this.specialFishData);
            SceneManager.Instance.addToMiddLayer(dialog, GlobalConst.dialogLayer);
            this.doDestroy();
        });
    }
    doDestroy() {
        EventDis.Instance.dispatchEvent("fishDead", this.fishUniqId);
        this.removeSelf();
        this.destroy();
    }
}