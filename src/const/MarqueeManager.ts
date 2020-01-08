import { GameData } from "../datas/GameData";
import { SceneManager } from "../common/SceneManager";
import GlobalConst from "./GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import GlobalVar from "./GlobalVar";
import { NetManager } from "../netWork/NetManager";
import OnOffManager from "./OnOffManager";
import { PlayerData } from "../datas/PlayerData";
import { GameModel } from "../game/GameModel";

export class MarqueeManager{
    marqueeType: {};
    marqueeArray: {};
    timespan: number;
    isNetOff: boolean;
    marqueeNode: any;
    playerName: any;
    static _Instance:any;
    static get Instance(){
        if (MarqueeManager._Instance == null){
            MarqueeManager._Instance = new MarqueeManager;
        }

        return MarqueeManager._Instance;
    }
    constructor() {
        this.marqueeType = {};
        this.marqueeArray = {};
        this.timespan = 0;
        this.isNetOff = false;
    }
    init() {
        this.loadMarqueeJson();
    }
    /**播放跑马灯 */            
    playMarquee(data) {
        if (!this.marqueeNode || this.marqueeNode.destroyed) {
            this.marqueeNode = undefined;
            //this.marqueeNode = new MarqueeNode();
        }
        if (!!!this.marqueeNode.parent) {
            if (!GameData.Instance.isInRoomOrHall) return;
            SceneManager.Instance.addToLayer(this.marqueeNode, GlobalConst.broadCastLayer);
            !this.marqueeNode.isPlaying && this.marqueeNode.setAndPlayMarquee([ {
                text: "欢迎来到捕鱼侠3D,游戏内禁止赌博,文明游戏，祝游戏愉快!",
                color: "blue"
            } ], data.play_second);
            return;
        }
        !this.marqueeNode.isPlaying && this.marqueeNode.setAndPlayMarquee(data.contents, data.play_second);
    }
    /**读取假跑马灯配置 */            
    loadMarqueeJson() {
        let json = GameModel.getJson("paomadeng");
        if (json) {
            this.initMarqueeArray(json.desc);
            this.initMarqueeTypeText(json.text);
            this.playerName = json.nickname;
            this.timespan = +json.timespan[0].timespan * 1e3;
        }
        EventDis.Instance.addEvntListener(GlobalVar.NET_OVER, this, () => {
            this.isNetOff = true;
            Laya.timer.clearAll(this);
        });
        if (NetManager.Instance.connected) {
            this.isNetOff = false;
            GameData.Instance.isGameStart && this.getRateData();
        } else {
            EventDis.Instance.addEvntListener(GlobalVar.NET_ON, this, () => {
                this.isNetOff = false;
                GameData.Instance.isGameStart && this.getRateData();
            });
        }
    }
    /**初始化跑马灯类型列表 */            initMarqueeArray(data) {
        for (let index = 0; index < data.length; index++) {
            let marqueeData = data[index];
            if (!this.marqueeArray[marqueeData.type]) {
                this.marqueeArray[marqueeData.type] = {};
                this.marqueeArray[marqueeData.type]["array"] = new Array();
                this.marqueeArray[marqueeData.type]["typeRate"] = marqueeData.weight;
                this.marqueeArray[marqueeData.type]["type"] = marqueeData.type;
            }
            this.marqueeArray[marqueeData.type].array.push(marqueeData);
        }
    }
    /**初始化跑马灯类型 */            initMarqueeTypeText(data) {
        for (let index = 0; index < data.length; index++) {
            let text = data[index];
            this.marqueeType[index + 1 + ""] = text;
        }
    }
    getRateData() {
        if (!OnOffManager.isMarquee) {
            return;
        }
        let typeRate = Math.floor(Math.random() * 1e4);
        let useType = "";
        let _rateNum = 0;
        for (const key in this.marqueeArray) {
            let typeArr = this.marqueeArray[key];
            _rateNum += +typeArr.typeRate;
            if (typeRate <= _rateNum) {
                useType = typeArr.type;
                break;
            }
        }
        let useTypeArray = this.marqueeArray[useType].array;
        let marqueeRate = Math.floor(Math.random() * 1e4);
        let _marqueeNum = 0;
        for (let index = 0; index < useTypeArray.length; index++) {
            let inData = useTypeArray[index];
            _marqueeNum += +inData.rate;
            if (marqueeRate <= _marqueeNum) {
                let marquee = this.addMarquee(inData);
                this.playMarquee({
                    contents: marquee,
                    play_second: 20,
                    level: 1
                });
                return;
            }
        }
    }
    addMarquee(data) {
        let textData = this.marqueeType[data.type];
        let arr = new Array();
        let playerNameRandom = Math.floor(Math.random() * 1e3);
        let playerName = this.playerName[playerNameRandom];
        if (data.type == "1") {
            arr.push({
                text: playerName.nickname,
                color: "yellow"
            });
            arr.push({
                text: textData.text1,
                color: "white"
            });
            arr.push({
                text: data.green,
                color: "green"
            });
            arr.push({
                text: textData.text2,
                color: "white"
            });
        } else {
            arr.push({
                text: playerName.nickname,
                color: "yellow"
            });
            arr.push({
                text: textData.text1,
                color: "white"
            });
            arr.push({
                text: data.blue,
                color: "blue"
            });
            arr.push({
                text: textData.text2,
                color: "white"
            });
            arr.push({
                text: data.red,
                color: "red"
            });
            arr.push({
                text: textData.text3,
                color: "white"
            });
            arr.push({
                text: data.green,
                color: "green"
            });
            arr.push({
                text: textData.text4,
                color: "white"
            });
        }
        return arr;
    }
    loopToPlay() {
        !this.isNetOff && Laya.timer.once(this.timespan, this, this.getRateData);
    }
}