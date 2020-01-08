import { EventDis } from "../Helpers/EventDis";
import GlobalConst from "../const/GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { SceneManager } from "../common/SceneManager";
import { BattleData } from "../datas/BattleData";
import { PlayerData } from "../datas/PlayerData";
import { GameData } from "../datas/GameData";

export enum Bullet_Skin{
    BULLET_1 = 1,
    BULLET_2 = 2,
    BULLET_3 = 3,
    BULLET_4 = 4,
    BULLET_5 = 5,
    BULLET_6 = 6,
    BULLET_7 = 7,
    BULLET_8 = 8,
    HONGYUN = 10
}

export class BulletNode extends Laya.Sprite {
    isCaught: boolean;
    lockFishId: number;
    _x1: number;
    _x2: any;
    _y1: number;
    _y2: any;
    _hitFlag: number;
    _speed: number;
    type: number;
    body: any;
    initAngle: any;
    specialName: any;
    seatIndex: any;
    bullet_id: any;
    bulletIndex: any;
    constructor() {
        super();
        this.isCaught = false;
        this.lockFishId = 0;
        this._x1 = 0;
        this._x2 = GlobalConst.stageW;
        this._y1 = 0;
        this._y2 = GlobalConst.stageH;
        this._hitFlag = 0;
        //记录与哪一边碰撞
        this._speed = 1e3;
        //子弹速度
        this.type = 1;
        //子弹类型
        }
    destroy() {
        EventDis.Instance.dispatchEvent("bulletBoom", this.bulletIndex);
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        this.body = null;
        this.destroyChildren();
        this.removeSelf();
    }
    
