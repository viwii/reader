import GlobalConst from "../const/GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { TimeLineManager } from "../const/TimeLineManager";
import { SceneManager } from "../common/SceneManager";

/**
 * 钻头子弹类
 */        
export class BitBulletNode extends Laya.Sprite {
    preName: string;
    _x1: number;
    _x2: number;
    _y1: number;
    _y2: number;
    _hitFlag: number;
    _speed1: number;
    _speed2: number;
    _stateTime1: number;
    _stateTime2: number;
    _flyTimeSum: number;
    _flyState: number;
    trailImgs: any[];
    redBitTimeLine: any;
    body: any;
    bullet_id: any;
    type: string;
    frameName: any;
    bulletIndex: any;
    initAngle: any;
    seatIndex: any;
    flyFireAni: any;
    constructor() {
        super();
        this.preName = "bullets";
        this._x1 = 0;
        this._x2 = GlobalConst.stageW;
        this._y1 = 0;
        this._y2 = GlobalConst.stageH;
        this._hitFlag = 0;
        //记录与哪一边碰撞
        this._speed1 = 1500;
        //第一阶段速度
        this._speed2 = 900;
        //第二阶段速度
        this._stateTime1 = 5e3;
        //第一阶段时间
        this._stateTime2 = 3e3;
        //第二阶段时间
        this._flyTimeSum = 0;
        //飞行时间
        this._flyState = 1;
        //飞行阶段，1和2
        this.trailImgs = [];
        //拖尾2d
    }
    destroy() {
        !!this.redBitTimeLine && this.redBitTimeLine.reset();
        this.clearTrail();
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        this.body = null;
        // if (this._isHD) {
        //     this._bitHit = null;
        //     this._bitTrailing = null;
        // }
        this.destroyChildren();
        this.removeSelf();
    }
    getbulletId() {
        return this.bullet_id;
    }
    getFlyState() {
        return this._flyState;
    }
    initEvent() {}
    //初始化钻头
    initBitBullet(param) {
        this.type = "10001";
        this.frameName = this.preName + this.type;
        this.bulletIndex = param.bullet_id;
        this.initAngle = param.angle;
        this.bullet_id = param.bullet_id;
        this.rotation = 90 - this.initAngle;
        this.name = (this.bulletIndex * 1e5).toString();
        this.seatIndex = param.seatIndex;
        this._stateTime1 = GlobalConst.bitFlyTime1;
        this._stateTime2 = GlobalConst.bitFlyTime2;
        this._speed1 = GlobalConst.bitFlySpeed1;
        this._speed2 = GlobalConst.bitFlySpeed2;
        this.name = "bitBullet" + this.seatIndex;
        this.body = this.addChild(new Laya.Sprite());
        var bitImg = this.body.addChild(new Laya.Sprite());
        bitImg.loadImage(Laya.ResourceVersion.addVersionPrefix("bullets/zuantou1.png"), new Laya.Handler(this, () => {
            bitImg.pivot(bitImg.width * .5, bitImg.height * .5);
            bitImg.pos(0, 0);
        }));
        this.initEvent();
        // if (this._isHD) {
        //     this._sourcePos = new Laya.Vector3();
        //     this._trailingScale = new Laya.Vector3(0.1, 0.1, 0.1);
        //     this.loadParticle();
        //     this.initBitTrailing();
        // }
                        this.bitFireFly();
    }
    shootTo(angle) {
        this.bitFly({
            x: this.x,
            y: this.y
        }, -GlobalFunc.angleToRad(angle || this.initAngle));
    }
    //拖尾路径
    // trailingFly() {
    //     this._sourcePos.x = this.x;
    //     this._sourcePos.y = this.y;
    //     FishData.camera.convertScreenCoordToOrthographicCoord(this._sourcePos, this._bitTrailing.transform.position);
    //     this._bitTrailing.transform.scale = this._trailingScale;
    // }
    bitTrail() {
        let trailImg = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(Laya.ResourceVersion.addVersionPrefix("res/icon/img_zt_trail.png")));
        trailImg.height = 2e3;
        trailImg.anchorX = .5;
        trailImg.anchorY = 0;
        trailImg.blendMode = "lighter";
        return trailImg;
    }
    bitFly(lastPos, rad) {
        var data = this.getNextPos(lastPos, rad);
        var nextRad = this.getNextRad(rad);
        this.rotation = 90 + data.angle;
        // this._isHD && this.bitFireFly3D(data, lastPos);
                        let callBack = null;
        if (this._hitFlag) {
            callBack = new Laya.Handler(this, function() {
                this.bitFly(data, nextRad);
                // this.seatIndex == FishData.mySeatIndex && g_SoundManager.playSound(GlobalConst.Sud_drill_bound, 1);
                                });
        } else {
            callBack = new Laya.Handler(this, function() {
                // this._isHD && this.clearBitFire();
                this.clearTrail();
                this.clearFire();
                this.transState();
                this.shootTo(-data.angle);
            });
        }
        if (this._flyState == 1) {
            let trailImg = this.bitTrail();
            this.trailImgs.push(trailImg);
            trailImg.pos(this.x, this.y);
            trailImg.rotation = this.rotation;
            SceneManager.Instance.addToLayer(trailImg, GlobalConst.bulletLayer);
            GlobalFunc.globalSetZorder(trailImg, 5e3);
            let imgrad = GlobalFunc.angleToRad(this.rotation - 90);
            let imgx = data.x + 2e3 * Math.cos(imgrad);
            let imgy = data.y + 2e3 * Math.sin(imgrad);
            let imgtime = data.time + 2e3 / this._speed1 * 1e3;
            Laya.Tween.to(trailImg, {
                x: imgx,
                y: imgy
            }, imgtime, null, new Laya.Handler(this, function(img) {
                img.removeSelf();
                img.destroy();
            }, [ trailImg ]));
        }
        Laya.Tween.to(this, {
            x: data.x,
            y: data.y
        }, data.time, null, callBack);
    }
    bitFireFly() {
        this.flyFireAni = GlobalFunc.getAni("bitTrailFire");
        this.addChild(this.flyFireAni);
        this.flyFireAni.pos(0, 165);
        this.flyFireAni.play();
    }
    clearFire() {
        if (!!this.flyFireAni && this.flyFireAni.isPlaying) {
            this.flyFireAni.removeSelf();
            this.flyFireAni.destroy();
        }
    }
    //钻头后面的火焰粒子移动
    // bitFireFly3D(data, lastPos) {
    //     if (!this._bitFire || this._bitFire.destroyed) return;
    //     var deltaDis = 120;
    //     var rad_ = globalFun.angleToRad(this.rotation);
    //     var inVec = new Laya.Vector3(lastPos.x - Math.sin(rad_) * deltaDis, lastPos.y + Math.cos(rad_) * deltaDis);
    //     var outVec = new Laya.Vector3();
    //     FishData.camera.convertScreenCoordToOrthographicCoord(inVec, outVec);
    //     this._bitFire.transform.position = outVec;
    //     inVec.x = data.x - Math.sin(rad_) * deltaDis;
    //     inVec.y = data.y + Math.cos(rad_) * deltaDis;
    //     FishData.camera.convertScreenCoordToOrthographicCoord(inVec, outVec);
    //     Laya.Tween.to(this._bitFire.transform, { localPositionX: outVec.x, localPositionY: outVec.y }, data.time);
    // }
    // clearBitFire() {
    //     Laya.Tween.clearAll(this._bitFire);
    //     this._bitFire.destroy();
    // }
    getNextPos(lastPos, rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        var data = {x:0,y:0,angle:0,time:0};
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
            GlobalFunc.log("钻头路径异常！！！");
            this.destroy();
            return;
        }
        //第二阶段变速
        if (this._flyTimeSum >= this._stateTime1) {
            data.time = distance / this._speed2 * 1e3;
            this._flyState = 2;
        } else {
            data.time = distance / this._speed1 * 1e3;
        }
        data.angle = angle;
        this._flyTimeSum += data.time;
        //即将到达第二阶段，特殊处理
        if (this._flyTimeSum >= this._stateTime1 && this._flyState == 1) {
            this._hitFlag = null;
            var deltaTime = data.time - (this._flyTimeSum - this._stateTime1);
            var percent = deltaTime / data.time;
            data.x = lastPos.x * (1 - percent) + data.x * percent;
            data.y = lastPos.y * (1 - percent) + data.y * percent;
            data.time = deltaTime;
        }
        return data;
    }
    getNextRad(rad) {
        if (this._hitFlag == 1 || this._hitFlag == 2) {
            return rad > 0 ? Math.PI - rad : -Math.PI - rad;
        }
        return -rad;
    }
    //钻头变换形态
    transState() {
        // this._isHD && this.clearTrailing();
        this.body.destroyChildren();
        var redBitImg = this.body.addChild(new Laya.Sprite());
        redBitImg.loadImage(Laya.ResourceVersion.addVersionPrefix("res/icon/img_zt_3.png"), new Laya.Handler(this, () => {
            redBitImg.pivot(redBitImg.width * .5, redBitImg.height * .5);
            redBitImg.pos(0, 0);
        }));
        this.redBitTimeLine = TimeLineManager.Instance.creatTimeLine();
        this.redBitTimeLine.addLabel("red_bit_1", 0).to(redBitImg, {
            scaleX: 1.68,
            scaleY: .9
        }, 500).addLabel("red_bit_2", 0).to(redBitImg, {
            scaleX: .9,
            scaleY: .9
        }, 500);
        // .addLabel("red_bit_3", 0).to(redBitImg, {scaleX: 0.9, scaleY: 0.9}, 500)
        // .addLabel("red_bit_4", 0).to(redBitImg, {scaleX: 1, scaleY: 1}, 500)
                        this.redBitTimeLine.play(0, true);
        Laya.Tween.to(redBitImg, {
            rotation: 720
        }, GlobalConst.bitFlyTime2);
    }
    //清除拖尾
    // clearTrailing() {
    //     Laya.timer.clear(this, this.trailingFly);
    //     this._bitTrailing = null;
    // }
    clearTrail() {
        if (!this.trailImgs) return;
        this.trailImgs.forEach(img => {
            if (!img.destroyed) {
                img.removeSelf();
                img.destroy();
            }
        });
        this.trailImgs = null;
    }
    //钻头击中鱼特效
    hitEffect() {
        let hitAni = GlobalFunc.getAni("bitHitFire", 1.4);
        hitAni.rotation = this.rotation;
        SceneManager.Instance.addToLayer(hitAni, GlobalConst.effectLayer);
        hitAni.pos(this.x, this.y);
        hitAni.play(0, false);
        // if (!this._isHD) return;
        // var particle: Laya.ShuriKenParticle3D = this._bitHit.getChildAt(0) as Laya.ShuriKenParticle3D;
        // FishData.camera.convertScreenCoordToOrthographicCoord(new Laya.Vector3(this.x, this.y), particle.transform.position);
        // particle.particleSystem.play();
        // for (var i in particle._children) {
        //     var particlei = particle._children[i];
        //     particlei.transform.position = particle.transform.position;
        //     particlei.particleSystem.play();
        // }
                }
}