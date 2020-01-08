import GlobalConst from "../const/GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalVar from "../const/GlobalVar";
import {EventDis} from "../Helpers/EventDis"
import {ConfigerHelper} from "../Helpers/ConfigerHelper"
import OnOffManager from "../const/OnOffManager";
import { GameModel } from "../game/GameModel";

export class GameData{
    effectNumber: number;
    jumpToScene: string;
    serverTimeStamp: number;
    skillChecked: any[];
    musicValue: number;
    soundEffectValue: number;
    bgMusicIsHall: boolean;
    isFirstLogin: boolean;
    musicUrl: string;
    goingUrl: string;
    fireSound: { 0: any; 1: any; 2: any; 3: any; };
    fireSoundUseIndex: number;
    headImg: string;
    musicIsReplay: boolean;
    env: {};
    scene: number;
    userDotType: string;
    resLoadStep: number;
    isRebate: boolean;
    rebateDate: number;
    rebateNum: number;
    isHelping: boolean;
    shopOrder: number;
    isFirstRecharge: boolean;
    isPaing: boolean;
    wx_session_key: string;
    tomrrowState: number;
    shakeTimes: number;
    isShaked: boolean;
    tehuiState1: number;
    tehuiState2: number;
    newTehuiStates: {};
    monthEndTime: number;
    monthEndDay: number;
    isMonthToday: boolean;
    isShopOn: boolean;
    tomrrowGold: number;
    tomrrowFlag: boolean;
    tomrrowData: any;
    shakeNum: number;
    shakeFish: number;
    isWxOnshow: boolean;
    isShowMonth: boolean;
    inviteAwards: any[];
    inviteNum: number;
    inviteData: any;
    queryId: number;
    white_user: boolean;
    isGameStart: boolean;
    activityData: any[];
    roomguide: boolean;
    numberState: boolean;
    changeDate: any[];
    Room2GuideSwitch: boolean;
    isDDOpen: boolean;
    isInRoomOrHall: boolean;
    errors: {};
    isShopNewPlayer: boolean;
    noticeClose: boolean;
    fileLoad: any[];
    wholeData: any[];
    isConnecting: boolean;
    bingPhone: string;
    bindTime: number;
    isSetPhone: boolean;
    descs: {};
    nameChangeNum: number;
    protoSel: boolean;
    isShowTip: boolean;
    isChangeFish: boolean;
    isRealPop: boolean;
    identity: string;
    clientSess: string;
    delayedTimeCmd: Object;
    soundArray: Object;
    otherSound: {}[];
    resourceLoadOK: boolean;
    timeStr: any;
    gateIp: any;
    roomIP: any;
    roomPort: string;
    account: any;
    accountType: any;
    nickName: any;
    token: string;
    uid: any;
    static _Instance:GameData;
    gatePort: any;
    account_type: any;
    static get Instance(){
        if (GameData._Instance == null){
            GameData._Instance = new GameData;
        }

        return GameData._Instance;
    }
    constructor() {
        this.effectNumber = 0;
        //socket断开跳转场景
        this.jumpToScene = "FirstHallScene";
        this.serverTimeStamp = 0;
        //服务器 时间戳毫秒
        /**技能购买标记 */                this.skillChecked = [];
        this.musicValue = 1;
        this.soundEffectValue = 1;
        this.bgMusicIsHall = false;
        this.isFirstLogin = true;
        this.musicUrl = "";
        this.goingUrl = "";
        this.fireSound = {
            0: undefined,
            1: undefined,
            2: undefined,
            3: undefined
        };
        this.fireSoundUseIndex = 0;
        /*用户头像*/                
        this.headImg = "common/img_toux.png";
        /**音乐切出数量 */                
        this.musicIsReplay = true;
        //排行榜开放时间等       
        this.env = {};
        /**进入游戏前场景 */                
        this.scene = 0;
        //打点的唯一用户id 手机型号+开始时间戳+网络类型（固定）  
        this.userDotType = "neiwang";
        this.resLoadStep = 0;
        this.isRebate = true;
        //是否已经领取了反奖券
        this.rebateDate = 0;
        this.rebateNum = 0;
        this.isHelping = false;
        //是否处于渔场内领取救济金状态;       
        this.shopOrder = 0;
        //订单号     
        this.isFirstRecharge = false;
        //是否首充
        this.isPaing = false;
        //是否正在充值
        this.wx_session_key = "";
        this.tomrrowState = 0;
        //明日礼包领取状态0未开启,1开启不可领，2可领取，3已领取
        this.shakeTimes = 0;
        //摇一摇次数
        this.isShaked = false;
        //是否当天购买摇一摇
        this.tehuiState1 = 0;
        //特惠礼包情况
        this.tehuiState2 = 0;
        this.newTehuiStates = {};
        //新特惠礼包状态
        this.monthEndTime = 0;
        this.monthEndDay = 0;
        //月卡剩余天数
        this.isMonthToday = true;
        //月卡奖励是否领取
        this.isShopOn = false;
        //是否商店打开
        this.tomrrowGold = 0;
        //明日礼包激活计数
        this.tomrrowFlag = false;
        //明日礼包激活flag
        this.tomrrowData = null;
        //明日礼包数据
        this.shakeNum = 0;
        //摇一摇获得的金币
        this.shakeFish = 0;
        //摇一摇杀鱼增加次数计数
        this.isWxOnshow = true;
        //微信是否切后台，默认没在后台
        this.isShowMonth = true;
        //是否弹出过月卡
        this.inviteAwards = [];
        //分享领取的奖励
        this.inviteNum = 0;
        //邀请人数
        this.inviteData = null;
        //邀请表格数据
        this.queryId = 0;
        //受邀请的id
        this.white_user = false;
        //是否外公告白名单
        this.isGameStart = false;
        //游戏是否已经开始
        this.activityData = [];
        //活动数据
        //用户信息引导
        this.roomguide = false;
        this.numberState = false;
        this.changeDate = [];
        this.Room2GuideSwitch = true;
        //房间2引导开关
        this.isDDOpen = false;
        //导弹赠送功能开启
        /**是否在房间或者大厅中 */                
        this.isInRoomOrHall = false;
        this.errors = {};
        /**是否为商店展示新玩家 */                
        this.isShopNewPlayer = false;
        this.noticeClose = false;
        this.fileLoad = [];
        this.wholeData = [];
        this.isConnecting = false;
        this.bingPhone = "";
        //绑定手机
                        this.bindTime = 60;
        this.isSetPhone = false;
        //是否设置过手机号
                        this.descs = {};
        this.nameChangeNum = 0;
        this.protoSel = true;
        this.isShowTip = true;
        this.isChangeFish = false;
        //切渔场隐藏按钮
        this.isRealPop = false;
        this.identity = "";
        //实名认证
    }
    initData() {
        this.bindTime != 60 && this.bindTime > 0 && (this.bindTime = 0);
        this.isSetPhone = false;
        this.errors = {};
        this.descs = {};
        this.isFirstLogin = true;
        this.nameChangeNum = 0;
        this.protoSel = true;
        this.isShowTip = true;
        this.isChangeFish = false;
        //切渔场隐藏按钮
        this.isRealPop = false;
        this.bingPhone = "";
        //绑定手机
        this.identity = "";
        //实名认证
        this.isRebate = true;
        //是否已经领取了反奖券
        this.rebateDate = 0;
        this.rebateNum = 0;
        this.isHelping = false;
        //是否处于渔场内领取救济金状态;
        this.shopOrder = 0;
        //订单号
        this.isFirstRecharge = false;
        //是否首充
        this.isPaing = false;
        //是否正在充值
        this.wx_session_key = "";
        this.tomrrowState = 0;
        //明日礼包领取状态0未开启,1开启不可领，2可领取，3已领取
        this.shakeTimes = 0;
        //摇一摇次数
        this.isShaked = false;
        //是否当天购买摇一摇
        this.tehuiState1 = 0;
        //特惠礼包情况
        this.tehuiState2 = 0;
        this.newTehuiStates = {};
        //新特惠礼包状态
        this.monthEndTime = 0;
        this.monthEndDay = 0;
        //月卡剩余天数
        this.isMonthToday = true;
        //月卡奖励是否领取
        this.isShopOn = false;
        //是否商店打开
        this.tomrrowGold = 0;
        //明日礼包激活计数
        this.tomrrowFlag = false;
        //明日礼包激活flag
        this.tomrrowData = null;
        //明日礼包数据
        this.shakeNum = 0;
        //摇一摇获得的金币
        this.shakeFish = 0;
        //摇一摇杀鱼增加次数计数
        this.isShowMonth = true;
        //是否弹出过月卡
        this.inviteAwards = [];
        //分享领取的奖励
        this.inviteNum = 0;
        //邀请人数
        this.inviteData = null;
        //邀请表格数据
        this.queryId = 0;
        //受邀请的id
        this.white_user = false;
        //是否外公告白名单
        this.isGameStart = false;
        //游戏是否已经开始
        this.activityData = [];
        //活动数据
    }
    initGameData() {
        this.clientSess = "111111";
        this.delayedTimeCmd = new Object();
        this.soundArray = new Object();
        this.otherSound = [ {}, {}, {}, {}, {} ];
        //游戏登录参数记录
        this.resourceLoadOK = false;
    }
    //连接成功后需要更新一些后端数据
    //todo:数据更新都应该放到data里
    setChangeDate() {
        Laya.timer.loop(1e3, this, () => {
            let ser = GameData.Instance.serverTimeStamp;
            let day = new Date(ser).getDay();
            if (this.changeDate.length < 2) {
                this.changeDate.push(day);
            } else {
                this.changeDate.shift();
                this.changeDate.push(day);
                if (this.changeDate[0] != this.changeDate[1]) {
                    if (GameData.Instance.tomrrowState == 1) {
                        GameData.Instance.tomrrowState = 2;
                    }
                    for (let i in GameData.Instance.newTehuiStates) {
                        GameData.Instance.newTehuiStates[i] = true;
                    }
                    GameData.Instance.shakeTimes = 5;
                    GameData.Instance.isShaked = false;
                    EventDis.Instance.default.dispatchEvent(GlobalVar.CHANGEDAY);
                }
            }
        });
    }
    init() {
        this.initGameData();
        let data;
        data = GameModel.getJson("global_define");
        this.tomrrowGold = +data["tomorrow_gift_gold"];
        this.timeStr = GlobalFunc.getClientTime();
        GlobalConst.bitFlyTime1 = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_fly_sec" ])) * 1e3;
        GlobalConst.bitFlyTime2 = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_bomb_sec" ])) * 1e3;
        GlobalConst.bitFlySpeed1 = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_fly1_speed" ]));
        GlobalConst.bitFlySpeed2 = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_fly2_speed" ]));
        GlobalConst.bitCountDownSec = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_countdown_sec" ]));
        GlobalConst.bitBoomRadius = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "zuantou_bomb_radius" ]));
        GlobalConst.haiWangJiange = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "haiwangbaozangjiange" ]));
        GlobalConst.haiWangTime = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "haiwangbaozangtime" ])) * 1e3;
        GlobalConst.specialFishStartTime = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "common_teseyu_start" ]));
        GlobalConst.specialFishEndTime = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "common_teseyu_end" ]));
        GlobalConst.dlgPopMax = Number(ConfigerHelper.Instance.getCachedValueByKey("global_define", [ "gift_loop_count" ]));
        EventDis.Instance.addEvntListener(GlobalVar.HEART_BEAT, this, this.updateServerTimeStampByServer);
    }
    DotOutGame() {
        // globalFun.buttonDot(444444);
    }
    updateServerTimeStampByClient() {
        this.serverTimeStamp += 1e3;
    }
    updateServerTimeStampByServer(timeStamp) {
        this.serverTimeStamp = timeStamp;
        Laya.timer.loop(1e3, this, this.updateServerTimeStampByClient);
    }
    SetAddressAndPort(_address) {
        this.gateIp = _address;
        // //公网地址包含wss
        // if (_address.indexOf("wss") != -1) {
        //     this.gateIp = _address;
        //     this.gatePort = "";
        // } else {
        //     var str = _address.split(':');
        //     var address = str[0]
        //     var port = str[1]
        //     this.gateIp = address;
        //     this.gatePort = port;
        // }
                }
    SetRoomAddressAndPort(_address) {
        //公网地址包含wss
        if (_address.indexOf("wss") != -1) {
            this.roomIP = _address;
            this.roomPort = "";
        } else {
            var str = _address.split(":");
            var address = str[0];
            var port = str[1];
            this.roomIP = address;
            this.roomPort = port;
        }
    }
    SetSoundEffectValue(value) {
        this.soundEffectValue = value;
        if (this.soundEffectValue == 1) {
            laya.media.SoundManager.soundMuted = false;
        } else {
            laya.media.SoundManager.soundMuted = true;
        }
        GlobalFunc.setStorage("GameSoundVolume", value.toString());
        laya.media.SoundManager.setSoundVolume(this.soundEffectValue);
    }
    setLoginInfo(data) {
        if (!data) {
            GlobalFunc.log("登陆信息获取失败");
            return;
        }
        this.account = data.account;
        this.accountType = data.accountType;
        this.nickName = data.nick;
        this.SetAddressAndPort(data.gateAddr);
        console.log("重置之前，token:" + this.token);
        this.token = data.token;
        this.headImg = data.headurl;
        console.log("重置之后，token:" + this.token);
        EventDis.Instance.dispatchEvent("update_login_data");
        this.uid = data.uid;
        this.serverTimeStamp = data.server_time * 1e3;
        GameData.Instance.wx_session_key = data.wx_sessionkey;
        this.updateServerTimeStampByServer(this.serverTimeStamp);
        this.setChangeDate();
    }
    closeActivity(activity_id) {
        let activity;
        for (let index = 0; index < this.activityData.length; index++) {
            if (activity_id == this.activityData[index].config_info.id) {
                activity = this.activityData[index];
                break;
            }
        }
        if (!activity) return;
        switch (activity.config_info.atype) {
          case 0:
            break;

          case 1:
            OnOffManager.isPhoneBillOn = false;
            break;

          case 2:
            OnOffManager.isGongZhongHaoOn = false;
            break;

          case 3:
            OnOffManager.isVipConfirmOn = false;
            break;

          case 4:
            OnOffManager.isAddGroupOn = false;
            break;

          default:
            break;
        }
    }
}