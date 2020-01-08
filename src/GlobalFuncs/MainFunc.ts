import GlobalConst from "../const/GlobalConst";
import GlobalVar from "../const/GlobalVar";
import GlobalFunc from "./GlobalFunc";
import {EventDis} from "../Helpers/EventDis"
import {NetManager} from "../netWork/NetManager"
import { WxFuncs } from "./WxFuncs";
import { SceneManager } from "../common/SceneManager";
import { ConfigerHelper } from "../Helpers/ConfigerHelper";
import { TimeLineManager } from "../const/TimeLineManager";
import {FishData} from "../datas/FishData";
import { HallData } from "../datas/HallData";
import { SoundManager } from "../common/SoundManager";
import Single, { SingleConfig } from "../const/SingleSDK";
import { GameData } from "../datas/GameData";
import { MarqueeManager } from "../const/MarqueeManager";

export class MainFunc{
    static loadText() {
        var fontName1 = GlobalConst.fontNum1;
        var fontName2 = GlobalConst.fontNum2;
        var fontName3 = GlobalConst.fontNum3;
        var fontName4 = GlobalConst.fontNum4;
        var fontName5 = GlobalConst.fontNum5;
        var fontName6 = GlobalConst.fontNum6;
        var bitmapFont = new Laya.BitmapFont();
        bitmapFont.loadFont(GlobalVar.reUrl + "bitmapFont/win.fnt", new Laya.Handler(this, () => {
            bitmapFont.setSpaceWidth(10);
            Laya.Text.registerBitmapFont(fontName1, bitmapFont);
            var bitmapFont1 = new Laya.BitmapFont();
            bitmapFont1.loadFont(GlobalVar.reUrl + "bitmapFont/lose.fnt", new Laya.Handler(this, () => {
                bitmapFont1.setSpaceWidth(10);
                Laya.Text.registerBitmapFont(fontName2, bitmapFont1);
                var bitmapFont2 = new Laya.BitmapFont();
                bitmapFont2.loadFont(GlobalVar.reUrl + "bitmapFont/paoBei.fnt", new Laya.Handler(this, () => {
                    bitmapFont2.setSpaceWidth(10);
                    Laya.Text.registerBitmapFont(fontName3, bitmapFont2);
                    var bitmapFont3 = new Laya.BitmapFont();
                    bitmapFont3.loadFont(GlobalVar.reUrl + "bitmapFont/goldNum.fnt", new Laya.Handler(this, () => {
                        bitmapFont3.setSpaceWidth(10);
                        Laya.Text.registerBitmapFont(fontName4, bitmapFont3);
                        var bitmapFont4 = new Laya.BitmapFont();
                        bitmapFont4.loadFont(GlobalVar.reUrl + "bitmapFont/dragonScore.fnt", new Laya.Handler(this, () => {
                            bitmapFont4.letterSpacing = -5;
                            Laya.Text.registerBitmapFont(fontName5, bitmapFont4);
                            var bitmapFont5 = new Laya.BitmapFont();
                            bitmapFont5.loadFont(GlobalVar.reUrl + "bitmapFont/blueNum.fnt", new Laya.Handler(this, () => {
                                bitmapFont5.letterSpacing = -5;
                                Laya.Text.registerBitmapFont(fontName6, bitmapFont5);
                            }, [ bitmapFont5 ]));
                        }, [ bitmapFont4 ]));
                    }, [ bitmapFont3 ]));
                }, [ bitmapFont2 ]));
            }, [ bitmapFont1 ]));
        }, [ bitmapFont ]));
        // g_EventDis.dispatchEvent(globalVar.ITEM_DATA_LOAD);
    }
    static isNameValid(name) {
        return name.indexOf(".png") != -1 || name.indexOf(GlobalVar.soundType) != -1 || name.indexOf(".atlas") != -1 || name.indexOf(".sk") != -1 || name.indexOf(".json") != -1;
    }
    
    //检查两个version之间的差异,找出修改过的文件名
    //获得下载url列表
    static getDownUrlArray(jsonNow, jsonDown) {
        var downArr = new Array();
        //找出jsonNow多出来的资源，和修改过的资源
                        var preKV = {};
        for (var keyPre in jsonNow) {
            //可管理配置、声音、图片、图集
            if (this.isNameValid(keyPre)) preKV[keyPre] = jsonNow[keyPre];
        }
        for (var keyNow in jsonDown) {
            //可管理配置、声音、图片、图集
            if (this.isNameValid(keyNow)) {
                //只增加和修改，暂时不删除废弃的。
                if (jsonDown[keyNow] != preKV[keyNow]) 
                // globalFun.log(keyNow);
                downArr.push(keyNow);
            }
        }
        return downArr;
    }
    
