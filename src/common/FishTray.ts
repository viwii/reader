import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalConst from "../const/GlobalConst";
import { SoundManager } from "./SoundManager";
import { FishData } from "../datas/FishData";

export class FishTray /*extends layaMaxUI_1.ui.roomScene.FishTrayUI*/ {
    seatIndex: number;
    isInFlyWar: boolean;
    visible: boolean;
    ani_0: any;
    rotation: number;
    ani_3: any;
    ani_1: any;
    ani_2: any;
    img_fishIcon: any;
    text_goldNum: any;
    img_title: any;
    img_fishName: any;
    text_specialName: any;
    constructor(seatIndex, isInFlyWar = false) {
        //super();
        /**位置索引 */                
        this.seatIndex = 0;
        this.isInFlyWar = false;
        this.seatIndex = seatIndex;
        this.isInFlyWar = isInFlyWar;
        if (!this.isInFlyWar) {
            this.init(this.seatIndex);
            this.visible = false;
        }
        this.ani_0.on(Laya.Event.COMPLETE, this, this.aniCallBack);
    }
    /**动画结束回调 */            
    aniCallBack() {
        this.visible = false;
        if (this.isInFlyWar) {
            this.destroy();
        }
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
    /**初始化 */            
    init(seatIndex) {
        let pos = GlobalFunc.getBigFishPos()[seatIndex];
        this.pos(pos.x, pos.y);
    }
    pos(x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    initInFlyWar(pos) {
        this.visible = true;
        this.rotation = -90;
        this.pos(pos.x, pos.y);
    }
    /**
    * 生成房间内托盘
    * @param fishData {fishID:鱼种ID,goldNum:获得的金币值,tray:动画类型,fishInfo:鱼种数据}
    */            
    startPlayAni(fishData) {
        if (fishData.tray == 0) return;
        if (this.seatIndex == FishData.mySeatIndex) {
            SoundManager.Instance.playSound(GlobalConst.Sud_CaiJinSound, 1);
        }
        this.ani_3.gotoAndStop(0);
        this.ani_0.gotoAndStop(0);
        this.ani_1.gotoAndStop(0);
        this.ani_2.gotoAndStop(0);
        this.img_fishIcon.rotation = 0;
        this.visible = true;
        let fishID = fishData.fishID;
        let fishInfo = fishData.fishInfo;
        this.img_fishIcon.rotation = 0;
        this.text_goldNum.text = fishData.goldNum;
        let iconPath = "res/icon";
        let namePath = "res/icon";
        if (fishData.tray == 1) {
            this.img_title.visible = true;
            this.img_fishName.skin = namePath + "/text_" + fishInfo.Icon + ".png";
            this.ani_0.play(0, false);
        } else if (fishData.tray == 2) {
            this.img_fishIcon.skin = iconPath + "/img_sp" + fishData.fish_type + ".png";
            this.text_specialName.skin = namePath + "/text_sp" + fishData.fish_type + ".png";
            this.ani_1.play(0, false);
        } else if (fishData.tray == 3) {
            this.img_fishIcon.skin = iconPath + "/" + fishInfo.Icon + ".png";
            this.text_specialName.skin = namePath + "/text_" + fishInfo.Icon + ".png";
            this.ani_2.play(0, false);
        } else if (fishData.tray == 4) {
            this.img_fishIcon.visible = true;
            this.img_fishIcon.skin = "bullets/img_zid_" + fishInfo.Icon + ".png";
            this.ani_3.play(0, false);
        } else if (fishData.tray == 5) {
            this.ani_0.play(0, false);
            this.img_fishName.visible = false;
        }
    }
}