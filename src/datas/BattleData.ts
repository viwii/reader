import GlobalVar from "../const/GlobalVar"
import GlobalFunc from "../GlobalFuncs/GlobalFunc"
import {EventDis} from "../Helpers/EventDis"
import GlobalConst from "../const/GlobalConst";
import {FishData} from "./FishData";
import {GameData} from "./GameData"
import { NetManager } from "../netWork/NetManager";
import { PlayerData } from "./PlayerData";
import { ConfigData } from "../const/ConfigData";
import { GameModel } from "../game/GameModel";

export class BattleData{
    static getUserSeatByUid(uid: any) {
        throw new Error("Method not implemented.");
    }
    static _Instance:BattleData;
    cur_scene_id: number;
    FishSceneTime: number;
    lastClientTime: number;
    room_type: number;
    roomPlayerData: any[];
    paoBeiInfo: {};
    roomPaobei: {};
    roomData: {};
    roomNum: any[];
    jackpotNum: { num: number; }[];
    jackpotPercent: number[];
    cachedFish: {};
    fishData: {};
    isInRoom: boolean;
    isInFlyWars: boolean;
    maxRoom: number;
    dragonCannonInfo: {};
    isNeedEnterRoom2: boolean;
    vipCloseTime: number[];
    fishLineData: Object;
    roomsInfo: any[];
    isFlip: boolean;
    skillInfo: {};
    jackpot: any;
    initTimes: any;
    seatInfos: any;
    last_scene_id: any;
    scene_type: number;
    scene_end_time: number;
    die_fish_ids: any;
    reborn_fishs: any;
    use_items: any;
    roomWarnMessage: any;
    constructor() {
        this.cur_scene_id = 0;
        //当前渔场场景id
        this.FishSceneTime = 0;
        //场景时间
        this.lastClientTime = 0;
        // public serverTime: number = 0; //服务器时间
        this.room_type = 1;
        /**房间玩家信息 */                
        this.roomPlayerData = [];
        /**房间uid-seatIndex map缓存 */
        // public roomUidSeatData: any = {};
        /**炮倍信息 */                
        this.paoBeiInfo = {};
        /**房间炮倍开启信息 */                
        this.roomPaobei = {};
        /**房间信息 */                
        this.roomData = {};
        /**房间数量 */                
        this.roomNum = [];
        /**奖池金币 */                
        this.jackpotNum = [ {
                num: 0
            }, {
                num: 0
            }, {
                num: 0
            } ];
        /**奖池方案 */                
        this.jackpotPercent = [ 0, 0, 0 ];
        //鱼动画资源是否创建
        this.cachedFish = {};
        /**鱼种数据 */                
        this.fishData = {};
        /**是否在房间内 */                
        this.isInRoom = false;
        this.isInFlyWars = false;
        //进入过的最高房间
        this.maxRoom = 0;
        this.dragonCannonInfo = {};
        //龙炮配置
        this.isNeedEnterRoom2 = false;
        //是否需要进入房间2
        this.vipCloseTime = [ 0, 0, 0 ];
    }

    static get Instance(){
        if (BattleData._Instance == null){
            BattleData._Instance = new BattleData;
        }

        return BattleData._Instance;
    }

