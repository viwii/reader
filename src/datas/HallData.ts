import GlobalConst from "../const/GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import OnOffManager from "../const/OnOffManager";
import { SceneManager } from "../common/SceneManager";

/**大厅数据信息 */
export class HallData{
    ShareList: any[];
    composeList: any[];
    activityRedInfo: {};
    firstHallOpenCount: number;
    static _Instance:any;
    static get Instance(){
        if (HallData._Instance == null){
            HallData._Instance = new HallData;
        }

        return HallData._Instance;
    }
    constructor() {
        this.ShareList = [];
        /**合成列表 */                
        this.composeList = [];
        /**活动红点信息 */                
        this.activityRedInfo = {};
        /**大厅打开次数 */                
        this.firstHallOpenCount = 0;
    }
    init() {}
    openRewardDialog() {
        SceneManager.Instance.addToMiddLayer(null, GlobalConst.dialogLayer);
        // g_EventDis.dispatchEvent(PLAY_SOUND_RAWARD);
        }
    /**初始化合成记录 */            initComposeList(data) {
        this.composeList = data;
    }
    /**添加合成记录 */            addComposeRecord(data) {
        this.composeList.push(data);
        this.composeRecordSort();
    }
    /**合成记录排序 */            composeRecordSort() {
        this.composeList.sort((a, b) => {
            if (a.time > b.time) return -1; else return 1;
        });
    }
    /**初始化活动红点信息 */            
    initActivityRedInfo() {
        // this.activityRedInfo[ActivityDialog_1.ActivityType.DATEACTIVE] = false;
        // this.activityRedInfo[ActivityDialog_1.ActivityType.GLODPAG] = false;
        // this.activityRedInfo[ActivityDialog_1.ActivityType.VIPCONFIRM] = false;
        // this.activityRedInfo[ActivityDialog_1.ActivityType.ADDGROUP] = true;
        // this.activityRedInfo[ActivityDialog_1.ActivityType.PHONEBILL] = false;
    }
    /**获取红点信息 */            
    getActivityRedState(type) {
        // if (type == ActivityDialog_1.ActivityType.ADDGROUP) {
        //     return GlobalFunc.getStorage("addgroup") != "true" && this.activityRedInfo[type];
        // } else {
        //     return this.activityRedInfo[type];
        // }
    }
    /**获取活动是否有红点 */            
    getActivtyHasRed() {
        for (const key in this.activityRedInfo) {
            if (this.activityRedInfo[key] == true) {
                return true;
            }
        }
        return false;
    }
    /**三合一礼包状态调整 */            
    setGiftCzState(data) {
        if (data.product_id == 0) {
            if (data.product_type == 0) {
                OnOffManager.isChaozOn = 1;
            } else if (data.product_type == 1) {
                OnOffManager.isChaozOn = 2;
            }
        } else {
            OnOffManager.isChaozOn = 0;
        }
    }
    addHallTImes() {
        this.firstHallOpenCount++;
    }
}