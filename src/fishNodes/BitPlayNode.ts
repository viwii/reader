import { EventDis } from "../Helpers/EventDis";
import { FishData } from "../datas/FishData";
import { BattleData } from "../datas/BattleData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalVar from "../const/GlobalVar";
import { SceneManager } from "../common/SceneManager";
import GlobalConst from "../const/GlobalConst";
import { NetManager } from "../netWork/NetManager";
import { SoundManager } from "../common/SoundManager";
import { PlayerData } from "../datas/PlayerData";
import { MathFunc } from "../const/MathFunc";
import { BitBulletNode } from "../bulletNodes/BitBulletNode";
import { BulletType } from "./BulletFactory";

/**
 * 钻头鱼玩法类
 */

export class BitPlayNode{
    timerCount: number;
    readyShoot: boolean;
    flipRatio: number;
    _countDownImg: any;
    _countDownNum: any;
    _launchTip: any;
    _isFlip: boolean;
    isPlaySound: boolean;
    bitBullet: any;
    _bitImg: any;
    isSelfBit: boolean;
    isCanMove: any;
    name: string;
    _bitWaitAni: Laya.Animation;
    seatIndex: any;
    constructor() {
        this.timerCount = 10;
        this.readyShoot = false;
        this.flipRatio = 1;
        // private _isHD: boolean = !!window["Laya3D"];
                        this._countDownImg = null;
        this._countDownNum = null;
        this._launchTip = null;
        this._isFlip = false;
        // private _bitBoom: Laya.ShuriKenParticle3D; //钻头爆炸粒子
        // private _bitReady: Laya.ShuriKenParticle3D; //钻头待发射粒子
        // private src_bitBoom = "lizi/bitBoom/BitCrab_Boom.lh"; //钻头爆炸粒子路径
        // private src_bitReady = "lizi/bitReady/BitCrab_01.lh"; //钻头待发射粒子路径
        this.isPlaySound = false;
        //是否播放音效
                }
    destroy() {
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        !!this.bitBullet && this.bitBullet.destroy();
        !!this._bitImg && this._bitImg.destroy();
        this.bitBullet = null;
        this.isSelfBit && (FishData.isSelfBitTime = false);
        BattleData.Instance.setPlayerSpecialState(false, this.seatIndex, "isBitting");
        if (this.isSelfBit) {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        }
    }
    onMouseDown() {
        FishData.isTouching = true;
        this.readyShoot = true;
        this.clearLaunchTip();
    }
    onMouseMove() {
        if (!this.isCanMove || !FishData.isTouching) return;
        var angle = GlobalFunc.getMyCannonAngle();
        if (!angle) return;
        var myCannon = FishData.mySeatNode.cannonNode;
        myCannon.justRotate(angle);
        // if (this._isHD && this._bitReady) {
        //     var rad = globalFun.angleToRad(angle);
        //     var seatPos = globalFun.getSeatPos()[this.seatIndex];
        //     var inVec = new Laya.Vector3(seatPos.x + 265 * Math.cos(rad), seatPos.y + this.flipRatio * 265 * Math.sin(rad));
        //     var outVec = new Laya.Vector3();
        //     FishData.camera.convertScreenCoordToOrthographicCoord(inVec, outVec);
        //     this._bitReady.transform.position = outVec;
        // }
    }
    onMouseUp() {
        FishData.isTouching = false;
        this.readyShoot && this.isCanMove && this.bitLaunchSend();
    }
    initEvent() {
        if (this.isSelfBit) {
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        }
        EventDis.Instance.addEvntListener("bitBackNotice", this, this.bitLaunchBack);
        EventDis.Instance.addEvntListener(GlobalVar.BIT_BOOM, this, this.boomOver);
        EventDis.Instance.addEvntListener("leave_room", this, this.destroy);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_SPECIAL_FISH_END, this, this.recBitBoom);
        EventDis.Instance.addEvntListener("player_leave_room", this, this.checkLeave);
    }
    checkLeave(data) {
        let seatIndex = data.room_pos + 1;
        if (seatIndex == this.seatIndex) this.destroy();
    }
    //开始钻头玩法
    beginBitPlay(pos, seatIndex) {
        this.seatIndex = seatIndex;
        this.isPlaySound = seatIndex == FishData.mySeatIndex;
        this.name = "bitPlay" + this.seatIndex;
        BattleData.Instance.setPlayerSpecialState(true, this.seatIndex, "isBitting");
        this.isSelfBit = (this.seatIndex == FishData.mySeatIndex);
        this.isCanMove = !this.isSelfBit;
        this._isFlip = FishData.seatNodes[seatIndex].isSeatFlip;
        this.flipRatio = this._isFlip ? 1 : -1;
        if (this.isSelfBit) {
            FishData.isSelfBitTime = true;
            // g_EventDis.dispatchEvent("bitPlayBegin");
        }
        this.initEvent();
        this.bitImgFly(pos);
        // this._isHD && this.loadParticle();
    }
    //钻头图片飞向座位
    bitImgFly(pos) {
        this._bitImg = new Laya.Image(Laya.ResourceVersion.addVersionPrefix("bullets/zuantou5.png"));
        this._bitImg.anchorX = this._bitImg.anchorY = .5;
        this._bitImg.pos(pos.x, pos.y);
        this._bitImg.zOrder = 1e3;
        if (this._isFlip) this._bitImg.rotation += 180;
        SceneManager.Instance.addToLayer(this._bitImg, GlobalConst.effectLayer);
        var endPos = GlobalFunc.getCannonPos()[this.seatIndex];
        let endy = endPos.y + 73 * this.flipRatio;
        var midx = (endPos.x + this._bitImg.x) / 2;
        var midy = (endy + this._bitImg.y) / 2;
        var props1 = {
            x: midx,
            y: midy,
            scaleX: 1.8,
            scaleY: 1.8
        };
        var props2 = {
            x: endPos.x,
            y: endy,
            scaleX: 1,
            scaleY: 1
        };
        this._bitWaitAni = new Laya.Animation();
        Laya.Tween.to(this._bitImg, props1, 1e3);
        Laya.timer.once(1e3, this, function() {
            Laya.Tween.to(this._bitImg, props2, 500);
        });
        Laya.timer.once(1500, this, function() {
            this._bitImg.destroy();
            //这里为了容错别人发钻头网络延迟，导致打死钻头和发射钻头消息在短时间内同时收到
                                if (!this._bitWaitAni) {
                var seatNode = FishData.seatNodes[this.seatIndex];
                seatNode.cannonNode.offOrdinaryCannon();
                seatNode.numPanel.openZtPanel();
                return;
            }
            this.bitWait(endPos);
            this.isSelfBit && this.bitCD();
        });
        // this.isPlaySound && g_SoundManager.playSound(GlobalConst.Sud_drill_addgun, 1);
                }
    //钻头等待发射动画
    bitWait(pos) {
        var seatNode = FishData.seatNodes[this.seatIndex];
        seatNode.cannonNode.offOrdinaryCannon();
        seatNode.numPanel.closePaoBeiUI();
        seatNode.numPanel.openZtPanel();
        // this._bitWaitAni = new Laya.Animation();
                        let url = Laya.ResourceVersion.addVersionPrefix("animation/bitWait.ani");
        this._bitWaitAni.loadAnimation(url, null, Laya.ResourceVersion.addVersionPrefix("res/atlas2/animation/bitWait.atlas"));
        this._bitWaitAni.play(0, true);
        seatNode.cannonNode.addSpecialCannon(this._bitWaitAni);
        let waitAni = GlobalFunc.getAni("bitWaitFire");
        waitAni.blendMode = "lighter";
        this._bitWaitAni.addChild(waitAni);
        waitAni.play();
        waitAni.pos(47, 0);
        //等待状态的火焰粒子
        // if (!this._isHD) return;
        // var angle = FishData.seatNodes[this.seatIndex].cannonNode.gCannonAngle;
        // var rad = globalFun.angleToRad(angle);
        // var seatPos = globalFun.getSeatPos()[this.seatIndex];
        // var inVec = new Laya.Vector3(seatPos.x + Math.cos(rad) * 265, seatPos.y + this.flipRatio * Math.sin(rad) * 265);
        // var outVec = new Laya.Vector3();
        // FishData.camera.convertScreenCoordToOrthographicCoord(inVec, outVec);
        // this._bitReady.transform.position = outVec;
        // var particle: Laya.ShuriKenParticle3D = this._bitReady.getChildAt(0) as Laya.ShuriKenParticle3D;
        // particle.particleSystem.play();
        // var particle2: Laya.ShuriKenParticle3D = particle.getChildAt(0) as Laya.ShuriKenParticle3D;
        // particle2.particleSystem.play();
        // for (var i in particle2._children) {
        //     var particlei = particle2._children[i];
        //     particlei.particleSystem.play();
        // }
                }
    //钻头结束恢复座位
    seatResume() {
        var seatNode = FishData.seatNodes[this.seatIndex];
        seatNode.cannonNode.onOrdinaryCannon();
        seatNode.numPanel.closeZtPanel();
        let playerInfo = BattleData.Instance.roomPlayerData[FishData.mySeatIndex];
        playerInfo.isDragonCannon == -1 && seatNode.numPanel.openPaoBeiUI();
    }
    //钻头cd时间
    bitCD() {
        this.launchTip();
        this.isCanMove = true;
        this.timerCount = GlobalConst.bitCountDownSec;
        Laya.timer.loop(1e3, this, this.timerFunc);
        this.isPlaySound && SoundManager.Instance.playSound(GlobalConst.Sud_drill_uncon, 0);
    }
    launchTip() {
        this._launchTip = new Laya.Sprite();
        SceneManager.Instance.addToMiddLayer(this._launchTip, GlobalConst.effectLayer);
        let img_bg = this._launchTip.addChild(new Laya.Image(Laya.ResourceVersion.addVersionPrefix("noZip/img_bg_14.png")));
        img_bg.centerX = img_bg.centerY = 0;
        let label_tip = this._launchTip.addChild(new Laya.Label("按住屏幕调整方向，抬起，发射钻头"));
        label_tip.font = "SimHei";
        label_tip.fontSize = 36;
        label_tip.bold = true;
        label_tip.color = "#c2e7ff";
        label_tip.centerX = label_tip.centerY = 0;
        label_tip.stroke = 4;
        label_tip.strokeColor = "#0b3170";
    }
    clearLaunchTip() {
        if (!this._launchTip || this._launchTip.destroyed) return;
        this._launchTip.destroy();
    }
    timerFunc() {
        this.timerCount--;
        if (this.timerCount <= 5) {
            if (!this._countDownImg) {
                let tmpIndex = this.seatIndex <= 2 ? this.seatIndex : this.seatIndex - 2;
                let cannon_pos = PlayerData.Instance.getItemFlyPos(3, tmpIndex);
                this._countDownImg = new Laya.Image(Laya.ResourceVersion.addVersionPrefix("res/icon/img_zt_cnt.png"));
                this._countDownNum = new Laya.Label(this.timerCount + "");
                this._countDownNum.font = "numberFont1";
                this._countDownNum.fontSize = 30;
                this._countDownNum.anchorX = .5;
                this._countDownNum.anchorY = .5;
                this._countDownNum.pos(cannon_pos.x, cannon_pos.y - 250);
                this._countDownImg.pos(cannon_pos.x, cannon_pos.y - 340);
                this._countDownImg.anchorX = .5;
                this._countDownImg.anchorY = .5;
                SceneManager.Instance.addToLayer(this._countDownImg, GlobalConst.effectLayer);
                SceneManager.Instance.addToLayer(this._countDownNum, GlobalConst.effectLayer);
            } else {
                this._countDownNum.text = this.timerCount + "";
            }
        }
        this.timerCount <= 0 && this.bitLaunchSend();
    }
    //发射钻头
    bitLaunchSend() {
        Laya.timer.clear(this, this.timerFunc);
        this.clearLaunchTip();
        !!this._countDownImg && this._countDownImg.destroy();
        !!this._countDownNum && this._countDownNum.destroy();
        this.isCanMove = false;
        var angle = FishData.mySeatNode.cannonNode.gCannonAngle;
        let data = {
            bullet_id: 99999,
            bullet_type: BulletType.bullet_type_zuantou,
            rotation_angle: angle
        };
        NetManager.Instance.reqShoot(data);
    }
    //发射钻头后端返回
    bitLaunchBack(data) {
        let uid = data.uid;
        let seatIndex = BattleData.Instance.getUserSeatByUid(uid);
        if (this.seatIndex != seatIndex) return;
        this._bitWaitAni.removeSelf();
        this._bitWaitAni = null;
        // this._isHD && this._bitReady.destroy(true);
        this.createBitBullet(data);
        this.isPlaySound && SoundManager.Instance.stopSound(GlobalConst.Sud_drill_uncon);
        // this.isPlaySound && g_SoundManager.playSound(GlobalConst.Sud_drill_shoot, 1);
    }
    //创建钻头子弹
    createBitBullet(data) {
        var seatIndex = this.seatIndex;
        var angle = data.rotation_angle;
        if (this._isFlip) angle = -(angle + 180) % 180;
        var bulletIndex = data.bullet_id;
        this.bitBullet = new BitBulletNode();
        var bitParam = {
            bulletIndex: bulletIndex,
            angle: angle,
            seatIndex: seatIndex
        };
        this.bitBullet.initBitBullet(bitParam);
        var bitPos = GlobalFunc.getSeatPos()[seatIndex];
        this.bitBullet.pos(bitPos.x, bitPos.y + this.flipRatio * (50 + 47 - 20));
        this.bitBullet.shootTo();
        SceneManager.Instance.addToLayer(this.bitBullet, GlobalConst.bulletLayer);
        GlobalFunc.globalSetZorder(this.bitBullet, 5500);
        var cannon = FishData.seatNodes[seatIndex];
        cannon && cannon.cannonNode && cannon.cannonNode.justRotate(angle);
        Laya.timer.once(GlobalConst.bitFlyTime1 + GlobalConst.bitFlyTime2, this, function() {
            EventDis.Instance.dispatchEvent(GlobalVar.BIT_BOOM, this.seatIndex);
        });
        this.isSelfBit && Laya.timer.loop(50, this, this.updateGame);
    }
    //钻头爆炸
    boomOver(seatIndex) {
        if (seatIndex != this.seatIndex) return;
        if (!this.bitBullet) return;
        // if (this._isHD) {
        //     var particle: Laya.ShuriKenParticle3D = this._bitBoom.getChildAt(0).getChildAt(0) as Laya.ShuriKenParticle3D;
        //     FishData.camera.convertScreenCoordToOrthographicCoord(new Laya.Vector3(this.bitBullet.x, this.bitBullet.y), particle.transform.position);
        //     particle.particleSystem.play();
        //     var playTime = particle.particleSystem.duration;
        //     for (var i in particle._children) {
        //         var particlei = particle._children[i];
        //         playTime = Math.max(playTime, particlei.particleSystem.duration);
        //         particlei.transform.position = particle.transform.position;
        //         particlei.particleSystem.play();
        //     }
        // }
        let bombAni = GlobalFunc.getAni("bitFishBoomBg", 1.4);
        bombAni.pos(this.bitBullet.x, this.bitBullet.y);
        SceneManager.Instance.addToLayer(bombAni, GlobalConst.effectLayer);
        bombAni.play(0, false);
        bombAni.blendMode = "lighter";
        this.isPlaySound && SoundManager.Instance.playSound(GlobalConst.Sud_drill_bomb, 1);
        this.isSelfBit && this.sendBitBoom();
        this.bitBullet.destroy();
        this.bitBullet = null;
    }
    //发送钻头爆炸
    sendBitBoom() {
        let radius = GlobalConst.bitBoomRadius;
        let fish_ids = MathFunc.getFishsInCircle(this.bitBullet.x, this.bitBullet.y, radius, FishData.fishNodesObj);
        NetManager.Instance.reqBitBomb({
            fish_ids: fish_ids
        });
    }
    //钻头爆炸返回
    recBitBoom(data) {
        let uid = data.uid;
        let seatIndex = BattleData.Instance.getUserSeatByUid(uid);
        if (seatIndex != this.seatIndex) return;
        let fishInfo = data.special_fish_info;
        if (!fishInfo) return;
        let specData = fishInfo.data;
        if (!specData) return;
        let bombFishes = specData.zuantou_bomb_fishs;
        let gold = specData.total_gold;
        let diamond = specData.total_diamond;
        for (let i = 0; i < bombFishes.length; ++i) {
            let fish_id = bombFishes[i].fish_id;
            let drop_data = bombFishes[i].drop_data;
            if (!drop_data) continue;
            drop_data.items = GlobalFunc.transGoldItem(drop_data.items);
            let param = {
                uid: uid,
                fish_id: fish_id,
                drops: drop_data,
                gold: gold,
                diamond: diamond
            };
            EventDis.Instance.dispatchEvent("killFish_broad", param);
        }
        this.seatResume();
        this.destroy();
    }
    //钻头碰撞
    updateGame() {
        for (var fishIndex in FishData.fishNodesObj) {
            var fish = FishData.fishNodesObj[fishIndex];
            if (!fish) continue;
            if (!this.bitBullet || this.bitBullet.getFlyState() == 2) {
                Laya.timer.clear(this, this.updateGame);
                return;
            }
            //这里同一个鱼，从碰撞开始到离开鱼身体最多检测一次
                                if (GlobalFunc.isBulletHitFish(this.bitBullet, fish)) {
                if (fish.isBitHitting) continue;
                fish.isBitHitting = true;
            } else if (fish.isBitHitting) {
                fish.isBitHitting = false;
            }
            if (!fish.isBitHitting) continue;
            let data = {
                bulletId: 99999,
                fishUniqId: fish.fishUniqId
            };
            NetManager.Instance.reqHit(data);
            this.bitBullet.hitEffect();
            break;
        }
    }
}