import { GameModel } from "../game/GameModel";
import { EventDis } from "../Helpers/EventDis";
import GlobalConst from "../const/GlobalConst";
import { PlayerData } from "../datas/PlayerData";
import { FishData } from "../datas/FishData";
import GlobalVar from "../const/GlobalVar";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { GameData } from "../datas/GameData";
import { BattleData } from "../datas/BattleData";
import { NetManager } from "../netWork/NetManager";
import { TimeLineManager } from "../const/TimeLineManager";

export class SeatNodeInfo /*extends layaMaxUI_1.ui.roleNodes.seatInfoNodeUI*/ {
    seatIndex: number;
    extraGold: number;
    name: string;
    roomPlayerInfo: any;
    text_gold: any;
    text_ticket: any;
    box_info: any;
    box_gold: any;
    box_ticket: any;
    goldLight: any;
    ticketLight: any;
    constructor(seatIndex) {
        //super();
        /**位置索引 */                
        this.seatIndex = 0;
        this.extraGold = 0;
        this._init(seatIndex);
    }
    _init(seatIndex) {
        this.name = "seatInfoNode" + seatIndex;
        let data = GameModel.getJson("global_define");
        this.extraGold = +data.guidelimit;
        this.initEvent();
    }
    destroy() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
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
    initEvent() {
        EventDis.Instance.addEvntListener("killFish_broad", this, this.onItemChange);
        EventDis.Instance.addEvntListener("updateSeat", this, isself => {
            if (!this.roomPlayerInfo) return;
            this.roomPlayerInfo.gold = PlayerData.Instance.getItemNum(GlobalConst.GoldCoinID);
            this.roomPlayerInfo.ticket = PlayerData.Instance.getItemNum(GlobalConst.TicketID);
            if (isself && this.seatIndex != FishData.mySeatIndex) return;
            +this.text_gold.text != this.roomPlayerInfo.gold && this.updateGold(!!isself);
            +this.text_ticket.text != this.roomPlayerInfo.ticket && this.updateTicket(!!isself);
        });
        EventDis.Instance.addEvntListener(GlobalVar.UPDATE_ITEMS_NUM_FROM_PLAYERDATA, this, this.updateItemsNum);
    }
    /**初始化资源信息 */            init(seatIndex, doFilp) {
        this.seatIndex = seatIndex;
        this.getSitInfo();
        this.updateGold();
        this.updateTicket();
        if (doFilp) {
            this.box_info.rotation = 180;
            this.box_gold.rotation = 180;
            this.box_ticket.rotation = 180;
        }
        let pos = GlobalFunc.getSeatInfoPos();
        this.pos(pos[this.seatIndex].x, pos[this.seatIndex].y);
        if (seatIndex == FishData.mySeatIndex) {
            this.text_ticket.color = this.text_gold.color = "#ffde00";
            this.text_ticket.strokeColor = this.text_gold.strokeColor = "#5e2100";
        }
    }
    pos(x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    destroyEvent() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
    }
    /**
* 更新金币信息
* @param isGet 是否为获取金币
*/            updateGold(isGet = false) {
        if (!!!this.roomPlayerInfo && !this.getSitInfo()) return;
        if (!!!this.text_gold || this.text_gold.destroyed) return;
        this.text_gold.align = "right";
        this.text_gold.valign = "middle";
        this.text_gold.text = Math.max(0, this.roomPlayerInfo.gold).toString();
        if (isGet) {
            Laya.timer.once(2500, this, () => {
                this.playRefreshAni(1);
            });
        }
        // if (this.seatIndex == FishData.mySeatIndex) {
        //     let isSwitch = globalFun.getStorage("switchRoom2") as string;
        //     let isShow = g_battleData.room_type == 1 && +this.text_gold.text >= +g_battleData.roomData[2].mingolds + 2000;//2是2号房
        //     if (isShow && globalFun.getStorage("isSwitch") != "true" && g_battleData.isInRoom) {
        //         globalFun.setStorage("isSwitch", "true");
        //         g_EventDis.dispatchEvent("switchRoom2");
        //         globalFun.switchRoom(2);
        //     }
        // }
        if (GameData.Instance.Room2GuideSwitch && this.seatIndex == FishData.mySeatIndex && !GameData.Instance.roomguide && BattleData.Instance.room_type == 1 && +this.text_gold.text >= +BattleData.Instance.roomData[2].mingolds + this.extraGold) {
            // GlobalConst.isNeedGuide = false;
            GameData.Instance.roomguide = true;
            // globalFun.setStorage("isJumpRoom", "true");
            NetManager.Instance.reqGuideSend(0);
            GlobalFunc.switchRoom(2);
        }
    }
    /**
*更新奖券信息
* @param isGet 是否为获取钻奖券
*/            updateTicket(isGet = false) {
        this.text_ticket.align = "right";
        this.text_ticket.valign = "middle";
        this.text_ticket.text = (this.roomPlayerInfo.ticket ? this.roomPlayerInfo.ticket : 0).toString();
        if (isGet) {
            this.playRefreshAni(2);
        }
    }
    /**获取座位信息 */            
    getSitInfo() {
        this.roomPlayerInfo = BattleData.Instance.getSitInfo(this.seatIndex);
        if (this.roomPlayerInfo) {
            return true;
        }
        return false;
    }
    /**更新金币钻石信息从playerData中获取 */            
    updateItemsNum() {
        if (this.seatIndex == FishData.mySeatIndex) {
            if (!!!this.roomPlayerInfo && !this.getSitInfo()) return;
            this.roomPlayerInfo.gold = PlayerData.Instance.getItemNum(GlobalConst.GoldCoinID);
            this.roomPlayerInfo.ticket = PlayerData.Instance.getItemNum(GlobalConst.TicketID);
            this.updateGold(false);
            this.updateTicket(false);
        }
    }
    /**播放资源刷新动画(1.金币2.钻石)*/            
    playRefreshAni(index) {
        var target;
        if (index == 1) {
            target = this.box_gold;
        } else if (index == 2) {
            target = this.box_ticket;
        }
        var target1;
        if (index == 1) {
            target1 = this.goldLight;
        } else if (index == 2) {
            target1 = this.ticketLight;
        }
        if (target) {
            var timeLine = TimeLineManager.Instance.creatTimeLine();
            timeLine.addLabel("toBig", 0).to(target, {
                scaleX: 1.1,
                scaleY: 1.1
            }, 200, Laya.Ease.quadOut).addLabel("toSmall", 0).to(target, {
                scaleX: 1,
                scaleY: 1
            }, 200);
            timeLine.play();
        }
        if (target1) {
            var timeLine = TimeLineManager.Instance.creatTimeLine();
            timeLine.addLabel("lightOpen", 0).to(target1, {
                alpha: 1
            }, 200, Laya.Ease.quadOut).addLabel("lightClose", 0).to(target1, {
                alpha: 0
            }, 200, Laya.Ease.quadIn);
            timeLine.play();
        }
    }
    /**货币变化飘字 */            onItemChange(data) {
        if (this.seatIndex != FishData.mySeatIndex || data.uid != GameData.Instance.uid) return;
        Laya.timer.once(1500, this, () => {
            let items = data.drops.items;
            let item = items.filter(item => item.item_id == 1)[0];
            if (!item) return;
            let label = new Laya.Label();
            label.width = this.box_gold.width;
            label.font = GlobalConst.fontNum1;
            label.text = "+" + item.count;
            label.centerX = 0;
            label.anchorX = label.anchorY = .5;
            label.fontSize = 20;
            label.scale(.2, .2);
            label.align = "center";
            label.alpha = .5;
            label.centerY = -10;
            this.addChild(label);
            Laya.Tween.to(label, {
                centerY: -160,
                alpha: 1
            }, 1e3);
            Laya.Tween.to(label, {
                scaleX: .4,
                scaleY: .4
            }, 500, null, null);
            Laya.Tween.to(label, {
                scaleX: .2,
                scaleY: .2
            }, 500, null, null, 500);
            Laya.timer.once(1e3, this, this.destroyLabel, [ label ], false);
        });
    }
    addChild(label: Laya.Label) {
        throw new Error("Method not implemented.");
    }
    destroyLabel(label) {
        label.removeSelf();
        label.destroy();
    }
}