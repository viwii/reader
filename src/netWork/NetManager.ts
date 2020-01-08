import {EventDis} from "../Helpers/EventDis"
import {GameData} from "../datas/GameData"
import {BattleData} from "../datas/BattleData"
import GlobalVar from "../const/GlobalVar";
import GlobalConst from "../const/GlobalConst";
import OnOffManager from "../const/OnOffManager";
import GlobalFunc from "../GlobalFuncs/GlobalFunc"
import Single, { Platform } from "../const/SingleSDK";
import { SceneManager } from "../common/SceneManager";
import { HallData } from "../datas/HallData";
import { PlayerData } from "../datas/PlayerData";
import {MainFunc} from "../GlobalFuncs/MainFunc";
import { WaitManager } from "../common/WaitManager";
import { SoundManager } from "../common/SoundManager";
import { FishData } from "../datas/FishData";
import { LoginManager } from "../game/LoginManager";

export class NetManager{
    payOrder: number;
    protoSec: number;
    isReconnecting: boolean;
    isKicked: boolean;
    isCloseGame: boolean;
    payOrderId: any[];
    payOrderObj: {};
    payCount: {};
    orderObj: {};
    isShowExit: boolean;
    battleResIndex: number;
    tipNum: number;
    serverExit: boolean;
    exitFlag: number;
    isWxlogin: boolean;
    socket: Laya.Socket;
    heartTimeMap: any;
    resCount: number;
    static _Instance:any;
    static get Instance(){
        if (NetManager._Instance == null){
            NetManager._Instance = new NetManager;
        }

        return NetManager._Instance;
    }
    constructor() {
        /**
         * 订单
         */
        this.payOrder = 0;
        /**
         * 协议自增序号
         */                
        this.protoSec = 0;
        /**
         * socket是否正在重连
         */                
        this.isReconnecting = false;
        /**
         * 玩家是否已被踢下线
         */                
        this.isKicked = false;
        this.isCloseGame = false;
        /**
         * 服务器通信失败订单号
         */                
        this.payOrderId = [];
        /**
         * 通信失败订单信息
         */                
        this.payOrderObj = {};
        /**
         * 划款计数count
         */                
        this.payCount = {};
        /**
         * 同一定单号序列seq
         */                
        this.orderObj = {};
        this.isShowExit = true;
        this.battleResIndex = 0;
        this.tipNum = 0;
        this.serverExit = false;
        this.exitFlag = 0;
        this.isWxlogin = false;
        console.log("----------------------------------------------------------------------------创建新的socket连接");
        this.socket = new Laya.Socket();
        this.isKicked = false;
        this.socket.on(Laya.Event.OPEN, this, this.onEventWebSocketOpen);
        this.socket.on(Laya.Event.CLOSE, this, this.onEventWebSocketShut);
        this.socket.on(Laya.Event.MESSAGE, this, this.onEventWebSocketRead);
        this.socket.on(Laya.Event.ERROR, this, this.onEventWebSocketError);
    }
    init() {
        EventDis.Instance.addEvntListener("wait_overTime", this, this.connectOVerTime);
        EventDis.Instance.addEvntListener("server_notice", this, this.ckeckNoticeOk);
        EventDis.Instance.addEvntListener("network_time", this, data => {
            data.time < 2e3 && (this.tipNum = 0);
            if (NetManager.Instance.socket.connected && data.time > 2e3 && !GameData.Instance.isConnecting) {
                this.tipNum++;
                this.tipNum = this.tipNum % 6;
                if (this.tipNum != 5) return;
                //new WarningMessage_1.WarningMessage("您的网络状态不佳，正在重连请稍后");
                GameData.Instance.isConnecting = true;
                if (!BattleData.Instance.isInRoom) return;
                Laya.timer.once(1e3, this, () => {
                    SceneManager.Instance.replaceScene("FirstHallScene");
                });
            }
        });
    }
    /**
* 检测公告是否拉取成功
*/            ckeckNoticeOk(notice, isInit = false) {
        console.log("检测公告是否拉取成功");
        GameData.Instance.noticeClose = false;
        if (!!notice && !GameData.Instance.white_user) {
            console.log("out_close_notice");
            GameData.Instance.noticeClose = true;
            EventDis.Instance.dispatchEvent("out_close_notice");
            GlobalFunc.serverCloseNotice(notice);
        } else {
            GlobalFunc.log("公告拉取成功，开始连接网络.........");
            !isInit && NetManager.Instance.connect();
        }
    }
    /**
* 重连等待超时
* @param str
*/            connectOVerTime(str) {
        if (str && str == "1") {
            //强制退出
            WaitManager.Instance.HideWaitingImageForce();
            this.isKicked = true;
            EventDis.Instance.dispatchEvent("sc_player_kick_1");
        }
    }
    /**
* socket连接
*/            connect() {
        if (this.socket.connected) return;
        this.socket.endian = Laya.Byte.BIG_ENDIAN;
        this.socket.connect(GameData.Instance.gateIp, Number(GameData.Instance.gatePort));
    }
    /**
*
* @param jsonStr 解析服务器数据
*/            decodeMessage(jsonStr) {
        this.doProtoDecode(jsonStr);
    }
    /**
* socket连接成功
*/            onEventWebSocketOpen() {
        if (this.heartTimeMap) this.heartTimeMap.clear();
        WaitManager.Instance.hideWaitLayer("socket closed");
        WaitManager.Instance.HideWaitingImageForce();
        this.isReconnecting = false;
        GlobalConst.enterRoomFlag = true;
        this.reqPlayerLogin();
        EventDis.Instance.dispatchEvent(GlobalVar.NET_ON);
    }
    /**
    * socket断开数据
    */            
   onEventWebSocketShut() {
        this.socket.close();
        EventDis.Instance.dispatchEvent(GlobalVar.NET_OVER);
        this.isReconnecting = false;
        //编辑器
    }
    /**
    *
    * @param message 收到服务器下发数据
    */            
   onEventWebSocketRead(message) {
        this.decodeMessage(message);
    }
    /**
    * 断开socket
    */            
   stop() {
        this.isKicked = false;
        this.socket.close();
    }
    /**
    * socket连接报错
    * @param e 错误信息
    */            
    onEventWebSocketError(e) {
        GlobalFunc.log("Socket error");
    }
    doLogin(data) {
        GlobalFunc.log("登录成功.........");
        EventDis.Instance.dispatchEvent(GlobalVar.GATE_LOGIN_SUC_NOTICE, data);
        EventDis.Instance.dispatchEvent(GlobalVar.CONFIG_INFO_NOTICE, data.config_info);
        EventDis.Instance.dispatchEvent(GlobalVar.ITEM_INFO_INIT, data.player_item_info);
        LoginManager.Instance.loginOkCallBack(data.user_info);
    }
    //////////////////////////////////具体协议部分
    send(protoType, proto) {
        let buffer = new ArrayBuffer(16);
        let dv = new DataView(buffer);
        dv.setUint32(0, protoType, false);
        let Sec = this.protoSec++;
        // if (protoType == ProtoMsg.emSSMsgId.SVR_MSG_HEART_BEAT) this.heartTimeMap.set(Sec, new Date().getTime());
        // dv.setUint32(4, Sec, false);
        // this.setBufferUint64By32(GameData.Instance.uid, buffer, 8);
        // let arrAll = new Uint8Array(16 + (!!proto ? proto.length : 0));
        // let s = new Uint8Array(arrAll);
        // let s1 = new Uint8Array(buffer);
        // if (proto) {
        //     var s2 = proto;
        //     s.set(s1, 0);
        //     s.set(s2, 16);
        // }
        // if (!this.socket.connected) {
        //     // this.loopReconnect()
        //     return;
        // }
        // this.socket.send(s.buffer);
    }
    setBufferUint64By32(uint32, buffer, offset) {
        // var uint8Arr = new Uint8Array(buffer);
        // var long1 = Long.fromNumber(uint32);
        // //long uint64
        // var bit64 = long1.toBytesBE();
        // uint8Arr.set(bit64, offset);
    }
    doProtoDecode(arrayBuff) {
        var headLen = 16;
        var totalLen = arrayBuff.byteLength;
        var bodyLen = totalLen - headLen;
        var buffHead = arrayBuff.slice(0, headLen);
        var proto = arrayBuff.slice(headLen, totalLen);
        //获取字段值
                        var dv1 = new DataView(buffHead);
        var protoType = dv1.getUint32(0);
        var seq = dv1.getUint32(4);
        var uid = dv1.getUint32(12);
        proto = new Uint8Array(proto);
        if (this.heartTimeMap && this.heartTimeMap.get(seq)) {
            let t = new Date().getTime();
            let time = t - this.heartTimeMap.get(seq);
            EventDis.Instance.dispatchEvent("network_time", {
                time: time
            });
            this.heartTimeMap.delete(seq);
        }
        this.onEventTCPSocketRead(protoType, proto);
    }
    isMsgValid(msg) {
        var isValid = !msg || !msg.ret || msg.ret.err_code == 0;
        if (!isValid) {
            GlobalFunc.log("msg not valid:", msg);
        }
        return isValid;
    }
    onEventTCPSocketRead(protoType, msg) {
        var time = Laya.Browser.now();
        var decodeMsg;
        // switch (protoType) {
        //   case ProtoMsg.emCSMsgId.CS_MSG_PLAYER_LOGIN:
        //     //登录
        //     decodeMsg = ProtoMsg.PbCsPlayerLoginResMsg.decode(msg);
        //     console.log("socket登录返回");
        //     console.log({
        //         decodeMsg: decodeMsg
        //     });
        //     if (decodeMsg.ret.err_code == 100) {
        //         console.log("token失效");
        //     }
        //     if (!this.isMsgValid(decodeMsg) || decodeMsg.ret.err_code == ProtoMsg.emResponseCode.WEB_CODE_LOGIN_CONTENT_SYSTEM_4) {
        //         console.log("连接失败，请重新进入游戏");
        //         var str = GlobalFunc.getColorText("连接失败，请重新进入游戏", 24);
        //         DialogManager.getDialogByName(GlobalConst.DIA_ACTIVITY);
        //         this.isCloseGame = true;
        //         let dlg = new CommonDialog(1, [ str ], undefined, "退出", "提示", true, new Laya.Handler(this, () => {
        //             if (Single.SingleConfig.platform == Single.Platform.H5Bianf) buyu.closeGame();
        //             if (Single.SingleConfig.platform == Single.Platform.H5APP) {
        //                 if (NetManager.Instance.isWxlogin) {
        //                     NetManager.Instance.exitFlag = 1;
        //                 } else {
        //                     NetManager.Instance.exitFlag = 2;
        //                 }
        //                 SoundManager.Instance.stopMusic();
        //                 NetManager.Instance.socket.close();
        //                 SceneManager.Instance.replaceScene("LoadingScene_H5APP");
        //             }
        //         }));
        //         if (this.isShowExit) {
        //             this.isShowExit = false;
        //             SceneManager.Instance.addToMiddLayer(dlg, GlobalConst.dialogLayer);
        //         }
        //         return;
        //     }
        //     GameData.Instance.isFirstLogin = decodeMsg.user_info.b_first_login;
        //     if (Single.SingleConfig.platform == Single.Platform.H5Bianf) buyu.transLogin(GameData.Instance.isFirstLogin, +GameData.Instance.uid);
        //     if (Single.SingleConfig.platform == Single.Platform.H5Bianf) {
        //         GameData.Instance.fresh_token = decodeMsg.fresh_token;
        //         GlobalFunc.log("login_fresh_token:" + GameData.Instance.fresh_token);
        //     }
        //     this.resPlayerLogin(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_HEART_BEAT:
        //     //
        //     decodeMsg = ProtoMsg.PbCsPlayerHeartBeatResMsg.decode(msg);
        //     let s_msg = this.Utf8ArrayToStr(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resHeartBeat(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ENTER_ROOM:
        //     //进房间
        //     decodeMsg = ProtoMsg.PbCsGameEnterRoomResMsg.decode(msg);
        //     // if (!this.isMsgValid(decodeMsg)) return;
        //                         this.resEnterRoom(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_SCENE:
        //     //切换场景
        //     decodeMsg = ProtoMsg.PBCsRoomScenBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resSwitchScene(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BULLET:
        //     //发射子弹失败
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerBulletResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resShootFail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_HIT:
        //     //击中hit失败
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerHitResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resHitFail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_BULLET:
        //     //子弹广播
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerBulletBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resShootBroad(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_HIT:
        //     //击中hit广播
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerHitBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resHitBroad(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_PLAYER_ENTER_DESK:
        //     //玩家进入或者离开房间
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerEnterDeskBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPlayInfo(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_CHANGE_PAO:
        //     //玩家切换炮倍
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerChangePaoBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resChangePao(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_REBORN_FISH:
        //     //重生boss
        //     decodeMsg = ProtoMsg.PBCsRoomRebornFishBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resRebornFish(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_OVERTIME_KICK_PLAYER:
        //     //超时未操作,踢出房间
        //     decodeMsg = ProtoMsg.PBCsRoomOverTimePlayerKickMsg.decode(msg);
        //     this.resOverTime(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_PLAYER_KICK:
        //     //玩家挤下线=>loading
        //     decodeMsg = ProtoMsg.PBCsPlayerKickMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPlayerKick();
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_PLAYER_INFO:
        //     decodeMsg = ProtoMsg.PbCsGameGetPlayerInfoResMsg.decode(msg);
        //     this.resGetPlayerInfo(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_BAG_BUY_ITEM:
        //     decodeMsg = ProtoMsg.PbCsGameBagBuyItemResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPackageBuy(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_BAG_ZENGSONG:
        //     decodeMsg = ProtoMsg.PbCsGameBagZengSongResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPackageZengSong(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_RECV_MAIL:
        //     //下发邮件
        //     decodeMsg = ProtoMsg.PbCsGamePlayerMailMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resMailMsg(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_READ_MAIL:
        //     //读邮件
        //     decodeMsg = ProtoMsg.PbCsGamePlayerReadMailResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resReadMail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_DEL_MAIL:
        //     //删除邮件
        //     decodeMsg = ProtoMsg.PbCsGamePlayerDelMailResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resDelMail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_ATTACH_MAIL:
        //     //领取邮件
        //     decodeMsg = ProtoMsg.PbCsGamePlayerAttachMailResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resAttachMail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_SPECIAL_FISH_END:
        //     //特色鱼时间结束
        //     decodeMsg = ProtoMsg.PBCsRoomSpecialFishEndBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resRoomSpecialFishEnd(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_SEND_PLAYER_ROUND_PLATE_INFO:
        //     //登陆转盘信息通知
        //     decodeMsg = ProtoMsg.PbCsSendPlayerRoundPlateInfo.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resGetLoginRouletteInfo(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ROUND_PLATE:
        //     //登陆转盘奖励
        //     decodeMsg = ProtoMsg.PbCsRoundPlateResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resGetLoginRouletteReward(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_ZHENG_DIAN_REWARD_LIST:
        //     //整点奖励的load
        //     decodeMsg = ProtoMsg.PbCsGameGetZhengDianRewardListResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.wholeData = decodeMsg.info;
        //     EventDis.Instance.dispatchEvent("wholeLoad", decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_ZHENG_DIAN_REWARD:
        //     //整点奖励领取
        //     decodeMsg = ProtoMsg.PbCsGameTakeZhengDianRewardResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     EventDis.Instance.dispatchEvent("getWholeReward", decodeMsg);
        //     PlayerData.Instance.addItemsNum([ {
        //         item_id: decodeMsg.item_id,
        //         count: decodeMsg.item_count
        //     } ]);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_HWBZ_START:
        //     //海王宝藏开始游戏
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerHwbzStartResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resStartHaiWangFish(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_HWBZ_CLICK:
        //     //海王宝藏点击事件
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerHwbzClickResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resHaiWangFishClick(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_DOLE_LEFT_COUNT:
        //     //大厅奖励金次数load
        //     decodeMsg = ProtoMsg.PbCsGameDoleLeftCountResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     PlayerData.left_count = decodeMsg.left_count;
        //     EventDis.Instance.dispatchEvent("helpLoad", decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_DOLE:
        //     //大厅奖励金领取
        //     decodeMsg = ProtoMsg.PbCsGameTakeDoleResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     PlayerData.Instance.left_count = decodeMsg.left_count;
        //     DialogManager.Instance.dlgQueue = [];
        //     PlayerData.addItemsNum([ {
        //         item_id: decodeMsg.item_id,
        //         count: decodeMsg.item_count
        //     } ], false, true, true);
        //     EventDis.Instance.dispatchEvent("helpReward", decodeMsg.left_count);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_BROAD_ITEM:
        //     //资源更新协议
        //     decodeMsg = ProtoMsg.PbCsPlayerItemsBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resUpdateItemBroad(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_ADD_INFO:
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     decodeMsg = ProtoMsg.PbCsGameExchangeAddInfoResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resCommitExchangeAddress(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_GET_INFO:
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     decodeMsg = ProtoMsg.PbCsGameExchangeGetInfoResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPullExchangeAddress(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_RECORD:
        //     decodeMsg = ProtoMsg.PbCsGameExchangeRecordResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.respullExChangeRecord(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_BY_LOTTERY:
        //     decodeMsg = ProtoMsg.PbCsGameExchangeByLotteryResMsg.decode(msg);
        //     this.resExchangeItem(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_YESTERDAY_KILLED_GOLD:
        //     //获取反奖券数据
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     decodeMsg = ProtoMsg.PbCsGameYesterdayKilledGoldResMsg.decode(msg);
        //     GameData.isRebate = !!decodeMsg.hastake;
        //     GameData.rebateDate = decodeMsg.date;
        //     GameData.rebateNum = decodeMsg.lottery_count ? decodeMsg.lottery_count : 0;
        //     GameData.rebateData = decodeMsg;
        //     EventDis.Instance.dispatchEvent(GlobalVar.NOTICE_YESTERDAY_GOLD, decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_YESTERDAY_KILLED_LOTTERY:
        //     //领取奖券
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     decodeMsg = ProtoMsg.PbCsGameYesterdayKilledLotteryResMsg.decode(msg);
        //     GameData.isRebate = true;
        //     PlayerData.setItemNum(GlobalConst.ticket + "", decodeMsg.left_lottery);
        //     EventDis.Instance.dispatchEvent(GlobalVar.NOTICE_YESTERDAY_DONE, decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_USE_ITEM:
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerUseItemResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resDaoDanHitFail(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_USE_ITEM:
        //     //弹头使用效果
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerUseItemBroadMsg.decode(msg);
        //     let data = decodeMsg.item_info;
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     let items = GlobalFunc.transGoldItem(data.drops.items);
        //     let tray = {
        //         fishData: {
        //             goldNum: items[0] ? items[0].count : 0,
        //             tray: 4,
        //             fishInfo: {
        //                 Icon: `${data.item_id - 1}`
        //             }
        //         },
        //         seatIndex: BattleData.getUserSeatByUid(data.uid)
        //     };
        //     Laya.timer.once(3500, this, () => {
        //         EventDis.Instance.dispatchEvent(GlobalVar.PLAY_ROOM_TRAY_ANI, tray);
        //     });
        //     if (data.uid != GameData.uid) return;
        //     PlayerData.addItemsNum([ {
        //         item_id: data.item_id,
        //         count: -data.item_count
        //     } ], false, false);
        //     Laya.timer.once(3500, this, () => {
        //         PlayerData.addItemsNum(items, false, true, true);
        //     });
        //     EventDis.Instance.dispatchEvent("bombReceive", items);
        //     Laya.timer.once(6e3, this, () => {
        //         FishData.isInDaoDan = false;
        //         FishData.inDaodan = false;
        //     });
        //     this.resDaoDanHitSuccess(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_DANTOU_RANKING_LIST:
        //     decodeMsg = ProtoMsg.PbCsGameDanTouRankingListResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resDantouRank(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_STORE_PURCHASE:
        //     //支付服务器扣钱成功
        //     decodeMsg = ProtoMsg.PbCsGamePlayerStorePurchaseMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GlobalFunc.log(decodeMsg);
        //     //重置渔场弹出
        //     FishData.stopPop = true;
        //     PlayerData.Instance.addItemsNum(decodeMsg.order_info.buy_items.items, false, true, true);
        //     //订单处理
        //                         let orderInfo = decodeMsg.order_info;
        //     let product_id = orderInfo.product_id;
        //     if (product_id == "2010" && !GameData.Instance.isFirstRecharge) {
        //         GameData.Instance.tehuiState1 != 2 && (GameData.Instance.tehuiState1 = 1);
        //         GameData.Instance.isFirstRecharge = true;
        //     } else if (product_id == "4010" && GameData.Instance.isFirstRecharge && GameData.Instance.tehuiState1 != 2) {
        //         GameData.Instance.tehuiState2 != 2 && (GameData.Instance.tehuiState2 = 1);
        //         GameData.Instance.tehuiState1 = 2;
        //     } else if (product_id == "4020" && GameData.Instance.tehuiState1 == 2 && GameData.Instance.tehuiState2 != 2) {
        //         GameData.Instance.tehuiState2 = 2;
        //     } else if (product_id == "3020") {
        //         GameData.Instance.isShaked = true;
        //         FishData.shakeTime = 0;
        //     } else if (product_id == "3010") {
        //         let time = GameData.monthEndTime ? GameData.monthEndTime : Math.floor(GameData.serverTimeStamp * .001);
        //         if (GameData.monthEndDay <= 0) {
        //             //重新购买
        //             GameData.Instance.monthEndDay == 30;
        //             GameData.Instance.isMonthToday = true;
        //             GameData.Instance.monthEndTime = 30 * 3600 * 24 + Math.floor(GameData.serverTimeStamp * .001);
        //         } else {
        //             //续费
        //             GameData.monthEndTime = time + 30 * 3600 * 24;
        //             GameData.monthEndDay += 30;
        //         }
        //         GlobalFunc.setMonthTime();
        //     } else if (product_id == "4101" || product_id == "4102" || product_id == "4103" || product_id == "4104") {
        //         GameData.newTehuiStates[product_id] = false;
        //     } else if (product_id == "4201" || product_id == "4202" || product_id == "4203" || product_id == "4204") {
        //         OnOffManager.isChaozOn = 0;
        //         EventDis.Instance.dispatchEvent(GlobalVar.GIFT_CHAOZ1_GET);
        //     } else if (product_id == "4205") {
        //         OnOffManager.isChaozOn = 0;
        //         EventDis.Instance.dispatchEvent(GlobalVar.GIFT_CHAOZ2_GET);
        //     }
        //     EventDis.Instance.dispatchEvent("paySuccess", decodeMsg.order_info.buy_items);
        //     decodeMsg.order_info.vip_lv && PlayerData.Instance.updateVipInfo({
        //         vip: decodeMsg.order_info.vip_lv
        //     });
        //     decodeMsg.order_info.vip_lv && EventDis.Instance.dispatchEvent(GlobalVar.DATA_VIP_INFO, {
        //         vip: decodeMsg.order_info.vip_lv
        //     });
        //     decodeMsg.order_info.vip_exp && EventDis.Instance.dispatchEvent(GlobalVar.VIP_EXP_UP, decodeMsg.order_info.vip_exp);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_UPDATE_CONFIG_BROAD:
        //     decodeMsg = ProtoMsg.PBCsGameUpdateConfigBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resUpdateConfig();
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_EQUIP_PAO_ITEM:
        //     //切换炮皮肤广播
        //     decodeMsg = ProtoMsg.PBCsRoomEquipPaoItemBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resEquipSkinBroad(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EQUIP_PAO_ITEM:
        //     //切换炮皮肤
        //     decodeMsg = ProtoMsg.PbCsGameEquipPaoItemResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resEquipSkin(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_NEW_ANNOUNCEMENT:
        //     //新公告
        //     decodeMsg = ProtoMsg.PBCsGameNewAnnouncementBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resNewAnnouncement(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_MINGRI:
        //     //明日领奖
        //     decodeMsg = ProtoMsg.PbCsGamePlayerTakeMingriResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.tomrrowState = 3;
        //     PlayerData.Instance.addItemsNum(decodeMsg.items);
        //     EventDis.Instance.dispatchEvent("endHelping");
        //     EventDis.Instance.dispatchEvent(GlobalVar.TOMORROW_GOT, GlobalFunc.transGoldItem(decodeMsg.items));
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_SET_MINGRI:
        //     //明日打点
        //     decodeMsg = ProtoMsg.PbCsGamePlayerSetMingriResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.tomrrowState = 1;
        //     EventDis.Instance.dispatchEvent(GlobalVar.TOMORROW_SEND);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ADD_YAOYIYAO:
        //     //摇一摇加次数
        //     decodeMsg = ProtoMsg.PbCsGamePlayerAddYaoyiyaoResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.shakeTimes++;
        //     GameData.Instance.shakeTimes = Math.min(GameData.Instance.shakeTimes, 5);
        //     EventDis.Instance.dispatchEvent(GlobalVar.YAO_CHANGE);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ONCE_YAOYIYAO:
        //     //摇一次
        //     decodeMsg = ProtoMsg.PbCsGamePlayerOnceYaoyiyaoResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.shakeNum = decodeMsg.coin_num;
        //     GameData.Instance.shakeTimes--;
        //     GameData.Instance.shakeTimes = Math.max(GameData.Instance.shakeTimes, 0);
        //     EventDis.Instance.dispatchEvent(GlobalVar.YAO_YI_YAO, decodeMsg);
        //     EventDis.Instance.dispatchEvent(GlobalVar.YAO_CHANGE);
        //     FishData.isShake = false;
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_YUEKA_DAILY_PACKET:
        //     //领月卡
        //     decodeMsg = ProtoMsg.PbCsGamePlayerYuekaDailyPacketResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.isMonthToday = true;
        //     PlayerData.Instance.addItemsNum(decodeMsg.items);
        //     EventDis.Instance.dispatchEvent(GlobalVar.GETMONTHREWARD, decodeMsg.items);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_BROAD_MARQUEE:
        //     //跑马灯广播
        //     decodeMsg = ProtoMsg.PBCsGameMarqueeBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     EventDis.Instance.dispatchEvent(GlobalVar.MARQUEE_BROAD_MSG, decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_CHANGE_LONGPAO_BROAD:
        //     //切换龙炮状态广播
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerChangeLongPaoBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resChangeDragonCannonState(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_CHANGE_LONGPAO:
        //     //切换龙炮状态广播
        //     decodeMsg = ProtoMsg.PBCsRoomPlayerChangeLongPaoResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     //异常处理
        //                         break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_SEND_SHARE_NOTIFY:
        //     //有人被自己邀请卡片登陆
        //     decodeMsg = ProtoMsg.PbCsGamePlayerSendShareNotifyMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.inviteNum++;
        //     EventDis.Instance.dispatchEvent(GlobalVar.SHARE_ADD);
        //     GlobalFunc.log("好友受邀登陆");
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_SHARE_AWARDS:
        //     //领奖
        //     EventDis.Instance.dispatchEvent("reset_list_invite");
        //     decodeMsg = ProtoMsg.PbCsGamePlayerGetShareAwardsResMsg.decode(msg);
        //     if (!this.isMsgValid(msg)) return;
        //     if (decodeMsg.items.length == 0) return;
        //     PlayerData.Instance.addItemsNum(decodeMsg.items);
        //     GameData.Instance.inviteAwards.push(decodeMsg.award_id);
        //     EventDis.Instance.dispatchEvent(GlobalVar.SHARE_REWARD, decodeMsg.items);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_ROOM_GET_TODAY_TOTAL_KILL_GOLD:
        //     //退房间请求
        //     decodeMsg = ProtoMsg.PBCsRoomGetTodayTotalKillGoldResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resTodayKillGold(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_SEND_SHARE_INFO:
        //     //我的邀请信息
        //     decodeMsg = ProtoMsg.PbCsGamePlayerSendShareInfoMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.Instance.inviteNum = decodeMsg.uid_arr.length;
        //     GameData.Instance.inviteAwards = decodeMsg.award_arr;
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_DEBRIS_COMPOSE:
        //     //碎片合成
        //     decodeMsg = ProtoMsg.PbCsGameDebrisComposeResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resDebrisCompose(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_DEBRIS_COMPOSE_LIST:
        //     //碎片合成
        //     decodeMsg = ProtoMsg.PbCsGameDebrisComposeListMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPlayerComposeList(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_GUIDE_UPLOAD:
        //     //引导通信
        //     decodeMsg = ProtoMsg.PBCsGameGuideUploadResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     if (decodeMsg.guide_type == 0) {
        //         GameData.roomguide = true;
        //     } else if (decodeMsg.guide_type == 1) {
        //         GameData.Instance.numberState = true;
        //     }
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_START_BROAD:
        //     //登录活动开始
        //     decodeMsg = ProtoMsg.PBCsGameActivityStartBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.activityStart(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_END_BROAD:
        //     //活动结束
        //     decodeMsg = ProtoMsg.PBCsGameActivityEndBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resActivityEnd(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_PHONE_BILL_GET:
        //     //话费券领取
        //     decodeMsg = ProtoMsg.PBCsGameActivityPhoneBillGetResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPhoneBillGet();
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_PUBLIC_NUMBER_GET:
        //     //公众号关注
        //     decodeMsg = ProtoMsg.PBCsGameActivityPublicNumberGetResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_PUBLIC_NUMBER_REWARD:
        //     //公众号领奖
        //     decodeMsg = ProtoMsg.PBCsGameActivityPublicNumberRewardResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_ITEM_BAG_FULL_BROAD:
        //     //公众号领奖
        //     decodeMsg = ProtoMsg.PBCsGameItemBagFullBroadMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resPlayerItemFall(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PUSH_SHOP_GIFT_INFO:
        //     //三合一礼包
        //     decodeMsg = ProtoMsg.PBCsGamePushShopGiftInfoMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resGiftCzInfo(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_HAIWANGZHENGBA_GET_RANK:
        //     //海王争霸
        //     decodeMsg = ProtoMsg.PBCsGameHaiWangZhengBaGetRankResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     this.resRankingWarData(decodeMsg);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_PAY_GET_ORDER:
        //     //拿订单号
        //     decodeMsg = ProtoMsg.PBCsGamePayGetOrderResMsg.decode(msg);
        //     if (decodeMsg.ret.err_code == ProtoMsg.emResponseCode.CODE_PAY_GET_ORDER_WAIT_TIME) {
        //         new WarningMessage_1.WarningMessage("订单处理中," + Math.max(1, decodeMsg.wait_second) + "秒后可以再次购买");
        //         return;
        //     }
        //     if (decodeMsg.ret.err_code == ProtoMsg.emResponseCode.WEB_CODE_PAY_ORDER_DAY_LIMIT || decodeMsg.ret.err_code == ProtoMsg.emResponseCode.WEB_CODE_PAY_ORDER_MONTH_LIMIT) {
        //         //支付超过每日限制
        //         let str1 = GlobalFunc.getColorText("抱歉您已达到每日充值上限");
        //         let str2 = GlobalFunc.getColorText("明日可继续充值");
        //         SManager.Instance.addToMiddLayer(new CommonDialog(1, [ str1 ], [ str2 ], "确定", "提示", true), GlobalConst.dialogLayer);
        //     } else if (decodeMsg.ret && decodeMsg.ret.err_code == 0 && !!decodeMsg.order_info) {
        //         if (decodeMsg.order_info && this.orderObj[decodeMsg.order_info.product_id] != decodeMsg.pay_seq) return;
        //         GlobalFunc.log("请求服务器订单号成功");
        //         EventDis.dispatchEvent("gotOrder");
        //         this.reqServerPay(decodeMsg);
        //     } else {
        //         if (!this.isMsgValid(decodeMsg)) return;
        //         for (let k in decodeMsg) {
        //             GlobalFunc.log(decodeMsg[k]);
        //         }
        //         GameData.isPaing = false;
        //         GlobalFunc.log("请求服务器订单号失败");
        //         EventDis.dispatchEvent(GlobalVar.COMMODITY_PAY_FALSE);
        //     }
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_CONFIG:
        //     //兑换库存
        //     decodeMsg = ProtoMsg.PBCsGameExchangeConfigResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     EventDis.dispatchEvent("exchange_conf_load", decodeMsg.items);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_GIVE_CHECK:
        //     //导弹开放
        //     decodeMsg = ProtoMsg.PBCsGameGiveCheckResMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     GameData.isDDOpen = decodeMsg.can_give;
        //     EventDis.dispatchEvent("check_game_give", decodeMsg.can_give);
        //     break;

        //   case ProtoMsg.emCSMsgId.CS_MSG_GAME_NOTIFY_UPDATE_TOKEN:
        //     //token
        //     decodeMsg = ProtoMsg.PBCsGameNotifyUpdataTokenMsg.decode(msg);
        //     if (!this.isMsgValid(decodeMsg)) return;
        //     if (Single.SingleConfig.platform == Single.Platform.H5Bianf) {
        //         GameData.fresh_token = decodeMsg.token;
        //     }

        //   default:
        //     break;
        // }
        this.filtMsglog(protoType, time, decodeMsg);
    }
    Utf8ArrayToStr(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString;
    }
    /**过滤log
    * 子弹广播，心跳，击中广播
    */            
    filtMsglog(protoType, time, decodeMsg) {
        // if (protoType != ProtoMsg.emCSMsgId.CS_MSG_HEART_BEAT && //心跳
        // protoType != ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_BULLET && //子弹广播
        // protoType != ProtoMsg.emCSMsgId.CS_MSG_GAME_NEW_ANNOUNCEMENT && //公告
        // protoType != ProtoMsg.emCSMsgId.CS_MSG_ROOM_BROAD_HIT) {
        //     GlobalFunc.log("socket receive:" + protoType, ProtoMsg.emCSMsgId[protoType], decodeMsg);
            // console.log("-----------------------------------------")
                        //}
    }
    //玩家挤下线
    resPlayerKick() {
        this.isKicked = true;
        EventDis.Instance.dispatchEvent("sc_player_kick_2");
    }
    //---------------tool method-------------
    encodeMsg(cls, protoType, protoB) {
        var msg = cls.create(protoB);
        var buff = cls.encode(msg).finish();
        // globalFun.log("socket send ", protoType + ProtoMsg.emCSMsgId[protoType], protoB)
                        this.send(protoType, buff);
    }
    // ------------------------- 服务器收发 ------------------------- //
    isMsgSuc(msg) {
        if (!msg || msg.ret != 0) {
            return false;
        } else {
            return true;
        }
    }
    //请求登录
    reqPlayerLogin() {
        // var protoB = new ProtoMsg.PbCsPlayerLoginReqMsg();
        // protoB.account = GameData.Instance.account;
        // protoB.login_type = GameData.Instance.accountType;
        // console.log("scoket登陆，token:" + GameData.Instance.token);
        // console.log("fresh_token:" + GameData.Instance.fresh_token);
        // if (Single.SingleConfig.platform == Platform.H5Bianf) {
        //     protoB.fresh_token = GameData.Instance.fresh_token;
        // }
        // protoB.token = GameData.Instance.token;
        // protoB.uid = +GameData.Instance.uid;
        // protoB.invite_uid = GameData.Instance.queryId;
        // protoB.version = Single.SingleConfig.versionName;
        // console.log({
        //     protoB: protoB
        // });
        
        //this.encodeMsg(ProtoMsg.PbCsPlayerLoginReqMsg, ProtoMsg.emCSMsgId.CS_MSG_PLAYER_LOGIN, protoB);
    }
    //登录成功
    resPlayerLogin(decodeMsg) {
        this.doLogin(decodeMsg);
        this.reqHeartBeat();
        this.reqLoadHelp();
        this.battleResIndex = MainFunc.getNextResList().length;
        this.resCount = 0;
        Laya.timer.loop(1e3, this, this.reqHeartBeat);
    }
    /**
* 心跳定时器处理函数
* 监听socket连接状态判断是否需要断线重连
*/            reqHeartBeat() {
        if (!this.socket.connected && !this.isKicked && !this.isCloseGame && !this.isReconnecting) {
            // Laya.timer.clear(this, this.reqHeartBeat);
            WaitManager.Instance.showWaitLayer("socket closed", 3e4, "1");
            console.log("【开始重连】");
            this.isReconnecting = true;
            switch (Single.SingleConfig.platform) {
              case Platform.WXGAME:
                // WxLogin.getUserInfo();
                //Wxlogin.getUserInfo();
                break;

              case Platform.H5Bianf:
                NetManager.Instance.connect();
                break;

              case Platform.H5UC:
                //LoadManager_H5UC.uc_login();
                break;

              case Platform.H5QTT:
                //LoadManager_H5QTT.loginConnect();
                break;

              case Platform.H5APP:
                //LoadManager_H5APP.createLoadingScene();
                break;

              default:
                break;
            }
            return;
        }
        if (this.resCount < this.battleResIndex) {
            Laya.loader.load(MainFunc.getNextResList());
            this.resCount++;
        }
        // var protoType = ProtoMsg.emSSMsgId.SVR_MSG_HEART_BEAT;
        // var proto = new Uint8Array(0);
        // if (!this.heartTimeMap) this.heartTimeMap = new Map();
        // this.send(protoType, proto);
        // for (let i = this.protoSec; i > 0; i--) {
        //     if (this.heartTimeMap.get(i)) {
        //         if (new Date().getTime() - this.heartTimeMap.get(i) > 5e3) {
        //             this.isReconnecting = false;
        //         }
        //     }
        // }
    }
    stringToUint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        //Laya.BezierLerp;
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array;
    }
    resHeartBeat(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.HEART_BEAT, decodeMsg.now_time_msec);
    }
    //请求进房间
    reqEnterRoom(data) {
        console.log(data);
        console.log("请求进房间");
        // var protoB = new ProtoMsg.PbCsGameEnterRoomReqMsg();
        // protoB.room_type = data.room_type;
        // protoB.enter = data.enter;
        // this.encodeMsg(ProtoMsg.PbCsGameEnterRoomReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ENTER_ROOM, protoB);
    }
    resEnterRoom(decodeMsg) {
        //进入
        GlobalConst.enterRoomFlag = true;
        // if (decodeMsg.enter) {
        //     if (decodeMsg.ret.err_code == ProtoMsg.emResponseCode.CODE_GOLD_NOT_ENOUGH) {
        //         console.log("金币数量不足");
        //         //金币数量不足
        //                                 GlobalFunc.enterRoomFailed(decodeMsg.enter_need_gold);
        //         return;
        //     } else if (decodeMsg.ret.err_code == ProtoMsg.emResponseCode.CODE_GAME_TODAY_GOLD_LIMIT) {
        //         console.log("已达到今日输赢上限");
        //         //抱歉您已达到今日输赢上限，无法继续捕鱼，欢迎明日再来
        //                                 let str1 = GlobalFunc.getColorText("抱歉您已达到今日输赢上限");
        //         let str2 = GlobalFunc.getColorText("无法继续捕鱼，欢迎明日再来");
        //         SceneManager.Instance.addToMiddLayer(new CommonDialog(1, [ str1 ], [ str2 ], "确定", "提示", true), GlobalConst.dialogLayer);
        //         return;
        //     } else if (decodeMsg.ret.err_code == ProtoMsg.emResponseCode.CODE_ENTER_ROOM_VIP_LIMIT) {
        //         console.log("VIP等级不足");
        //         SceneManager.Instance.addToMiddLayer(new VipPaoDialog(-1, {
        //             vipIndex: PlayerData.roomItems.vip_level
        //         }), GlobalConst.dialogLayer);
        //         return;
        //     }
        //     BattleData.setRoomInfo(decodeMsg);
        //     EventDis.dispatchEvent(GlobalVar.ENTER_ROOM_SUCCESS, decodeMsg);
        // } else {
        //     //todo:离开
        //     EventDis.dispatchEvent(GlobalVar.LEAVE_ROOM_SUCCESS);
        // }
    }
    //请求发射子弹
    //bullet_type 子弹类型：普通，钻头，鸿运，导弹
    reqShoot(data) {
        // let protoB = new ProtoMsg.PBCsRoomPlayerBulletReqMsg();
        // protoB.bullet_id = data.bullet_id;
        // protoB.bullet_type = data.bullet_type;
        // protoB.rotation_angle = Math.floor(data.rotation_angle);
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerBulletReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_BULLET, protoB);
    }
    resShootFail(decodeMsg) {
        GlobalFunc.log("请求发射子弹失败");
    }
    resShootBroad(decodeMsg) {
        EventDis.Instance.dispatchEvent("shoot_notice_broadCast", decodeMsg);
    }
    //请求碰撞,只请求自己的子弹
    reqHit(data) {
        // let protoB = new ProtoMsg.PBCsRoomPlayerHitReqMsg();
        // protoB.bullet_id = data.bulletId;
        // protoB.fish_id = data.fishUniqId;
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerHitReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_HIT, protoB);
    }
    resHitFail(decodeMsg) {
        GlobalFunc.log("请求击中鱼失败");
    }
    resHitBroad(decodeMsg) {
        //至少会有金币掉落，没有任何掉落说明是没有命中
        if (decodeMsg.drops) {
            EventDis.Instance.dispatchEvent("killFish_broad", decodeMsg);
            // if (decodeMsg.drops.uid != g_GameData.uid || g_GameData.tomrrowState != 0) return;
            // let items = decodeMsg.drops.items as any[];
            // let gold = items.filter((item: any) => item.item_id == GlobalConst.gold);
            // if (gold.length > 0 && !g_GameData.tomrrowFlag) {
            //     g_GameData.tomrrowGold -= gold[0];
            //     if (g_GameData.tomrrowGold <= 0) {
            //         g_GameData.tomrrowFlag = true;
            //         g_NetManager.reqTakeMing();
            //     }
            // }
                        } else {
            //只是碰撞回应，没有命中
        }
    }
    //请求切换炮倍，炮台皮肤等
    reqChangePao(data) {
        // let proto = new ProtoMsg.PBCsRoomPlayerChangePaoReqMsg();
        // proto.pao = data.pao;
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerChangePaoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_CHANGE_PAO, proto);
    }
    resChangePao(data) {
        EventDis.Instance.dispatchEvent("change_paobei_notice", data);
    }
    //新手引导计数
    reqSetGuideStep() {
        // let proto = new ProtoMsg.PbCsGameUpdateGuideStepReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameUpdateGuideStepReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_UPDATE_GUIDE_STEP, proto);
    }
    //下发邮件
    resMailMsg(decodeMsg) {
        if (decodeMsg.login) {
            //MailDialog_1.g_mailsData.initMailData(decodeMsg.mails);
        } else {
            //MailDialog_1.g_mailsData.updateMailData(decodeMsg.mails);
            EventDis.Instance.dispatchEvent(GlobalVar.UPDATA_MAIL_NUM);
        }
    }
    //读邮件
    reqReadMail(data) {
        //let proto = new ProtoMsg.PbCsGamePlayerReadMailReqMsg();
        //proto.mail_id = data.mail_id;
        //this.encodeMsg(ProtoMsg.PbCsGamePlayerReadMailReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_READ_MAIL, proto);
    }
    resReadMail(decodeMsg) {}
    //领取邮件
    reqAttachMail(data) {
        //let proto = new ProtoMsg.PbCsGamePlayerAttachMailReqMsg();
        //proto.mail_id = data.mail_id;
        //this.encodeMsg(ProtoMsg.PbCsGamePlayerAttachMailReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_ATTACH_MAIL, proto);
    }
    resAttachMail(decodeMsg) {
        EventDis.Instance.dispatchEvent("attach_mail", decodeMsg);
    }
    //删除邮件
    reqDelMail(data) {
        // let proto = new ProtoMsg.PbCsGamePlayerDelMailReqMsg();
        // proto.mail_id = data.mail_id;
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerDelMailReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_PLAYER_DEL_MAIL, proto);
    }
    resDelMail(decodeMsg) {}
    /**获取其他玩家信息 */            
    reqGetPlayerInfo(uid) {
        // let proto = new ProtoMsg.PbCsGameGetPlayerInfoReqMsg();
        // proto.uid = uid;
        // this.encodeMsg(ProtoMsg.PbCsGameGetPlayerInfoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_PLAYER_INFO, proto);
    }
    /**背包物品购买 */            
    reqPackageBuy(data) {
        // let proto = new ProtoMsg.PbCsGameBagBuyItemReqMsg();
        // proto.item_id = data.itemId;
        // proto.count = data.itemNum;
        // this.encodeMsg(ProtoMsg.PbCsGameBagBuyItemReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_BAG_BUY_ITEM, proto);
    }
    /**背包物品购买 */            resPackageBuy(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.ITEM_BUY_NOTICE, decodeMsg);
    }
    /**背包物品赠送 */            
    reqPackageZengSong(data) {
        // let proto = new ProtoMsg.PbCsGameBagZengSongReqMsg();
        // proto.item_id = data.itemId;
        // proto.count = data.itemNum;
        // proto.zs_uid = data.uid;
        // this.encodeMsg(ProtoMsg.PbCsGameBagZengSongReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_BAG_ZENGSONG, proto);
    }
    reqXyzpReward() {
        // let proto = new ProtoMsg.PBCsRoomPlayerXyzpGetRewardReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerXyzpGetRewardReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_XYZP_GET_REWARD, proto);
    }
    /**背包物品赠送 */            
    resPackageZengSong(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.ITEM_ZENG_SONG_NOTICE, decodeMsg);
        // new WarningMessage_1.WarningMessage("已成功赠送", true, undefined);
    }
    /**海王宝藏开始游戏 */            
    reqStartHaiWangFish() {
        // let proto = new ProtoMsg.PBCsRoomPlayerHwbzStartReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerHwbzStartReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_HWBZ_START, proto);
    }
    /**海王宝藏开始游戏 */            resStartHaiWangFish(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.HWBZ_START_GAME);
    }
    /**海王宝藏点击 */            reqHaiWangFishClick() {
        // let proto = new ProtoMsg.PBCsRoomPlayerHwbzClickReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerHwbzClickReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_HWBZ_CLICK, proto);
    }
    /**海王宝藏点击 */            resHaiWangFishClick(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.HWBZ_CLICK_EVENT, decodeMsg);
    }
    /**登陆转盘获取奖励 */            
    reqGetLoginRouletteReward() {
        // let proto = new ProtoMsg.PbCsRoundPlateReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsRoundPlateReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ROUND_PLATE, proto);
    }
    /**登陆转盘获取奖励 */            
    resGetLoginRouletteReward(decodeMsg) {
        // if (decodeMsg.ret && decodeMsg.ret != {}) return;
        EventDis.Instance.dispatchEvent(GlobalVar.LOGIN_ROULETTE_REWARD, decodeMsg);
    }
    /**整点奖励load */            
    reqWholeRewardLoad() {
        // let proto = new ProtoMsg.PbCsGameGetZhengDianRewardListReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameGetZhengDianRewardListReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_ZHENG_DIAN_REWARD_LIST, proto);
    }
    /**整点奖励领取 */            
    reqWholeReward(id) {
        // let proto = new ProtoMsg.PbCsGameTakeZhengDianRewardReqMsg();
        // proto.list_id = id;
        // this.encodeMsg(ProtoMsg.PbCsGameTakeZhengDianRewardReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_ZHENG_DIAN_REWARD, proto);
    }
    /**大厅救济金load */            
    reqLoadHelp() {
        // let proto = new ProtoMsg.PbCsGameDoleLeftCountReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameDoleLeftCountReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_DOLE_LEFT_COUNT, proto);
    }
    //大厅救济金领取
    reqGetHelp() {
        // let proto = new ProtoMsg.PbCsGameTakeDoleReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameTakeDoleReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_DOLE, proto);
    }
    /**珠事好运结束 */            
    reqZshyGameFinish() {
        // let proto = new ProtoMsg.PBCsRoomPlayerZshyCollectReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerZshyCollectReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_ZSHY_COLLECT, proto);
    }
    /**五龙寻宝结束 */            
    reqWldbGameFinish() {
        // let proto = new ProtoMsg.PBCsRoomPlayerWldbCollectReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerWldbCollectReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_WLDB_COLLECT, proto);
    }
    /**鸿运当头结束 */            
    reqHydtGameFinish() {}
    /**钻头爆炸 */            
    reqBitBomb(data) {
        // let proto = new ProtoMsg.PBCsRoomPlayerZuantouBombReqMsg();
        // proto.fish_ids = data.fish_ids;
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerZuantouBombReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_ZUANTOU_BOMB, proto);
    }
    /**拉取兑换记录 */            
    reqpullExchangeRecord() {
        // let proto = new ProtoMsg.PbCsGameExchangeRecordReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameExchangeRecordReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_RECORD, proto);
    }
    respullExChangeRecord(decodeMsg) {
        EventDis.Instance.dispatchEvent("pull_record_success", decodeMsg);
    }
    /**提交兑换地址 */            reqCommitExchangeAddress(address) {
        // let proto = new ProtoMsg.PbCsGameExchangeAddInfoReqMsg();
        // proto.address = address;
        // this.encodeMsg(ProtoMsg.PbCsGameExchangeAddInfoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_ADD_INFO, proto);
    }
    resCommitExchangeAddress(decodeMsg) {
        EventDis.Instance.dispatchEvent("commit_address_success");
    }
    /**拉取兑换地址 */            
    reqPullExchangeAddress() {
        // let proto = new ProtoMsg.PbCsGameExchangeGetInfoReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameExchangeGetInfoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_GET_INFO, proto);
    }
    resPullExchangeAddress(decodeMsg) {
        EventDis.Instance.dispatchEvent("pull_address_success", decodeMsg);
    }
    /**确认兑换 */            
    reqExchangeItem(data) {
        // let proto = new ProtoMsg.PbCsGameExchangeByLotteryReqMsg();
        // proto.exchange_id = data.exchange_id;
        // proto.address = data.address;
        // proto.quantity = data.count;
        // proto.from = data.from || 0;
        // GlobalFunc.log("兑换数量:" + data.count);
        // GlobalFunc.log("兑换ID:" + data.exchange_id);
        // this.encodeMsg(ProtoMsg.PbCsGameExchangeByLotteryReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_BY_LOTTERY, proto);
    }
    resExchangeItem(decodeMsg) {
        // if (decodeMsg.ret && decodeMsg.ret.err_code == ProtoMsg.emResponseCode.CODE_EXCHANGE_COUNT_NOT_ENOUGH) {
        //     new WarningMessage_1.WarningMessage("今日库存不足，明日还有哦！");
        // } else {
        //     PlayerData.setItemNum(GlobalConst.ticket + "", decodeMsg.left_lottery);
        //     PlayerData.setItemNum(GlobalConst.PointID + "", decodeMsg.score_count);
        //     PlayerData.setItemNum(GlobalConst.gold + "", decodeMsg.gold_count);
        //     if (!decodeMsg.real && decodeMsg.item_id != 1 && decodeMsg.item_id != 5 && decodeMsg.item_id != 42 && decodeMsg.item_id != 4) PlayerData.addItemsNum([ {
        //         item_id: decodeMsg.item_id,
        //         count: decodeMsg.item_count * decodeMsg.quantity
        //     } ]);
        // }
        EventDis.Instance.dispatchEvent("exchange_success", decodeMsg);
    }
    /**发送排行榜请求 */            
    reqDantouRank(type_id) {
        // let proto = new ProtoMsg.PbCsGameDanTouRankingListReqMsg();
        // proto.type_id = type_id;
        // this.encodeMsg(ProtoMsg.PbCsGameDanTouRankingListReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_DANTOU_RANKING_LIST, proto);
    }
    // t {list: Array(30), ret: O, 
    // self_name: "【游客】渔夫35", self_count: "100", self_ranking: "0"}
    resDantouRank(decodeMsg) {
        EventDis.Instance.dispatchEvent("get_dantou_rank_suc", decodeMsg);
    }
    reqDaoDanHit(data) {
        // if (data.fishId == "" || data.itemId == -1) return;
        // let proto = new ProtoMsg.PBCsRoomPlayerUseItemReqMsg();
        // proto.fish_id = data.fishId;
        // proto.item_id = data.itemId;
        // proto.item_count = !!data.item_count ? data.item_count : 1;
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerUseItemReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_USE_ITEM, proto);
    }
    /**接收导弹击杀失败 */            
    resDaoDanHitFail(decodeMsg) {
        PlayerData.Instance.updateItemsNum({
            items: [ {
                item_id: decodeMsg.item_id,
                count: decodeMsg.item_count
            } ]
        });
    }
    /**获取返奖券信息*/            
    reqYesterDayGold() {
        // let proto = new ProtoMsg.PbCsGameYesterdayKilledGoldReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameYesterdayKilledGoldReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_YESTERDAY_KILLED_GOLD, proto);
    }
    /**领奖券*/            
    reqYesterDayReward() {
        // let proto = new ProtoMsg.PbCsGameYesterdayKilledLotteryReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGameYesterdayKilledLotteryReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_YESTERDAY_KILLED_LOTTERY, proto);
    }
    reqPcOrder(decodeMsg) {
        let order_info = decodeMsg.order_info;
        let order_id = GlobalFunc.decodeUnit8(decodeMsg.order_info.info_id);
        this.payOrderId.push(order_id);
        this.payOrderObj[order_id] = `${+order_info.amount / 100}/${order_info.product_id}`;
        Single.pay(decodeMsg);
    }
    // reqGetOrder(product_id, reason = ProtoMsg.emPayReason.normal) {
    //     // this.payOrder++;
    //     // this.orderObj[`${product_id}`] = this.payOrder;
    //     // let proto = new ProtoMsg.PBCsGamePayGetOrderReqMsg();
    //     // proto.product_id = +product_id;
    //     // proto.pay_type = Single.Single.getPayType();
    //     // proto.pay_reason = ProtoMsg.emPayReason.normal;
    //     // proto.pay_seq = this.payOrder;
    //     // this.encodeMsg(ProtoMsg.PBCsGamePayGetOrderReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_PAY_GET_ORDER, proto);
    // }
    delOrder(orderId) {
        // 订单号处理
        let orderIndex = this.payOrderId.indexOf(orderId);
        if (orderId != undefined) {
            if (orderIndex == -1) {
                return;
            } else {
                this.payOrderId.splice(orderIndex, 1);
                delete this.payOrderObj[orderId];
                delete this.payCount[orderId];
            }
        }
    }
    /**切换炮皮肤 */            
    reqEquipSkin(pao_item, type) {
        // let proto = new ProtoMsg.PbCsGameEquipPaoItemReqMsg();
        // proto.pao_item = pao_item;
        // proto.equip_type = type;
        // this.encodeMsg(ProtoMsg.PbCsGameEquipPaoItemReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EQUIP_PAO_ITEM, proto);
    }
    resEquipSkin(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.ROOM_SKIN_CHANGE, decodeMsg);
        decodeMsg.uid = GameData.Instance.uid;
        EventDis.Instance.dispatchEvent(GlobalVar.ROOM_SKIN_CHANGE_BROAD, decodeMsg);
    }
    resEquipSkinBroad(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.ROOM_SKIN_CHANGE_BROAD, decodeMsg);
    }
    /**明日礼包领取*/            
    reqTakeMing() {
        // let proto = new ProtoMsg.PbCsGamePlayerTakeMingriReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerTakeMingriReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_TAKE_MINGRI, proto);
    }
    /**明日礼包打点*/            
    reqSetMing() {
        // let proto = new ProtoMsg.PbCsGamePlayerSetMingriReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerSetMingriResMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_SET_MINGRI, proto);
    }
    /**摇一摇加次数*/            reqAddYao() {
        // let proto = new ProtoMsg.PbCsGamePlayerAddYaoyiyaoReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerAddYaoyiyaoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ADD_YAOYIYAO, proto);
    }
    /**摇一次*/            
    reqOnceYao() {
        // let proto = new ProtoMsg.PbCsGamePlayerOnceYaoyiyaoReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerOnceYaoyiyaoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ONCE_YAOYIYAO, proto);
    }
    /**获取月卡奖励 */            
    reqMonthReward() {
        // let proto = new ProtoMsg.PbCsGamePlayerYuekaDailyPacketReqMsg();
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerYuekaDailyPacketReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_YUEKA_DAILY_PACKET, proto);
    }
    /**通知服务器更变龙炮状态 */            
    reqChangeDragonState(state, dragonId) {
        // let proto = new ProtoMsg.PBCsRoomPlayerChangeLongPaoReqMsg();
        // proto.change_flag = state;
        // proto.longpao_id = dragonId;
        // this.encodeMsg(ProtoMsg.PBCsRoomPlayerChangeLongPaoReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_CHANGE_LONGPAO, proto);
    }
    /**邀请领奖 */            
    reqShareAward(id) {
        // let proto = new ProtoMsg.PbCsGamePlayerGetShareAwardsReqMsg();
        // proto.award_id = id;
        // this.encodeMsg(ProtoMsg.PbCsGamePlayerGetShareAwardsReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_GET_SHARE_AWARDS, proto);
    }
    /**退房间请求今日击杀获得的金币 */            
    reqTodayKillGold() {
        // let proto = new ProtoMsg.PBCsRoomGetTodayTotalKillGoldReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsRoomGetTodayTotalKillGoldReqMsg, ProtoMsg.emCSMsgId.CS_MSG_ROOM_GET_TODAY_TOTAL_KILL_GOLD, proto);
    }
    resTodayKillGold(decodeMsg) {
        EventDis.Instance.dispatchEvent("today_gold_back", decodeMsg);
    }
    /**碎片合成 */            
    reqDebrisCompose(itemId, count) {
        // let proto = new ProtoMsg.PbCsGameDebrisComposeReqMsg();
        // proto.dst_item_count = count;
        // proto.dst_item_id = +itemId;
        // this.encodeMsg(ProtoMsg.PbCsGameDebrisComposeReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_DEBRIS_COMPOSE, proto);
    }
    /**碎片合成 */            
    resDebrisCompose(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.HALL_DEBRISE_COMPOSE, decodeMsg);
    }
    /**引导通信 */            
    reqGuideSend(type) {
        // let proto = new ProtoMsg.PBCsGameGuideUploadReqMsg();
        // proto.guide_type = type;
        // this.encodeMsg(ProtoMsg.PBCsGameGuideUploadReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_GUIDE_UPLOAD, proto);
    }
    /**请求领取话费券 */            
    reqPhoneBillGet(activity_id) {
        // let proto = new ProtoMsg.PBCsGameActivityPhoneBillGetReqMsg();
        // proto.activity_id = activity_id;
        // this.encodeMsg(ProtoMsg.PBCsGameActivityPhoneBillGetReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_PHONE_BILL_GET, proto);
    }
    /**话费券领取成功 */            
    resPhoneBillGet() {
        EventDis.Instance.dispatchEvent("phone_bill_success");
    }
    /**公众号领奖 */           
    reqPublicNumberReward(activity_id) {
        // let proto = new ProtoMsg.PBCsGameActivityPublicNumberGetReqMsg();
        // proto.activity_id = activity_id;
        // this.encodeMsg(ProtoMsg.PBCsGameActivityPublicNumberGetReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_ACTIVITY_PUBLIC_NUMBER_REWARD, proto);
    }
    /**玩家物品到达上限 */            
    resPlayerItemFall(decodeMsg) {
        // let itemName = PlayerData.getItemData(+decodeMsg.item_id).itemName;
        // new WarningMessage_1.WarningMessage("您的" + itemName + "已到达上限,请尽快使用!", true);
        // PlayerData.Instance.setItemMax("" + decodeMsg.item_id, +decodeMsg.limit_count);
    }
    /**请求海王争霸榜数据 */            
    reqRankingWarData(rtype) {
        // let proto = new ProtoMsg.PBCsGameHaiWangZhengBaGetRankReqMsg();
        // proto.rtype = rtype;
        // this.encodeMsg(ProtoMsg.PBCsGameHaiWangZhengBaGetRankReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_HAIWANGZHENGBA_GET_RANK, proto);
    }
    //拉取兑换物品库存
    reqExchangeData() {
        // let proto = new ProtoMsg.PBCsGameExchangeConfigReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsGameHaiWangZhengBaGetRankReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_EXCHANGE_CONFIG, proto);
    }
    //导弹开放
    reqGameGive() {
        // let proto = new ProtoMsg.PBCsGameGiveCheckReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsGameGiveCheckReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_GIVE_CHECK, proto);
    }
    resRankingWarData(decodeMsg) {
        EventDis.Instance.dispatchEvent("ranking_war_data", decodeMsg);
    }
    /**活动结束 */            
    resActivityEnd(decodeMsg) {
        let info = GameData.Instance.activityData;
        let phone;
        for (let i = 0; i < info.length; ++i) {
            let one = info[i];
            if (one && one.config_info.atype == 1) {
                phone = one;
                break;
            }
        }
        let activity_id = decodeMsg.activity_id;
        if (activity_id == phone.config_info.id) {
            OnOffManager.isPhoneBillOn = false;
        } else if (activity_id == 6) {
            // OnOffManager.isGongZhongHaoOn = false;
        } else if (activity_id == 7) {
            // OnOffManager.isGongZhongHaoOn = false;
        }
        EventDis.Instance.dispatchEvent("activity_end_notice", decodeMsg);
        GameData.Instance.closeActivity(decodeMsg.activity_id);
    }
    /**通知服务器进入大厅 */            
    noticeEnterFirstHall() {
        // let proto = new ProtoMsg.PBCsGameNoticeEnterMainSceneReqMsg();
        // this.encodeMsg(ProtoMsg.PBCsGameNoticeEnterMainSceneReqMsg, ProtoMsg.emCSMsgId.CS_MSG_GAME_NOTICE_ENTER_MAIN_SCENE, proto);
    }
    // ------------------------- 服务器通知 ------------------------- //
    //切换场景
    resSwitchScene(decodeMsg) {
        EventDis.Instance.dispatchEvent("switchSceneId", decodeMsg);
    }
    resRebornFish(decodeMsg) {
        Laya.timer.once(1e3, EventDis, EventDis.Instance.dispatchEvent, [ "rebornFish", decodeMsg ], false);
        // g_EventDis.dispatchEvent("rebornFish", decodeMsg);
                }
    //超时踢玩家到大厅
    resOverTime(code) {
        // if (code.kick_code == ProtoMsg.emRoomKickType.over_time) {
        //     EventDis.Instance.dispatchEvent("roomOverTime");
        // } else {
        //     EventDis.Instance.dispatchEvent("vip_leave");
        // }
    }
    //玩家进出广播
    resPlayInfo(decodeMsg) {
        var player = decodeMsg.room_player;
        if (!player) {
            GlobalFunc.log("玩家信息无效", decodeMsg);
            return;
        }
        if (decodeMsg.enter) {
            BattleData.Instance.updateSeatInfo(player);
            EventDis.Instance.dispatchEvent("player_enter_room", player);
        } else {
            BattleData.Instance.updateSitInfoByLeave(player);
            EventDis.Instance.dispatchEvent("player_leave_room", player);
        }
    }
    /**获取其他玩家信息 */            
    resGetPlayerInfo(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.PLATER_INFO_NOTICE, decodeMsg);
    }
    /**获取登陆转盘信息 */            
    resGetLoginRouletteInfo(decodeMsg) {
        PlayerData.Instance.setLoginRouletteInfo(decodeMsg);
        EventDis.Instance.dispatchEvent("login_rotate");
    }
    /**房间内特色鱼结束 */            
    resRoomSpecialFishEnd(decodeMsg) {
        GlobalFunc.log("rrrrrrrrrrrrrrr", GlobalFunc.getClientTime());
        EventDis.Instance.dispatchEvent(GlobalVar.ROOM_SPECIAL_FISH_END, decodeMsg);
    }
    /**资源更新协议 */            
    resUpdateItemBroad(decodeMsg) {
        PlayerData.Instance.updateItemsNum(decodeMsg);
    }
    /**接收道具使用成功 */            
    resDaoDanHitSuccess(decodeMsg) {
        EventDis.Instance.dispatchEvent(GlobalVar.ROOM_USE_ITEM_NOTICE, decodeMsg);
    }
    /**热更通知 */            
    resUpdateConfig() {
        EventDis.Instance.dispatchEvent("updateConfigNotice");
    }
    /**新公告 */            
    resNewAnnouncement(decodeMsg) {
        EventDis.Instance.dispatchEvent("new_notice_coming", decodeMsg);
    }
    /**切换龙炮状态广播 */            
    resChangeDragonCannonState(decodeMsg) {
        if (decodeMsg.change_flag == 1) {
            EventDis.Instance.dispatchEvent(GlobalVar.ROOM_CHANGE_DRAGON_CANNON_START, {
                uid: decodeMsg.uid,
                longpao_id: decodeMsg.longpao_id
            });
        } else {
            let seatIndex = BattleData.Instance.getUserSeatByUid(decodeMsg.uid);
            EventDis.Instance.dispatchEvent(GlobalVar.ROOM_CHANGE_DRAGON_CANNON_END, seatIndex);
        }
    }
    /**玩家合成列表 */            
    resPlayerComposeList(decodeMsg) {
        HallData.Instance.initComposeList(decodeMsg.list);
    }
    /**三合一礼包推送 */            
    resGiftCzInfo(decodeMsg) {
        !!decodeMsg.shop_merge_info && HallData.Instance.setGiftCzState(decodeMsg.shop_merge_info);
        decodeMsg.liquan_shouchong_gift && (OnOffManager.isTicketFirstPayOn = decodeMsg.liquan_shouchong_gift);
    }
    /**登录推送活动信息 */            activityStart(decodeMsg) {
        if (GameData.Instance.activityData.length > 0) {
            //后来推送的活动，只有一个
            let act = decodeMsg.activities[0].config_info.atype;
            if (GameData.Instance.activityData.filter(a => a.config_info.atype == act).length == 0) {
                GameData.Instance.activityData.concat(decodeMsg.activities);
            } else {
                GameData.Instance.activityData.forEach(data => {
                    if (data.config_info.atype == act) {
                        data.config_info.name = decodeMsg.activities[0].config_info.name;
                        data.config_info.phone_bill_data = decodeMsg.activities[0].config_info.phone_bill_data;
                    }
                });
            }
            let one = decodeMsg.activities[0];
            let atype = one.config_info.atype;
            if (atype == 0) {} else if (atype == 1) {
                OnOffManager.isPhoneBillOn = true;
            } else if (atype == 2) {
                OnOffManager.isGongZhongHaoOn = true;
            } else if (atype == 3) {
                OnOffManager.isVipConfirmOn = true;
            } else if (atype == 4) {
                OnOffManager.isAddGroupOn = true;
            }
            HallData.Instance.initActivityRedInfo();
            return;
        }
        GameData.Instance.activityData = decodeMsg.activities;
        let info = GameData.Instance.activityData;
        for (let i = 0; i < info.length; ++i) {
            let one = info[i];
            let atype = one.config_info.atype;
            if (atype == 0) {
                //
            } else if (atype == 1) {
                OnOffManager.isPhoneBillOn = true;
            } else if (atype == 2) {
                OnOffManager.isGongZhongHaoOn = true;
            } else if (atype == 3) {
                OnOffManager.isVipConfirmOn = true;
            } else if (atype == 4) {
                OnOffManager.isAddGroupOn = true;
            }
        }
        HallData.Instance.initActivityRedInfo();
    }
    reqServerPay(decodeMsg) {
        this.reqPcOrder(decodeMsg);
    }
    resGameExit() {
        this.serverExit = true;
        // let str = GlobalFunc.getColorText("因服务器停机维护，暂无法继续游戏。给您造成的不便，我们深表歉意。关于开服时间，可以关注官方QQ群第一时间了解。", 24, "#ffffff");
        // let commonDialog = new CommonDialog(1, [ str ], undefined, "确定", "温馨提示", false);
        // SceneManager.Instance.addToMiddLayer(commonDialog, GlobalConst.dialogLayer);
    }
}
