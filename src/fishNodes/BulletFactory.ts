import GlobalConst from "../const/GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import { FishData } from "../datas/FishData";
import { BattleData } from "../datas/BattleData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalVar from "../const/GlobalVar";
import { NetManager } from "../netWork/NetManager";
import { BattleFunc } from "../GlobalFuncs/BattleFunc";
import { PlayerData } from "../datas/PlayerData";
import { SceneManager } from "../common/SceneManager";
import { GameData } from "../datas/GameData";
import { BulletNode } from "./BulletNode";
import { TrackBulletNode } from "./TrackBulletNode";

export enum BulletType{
    bullet_type_normal = 0,
    bullet_type_zuantou = 1,
    bullet_type_hongyuan = 2,
    bullet_type_missile = 3,
    bullet_type_qinglongpao = 4,
    bullet_type_yinlongpao = 5,
    bullet_type_jinlongpao = 6,
    bullet_type_daoDan = 10
}
export class BulletFactory{
    bulletNodes: any[];
    isPlayPochan: boolean;
    bulletQueue: any;
    bulletSCnt: number;
    bulletIndex: number;
    bulletNum: number;
    canFireInterval: boolean;
    isAutoFire: boolean;
    constructor() {
        this.bulletNodes = [];
        this.isPlayPochan = false;
        this.initBullets();
        this.initEvent();
        Laya.timer.loop(GlobalConst.autoShootInterval, this, this.updateAutoFire);
    }
    destroy() {
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        this.bulletNodes = null;
        this.bulletQueue = null;
    }
    initBullets() {
        this.bulletSCnt = 0;
        this.bulletIndex = 0;
        this.bulletNum = 0;
        this.bulletNodes = [];
        this.bulletQueue = [];
        this.canFireInterval = true;
        this.initOthersBullet();
    }
    initEvent() {
        EventDis.Instance.addEvntListener("bulletBoom", this, this.bulletBoom);
        EventDis.Instance.addEvntListener("shoot_notice_broadCast", this, this.recShootMsg);
    }
    updateAutoFire() {
        if (this.needStopCommonShoot()) return;
        var roomData = BattleData.Instance.roomPlayerData[FishData.mySeatIndex];
        if (!roomData) {
            GlobalFunc.log("没有座位数据");
            return;
        }
        this.isAutoFire = FishData.isAutoButtonOn && !this.isSpecialFish(true) || FishData.isTouching && !this.isSpecialFish(false);
        let ishy = roomData.isHongYun;
        if (!this.isAutoFire || FishData.isInDaoDan && !ishy) return;
        //开炮金币是否足够
                        if (!this.enoughtGoldToFire(true)) {
            FishData.isAutoButtonOn && EventDis.Instance.dispatchEvent(GlobalVar.CHANGE_AUTO_PAO_STATE);
            return;
        }
        if (!FishData.isDragonCannonOn) {
            let isVip = GlobalFunc.checkVipToFire();
            if (!isVip) return;
        }
        this.canFireInterval = false;
        Laya.timer.once(GlobalConst.autoShootInterval - 100, this, function() {
            this.canFireInterval = true;
        });
        var myCannon = FishData.mySeatNode.cannonNode;
        var bullet_id = this.getBulletId();
        var bullet_type = this.getBulletType();
        var data = {
            bullet_id: bullet_id,
            bullet_type: bullet_type,
            rotation_angle: myCannon.gCannonAngle
        };
        NetManager.Instance.reqShoot(data);
        var param = {
            rotation_angle: myCannon.gCannonAngle,
            fishUniqId: 0,
            bullet_type: bullet_type,
            bullet_id: bullet_id
        };
        this.readyShoot(param);
    }
    /**是否在特色鱼期间且不能开炮 */            
    isSpecialFish(isAuto) {
        let playerInfo = BattleData.roomPlayerData[FishData.mySeatIndex];
        if (playerInfo.isHwbz || playerInfo.isDial || playerInfo.isZshy || playerInfo.isWlxb || this.hyTimeCanFire(playerInfo, isAuto)) {
            return true;
        }
        return false;
    }
    /**鸿运当头期间是否可以开炮 */            
    hyTimeCanFire(playerInfo, isAuto) {
        if (playerInfo.isHongYun && FishData.hyCanFire && isAuto) return true;
        return false;
    }
    //鼠标触发，需要鼠标目标
    mouseFire(angle) {
        if (!this.canFireInterval || this.isBulletReachMax()) return;
        this.canFireInterval = false;
        Laya.timer.once(GlobalConst.autoShootInterval, this, () => {
            this.canFireInterval = true;
        });
        var bullet_type = this.getBulletType();
        var bullet_id = this.getBulletId();
        var data = {
            bullet_id: bullet_id,
            bullet_type: bullet_type,
            rotation_angle: angle
        };
        NetManager.Instance.reqShoot(data);
        GlobalFunc.log("rotation_angle：" + angle);
        var param = {
            rotation_angle: angle,
            fishUniqId: 0,
            bullet_type: bullet_type,
            bullet_id: bullet_id
        };
        this.readyShoot(param);
    }
    getBulletType() {
        var playerInfo = BattleData.roomPlayerData[FishData.mySeatIndex];
        if (playerInfo.isHongYun) {
            return BulletType.bullet_type_hongyuan;
        } else if (playerInfo.isDragonCannon != -1) {
            return playerInfo.isDragonCannon;
        } else {
            return BulletType.bullet_type_normal;
        }
    }
    initOthersBullet() {
        for (var i = 1; i <= 4; i++) {
            if (i == FishData.mySeatIndex) continue;
            this.bulletQueue[i] = new Array();
        }
        Laya.timer.loop(GlobalConst.autoShootInterval, this, this.othersShoot);
    }
    //每隔200毫秒从别人的子弹队列取子弹发射(如果有)
    othersShoot() {
        for (var index = 1; index <= 4; index++) {
            var bulletQ = this.bulletQueue[index];
            if (!bulletQ || bulletQ.length == 0) continue;
            var data = bulletQ[0];
            if (!data) continue;
            this.commonShoot(data);
            this.bulletQueue[index].pop();
        }
    }
    /**收到后端子弹广播，并将普通子弹存入队列*/            
    recShootMsg(data) {
        var bullet_type = data.bullet_type;
        //钻头
        if (bullet_type == BulletType.bullet_type_zuantou) {
            EventDis.Instance.dispatchEvent("bitBackNotice", data);
            return;
        }
        //切后台了停止存队列
        let isOnShow = Laya.stage.isVisibility;
        if (!isOnShow) return;
        var seatIndex = BattleData.Instance.getUserSeatByUid(data.uid);
        if (!seatIndex) return;
        //资源变化
        BattleFunc.resChangeFunc(seatIndex, data);
        if (seatIndex == FishData.mySeatIndex) return;
        //普通子弹和鸿运进队列,鸿运同普通子弹逻辑
                        if ((bullet_type == 0 || bullet_type == 2 || bullet_type >= 4 && bullet_type <= 6) && seatIndex != FishData.mySeatIndex && this.bulletQueue[seatIndex]) {
            //后端数据要转为前端数据
            this.bulletQueue[seatIndex].unshift({
                uid: data.uid,
                fishUniqId: data.fish_id,
                bullet_type: data.bullet_type,
                bullet_id: data.bullet_id,
                nowgold: data.gold,
                rotation_angle: data.rotation_angle,
                diamond: data.diamond
            });
            //取子弹的计时器不知道为什么不工作了，原因没找到，先应付一下
            //todo: 找出计时器不工作的原因
            if (this.bulletQueue[seatIndex].length > 50) {
                GlobalFunc.log("别人子弹队列异常，进行重置", seatIndex);
                Laya.timer.loop(GlobalConst.autoShootInterval, this, this.othersShoot);
            }
        }
        //别人使用锁定弹，不存队列
        //别人使用锁定弹，不存队列
                        data.fishUniqId && this.commonShoot(data);
    }
    /**自己发射子弹，不需要等待后端返回*/            readyShoot(param) {
        let roomPlayerInfo = BattleData.Instance.getSitInfo(FishData.mySeatIndex);
        var gold = roomPlayerInfo.gold;
        var costGold = roomPlayerInfo.cur_pao;
        if (roomPlayerInfo.isHongYun || roomPlayerInfo.isDragonCannon != -1) {
            costGold = 0;
        }
        param.seat = FishData.mySeatIndex;
        param.nowgold = gold - +costGold;
        this.commonShoot(param);
    }
    /**通用发射子弹,前端发射假子弹,纯前端动作和服务端协议无关*/            commonShoot(param) {
        var fishUniqId = param.fishUniqId || 0;
        var seatIndex = param.seat || BattleData.Instance.getUserSeatByUid(param.uid);
        var seatNode = FishData.seatNodes[seatIndex];
        var bullet_type = param.bullet_type;
        var bullet_id = param.bullet_id;
        if (!seatNode) return;
        var cannon = seatNode.cannonNode;
        if (!cannon) return;
        // shoot导致的金币资源变化
        if (seatIndex == FishData.mySeatIndex) {
            PlayerData.Instance.setItemNum(GlobalConst.GoldCoinID, param.nowgold);
        }
        if (bullet_type != BulletType.bullet_type_hongyuan) {
            BattleData.Instance.setSitPlayerInfoByObj(seatIndex, {
                gold: param.nowgold
            },null);
            param.diamond && BattleData.Instance.setSitPlayerInfoByObj(seatIndex, {
                diamond: param.diamond
            },null);
        }
        let seat = FishData.seatNodes[seatIndex].seatInfoNode;
        if (!seat || !seat.roomPlayerInfo) return;
        seat.roomPlayerInfo.gold = BattleData.roomPlayerData[seatIndex].gold;
        seat.roomPlayerInfo.ticket = BattleData.roomPlayerData[seatIndex].ticket;
        seat.updateGold();
        var angle = param.rotation_angle;
        var ratio1 = FishData.seatNodes[seatIndex].isSeatFlip ? 1 : -1;
        var ptFrom = new Laya.Point(cannon.x, cannon.y + ratio1 * 30);
        //锁定发射锁定发射
                        if (fishUniqId > 0) {
            var fish = FishData.fishNodesObj[fishUniqId];
            angle = GlobalFunc.vecToAngle(ptFrom, GlobalFunc.changeLockP(fish));
        }
        var params = {
            angle: angle,
            ptFrom: ptFrom,
            bullet_type: bullet_type,
            bullet_id: bullet_id,
            seatIndex: seatIndex,
            fishUniqId: fishUniqId,
            shootType: 1
        };
        //创建子弹
        var shootType = 1;
        var rad = GlobalFunc.angleToRad(angle);
        var hasFlip = FishData.seatNodes[seatIndex].isSeatFlip;
        var ratio2 = hasFlip ? 1 : -1;
        //115:偏移发射点计算直径
        var ptFrom1 = GlobalFunc.pAddPos(ptFrom, {
            x: 115 * Math.cos(rad),
            y: ratio2 * 115 * Math.sin(rad)
        });
        var bulletIndex = this.getBulletIndex();
        var bltAngle = angle;
        if (hasFlip) {
            bltAngle = -(angle + 180) % 180;
        }
        //创建普通子弹没有目标，锁定弹有目标鱼
        //锁定弹分：普通锁定，鸿运
                        var data = {
            bullet_type: bullet_type,
            bullet_id: bullet_id,
            seatIndex: seatIndex,
            fishUniqId: fishUniqId,
            bulletIndex: bulletIndex,
            angle: bltAngle
        };
        if (!fishUniqId || fishUniqId == 0) {
            var bullet = Laya.Pool.getItemByClass("bullet", BulletNode);
            bullet.initBullet(data);
            bullet.pos(ptFrom1.x, ptFrom1.y);
            bullet.shootTo();
        } else {
            var bullet = Laya.Pool.getItemByClass("trackBullet", TrackBulletNode);
            bullet.lockFishId = fishUniqId;
            bullet.pos(ptFrom1.x, ptFrom1.y);
            bullet.specialName = shootType == 2 ? "hongyun1" : "";
            bullet.initBullet(data);
            bullet.doTrackFire(GlobalFunc.getFishById(fishUniqId));
        }
        SceneManager.Instance.addToLayer(bullet, GlobalConst.bulletLayer, ptFrom1.x, ptFrom1.y);
        if (!this.bulletNodes) return;
        this.bulletNodes[bulletIndex] = bullet;
        this.bulletNum++;
        var seatNode = FishData.seatNodes[seatIndex];
        if (!seatNode) return;
        var cannon = seatNode.cannonNode;
        if (!cannon) return;
        seatIndex != FishData.mySeatIndex && cannon.justRotate(angle);
        cannon.justFire(bullet_type);
    }
    isBulletReachMax() {
        let isMax = this.getBulletNum() >= GlobalConst.maxBulletNum;
        let isSelfMax = this.bulletNodes.filter(node => node.seatIndex == FishData.mySeatIndex).length >= 20;
        if (isSelfMax) {
            GlobalFunc.globalTip("当前发射子弹过多,请耐心等待");
        } else if (isMax) {
            GlobalFunc.globalTip("当前发射子弹过多,请耐心等待");
        }
        return isMax || isSelfMax;
    }
    getBulletNum() {
        var num = 0;
        this.bulletNodes.forEach(element => {
            num++;
        });
        return num;
    }
    //生成子弹
    getBulletId() {
        return FishData.mySeatIndex * 1e4 + this.bulletSCnt++;
    }
    getBulletIndex() {
        return this.bulletIndex++;
    }
    //钻头时间，锁定时间，开炮间隔，子弹上限
    needStopCommonShoot() {
        return FishData.isSelfHyTime && !FishData.hyCanFire || FishData.isSelfBitTime || !this.canFireInterval || this.isBulletReachMax();
    }
    bulletBoom(bulletIndex) {
        this.bulletNum--;
        if (this.bulletNodes) {
            delete this.bulletNodes[bulletIndex];
        }
    }
    /**开炮金币是否足够（自己） */            enoughtGoldToFire(isShowShop = false) {
        let index = FishData.mySeatIndex;
        let sitInfo = BattleData.Instance.getSitInfo(index);
        let seat = FishData.mySeatNode;
        if (!sitInfo) return false;
        let myGold = PlayerData.Instance.getItemNum(GlobalConst.GoldCoinID);
        let roomData = BattleData.Instance.roomData[BattleData.Instance.room_type].Guns;
        let nowIndex = roomData.indexOf(sitInfo.cur_pao + "");
        if (myGold >= sitInfo.cur_pao || sitInfo.isDragonCannon != -1) {
            return true;
        } else {
            for (let i = 0; i < nowIndex; i++) {
                if (myGold >= +roomData[nowIndex - i - 1]) {
                    seat.numPanel.changePaoBei(-i - 1);
                    return false;
                }
            }
            let isNoBullet = !GameData.Instance.isHelping && this.bulletNodes.filter(node => node.seatIndex == index).length == 0;
            if (isNoBullet && !this.isPlayPochan) {
                FishData.isTouching = false;
                FishData.stopPop = false;
                this.isPlayPochan = true;
                FishData.mySeatNode.numPanel.playPochanAni();
                Laya.timer.once(500, this, function() {
                    this.isPlayPochan = false;
                    BattleFunc.checkFishPop();
                });
            }
            return false;
        }
    }
}