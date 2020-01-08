import { TimeLineManager } from "../const/TimeLineManager";
import { EventDis } from "../Helpers/EventDis";
import { ConfigerHelper } from "../Helpers/ConfigerHelper";
import GlobalVar from "../const/GlobalVar";
import { UIUtils } from "../game/utils/UIUtils";
import { FishData } from "../datas/FishData";
import { SceneManager } from "../common/SceneManager";
import GlobalConst from "../const/GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { BattleData } from "../datas/BattleData";
import { GameData } from "../datas/GameData";
import { NetManager } from "../netWork/NetManager";
import OnOffManager from "../const/OnOffManager";
import { PlayerData } from "../datas/PlayerData";
import { FishLineData } from "../datas/FishLineData";
import { BattleFunc } from "../GlobalFuncs/BattleFunc";
import { SoundManager } from "../common/SoundManager";
import { GlobalUI } from "../const/GlobalUI";

export enum SpecialFishType{
    fish_type_special_zuantou = 21,
    fish_type_special_hongyun = 22,
    fish_type_special_hwbz = 23,
    fish_type_special_xyzp = 24,
    fish_type_special_zshy = 25,
    fish_type_special_wlxb = 26
}

export class DropData {}
export class TransformFilter {
    otherColmax: number;
    aniIsPlay: boolean;
    filterIndex: number;
    otherColVal: { value: number; };
    useTime: number;
    target: any;
    timeLine: any;
    constructor(target) {
        /**出红色外其他颜色数值 */
        this.otherColmax = 0;
        /**动画是否开始播放 */                
        this.aniIsPlay = false;
        this.filterIndex = 0;
        /**其他颜色数值 */                
        this.otherColVal = {
            value: 1
        };
        /**变色基础时间 */                
        this.useTime = 200;
        if (!target) return;
        this.target = target;
        this.timeLine = TimeLineManager.Instance.creatTimeLine();
        this.timeLine.on(Laya.Event.COMPLETE, this, () => {
            this.aniIsPlay = false;
        });
        Laya.timer.frameLoop(2, this, this.setFilter);
    }
    doFilter() {
        this.aniIsPlay = true;
        if (this.timeLine) {
            this.timeLine.reset();
        } else {
            this.timeLine = TimeLineManager.Instance.creatTimeLine();
        }
        let redTime = this.useTime * Math.floor((this.otherColVal.value - this.otherColmax) * 1e3) / 1e3;
        this.timeLine.addLabel("red", 0).to(this.otherColVal, {
            value: this.otherColmax
        }, redTime, Laya.Ease.quadOut).addLabel("end", 0).to(this.otherColVal, {
            value: 1
        }, this.useTime, Laya.Ease.quadIn);
        this.timeLine.play(0, false);
    }
    setFilter() {
        let filter = this.getFilter(this.otherColVal.value);
        this.target.filters = [ filter ];
    }
    getFilter(value) {
        let red = 1;
        let green = 1 - (1 - value) / 5 * 3;
        var obj = [ red, 0, 0, 0, 0, 0, green, 0, 0, 0, 0, 0, value, 0, 0, 0, 0, 0, 1, 0 ];
        return new Laya.ColorFilter(obj);
    }
}

