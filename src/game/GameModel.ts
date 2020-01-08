import Single, { Platform, SingleConfig } from "../const/SingleSDK";
import GlobalVar from "../const/GlobalVar";
import { GameData } from "../datas/GameData";

export class GameModel{
    static analysisJson: any;
    static jsonMap:Map<string, any>
    static pareAllConfig(callback){
      let cfg = [
        "./res/config/activity.json",
"./res/config/allfishScript.json",
"./res/config/app_global_define.json",
"./res/config/blong.json",
"./res/config/circle_1.json",
"./res/config/circle_2.json",
"./res/config/circlewavemax_1.json",
"./res/config/circlewavemax_2.json",
"./res/config/circlewavemin_1.json",
"./res/config/circlewavemin_2.json",
"./res/config/collection.json",
"./res/config/constAnnouncement.json",
"./res/config/dantou1.json",
"./res/config/dantou2.json",
"./res/config/dantou3.json",
"./res/config/dantou4.json",
"./res/config/exchange.json",
"./res/config/fasan.json",
"./res/config/fish_H5APP.json",
"./res/config/fish_H5Bianf.json",
"./res/config/fish_H5QTT.json",
"./res/config/fish_H5UC.json",
"./res/config/fish_WXGAME.json",
"./res/config/fishlocker.json",
"./res/config/fishPathList.json",
"./res/config/FishTeam.json",
"./res/config/five_dragon_treasure.json",
"./res/config/Formations.json",
"./res/config/freeTicket.json",
"./res/config/global_define.json",
"./res/config/guide.json",
"./res/config/haiwangzhengba.json",
"./res/config/invitationAward.json",
"./res/config/Item.json",
"./res/config/long.json",
"./res/config/longpao.json",
"./res/config/luckyDraw.json",
"./res/config/luckyRoulette.json",
"./res/config/pangxie.json",
"./res/config/paomadeng.json",
"./res/config/player_init.json",
"./res/config/resconfig.json",
"./res/config/room.json",
"./res/config/room_setting.json",
"./res/config/Roulette.json",
"./res/config/sharecard.json",
"./res/config/shareData.json",
"./res/config/shop.json",
"./res/config/shop_H5APP.json",
"./res/config/shop_H5Bianf.json",
"./res/config/shop_H5QTT.json",
"./res/config/shop_H5UC.json",
"./res/config/shop_WXGAME.json",
"./res/config/techang.json",
"./res/config/teseyu1.json",
"./res/config/teseyu2.json",
"./res/config/teseyu3.json",
"./res/config/teseyu4.json",
"./res/config/timeLimitPacks.json",
"./res/config/Vip_H5APP.json",
"./res/config/Vip_H5Bianf.json",
"./res/config/Vip_H5QTT.json",
"./res/config/Vip_H5UC.json",
"./res/config/vip_room_fish.json",
"./res/config/Vip_WXGAME.json",
"./res/config/viplong.json",
"./res/config/vipshort.json",
"./res/config/wholepoint.json",
"./res/config/yaoyiyao.json",
"./res/config/zhengdianreward.json"];
      Laya.loader.load("./res/config/zhengdianreward.json") , Laya.Handler.create(null, function() {
        //console.log(data)
        callback();
      });
      //Handler.create(this, onLoaded),Handler.create(this, onProgress));
			//Laya.loader.load("res/atlas/comp.atlas", Handler.create(this, onLoaded),Handler.create(this, onProgress
    }
    static getJson(key) {
        //if (!GameModel.analysisJson) GameModel.analysisJson = new Map();
        //if (GameModel.analysisJson.get("config/" + GameModel.getKeyByPlatform(key) + ".json")) return GameModel.analysisJson.get("config/" + GameModel.getKeyByPlatform(key) + ".json");
        // if (Single.SingleConfig.platform == Platform.WXGAME) {
        //     var data = GlobalVar.fswx.readFileSync("wx.env.USER_DATA_PATH" + "/config/" + GameModel.getKeyByPlatform(key) + ".json", "utf-8");
        //     GameModel.analysisJson.set("config/" + key + ".json", JSON.parse(data));
        //     return JSON.parse(data);
        // }
        // else {
            return new Promise<any>((resolve, reject) => {
                // if (GameModel.jsonData.file("config/" + getKeyByPlatform(key) + ".json")) {
                //     GameModel.jsonData.file("config/" + getKeyByPlatform(key) + ".json").async('text').then((data) => {
                //         console.log('解析Json ' + key);
                //         GameModel.analysisJson.set(key, JSON.parse(data));
                //         GameData.Instance.fileLoad.push(key);
                //         resolve(JSON.parse(data))
                //     });
                // } else {
                //     resolve(null);
                //     console.warn(key + 'json不存在');
                // }
                var path = "res/config/"+ key + ".json"
                Laya.loader.load(path) , new Laya.Handler(this, (data) => {
                  return resolve(JSON.parse(data));
              });
            })
          //})
        }
    /**
    * 根据平台获取对应的JSON
    * @param key
    */            
    static getKeyByPlatform(key) {
        if (key != "shop" && key != "Vip" && key != "fish") return key;
        let result;
        switch (SingleConfig.platform) {
          case Platform.WXGAME:
            result = key + "_" + Platform.WXGAME;
            break;

          case Platform.H5Bianf:
            result = key + "_" + Platform.H5Bianf;
            break;

          case Platform.H5UC:
            result = key + "_" + Platform.H5UC;
            break;

          case Platform.H5QTT:
            result = key + "_" + Platform.H5QTT;
            break;

          case Platform.H5APP:
            result = key + "_" + Platform.H5APP;
            break;

          default:
            break;
        }
        return result;
    }
}