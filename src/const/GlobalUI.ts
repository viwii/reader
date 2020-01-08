import { TimeLineManager } from "./TimeLineManager";
import GlobalConst from "./GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { PlayerData } from "../datas/PlayerData";
import { FishData } from "../datas/FishData";
import { SceneManager } from "../common/SceneManager";

var SceneM = SceneManager.Instance;
export class GlobalUI{
    static isCommonDialogShow: any;
    /**震屏 */
    static  shockScreenEff() {
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.uiLayer]);
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.roLayer]);
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.bgLayer]);
    }
    
    /**震屏 */            
    static  shockScreenFlyEff() {
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.roLayer]);
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.uiLayer]);
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.bgLayer]);
        GlobalUI.shockScreenTimeLine(SceneM._layers[GlobalConst.bulletLayer]);
    }
    
    static  shockScreenTimeLine(shockNode) {
        let shockTimeLine = TimeLineManager.Instance.creatTimeLine();
        shockTimeLine.addLabel("line1", 0).to(shockNode, {
            _x: 2,
            _y: -7,
            scaleX: 1.01,
            scaleY: 1.01,
            skewX: -.1
        }, 30).addLabel("line2", 0).to(shockNode, {
            _x: 2,
            _y: 1,
            scaleX: 1.01,
            scaleY: 1.01,
            skewX: .1
        }, 30).addLabel("line3", 0).to(shockNode, {
            _x: 2,
            _y: 4,
            scaleX: 1.01,
            scaleY: 1.01,
            skewX: -.1
        }, 30).addLabel("line4", 0).to(shockNode, {
            _x: -3,
            _y: 12,
            scaleX: 1.01,
            scaleY: 1.01,
            skewX: .1
        }, 30).addLabel("line5", 0).to(shockNode, {
            _x: 2,
            _y: 4,
            scaleX: 1,
            scaleY: 1,
            skewX: -.1
        }, 30).addLabel("line6", 0).to(shockNode, {
            _x: -3,
            _y: 12,
            scaleX: 1,
            scaleY: 1,
            skewX: .1
        }, 30).addLabel("line7", 0).to(shockNode, {
            _x: 2,
            _y: 4,
            scaleX: 1,
            scaleY: 1,
            skewX: -.1
        }, 30).addLabel("line8", 0).to(shockNode, {
            _x: 2,
            _y: -4,
            scaleX: 1,
            scaleY: 1,
            skewX: .1
        }, 30).addLabel("line9", 0).to(shockNode, {
            _x: 2,
            _y: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: -.1
        }, 30).addLabel("line10", 0).to(shockNode, {
            _x: 2,
            _y: 4,
            scaleX: 1,
            scaleY: 1,
            skewX: .1
        }, 30).addLabel("line11", 0).to(shockNode, {
            _x: 2,
            _y: 2,
            scaleX: 1,
            scaleY: 1,
            skewX: -.1
        }, 30).addLabel("line12", 0).to(shockNode, {
            _x: -2,
            _y: 4,
            scaleX: 1,
            scaleY: 1,
            skewX: .1
        }, 30).addLabel("line13", 0).to(shockNode, {
            _x: 0,
            _y: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0
        }, 30).addLabel("line14", 0).to(shockNode, {
            _x: 0,
            _y: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0
        }, 30);
        shockTimeLine.play();
    }
    
    /**掉落导弹 */            
    static  dropDaoDanEff(id, num, seatIndex, x, y) {
        let sp_daodan = new Laya.Sprite();
        let img_daodan_bg = new Laya.Image(Laya.ResourceVersion.addVersionPrefix("res/icon/img_battle_2.png"));
        sp_daodan.addChild(img_daodan_bg);
        let img_daodan_icon = "bullets/img_zid_" + (id - 1) + ".png";
        let img_daodan = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(img_daodan_icon)); 
        sp_daodan.addChild(img_daodan);
        img_daodan.centerX = img_daodan.centerY = img_daodan_bg.centerX = img_daodan_bg.centerY = 0;
        img_daodan.anchorX = img_daodan.anchorY = .5;
        img_daodan.rotation = 45;
        img_daodan.scale(.8, .8);
        sp_daodan.width = 100;
        sp_daodan.height = 100;
        sp_daodan.pivot(sp_daodan.width / 2, sp_daodan.height / 2);
        sp_daodan.pos(x, y);
        SceneM.addToLayer(sp_daodan, GlobalConst.effectTopLayer);
        GlobalFunc.globalSetZorder(sp_daodan, 5e3);
        let label_num = new Laya.Label("x" + num);
        sp_daodan.addChild(label_num);
        label_num.pos(50, 80);
        label_num.font = "numberFont1";
        label_num.anchorX = label_num.anchorY = .5;
        label_num.scale(.7, .7);
        let endPos = PlayerData.Instance.getItemFlyPos(GlobalConst.itemFlyCannon, seatIndex);
        // let dis = globalFun.pGetDistance({x: x, y: y}, endPos);
        let flyTime = 600;
        let timeLine_daodan = TimeLineManager.Instance.creatTimeLine();
        timeLine_daodan.addLabel("daodan1", 0).to(sp_daodan, {
            scaleX: 1.2,
            scaleY: 1.2
        }, 200).addLabel("daodan2", 0).to(sp_daodan, {
            scaleX: 1,
            scaleY: 1
        }, 200).addLabel("daodan3", 0).to(sp_daodan, {
            scaleX: 1.1,
            scaleY: 1.1
        }, 200).addLabel("daodan4", 0).to(sp_daodan, {
            scaleX: 1,
            scaleY: 1
        }, 200).addLabel("daodan5", 0).to(sp_daodan, {
            scaleX: 1,
            scaleY: 1
        }, 800).addLabel("daodan6", 0).to(sp_daodan, {
            x: endPos.x,
            y: endPos.y,
            scaleX: .3,
            scaleY: .3,
            alpha: .5
        }, flyTime);
        timeLine_daodan.play();
        timeLine_daodan.on(Laya.Event.COMPLETE, sp_daodan, function(sp_daodan) {
            sp_daodan.destroy();
        }, [ sp_daodan ]);
    }
    
    static  showBombEffect(point, isfly = false) {
        GlobalUI.singleBombEffect(point, 150, 100, isfly);
        Laya.timer.once(300, this, () => {
            GlobalUI.singleBombEffect(point, 100, -150, isfly);
        });
        Laya.timer.once(600, this, () => {
            GlobalUI.singleBombEffect(point, 0, 110, isfly);
        });
    }
    
    static  singleBombEffect(point, spaceX, spaceY, isfly = false) {
        var sp = GlobalFunc.getGoldFishBoomEffect(new Laya.Point(point.x - spaceX, point.y - spaceY), 1.8, true);
        SceneM.addToLayer(sp, GlobalConst.effectTopLayer);
        let end = PlayerData.Instance.getItemFlyPos(isfly ? GlobalConst.itemFlyFlyGold : GlobalConst.itemFlyRoomCoin, FishData.mySeatIndex);
        let param = {
            characterType: 2,
            startPoint: new Laya.Point(point.x - spaceX, point.y - spaceY),
            endPoint: end,
            aniName: "goldCoinAni",
            seat: null,
            isCommon: true
        };
        // g_SoundManager.playSound(GlobalConst.Sud_pearl_bomb, 1);
        GlobalFunc.doItemFlyAni(param);
        GlobalFunc.addGlobalAni(point.x - spaceX, point.y - spaceY, GlobalConst.daoDanEffect, 1, 0, GlobalConst.effectBottomLayer);
    }
    
    static setFishNum(isSelf, gold, posX, posY, rotation = 0) {
        let label = new Laya.Label();
        label.font = isSelf ? GlobalConst.fontNum1 : GlobalConst.fontNum2;
        label.text = gold + "";
        label.anchorX = label.anchorY = .5;
        label.scale(.5, .5);
        label.x = posX;
        label.y = posY;
        label.rotation = rotation;
        Laya.Tween.to(label, {
            scaleX: .96,
            scaleY: .96
        }, 200);
        Laya.Tween.to(label, {
            scaleX: .72,
            scaleY: .72
        }, 160, null, null, 200);
        Laya.Tween.to(label, {
            scaleX: .88,
            scaleY: .88
        }, 140, null, null, 360);
        Laya.Tween.to(label, {
            scaleX: .72,
            scaleY: .72
        }, 100, null, null, 600);
        Laya.Tween.to(label, {
            alpha: 1
        }, 350, null, null, 700);
        Laya.Tween.to(label, {
            alpha: 0
        }, 300, null, Laya.Handler.create(this, () => {
            label.destroy();
        }), 1050);
        SceneManager.Instance.addToLayer(label, GlobalConst.effectTopLayer, posX, posY - 60);
    }
    
    //hbox存储赋值方法
    static initHbox(box) {
        let data = box._children;
        let target = [];
        for (let i = 0; i < data.length; i++) {
            target.push(data[i]);
        }
        return target;
    }
}