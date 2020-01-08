import { EventDis } from "../Helpers/EventDis";
import { GameModel } from "../game/GameModel";
import Single from "../const/SingleSDK";

export class FishLineData{
    isFishLineLoaded: boolean;
    isFirstFishLineLoaded: boolean;
    fishLineObj: Object;
    newUserFishLines: any[];
    static _Instance:any;
    static get Instance(){
        if (FishLineData._Instance == null){
            FishLineData._Instance = new FishLineData;
        }

        return FishLineData._Instance;
    }
    constructor() {
        this.isFishLineLoaded = false;
        this.isFirstFishLineLoaded = false;
        this.fishLineObj = new Object();
        this.newUserFishLines = [];
    }
    //加载鱼线
    getFishLines() {
        if (this.isFishLineLoaded) {
            EventDis.Instance.dispatchEvent("load_fish_path_over");
            return;
        }
        this.isFishLineLoaded = true;
        let json = GameModel.getJson("fishPathList");
        let fishPaths = json.fishPaths;
        let fishPathArr = [];
        for (let i = 0; i < fishPaths.length; ++i) {
            let onePath = {
                url: Single.getResUrl() + "res/config/fishPaths/" + fishPaths[i],
                type: Laya.Loader.JSON
            };
            fishPathArr.push(onePath);
        }
        Laya.loader.load(fishPathArr, new Laya.Handler(this, function() {
            EventDis.Instance.dispatchEvent("load_fish_path_over");
        }));
        this.getNewUserFishLines();
    }
    //加载新手鱼线
    getNewUserFishLines() {
        if (this.isFirstFishLineLoaded) return;
        this.isFirstFishLineLoaded = true;
        let json = GameModel.getJson("fishPathList");
        this.newUserFishLines = json.newUserFishPaths;
    }
}