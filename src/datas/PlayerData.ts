import GlobalVar from "../const/GlobalVar";
import {EventDis} from "../Helpers/EventDis"
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import {FishData} from "./FishData";
import {BattleData} from "./BattleData"
import GlobalConst from "../const/GlobalConst";
import OnOffManager from "../const/OnOffManager";
import {GameData} from "./GameData"
import { SceneManager } from "../common/SceneManager";
import { GameModel } from "../game/GameModel";
import { GuideManager } from "../common/GuideManager";
import { DialogManager } from "../common/DialogManager";
export class PlayerData{
    static getItemNum(arg0: string): number {
        throw new Error("Method not implemented.");
    }
    shouchong: number;
    newUserGiftlock: number;
    goldShopOpen: {};
    vip_level: number;
    vipExp: number;
    vipMax: number;
    cur_pao: number;
    equipCannon: number;
    equipMap: {};
    equipBoat: number;
    items: {};
    composeItems: {};
    itemNums: {};
    commoditysInfo: {};
    commodityIsBuy: {};
    serverTimeMinSecond: number;
    timeOpen: boolean;
    reliven: number;
    yuekaaward: number;
    isServerNewUser: boolean;
    lastlogintime: number;
    mailNum: number;
    mailStatus: number;
    vipInfo: any[];
    loginDays: number;
    leftLoginRoulette: number;
    onlineTime: number;
    isBindWx: boolean;
    itemFlyEndP: any[];
    left_count: number;
    allTicketCount: number;
    freeGoldInfo: any;
    restVedio: number;
    restsignVideo: number;
    restDmdShare: number;
    restReliveShare: number;
    restAutoPaoShare: number;
    restAutoPaoTime: number;
    restFreeDmdVedio: number;
    roomItems: any;
    static _Instance:any;
    static get Instance(){
        if (PlayerData._Instance == null){
            PlayerData._Instance = new PlayerData;
        }

        return PlayerData._Instance;
    }
    constructor(){
        /**用户首冲标识*/
        this.shouchong = 0;
        /**首冲礼包购买锁  0、未购买 1、正在购买 2、已购买*/                
        this.newUserGiftlock = 0;
        this.goldShopOpen = {};
        /**vip级别 */                
        this.vip_level = 0;
        /**玩家当前会员经验值 */                
        this.vipExp = 0;
        /**玩家当前会员等级最大值 */                
        this.vipMax = 0;
        /**玩家当前的炮倍数 */                
        this.cur_pao = 10;
        /**玩家装备的炮管 */                
        this.equipCannon = 101;
        this.equipMap = {};
        /**玩家装备的潜水艇 */                
        this.equipBoat = 200;
        /**物品信息 */                
        this.items = {};
        /**合成物品信息 */                
        this.composeItems = {};
        /**玩家物品数量 */                
        this.itemNums = {};
        /**礼包信息 */                
        this.commoditysInfo = {};
        /**玩家礼包购买信息 */                
        this.commodityIsBuy = {};
        /**服务器时间 */                
        this.serverTimeMinSecond = 0;
        /**是否已开启服务器时间 */                
        this.timeOpen = false;
        /**救济金次数 */                
        this.reliven = 0;
        /**月卡时效 */                
        this.yuekaaward = 0;
        /**是否是新手 */                
        this.isServerNewUser = true;
        /**上次登录时间 */                
        this.lastlogintime = 0;
        /**邮件数量 */                
        this.mailNum = 0;
        /**邮件状态 */                
        this.mailStatus = 0;
        /**VIP信息 */                
        this.vipInfo = [];
        /**登陆总天数 */                
        this.loginDays = 0;
        /**剩余抽取登陆转盘次数 */                
        this.leftLoginRoulette = 0;
        /**在线时间 */                
        this.onlineTime = 0;
        /**是否绑定了微信账号 */                
        this.isBindWx = false;
        /**大厅且房间内物资飞行终点 */                
        this.itemFlyEndP = [];
        this.left_count = 0;
        //救济金剩余次数
        /**上次登录奖券历史获取总值 */                
        this.allTicketCount = 0;
        //this.init();
    }
    init() {
        this.loginDays = 0;
        this.leftLoginRoulette = 0;
        this.itemNums = {};
        EventDis.Instance.addEvntListener(GlobalVar.VIP_EXP_UP, this, this.upDateVipExp);
        EventDis.Instance.addEvntListener(GlobalVar.DATA_VIP_INFO, this, this.updateVipInfo);
        EventDis.Instance.addEvntListener(GlobalVar.ITEM_INFO_INIT, this, this.initItemNum);
        EventDis.Instance.addEvntListener(GlobalVar.CONFIG_INFO_NOTICE, this, this.initItemOnOff);
        //2.0
        this.initItemInfo();
        this.initCommodityInfo();
        this.initFreeGoldInfo();
        this.initGuide();
    }
    initGuide() {
        GameModel.getJson("guide").then((json)=>{
            GuideManager.Instance.guideDatas = json.guide;
        });
        
    }
    destroy() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
    }
    initFreeGoldInfo() {
        //无服务器数据，先测试
        // this.freeGoldInfo = new ActivityView_1.FreeGoldInfo();
        // this.freeGoldInfo.luckyDrawInfo = new ActivityView_1.LuckyDrawInfo();
        // this.freeGoldInfo.luckyDrawInfo.drawNum = 5;
        // this.freeGoldInfo.luckyDrawInfo.lastTime = Math.floor(GlobalFunc.getClientTime() / 1e3);
    }
    /**初始化物品信息 */            
    initItemInfo() {
        GameModel.getJson("Item").then((json:any)=>{
            if (json && json.Items) {
                for (let index = 0; index < json.Items.length; index++) {
                    // let item = json.Items[index];
                    // let itemNode = new ItemNode_1.ItemNode();
                    // let itemID = Number(item.itemID);
                    // if (itemID >= 31 && itemID <= 33) continue;
                    // itemNode.describe = item.describe;
                    // itemNode.itemID = itemID;
                    // itemNode.itemName = item.name;
                    // itemNode.skin = item.skin;
                    // itemNode.isShow = item.noShow && item.noShow == 1 ? false : true;
                    // if (itemID == 11 || itemID == 12 || itemID == 13 || itemID == 14 || itemID == 41) {
                    //     itemNode.isShow && (itemNode.isShow = !GlobalVar.isShenHeVer);
                    // }
                    // itemNode.isBoat = item.isBoat == "true";
                    // itemNode.bulletNum = item.bulletNum;
                    // itemNode.shootSpeed = item.shootSpeed;
                    // if (itemID > 6 && itemID <= 300) {
                    //     itemNode.speed = Number(item.speed);
                    //     itemNode.needDiamond = Number(item.needDiamond);
                    //     itemNode.hit = Number(item.hit);
                    //     itemNode.cycleTime = item.cycleTime;
                    //     itemNode.buyVip = Number(item.buyVip);
                    //     itemNode.sortId = Number(item.sortID);
                    //     if (itemID <= 100) {
                    //         itemNode.giveVip = Number(item.zengSongVip);
                    //         itemNode.giveMinLimit = Number(item.zengSongMin);
                    //         itemNode.isGive = Number(item.zengSong);
                    //         itemNode.useGold = Number(item.useGold);
                    //         itemNode.qiWang = Number(item.qiWang);
                    //         itemNode.effectTime = item.effectTime;
                    //     }
                    // } else {
                    //     itemNode.sortId = Number(item.sortID);
                    // }
                    // this.items[itemID.toString()] = itemNode;
                    // this.itemNums[itemID.toString()] = 0;
                    // if (item.composeNum) {
                    //     this.composeItems[item.itemID] = item;
                    // }
                }
            }
        });
        
        
        
    }
    /**初始化物品数量 */            
    initItemNum(data) {
        if (!data) return;
        let items = data.items || [];
        for (let index = 0; index < items.length; index++) {
            let item = items[index];
            if (item.item_id != GlobalConst.ItemMonthCardID) {
                this.itemNums[item.item_id.toString()] = item.count;
            } else {
                this.itemNums[item.item_id.toString()] = item.count.toString();
            }
        }
        EventDis.Instance.dispatchEvent(GlobalVar.MY_RES);
    }
    /**获取物品数量 */            
    getItemNum(itemID) {
        if (this.itemNums[itemID] != undefined) {
            return this.itemNums[itemID];
        } else {
            GlobalFunc.log("未能获取ID:" + itemID + " 的物品数量");
        }
    }
    /**设置物品数量 */            
    setItemNum(itemID, itemNum) {
        this.itemNums[itemID] = itemNum;
        this.checkItemNumMax(itemID);
        if (itemID == "1" || itemID == "4") {
            EventDis.Instance.dispatchEvent(GlobalVar.MY_RES);
        }
    }
    /**设置物品上限 */            
    setItemMax(itemID, itemNum) {
        let itemInfo = this.items[itemID];
        itemInfo.itemMaxNum = itemNum;
        this.checkItemNumMax(itemID);
    }
    /**资源数量更新 */            
    updateItemsNum(data) {
        for (let index = 0; index < data.items.length; index++) {
            let item = data.items[index];
            this.setItemNum(item.item_id, item.count);
            if (BattleData.Instance.isInRoom) {
                EventDis.Instance.dispatchEvent(GlobalVar.UPDATE_ITEMS_NUM_FROM_PLAYERDATA);
            }
        }
    }
    /**提示龙炮已达到上线 */            
    tipsLongPaoMax(itemID) {
        let itemName = this.getItemData(+itemID).itemName;
        let str = GlobalFunc.getColorText("您的" + itemName + "超出上限,请及时使用!", 24, "#ffffff", "#0b3170");
        // let commonDialog = new CommonDialog(1, [ str ], undefined, "贵族特权", "温馨提示", false, Laya.Handler.create(this, () => {
        //     DialogManager.Instance.getDialogByName(GlobalConst.DIA_VIPCHARGE);
        // }));
        //SceneManager.Instance.addToMiddLayer(commonDialog, GlobalConst.dialogLayer);
    }
    /**根据物品ID返回物品信息 */            
    getItemData(itemId) {
        var id = itemId.toString();
        var item = this.items[id];
        if (item) {
            return item;
        } else {
            if (itemId >= 1 && itemId <= 4 || itemId >= 7 && itemId <= 9 || itemId >= 11 && itemId <= 14 || itemId == 100 || (itemId >= 101 && itemId <= 104 || itemId == 151) || itemId >= 201 && itemId <= 205 || itemId >= 301 && itemId <= 307 || itemId >= 351 && itemId <= 356 || itemId >= 401 && itemId <= 403) {
                GlobalFunc.log("道具目录错误ID:" + itemId);
            } else {
                GlobalFunc.log("道具ID错误ID:" + itemId);
            }
            item = this.items["1"];
            return null;
        }
    }
    /**批量设置物品数量 */            
    setItemsNum(items) {
        let flag = false;
        let data = GlobalFunc.transGoldItem(items);
        for (let index = 0; index < data.length; index++) {
            let item = data[index];
            let itemId = item.item_id.toString();
            let itemInfo = this.items[itemId];
            let itemNum = item.count || item.item_count;
            if (itemNum.toString().length >= 10) {
                this.itemNums[itemId] = itemNum.toString();
            } else {
                this.itemNums[itemId] = itemNum;
                this.checkItemNumMax(itemId);
            }
            if (itemId == "1" || itemId == "4") flag = true;
        }
        flag && EventDis.Instance.dispatchEvent(GlobalVar.MY_RES);
    }
    /**添加物品数量 */            
    addItemNum(itemID, itemNum, isShow = false, isself = false) {
        this.itemNums[itemID] += itemNum;
        this.checkItemNumMax(itemID);
        if (itemID == "1" || itemID == "4") {
            EventDis.Instance.dispatchEvent(GlobalVar.MY_RES);
            isShow && EventDis.Instance.dispatchEvent("updateSeat", isself);
            //鱼场内更新座位金币
                        }
    }
    /**批量添加物品数量 */            
    addItemsNum(data, isAdd = false, isShow = true, isself = false) {
        let items = GlobalFunc.transGoldItem(data);
        let flag = false;
        let gold = 0;
        for (let i = 0; i < items.length; ++i) {
            let item = items[i];
            let itemId = item.item_id;
            let itemNum = item.count || item.item_count;
            this.itemNums[itemId] += itemNum;
            itemId == "1" && (gold = itemNum);
            this.checkItemNumMax(itemId.toString());
        }
        if (isAdd) {
            BattleData.Instance.roomPlayerData[FishData.mySeatIndex].gold += gold;
        }
        EventDis.Instance.dispatchEvent(GlobalVar.MY_RES);
        isShow && EventDis.Instance.dispatchEvent("updateSeat", isself);
        //鱼场内更新座位金币
    }
    /**判断是否达到上限 */            
    checkItemNumMax(itemID) {
        let item = this.items[itemID];
        if (item.itemMaxNum != -1 && this.itemNums[itemID] > item.itemMaxNum) {
            this.itemNums[itemID] = item.itemMaxNum;
        }
    }
    /**初始化商品信息 */            
    initCommodityInfo() {
        let data = GameModel.getJson("shop");
        this.commoditysInfo = data;
    }
    /**初始化商品购买信息 */            initCommodityIsBuy(data) {
        for (let commID in data) {
            if (data.hasOwnProperty(commID)) {
                let commNum = data[commID];
                if (commID == "buyrmb") continue;
                if (commID == "moncard_expire") {
                    this.itemNums[GlobalConst.ItemMonthCardID] = commNum.toString();
                } else {
                    this.commodityIsBuy[commID] = commNum;
                }
            }
        }
    }
    /**获取商品是否已购买 */            
    getCommodityIsBuy(commID) {
        if (this.commodityIsBuy[commID] && this.commodityIsBuy[commID] != 0) {
            return true;
        } else {
            return false;
        }
    }
    /**设置商品是否已购买 */            
    setCommodityIsBuy(commID, isBuy) {
        this.commodityIsBuy[commID] = isBuy;
    }
    /**更新VIP信息 */            
    updateVipInfo(data) {
        this.vip_level = data.vip ? data.vip : 0;
        //弹出VIP升级框
        this.setVipInfo();
    }
    /**设置VIP信息 */            
    setVipInfo() {
        let expMax;
        GameModel.getJson("Vip").then((json:any)=>{
            expMax = +json.vip[Math.min(this.vip_level + 1, json.vip.length - 1)].charge;
            let itemsMax = json.vip[this.vip_level].itemLimit;
            for (const key in itemsMax) {
                let item = itemsMax[key];
                PlayerData.Instance.setItemMax(key.toString(), +item);
            }

            this.vipMax = expMax;
        })
    }
    /**更新VIP经验值 */            
    upDateVipExp(exp) {
        this.vipExp = exp ? exp : 0;
    }
    /**设置vip技能信息 */            
    vipSkillAssign() {}
    setShareVideoInfo(data) {
        if (data.video || data.video == 0) {
            this.restVedio = Number(data.video);
        }
        if (data.signvideo || data.signvideo == 0) {
            this.restsignVideo = Number(data.signvideo);
        }
        if (data.dmdshare || data.dmdshare == 0) {
            this.restDmdShare = Number(data.dmdshare);
        }
        if (data.reliveshare || data.reliveshare == 0) {
            this.restReliveShare = Number(data.reliveshare);
        }
        if (data.autopaoshare || data.autopaoshare == 0) {
            this.restAutoPaoShare = Number(data.autopaoshare);
        }
        if (data.autopaotime || data.autopaotime == 0) {
            this.restAutoPaoTime = Number(data.autopaotime);
        }
        if (data.freevideo || data.freevideo == 0) {
            this.restFreeDmdVedio = Number(data.freevideo);
        }
    }
    //计时摇一摇
    shakeTickerStart() {
        if (FishData.shakeTime <= 0) {
            FishData.shakeTime = 0;
            Laya.timer.clear(this, this.doCount);
            EventDis.Instance.dispatchEvent("shakeTimeOut");
            return;
        }
        Laya.timer.loop(1e3, this, this.doCount);
    }
    doCount() {
        FishData.shakeTime--;
        if (FishData.shakeTime <= 0) {
            FishData.shakeTime = 0;
            Laya.timer.clear(this, this.doCount);
        }
    }
    setLoginRouletteInfo(data) {
        this.loginDays = data.total_login_days;
        this.leftLoginRoulette = data.rest_round_plate_times ? data.rest_round_plate_times : 0;
    }
    changeCannon(seat, cannonID) {
        this.equipMap[seat] = cannonID;
        this.equipCannon = cannonID;
    }
    /**
    * 设置大厅资源飞行终点坐标
    * @param pos 终点坐标
    * @param index 数组储存位置globalConst.itemFly...
    */            
   setHallFlyPos(pos, index) {
        this.itemFlyEndP[index] = pos;
    }
    /**
    * 设置房间内资源飞行终点坐标
    * @param pos 终点坐标
    * @param index 数组储存位置globalConst.itemFly...
    * @param seatIndex 座位下标
    */            
   setRoomFlyPos(pos, index, seatIndex) {
        if (!this.itemFlyEndP[index]) {
            this.itemFlyEndP[index] = [];
        }
        if (index == GlobalConst.itemFlyFlyGold || index == GlobalConst.itemFlyFlyTicket) {
            this.itemFlyEndP[index][0] = pos;
        } else {
            this.itemFlyEndP[index][seatIndex - 1] = pos;
        }
    }
    /**
    * 获取游戏内物品飞行坐标终点
    * @param index 数组储存位置globalConst.itemFly...
    * @param seatIndex 座位下标(不填写则返回大厅内坐标,index必须为0~2)
    */            
   getItemFlyPos(index, seatIndex = -1) {
        let pos = new Laya.Point(0, 0);
        if (seatIndex != -1) {
            let isExist;
            if (index == GlobalConst.itemFlyFlyGold || index == GlobalConst.itemFlyFlyTicket) {
                isExist = this.itemFlyEndP[index] && this.itemFlyEndP[index][0];
            } else {
                isExist = this.itemFlyEndP[index] && this.itemFlyEndP[index][seatIndex - 1];
            }
            isExist && (pos = this.itemFlyEndP[index][seatIndex - 1]);
        } else {
            this.itemFlyEndP[index] && (pos = this.itemFlyEndP[index]);
        }
        return pos;
    }
    /**检测特惠礼包情况 */            
    checkSpGift() {
        return GameData.Instance.isFirstRecharge && OnOffManager.isGIftSp && !GlobalFunc.isIos();
    }
    /**检测明日礼包情况 */            
    checkTGift() {
        return (GameData.Instance.tomrrowState == 2 || GameData.Instance.tomrrowState == 1) && OnOffManager.isTomorrom;
    }
    /**检查日期匹配 */            
    checkMatchDate(time) {
        let matchDate = new Date(time * 1e3);
        let todayDate = new Date(GameData.Instance.serverTimeStamp);
        return matchDate.getMonth() < todayDate.getMonth() || matchDate.getMonth() == todayDate.getMonth() && matchDate.getDate() <= todayDate.getDate();
    }
    checkShake() {
        return !GameData.Instance.isShaked && GameData.Instance.shakeTimes > 0 && FishData.shakeTime == 0;
    }
    checkInvite() {
        let isRed = false;
        let invites = GameData.Instance.inviteData;
        if (!invites) {
            let data = GameModel.getJson("invitationAward").then((data:any)=>{
                GameData.Instance.inviteData = invites = data.invite;
            })
            
        }
        let invitenum = GameData.Instance.inviteNum;
        invites.forEach(invite => {
            let num = +invite.inviteNum;
            num <= invitenum && GameData.Instance.inviteAwards.indexOf(num) == -1 && (isRed = true);
        });
        return isRed && OnOffManager.isInvite;
    }
    /**初始化商品开关 */            
    initItemOnOff(data) {
        if (data.room_items) {
            this.roomItems = data.room_items.filter(room => room.room_type == 20)[0];
        }
        GameData.Instance.Room2GuideSwitch = !!data.guide_room2_switch;
        console.log({
            data: data
        });
        if (!data || !data.shop_items) return;
        let shop_items = data.shop_items;
        if (!shop_items) return;
        for (let i = 0; i < shop_items.length; ++i) {
            let item = shop_items[i];
            let id = item.product_id;
            if (id == 3010) {
                //月卡
                OnOffManager.isMonthCardOn = !!item.open;
            } else if (id == 3020) {
                //摇一摇
                OnOffManager.isShake = !!item.open;
            } else if (id == 2010) {
                //首冲
                OnOffManager.isGiftOn = !!item.open;
            } else if (id == 4010) {
                //特惠
                OnOffManager.isGIftSp = !!item.open;
            } else if (id == 2040) {
                //明日
                OnOffManager.isTomorrom = !!item.open;
            } else if (id == 110 || id == 120 || id == 130 || id == 140 || id == 150 || id == 160 || id == 170 || id == 210 || id == 220 || id == 230 || id == 240 || id == 250 || id == 260) {
                //商店金币
                this.goldShopOpen[id] = !!item.open;
            }
        }
    }
}