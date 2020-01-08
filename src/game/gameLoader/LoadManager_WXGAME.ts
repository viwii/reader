import OnOffManager from "../../const/OnOffManager";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import GlobalVar from "../../const/GlobalVar";

import {BattleData} from "../../datas/BattleData"
import {GameData} from "../../datas/GameData"
import {EventDis} from "../../Helpers/EventDis"
import {MainFunc} from "../../GlobalFuncs/MainFunc";
import { PlayerData } from "../../datas/PlayerData";
import { WaitManager } from "../../common/WaitManager";
import { ConfigData } from "../../const/ConfigData";
import { NetManager } from "../../netWork/NetManager";
import { TimeLineManager } from "../../const/TimeLineManager";
import { FishData } from "../../datas/FishData";
import { HallData } from "../../datas/HallData";
import { SoundManager } from "../../common/SoundManager";
import { MarqueeManager } from "../../const/MarqueeManager";
import { SoundNode } from "../../nodes/SoundNode";
import { LoginManager } from "../LoginManager";
import { GameModel } from "../GameModel";
import { SceneManager } from "../../common/SceneManager";

export default class LoadManager_WXGAME{
    static bg: Laya.Sprite;
    static updateManager: any;
    static init() {
        // 方法1：使用loadImage
        // var bg: Laya.Sprite = new Laya.Sprite();
        // // ape.pos(100,50);
        // Laya.stage.addChild(bg);
        // bg.loadImage("img_load_bg_landscape.png");
        LoadManager_WXGAME.bg = new Laya.Sprite();
        Laya.stage.addChild(LoadManager_WXGAME.bg);
        LoadManager_WXGAME.bg.loadImage("res/img_load_bg_landscape.jpg", new Laya.Handler(this, () => {
        // bg.pivot(bg.width * 0.5, bg.height * 0.5);
        // bg.pos(0, 0);
            LoadManager_WXGAME.bg.x = Laya.stage.width - LoadManager_WXGAME.bg.width >> 1;
            LoadManager_WXGAME.bg.y = Laya.stage.height - LoadManager_WXGAME.bg.height >> 1;
        }));
        //var sysInfo = wx.getSystemInfoSync();
        //var system = sysInfo.system;
        GlobalVar.phoneBrand = "1234567"//sysInfo.brand;
        GlobalVar.phoneSystem = "142324454354"//system.split(" ")[0];
        OnOffManager.isChargeOn = !GlobalFunc.isIos();
        //wx.onShow(function(res) {
            // if (BattleData.isInRoom) {
            //     console.log("播放房间背景音乐");
            //     GlobalFunc.playRoomMusic();
            // } else {
            //     console.log("播放背景音乐");
            //     if (SManager.Instatnce.curSceneName == "FirstHallScene") SoundM.playMusic(GlobalConst.Sud_bg_hall);
            // }
            // if (res.query && res.query.channel) GlobalVar.channelId = res.query.channel;
            // if (res.extraData && res.extraData.channel) GlobalVar.channelId = res.extraData.channel;
            // if (res.referrerInfo && res.referrerInfo.extraDta && res.referrerInfo.extraData.channel) GlobalVar.channelId = res.referrerInfo.extraData.channel;
            // if (res.query && res.query.channelid) GlobalVar.channelId = res.query.channelid;
            // if (res.extraData && res.extraData.channelid) GlobalVar.channelId = res.extraData.channelid;
            // if (res.referrerInfo && res.referrerInfo.extraDta && res.referrerInfo.extraData.channelid) GlobalVar.channelId = res.referrerInfo.extraData.channelid;
            // if (res.query && res.query.buyu_channel) GlobalVar.channelId = res.query.buyu_channel;
            // if (res.extraData && res.extraData.buyu_channel) GlobalVar.channelId = res.extraData.buyu_channel;
            // if (res.referrerInfo && res.referrerInfo.extraDta && res.referrerInfo.extraData.buyu_channel) GlobalVar.channelId = res.referrerInfo.extraData.buyu_channel;
            
            GameData.Instance.isWxOnshow = true;
            GlobalFunc.log("发送wx.onshow事件");
            Laya.timer.resume();
            //EventDis.Instance.dispatchEvent(GlobalVar.WX_ONSHOW, res);
        //});
        // wx.onHide(function(res) {
        //     Laya.timer.pause();
        //     GlobalFunc.log("发送wx.onhide事件");
        //     GameData.isWxOnshow = false;
        //     EventDis.dispatchEvent(GlobalVar.WX_ONHIDE, res);
        // });
        GlobalFunc.log("startinit");
        GlobalVar.runStage = "load";
        GlobalVar.reUrl = "res/";
        //GlobalVar.fswx = wx.getFileSystemManager();
        let flag = false;
        EventDis.Instance.addEvntListener("START_LOAD_RESOURCE", this, data => {
            EventDis.Instance.delEventName("START_LOAD_RESOURCE", this);
            let resList;
            resList = MainFunc.getOldPlayerResList();
            EventDis.Instance.dispatchEvent("SHOW_LOADINGPROGRESS");
            Laya.loader.load(resList, new Laya.Handler(this, null), new Laya.Handler(this, res => {
                EventDis.Instance.dispatchEvent("wx_loadProgress", res);
                if (!flag && res >= 1) {
                    flag = true;
                    LoginManager.Instance.enterGame();
                }
            }), null, 1, true, null, false, true);
        });
        //GlobalVar.fswx.access({
            // path: wx.env.USER_DATA_PATH + "/wxgame_version.json",
            // success(data) {
            //     GlobalVar.fswx.readFile({
            //         filePath: wx.env.USER_DATA_PATH + "/wxgame_version.json",
            //         encoding: "utf-8",
            //         success(data) {
            //             let versionJson = JSON.parse(data.data);
            //             if (versionJson.versionName != Single.SingleConfig.versionName) {
            //                 console.warn("移除缓存资源！");
            //                 Laya.MiniAdpter.removeAll();
            //                 GlobalVar.fswx.writeFileSync(wx.env.USER_DATA_PATH + "/wxgame_version.json", '{"versionName": "' + Single.SingleConfig.versionName + '"}', "utf-8");
            //             }
            //             LoadManager_WXGAME.unzip();
            //         },
            //         fail(res) {
            //             console.warn("wxgame_version.json读取失败！");
            //             LoadManager_WXGAME.unzip();
            //         }
            //     });
            // },
            // fail(res) {
            //     //GlobalVar.fswx.writeFileSync(wx.env.USER_DATA_PATH + "/wxgame_version.json", '{"versionName": "' + Single.SingleConfig.versionName + '"}', "utf-8");
            //     LoadManager_WXGAME.unzip();
            // }
        //});
        this.createLoadingScene();
    }
    
