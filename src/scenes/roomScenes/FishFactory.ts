import { EventDis } from "../../Helpers/EventDis";
import { FishData } from "../../datas/FishData";
import GlobalConst from "../../const/GlobalConst";
import { SceneManager } from "../../common/SceneManager";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import { BattleData } from "../../datas/BattleData";
import { GameModel } from "../../game/GameModel";
import { ConfigerHelper } from "../../Helpers/ConfigerHelper";
import GlobalVar from "../../const/GlobalVar";
import { FishLineData } from "../../datas/FishLineData";
import { DragonBallFishNode } from "../../fishNodes/DragonBallFishNode";
import { FishNode } from "../../fishNodes/FishNode";
import { CrabNode } from "../../fishNodes/CrabNode";

export class FishFactory{
    _teamIndex: number;
    _lastTeamDelay: number;
    sceneStartTime: any;
    cur_scene_id: any;
    fishTeamInfos: any;
    _lastLoadTeamTime: any;
    _index: any;
    _lastLoadOneTime: number;
    _totalDelay: number;
    _freezeTime: any;
    constructor() {
        this._teamIndex = 0;
        //记录当期scene播放的teamindex
        this._lastTeamDelay = 0;
        //记录上一个team的delay时间
        this.initData();
        this.initEvent();
    }
    destroy() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
        var oldFishNodes = FishData.fishNodesObj;
        SceneManager.Instance.clearLayer(GlobalConst.roLayer);
        for (let i in oldFishNodes) {
            let fish = oldFishNodes[i];
            fish && fish.destroy();
        }
        FishData.fishNodesObj = {};
    }
    initData() {
        FishData.fishNodesObj = {};
        this.sceneStartTime = GlobalFunc.getClientTime();
    }
    initEvent() {
        EventDis.Instance.addEvntListener("fishDead", this, this.handleDeadFish);
        EventDis.Instance.addEvntListener("rebornFish", this, this.reBornFish);
    }
    handleDeadFish(fishUniqId) {
        delete FishData.fishNodesObj[fishUniqId];
    }
    //Team.json
    // {"SceneID":"41","TeamID":"1003","Delay":"0","TeamSpeed":"0.05","Formation":"102;103"},
    //formations.json
    //  {"FormationID":"1","FormationIndex":"2","FishID":"1","PathID":"1001",
    // "Type":"0","Per":"0.08","Radius":"0","R_Velocity":"0","Angle":"0","A_Velocity":"0"},
    //SceneID表示一个鱼潮场景，场景里的每条鱼有自己的uniqueId,和服务端对应
    //一条鱼线(formation) =  fishId(鱼种类和属性）+ delay(出场延迟) + xy偏移旋转 + path(鱼路径)
    //鱼阵(TeamId) = formation(N) + delay(鱼阵整体delay) + 速度（采点间隔）
    //uniqueId = TeamId + FormationID + FormationIndex  
    //Scene ->Team ->formation ->FormationIndex
    //进房间如果30秒内刚切鱼阵，则进行恢复
    lastSceneLoad() {
        if (BattleData.Instance.FishSceneTime > 30 * 1e3) return;
        let json = GameModel.getJson("FishTeam");
        let last_scene_id = BattleData.Instance.last_scene_id;
        let fishTeamInfos = json[last_scene_id];
        let sceneInfo = ConfigerHelper.Instance.getCachedValue("allfishScript", "SceneID", last_scene_id, BattleData.Instance.room_type);
        let last_scene_time = sceneInfo.endtime * 1e3;
        let allTime = BattleData.Instance.FishSceneTime + last_scene_time;
        GameModel.getJson("Formations");
        for (let i = 0; i < fishTeamInfos.length; ++i) {
            let teamInfo = fishTeamInfos[i];
            if (teamInfo.Reborn == "true") continue;
            let teamDelay = teamInfo.TeamDelay * 1e3;
            let formationsIds = teamInfo.Formation;
            let formationsIdArr = formationsIds.split(";");
            for (let j = 0; j < formationsIdArr.length; ++j) {
                let formationId = Number(formationsIdArr[j]);
                this.loadFormation(formationId, teamInfo, allTime - teamDelay);
                // globalFun.log("llllllllllllll", formationId);
            }
        }
    }
    //第一次进房间加载team
    firstLoad() {
        BattleData.Instance.scene_type == 0 && !!BattleData.Instance.last_scene_id && this.lastSceneLoad();
        this.cur_scene_id = BattleData.Instance.cur_scene_id;
        // this.cur_scene_id = 101;
                        var json = GameModel.getJson("FishTeam");
        if (!json) return;
        this.fishTeamInfos = json[this.cur_scene_id];
        this.fishTeamInfos.sort(GlobalFunc.compare("TeamDelay"));
        var FishSceneTime = BattleData.Instance.FishSceneTime;
        GameModel.getJson("Formations");
        //按时间顺序遍历team
        for (var i = 0; i < this.fishTeamInfos.length; ++i) {
            var teamInfo = this.fishTeamInfos[i];
            if (teamInfo.Reborn == "true") continue;
            var teamDelay = teamInfo.TeamDelay * 1e3;
            this._teamIndex = i;
            //30秒内的已刷的team要恢复现场，30秒以上的就不管了 //FishSceneTime - teamDelay < 30000
            //这里如果是鱼阵的话,因为所有鱼都是一开始同一时间生成的，所以不能有30秒的限制
                                if (teamDelay < FishSceneTime) {
                var formationsIds = teamInfo.Formation;
                var formationsIdArr = formationsIds.split(";");
                for (var j = 0; j < formationsIdArr.length; ++j) {
                    var formationId = Number(formationsIdArr[j]);
                    this.loadFormation(formationId, teamInfo, FishSceneTime - teamDelay);
                }
                //待刷的team
                                } else if (teamDelay >= FishSceneTime) {
                this._lastTeamDelay = FishSceneTime;
                this._lastLoadTeamTime = GlobalFunc.getClientTime();
                this.loadAllTeams();
                break;
            }
        }
        // this._index = 0;
        // Laya.timer.frameLoop(1, this, this._loadTeam)
        BattleData.Instance.die_fish_ids = null;
    }
    /**
    * 加载鱼帧
    */       
    _loadTeam() {
        if (this._index >= this.fishTeamInfos.length) {
            Laya.timer.clear(this, this._loadTeam);
            return;
        }
        var teamInfo = this.fishTeamInfos[this._index];
        if (teamInfo.Reborn == "true") return;
        var teamDelay = teamInfo.TeamDelay * 1e3;
        this._teamIndex = this._index;
        GameModel.getJson("Formations");
        //30秒内的已刷的team要恢复现场，30秒以上的就不管了 //FishSceneTime - teamDelay < 30000
        //这里如果是鱼阵的话,因为所有鱼都是一开始同一时间生成的，所以不能有30秒的限制
                        if (teamDelay < BattleData.Instance.FishSceneTime) {
            var formationsIds = teamInfo.Formation;
            var formationsIdArr = formationsIds.split(";");
            for (var j = 0; j < formationsIdArr.length; ++j) {
                var formationId = Number(formationsIdArr[j]);
                this.loadFormation(formationId, teamInfo, BattleData.Instance.FishSceneTime - teamDelay);
            }
            //待刷的team
            } else if (teamDelay >= BattleData.Instance.FishSceneTime) {
            this._lastTeamDelay = BattleData.Instance.FishSceneTime;
            this._lastLoadTeamTime = GlobalFunc.getClientTime();
            this.loadAllTeams();
            this._index == this.fishTeamInfos.length;
            Laya.timer.clear(this, this._loadTeam);
        }
        this._index++;
    }
    //每次切换scene时调用
    switchFishTeam(cur_scene_id) {
        GlobalFunc.log("切换场景：", this.cur_scene_id, cur_scene_id);
        this.cur_scene_id = cur_scene_id;
        Laya.timer.clear(this, this.loadOneTeam);
        this._lastLoadOneTime = this._lastLoadTeamTime = this._totalDelay = this._lastTeamDelay = 0;
        this._teamIndex = 0;
        //读取鱼组配置
        var json = GameModel.getJson("FishTeam");
        if (!json) return;
        this.fishTeamInfos = json[this.cur_scene_id];
        this.fishTeamInfos.sort(GlobalFunc.compare("TeamDelay"));
        this.loadAllTeams();
    }
    /**类似递归的方式加载当前scene所有team
一个接一个*/            loadAllTeams() {
        if (this._teamIndex >= this.fishTeamInfos.length) return;
        var teamInfo = this.fishTeamInfos[this._teamIndex];
        var teamDelay = teamInfo.TeamDelay * 1e3;
        //计时器延迟补偿
                        var delta = this._lastLoadOneTime - this._lastLoadTeamTime - this._totalDelay || 0;
        this._totalDelay = teamDelay - this._lastTeamDelay - delta;
        this._lastTeamDelay = teamDelay;
        this._lastLoadTeamTime = GlobalFunc.getClientTime();
        // globalFun.log("ddddddddddd", delta, this._totalDelay)
                        if (this._totalDelay > 0) {
            Laya.timer.once(this._totalDelay, this, this.loadOneTeam);
        } else {
            this.loadOneTeam(-this._totalDelay);
        }
    }
    /**1.加载fishTeam */            loadOneTeam(startDiff = 0) {
        // if (FishData.isRoomFreezing) return;
        let preload = GameModel.getJson("Formations");
        ConfigerHelper.Instance._configCachedFiles["fishlocker"] = GameModel.getJson("fishlocker");
        var teamInfo = this.fishTeamInfos[this._teamIndex];
        var formationsIds = teamInfo.Formation;
        var formationsIdArr = formationsIds.split(";");
        if (GlobalVar.isOpenTeamLog) {
            GlobalFunc.log("start fishteam withDiff :", teamInfo.TeamID, startDiff);
        }
        GameModel.getJson("Formations");
        for (var j = 0; j < formationsIdArr.length; ++j) {
            var formationId = Number(formationsIdArr[j]);
            if (!formationId) continue;
            if (teamInfo.Reborn == "true") continue;
            this.loadFormation(formationId, teamInfo, startDiff);
        }
        this._teamIndex++;
        this._lastLoadOneTime = GlobalFunc.getClientTime();
        this.loadAllTeams();
    }
    /**2.加载formation */            loadFormation(formationId, teamInfo, startDiff) {
        var formationFile = GameModel.getJson("Formations");
        if (!formationFile) return;
        if (GlobalVar.isOpenTeamLog) {
            GlobalFunc.log("start formation :", formationId);
        }
        var formations = formationFile[formationId];
        if (!formations) {
            GlobalFunc.log("can not find this formation :", formationId);
            return;
        }
        //3.加载每条鱼
                        for (var i = 0; i < formations.length; ++i) {
            var oneFishInfo = formations[i];
            var indexDelay = Number(oneFishInfo.IndexDelay) * 1e3;
            //加载鱼
                                var lineId = oneFishInfo.PathID;
            let isFirstLine = FishLineData.Instance.newUserFishLines.filter(line => line == lineId + ".json").length != 0;
            let lineData = GameModel.getJson(lineId);
            if (!lineData) {
                GlobalFunc.log("can not find lineData");
                continue;
            }
            FishLineData.Instance.fishLineObj[lineId] = lineData;
            var fishUniqId = teamInfo.TeamID + "_" + formationId + "_" + oneFishInfo.FormationIndex;
            //首次进场时，非自然死亡的鱼不刷
            var dieFishes = BattleData.Instance.die_fish_ids;
            if (!!dieFishes) {
                var flag = false;
                for (let index = 0; index < dieFishes.length; ++index) {
                    if (dieFishes[index].fish_id == fishUniqId) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    GlobalFunc.log("跳过已死亡的鱼：", fishUniqId);
                    continue;
                }
            }
            var fishNode;
            if (oneFishInfo.FishID == "290" || oneFishInfo.FishID == "390" || oneFishInfo.FishID == "490") {
                fishNode = new DragonBallFishNode();
            } else {
                fishNode = Laya.Pool.getItemByClass("fishNode", FishNode);
            }
            var param = {
                fishUniqId: fishUniqId,
                oneFishInfo: oneFishInfo,
                lineSpeed: teamInfo.TeamSpeed,
                startDiff: startDiff,
                indexDelay: indexDelay
            };
            fishNode.initFish(param);
        }
    }
    pauseFishLoad() {
        this._freezeTime = GlobalFunc.getClientTime();
        Laya.timer.clear(this, this.loadAllTeams);
    }
    /**恢复鱼线 */            
    resumeFishLoad() {
        // FishData.isRoomFreezing = false;
        if (this._teamIndex < this.fishTeamInfos.length) {
            this._totalDelay -= this._freezeTime - this._lastLoadTeamTime;
            this._lastLoadTeamTime = GlobalFunc.getClientTime();
            Laya.timer.once(this._totalDelay, this, this.loadOneTeam);
        }
        for (var index in FishData.fishNodesObj) {
            FishData.fishNodesObj[index].resumeLine();
        }
    }
    /**boss重生*/            
    reBornFish(data) {
        //如果不是boss场，直接return，容错
        GameModel.getJson("Formations");
        let isNotContinue = !(BattleData.Instance.scene_type == 1 && (this.cur_scene_id == 48 || this.cur_scene_id == 58 || this.cur_scene_id == 1008)) && this.cur_scene_id != 101;
        if (isNotContinue) return;
        let fishes = data.fishs;
        //根据后端给的fish_id去对应配置里面找出需要的信息
        for (let i = 0; i < fishes.length; ++i) {
            let fish = fishes[i];
            let fish_id = fish.fish_id;
            this.checkFish(fish_id);
            let reborn_msec_offset = fish.reborn_msec_offset || 0;
            let fishInfo = GlobalFunc.getFishCfgIds(fish_id);
            let formationId = fishInfo.formationId;
            let formationIndex = fishInfo.formationIndex;
            let teamId = fishInfo.teamId;
            let formations = ConfigerHelper.Instance.getCachedValueByKey("Formations", [ formationId ]);
            for (let j = 0; j < formations.length; ++j) {
                let formation = formations[j];
                if (formation.FormationIndex != formationIndex) continue;
                let fishType = formation.FishID;
                let lineId = formation.PathID;
                let fishLine = GameModel.getJson(lineId);
                if (!fishLine) continue;
                let fish;
                let param;
                FishLineData.Instance.fishLineObj[lineId] = fishLine;
                if (isNotContinue) return;
                if (fishType == "27" || fishType == "3100") {
                    //螃蟹特殊处理
                    fish = new CrabNode();
                    param = {
                        fishUniqId: fish_id,
                        startDiff: reborn_msec_offset,
                        lineId: formationIndex % 2
                    };
                } else if (fishType == "30" || fishType == "32" || fishType == "3200" || fishType == "3300" || fishType == "3000") {
                    //熔岩巨兽，机械鲨鱼等boss和普通鱼一样产生
                    fish = Laya.Pool.getItemByClass("fishNode", FishNode);
                    let teamSpeed = 60;
                    for (let i = 0; i < this.fishTeamInfos.length; ++i) {
                        if (teamId == this.fishTeamInfos[i].TeamID) {
                            teamSpeed = this.fishTeamInfos[i].TeamSpeed;
                            break;
                        }
                    }
                    param = {
                        fishUniqId: fish_id,
                        oneFishInfo: formation,
                        lineSpeed: teamSpeed,
                        startDiff: reborn_msec_offset,
                        indexDelay: 0
                    };
                }
                if (!fish) continue;
                fish.initFish(param);
                GlobalFunc.log("boss出生" + fishType);
                break;
            }
        }
    }
    /**检查boss是否合法,如果已存在，就把前一个删掉 */            
    checkFish(fish_id) {
        let fishs = FishData.fishNodesObj;
        for (let i in fishs) {
            let fish = fishs[i];
            if (fish.fishUniqId == fish_id) {
                EventDis.Instance.dispatchEvent("fishDead", fish_id);
                fish.destroy();
            }
        }
    }
}