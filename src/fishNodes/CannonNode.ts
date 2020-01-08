import { BattleData } from "../datas/BattleData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { GameData } from "../datas/GameData";
import { FishData } from "../datas/FishData";
import GlobalVar from "../const/GlobalVar";
import { EventDis } from "../Helpers/EventDis";
import { PlayerData } from "../datas/PlayerData";
import { BulletType } from "./BulletFactory";
import { SoundManager } from "../common/SoundManager";
import GlobalConst from "../const/GlobalConst";
import { TimeLineManager } from "../const/TimeLineManager";

export class CannonNode /*extends layaMaxUI_1.ui.roleNodes.CannonNodeUI*/ {
    isCloseCannon: boolean;
    cannonRotation: number;
    gCannonAngle: number;
    isDragonStart: boolean;
    name: string;
    image_cannon: any;
    image_turret: any;
    hongYunNode: any;
    dragonCannonNode: any;
    seatIndex: any;
    uid: any;
    rotateCannon: any;
    specialCannon: any;
    cannonID: any;
    box_cannon: any;
    rotation: number;
    doFire: any;
    constructor(seatIndex) {
        //super();
        /*当前是否在用特殊炮管 */                
        this.isCloseCannon = false;
        /**炮管旋转的角度 */                
        this.cannonRotation = 0;
        /**炮管全局角度 */                
        this.gCannonAngle = 90;
        /**是否开启龙炮 */                
        this.isDragonStart = false;
        this.name = "cannonNode" + seatIndex;
        this.image_cannon.on(Laya.Event.CLICK, this, this.openHelpView);
        this.image_turret.on(Laya.Event.CLICK, this, this.openHelpView);
    }
    destroy() {
        if (this.hongYunNode) {
            this.hongYunNode.destroy();
        }
        if (this.dragonCannonNode) {
            this.dragonCannonNode.destroy();
        }
        this.destroyEvent();
        this.removeChildren();
        this.removeSelf();
    }
    removeChildren() {
        throw new Error("Method not implemented.");
    }
    removeSelf() {
        throw new Error("Method not implemented.");
    }
    /**初始化炮台炮座 */            
    init(seatData, seatIndex) {
        this.seatIndex = seatIndex;
        this.uid = BattleData.Instance.roomPlayerData[this.seatIndex].uid;
        this.changeSkin({
            uid: this.uid,
            pao_item: seatData.cur_pao_item
        });
        this.rotateCannon = this.image_cannon;
        let pos = GlobalFunc.getCannonPos();
        this.pos(pos[this.seatIndex].x, pos[this.seatIndex].y);
        this.initEvent();
        this.image_cannon.mouseEnabled = true;
        this.image_turret.mouseEnabled = true;
        // if (seatIndex != FishData.mySeatIndex) {
        //     this.mouseEnabled = false;
        // } else {
        //     this.mouseEnabled = true;
        // }
                }
    pos(x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    /**打开辅助面板 */            
    openHelpView() {
        if (GameData.Instance.isFirstLogin) return;
        var seatData = BattleData.Instance.getSitInfo(this.seatIndex);
        if (this.seatIndex == FishData.mySeatIndex && !seatData.isSpecialFishTime()) {
            EventDis.Instance.dispatchEvent(GlobalVar.CHANGE_ROOM_HELP_STATE);
        }
        if (this.seatIndex != FishData.mySeatIndex) {
            EventDis.Instance.dispatchEvent("other_node_click", this.seatIndex);
        }
    }
    /**事件监听 */            
    initEvent() {
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_SKIN_CHANGE_BROAD, this, this.changeSkin);
    }
    destroyEvent() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.image_cannon);
        Laya.Tween.clearAll(this.image_turret);
    }
    resetUI() {
        this.onOrdinaryCannon();
        if (this.hongYunNode) {
            this.hongYunNode.destroy();
            this.hongYunNode = undefined;
        }
        if (this.dragonCannonNode) {
            this.dragonCannonNode.destroy();
            this.dragonCannonNode = undefined;
        }
        this.isDragonStart = false;
        this.specialCannon.destroyChildren();
    }
    /**炮台炮座皮肤变更 */            changeSkin(data = undefined, fromDragonCannon = false) {
        console.log("炮台数据：" + data);
        if (!data) return;
        let seatIndex = BattleData.Instance.getUserSeatByUid(data.uid);
        if (seatIndex != this.seatIndex) return;
        if (!data.pao_item) return;
        // if (data && data.skinInfo) {
        this.cannonID = data.pao_item;
        // this.turretID = (this.cannonID % 100) + 200;
        PlayerData.Instance.changeCannon(this.seatIndex, this.cannonID);
        BattleData.Instance.roomPlayerData[this.seatIndex].cur_pao_item = this.cannonID;
        console.log("切换炮台皮肤...");
        let headUrl = "res/icon/skin_";
        this.image_cannon.loadImage(Laya.ResourceVersion.addVersionPrefix(headUrl + PlayerData.Instance.items[this.cannonID.toString()].skin), Laya.Handler.create(this, () => {
            this.image_cannon.pivotX = this.image_cannon.width / 2;
            this.image_cannon.pivotY = this.image_cannon.height * 9 / 10;
        }));
        this.image_turret.loadImage(Laya.ResourceVersion.addVersionPrefix("res/icon/skin_Turret_1.png"), Laya.Handler.create(this, () => {
            this.image_turret.pivotX = this.image_turret.width / 2;
            this.image_turret.pivotY = this.image_turret.height * 3 / 5;
        }));
        if (fromDragonCannon) {
            this.dragonCannonNode = undefined;
            this.isDragonStart = false;
        }
    }
    /**关闭普通炮座 */            
    offOrdinaryCannon(withAni = false, handler = undefined) {
        if (withAni) {
            Laya.Tween.to(this.image_cannon, {
                scaleX: 0,
                scaleY: 0,
                visible: false
            }, 300, Laya.Ease.backIn, new Laya.Handler(this, handler => {
                this.rotateCannon = undefined;
                this.isCloseCannon = true;
                this.image_cannon.scale(1, 1);
                if (handler) {
                    handler.run();
                }
            }, [ handler ]));
        } else {
            this.image_cannon.visible = false;
            this.rotateCannon = undefined;
            this.isCloseCannon = true;
        }
    }
    /**开启普通炮座 */            
    onOrdinaryCannon(withAni = false, handler = undefined) {
        this.image_cannon.visible = true;
        this.rotateCannon = this.image_cannon;
        this.isCloseCannon = false;
        if (withAni) {
            this.image_cannon.scale(0, 0);
            Laya.Tween.to(this.image_cannon, {
                scaleX: 1,
                scaleY: 1
            }, 300, Laya.Ease.backOut, new Laya.Handler(this, handler => {
                if (handler) {
                    handler.run();
                }
            }, [ handler ]));
        }
    }
    /**添加特殊炮管 */            
    addSpecialCannon(cannon) {
        this.specialCannon.visible = true;
        this.specialCannon.addChild(cannon);
        this.specialCannon.rotation = this.box_cannon.rotation;
        this.rotateCannon = this.specialCannon;
    }
    /**关闭特殊炮管 */            
    closeSpecialCannon() {
        this.specialCannon.visible = false;
        this.box_cannon.rotation = this.cannonRotation;
        this.specialCannon.destroyChildren();
        this.specialCannon.rotation = 0;
        this.specialCannon = undefined;
    }
    /**获取炮塔状态 */            
    isOrdinaryCannon() {
        return !this.isCloseCannon;
    }
    /**开启狂暴光圈 */
    // public startRage() {
    //     this.image_rage.visible = true;
    //     this.skillRotation.play(0, true);
    // }
    /**关闭狂暴光圈 */
    // public stopRage() {
    //     this.image_rage.visible = false;
    //     this.skillRotation.stop();
    // }
    // /**开启鸿运光圈 */
    // public startHongYun() {
    //     this.image_HongYun.visible = true;
    //     this.HongYunRotation.play(0, true);
    // }
    // /**关闭鸿运光圈 */
    // public stopHongYun() {
    //     this.image_HongYun.visible = false;
    //     this.HongYunRotation.stop();
    // }
    deleteHongYun() {
        this.hongYunNode = undefined;
    }
    /**开炮且旋转 */            
    rotateAndFire(angle, bulletType) {
        this.justRotate(angle);
        this.justFire(bulletType);
    }
    /**旋转 */            
    justRotate(angle) {
        this.gCannonAngle = angle;
        angle = this.rotation == 180 ? angle - 90 : 90 - angle;
        this.box_cannon.rotation = angle;
        this.image_turret.rotation = angle / 3;
        this.cannonRotation = angle;
        if (this.rotateCannon && this.rotateCannon != this.image_cannon && this.rotateCannon !== this.image_cannon) {
            this.rotateCannon.rotation = this.box_cannon.rotation;
        }
    }
    /**开炮 */            
    justFire(type = undefined) {
        var playerData = BattleData.Instance.roomPlayerData[this.seatIndex];
        if (type === BulletType.bullet_type_normal || type >= BulletType.bullet_type_qinglongpao) {
            //(this.seatIndex != FishData.mySeatIndex && &&!!!this.hongYunNode.body)
            this.doFire.play(0, false);
            if (this.isDragonStart && this.dragonCannonNode && this.dragonCannonNode.isSelf) {
                this.dragonCannonNode.setLeftButtle(this.dragonCannonNode.leftBullet - 1);
            }
            if (this.seatIndex == FishData.mySeatIndex) {
                SoundManager.Instance.playFireSound(GlobalConst.Sud_fire);
            }
        } else if (type === BulletType.bullet_type_hongyuan && playerData.isHongYun) {
            this.hongYunNode.body.stop();
            this.hongYunNode.body.play(0, false, "hy_fire");
            if (this.hongYunNode.leftBullet > 0) {
                this.hongYunNode.setLeftButtle(this.hongYunNode.leftBullet - 1);
                if (this.seatIndex == FishData.mySeatIndex) {
                    SoundManager.Instance.playFireSound(GlobalConst.Sud_storm_shoot);
                }
            }
        }
    }
    /**切换特殊炮管炮座皮肤 */            changeSpecialSkin(cannonSkin = undefined, turretSkin = undefined) {
        if (cannonSkin) {
            this.cannonAni(this.image_cannon, new Laya.Handler(this, () => {
                this.image_cannon.loadImage(Laya.ResourceVersion.addVersionPrefix(cannonSkin), Laya.Handler.create(this, () => {
                    this.image_cannon.pivotX = this.image_cannon.width / 2;
                    this.image_cannon.pivotY = this.image_cannon.height * 3 / 4;
                }));
            }));
        }
        if (turretSkin) {
            this.cannonAni(this.image_turret, new Laya.Handler(this, () => {
                this.image_turret.loadImage(Laya.ResourceVersion.addVersionPrefix(turretSkin), Laya.Handler.create(this, () => {
                    this.image_turret.pivotX = this.image_turret.width / 2;
                    this.image_turret.pivotY = this.image_turret.height * 3 / 4;
                    let a = new Laya.Sprite();
                    a.getBounds().intersects;
                }));
            }));
        }
    }
    /**
* 炮管炮座缩小放大动画
* @param node 播放动画的实例
* @param handler 缩小后的回调
*/            
cannonAni(node, handler) {
        let timeLine = TimeLineManager.Instance.creatTimeLine();
        timeLine.addLabel("small", 0).to(node, {
            scaleX: 0,
            scaleY: 0
        }, 200, Laya.Ease.backIn).addLabel("bag", 0).to(node, {
            scaleX: 1,
            scaleY: 1
        }, 200, Laya.Ease.backOut);
        timeLine.on(Laya.Event.LABEL, this, label => {
            if (label == "bag") {
                handler.run();
            }
        });
        timeLine.play(0, false);
    }
}