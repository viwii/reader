import { GameModel } from "../game/GameModel";

//专门用来存k-v形式的config信息
//只存常用高频率短配置
export class ConfigData{
    vipData: any;
    roomData: any;
    constructor() {
        //this.init();
    }
    static _Instance:any;
    static get Instance(){
        if (ConfigData._Instance == null){
            ConfigData._Instance = new ConfigData;
        }

        return ConfigData._Instance;
    }
    init() {}
    //vip.config
    initVipData() {
        if (this.vipData && this.vipData != {}) return;
        this.vipData = {};
        let vipJson = GameModel.getJson("Vip").then((vipJson)=>{
            for (var key in vipJson.vip) {
                var v = vipJson.vip[key];
                this.vipData[v.vipIndex] = v;
            }
        })
        
    }
    getVipData() {
        this.initVipData();
        return this.vipData;
    }
    getVipDataByKey(k) {
        this.initVipData();
        return this.vipData[k];
    }
    //roomConfig
    initRoomData() {
        if (this.roomData) return;
        this.roomData = {};
        GameModel.getJson("room").then((data)=>{
            let jsonData = data.ROOMCONFIG;
            console.log();
            for (var key in jsonData) {
                var v = jsonData[key];
                this.roomData[v.ROOM_TYPE] = v;
            }
        });
        
    }
    getRoomData() {
        this.initRoomData();
        return this.roomData;
    }
    getRoomDataByKey(k) {
        this.initRoomData();
        return this.roomData[k];
    }
}