export class FishNode extends Laya.Sprite {
    lockPsOutside: any[];
    canDaoDan: boolean;
    isInScreen: boolean;
    updateNum: number;
    isBitHitting: boolean;
    isInHitting: boolean;
    _showScale: number;
    notFlip: boolean;
    isSymmetry: boolean;
    isNotLeaving: boolean;
    hasDead: boolean;
    beginDead: boolean;
    fishUniqId: any;
    type: number;
    lineIdx: any;
    lineSpeed: number;
    deadPos: Laya.Point;
    lastPos: Laya.Point;
    lockPsInside: any;
    configInfo: any;
    startFrame: number;
    endFrame: number;
    shift: number;
    totalFrame: number;
    characterType: number;
    frameName: any;
    interval: number;
    isVer: boolean;
    pointItem: any;
    diffX: number;
    diffY: number;
    _x0: any;
    _y0: any;
    rotaAngle: number;
    formationId: any;
    frameRate: number;
    curStep: number;
    initTime: any;
    startDelay: number;
    body: Laya.Animation;
    selfW: any;
    selfH: any;
    isOnHide: boolean;
    hideTime: any;
    specialFishData: any;
    filterTrans:any;
    constructor() {
        super();
        this.lockPsOutside = [];
        //相对渔场的锁定点，实时刷新
        this.canDaoDan = false;
        //是否可以用导弹攻击
        this.isInScreen = false;
        //鱼是否在屏幕中
        // public initOk: boolean = false; //鱼是否创建成功
        // public loadFishOverBack: Laya.Handler;//加载完成后callback
        this.updateNum = 0;
        //updatefishline的次数
        this.isBitHitting = false;
        //钻头碰撞检测
        this.isInHitting = false;
        //切鱼碰撞检测
        this._showScale = 1;
        this.notFlip = false;
        this.isSymmetry = false;
        //鱼线是否垂直翻转
    }
    destroy() {
        this.isNotLeaving = false;
        this.filterTrans && Laya.timer.clearAll(this.filterTrans);
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
        this.destroyChildren();
        this.removeSelf();
        this.hasDead = this.beginDead = true;
    }
    //初始化鱼信息
    initFish(param) {
        this.isNotLeaving = true;
        this.visible = false;
        this.fishUniqId = param.fishUniqId;
        this.name = "fish" + this.fishUniqId;
        this.type = Number(param.oneFishInfo.FishID);
        this.lineIdx = param.oneFishInfo.PathID;
        // this.loadFishOverBack = param.loadFishOverBack;
                        this.lineSpeed = 20;
        this.hasDead = this.beginDead = false;
        this.deadPos = new Laya.Point();
        this.lastPos = new Laya.Point();
        this.lockPsInside = ConfigerHelper.Instance.getCachedValueByKey("fishlocker", [ "lock", this.type, "lock" ]);
        this.configInfo = ConfigerHelper.Instance.getCachedValue("fish", "FishTypeID", this.type, "fish");
        //临时规避策划配置出错
        if (!this.configInfo || !this.configInfo.top || !this.lockPsInside) return;
        if (GlobalVar.isShenHeVer && +this.configInfo.type == 50) return;
        this.startFrame = Number(this.configInfo.startFrame) || 0;
        this.endFrame = Number(this.configInfo.endFrame) || 0;
        this.shift = Number(this.configInfo.shift) || 1;
        this.totalFrame = Number(this.configInfo.FrameCount);
        this.characterType = Number(this.configInfo.type);
        this.canDaoDan = this.configInfo.dantou == "1";
        this.notFlip = this.configInfo.notflip == 1;
        if (this.characterType == 30 
            || this.characterType == 60 
            && this.type != 3e3) {
            this._showScale = 2;
        } else if (this.type == 16 || this.type == 17 || this.type == 21 || this.type == 22 || this.type == 75 || this.type == 85 || this.type == 90 || this.type == 95 || this.characterType == 25 || this.characterType == 23) {
            this._showScale = 1.43;
        }
        this.scale(this._showScale, this._showScale);
        this.zOrder = this.configInfo.top * 10;
        this.frameName = this.configInfo.Res;
        UIUtils.createFish(this.frameName, this.configInfo.FrameCount, this, () => {
            this.interval = Number(this.configInfo.framespeed);
            this.isVer = this.configInfo.fishver == "1";
            //准备走鱼线
            this.pointItem = FishLineData.Instance.fishLineObj[this.lineIdx];
            if (this.pointItem.length == 0) return;
            this.diffX = Number(param.oneFishInfo.XDiff) / 1334 * GlobalConst.stageW;
            this.diffY = Number(param.oneFishInfo.YDiff) / 750 * GlobalConst.stageH;
            this._x0 = this.pointItem[0][0] * GlobalConst.stageW + this.diffX;
            this._y0 = this.pointItem[0][1] * GlobalConst.stageH + this.diffY;
            this.rotaAngle = Number(param.oneFishInfo.Angle);
            this.formationId = param.oneFishInfo.FormationID;
            this.isSymmetry = param.oneFishInfo.Symmetry == "1";
            this.lineSpeed = Number(param.lineSpeed) * 1e3;
            var shiftFrame = Math.abs(this.endFrame - this.startFrame) || 0;
            this.frameRate = (this.lineSpeed / this.shift * shiftFrame + this.lineSpeed * (this.totalFrame - shiftFrame)) / this.totalFrame;
            var startDiff = param.startDiff || 0;
            //startDiff是鱼线已经跑过的时间偏移
            var indexDelay = Number(param.indexDelay);
            this.curStep = Math.floor(Math.max(0, startDiff - indexDelay) / this.frameRate);
            //鱼线已走完，不创建
            if (this.curStep > this.pointItem.length) return;
            this.fishShow(!startDiff);
            this.initTime = BattleData.Instance.FishSceneTime;
            this.startDelay = Math.max(0, indexDelay - startDiff);
            //update走鱼线,这里给个延迟而不在外面延迟，为了同一个formation帧同步
            // Laya.timer.once(this.startDelay, this, this.readyGoLine);
            if (this.startDelay > 0) {
                Laya.timer.loop(1e3, this, this.checkStatus);
            } else {
                this.readyGoLine();
            }
            FishData.isInEditer && this.testLabel();
            EventDis.Instance.addEvntListener("leave_room", this, this.destroy);
        });
    }
    testLabel() {
        var label = new Laya.Label();
        label.text = this.fishUniqId.toString();
        label.color = "green";
        label.fontSize = 30;
        this.addChild(label);
    }
    checkStatus() {
        let checkTime = BattleData.Instance.FishSceneTime - this.initTime - this.startDelay;
        if (checkTime > 0) {
            this.curStep = Math.floor(checkTime / this.frameRate);
            this.readyGoLine();
            Laya.timer.clear(this, this.checkStatus);
        }
    }
    readyGoLine() {
        // globalFun.testFish(5)
        // this.loadFishOverBack.run();
        FishData.fishNodesObj[this.fishUniqId] = this;
        SceneManager.Instance.addToLayer(this, GlobalConst.roLayer);
        this.keepOnLine();
        //规避鱼闪烁方向出场
                        Laya.timer.once(this.lineSpeed * 2, this, function() {
            this.visible = true;
        });
    }
    //获取鱼的uniqId
    getFishUniqId() {
        return this.fishUniqId;
    }
    //创建鱼身体动画,如果没有偏移则缓动创建，否则直接创建
    fishShow(isTween) {
        this.body = new Laya.Animation();
        this.addChild(this.body);
        this.startPlay();
        if (isTween) {
            this.scale(.1, .1);
            Laya.Tween.to(this, {
                scaleX: this._showScale,
                scaleY: this._showScale
            }, 400);
        }
        this.addAniToFish();
    }
    /**特殊鱼添加特效 */            
    addAniToFish() {
        if (this.characterType == 22) {
            let ani = GlobalFunc.getAni("hongYunFireBg");
            ani.play(0, true);
            GlobalFunc.globalSetZorder(ani, -10);
            this.addChild(ani);
        } else if (this.characterType == 40 || this.characterType == 50) {
            let configName = this.configInfo.Name;
            let ticketLvl = +configName.split("X")[1];
            let label = new Laya.Label();
            label.font = GlobalConst.fontNum2;
            label.scale(.7, .7);
            label.bottom = -50;
            label.text = `x${ticketLvl}`;
            label.anchorX = label.anchorY = .5;
            this.addChild(label);
            let tmpSkin = "novice/fish10001_bg.png";
            if (this.characterType == 50) {
                tmpSkin = "novice/fish1001_bg.png";
                label.bottom = -30;
            }
            let img_bg = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(tmpSkin));
            img_bg.anchorX = img_bg.anchorY = .5;
            this.addChild(img_bg);
            GlobalFunc.globalSetZorder(img_bg, -10);
            Laya.Tween.to(img_bg, {
                rotation: 5e3
            }, 100 * 1e3);
        } else if (this.type == 3e3) {
            Laya.loader.load(Laya.ResourceVersion.addVersionPrefix("res/atlas2/animation/fish3000_gold.atlas"),new Laya.Handler(this, () => {
                let count = 0;
                let img = new Laya.Image(Laya.ResourceVersion.addVersionPrefix("animation/fish3000_gold/1.png"));
                Laya.timer.frameLoop(10, this, () => {
                    img.skin = `animation/fish3000_gold/${count % 5 + 1}.png`;
                    count++;
                });
                img.centerX = -4;
                img.centerY = -182;
                this.addChild(img);
            }));
        }
    }
    //开始播放鱼动画
    startPlay() {
        this.setInterVal(this.interval);
        if (!this.selfW) {
            var bound = this.body.getBounds();
            this.selfW = bound.width;
            this.selfH = bound.height;
            this.body.pivot(this.selfW / 2, this.selfH / 2);
            this.body.pos(0, 0);
        }
    }
    //设置鱼游动的帧率
    setInterVal(interval) {
        if (!this.body || !this.body.interval || interval == this.body.interval) {
            return;
        }
        this.body.interval = interval;
        this.body.play(this.body.index, true, this.frameName);
        this.interval = interval;
    }
    //走鱼线
    updateFishLine() {
        let isOnShow = Laya.stage.isVisibility;
        if (this.isOnHide && !isOnShow) return;
        !isOnShow && !this.isOnHide && this.fishOnHide();
        this.isOnHide && isOnShow && this.fishOnShow();
        var curStep = this.getLineStep();
        if (!curStep || curStep >= this.pointItem.length) {
            EventDis.Instance.dispatchEvent("fishDead", this.fishUniqId);
            this.deadPos.x = this.x;
            this.deadPos.y = this.y;
            this.destroy();
            return;
        }
        var item = this.pointItem[curStep];
        var pos = {
            x: item[0],
            y: item[1]
        };
        this.transPos(pos);
        // 每更新5次转一次方向，策划说很僵硬，暂时不考虑
        // this.updateNum++ % 5 == 0 && 
            if (!this.isVer) {
            this.getFishDir(pos, this.lastPos);
        } else if (BattleData.Instance.isInFlyWars) {
            this.rotation = -90;
        }
        this.lastPos.x = pos.x;
        this.lastPos.y = pos.y;
        this.pos(pos.x, pos.y);
        this.updateLockP();
    }
    //获取当前鱼的步数
    getLineStep() {
        if (this.body && this.body.index > this.startFrame && this.body.index < this.endFrame) {
            this.curStep += this.shift;
        } else {
            this.curStep++;
        }
        return this.curStep;
    }
    //适配，旋转等转换坐标
    transPos(pos) {
        //先适配
        pos.x = pos.x * GlobalConst.stageW;
        pos.y = (1 - pos.y) * GlobalConst.stageH;
        //偏移
                        pos.x += this.diffX;
        pos.y += this.diffY;
        //旋转
        if (this.rotaAngle != 0) {
            var sin = Math.sin(GlobalFunc.angleToRad(this.rotaAngle));
            var cos = Math.cos(GlobalFunc.angleToRad(this.rotaAngle));
            var x = (pos.x - this._x0) * cos - (pos.y - this._y0) * sin + this._x0;
            var y = (pos.x - this._x0) * sin + (pos.y - this._y0) * cos + this._y0;
            pos.x = x;
            pos.y = y;
        }
        //3 4 号位翻转
                        if (BattleData.Instance.isFlip) {
            pos.y = GlobalConst.stageH - pos.y;
        }
        //垂直翻转鱼线
                        if (this.isSymmetry) {
            pos.y = GlobalConst.stageH - pos.y;
        }
    }
    //计算鱼的方向
    getFishDir(pos, lastPos) {
        if (!this.lastPos) return;
        this.rotation = GlobalFunc.radToangle(Math.atan2(pos.y - lastPos.y, pos.x - lastPos.x));
        if (this.notFlip) {
            if ((this.rotation > 90 || this.rotation < -90) && this.scaleY > 0) {
                this.scaleY = -this.scaleY;
            }
        }
    }
    //切后台鱼线损失的时间补偿
    fishOnShow() {
        this.isOnHide = false;
        var nowTime = GlobalFunc.getClientTime();
        var deltaTime = nowTime - this.hideTime;
        this.curStep = this.curStep + Math.floor(deltaTime / this.frameRate);
        this.keepOnLine();
        this.visible = true;
    }
    fishOnHide() {
        this.isOnHide = true;
        this.hideTime = GlobalFunc.getClientTime();
        this.visible = false;
    }
    //锁定点
    updateLockP() {
        var rad = GlobalFunc.angleToRad(this.rotation);
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        this.isInScreen = false;
        for (var i = 0; i < this.lockPsInside.length; i++) {
            var indexp = this.lockPsInside[i][0];
            var ox = indexp[1] * cos - indexp[2] * sin + this.x;
            var oy = indexp[1] * sin + indexp[2] * cos + this.y;
            !this.isInScreen && ox > 0 && oy > 0 && ox < GlobalConst.stageW && oy < GlobalConst.stageH && (this.isInScreen = true);
            this.lockPsOutside[i] = {
                x: ox,
                y: oy,
                r: Number(indexp[3])
            };
        }
    }
    //获取鱼的锁定点
    getLockP() {
        return this.lockPsOutside;
    }
    //鱼死亡动画
    deadAction(callBack?, seatIndex?) {
        if (!this.body) return;
        this.setInterVal(30);
        // this.body.interval = 360;
                        var attribute = {
            alpha: 0,
            scaleX: .3,
            scaleY: .3,
            rotation: 540
        };
        EventDis.Instance.dispatchEvent("fishDead", this.fishUniqId);
        Laya.timer.once(1200, this, () => {
            this.stopInterval();
        });
        Laya.Tween.to(this, attribute, 1200, laya.utils.Ease.cubicIn, Laya.Handler.create(this, function() {
            //boss死后重生的idx不变，不做删除
            this.removeSelf();
            this.destroy();
        }), 600);
        !!callBack && callBack.run();
    }
    vipHit(serverData) {}
    //击杀鱼
    serverHit(serverData) {
        //播放物品掉落,货币掉落
        if (FishData.isVipBattle) {
            this.vipHit(serverData);
            return;
        }
        var seatIndex = BattleData.Instance.getUserSeatByUid(serverData.uid);
        var isSelf = seatIndex == FishData.mySeatIndex;
        if (isSelf) {
            GameData.Instance.shakeFish++;
            GameData.Instance.shakeFish = GameData.Instance.shakeFish % 10;
            GameData.Instance.shakeFish == 0 && GameData.Instance.shakeTimes < 5 && NetManager.Instance.reqAddYao();
        }
        var dropData = GlobalFunc.transGoldItem(serverData.drops.items);
        //所有可能的掉落
                        var gold, ticket, debris = 0;
        var specialFishInfo = serverData.special_fish_info;
        var playerState = BattleData.roomPlayerData[seatIndex];
        var dropKeyMap = BattleFunc.getDropMapByItems(dropData);
        this.pauseLine();
        this.specialFishData = undefined;
        this.playFishDeadSound(seatIndex);
        if (dropKeyMap) {
            gold = dropKeyMap[GlobalConst.goldKey];
            ticket = dropKeyMap[GlobalConst.ticket];
            debris = dropKeyMap[+GlobalConst.DebrisID];
            if (isSelf && gold) {
                GameData.Instance.isHelping = false;
            }
        }
        if (!!specialFishInfo) {
            if (specialFishInfo.fish_type == SpecialFishType.fish_type_special_hongyun) {
                EventDis.Instance.dispatchEvent(GlobalVar.HONG_YUN_SCORE_UPDATE, {
                    score: specialFishInfo.data.hongyun_total_gold,
                    seat: seatIndex
                });
            } else if (specialFishInfo.fish_type == SpecialFishType.fish_type_special_zuantou) {
                EventDis.Instance.dispatchEvent("update_zuantou_score", {
                    num: specialFishInfo.data.zuantou_fly_gold,
                    seatIndex: seatIndex
                });
            }
        }
        if (!!specialFishInfo && this.characterType >= 20 && this.characterType < 30) {
            //添加特色游戏状态
            // if (playerState.isDragonCannon != -1) {
            //     g_EventDis.dispatchEvent(globalVar.ROOM_CHANGE_DRAGON_CANNON_END, seatIndex);
            // }
            let isfilter = specialFishInfo.fish_type != SpecialFishType.fish_type_special_hongyun && specialFishInfo.fish_type != SpecialFishType.fish_type_special_zuantou;
            if (FishData.mySeatIndex != seatIndex && OnOffManager.isSpceialView && isfilter) {
                UIUtils.showDisplay("SpecialView", this, () => {
                    // let view = new SpecialView_1.SpecialView(this.characterType, seatIndex);
                    // let seat = FishData.seatNodes[seatIndex];
                    // let isNotFlip = FishData.mySeatIndex + seatIndex == 3 || FishData.mySeatIndex + seatIndex == 7;
                    // view.y = !isNotFlip ? -30 : -60;
                    // view.centerX = 0;
                    // view.boxContent.rotation = !isNotFlip ? 180 : 0;
                    // seat.addChild(view);
                });
            }
            let seatNode = FishData.seatNodes[seatIndex];
            seatNode.numPanel.mouseEnabled = false;
            switch (specialFishInfo.fish_type) {
              case SpecialFishType.fish_type_special_hongyun:
                if (!playerState.isHongYun) {
                    // let hongYunNode = new HongYunNode(seatIndex, specialFishInfo.data);
                    // let pos = new Laya.Point(this.x, this.y);
                    // hongYunNode.cannonFlyAni(pos);
                    // seatNode.numPanel.closePaoBeiUI();
                }
                break;

              case SpecialFishType.fish_type_special_hwbz:
                if (seatIndex == FishData.mySeatIndex) {
                    UIUtils.showDisplay("TreasureBoxDialog", this, () => {
                        // let haiWangNode = new TreasureBoxDialog(seatIndex);
                        // SceneManager.Instance.addToMiddLayer(haiWangNode, GlobalConst.dialogLayer);
                    });
                    seatNode.numPanel.closePaoBeiUI();
                } else {
                    //展示游戏中
                }
                break;

              case SpecialFishType.fish_type_special_xyzp:
                if (seatIndex == FishData.mySeatIndex) {
                    UIUtils.showDisplay("DialView", this, () => {
                        // specialFishInfo.data && new DialVIew_1.DialView(specialFishInfo.data);
                        // seatNode.numPanel.closePaoBeiUI();
                    });
                }
                break;

              case SpecialFishType.fish_type_special_zshy:
                if (seatIndex == FishData.mySeatIndex && specialFishInfo.data) {
                    // UIUtils.showDisplay("PearlDialog", this, () => {
                    //     new PearlDialog(specialFishInfo.data);
                    // });
                    seatNode.numPanel.closePaoBeiUI();
                }
                break;

              case SpecialFishType.fish_type_special_zuantou:
                !playerState.isBitting && EventDis.Instance.dispatchEvent("bit_play_begin", {
                    pos: {
                        x: this.x,
                        y: this.y
                    },
                    seatIndex: seatIndex
                });
                break;

              case SpecialFishType.fish_type_special_wlxb:
                if (seatIndex == FishData.mySeatIndex && specialFishInfo.data) {
                    this.specialFishData = specialFishInfo.data;
                    seatNode.numPanel.closePaoBeiUI();
                }

              default:
                break;
            }
            //震屏
            GlobalUI.shockScreenEff();
        } else if (this.configInfo.tray > 0 && this.configInfo.tray != 2) {
            var data = {
                fishData: {
                    fishID: this.type,
                    goldNum: gold,
                    tray: this.configInfo.tray,
                    fishInfo: this.configInfo
                },
                seatIndex: seatIndex
            };
            EventDis.Instance.dispatchEvent(GlobalVar.PLAY_ROOM_TRAY_ANI, data);
            //震屏
            GlobalUI.shockScreenEff();
        }
        this.beginDead = true;
        if (!!!specialFishInfo || specialFishInfo.fish_type != SpecialFishType.fish_type_special_wlxb) {
            this.deadAction();
        } else if (!!specialFishInfo && specialFishInfo.fish_type == SpecialFishType.fish_type_special_wlxb) {
            this.deadAction(undefined, seatIndex);
        }
        let seatInfo = FishData.seatNodes[seatIndex].seatInfoNode;
        //金币到房间限制,调转到下个房间,先注掉
        GlobalUI.setFishNum(isSelf, gold, this.x, this.y);
        //资源变化
        BattleFunc.resChangeFunc(seatIndex, serverData);
        if (isSelf) {
            let gun = BattleData.Instance.roomData[BattleData.Instance.room_type].Guns[0];
            if (serverData.gold >= +gun) {
                EventDis.Instance.dispatchEvent("endHelping");
            }
        }
        //飞金币或者银币,自己金币，别人银币
        let startPoint = new Laya.Point(this.x, this.y);
        let endPoint = PlayerData.Instance.getItemFlyPos(GlobalConst.itemFlyRoomCoin, seatIndex);
        //new Laya.Point(seatInfo.x, seatInfo.y);
        if (gold && gold > 0 && this.isNotLeaving) {
            if (OnOffManager.isTomorrom && isSelf && GameData.tomrrowState == 0) {
                GameData.Instance.tomrrowGold >= 0 && (GameData.Instance.tomrrowGold -= gold);
                if (GameData.Instance.tomrrowGold <= 0 && !GameData.Instance.tomrrowFlag) {
                    GameData.Instance.tomrrowFlag = true;
                    NetManager.Instance.reqSetMing();
                }
            }
            //金币增加
            let aniName = isSelf ? "goldCoinAni" : "sliverCoinAni";
            Laya.timer.once(600, this, () => {
                let param = {
                    characterType: this.characterType,
                    startPoint: startPoint,
                    endPoint: endPoint,
                    aniName: aniName,
                    seat: seatInfo,
                    isCommon: false
                };
                GlobalFunc.doItemFlyAni(param);
            });
        }
        //黄金鱼爆炸效果
                        if ((this.characterType == 10 || this.characterType == 30 || this.characterType == 40) && this.isNotLeaving) {
            Laya.timer.once(600, this, () => {
                var sp = GlobalFunc.getGoldFishBoomEffect(new Laya.Point(this.x, this.y), 1.8, isSelf);
                SceneManager.Instance.addToLayer(sp, GlobalConst.effectTopLayer);
            });
        }
        if (ticket && this.isNotLeaving) {
            let param = {
                itemId: +GlobalConst.TicketID,
                itemNum: ticket,
                flyPos: GlobalConst.itemFlyRoomTicket,
                seatIndex: seatIndex,
                startPos: startPoint
            };
            Laya.timer.once(600, this, function() {
                GlobalFunc.roomItemsFlyAni(param);
            });
            if (OnOffManager.isTicketTipsOn && isSelf) {
                if (PlayerData.Instance.getItemNum(GlobalConst.TicketID) > 1e3) {
                    OnOffManager.isTicketTipsOn = false;
                } else {
                    EventDis.Instance.dispatchEvent(GlobalVar.SHOW_TICKET_TIPS, ticket);
                }
            }
        }
        if (debris && this.isNotLeaving) {
            let param = {
                itemId: +GlobalConst.DebrisID,
                itemNum: debris,
                flyPos: GlobalConst.itemFlyCannon,
                seatIndex: seatIndex,
                startPos: startPoint
            };
            Laya.timer.once(600, this, function() {
                GlobalFunc.roomItemsFlyAni(param);
            });
        }
        //导弹掉落
                        for (let d in dropData) {
            let id = dropData[d].item_id;
            if (id == 11 || id == 12 || id == 13 || id == 14) {
                let pos = GlobalFunc.changeLockP(this);
                let daodanNum = dropData[d].count || dropData[d].item_count;
                GlobalUI.dropDaoDanEff(id, daodanNum, seatIndex, pos.x, pos.y);
                if (isSelf) {
                    PlayerData.Instance.addItemNum(id, daodanNum);
                    EventDis.Instance.dispatchEvent("add_daodan_num");
                }
                break;
            }
        }
        //鱼死亡效果
                }
    flyWarsHit(serverData) {
        var seatIndex = BattleData.Instance.getUserSeatByUid(serverData.uid);
        var isSelf = seatIndex == FishData.mySeatIndex;
        var dropData = GlobalFunc.transGoldItem(serverData.drops.items);
        this.pauseLine();
        this.playFishDeadSound(seatIndex);
        this.beginDead = true;
        this.deadAction();
        BattleFunc.resChangeFunc(seatIndex, serverData);
        EventDis.Instance.dispatchEvent("fish_dead_resChange");
        //黄金鱼爆炸效果
                        if ((this.characterType == 10 || this.characterType == 30 || this.characterType == 40) && this.isNotLeaving) {
            var sp = GlobalFunc.getGoldFishBoomEffect(new Laya.Point(this.x, this.y), 1.8, isSelf);
            SceneManager.Instance.addToLayer(sp, GlobalConst.effectTopLayer);
        }
        let goldArr = dropData.filter(data => data.item_id == GlobalConst.GoldCoinID);
        let gold = 0;
        if (goldArr[0]) {
            gold = goldArr[0].count;
        }
        let ticketArr = dropData.filter(data => data.item_id == GlobalConst.TicketID);
        let ticket = 0;
        if (ticketArr[0]) {
            ticket = ticketArr[0].count;
        }
        let startPoint = new Laya.Point(this.x, this.y);
        let endPoint = PlayerData.Instance.getItemFlyPos(GlobalConst.itemFlyFlyGold, seatIndex);
        let aniName = "goldCoinAni";
        if (gold) {
            GlobalUI.setFishNum(true, gold, this.x, this.y, -90);
            let param = {
                characterType: this.characterType,
                startPoint: startPoint,
                endPoint: endPoint,
                aniName: aniName,
                seat: null,
                isCommon: false
            };
            Laya.timer.once(600, this, function() {
                GlobalFunc.doItemFlyAni(param);
            });
        }
        if (ticket) {
            Laya.timer.once(200, this, () => {
                GlobalUI.shockScreenFlyEff();
            });
            let param = {
                itemId: +GlobalConst.TicketID,
                itemNum: ticket,
                flyPos: GlobalConst.itemFlyFlyTicket,
                seatIndex: seatIndex,
                startPos: startPoint
            };
            Laya.timer.once(600, this, function() {
                GlobalFunc.roomItemsFlyAni(param);
            });
            if (OnOffManager.isTicketTipsOn && isSelf) {
                if (PlayerData.Instance.getItemNum(GlobalConst.TicketID) > 1e3) {
                    OnOffManager.isTicketTipsOn = false;
                } else {
                    EventDis.Instance.dispatchEvent(GlobalVar.SHOW_TICKET_TIPS, ticket);
                }
            }
        }
        if (this.configInfo.tray > 0) {
            Laya.timer.once(200, this, () => {
                GlobalUI.shockScreenFlyEff();
            });
            UIUtils.showDisplay("FishTray", this, () => {
                // let fishTray = new FishTray(FishData.mySeatIndex, true);
                // Laya.timer.once(1400, this, () => {
                //     let pos = GlobalFunc.changeLockP(this);
                //     fishTray.initInFlyWar(pos);
                //     let fishData = {
                //         fishID: this.type,
                //         goldNum: gold,
                //         tray: this.configInfo.tray,
                //         fishInfo: BattleData.fishData[this.type],
                //         fish_type: this.characterType
                //     };
                //     fishTray.startPlayAni(fishData);
                //     SceneM.addToLayer(fishTray, GlobalConst.effectTopLayer);
                // });
            });
        }
    }
    //鱼被击中,闪红
    onCaught(isSelf) {
        if (isSelf) {
            this.body && !this.body.destroyed && this.redFilterEffect();
        }
    }
    onTouchFish() {
        EventDis.Instance.dispatchEvent("fishClick", this);
    }
    //鱼被点击
    isClickInSelf(pos) {}
    //暂停鱼线
    pauseLine() {
        Laya.timer.clear(this, this.updateFishLine);
        this.stopInterval();
    }
    //恢复鱼线
    resumeLine() {
        this.resumeInterval();
        this.keepOnLine();
    }
    //继续走鱼线
    keepOnLine() {
        let isOnShow = Laya.stage.isVisibility;
        if (!isOnShow) this.fishOnHide();
        this.updateFishLine();
        Laya.timer.loop(this.lineSpeed, this, this.updateFishLine);
    }
    //停帧
    stopInterval() {
        this.setTmpInterval(1e6);
    }
    //恢复帧
    resumeInterval() {
        this.setInterVal(this.interval);
    }
    setTmpInterval(interval) {
        if (!this.body || !this.body.interval || interval == this.body.interval) return;
        this.body.interval = interval;
        this.body.play(this.body.index, true, this.frameName);
    }
    // fishUpdateFunc(lockNode: LockView, fish: FishNode, scene: FishScene) {
    //     if (!FishData.isLocking) {
    //         Laya.timer.clear(fish, fish.fishUpdateFunc);
    //         return;
    //     }
    //     if (fish.isInScreen && !fish.beginDead) {
    //         let pos = globalFun.changeLockP(fish);
    //         lockNode.pos(pos.x, pos.y);
    //     } else {
    //         Laya.timer.clear(fish, fish.fishUpdateFunc);
    //     }
    // }
    //判断鱼是否被击中
    isPointInSelf(pos) {
        let isIn = 0;
        isIn = !!this.body && !this.body.destroyed ? +this.body.hitTestPoint(pos.x, pos.y) : 0;
        let dis = 0;
        dis = isIn > 0 ? GlobalFunc.pGetDistance(this, pos) : 0;
        return [ isIn, dis ];
    }
    redFilterEffect() {
        !this.filterTrans && (this.filterTrans = new TransformFilter(this));
        this.filterTrans.doFilter();
    }
    playFishDeadSound(seatIndex) {
        if (seatIndex != FishData.mySeatIndex) return;
        let soundRandom = Math.floor(Math.random() * 2);
        let isPlay = Math.random() > .8 ? true : false;
        if (soundRandom == 2) soundRandom = 0;
        isPlay && SoundManager.Instance.playSound(GlobalConst["Sud_fishDead_" + soundRandom], 1);
        isPlay && SoundManager.Instance.playSound(GlobalConst.Sud_fishDead_1, 1);
    }
}