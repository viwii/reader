import { FishData } from "../datas/FishData";
import { EventDis } from "../Helpers/EventDis";
import { NetManager } from "../netWork/NetManager";
import { BattleData } from "../datas/BattleData";
import GlobalConst from "../const/GlobalConst";
import { GameData } from "../datas/GameData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { PlayerData } from "../datas/PlayerData";

export class SeatNumNode /*extends layaMaxUI_1.ui.roleNodes.SeatNumNodeUI*/ {
    seatIndex: number;
    name: string;
    roomPlayerInfo: any;
    imgBullet: any;
    imgFire: any;
    boxHelp: any;
    box_pochan: any;
    text_ztScore: any;
    text_hyNum: any;
    text_paobei: any;
    imgHelp: any;
    btn_plus: any;
    btn_reduce: any;
    aniHelp: any;
    lblHelp: any;
    ani_pochan: any;
    image_ztNum: any;
    imgae_hyNum: any;
    image_ztIcon: any;
    box_zuantou: any;
    box_hongYun: any;
    constructor(seatIndex) {
        //super();
        /**座位索引 */                
        this.seatIndex = 0;
        this.name = "numPanel" + seatIndex;
    }
    destroy() {
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
    /**初始化炮倍面板信息 */            
    init(seatIndex) {
        if (this.seatIndex == FishData.mySeatIndex) {
            EventDis.Instance.addEvntListener("paySuccess", this, data => {
                NetManager.Instance.reqChangePao({
                    pao: this.roomPlayerInfo.cur_pao
                });
            });
        }
        this.imgBullet.visible = this.imgFire.visible = false;
        this.boxHelp.visible = false;
        this.box_pochan.visible = false;
        this.seatIndex = seatIndex;
        this.roomPlayerInfo = BattleData.Instance.getSitInfo(seatIndex);
        if (this.seatIndex == FishData.mySeatIndex) {
            this.text_ztScore.font = GlobalConst.fontNum1;
            this.text_ztScore.scaleX = this.text_ztScore.scaleY = .38;
            this.text_hyNum.font = GlobalConst.fontNum1;
            this.text_hyNum.scaleX = this.text_hyNum.scaleY = .38;
            this.openPaoBeiUI();
        } else {
            this.text_ztScore.font = GlobalConst.fontNum2;
            this.text_ztScore.scaleX = this.text_ztScore.scaleY = .4;
            this.text_hyNum.font = GlobalConst.fontNum2;
            this.text_hyNum.scaleX = this.text_hyNum.scaleY = .4;
            this.closePaoBeiUI();
        }
        this.text_paobei.text = this.roomPlayerInfo.cur_pao.toString();
        this.closeZtPanel();
        this.closeHyPanel();
        this.initEvent();
        this.initUIEvent();
    }
    /**初始化事件 */            
    initEvent() {}
    /**初始化UI事件 */            
    initUIEvent() {
        if (this.seatIndex == FishData.mySeatIndex) {
            EventDis.Instance.addEvntListener("showHelp", this, this.showHelp);
            //救济金
                EventDis.Instance.addEvntListener("paySuccess", this, () => {
                if (this.seatIndex != FishData.mySeatIndex) return;
                this.boxHelp.visible = false;
                this.box_pochan.visible = false;
                GameData.Instance.isHelping = false;
            });
            EventDis.Instance.addEvntListener("bombReceive", this, () => {
                if (this.seatIndex != FishData.mySeatIndex) return;
                this.boxHelp.visible = false;
                this.box_pochan.visible = false;
                GameData.Instance.isHelping = false;
            });
            EventDis.Instance.addEvntListener("helpReward", this, () => {
                if (this.seatIndex != FishData.mySeatIndex) return;
                GameData.Instance.isHelping = false;
            });
            //救济金
                                this.imgHelp.on(Laya.Event.CLICK, this, () => {
                this.boxHelp.visible = false;
                this.box_pochan.visible = false;
                let end = GlobalFunc.getSeatInfoPos()[this.seatIndex];
                let param = {
                    characterType: 2,
                    startPoint: this.localToGlobal(new Laya.Point(this.boxHelp.x, this.boxHelp.y)),
                    endPoint: PlayerData.Instance.getItemFlyPos(GlobalConst.itemFlyRoomCoin, this.seatIndex),
                    aniName: "goldCoinAni",
                    seat: null,
                    isCommon: true
                };
                GlobalFunc.doItemFlyAni(param);
                NetManager.Instance.reqGetHelp();
            });
        }
        EventDis.Instance.addEvntListener("endHelping", this, () => {
            this.boxHelp.visible = false;
            this.box_pochan.visible = false;
        });
        this.btn_plus.on(Laya.Event.CLICK, this, this.changePaoBei, [ 1 ]);
        this.btn_reduce.on(Laya.Event.CLICK, this, this.changePaoBei, [ -1 ]);
    }
    localToGlobal(arg0: Laya.Point) {
        throw new Error("Method not implemented.");
    }
    showHelp() {
        if (this.seatIndex != FishData.mySeatIndex) return;
        this.boxHelp.visible = true;
        this.aniHelp.play(0, true);
        this.lblHelp.text = `(剩余 ${PlayerData.Instance.left_count} 次)`;
    }
    playPochanAni() {
        this.box_pochan.visible = true;
        this.ani_pochan.play(0, false);
    }
    destroyEvent() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
    }
    /**初始化翻转 */            
    initFlip() {
        this.text_paobei.rotation = 180;
        this.image_ztNum.rotation = 180;
        this.imgae_hyNum.rotation = 180;
        this.image_ztIcon.rotation = 180;
    }
    /**关闭炮倍UI */            
    closePaoBeiUI() {
        this.btn_plus.visible = false;
        this.btn_reduce.visible = false;
    }
    /**打开炮倍UI */            
    openPaoBeiUI() {
        if (this.seatIndex == FishData.mySeatIndex) {
            this.btn_plus.visible = true;
            this.btn_reduce.visible = true;
        }
    }
    /**关闭钻头面板 */            
    closeZtPanel() {
        this.box_zuantou.visible = false;
    }
    /**打开钻头面板 */            
    openZtPanel() {
        this.box_zuantou.visible = true;
    }
    /**更新钻头面板 */            
    updateZtPanel(num) {
        this.text_ztScore.text = num;
    }
    /**关闭鸿运面板 */            
    closeHyPanel() {
        this.box_hongYun.visible = false;
    }
    /**打开鸿运面板 */            
    openHyPanel() {
        this.box_hongYun.visible = true;
    }
    /**更变炮倍 */
    //changeDir:1 or -1
    changePaoBei(changeDir) {
        let roomPaoBei = BattleData.Instance.roomPaobei[BattleData.Instance.room_type];
        let currentIndex = 0;
        let currentPao = this.roomPlayerInfo.cur_pao;
        //找到当前
        for (let index = 0; index < roomPaoBei.length; index++) {
            let cur_pao = roomPaoBei[index];
            if (cur_pao == currentPao) {
                currentIndex = index;
                break;
            }
        }
        //循环切
        var maxIndex = roomPaoBei.length - 1;
        var minIndex = 0;
        var nextIndex = currentIndex + changeDir;
        nextIndex = GlobalFunc.getLoopValue(nextIndex, minIndex, maxIndex);
        let paoNum = roomPaoBei[nextIndex];
        var param = {
            pao: paoNum
        };
        let isVip = GlobalFunc.checkVipToFire(paoNum, false);
        if (isVip) {
            NetManager.Instance.reqChangePao(param);
        }
        this.roomPlayerInfo.cur_pao = paoNum;
        this.text_paobei.text = paoNum.toString();
    }
    /**切换炮倍后端返回 */            changePaoBack(data) {
        var paoNum = data.pao;
        this.roomPlayerInfo.cur_pao = paoNum;
        this.text_paobei.text = paoNum.toString();
    }
    /**更新炮倍显示 */            updatePao() {
        this.text_paobei.text = this.roomPlayerInfo.cur_pao + "";
    }
}