import { GameData } from "../datas/GameData";
import { BattleData } from "../datas/BattleData";
import GlobalConst from "../const/GlobalConst";
import { SceneManager } from "../common/SceneManager";
import { FishData } from "../datas/FishData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { PlayerData } from "../datas/PlayerData";
import GlobalVar from "../const/GlobalVar";
import { EventDis } from "../Helpers/EventDis";
import { UIUtils } from "../game/utils/UIUtils";
import { SpecialFishType } from "./FishNode";
import { FishTray } from "../common/FishTray";
import { HongYunNode } from "./HongYunNode";
import { CannonNode } from "./CannonNode";
import { SeatWaitNode } from "./SeatWaitNode";
import { SeatNumNode } from "./SeatNumNode";
import { SeatNodeInfo } from "./SeatNodeInfo";
import { OtherOneInfoNode } from "./OtherOneInfoNode";
import { DragonCannonNode } from "./DragonCannonNode";

var SceneM = SceneManager.Instance;

export class SeatNode /*extends layaMaxUI_1.ui.roleNodes.SeatNodeUI*/ {
    numPanel: any;
    cannonNode: any;
    waitNode: any;
    seatInfoNode: any;
    trayNode: any;
    seatIndex: number;
    isSeatFlip: boolean;
    name: string;
    otherNodeInfo: any;
    box_wait: any;
    box_numPanel: any;
    rotation: number;
    pos(x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    zOrder: number;
    mySeatAni: any;
    constructor(seatIndex) {
        //super();
        /**炮倍面板 */                
        this.numPanel = undefined;
        /**炮座节点 */                
        this.cannonNode = undefined;
        /**等待节点 */                
        this.waitNode = undefined;
        /**玩家资源节点 */                
        this.seatInfoNode = undefined;
        /**托盘节点 */                
        this.trayNode = undefined;
        /**座位索引 */                
        this.seatIndex = 0;
        /**座位是否翻转 */                
        this.isSeatFlip = false;
        //座位初始化
        this.seatIndex = seatIndex;
        this.name = "seat" + seatIndex;
        this.waitNode = new SeatWaitNode(seatIndex);
        this.numPanel = new SeatNumNode(seatIndex);
        this.cannonNode = new CannonNode(seatIndex);
        this.seatInfoNode = new SeatNodeInfo(seatIndex);
        if (this.seatIndex != FishData.mySeatIndex && !GameData.Instance.isFirstLogin) {
            this.otherNodeInfo = new OtherOneInfoNode(seatIndex);
        }
        this.box_wait.addChild(this.waitNode);
        this.box_numPanel.addChild(this.numPanel);
        SceneM.addToLayer(this.cannonNode, GlobalConst.cannonLayer);
        SceneM.addToLayer(this.seatInfoNode, GlobalConst.btnsLayer);
        SceneM.addToLayer(this.otherNodeInfo, GlobalConst.cannonLayer);
        //座位翻转
        if (this.seatIndex > 2 && !BattleData.Instance.isFlip || this.seatIndex <= 2 && BattleData.Instance.isFlip) {
            this.rotation = 180;
            this.isSeatFlip = true;
            this.numPanel.initFlip();
            this.cannonNode.rotation = 180;
            this.waitNode.image_invite.rotation = 180;
        }
        //座位坐标初始化
        let cannonPos = GlobalFunc.getCannonPos();
        this.pos(cannonPos[this.seatIndex].x, cannonPos[this.seatIndex].y);
        this.initEvent();
        this.zOrder = 3100;
        this.updateSeatUI();
    }
    initFlyPos() {
        console.log(this.cannonNode.width + "*/*" + this.cannonNode.box_cannon.width);
        console.log(this.cannonNode.x + "*/*" + this.cannonNode.box_cannon.x);
        let seatPos = this.cannonNode.box_cannon.localToGlobal(new Laya.Point(0, 0));
        let coinPos = this.seatInfoNode.img_coin.localToGlobal(new Laya.Point(17, 16));
        let ticketPos = this.seatInfoNode.img_ticket.localToGlobal(new Laya.Point(21, 21));
        PlayerData.Instance.setRoomFlyPos(seatPos, GlobalConst.itemFlyCannon, this.seatIndex);
        PlayerData.Instance.setRoomFlyPos(coinPos, GlobalConst.itemFlyRoomCoin, this.seatIndex);
        PlayerData.Instance.setRoomFlyPos(ticketPos, GlobalConst.itemFlyRoomTicket, this.seatIndex);
    }
    /**初始化事件 */            
    initEvent() {
        EventDis.Instance.addEvntListener(GlobalVar.PLAY_ROOM_TRAY_ANI, this, this.playTrayAni);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_SPECIAL_FISH_END, this, this.specialFishTimeEnd);
        EventDis.Instance.addEvntListener(GlobalVar.CLOSE_MYSEAT_ANI, this, this.destroyMySeatAni);
    }
    /**更新座位信息 */            
    updateSeatUI() {
        var seatData = BattleData.Instance.getSitInfo(this.seatIndex);
        console.log("seatData.isInRoom:" + seatData.isInRoom);
        //离开
        if (!seatData.isInRoom) {
            GlobalFunc.uiClose(this.numPanel);
            GlobalFunc.uiClose(this.cannonNode);
            GlobalFunc.uiClose(this.seatInfoNode);
            GlobalFunc.uiOpen(this.waitNode);
            this.numPanel.destroyEvent();
            this.cannonNode.destroyEvent();
            this.cannonNode.resetUI();
            this.seatInfoNode.destroyEvent();
        } else {
            //进入
            GlobalFunc.uiOpen(this.numPanel);
            GlobalFunc.uiOpen(this.cannonNode);
            GlobalFunc.uiOpen(this.seatInfoNode);
            GlobalFunc.uiClose(this.waitNode);
            this.waitNode.destroyEvent();
            this.updateNewUI(seatData);
        }
    }
    /**更新UI信息 */            
    updateNewUI(seatData) {
        console.log("更新座位...");
        this.numPanel.init(this.seatIndex);
        this.cannonNode.init(seatData, this.seatIndex);
        Laya.timer.frameOnce(10, this, () => {
            this.initFlyPos();
        });
        this.seatInfoNode.init(this.seatIndex, this.isSeatFlip);
        this.isSelfSeat();
    }
    isSelfSeat() {
        if (this.seatIndex == FishData.mySeatIndex) {
            this.mySeatAni = GlobalFunc.getAni("mySeat");
            this.mySeatAni.pos(this.cannonNode.x, this.cannonNode.y);
            this.mySeatAni.play(0, true);
            GlobalFunc.globalSetZorder(this.mySeatAni, 2900);
            SceneM.addToLayer(this.mySeatAni, GlobalConst.bulletLayer);
        }
    }
    destroyMySeatAni() {
        if (this.seatIndex == FishData.mySeatIndex && !!this.mySeatAni) {
            this.mySeatAni.removeSelf();
            this.mySeatAni.destroy();
        }
    }
    /**特色鱼场景搭建 */            
    buildSpecialFish() {
        var seatData = BattleData.Instance.getSitInfo(this.seatIndex);
        if (seatData.leftHyBullet > 0) {
            var hyData = {
                hongyun_total_gold: seatData.hyScore,
                hongyun_left_pao: seatData.leftHyBullet
            };
            var hongYunNode = new HongYunNode(this.seatIndex, hyData);
            hongYunNode.readyStart();
            return true;
        }
        return false;
    }
    /**龙炮场景搭建 */            
    bulidDragonCannonState() {
        var seatData = BattleData.Instance.getSitInfo(this.seatIndex);
        if (seatData.dragonCannonId > 0) {
            let dragonCannon = new DragonCannonNode(this.seatIndex, seatData.dragonCannonId);
            seatData.dragonCannon = dragonCannon;
        }
    }
    /**播放托盘动画 */            
    playTrayAni(data = {
        fishData: undefined,
        seatIndex: 0
    }) {
        if (data.seatIndex == this.seatIndex && data.fishData) {
            UIUtils.showDisplay("FishTray", this, () => {
                this.trayNode = new FishTray(this.seatIndex);
                this.trayNode.zOrder = 100;
                SceneM.addToLayer(this.trayNode, GlobalConst.effectTopLayer);
                this.trayNode.init(this.seatIndex);
                this.trayNode.startPlayAni(data.fishData);
            });
        }
    }
    /**特色鱼时间结束 */            
    specialFishTimeEnd(data) {
        var seatIndex = BattleData.Instance.getUserSeatByUid(data.uid);
        var fishType = 0;
        var tray = 2;
        var fishInfo = data.special_fish_info;
        var fishTotalNum = 0;
        //清除座位的特色状态
        EventDis.Instance.dispatchEvent("delSpView", seatIndex);
        if (seatIndex == this.seatIndex) {
            let seatNode = FishData.seatNodes[seatIndex];
            if (seatIndex == FishData.mySeatIndex) {
                seatNode.numPanel.mouseEnabled = true;
                BattleData.Instance.roomPlayerData[seatIndex].isDragonCannon == -1 && seatNode.numPanel.openPaoBeiUI();
            }
            let delayTime = 1e3;
            switch (fishInfo.fish_type) {
              case SpecialFishType.fish_type_special_hongyun:
                if (this.cannonNode.hongYunNode) {
                    this.cannonNode.hongYunNode.hyTimeFinish();
                }
                fishType = GlobalConst.HongYunId;
                fishTotalNum = fishInfo.data.hongyun_total_gold;
                break;

              case SpecialFishType.fish_type_special_hwbz:
                fishType = GlobalConst.hwbzId;
                fishTotalNum = fishInfo.data.hwbz_total_gold;
                break;

              case SpecialFishType.fish_type_special_xyzp:
                EventDis.Instance.dispatchEvent("dialDead", seatIndex);
                fishType = GlobalConst.xyzpId;
                fishTotalNum = fishInfo.data.xyzp_total_gold;
                break;

              case SpecialFishType.fish_type_special_zshy:
                fishType = GlobalConst.zshyId;
                fishTotalNum = fishInfo.data.zshy_total_gold_;
                break;

              case SpecialFishType.fish_type_special_zuantou:
                delayTime = 2e3;
                fishType = GlobalConst.zuanTouId;
                fishTotalNum = fishInfo.data.zuantou_fly_gold + fishInfo.data.zuantou_bomb_gold;
                BattleData.Instance.setPlayerSpecialState(false, this.seatIndex, "isBitting");
                break;

              case SpecialFishType.fish_type_special_wlxb:
                fishType = GlobalConst.wlxbId;
                fishTotalNum = fishInfo.data.wldb_total_gold;
                break;

              default:
                break;
            }
            let fishJsonData = BattleData.Instance.fishData[fishType];
            let fishData = {
                fishData: {
                    fishID: fishType,
                    goldNum: fishTotalNum,
                    tray: fishJsonData.tray,
                    fishInfo: fishJsonData,
                    fish_type: fishInfo.fish_type
                },
                seatIndex: this.seatIndex
            };
            Laya.timer.once(delayTime, this, this.playTrayAni, [ fishData ]);
            BattleData.Instance.roomPlayerData[seatIndex].gold = fishInfo.data.total_gold;
            BattleData.Instance.roomPlayerData[seatIndex].ticket = fishInfo.data.total_diamond;
            if (seatIndex == FishData.mySeatIndex) {
                PlayerData.Instance.setItemNum(GlobalConst.goldKey, fishInfo.data.total_gold);
            }
            this.seatInfoNode.updateGold(this.seatIndex == FishData.mySeatIndex);
        }
    }
    destroy() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
        this.cannonNode.destroy();
        this.numPanel.destroy();
        this.waitNode.destroy();
        this.seatInfoNode.destroy();
        !!this.otherNodeInfo && this.otherNodeInfo.destroy();
        this.removeChildren();
        this.removeSelf();
    }
    removeChildren() {
        throw new Error("Method not implemented.");
    }
    removeSelf() {
        throw new Error("Method not implemented.");
    }
}