    initBullet(param) {
        this.bulletIndex = param.bulletIndex;
        this.initAngle = param.angle;
        this.rotation = 90 - this.initAngle;
        this.specialName = param.sprcialButtle;
        this.seatIndex = param.seatIndex;
        this.bullet_id = param.bullet_id;
        this.body = this.addChild(new Laya.Sprite());
        let bulletSkin = this.setSkin();
        var sp1 = new Laya.Sprite();
        this.addChild(sp1);
        sp1.loadImage(Laya.ResourceVersion.addVersionPrefix(bulletSkin), new Laya.Handler(this, () => {
            sp1.blendMode = "lighter";
            var bound = sp1.getBounds();
            sp1.pivotY = bound.height * .5;
            sp1.pivotX = bound.width * .5;
            sp1.pos(0, 0);
        }));
    }
    setSkin() {
        let roomPlayerInfo = BattleData.Instance.getSitInfo(this.seatIndex);
        this.type = roomPlayerInfo.cur_pao_item;
        if (BattleData.isInFlyWars) {
            this.type = PlayerData.Instance.equipBoat;
        }
        // let turret = Math.floor(skin / 1000);
        // let cannon = skin - turret * 1000;
        // this.type = cannon;
        if (roomPlayerInfo.isHongYun) {
            this.type = Bullet_Skin.HONGYUN;
        } else if (roomPlayerInfo.isDragonCannon != -1) {
            this.type = roomPlayerInfo.isDragonCannon;
        }
        if (GameData.Instance.isFirstLogin) {
            var bulletSkin = "novice/img_zid_0.png";
        } else {
            bulletSkin = this.type == Bullet_Skin.HONGYUN ? "bullets/img_zid_9.png" : "bullets/img_zid_" + this.type + ".png";
        }
        if (!!this.specialName) {
            bulletSkin = "bullets/" + this.specialName + ".png";
        }
        return bulletSkin;
    }
    shootTo(angle) {
        let flyAngle = angle || this.initAngle;
        if (flyAngle > 180) flyAngle = flyAngle - 360; else if (flyAngle < -180) flyAngle = flyAngle + 360;
        this.goFly({
            x: this.x,
            y: this.y
        }, -GlobalFunc.angleToRad(flyAngle));
    }
    goFly(lastPos, rad) {
        var data = this.getNextPos(lastPos, rad);
        if (!data) return;
        var nextRad = this.getNextRad(rad);
        this.rotation = 90 + data.angle;
        Laya.Tween.to(this, {
            x: data.x,
            y: data.y
        }, data.time, null, Laya.Handler.create(this, this.goFly, [ data, nextRad ]));
    }
    //获取下一个碰撞点
    getNextPos(lastPos, rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        var data = {x:0,y:0,time:0,angle:0};
        var angle = GlobalFunc.radToangle(rad);
        var bool1 = rad > -Math.PI / 2 && rad < Math.PI / 2;
        var bool2 = rad > 0;
        var tns = rad > 0 && rad < Math.PI / 2 || rad > -Math.PI && rad < -Math.PI / 2 ? -1 : 1;
        var d1 = Math.abs((lastPos.x - this._x1) / cos);
        var d2 = Math.abs((this._x2 - lastPos.x) / cos);
        var d3 = Math.abs((lastPos.y - this._y1) / sin);
        var d4 = Math.abs((this._y2 - lastPos.y) / sin);
        var p1 = {
            x: this._x1,
            y: lastPos.y + tns * Math.abs(d1 * sin)
        };
        //左边交点
        var p2 = {
            x: this._x2,
            y: lastPos.y - tns * Math.abs(d2 * sin)
        };
        //右边交点
        var p3 = {
            x: lastPos.x + tns * Math.abs(d3 * cos),
            y: this._y1
        };
        //上边交点
        var p4 = {
            x: lastPos.x - tns * Math.abs(d4 * cos),
            y: this._y2
        };
        //下边交点
        var distance;
        if (p1.y < this._y2 && p1.y > this._y1 && !bool1) {
            data.x = p1.x;
            data.y = p1.y;
            distance = d1;
            this._hitFlag = 1;
        } else if (p2.y < this._y2 && p2.y > this._y1 && bool1) {
            data.x = p2.x;
            data.y = p2.y;
            distance = d2;
            this._hitFlag = 2;
        } else if (p3.x < this._x2 && p3.x > this._x1 && !bool2) {
            data.x = p3.x;
            data.y = p3.y;
            distance = d3;
            this._hitFlag = 3;
        } else if (p4.x < this._x2 && p4.x > this._x1 && bool2) {
            data.x = p4.x;
            data.y = p4.y;
            distance = d4;
            this._hitFlag = 4;
        } else {
            GlobalFunc.log("子弹路径异常！！！");
            this.destroy();
            return;
        }
        data.time = distance / this._speed * 1e3;
        data.angle = angle;
        return data;
    }
    //碰撞后的反射角
    getNextRad(rad) {
        if (this._hitFlag == 1 || this._hitFlag == 2) {
            return rad > 0 ? Math.PI - rad : -Math.PI - rad;
        }
        return -rad;
    }
    showNet(fish) {
        let index = this.getNetworkIndex();
        let x = !!fish ? GlobalFunc.changeLockP(fish).x : this.x;
        let y = !!fish ? GlobalFunc.changeLockP(fish).y : this.y;
        this.destroy();
        if (this.type == Bullet_Skin.HONGYUN) {
            //鸿运
            GlobalFunc.addGlobalAni(x, y, GlobalConst.honyunAniName, 1, this.rotation);
        } else {
            // globalFun.addGlobalAni(x, y, GlobalConst.netAniName);
            let netAni = Laya.Pool.getItemByClass("net_ani", netsAni);
            netAni.initNetSkin(this.type, this.seatIndex);
            netAni.pos(x, y);
            SceneManager.Instance.addToLayer(netAni, GlobalConst.bulletLayer);
        }
    }
    getNetworkIndex() {
        let index = 1;
        //  index = (FishData.mySeatNode.skin % 10) - 1;
        return index;
    }
    killFish() {}
}

export class netsAni /*extends layaMaxUI_1.ui.battle.netAniUI*/ {
    img_net: any;
    constructor() {
        //super();
    }
    initNetSkin(type, seatIndex) {
        let roomPlayerInfo = BattleData.Instance.getSitInfo(seatIndex);
        let skin = "novice/net0.png";
        if (GameData.Instance.isFirstLogin) skin = "novice/net0.png"; else if (roomPlayerInfo.isDragonCannon != -1) {
            switch (type) {
              case 4:
                skin = "nets/img_net" + 8 + ".png";
                break;

              case 5:
                skin = "nets/img_net" + 5 + ".png";
                break;

              case 6:
                skin = "nets/img_net" + 10 + ".png";
                break;
            }
        } else if (BattleData.isInFlyWars) {
            if (type == "200") skin = "nets/img_net1.png"; else if (type == "201") skin = "nets/img_net3.png"; else if (type == "202") skin = "nets/img_net6.png"; else if (type == "203") skin = "nets/img_net10.png";
        } else {
            skin = "nets/img_net" + type % 100 + ".png";
        }
        this.img_net.skin = skin;
        // this.ani1.play(0, false);
        // this.ani1.blendMode = "lighter";
        // this.ani1.on(Laya.Event.COMPLETE, this, this.destroy);
    }
}