    /**
    * 解压配置文件
    */            
    static  unzip() {
        GlobalVar.fswx.unzip({
            // zipFilePath: "res/config.zip",
            // targetPath: wx.env.USER_DATA_PATH,
            // success() {
            //     GlobalFunc.log("打开加载界面");
            //     LoadManager_WXGAME.createLoadingScene();
            // },
            // fail(res) {
            //     console.log({
            //         res: res
            //     });
            //     wx.showToast({
            //         title: "config解压失败！",
            //         icon: "none",
            //         duration: 2e3
            //     });
            // }
        });
    }
    
    /**
    * 创建加载界面
    */            
    static createLoadingScene() {
        GlobalFunc.log("获取ui.json");
        GameModel.pareAllConfig(()=>{
            // Laya.loader.load([ Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/basePic.atlas"), 
            // Laya.ResourceVersion.addVersionPrefix("res/bg/img_load_bg.jpg") ], 
            // new Laya.Handler(this, () => {
            //     console.log("打开加载界面...");
            //     SceneManager.Instance.replaceScene("LoadingScene");
            //     Laya.stage.removeChild(LoadManager_WXGAME.bg);
            //     LoadManager_WXGAME.gameInit();
            //     // LoadManager_WXGAME.updateManager = wx.getUpdateManager();
            //     // LoadManager_WXGAME.updateManager.onCheckForUpdate(function(res) {
            //     //     // 请求完新版本信息的回调
            //     //     console.log(res.hasUpdate);
            //     //     if (!res.hasUpdate) {
            //     //         //登录之前初始化
            //     //         LoadManager_WXGAME.gameInit();
            //     //         Wxlogin.getUserInfo();
            //     //     }
            //     // });
            //     // LoadManager_WXGAME.updateManager.onUpdateReady(function() {
            //     //     // wx.showModal({
            //     //     //     title: "更新提示",
            //     //     //     content: "新版本已更新完成，重启应用即可畅玩！",
            //     //     //     showCancel: false,
            //     //     //     success: function(res) {
            //     //     //         if (res.confirm) {
            //     //     //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //     //     //             LoadManager_WXGAME.updateManager.applyUpdate();
            //     //     //         }
            //     //     //     }
            //     //     // });
            //     // });
            //     // LoadManager_WXGAME.updateManager.onUpdateFailed(function() {
            //     //     // 新版本下载失败
            //     //     // new WarningMessage('版本更新失败，请手动重新启动游戏！')
            //     //     // wx.showModal({
            //     //     //     title: "更新提示",
            //     //     //     content: "抱歉版本更新失败，重启应用尝试修复！为保障游戏体验，建议您在网络环境良好的情况下，更新版本。",
            //     //     //     showCancel: false,
            //     //     //     success: function(res) {
            //     //     //         if (res.confirm) {
            //     //     //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //     //     //             LoadManager_WXGAME.updateManager.applyUpdate();
            //     //     //         }
            //     //     //     }
            //     //     // });
            //     // });
            //}), null, null, 1, true, null, false, true);
        })
        //Laya.View.uiMap = GameModel.getJson("ui");
        //加载加载界面资源
        
    }
    
    /**
    * 打开登陆界面&&登录
    */            
    static  openLoadingScenAndLogin() {}
   
    static gameInit() {
        EventDis.Instance.dispatchEvent("switchSteps", [ 2 ]);
        //NoticeDialog.initNotice();
        GlobalFunc.getStageBounds();
        PlayerData.Instance.init();
        WaitManager.Instance.init();
        ConfigData.Instance.init();
        BattleData.Instance.init();
        SoundManager.Instance.init();
        MarqueeManager.Instance.init();
        NetManager.Instance.init();
        GameData.Instance.init();
        TimeLineManager.Instance.init();
        FishData.initFishData();
        //渔场数据初始化
        HallData.Instance.init();
        MainFunc.initGlobalEvents();
        MainFunc.loadText();
        SoundManager.Instance.init();
    }
    
    /**
    * 替换Laya.loader.load
    */            
    static load() {}
}