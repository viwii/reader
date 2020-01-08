import { GameData } from "../../datas/GameData";
import { FishData } from "../../datas/FishData";
import { DialogManager } from "../../common/DialogManager";
import { BattleData } from "../../datas/BattleData";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import OnOffManager from "../../const/OnOffManager";
import { UIUtils } from "../../game/utils/UIUtils";
import { EventDis } from "../../Helpers/EventDis";
import { TimeLineManager } from "../../const/TimeLineManager";
import { NetManager } from "../../netWork/NetManager";
import { SceneManager } from "../../common/SceneManager";
import { BulletFactory } from "../../fishNodes/BulletFactory";
import { FishFactory } from "./FishFactory";
import GlobalConst from "../../const/GlobalConst";
import GlobalVar from "../../const/GlobalVar";
import { ConfigerHelper } from "../../Helpers/ConfigerHelper";
import { BitPlayNode } from "../../fishNodes/BitPlayNode";
import { BubbleEff } from "../../dialog/roomDialog/BubbleEff";
import { FishTeamComingDlg } from "../../dialog/roomDialog/FishTeamComingDlg";
import { GlobalUI } from "../../const/GlobalUI";
import { DaoDanNode } from "../../fishNodes/DaoDanNode";
import { SeatFactory } from "./SeatFactory";
import { FishBtnLayer } from "./FishBtnLayer";

