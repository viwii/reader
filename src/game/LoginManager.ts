import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { EventDis } from "../Helpers/EventDis";
import GlobalVar from "../const/GlobalVar";
import { PlayerData } from "../datas/PlayerData";
import { GameData } from "../datas/GameData";
import OnOffManager from "../const/OnOffManager";
import GlobalConst from "../const/GlobalConst";
import { HallData } from "../datas/HallData";
import { Platform } from "../const/SingleSDK";
import { NetManager } from "../netWork/NetManager";
import { SceneManager } from "../common/SceneManager";

export class LoginManager{
    static _Instance:LoginManager;
    static get Instance(){
        if (LoginManager._Instance == null){
            LoginManager._Instance = new LoginManager;
        }

        return LoginManager._Instance;
    }
    /**登陆返回 */
    loginOkCallBack(data) {
        GlobalFunc.log("登录后端成功 返回:");
        ////////新后端字段
        EventDis.Instance.dispatchEvent(GlobalVar.DATA_VIP_INFO, {
            vip: data.vip_level
        });
        EventDis.Instance.dispatchEvent(GlobalVar.VIP_EXP_UP, data.vip_exp);
        GameData.Instance.isFirstRecharge = !!data.shouchong_flag;
        PlayerData.Instance.lastlogintime = data.last_login_time;
        // g_GameData.account = data.account
        GameData.Instance.account_type = data.account_type;
        GameData.Instance.uid = data.uid;
        GameData.Instance.nickName = data.nick_name;
        PlayerData.Instance.sex = data.sex;
        PlayerData.Instance.head_image = data.head_image;
        PlayerData.Instance.create_time = data.create_time;
        PlayerData.Instance.lastlogintime = data.last_login_time;
        PlayerData.Instance.equipBoat = data.cur_boat_item;
        PlayerData.Instance.allTicketCount = data.total_hit_liquan;
        OnOffManager.isTicketTipsOn = PlayerData.Instance.allTicketCount < 1e3;
        PlayerData.Instance.setItemNum(GlobalConst.GoldCoinID, data.gold);
        PlayerData.Instance.setItemNum(GlobalConst.DiamondID, data.diamond);
        GameData.Instance.tomrrowData = data.mingri_package_info;
        GlobalFunc.setGiftMr(GameData.Instance.tomrrowData);
        data.shop_merge_info && HallData.Instance.setGiftCzState(data.shop_merge_info);
        let serverTime = GameData.Instance.serverTimeStamp;
        if (data.guide_info) {
            GameData.Instance.roomguide = data.guide_info.room_2_guide;
            GameData.Instance.numberState = data.guide_info.public_number_state;
        }
        if (data.yaoyiyao_info && JSON.parse(data.yaoyiyao_info)) {
            let info = JSON.parse(data.yaoyiyao_info);
            GameData.Instance.shakeTimes = +info.chances;
            let isMonth = new Date(+info.lastBuyTime * 1e3).getMonth() == new Date(serverTime).getMonth();
            let isDate = new Date(+info.lastBuyTime * 1e3).getDate() == new Date(serverTime).getDate();
            GameData.Instance.isShaked = isMonth && isDate;
        }
        if (data.yueka_info && JSON.parse(data.yueka_info)) {
            let info = JSON.parse(data.yueka_info);
            GameData.Instance.monthEndTime = +info.effectEndTime;
            GlobalFunc.setMonthTime();
            let isDate = new Date(+info.lastGetTime * 1e3).getDate() == new Date(serverTime).getDate();
            let isMonth = new Date(+info.lastGetTime * 1e3).getMonth() == new Date(serverTime).getMonth();
            GameData.Instance.isMonthToday = GameData.Instance.monthEndDay > 0 && isMonth && isDate;
        }
        if (data.tehui_package_info && JSON.parse(data.tehui_package_info)) {
            let info = JSON.parse(data.tehui_package_info);
            GameData.Instance.tehuiState1 = +info["18"];
            GameData.Instance.tehuiState2 = +info["30"];
        }
        if (data.shop_daily_info) {
            let buy_info = data.shop_daily_info.buy_info;
            GameData.Instance.newTehuiStates["4101"] = true;
            GameData.Instance.newTehuiStates["4102"] = true;
            GameData.Instance.newTehuiStates["4103"] = true;
            GameData.Instance.newTehuiStates["4104"] = true;
            for (let i in buy_info) {
                let product_id = buy_info[i].product_id;
                let last_buy_time = buy_info[i].last_buy_time;
                let serTime = GameData.Instance.serverTimeStamp;
                let day = new Date(serTime).getDate();
                let buyDay = new Date(last_buy_time * 1e3).getDate();
                if (buyDay == day) {
                    GameData.Instance.newTehuiStates[product_id] = false;
                }
            }
        }
        GameData.Instance.isShopNewPlayer = GameData.Instance.tehuiState1 == 2 && GameData.Instance.tehuiState2 == 2 && !GameData.Instance.isFirstRecharge;
        PlayerData.Instance.vipSkillAssign();
        var equippedCannon = 0;
        PlayerData.Instance.equipCannon = equippedCannon;
        //玩家登录完毕开始加载资源
        EventDis.Instance.dispatchEvent("START_LOAD_RESOURCE");
        GlobalFunc.checkPlatform(Platform.H5APP) && LoginManager.Instance.enterGame();
    }
    
    /**
     * 进入游戏
     * 大厅 or 新手场
     */            
    enterGame() {
        GlobalVar.runStage = "run";
        //先加载背景图
        GlobalFunc.log("进大厅");
        NetManager.Instance.noticeEnterFirstHall();
        SceneManager.Instance.replaceScene("FirstHallScene");
        //大厅初始化之后再移除加载界面
            EventDis.Instance.addEvntListener("REMOVE_LOADINGSCENE", this, () => {
            if (SceneManager.Instance.curSceneName == "LoadingScene") {
                SceneManager.Instance.clearCurrentScene();
            }
            // this.delSelf();
                        });
        Laya.loader.load(Laya.ResourceVersion.addVersionPrefix(GlobalVar.reUrl + "atlas2/nets.atlas"), new Laya.Handler(this, () => {}), null, null, 4, true, null, false, true);
    }
}