    init() {
        //数据初始化
        this.loadRoomJson();
        this.initBattleInfos();
        //配置读取
        this.loadFishData();
        this.loadDragonCannonJson();
        EventDis.Instance.addEvntListener("switchSceneId", this, function(data) {
            this.startUpdateTime(data.time_msec_offset);
        });
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_FREEZE_SHOOT_NOTICE, this, this.clearUpdateTime);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_FREEZE_STOP_NOTICE, this, this.startUpdateTime);
        EventDis.Instance.addEvntListener("leave_room", this, this.clearUpdateTime);
        EventDis.Instance.addEvntListener(GlobalVar.ROOM_USE_ITEM_NOTICE, this, this.roomUseItem);
        EventDis.Instance.addEvntListener(GlobalVar.LEAVE_ROOM_SUCCESS, this, this.enterRoomListener);
    }
    enterRoomListener() {
        if (this.room_type == 0) {
            NetManager.Instance.reqEnterRoom({
                room_type: 1,
                enter: true
            });
        } else if (this.isNeedEnterRoom2) {
            NetManager.Instance.reqEnterRoom({
                room_type: 2,
                enter: true
            });
            this.isNeedEnterRoom2 = false;
        }
    }
    //进入房间初始化数据
    initBattleInfos() {
        // this.roomUidSeatData = {}
        // this.roomUidSeatData = []
        this.fishLineData = new Object();
        this.roomsInfo = new Array();
        this.isFlip = false;
        this.skillInfo = {};
        this.initRoomPaobeiInfo();
    }
    //更新前端时间，同步后端时间
    startUpdateTime(newServerTime) {
        GlobalFunc.log("startUpdateTime:", newServerTime);
        this.FishSceneTime = newServerTime || 0;
        this.lastClientTime = GlobalFunc.getClientTime();
        Laya.timer.loop(50, this, this.loopUpdateTime);
    }
    clearUpdateTime() {
        Laya.timer.clear(this, this.loopUpdateTime);
    }
    loopUpdateTime(data) {
        let nowTime = GlobalFunc.getClientTime();
        let interval = nowTime - this.lastClientTime;
        this.FishSceneTime += interval;
        this.lastClientTime = nowTime;
    }
    updateSitInfoBySkill(skillData) {}
    updateSitInfoByHit(hitData) {
        if (!hitData) return;
        var seatIndex = hitData.seat;
        // if (seatIndex == FishData.mySeatIndex) return;
        var gold = hitData.nowgold;
        this.roomPlayerData[seatIndex].gold = gold;
    }
    //设置sitPlayerInfo,基于增量修改playerInfo
    setSitPlayerInfoByObj(seatIndex, obj, addMod) {
        var playerInfo = this.roomPlayerData[seatIndex];
        if (!playerInfo) return;
        playerInfo.setPlayerInfo(obj, addMod);
    }
    updateSitInfoForMoney() {}
    initFishLineData() {
        this.fishLineData = new Object();
    }
    setFishLineData(data) {}
    /**读取房间信息 */            loadRoomJson() {
        this.roomData = {};
        this.jackpot = undefined;
        GameModel.getJson("room").then((json)=>{
            if (json) {
                if (json.ROOMCONFIG) {
                    for (let i = 0; i < json.ROOMCONFIG.length; i++) {
                        this.roomData[json.ROOMCONFIG[i].ROOM_TYPE] = json.ROOMCONFIG[i];
                        this.roomNum.push(json.ROOMCONFIG[i].ROOM_TYPE);
                    }
                }
                if (json.ADDSCORE) {
                    this.jackpot = json.ADDSCORE;
                }
            }
        })
        
    }
    /**读取龙炮信息 */            
    loadDragonCannonJson() {
        this.dragonCannonInfo = {};
        GameModel.getJson("longpao").then((json)=>{
            if (json) {
                if (json.Longpao) {
                    for (let key in json.Longpao) {
                        let data = json.Longpao[key];
                        this.dragonCannonInfo[data.id] = data;
                    }
                }
            }
        })
        
    }
    /**读取炮倍信息 */
    //房间变化、vip变化(todo)，需要执行 有效炮倍配置初始化
    initRoomPaobeiInfo() {
        this.paoBeiInfo = new Object();
        if (this.roomPaobei) {
            this.roomPaobei = {};
        }
        this.roomPaobei = {};
        for (let index = 0; index < this.roomNum.length; index++) {
            this.roomPaobei[this.roomNum[index]] = [];
        }
        //找出房间可用信息
        //每个房间有自己可用炮倍数组
        //每个vip等级有自己的可用最高炮倍
        var roomData = ConfigData.Instance.getRoomDataByKey(this.room_type);
        this.roomPaobei = !!!this.roomPaobei ? [] : this.roomPaobei;
        this.roomPaobei[this.room_type] = [];
        for (var i = 0; i < roomData.Guns.length; i++) {
            var v = roomData.Guns[i];
            this.roomPaobei[this.room_type].push(v);
        }
    }
    /**获取座位信息 */            
    getSitInfo(seatIndex) {
        // if (!this.roomPlayerData[seatIndex]) {
        //     GlobalFunc.log("房间内玩家信息异常", seatIndex);
        //     return new RoomPlayerInfoNode_1.default();
        // }
        return this.roomPlayerData[seatIndex];
    }
    /**通过uid寻找玩家座位 */            getUserSeatByUid(uid) {
        // if (this.roomUidSeatData[uid]) return this.roomUidSeatData[uid]
        for (let i in this.roomPlayerData) {
            let player = this.roomPlayerData[i];
            if (!player) return 0;
            if (!player.isInRoom) continue;
            if (uid == player.uid) {
                // this.roomUidSeatData[uid] = player.room_pos
                return player.room_pos;
            }
        }
        return 0;
    }
    /**获取鱼种数据 */            
    loadFishData() {
        GameModel.getJson("fish").then((json)=>{
            if (json && json.fish) {
                for (let index = 0; index < json.fish.length; index++) {
                    let fishInfo = json.fish[index];
                    this.fishData[fishInfo.FishTypeID] = fishInfo;
                }
            }
        })
        
    }
    //座位信息
    setSitInfo(data) {
        if (data) {
            for (var index = 1; index <= 4; index++) {
                var sitData = data[index];
                if (!sitData) return;
                this.initTimes[sitData.seat] = sitData.pao;
                this.seatInfos[sitData.seat] = sitData;
                if (sitData.uid == GameData.Instance.uid) {
                    FishData.mySeatIndex = sitData.seat;
                    this.isFlip = FishData.mySeatIndex == 3 || FishData.mySeatIndex == 4;
                }
            }
        } else {
            this.seatInfos = {};
        }
    }
    /**
    * 彩金池数量增加
    * @param index 房间索引
    */            addRewardPool(index) {
        // let data = this.roomData[index + 1];
        // if (data.isPool == "0") return;
        // let currectNum = this.jackpotNum[index].num;
        // let initialNum: number = Number(data.initialPool);
        // let percent = (currectNum / initialNum) * 100;
        // for (let key in this.jackpot) {
        //     let jackpotFun = Number(key);
        //     let changeNum = Math.round(currectNum + Number(this.jackpot[key]) * 60);
        //     if (jackpotFun) {
        //         if (percent < jackpotFun) {
        //             let targetNum = initialNum * jackpotFun;
        //             let useTime = (targetNum - currectNum) / Number(this.jackpot[key]);
        //             if (useTime > 70000) {
        //                 this.jackpotPercent[index] = Number(key);
        //                 Laya.Tween.to(this.jackpotNum[index], { num: changeNum }, 60 * 1000, undefined, new Laya.Handler(this, this.addRewardPool, [index]));
        //                 return;
        //             } else {
        //                 Laya.Tween.to(this.jackpotNum[index], { num: targetNum }, Math.floor(useTime) * 1000, undefined, new Laya.Handler(this, this.addRewardPool, [index]));
        //                 this.jackpotPercent[index] = Number(key);
        //                 return;
        //             }
        //         } else {
        //             continue;
        //         }
        //     } else {
        //         this.jackpotPercent[index] = Number(key);
        //         Laya.Tween.to(this.jackpotNum[index], { num: changeNum }, 60 * 1000, undefined, new Laya.Handler(this, this.addRewardPool, [index]));
        //         return;
        //     }
        // }
    }
    /**开始添加彩金池 */            startAddRewardPool() {
        // for (let index = 0; index < this.roomNum - 1; index++) {
        //     this.addRewardPool(index);
        // }
    }
    /**停止添加彩金池 */            stopAddRewardPool() {
        // for (let index = 1; index < this.roomNum; index++) {
        //     Laya.Tween.clearAll(this.jackpotNum[index]);
        // }
    }
    /////////////////玩家进出
    //自己enterRoom更新房间信息
    setRoomInfo(data) {
        if (!data) return;
        this.room_type = data.room_type;
        BattleData.Instance.initBattleInfos();
        this.cur_scene_id = data.cur_scene_id;
        this.last_scene_id = data.last_scene_id;
        let sceneArr = [];
        let sceneData = GameModel.getJson("allfishScript");
        sceneArr = sceneData[this.room_type];
        let sceneInfo = sceneArr.filter(data => data.SceneID == this.cur_scene_id)[0];
        console.log({
            sceneData: sceneData
        });
        console.log("**********allfishScript");
        console.log({
            sceneInfo: sceneInfo
        });
        // let sceneInfo = g_ConfigerHelper.getCachedValueFirst("allfishScript", "SceneID", this.cur_scene_id, this.room_type);
                        if (!sceneInfo) {
            GlobalFunc.log("无法从allfishscript中找到对应的sceneid信息", this.cur_scene_id, this.room_type);
            // return;
                        } else {
            this.scene_type = Number(sceneInfo.type);
            this.scene_end_time = sceneInfo.endtime * 1e3;
        }
        this.startUpdateTime(data.time_msec_offset);
        //todo:skill_cd,use_items,reborn_fishs,die_fish_ids
        // todo:适配新的协议,房间技能和物品信息 use_items
                        this.die_fish_ids = data.die_fish_ids;
        this.reborn_fishs = data.reborn_fishs;
        this.use_items = data.use_items;
        this.initSeatNode(data.room_players);
        //技能信息,锁定狂暴暂不做恢复
        //冰冻信息
        this.skillInfo = {
            freezeData:{
                freezeEndTime:data.freezeEndTime,
                freezeMillis:data.freezeMillis,
                seat:data.freezeSeat || data.seat,
            },
        };
        
    }
    /**初始化房间座位信息 */            
    initSeatNode(players) {
        if (!players) return;
        for (let index = 0; index < players.length; index++) {
            let playerInfo = players[index];
            let seat = playerInfo.room_pos + 1;
            if (playerInfo.uid == GameData.Instance.uid) {
                FishData.mySeatIndex = seat;
                this.isFlip = FishData.mySeatIndex == 3 || FishData.mySeatIndex == 4;
            }
            // let playerData = new RoomPlayerInfoNode_1.default();
            // playerData.initPlayerInfo(playerInfo);
            // this.roomPlayerData[seat] = playerData;
        }
    }
    /**其他玩家进入房间广播更新数据 */            
    updateSeatInfo(serverData) {
        let seat = serverData.room_pos + 1;
        // let playerData = new RoomPlayerInfoNode_1.default();
        // playerData.initPlayerInfo(serverData);
        // this.roomPlayerData[seat] = playerData;
    }
    /**其他玩家离开房间广播重置数据 */            updateSitInfoByLeave(data) {
        this.roomPlayerData[data.room_pos + 1].isInRoom = false;
        // delete this.roomUidSeatData[data.uid];
                }
    /**自己离开房间重置所有数据 */            updateSelfInfoByLeave() {
        for (let i = 0; i < this.roomPlayerData.length; ++i) {
            if (!this.roomPlayerData[i]) continue;
            this.roomPlayerData[i].isInRoom = false;
        }
    }
    /**设置玩家特色鱼状态 */            setPlayerSpecialState(isPlay, seatIndex, name) {
        this.roomPlayerData[seatIndex][name] = isPlay;
    }
    /**房间内使用道具 */            roomUseItem(data) {
        if (!!!data.item_info) return;
        let inData = data.item_info;
        if (inData.item_id > 10 && inData.item_id <= 18) {
            this.resDaoDanFire(data);
            // globalFun.log(g_GameData.uid);
            // globalFun.log(inData.uid);
            GameData.Instance.uid == inData.uid && EventDis.Instance.dispatchEvent(GlobalVar.ROOM_USE_DAO_DAN_NOTICE, data);
        } else {}
    }
    resDaoDanFire(data) {
        let inData = data.item_info;
        let fishNode = FishData.fishNodesObj[inData.fish_id];
        let callBack = new Laya.Handler(this, this.fishHit, [ inData ]);
        let daoDanData = {
            item_id: inData.item_id,
            seatIndex: BattleData.Instance.getUserSeatByUid(inData.uid),
            fish_id: inData.fish_id,
            fishNode: fishNode,
            callBack: callBack
        };
        EventDis.Instance.dispatchEvent(GlobalVar.DAO_DAN_BOMB, daoDanData);
    }
    fishHit(data) {
        let goldAddNum = GlobalFunc.getItemNumFromArr(data.drops.items, +GlobalConst.goldKey);
        let diamondAddNum = GlobalFunc.getItemNumFromArr(data.drops.items, +GlobalConst.goldKey);
        let param = {
            uid: data.uid,
            fish_id: data.fish_id,
            drops: data.drops,
            gold: PlayerData.Instance.getItemNum(GlobalConst.goldKey) + goldAddNum,
            diamond: PlayerData.Instance.getItemNum(GlobalConst.diamondKey) + diamondAddNum
        };
        EventDis.Instance.dispatchEvent("killFish_broad", param);
    }
}