    //清理下载文件夹
    static  clearDownloads() {
        GlobalFunc.log("大更新，删除文件夹内容");
        var deletePath = GlobalVar.unZipPath;
        var fileList = WxFuncs.getFileList(deletePath);
        GlobalFunc.log(fileList);
        if (fileList && fileList.length > 0) {
            GlobalFunc.log("递归删除所有文件");
            WxFuncs.removefiles(deletePath, false);
        }
    }
    
    //显示文件夹结构
    static showAllfiles(filePath) {
        var fileList = GlobalVar.fswx.readdirSync(filePath);
        for (var index = 0; index < fileList.length; index++) {
            var element = fileList[index];
            if (!element) return;
            if (element.indexOf(".") > -1) {
                GlobalFunc.log(filePath + "/" + element);
            } else {
                GlobalFunc.log(filePath + "/" + element);
                this.showAllfiles(filePath + "/" + element);
            }
        }
    }
    
    /**热更配置 */            
    static getUpdateConfigReq() {
        GlobalVar.updateOver = false;
        var desPath = GlobalVar.reUrl + "resconfigRemote.json";
        var sourcePath = GlobalVar.remotePre + "resconfig.json?v=" + GlobalFunc.getRandom(0, 1e3);
        GlobalFunc.log("收到后端热更请求，下载最新resConfig", sourcePath);
        //5秒热更超时
        Laya.timer.once(2e4, this, () => {
            EventDis.Instance.dispatchEvent("downJsonFileOver");
        });
    }
    
    static  downResConfigOver(param) {
        var sourcePath = param.sourcePath;
        var desPath = param.desPath;
        var localPath = GlobalVar.reUrl + "resconfig.json";
        if (!sourcePath || !desPath) return;
        if (desPath.indexOf("resconfig") > -1) {
            GlobalFunc.log("下载新的resconfig表成功");
            Laya.Loader.clearRes(desPath);
            Laya.loader.load([ Laya.ResourceVersion.addVersionPrefix(desPath), Laya.ResourceVersion.addVersionPrefix(localPath) ], new Laya.Handler(this, () => {
                var remoteJson = Laya.Loader.getRes(desPath);
                GlobalFunc.log("remote:", desPath);
                var jsonLocal = Laya.Loader.getRes(localPath);
                GlobalFunc.log("local:", localPath);
                var diffArr = GlobalFunc.getDiffJson(jsonLocal, remoteJson);
                if (!diffArr || !diffArr.length || diffArr.length < 0) {
                    GlobalFunc.log("更新配置数组非法或者为空");
                    return;
                }
            }));
        }
    }
    
    static  getLoadingResList() {
        return [ {
            url: GlobalVar.reUrl + "atlas2/basePic.atlas",
            type: Laya.Loader.ATLAS
        } ];
    }
    
    static  getResList() {
        return [ {
            url: GlobalVar.reUrl + "atlas2/novice.atlas",
            type: Laya.Loader.ATLAS
        }, {
            url: GlobalVar.reUrl + "atlas2/bullets.atlas",
            type: Laya.Loader.ATLAS
        }, {
            url: GlobalVar.reUrl + "atlas2/noZip.atlas",
            type: Laya.Loader.ATLAS
        }, {
            url: GlobalVar.reUrl + "atlas2/common.atlas",
            type: Laya.Loader.ATLAS
        } ];
    }
    