export class FishScene{
    isFirstClick: boolean;
    bombs: any[];
    ticketTipsView: any;
    fishFct: any;
    btnLayer: any;
    bulletFct: any;
    seatFactory: any;
    img_bg: any;
    pangxieImg: any;
    pxTimeLine: any;
    constructor() {
        //super();
        this.isFirstClick = true;
        //是否是第一次点击
        this.bombs = [];
        GameData.Instance.isFirstLogin = false;
        GameData.Instance.isInRoomOrHall = true;
        FishData.isshowSc = true;
        FishData.popCount = 0;
        // !!window["Laya3D"] && this.initScene3D();
        this.initScene();
        //初始化ui等放这里
        this.initEvent();
        //初始化事件放这里
        DialogManager.Instance.dlgQueue = [];
        BattleData.Instance.isInRoom = true;
        GlobalFunc.playRoomMusic();
        if (OnOffManager.isTicketTipsOn) {
            // UIUtils.showDisplay("TicketTipsView", this, () => {
            //     this.ticketTipsView = new TicketTipsView();
            //     EventDis.Instance.addEvntListener(GlobalVar.SHOW_TICKET_TIPS, this, count => {
            //         this.ticketTipsView.showTips(count);
            //     });
            // });
        }
    }
    destroy() {
        FishData.vipFishIndex = 0;
        BattleData.Instance.scene_type = null;
        DialogManager.Instance.dlgQueue = [];
        FishData.popCount = 0;
        FishData.stopPop = false;
        FishData.isTouching = false;
        GameData.Instance.isHelping = false;
        TimeLineManager.Instance.clearTimeLines();
        BattleData.Instance.updateSelfInfoByLeave();
        EventDis.Instance.dispatchEvent("leave_room", BattleData.Instance.room_type);
        BattleData.Instance.isInRoom = false;
        EventDis.Instance.delAllEvnt(this);
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
        if (this.ticketTipsView && !this.ticketTipsView.destroyed) {
            this.ticketTipsView.destroy();
            this.ticketTipsView = undefined;
        }
        this.fishFct.destroy();
        this.btnLayer.destroy();
        this.bulletFct.destroy();
        this.seatFactory.destroy();
        this.bombs.forEach(bomb => {
            Laya.Tween.clearAll(bomb.bomb);
            Laya.timer.clearAll(bomb.bomb);
            EventDis.Instance.delAllEvnt(bomb.bomb);
            bomb.bomb.body = null;
            bomb.bomb.destroyChildren();
            bomb.bomb.removeSelf();
        });
        NetManager.Instance.reqEnterRoom({
            room_type: BattleData.Instance.room_type,
            enter: false
        });
        SceneManager.Instance.stopAllSound(true);
        GameData.Instance.isInRoomOrHall = false;
    }
    doExit() {
        if (FishData.isInDaoDan) return;
        let scene = SceneManager.Instance.replaceScene("FirstHallScene");
        // UIUtils.show(SelectRoomScene,UIType.BASE);
                }
    // initScene3D() {
    //     this.scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
    //     FishData.scene3D = this.scene3D;
    //     this.camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
    //     this.camera.transform.position = new Laya.Vector3(0, 0, 1);
    //     this.camera.orthographic = true;
    //     this.camera.orthographicVerticalSize = 10;
    //     FishData.camera = this.camera;
    // }
    initScene() {
        //创建座位,开炮
        this.bulletFct = new BulletFactory();
        this.fishFct = new FishFactory();
        this.seatFactory = new SeatFactory();
        UIUtils.showDisplay("FishBtnLayer", this, () => {
            // 各种按钮
            this.btnLayer = new FishBtnLayer(this);
            SceneManager.Instance.addToMiddLayer(this.btnLayer, GlobalConst.effectTopLayer);
            //加载剧本
                                this.initPangxieBg();
            this.setSceneBg();
            this.fishFct.firstLoad();
            Laya.timer.frameLoop(1, this, this.updateGame);
            BattleData.Instance.room_type = BattleData.Instance.room_type;
            //直接需要现场恢复的
            this.resumeScene();
            //需要等鱼刷完再恢复的, 100毫秒的是冰冻恢复，1秒的移除loading等
            //todo: 用所有鱼刷完后的回调来代替计时器
            Laya.timer.once(100, this, this.delayResumeScene1);
            Laya.timer.once(1e3, this, this.delayResumeScene2);
        });
    }
    initMouseEvent() {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_OVER, this, this.onMouseOver);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
    }
    on(MOUSE_DOWN: string, arg1: this, onMouseDown: () => void) {
        throw new Error("Method not implemented.");
    }
    initEvent() {
        EventDis.Instance.addEvntListener(GlobalVar.DAO_DAN_BOMB, this, this.s2cBomb);
        EventDis.Instance.addEvntListener("switchSceneId", this, this.switchTeam);
        EventDis.Instance.addEvntListener("killFish_broad", this, this.onServerKillFish);
        EventDis.Instance.addEvntListener("roomOverTime", this, this.serverOverTime);
        EventDis.Instance.addEvntListener(GlobalVar.NET_OVER, this, this.kickOutRoom);
        EventDis.Instance.addEvntListener("bit_play_begin", this, this.bitPlayBegin);
        EventDis.Instance.addEvntListener("sure_leave_room", this, this.doExit);
    }
    resumeScene() {
        //boss恢复
        if (!!BattleData.Instance.reborn_fishs && BattleData.Instance.reborn_fishs.length) {
            var data = {fishs:[]};
            data.fishs = BattleData.Instance.reborn_fishs;
            GlobalFunc.log("boss恢复");
            EventDis.Instance.dispatchEvent("rebornFish", data);
        }
        BattleData.Instance.reborn_fishs = [];
    }
    delayResumeScene1() {
        this.btnLayer.resumeFreeze();
    }
    delayResumeScene2() {
        //todo: play sound
        this.initMouseEvent();
        //移除loading遮罩
        EventDis.Instance.dispatchEvent("remove_fishLoaidng_scene");
    }
    s2cBomb(data) {
        let bomb = new DaoDanNode(data);
        this.bombs.push(bomb);
    }
    /**超时未操作踢出房间 */            serverOverTime() {
        // let str = GlobalFunc.getColorText("由于您长时间没有开炮，自动离开房间！");
        // let kickDialog = new CommonDialog(1, [ str ], null, "确定", "提示", true, Laya.Handler.create(this, () => {
        //     SceneManager.Instance.replaceScene("FirstHallScene");
        // }));
        // SceneManager.Instance.addToMiddLayer(kickDialog, GlobalConst.dialogLayer);
    }
    /**掉线踢出房间并重连 */            
    kickOutRoom() {
        if (GlobalUI.isCommonDialogShow) return;
        let str = GlobalFunc.getColorText("网络连接失败，请重新连接！");
        let callBack = new Laya.Handler(this, function() {
            SceneManager.Instance.replaceScene("FirstHallScene");
            // g_NetManager.reconnect()
            //todo:new一个waitingdialog并重连
                        });
        // let kickDialog = new CommonDialog(1, [ str ], null, "确定", "提示", true, callBack);
        // SceneManager.Instance.addToMiddLayer(kickDialog, GlobalConst.dialogLayer);
    }
    /**剧本背景*/            setSceneBg() {
        this.pausePangxieAni();
        Laya.timer.clear(this, this.checkFishTeamComing);
        var type = BattleData.Instance.scene_type;
        GlobalFunc.playRoomMusic();
        console.log("**********************************************************************        " + BattleData.Instance.room_type);
        switch (BattleData.Instance.room_type) {
          case 0:
            this.img_bg.skin = "bg/rongyanBigBoss1.jpg";
            break;

          case 1:
            if (type != 1) {
                this.img_bg.skin = "bg/pangxieBoss0.jpg";
            } else {
                this.img_bg.skin = "bg/pangxieBoss1.jpg";
                this.playPangxieAni();
            }
            break;

          case 2:
            if (type != 1) {
                this.img_bg.skin = "bg/rongyanBigBoss0.jpg";
            } else {
                this.img_bg.skin = "bg/rongyanBigBoss1.jpg";
            }
            break;

          case 3:
            if (type != 1) {
                this.img_bg.skin = "bg/shayuBoss0.jpg";
            } else {
                this.img_bg.skin = "bg/shayuBoss1.jpg";
            }
            break;

          case 20:
            this.img_bg.skin = "bg/img_boss.jpg";
            break;
        }
        //播放海王来袭
                        let sceneTime = BattleData.Instance.FishSceneTime;
        let playTime = 3e3;
        if (type == 1) {
            if (sceneTime < playTime) {
                Laya.timer.once(playTime - sceneTime, this, function() {
                    UIUtils.showDisplay("BossComingDlg", this, () => {
                        // let bossComing = new BossComingDlg(BattleData.room_type);
                        // SceneManager.Instance.addToMiddLayer(bossComing, GlobalConst.maskLayer);
                    });
                });
            }
            Laya.timer.loop(1e3, this, this.checkFishTeamComing);
        }
    }
    checkFishTeamComing() {
        let nowTime = BattleData.Instance.FishSceneTime;
        let endTime = BattleData.Instance.scene_end_time;
        // globalFun.log("rrrrrrrrrrrr", endTime, nowTime);
                        if (endTime - nowTime <= 5 * 1e3) {
            Laya.timer.clear(this, this.checkFishTeamComing);
            UIUtils.showDisplay("FishTeamComingDlg", this, () => {
                let fishTeamComing = new FishTeamComingDlg();
                SceneManager.Instance.addToMiddLayer(fishTeamComing, GlobalConst.maskLayer);
            });
        }
    }
    //添加螃蟹浮动背景
    initPangxieBg() {
        this.pangxieImg = this.addChild(new Laya.Image(Laya.ResourceVersion.addVersionPrefix("scene/FishScene/pangxieBoss2.png")));
        this.pangxieImg.scale(1.36, 1.36);
        this.pangxieImg.anchorX = this.pangxieImg.anchorY = .5;
        this.pangxieImg.pos(this.img_bg.width / 2, this.img_bg.height / 2);
        this.pxTimeLine = TimeLineManager.Instance.creatTimeLine(true);
        this.pxTimeLine.addLabel("px_bg_1", 0).to(this.pangxieImg, {
            scaleX: 1.5,
            scaleY: 1.5
        }, 1700).addLabel("px_bg_2", 0).to(this.pangxieImg, {
            scaleX: 1.36,
            scaleY: 1.36
        }, 1700);
        this.pxTimeLine.play(0, true);
    }
    addChild(arg0: Laya.Image): any {
        throw new Error("Method not implemented.");
    }
    playPangxieAni() {
        this.pangxieImg.visible = true;
        this.pxTimeLine.resume();
    }
    pausePangxieAni() {
        console.log("");
        this.pangxieImg.visible = false;
        this.pxTimeLine.pause();
    }
    switchTeam(data) {
        BattleData.Instance.cur_scene_id = data.scene_id;
        let sceneInfo = ConfigerHelper.Instance.getCachedValue("allfishScript", "SceneID", BattleData.Instance.cur_scene_id, BattleData.Instance.room_type);
        BattleData.Instance.scene_type = Number(sceneInfo.type);
        BattleData.Instance.scene_end_time = sceneInfo.endtime * 1e3;
        this.fishFct.switchFishTeam(BattleData.Instance.cur_scene_id);
        if (BattleData.Instance.scene_type == 1 || BattleData.Instance.scene_type == 2) {
            this.clearGround();
        }
    }
    //切换场景需要清场的
    clearGround() {
        new BubbleEff();
        var oldFishNodes = FishData.fishNodesObj;
        FishData.fishNodesObj = {};
        Laya.timer.once(1200, this, function() {
            this.setSceneBg();
            for (let i in oldFishNodes) {
                let fish = oldFishNodes[i];
                fish.destroy();
            }
            oldFishNodes = {};
        });
    }
    onMouseDown() {
        //关闭开启中的按钮面板
        this.btnLayer.closeFishBtn();
        if (!this.canTouchFire()) return;
        //开炮金币是否足够
                        if (!this.bulletFct.enoughtGoldToFire(true)) {
            // todo ...
            return;
        }
        if (!FishData.isDragonCannonOn) {
            let isVip = GlobalFunc.checkVipToFire();
            if (!isVip) return;
        }
        // if (FishData.isLocking) {
        //     this.lockSelectFish();
        //     return;
        // }
        if (this.isFirstClick) {
            EventDis.Instance.dispatchEvent(GlobalVar.CLOSE_MYSEAT_ANI);
            // g_EventDis.dispatchEvent(globalVar.CHANGE_ROOM_HELP_STATE);
            this.isFirstClick = false;
        }
        if (this.btnLayer.isMenuShow) {
            this.btnLayer.showMenu();
        }
        var angle = GlobalFunc.getMyCannonAngle();
        if (!angle) return;
        var myCannon = FishData.mySeatNode.cannonNode;
        myCannon.justRotate(angle);
        FishData.isTouching = true;
        this.bulletFct.mouseFire(angle);
    }
    onMouseUp() {
        FishData.isFiring = false;
        FishData.isTouching = false;
    }
    onMouseMove(e) {
        if (!FishData.isTouching || FishData.isSelfBitTime || FishData.isSelfHyTime && !FishData.hyCanFire) return;
        var angle = GlobalFunc.getMyCannonAngle();
        if (!angle) return;
        var myCannon = FishData.mySeatNode.cannonNode;
        myCannon.justRotate(angle);
    }
    onMouseOver() {
        //暂时over和up相同处理
        this.onMouseUp();
    }
    onMouseOut() {
        //暂时over和up相同处理
        this.onMouseUp();
    }
    //锁定选鱼
    // lockSelectFish(): void {
    //     let lockFish = this.btnLayer.lock.lockedFish;
    //     if (!!lockFish && (!this.lastClickCd || globalFun.getClientTime() - this.lastClickCd > 200)) {
    //         let topFish: FishNode;
    //         let lastDis = 0;
    //         for (let index in FishData.fishNodesObj) {
    //             let fish = FishData.fishNodesObj[index] as FishNode;
    //             let data = fish.isPointInSelf(globalFun.getMousePos());
    //             if (!data[0]) continue;
    //             if (!topFish) {
    //                 topFish = fish;
    //                 lastDis = data[1];
    //                 continue;
    //             }
    //             if (fish.characterType > topFish.characterType) {
    //                 topFish = fish;
    //             } else if (fish.characterType == topFish.characterType && data[1] > lastDis) {
    //                 topFish = fish;
    //                 lastDis = data[1];
    //             }
    //         }
    //         !!topFish && topFish != lockFish && (topFish.onTouchFish());
    //     }
    //     this.lastClickCd = globalFun.getClientTime();
    // }
    updateGame() {
        var bullets = this.bulletFct.bulletNodes;
        for (var bulletIndex in bullets) {
            var bullet = bullets[bulletIndex];
            //锁定弹,不处理碰撞
            if (bullet.lockFishId > 0) continue;
            //子弹已经碰撞，不碰撞
            if (bullet.isCaught) continue;
            var isCaught = false;
            for (var fishIndex in FishData.fishNodesObj) {
                var fish = FishData.fishNodesObj[fishIndex];
                if (!fish.isInScreen) continue;
                if (fish.beginDead) continue;
                if (GlobalFunc.isBulletHitFish(bullet, fish)) {
                    isCaught = true;
                    var isSelf = bullet.seatIndex == FishData.mySeatIndex;
                    fish.onCaught(isSelf);
                    if (!isSelf) break;
                    var data = {
                        bulletId: bullet.bullet_id,
                        fishUniqId: fish.fishUniqId
                    };
                    NetManager.Instance.reqHit(data);
                    break;
                }
            }
            if (isCaught) {
                bullet.showNet();
                break;
            }
        }
    }
    onServerKillFish(data) {
        var fishUniqId = data.fish_id;
        let fish = FishData.fishNodesObj[fishUniqId];
        if (!fish) {
            GlobalFunc.log("没找到后端hit的鱼", fishUniqId);
            return;
        }
        fish.serverHit(data);
    }
    // revFreeze(data): void {
    //     this.fishFct.pauseFishLoad();
    // }
    //////funcs
    /**是否能开炮,单独的条件判断，不包含处理 */
    canTouchFire() {
        //自己导弹时间,自己钻头
        //鸿运当头时间且正在鸿运当头开火
        //炮台还么有初始化完毕
        let b1 = FishData.isSelfHyTime;
        let b2 = FishData.hyCanFire;
        if (FishData.isInDaoDan || FishData.isSelfBitTime || !FishData.mySeatNode || FishData.isSelfHyTime && !FishData.hyCanFire) {
            return false;
        }
        return true;
    }
    bitPlayBegin(data) {
        let bitPlay = new BitPlayNode();
        bitPlay.beginBitPlay(data.pos, data.seatIndex);
    }
}