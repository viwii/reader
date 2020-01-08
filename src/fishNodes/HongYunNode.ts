import { SpecialCannonNode } from "./SpecialCannonNode";
import { FishData } from "../datas/FishData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { EventDis } from "../Helpers/EventDis";
import GlobalConst from "../const/GlobalConst";
import GlobalVar from "../const/GlobalVar";
import { BattleData } from "../datas/BattleData";
import { UIUtils } from "../game/utils/UIUtils";
import { SceneManager } from "../common/SceneManager";
import { NetManager } from "../netWork/NetManager";

export class HongYunNode extends SpecialCannonNode {
    score: { score: number; };
    isPlaySound: boolean;
    seatIndex: any;
    startAni: any;
    overAni: any;
    body: any;
    leftBullet: any;
    btnLayer: any;
    rotationNode: any;
    /**鸿运当头 */
    constructor(seat, data) {
        super(seat);
        /**当前鸿运分数 */                
        this.score = {
            score: 0
        };
        /**是否播放音效 */                
        this.isPlaySound = false;
        // hongyun_left_pao
        // hongyun_total_gold
        this.seatIndex = seat;
        this.isPlaySound = seat == FishData.mySeatIndex;
        EventDis.Instance.dispatchEvent(GlobalVar.HY_CHANGE);
        this.startAni = GlobalFunc.getAni("hongYunStart");
        this.overAni = GlobalFunc.getAni("hongYunOver");
        this.body = GlobalFunc.getAni("HongYunCannon");
        this.seatPanel.openHyPanel();
        this.seatPanel.closePaoBeiUI();
        if (this.seat == FishData.mySeatIndex) {
            EventDis.Instance.dispatchEvent(GlobalVar.LAST_BULLET_VIEW_OPEN, {
                name: "鸿运子弹",
                bulletNum: data.hongyun_left_pao,
                node: this,
                timing: GlobalConst.specialFishEndTime
            });
        }
        EventDis.Instance.dispatchEvent(GlobalVar.ADD_NOTICE_TO_LIST);
        EventDis.Instance.addEvntListener(GlobalVar.HONG_YUN_SCORE_UPDATE, this, this.updateScore);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_SPECIAL_FISH_AUTO_END, this, this.sendGameOver);
        this.score.score = this.roomPlayerData.hyScore = data.hongyun_total_gold;
        this.leftBullet = this.roomPlayerData.leftHyBullet = data.hongyun_left_pao ? data.hongyun_left_pao : 0;
        BattleData.Instance.setPlayerSpecialState(true, seat, "isHongYun");
        this.seatPanel.text_hyNum.text = this.score.score;
        this.cannonNode.hongYunNode = this;
        if (seat == FishData.mySeatIndex) {
            FishData.isSelfHyTime = true;
            FishData.hyCanFire = false;
        }
        Laya.timer.frameLoop(3, this, this.refreshScore);
        this.listenAniEvent();
    }
    destroy() {
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        if (this.body) {
            this.body.removeSelf();
            this.body.destroy();
            this.body = undefined;
        }
        this.seatPanel.closeHyPanel();
        this.seatPanel.openPaoBeiUI();
        this.seat == FishData.mySeatIndex && this.btnLayer.closeBoxSurplus();
        this.btnLayer = undefined;
        if (this.seat == FishData.mySeatIndex) {
            FishData.isSelfHyTime = false;
        }
        this.cannonNode.onOrdinaryCannon();
        this.cannonNode.deleteHongYun();
        this.cannonNode.hongYunNode = undefined;
        if (this.startAni) {
            this.startAni.removeSelf();
            this.startAni.destroy();
            this.startAni = undefined;
        }
        if (this.overAni) {
            this.overAni.removeSelf();
            this.overAni.destroy();
            this.overAni = undefined;
        }
        if (this.rotationNode) {
            this.rotationNode.removeSelf();
            this.rotationNode.destroy();
            this.rotationNode = undefined;
        }
    }
    /**监听动画事件 */            listenAniEvent() {
        this.body.on(Laya.Event.LABEL, this, label => {
            if (label == "fireOver") {
                this.body.play(0, true, "hy_wait");
            }
        });
        this.startAni.on(Laya.Event.LABEL, this, label => {
            if (label == "startFinish") {
                this.startAni.removeSelf();
                this.startAni.destroy();
                this.startAni = undefined;
                this.gameStart();
            }
        });
        this.overAni.on(Laya.Event.LABEL, this, label => {
            if (label == "overFinish") {
                this.overAni.removeSelf();
                this.overAni.destroy();
                this.overAni = undefined;
                this.destroy();
            }
        });
    }
    /**初始化body */            initBody() {}
    /**
* 鸿运飞向炮座动画
* @param pos 鱼死亡坐标
*/            
cannonFlyAni(pos) {
        // UIUtils.showDisplay("hongYunRotation", this, () => {
        //     this.rotationNode = any;//= new layaMaxUI_1.ui.roomScene.hongYunRotationUI();
        //     this.rotationNode.pos(pos.x, pos.y);
        //     this.rotationNode.ani1.on(Laya.Event.LABEL, this, this.playflyAni);
        //     this.rotationNode.ani1.on(Laya.Event.COMPLETE, this, this.readyStart);
        //     SceneManager.Instance.addToLayer(this.rotationNode, GlobalConst.effectLayer);
        //     this.rotationNode.ani1.play(0, false);
        //     this.rotationNode.ani1.on(Laya.Event.LABEL, this, this.playStromSound);
        // });
    }
    playStromSound(label) {
        if (label == "hyStormSound" && this.isPlaySound) {
            // g_SoundManager.playSound(GlobalConst.Sud_get_Firestorm, 1);
        }
    }
    /**播放飞行动画 */            
    playflyAni(label) {
        if (label == "startFly") {
            let pos = GlobalFunc.getCannonPos()[this.seat];
            Laya.Tween.to(this.rotationNode, {
                x: pos.x,
                y: pos.y - 100
            }, 500, Laya.Ease.quadOut);
        }
    }
    /**将鸿运炮管添加到炮座节点 */            
    addCannon() {
        this.cannonNode.offOrdinaryCannon();
        this.cannonNode.addSpecialCannon(this.body);
        if (this.body) {
            this.body.play(0, true, "hy_wait");
        } else {
            if (!BattleData.Instance.roomPlayerData[this.seat].isInRoom) {
                return -1;
            }
        }
        if (this.isPlaySound) {
            // g_SoundManager.playSound(GlobalConst.Sud_storm_addgun, 1);
        }
    }
    /**准备开始游戏 */            
    readyStart() {
        if (this.rotationNode) {
            this.rotationNode.removeSelf();
            this.rotationNode.destroyChildren();
            this.rotationNode.destroy();
            this.rotationNode = undefined;
        }
        if (this.addCannon() == -1) {
            this.destroy();
            return;
        }
        this.startAni.x = 100;
        this.overAni.x = 100;
        this.seatPanel.addChild(this.startAni);
        this.startAni.play(0, false);
    }
    /**游戏开始 */            gameStart() {
        if (this.seat == FishData.mySeatIndex) {
            FishData.hyCanFire = true;
        }
    }
    /**停止开火 */            fireStop() {
        if (this.seat == FishData.mySeatIndex) {
            FishData.hyCanFire = false;
        }
    }
    /**发送后端游戏结束事件 */            
    sendGameOver() {
        NetManager.Instance.reqHydtGameFinish();
    }
    /**鸿运当头时间结束 */            hyTimeFinish() {
        Laya.timer.clear(this, this.refreshScore);
        this.seatPanel.addChild(this.overAni);
        this.overAni.play(0, false);
        BattleData.Instance.setPlayerSpecialState(false, this.seat, "isHongYun");
        this.roomPlayerData.leftHyBullet = 0;
    }
    /**设置剩余子弹 */            setLeftButtle(num) {
        this.leftBullet = num;
        this.seat == FishData.mySeatIndex && this.btnLayer.setSurplusNum(num);
        this.roomPlayerData.leftHyBullet = num;
    }
    /**更新鸿运分数 */            updateScore(data) {
        if (data.seat == this.seat) {
            Laya.Tween.to(this.score, {
                score: data.score
            }, 300);
        }
    }
    /**刷新分数显示 */            refreshScore() {
        this.seatPanel.text_hyNum.text = Math.floor(this.score.score).toString();
        if (this.leftBullet <= 0) {
            this.fireStop();
        }
    }
    /**场景构建 */            sceneBuild() {
        this.addCannon();
    }
}