    /**
* 老玩家资源列表
*/            
static getOldPlayerResList() {
        return [ {
            url: Laya.ResourceVersion.addVersionPrefix("bg/img_bg2.jpg"),
            type: Laya.Loader.IMAGE
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/novice.atlas"),
            type: Laya.Loader.ATLAS
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/bullets.atlas"),
            type: Laya.Loader.ATLAS
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/noZip.atlas"),
            type: Laya.Loader.ATLAS
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/common.atlas"),
            type: Laya.Loader.ATLAS
        }, 
        //大厅所需特效资源
        {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface1/skeleton.png"),
            type: Laya.Loader.IMAGE
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface2/skeleton.png"),
            type: Laya.Loader.IMAGE
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface3/skeleton.png"),
            type: Laya.Loader.IMAGE
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface1/skeleton.sk"),
            type: Laya.Loader.BUFFER
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface2/skeleton.sk"),
            type: Laya.Loader.BUFFER
        }, {
            url: Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "spine/interface3/skeleton.sk"),
            type: Laya.Loader.BUFFER
        }, {
            url: Laya.ResourceVersion.addVersionPrefix("animation/goldCoinAni.ani"),
            type: Laya.Loader.JSON
        }, {
            url: Laya.ResourceVersion.addVersionPrefix("animation/rouletteAni.ani"),
            type: Laya.Loader.JSON
        } ];
    }
    
    static getNextResList() {
        return [ Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/GuideFingerView.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/GiftNewThDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/MonthCardDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/GiftScDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/GiftKyDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/DragonDiamondNode.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/DragonHelpDialog.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/DragonInterface.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/DragonSeatNode.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/PearlDialog.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/ShellNode.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/SpecialView.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/hongYunRotation.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/FishTray.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/FishTeamComingDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/FishScene.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/DialView.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/BossComingDlg.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/scene/BombView.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/animation/bitWait.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/animation/HongYunCannon.atlas"),
            Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/bullets.atlas"),
            ];
    }
    
    static getResList2() {
        return [];
    }
    
    /**
    * 大厅界面动画资源
    */            
    static getFirstHallResList() {
        return [ {
            url: GlobalVar.reUrl + "spine/interface1/skeleton.sk",
            type: Laya.Loader.BUFFER
        }, {
            url: GlobalVar.reUrl + "spine/interface2/skeleton.sk",
            type: Laya.Loader.BUFFER
        }, {
            url: GlobalVar.reUrl + "spine/interface3/skeleton.sk",
            type: Laya.Loader.BUFFER
        } ];
    }
    
    //微信初始包配置
    static getLoadPath0() {
        return [ {
            url: "configFirst/constAnnouncement.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/guide.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/invitationAward.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/Item.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/shop.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/Vip.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/fish.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/room.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/longpao.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/allfishScript.json",
            type: Laya.Loader.JSON
        }, {
            url: "configFirst/global_define.json",
            type: Laya.Loader.JSON
        } ];
    }
    
    /**加载初始包 */            
    static getLoadPath1() {
        return [ {
            url: GlobalVar.reUrl + "config/global_define.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/constAnnouncement.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/paomadeng.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/fish.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/allfishScript.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/fishPathList.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/Formations.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/FishTeam.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/Item.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/Vip.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/shop.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/exchange.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/room.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/fishlocker.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/timeLimitPacks.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/luckyRoulette.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/invitationAward.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/luckyDraw.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/wholepoint.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/collection.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/guide.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/activity.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/Roulette.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/player_init.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/longpao.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "atlas1/noZip.atlas",
            type: Laya.Loader.ATLAS
        }, {
            url: GlobalVar.reUrl + "config/sharecard.json",
            type: Laya.Loader.JSON
        }, {
            url: GlobalVar.reUrl + "config/freeTicket.json",
            type: Laya.Loader.JSON
        }, 
        //部分动画提前加载
        {
            url: GlobalVar.reUrl + "animation/goldCoinAni.ani",
            type: Laya.Loader.JSON
        } ];
    }
    
    /**加载包2 */            
    static getLoadPath2() {
        return [];
    }
    
    /**不需要网络的全局初始化*/            
    static initGlobalWithoutNet() {
        SceneManager.Instance.init();
        ConfigerHelper.Instance.init();
    }
    
    /**全局单例初始化,所有的初始化和顺序相关，基础的写到前面，需要网络的全局初始化*/            
    static initGlobalStaticInstance() {
        GlobalFunc.log("开始初始化游戏变量");
        GameData.Instance.init();
        SoundManager.Instance.init();
        HallData.Instance.init();
        // g_noticeData.initNotice();
                        
        TimeLineManager.Instance.init();
        FishData.initFishData();
        //渔场数据初始化
        MarqueeManager.Instance.init();
    }
    
    /**全局监听 */            
    static initGlobalEvents() {
        // 网络连接超时
        EventDis.Instance.addEvntListener("sc_player_kick_1", this, () => {
            let str = GlobalFunc.getColorText("网络连接中断，请重新进入游戏");
            let callBack = new Laya.Handler(this, function() {
                SceneManager.Instance.replaceScene("PcLoadingScene", null);
            });
            //let kickDialog = new CommonDialog(1, [ str ], null, "确定", "提示", true, callBack);
            //SceneManager.Instance.addToMiddLayer(kickDialog, GlobalConst.dialogLayer);
        });
        // 监听踢人
            EventDis.Instance.addEvntListener("sc_player_kick_2", this, () => {
            let str = GlobalFunc.getColorText("账号重复登录");
            console.log("账号重复登录");
            let callBack = new Laya.Handler(this, function() {
                NetManager.Instance.socket.close();
                //if (SingleConfig.platform == Single.Platform.H5Bianf) 
                //buyu.closeGame();
            });
            //let kickDialog = new CommonDialog(1, [ str ], null, "确定", "提示", true, callBack);
            //SceneManager.Instance.addToMiddLayer(kickDialog, GlobalConst.dialogLayer);
        });
    }
}