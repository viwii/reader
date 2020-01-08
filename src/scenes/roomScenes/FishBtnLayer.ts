import { FishData } from "../../datas/FishData";
import OnOffManager from "../../const/OnOffManager";
import { PlayerData } from "../../datas/PlayerData";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import GlobalVar from "../../const/GlobalVar";
import { BattleData } from "../../datas/BattleData";
import { EventDis } from "../../Helpers/EventDis";
import { GameData } from "../../datas/GameData";
import { UIUtils } from "../../game/utils/UIUtils";
import GlobalConst from "../../const/GlobalConst";
import { SceneManager } from "../../common/SceneManager";
import { DialogManager } from "../../common/DialogManager";
import { NetManager } from "../../netWork/NetManager";
import { DragonType, DragonCannonNode } from "../../fishNodes/DragonCannonNode";
import { GlobalUI } from "../../const/GlobalUI";
import { CountDownNode } from "../../fishNodes/CountDownNode";

export class FishBtnLayer /*extends layaMaxUI_1.ui.roomScene.FishBtnLayerUI*/ {
    itemId: string[];
    isUnLock: boolean[];
    isHasSkill: boolean[];
    isSkillCd: boolean[];
    skillName: string[];
    selfSkillCd: number[];
    skillOpenVip: number;
    skillFreeVip: number[];
    skillCost: number[];
    masks: any[];
    isSelfFreeze: boolean;
    isDraganCanOn: boolean;
    draganCanIsOn: boolean;
    isBulletOn: boolean;
    bombIds: number[];
    menuFlag: boolean;
    selectCount: number;
    isFirstShow: boolean;
    exitRoomFlag: boolean;
    isForce: boolean;
    vbox1: any[];
    isMenuShow: boolean;
    fishScene: any;
    boxTime: any;
    boxRight: any;
    btnShake: any;
    btnTomorrow: any;
    btnSp: any;
    boxDragon: any;
    boxBullet: any;
    img_close: any;
    btnCancel: any;
    boxSelect: any;
    imgSel: any;
    aniSelect: any;
    btnShoot: any;
    lblBombCount: any;
    imgTRed: Laya.Image;
    playerData: any;
    helpView: any;
    btnMenu:Laya.Button;
    btnSet:Laya.Button;
    btnMap:Laya.Button;
    btnExit:Laya.Button;
    imgBg:Laya.Image;
    box_left:Laya.Box;
    addChild(helpView: any) {
        throw new Error("Method not implemented.");
    }
    jackpotPool: any;
    imgLeft: any;
    imgRight: any;
    imgShakeRed: any;
    btnRecharge: any;
    btnShop: any;
    sliderBomb: any;
    width: any;
    btn_dragonCan: any;
    mouseEnabled: boolean;
    lblTime: any;
    dragonClose: any;
    dragonOpen: any;
    ddOpen: any;
    ddClose: any;
    btnBullet: any;
    img_close_dragon: any;
    btn_cancel: any;
    btn_cancel2: any;
    btnBullet0: any;
    btnBullet1: any;
    btnBullet2: any;
    aniFilter: any;
    menuopen: any;
    menuclose: any;
    box_surplus: any;
    bulletName: any;
    bulletNum: any;
    countDownNode: any;
    text_dragonCan_num_0: any;
    text_dragonCan_num_1: any;
    text_dragonCan_num_2: any;
    aniTime: any;
    constructor(scene) {
        //super();
        // freeze: FreezeSkill;
        // lock: LockSkill;
        // rage: RageSkill;
        // skillSkin = ["Sd", "Bd", "Kb"];
        this.itemId = [ "7", "8", "9" ];
        this.isUnLock = [ false, false, false ];
        this.isHasSkill = [ false, false, false ];
        this.isSkillCd = [ false, false, false ];
        this.skillName = [ "锁定", "冰冻", "狂暴" ];
        this.selfSkillCd = [ 0, 0, 0 ];
        this.skillOpenVip = 0;
        //狂暴的开启vip
                        this.skillFreeVip = [ 0, 0 ];
        //锁定和狂暴的免费vip
                        this.skillCost = [ 0, 0, 0 ];
        //购买消耗的钻石
                        this.masks = [];
        this.isSelfFreeze = false;
        /**龙炮是否展开 */                this.isDraganCanOn = false;
        /**龙炮是否展开*/                this.draganCanIsOn = false;
        this.isBulletOn = false;
        this.bombIds = [ 12, 13, 14 ];
        this.menuFlag = false;
        this.selectCount = 0;
        //装填总数
                        this.isFirstShow = false;
        //是否第一次打开选择导弹框
                        this.exitRoomFlag = true;
        this.isForce = true;
        //是否强制关闭
                        this.vbox1 = [];
        this.isMenuShow = false;
        this.fishScene = scene;
        this.boxTime.visible = FishData.isVipBattle;
        FishData.isVipBattle && this.startTime();
        for (let i = 0; i < this.boxRight._children.length; i++) {
            this.vbox1.push(this.boxRight._children[i]);
        }
        //这里因为加载模式，适配有延迟，所以这里也给个延迟
        this.btnShake.visible = OnOffManager.isShake && !GlobalFunc.isIos();
        this.btnTomorrow.visible = PlayerData.Instance.checkTGift();
        // this.box_skills.visible = OnOffManager.isSkillOn;
                        this.btnSp.visible = PlayerData.Instance.checkSpGift();
        this.boxDragon.visible = OnOffManager.isLongPaoOn && !FishData.isVipBattle;
        this.boxBullet.visible = OnOffManager.isBullet && BattleData.Instance.room_type > 0 && !GlobalVar.isShenHeVer;
        this.boxRight.visible = BattleData.Instance.room_type > 0;
        // this.getSkillData();
                        this.btnShake.on(Laya.Event.CLICK, this, this.doShake);
        this.img_close.on(Laya.Event.CLICK, this, this.openBomb);
        this.btnCancel.on(Laya.Event.CLICK, this, () => {
            this.boxSelect.visible = false;
            this.imgSel.visible = false;
            this.aniSelect.stop();
        });
        this.btnShoot.on(Laya.Event.CLICK, this, () => {
            if (+this.lblBombCount.text > 0) {
                if (FishData.isSelfHyTime || FishData.isSelfBitTime) {
                    //new WarningMessage_1.WarningMessage("特色鱼期间无法使用导弹");
                    this.openBomb();
                    return;
                }
                let seat = FishData.mySeatNode.numPanel;
                seat.btn_plus.visible = seat.btn_reduce.visible = seat.text_paobei.visible = false;
                this.boxSelect.visible = false;
                this.startBomb();
            } else {
                //new WarningMessage_1.WarningMessage("还未选择导弹发射数量哦");
            }
        });
        EventDis.Instance.addEvntListener(GlobalVar.REFRESH_SKILL_LIST, this, this.updateLstData);
        EventDis.Instance.addEvntListener(GlobalVar.HY_CHANGE, this, this.hyChange);
        EventDis.Instance.addEvntListener(GlobalVar.LAST_BULLET_VIEW_OPEN, this, this.openLastBulletView);
        EventDis.Instance.addEvntListener("add_daodan_num", this, this.updateDaodan);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_CHANGE_DRAGON_CANNON_START, this, this.startDragonCannon);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_CHANGE_DRAGON_CANNON_END, this, this.stopDragonCannon);
        EventDis.Instance.addEvntListener(GlobalVar.CLOSE_FISH_SCENE_VIEW, this, this.closeFishSceneView);
        EventDis.Instance.addEvntListener(GlobalVar.CHANGEDAY, this, () => {
            this.imgTRed && !this.imgTRed.destroy && (this.imgTRed.visible = GameData.Instance.tomrrowState == 2);
        });
        EventDis.Instance.addEvntListener(GlobalVar.TOMORROW_GOT, this, () => {
            !this.draganCanIsOn && this.updateDragonCanNum();
        });
        this.playerData = BattleData.Instance.roomPlayerData;
        UIUtils.showDisplay("RoomHelpNode", this, () => {
            // this.helpView = new RoomHelpNode();
            // this.addChild(this.helpView);
            // GlobalFunc.doLRAdapt({
            //     node: this.helpView
            // });
        });
        if (BattleData.Instance.roomData[BattleData.Instance.room_type].isPool != "0" && OnOffManager.isJackPotOn) {
            // UIUtils.showDisplay("RoomJackpotNode", this, () => {
            //     this.jackpotPool = new RoomJackpotNode(BattleData.room_type);
            //     this.addChild(this.jackpotPool);
            // });
        }
        if (Laya.stage.width / Laya.stage.height > 1.9) {
            GlobalFunc.adaptLiuHai(this.boxRight, true);
        } else {
            GlobalFunc.doLRAdapt({
                node: this.boxRight,
                isRight: true
            });
        }
        GlobalFunc.doLRAdapt({
            node: this.imgLeft
        });
        GlobalFunc.doLRAdapt({
            node: this.imgRight,
            isRight: true
        });
        Laya.timer.frameOnce(10, this, () => {
            if (Laya.stage.width / Laya.stage.height > 1.9) {
                GlobalFunc.adaptLiuHai(this.box_left);
                GlobalFunc.adaptLiuHai(this.btnMenu);
                GlobalFunc.adaptLiuHai(this.btnSet);
                GlobalFunc.adaptLiuHai(this.btnMap);
                GlobalFunc.adaptLiuHai(this.btnExit);
                GlobalFunc.adaptLiuHai(this.imgBg);
            } else {
                GlobalFunc.doLRAdapt({
                    node: this.box_left
                });
                GlobalFunc.doLRAdapt({
                    node: this.btnExit
                });
                GlobalFunc.doLRAdapt({
                    node: this.btnMap
                });
                GlobalFunc.doLRAdapt({
                    node: this.btnSet
                });
                GlobalFunc.doLRAdapt({
                    node: this.btnMenu
                });
                GlobalFunc.doLRAdapt({
                    node: this.imgBg
                });
            }
        });
        this.updateView();
        this.btnOnMouse();
        EventDis.Instance.addEvntListener("bombReceive", this, this.playBomb);
        EventDis.Instance.addEvntListener("shakeTimeOut", this, () => {
            this.imgShakeRed.visible = PlayerData.Instance.checkShake();
        });
        EventDis.Instance.addEvntListener(GlobalVar.YAO_CHANGE, this, () => {
            this.imgShakeRed.visible = PlayerData.Instance.checkShake();
        });
        EventDis.Instance.addEvntListener(GlobalVar.BOMB_FIRE, this, this.updateBomb);
        EventDis.Instance.addEvntListener(GlobalVar.HY_CHANGE, this, this.hyChange);
        this.aniOnEvent();
        this.btnExit.mouseEnabled = this.btnMap.mouseEnabled = this.btnSet.mouseEnabled = false;
        EventDis.Instance.addEvntListener("paySuccess", this, data => {
            GlobalFunc.log("充值奖励显示");
            // let rewardDlg = new RewardDialog(data.items);
            // rewardDlg.isFishScene = true;
            // rewardDlg.init(null, null);
            // this.updateDaodan();
            // SceneManager.Instance.addToMiddLayer(rewardDlg, GlobalConst.dialogLayer);
            // this.imgShakeRed.visible = PlayerData.Instance.checkShake();
            // this.btnRecharge.visible = !GameData.Instance.isFirstRecharge;
            // this.btnSp.visible = PlayerData.Instance.checkSpGift();
            // GlobalFunc.setReset(true, this.boxRight, this.vbox1);
        });
        EventDis.Instance.addEvntListener(GlobalVar.TOMORROW_GOT, this, data => {
            this.btnTomorrow.visible = false;
            GlobalFunc.setReset(true, this.boxRight, this.vbox1);
            // let dlg = new RewardDialog(data);
            // dlg.init(null, null);
            // SceneManager.Instance.addToMiddLayer(dlg, GlobalConst.dialogLayer);
        });
        EventDis.Instance.addEvntListener(GlobalVar.TOMORROW_SEND, this, () => {
            this.btnTomorrow.visible = true && OnOffManager.isTomorrom;
            GlobalFunc.setReset(true, this.boxRight, this.vbox1);
        });
        this.btnRecharge.visible = !GameData.Instance.isFirstRecharge;
        if (!OnOffManager.isChargeOn) {
            this.btnShop.visible = this.btnRecharge.visible = false;
        }
        this.btnShop.visible = !!OnOffManager.isChargeOn;
        this.imgShakeRed.visible = PlayerData.Instance.checkShake();
        this.sliderBomb.changeHandler = new Laya.Handler(this, () => {
            let value = Math.ceil(this.sliderBomb.value * .01 * this.selectCount);
            if (value == this.selectCount) {
                if (this.sliderBomb.value == 100) {
                    this.lblBombCount.text = value + "";
                }
            } else {
                if (this.isFirstShow) {
                    this.isFirstShow = false;
                    return;
                }
                this.lblBombCount.text = Math.max(1, Math.ceil(this.sliderBomb.value * .01 * this.selectCount)) + "";
            }
        });
        EventDis.Instance.addEvntListener("today_gold_back", this, this.resExitRoom);
        GlobalFunc.setReset(true, this.boxRight, this.vbox1);
        this.boxRight.x = this.width - this.boxRight.width;
        let dragonPos = this.btn_dragonCan.localToGlobal(new Laya.Point(50, 57));
        PlayerData.Instance.setHallFlyPos(dragonPos, GlobalConst.itemFlyRoomDragonCannon);
        this.imgTRed.visible = GameData.Instance.tomrrowState == 2;
        EventDis.Instance.addEvntListener("vip_leave", this, () => {
            this.mouseEnabled = false;
            this.lblTime.visible = false;
        });
    }
    updateDaodan() {
        for (let index = 0; index < 3; index++) {
            let btn = this["btnBullet" + index];
            let bombId = this.bombIds[index];
            let label = btn._children[0];
            label.text = PlayerData.Instance.getItemNum(bombId + "") + "";
        }
    }
    hyChange() {
        // this.lstSkill.refresh();
    }
    /**关闭开启中的按钮面板 */            
    closeFishBtn() {
        if (this.helpView.viewState == 1) {
            EventDis.Instance.dispatchEvent(GlobalVar.CHANGE_ROOM_HELP_STATE);
        }
    }
    /**动画事件监听 */            
    aniOnEvent() {
        this.dragonClose.on(Laya.Event.COMPLETE, this, this.changeDragonCannState);
        this.dragonOpen.on(Laya.Event.COMPLETE, this, () => {
            this.openBtnEvent("btn_dragon_", 3);
        });
        this.ddOpen.on(Laya.Event.COMPLETE, this, () => {
            this.openBtnEvent("btnBullet", 3);
        });
        this.ddClose.on(Laya.Event.COMPLETE, this, () => {
            this.closeBtnVisible("btnBullet", 3);
        });
    }
    /**按钮鼠标事件监听 */            btnOnMouse() {
        this.btnSp.on(Laya.Event.CLICK, this, () => {
            if (FishData.isInDaoDan) return;
            let tehuiName = GlobalConst.DIA_PREFERENTIAL;
            if (GameData.Instance.tehuiState1 != 1 && GameData.Instance.tehuiState2 != 1) {
                tehuiName = GlobalConst.DIA_NEWTHGIFT;
            }
            DialogManager.Instance.getDialogByName(tehuiName, {
                isRight: true
            });
        });
        this.btnShop.on(Laya.Event.CLICK, this, () => {
            if (FishData.isInDaoDan) return;
            DialogManager.Instance.getDialogByName(GlobalConst.DIA_SHOP);
        });
        this.btnRecharge.on(Laya.Event.CLICK, this, () => {
            if (FishData.isInDaoDan) return;
            DialogManager.Instance.getDialogByName(GlobalConst.DIA_FIRSTPAY, {
                isRight: true
            });
        });
        this.btnExit.on(Laya.Event.CLICK, this, this.reqExitRoom);
        this.btnMap.on(Laya.Event.CLICK, this, this.openFishMap);
        this.btnSet.on(Laya.Event.CLICK, this, this.openSet);
        this.btnMenu.on(Laya.Event.CLICK, this, this.showMenu);
        this.btnMenu.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
        this.btnBullet.on(Laya.Event.CLICK, this, this.openBomb);
        this.btnBullet.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
        this.btn_dragonCan.on(Laya.Event.CLICK, this, this.doDragonCan);
        this.btn_dragonCan.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
        this.img_close_dragon.on(Laya.Event.CLICK, this, this.doDragonCan);
        this.img_close_dragon.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
        this.btnTomorrow.on(Laya.Event.CLICK, this, () => {
            UIUtils.showDisplay("GiftMrDlg", this, () => {
                // let dlg = new GiftMrDlg_1.GiftMrDlg(true);
                // SceneM.addToMiddLayer(dlg, GlobalConst.dialogLayer);
            });
        });
        for (let index = 0; index < 3; index++) {
            let btn = this["btnBullet" + index];
            let bombId = this.bombIds[index];
            btn.visible = false;
            btn.on(Laya.Event.CLICK, this, this.selectBomb, [ bombId, btn ]);
            let label = btn._children[0];
            label.text = PlayerData.Instance.getItemNum(bombId + "") + "";
            btn.on(Laya.Event.MOUSE_DOWN, this, e => {
                e.stopPropagation();
            });
        }
        for (let index = 0; index < 3; index++) {
            let btn = this["btn_dragon_" + index];
            btn.on(Laya.Event.CLICK, this, this.sendDragonCannonOpen, [ index + 4 ]);
            btn.on(Laya.Event.MOUSE_DOWN, this, e => {
                e.stopPropagation();
            });
        }
        this.btn_cancel.on(Laya.Event.CLICK, this, this.sendDragonCannonClose);
        this.btn_cancel.on(Laya.Event.CLICK, this, this.stopDragonCannon, [ FishData.mySeatIndex ]);
        this.btn_cancel.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
        this.btn_cancel2.on(Laya.Event.CLICK, this, this.openBomb);
        this.btn_cancel2.on(Laya.Event.MOUSE_DOWN, this, e => {
            e.stopPropagation();
        });
    }
    openBomb(ischange = true) {
        if (this.isMenuShow && ischange) {
            this.showMenu();
        }
        if (this.playerData[FishData.mySeatIndex].isDragonCannon != -1) {
            //new WarningMessage_1.WarningMessage("请关闭龙炮,才能发射导弹", true);
            return;
        }
        this.btn_dragonCan.mouseEnabled = false;
        Laya.timer.once(900, this.btn_dragonCan, () => {
            this.btn_dragonCan.mouseEnabled = true;
            this.btnBullet.mouseEnabled = true;
        });
        this.btnBullet.mouseEnabled = false;
        if (FishData.isInDaoDan && this.isForce) return;
        !this.isBulletOn && this.closeFishSceneView("daoDan");
        !this.isForce && (this.isForce = !this.isForce);
        if (!this.isBulletOn) {
            if (FishData.isSelfHyTime || FishData.isSelfBitTime) {
                //new WarningMessage_1.WarningMessage("特色鱼期间无法使用导弹");
                return;
            }
            FishData.inDaodan = true;
            this.updateDaodan();
            this.ddOpen.play(0, false);
            this.openBtnVisible("btnBullet", 3);
        } else {
            FishData.inDaodan = false;
            this.ddClose.play(0, false);
            this.openBtnEvent("btnBullet", 3);
            this.boxSelect.visible = false;
        }
        this.imgSel.visible = false;
        this.aniSelect.stop();
        Laya.timer.once(this.isBulletOn ? 500 : 1, this, () => {
            this.btnBullet0.visible = this.btnBullet1.visible = this.btnBullet2.visible = !this.isBulletOn;
            this.isBulletOn = !this.isBulletOn;
        });
    }
    selectBomb(id, btn) {
        if (FishData.isInDaoDan) {
            //new WarningMessage_1.WarningMessage("导弹发射进行中!");
            return;
        }
        FishData.bombId = id;
        this.selectCount = PlayerData.getItemNum(id + "");
        this.lblBombCount.text = "1";
        this.imgSel.pos(btn.x, btn.y);
        this.boxSelect.visible = true;
        this.isFirstShow = true;
        this.sliderBomb.value = Math.ceil(1 / this.selectCount * 100);
        if (PlayerData.getItemNum(id + "") == 0) {
            //new WarningMessage_1.WarningMessage("您使用的导弹库存不足。");
            this.boxSelect.visible = false;
            return;
        }
        this.imgSel.visible = true;
        this.aniSelect.play(0, true);
        this.isFirstShow = false;
    }
    startBomb() {
        if (FishData.isInDaoDan) return;
        /**请求发射导弹 */                !FishData.isInDaoDan && this.aniFilter.play(0, true);
        FishData.isInDaoDan = true;
        let node = FishData.mySeatNode;
        let cannon = node.cannonNode;
        cannon.box_cannon.visible = false;
        let seat = node.numPanel;
        seat.imgBullet.visible = true;
        let layar = SceneManager.Instance.getLayerByName(GlobalConst.effectTopLayer);
        let view = layar.getChildByName("bomb");
        if (!view) {
            //view = new BombView_1.BombView(+this.lblBombCount.text);
        }
        view.name = "bomb";
        SceneManager.Instance.addToMiddLayer(view, GlobalConst.effectTopLayer);
        seat.imgBullet.skin = view.imgBullet.skin = `bullets/img_zid_${FishData.bombId - 1}.png`;
    }
    updateBomb() {
        this.openBomb();
    }
    showMenu() {
        this.btnMenu.mouseEnabled = false;
        this.btn_dragonCan.mouseEnabled = false;
        this.btnBullet.mouseEnabled = false;
        Laya.timer.once(1e3, this, () => {
            this.btnMenu.mouseEnabled = true;
            this.btn_dragonCan.mouseEnabled = true;
            this.btnBullet.mouseEnabled = true;
        });
        if (!this.isBulletOn) {
            this.closeFishSceneView("daoDan", false);
        }
        if (!this.draganCanIsOn) {
            this.closeFishSceneView("longPao", false);
        }
        if (FishData.isInDaoDan) return;
        if (this.menuFlag) return;
        this.menuFlag = true;
        if (!this.isMenuShow) {
            this.menuopen.play(0, false);
        } else {
            this.menuclose.play(0, false);
        }
        this.isMenuShow = !this.isMenuShow;
        Laya.timer.once(900, this, function() {
            this.menuFlag = false;
        });
        this.btnExit.visible = BattleData.Instance.room_type > 0;
        this.btnMap.mouseEnabled = this.btnExit.mouseEnabled = this.btnSet.mouseEnabled = this.menuFlag;
    }
    resumeFreeze() {
        //进入场景时的冰冻效果
        let skillData = BattleData.Instance.skillInfo;
        // if (!skillData || !skillData.freezeData || !skillData.freezeData.freezeEndTime) return;
        // let freezeData = skillData.freezeData;
        // let time = freezeData.freezeEndTime - GameData.Instance.serverTimeStamp;
        // if (time > 0) {
        //     let params = {
        //         data: {
        //             freezeEndTime: `${freezeData.freezeEndTime}`,
        //             freezeMillis: `${freezeData.freezeMillis}`,
        //             seat: "0"
        //         }
        //     };
        //     EventDis.Instance.dispatchEvent(GlobalVar.ROOM_FREEZE_SHOOT_NOTICE, params);
        // }
    }
    reqExitRoom() {
        if (!this.exitRoomFlag) return;
        this.exitRoomFlag = false;
        NetManager.Instance.reqTodayKillGold();
    }
    resExitRoom(data) {
        this.exitRoomFlag = true;
        let gold = data.today_total_kill_gold;
        if (gold == 0) {
            EventDis.Instance.dispatchEvent("sure_leave_room");
        } else {
            // let dlg = new ExitRoomDlg(gold);
            // SceneManager.Instance.addToMiddLayer(dlg, GlobalConst.dialogLayer);
        }
    }
    updateView() {
        // this.lstSkill.dataSource = [0, 0, 0];
    }
    updateLstData(data) {
        // let isHy = g_battleData.roomPlayerData[FishData.mySeatIndex].isHongYun && (data[0] == 0 || data[0] == 2);
        // if (isHy) return;
        // if (!!data[3]) {//狂暴
        //     this.lstSkill.changeItem(data[0], data[1]);
        //     this.lstSkill.changeItem(0, data[1]);
        //     this.isSkillCd[data[0]] = false;
        // }
        // data[0] == 1 && (this.isSelfFreeze = data[2]);
        // if (data[0] == 1 && data[1] != 0 && !this.isSelfFreeze) {
        //     Laya.timer.once(data[1], this, this.setOtherFreeze);
        //     return;
        // }
        // this.lstSkill.changeItem(data[0], data[1]);
    }
    onLstSkillRender(cell, index) {
        // let data = cell.dataSource;
        // let imgMask = cell.getChildByName("imgMask") as Laya.Image;
        // let imgSkill = cell.getChildByName("imgSkill") as Laya.Image;
        // let lblSkillNum = cell.getChildByName("lblSkillNum") as Laya.Label;
        // let lblFree = cell.getChildByName("lblFree") as Laya.Label;
        // let boxCost = cell.getChildByName("boxCost") as Laya.Box;
        // let lblCost = boxCost.getChildByName("lblCost") as Laya.Label;
        // let isLast = index > 1;
        // let vip = g_playerData.vip_level;
        // let isUnlock = !isLast || (vip >= this.skillOpenVip);
        // lblSkillNum.text = g_playerData.getItemNum(this.itemId[index]) + "";
        // lblCost.text = this.skillCost[index] + "";
        // this.isUnLock[index] = isUnlock;
        // imgSkill.skin = `firstPic/icon_skill${this.skillSkin[index]}.png`
        // lblFree.visible = false;
        // if (index == 0) {
        //     lblFree.visible = vip >= this.skillFreeVip[0];
        // } else if (index == 2) {
        //     lblFree.visible = vip >= this.skillFreeVip[1];
        // }
        // boxCost.visible = +lblSkillNum.text <= 0 && !lblFree.visible;
        // lblSkillNum.visible = +lblSkillNum.text > 0 && !lblFree.visible;
        // this.isHasSkill[index] = lblSkillNum.visible || lblFree.visible;
        // // data>0开启倒计时
        // if (!this.masks[index]) {
        //     this.masks[index] = new CircularMaskProgressBar();
        //     let width = imgMask.width;
        //     let len = width / Math.sqrt(2);
        //     this.masks[index].bindTarget(imgMask, width / 2, width / 2, len);
        // }
        // // let isHy = g_battleData.roomPlayerData[FishData.mySeatIndex].isHongYun && (index == 0 || index == 2);
        // let isHy = false;
        // imgMask.visible = !isUnlock || isHy;
        // if (isHy) {
        //     data = this.lstSkill.dataSource[index] = 0;
        //     let mask = this.masks[index] as CircularMaskProgressBar;
        //     mask.clearTween();
        //     this.masks[index].percent = 1;
        // }
        // if (data <= 0) {
        //     if (data == -1 && index == 0) {
        //         Laya.timer.clear(this, this.lockCd);
        //         let mask = this.masks[index] as CircularMaskProgressBar;
        //         mask.clearTween();
        //         imgMask.visible = true;
        //         this.selfSkillCd[index] = 0;
        //         mask.percent = 1;
        //     } else if (data == -2 && index == 0) {
        //         !isHy && (this.masks[index].percent = 0);
        //     }
        //     return;
        // }
        // imgMask.visible = true;
        // this.selfSkillCd[index] = data;
        // !isHy && (this.masks[index].percent = 1);
        // !isHy && this.masks[index].tweenValue(0, FishData.skillCd[index]);
        // this.isSkillCd[index] = true;
        // if (index == 1) {
        //     Laya.timer.clear(this, this.setOtherFreeze);
        //     Laya.timer.loop(1000, this, this.freezeCd, [index]);
        // } else if (index == 0) {
        //     Laya.timer.loop(1000, this, this.lockCd, [index]);
        // } else {
        //     Laya.timer.loop(1000, this, this.rageCd, [index]);
        // }
    }
    setOtherFreeze() {
        // g_EventDis.dispatchEvent(globalVar.ROOM_FREEZE_STOP_NOTICE, [false]);
    }
    freezeCd(index) {
        // this.selfSkillCd[index] -= 1000;
        // if (this.selfSkillCd[index] <= 0) {
        //     this.selfSkillCd[index] = 0;
        //     Laya.timer.clear(this, this.freezeCd);
        //     this.isSelfFreeze && g_EventDis.dispatchEvent(globalVar.ROOM_FREEZE_STOP_NOTICE);
        //     !this.isSelfFreeze && (g_EventDis.dispatchEvent(globalVar.REFRESH_SKILL_LIST, [1, 0, false]));
        //     this.isSkillCd[index] = false;
        //     this.masks[index].percent = 0;
        // }
    }
    lockCd(index) {
        // this.selfSkillCd[index] -= 1000;
        // let isHy = g_battleData.roomPlayerData[FishData.mySeatIndex].isHongYun;
        // if (this.selfSkillCd[index] <= 0 || isHy) {
        //     this.selfSkillCd[index] = 0;
        //     Laya.timer.clear(this, this.lockCd);
        //     g_EventDis.dispatchEvent(globalVar.ROOM_LOCK_STOP_NOTICE);
        //     this.isSkillCd[index] = false;
        //     FishData.isLocking = false;
        //     !isHy && (this.masks[index].percent = 0);
        // }
    }
    rageCd(index) {
        // this.selfSkillCd[index] -= 1000;
        // let isHy = g_battleData.roomPlayerData[FishData.mySeatIndex].isHongYun;
        // if (this.selfSkillCd[index] <= 0 || isHy) {
        //     this.selfSkillCd[index] = 0;
        //     Laya.timer.clear(this, this.rageCd);
        //     g_EventDis.dispatchEvent(globalVar.ROOM_RAGE_STOP_NOTICE);
        //     this.isSkillCd[index] = false;
        //     !isHy && (this.masks[index].percent = 0);
        // }
    }
    onLstSkillClick(e, index) {
        // if (e.type == "click") {
        //     if (g_battleData.roomPlayerData[FishData.mySeatIndex].isHongYun && (index == 2 || index == 0)) {
        //         globalFun.globalTip("鸿运当头期间无法使用该技能");
        //         return;
        //     }
        //     if (!this.isUnLock[index]) {
        //         globalFun.globalTip(index == 2 ? "狂暴技能vip5及以上可用" : "提升炮倍即可解锁");
        //         return;
        //     }
        //     if (index == 1 && !GlobalConst.isFreezeCanUse) {
        //         globalFun.globalTip("即将切换场景,无法使用冰冻");
        //         return;
        //     }
        //     if (this.isSkillCd[index]) {
        //         globalFun.globalTip(`${this.skillName[index]}技能冷却中`);
        //         return;
        //     }
        //     if (!globalFun.isHaveFishInScreen()) {
        //         globalFun.globalTip(`没有鱼儿,不能使用${this.skillName[index]}哦`);
        //         return;
        //     }
        //     if (this.isSkillCd[2] && index == 0) {
        //         globalFun.globalTip("锁定技能无法使用");
        //         return;
        //     }
        //     if (!this.isHasSkill[index]) {
        //         if (g_playerData.getItemNum(GlobalConst.diamond + "") < this.skillCost[index]) {
        //             this.checkDiamond();
        //         } else if (!g_GameData.skillChecked[index]) {
        //             let str1 = globalFun.getColorText("您是否要花费");
        //             let str2 = globalFun.getColorText("", 32, "#ffec4c");
        //             let str3 = globalFun.getColorText("钻石购买");
        //             let str4 = globalFun.getColorText(`${this.skillName[index]}技能`, 32, "#ffec4c");
        //             let alert = new CommonDialog(1, [str1, str2, str3], [str4], "购买", "购买技能", false, new Laya.Handler(this, () => {
        //                 g_GameData.skillChecked[index] = true;
        //                 this.doSkill(index);
        //             }));
        //             g_SceneManager.addToMiddLayer(alert, GlobalConst.dialogLayer);
        //         } else {
        //             this.doSkill(index);
        //         }
        //     } else {
        //         this.doSkill(index);
        //     }
        // }
    }
    doSkill(index) {
        // switch (index) {
        //     case 0:
        //         //锁定searchTarget
        //         guideManager.changeState(GuideType.LOCK);
        //         let lockFish = this.lock.searchTarget(FishData.fishNodesObj);
        //         // lockFish && g_RoomNetManager.sendLockBegin(lockFish.fishUniqId, "1111");
        //         break;
        //     case 1:
        //         guideManager.changeState(GuideType.FREEZE);
        //         // g_RoomNetManager.sendFreezeBegin();
        //         break;
        //     case 2:
        //         //狂暴
        //         let rageFish = this.lock.searchTarget(FishData.fishNodesObj);
        //         // rageFish && g_RoomNetManager.sendRageBegin(rageFish.fishUniqId, "1111");
        //         break;
        // }
    }
    checkDiamond() {
        if (!GlobalFunc.isIos()) {
            DialogManager.Instance.getDialogByName(GlobalConst.DIA_SHOP);
        } else {
            //new WarningMessage_1.WarningMessage("您的钻石不足", true);
        }
    }
    /**打开房间内特色玩法剩余子弹数 */            openBoxSurplus(name = "", num = 0, isTiming = 0) {
        this.box_surplus.visible = true;
        this.bulletName.text = name;
        this.bulletNum.text = num.toString();
        if (isTiming != 0) {
            UIUtils.showDisplay("CountDownNode", this, () => {
                this.countDownNode = new CountDownNode(GlobalConst.specialFishEndTime, true);
                this.box_surplus.addChild(this.countDownNode);
                this.countDownNode.x = -17;
                this.countDownNode.y = 20;
                this.countDownNode.scale(.8, .8);
                this.countDownNode.startTiming();
            });
        }
    }
    /**设置房间内特色玩法剩余子弹数 */            setSurplusNum(num) {
        num == 0 && this.countDownNode && this.countDownNode.stopTiming();
        this.bulletNum.text = num.toString();
    }
    /**关闭房间内特色玩法剩余子弹数 */            
    closeBoxSurplus() {
        let playerInfo = BattleData.Instance.roomPlayerData[FishData.mySeatIndex];
        if (playerInfo.isDragonCannon != -1) {
            this.bulletName.text = "龙炮子弹";
            this.bulletNum.text = playerInfo.dragonCannon.leftBullet + "";
            return;
        }
        this.box_surplus.visible = false;
        if (this.countDownNode && !this.countDownNode.destroyed) {
            this.countDownNode.doDestroy();
            this.countDownNode = undefined;
        }
    }
    /**操作龙炮面板 */            doDragonCan(ischange = true) {
        this.btnMenu.mouseEnabled = this.btnBullet.mouseEnabled = false;
        Laya.timer.once(900, this, () => {
            this.btnMenu.mouseEnabled = this.btnBullet.mouseEnabled = true;
        });
        if (this.isMenuShow && ischange) {
            this.showMenu();
        }
        !this.draganCanIsOn && this.closeFishSceneView("longPao");
        this.isDraganCanOn = !this.isDraganCanOn;
        if (this.draganCanIsOn) {
            // this.closeBtnEvent("btn_dragon_", 3);
            this.dragonClose.play(0, false);
            this.draganCanIsOn = false;
        } else {
            // this.openBtnVisible("btn_dragon_", 3);
            this.dragonOpen.play(0, false);
            this.draganCanIsOn = true;
            this.updateDragonCanNum();
        }
    }
    /**通知服务端开启龙炮 */            sendDragonCannonOpen(type) {
        if (!FishData.isSelfDragonTime) {
            if (FishData.isInDaoDan || FishData.inDaodan) {
                //new WarningMessage_1.WarningMessage("请等到导弹结束，才能使用龙炮", true);
                return;
            }
            if (BattleData.Instance.roomPlayerData[FishData.mySeatIndex].isSpecialFishTime()) {
                //new WarningMessage_1.WarningMessage("特色鱼状态不能使用龙炮", true);
                return;
            }
            this.doDragonCan();
            let seat = FishData.mySeatIndex;
            let playerInfo = this.playerData[seat.toString()];
            let dragonCannonNum = PlayerData.getItemNum(GlobalFunc.getDragonCannonID(type));
            let tips = "";
            if (type == DragonType.GREEN_CANNON) {
                tips = "抱歉当前房间无法使用，请前往百炮房使用";
            } else if (type == DragonType.SILVER_CANNON) {
                tips = "抱歉当前房间无法使用，请前往千炮房使用";
            } else if (type == DragonType.GOLD_CANNON) {
                tips = "抱歉当前房间无法使用，请前往千炮房使用";
            }
            if (dragonCannonNum <= 0) {
                //new WarningMessage_1.WarningMessage("当前龙炮没有子弹了,请获取更多的子弹。", true);
                return;
            }
            let a = BattleData.Instance.room_type;
            let b = BattleData.Instance.dragonCannonInfo;
            let dragonCannonData = BattleData.Instance.dragonCannonInfo[type];
            let canStart = false;
            for (let index = 0; index < dragonCannonData.ROOM_TYPE.length; index++) {
                let data = dragonCannonData.ROOM_TYPE[index];
                if (data == BattleData.Instance.room_type) {
                    canStart = true;
                }
            }
            if (!canStart) {
                //new WarningMessage_1.WarningMessage(tips, true);
                return;
            }
            NetManager.Instance.reqChangeDragonState(1, type);
        }
    }
    /**开启龙炮 */            startDragonCannon(data) {
        let type = data.longpao_id;
        let seatIndex = BattleData.Instance.getUserSeatByUid(data.uid);
        if (this.playerData[seatIndex].isDragonCannon == -1) {
            let dragonCannon = new DragonCannonNode(seatIndex, type);
            this.playerData[seatIndex].dragonCannon = dragonCannon;
        }
        if (seatIndex == FishData.mySeatIndex) {
            if (this.isBulletOn) {
                this.openBomb();
            }
            this.closeFishBtn();
            if (FishData.isAutoButtonOn) {
                this.helpView.doAuto();
            }
            if (this.helpView.viewState == 1) {
                this.helpView.changeState();
            }
            FishData.isDragonCannonOn = true;
            this.btn_cancel.mouseEnabled = this.btn_dragonCan.mouseEnabled = this.img_close_dragon.mouseEnabled = false;
            GlobalFunc.changeUI(this.btn_dragonCan, this.btn_cancel, new Laya.Handler(this, this.changeDragonCannState));
        }
    }
    /**通知服务端关闭龙炮 */            sendDragonCannonClose() {
        let seat = FishData.mySeatIndex;
        let playerdata = this.playerData[seat];
        if (playerdata.isSpecialFishTime()) {
            //new WarningMessage_1.WarningMessage("特色鱼期间无法取消龙炮", true);
            return;
        }
        if (playerdata.isDragonCannon != -1 && playerdata.dragonCannon != undefined) {
            NetManager.Instance.reqChangeDragonState(0, playerdata.isDragonCannon);
        }
    }
    /**关闭龙炮 */            stopDragonCannon(seatIndex) {
        FishData.isDragonCannonOn = false;
        let playerdata = this.playerData[seatIndex];
        if (playerdata.isSpecialFishTime()) {
            return;
        }
        if (playerdata.dragonCannon && !playerdata.dragonCannon.destroyed) {
            playerdata.dragonCannon.destroy();
        } else {
            return;
        }
        FishData.seatNodes[seatIndex].numPanel.text_paobei.text = playerdata.cur_pao.toString();
        playerdata.dragonCannon = undefined;
        if (seatIndex == FishData.mySeatIndex) {
            this.btn_cancel.mouseEnabled = this.btn_dragonCan.mouseEnabled = this.img_close_dragon.mouseEnabled = false;
            GlobalFunc.changeUI(this.btn_cancel, this.btn_dragonCan, new Laya.Handler(this, this.changeDragonCannState));
        }
    }
    /**更改龙炮面板状态 */            changeDragonCannState() {
        this.closeBtnVisible("btn_dragon_", 3);
        if (FishData.isSelfDragonTime) {
            this.btn_dragonCan.mouseEnabled = false;
            this.img_close_dragon.mouseEnabled = false;
            this.btn_cancel.mouseEnabled = true;
        } else {
            this.btn_dragonCan.mouseEnabled = true;
            this.img_close_dragon.mouseEnabled = true;
            this.btn_cancel.mouseEnabled = false;
        }
    }
    /**
* 批量关闭房间内的按钮鼠标事件
* @param name 按钮名
* @param number 关闭数量
*/            closeBtnEvent(name, number) {
        for (let index = 0; index < number; index++) {
            this[name + index].mouseEnabled = false;
            this[name + index].visible = false;
        }
    }
    /**
* 批量打开房间内的按钮鼠标事件
* @param name 按钮名
* @param number 关闭数量
*/            openBtnEvent(name, number) {
        for (let index = 0; index < number; index++) {
            console.log(name + index);
            console.log(name + index + "");
            this[name + index].mouseEnabled = true;
        }
    }
    /**
* 批量关闭房间内的按钮的显示
* @param name
* @param number
*/            closeBtnVisible(name, number) {
        for (let index = 0; index < number; index++) {
            console.log(name + index);
            console.log(name + index + "");
            this[name + index].visible = false;
        }
    }
    /**
* 批量打开房间内的按钮的显示
* @param name
* @param number
*/            openBtnVisible(name, number) {
        for (let index = 0; index < number; index++) {
            this[name + index].visible = true;
        }
    }
    /**播放获取彩金奖励 */           
     playGetJackpot(seat) {
        // let ani = new layaMaxUI_1.ui.common.JackpotAccAniUI();
        // ani.text_goldNum.text = 8645e6.toLocaleString();
        // let pos = GlobalFunc.getBigFishPos()[seat];
        // ani.zOrder = 1e4;
        // ani.scale(0, 0);
        // ani.pos(pos.x, pos.y);
        // SceneM.addToLayer(ani, GlobalConst.effectTopLayer);
        // let timeLine = TimeLineManager.creatTimeLine();
        // timeLine.addLabel("appear", 0).to(ani, {
        //     scaleX: .5,
        //     scaleY: .5
        // }, 500, Laya.Ease.backOut).addLabel("close", 0).to(ani, {
        //     scaleX: 0,
        //     scaleY: 0
        // }, 500, Laya.Ease.backIn, 2e3);
        // timeLine.on(Laya.Event.COMPLETE, this, ani => {
        //     ani.removeSelf();
        //     ani.destroy();
        // }, [ ani ]);
        // timeLine.play(0, false);
    }
    /**打开鱼鉴弹窗 */            
    openFishMap() {
        // if (FishData.isInDaoDan) return;
        // DialogManager.getDialogByName(GlobalConst.DIA_FISHMAP);
    }
    /**打开鱼鉴弹窗 */            
    openSet() {
        // if (FishData.isInDaoDan) return;
        // DialogManager.getDialogByName(GlobalConst.DIA_SET);
    }
    /**打开剩余子弹面板 */            openLastBulletView(data) {
        this.openBoxSurplus(data.name, data.bulletNum, data.timing);
        data.node.btnLayer = this;
    }
    playBomb(data = []) {
        this.isForce = false;
        this.openBomb();
        this.imgSel.visible = this.boxSelect.visible = false;
        this.aniSelect.stop();
        for (let index = 0; index < 3; index++) {
            let btn = this["btnBullet" + index];
            let bombId = this.bombIds[index];
            let label = btn._children[0];
            label.text = PlayerData.getItemNum(bombId + "") + "";
        }
        let layar = SceneManager.Instance.getLayerByName(GlobalConst.effectTopLayer);
        let view = layar.getChildByName("bomb");
        let node = FishData.mySeatNode;
        let cannon = node.cannonNode;
        let seat = node.numPanel;
        Laya.timer.once(1e3, this, () => {
            this.aniFilter.stop();
            this.aniFilter.resetNodes();
        });
        seat.aniBullet.play(0, true);
        seat.imgFire.visible = true;
        seat.aniFire.play(0, false);
        Laya.timer.once(1600, this, () => {
            seat.imgBullet.visible = false;
            seat.imgFire.visible = false;
            cannon.box_cannon.visible = true;
            GlobalUI.showBombEffect(new Laya.Point(view.x, view.y));
            view.destroy();
            seat.text_paobei.visible = seat.btn_plus.visible = seat.btn_reduce.visible = true;
        });
    }
    /**摇一摇 */            
    doShake() {
        if (GameData.Instance.isShaked) {
            //new WarningMessage_1.WarningMessage("今日已购买");
            return;
        }
        if (GameData.Instance.shakeTimes <= 0) {
            GlobalFunc.globalTip("摇一摇次数不足，在渔场捕获一定数量的鱼即可获得次数");
            return;
        }
        DialogManager.Instance.getDialogByName(GlobalConst.DIA_GIFTSHAKE);
    }
    /**龙炮数量更新 */            updateDragonCanNum() {
        !this.text_dragonCan_num_0.destroyed && (this.text_dragonCan_num_0.text = PlayerData.getItemNum("34") + "");
        !this.text_dragonCan_num_1.destroyed && (this.text_dragonCan_num_1.text = PlayerData.getItemNum("35") + "");
        !this.text_dragonCan_num_2.destroyed && (this.text_dragonCan_num_2.text = PlayerData.getItemNum("36") + "");
    }
    /**关闭渔场内展出面板 */            closeFishSceneView(type, ischange = true) {
        if (this.isBulletOn && type != "daoDan") {
            Laya.timer.clearAll(this.btnBullet);
            this.openBomb(ischange);
        }
        type != "fuZhu" && this.closeFishBtn();
        if (this.draganCanIsOn && type != "longPao") {
            this.doDragonCan(ischange);
        }
    }
    startTime() {
        Laya.timer.loop(1e3, this, this.updateTime);
    }
    updateTime() {
        let serverTime = GameData.Instance.serverTimeStamp;
        let h = new Date(serverTime).getHours();
        let m = new Date(serverTime).getMinutes();
        let s = new Date(serverTime).getSeconds();
        let total = (h * 60 + m) * 60 + s;
        let close = BattleData.Instance.vipCloseTime;
        let target = (close[0] * 60 + close[1]) * 60 + close[2];
        if (target - total > 60) {
            this.lblTime.text = `剩余时间: ${Math.max(close[0] * 60 + close[1] - h * 60 - m, 1)}分钟`;
        } else {
            this.lblTime.text = `剩余时间: ${Math.max(0, target - total)}秒`;
            !this.aniTime.isPlaying && this.aniTime.play(0, true);
        }
    }
    destroy() {
        FishData.isVipBattle = false;
        FishData.inDaodan = false;
        FishData.isDragonCannonOn = false;
        Laya.timer.clearAll(this.btnBullet);
        Laya.timer.clearAll(this.btn_dragonCan);
        this.helpView && this.helpView.destroy();
        this.jackpotPool && this.jackpotPool.destroy();
        FishData.isAutoButtonOn = false;
        this.masks.forEach(mask => {});
        // this.lock.destroy();
        Laya.Tween.clearAll(this);
        this.removeSelf();
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
    }
    removeSelf() {
        throw new Error("Method not implemented.");
    }
}