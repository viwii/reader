import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalConst from "../const/GlobalConst";
import {BattleData} from "../datas/BattleData"
import { GameData } from "../datas/GameData";
import { HallData } from "../datas/HallData";
import { PlayerData } from "../datas/PlayerData";

class GlobalObj{
    static createItemObj(data, key, num) {
        let img = new Laya.Image(Laya.ResourceVersion.addVersionPrefix("res/icon/icon_" + data.skin));
        let scaleX = 90 / img.width;
        let scaleY = 90 / img.height;
        let scale = scaleX < scaleY ? scaleX : scaleY;
        // scale = scale >= 1 ? 1 : scale;
        scale = 1;
        let obj = {
            mouseEnabled: true,
            itemSelect: {
                visible: false
            },
            itemImage: {
                skin: "res/icon/icon_" + data.skin,
                scaleX: scale,
                scaleY: scale
            },
            box_equip: {
                visible: Number(key) > 100,
                image_noItem: {
                    visible: false
                },
                image_equiped: {
                    visible: false
                }
            },
            box_tools: {
                visible: Number(key) <= 100,
                image_itemFree: {
                    visible: false
                },
                text_expire: {
                    visible: false
                },
                text_itemNum: {
                    text: "",
                    visible: false
                }
            },
            sortID: Number(data.sortId),
            itemID: Number(key),
            itemNum: num
        };
        let serTime = Number(GameData.serverTimeStamp) || parseInt((GlobalFunc.getClientTime() / 1e3).toString());
        if (Number(key) <= 100) {
            obj.box_tools.image_itemFree.visible = data.needDiamond == -1;
            obj.box_tools.text_expire.visible = typeof num == "string" && Number(num) - serTime < 86400 && Number(num) - serTime > 0;
            if (num > 0) {
                obj.box_tools.text_itemNum.visible = true;
                obj.box_tools.text_itemNum.text = "x" + num;
                if (typeof num == "string" && +num * 1e3 < serTime) {
                    obj.box_tools.text_itemNum.text = "x" + 0;
                    obj.box_tools.text_itemNum.visible = false;
                } else if (typeof num == "string") {
                    obj.box_tools.text_itemNum.text = "x" + 1;
                }
            }
        }
        return obj;
    }
    
    static createItemObjEmpty() {
        let obj = {
            mouseEnabled: false,
            itemSelect: {
                visible: false
            },
            itemImage: {
                skin: ""
            },
            box_equip: {
                visible: false,
                image_noItem: {
                    visible: false
                },
                image_equiped: {
                    visible: false
                }
            },
            box_tools: {
                visible: false,
                image_itemFree: {
                    visible: false
                },
                text_expire: {
                    visible: false
                },
                text_itemNum: {
                    text: "",
                    visible: false
                }
            },
            sortID: 0,
            itemID: -1,
            itemNum: 0
        };
        return obj;
    }
    
    /**获取二级大厅obj */            
    static createRoomObj(spine, jackpotNode, fishData, fishBox) {
        let obj = {
            room_type: BattleData.Instance.room_type,
            mouseThrough: true,
            width: 444,
            box_spine: {
                room_spine: undefined
            },
            box_ticket: {
                img_getTicket: {
                    skin: "res/icon/img_roomName_" + (Number(BattleData.Instance.room_type) - 1) + ".png"
                }
            },
            spine: spine,
            jackpotNode: jackpotNode,
            fishBox: fishBox
        };
        return obj;
    }
    
    /**获取奖池排行榜obj */            
    static createJackpotRanking(playData) {
        let obj = {
            img_playerHead: {
                skin: playData.headUrl
            },
            text_playerName: {
                text: playData.name
            },
            text_playerNum: {
                text: Number(playData.num).toLocaleString()
            },
            text_vipGrade: {
                text: playData.vip_level.toString()
            },
            timeStamp: playData.timeStamp
        };
        return obj;
    }
    
    /**
    * 获取切换炮座obj
    * @param cannonData 炮管信息
    * @param equipCannon 装备的炮管ID
    * @param hasCannon 时候拥有该炮管
    */            
   static createChangeCannonObj(cannonData, equipCannon, hasCannon) {
        let btnMouse = equipCannon != cannonData.itemID;
        let btnSkin;
        let btnStroke;
        let btnLabel;
        if (!hasCannon) {
            btnSkin = "basePic/btn_yellow.png";
            btnStroke = "#70200b";
            btnLabel = "获取";
        } else if (Number(cannonData.itemID) == equipCannon) {
            btnSkin = "noZip/btn_gray.png";
            btnStroke = "#0b3170";
            btnLabel = "已装备";
        } else {
            btnSkin = "noZip/btn_green.png";
            btnStroke = "#226306";
            btnLabel = "装备";
        }
        let obj = {
            text_cannon: {
                text: cannonData.itemName
            },
            btn_equip: {
                skin: btnSkin,
                mouseEnabled: btnMouse,
                label: btnLabel,
                labelStrokeColor: btnStroke
            },
            img_cannon: {
                skin: "res/icon/skin_" + cannonData.skin
            },
            img_suo: {
                visible: !hasCannon
            },
            cannonID: +cannonData.itemID,
            state: btnLabel
        };
        return obj;
    }
    
    /**获取活动标签Obj */            
    static createActivityTabsObj(data, isactivity = false, len) {
        let obj = {
            btn_tabs: {
                width: 202,
                centerX: 0,
                skin: "noZip/btn_1.png",
                label: isactivity ? data.type : data.name,
                labelStrokeColor: "#0b3170"
            },
            img_red: {
                visible: len > 1 && HallData.Instance.getActivityRedState(isactivity ? data.type : data.name)
            },
            viewID: data.viewID
        };
        return obj;
    }
    
    /**获取鱼鉴特色鱼obj */            
    static createSpecialFish(fishData, textDatas) {
        let fishName = fishData.Name;
        if (fishData.type == "40") {
            fishName = "奖券鱼";
        } else if (fishData.type == "50") {
            fishName = "导弹碎片";
        }
        let obj = {
            img_fishIcon: {
                skin: "res/icon/" + fishData.Icon + ".png"
            },
            text_fishName: {
                text: fishName
            },
            box_text0: {
                visible: textDatas[0].visible
            },
            box_text1: {
                visible: textDatas[1].visible
            },
            box_text2: {
                visible: textDatas[2].visible
            },
            box_text3: {
                visible: textDatas[3].visible
            },
            text_describe0: {
                text: textDatas[0].text
            },
            text_describe1: {
                text: textDatas[1].text
            },
            text_describe2: {
                text: textDatas[2].text
            },
            text_describe3: {
                text: textDatas[3].text
            },
            text_help: {
                visible: textDatas[4].visible,
                text: textDatas[4].text
            }
        };
        return obj;
    }
    
    /**获取登陆转盘奖励信息obj */            
    static createHallRouletteObj(rewardNode) {
        let itemIcon = "common/" + rewardNode.skin;
        let img = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(itemIcon));
        let scale = 70 / img.width;
        let obj = {
            img_itemIcon: {
                skin: itemIcon,
                scaleX: scale,
                scaleY: scale
            },
            text_itemNum: {
                text: rewardNode.ItemNum
            },
            rotation: Number(rewardNode.AwardIndex) * 36,
            itemId: Number(rewardNode.ItemId),
            itemNum: Number(rewardNode.ItemNum)
        };
        return obj;
    }
    
    /**获取奖励界面物品obj */            
    static createRewardItemObj(data) {
        let itemIcon;
        if (data.item_id == 1 || data.item_id == 5) {
            itemIcon = "res/icon/skin_goldCoin.png";
        }
        if (data.item_id == 2 || data.item_id == 6) {
            itemIcon = "skin/skin_diamond.png";
        }
        if (data.item_id == GlobalConst.PointID) {
            itemIcon = "res/icon/icon_point.png";
        }
        !!!itemIcon && (itemIcon = "res/icon/icon_" + PlayerData.Instance.getItemData(data.item_id).skin);
        let obj = {
            icon: itemIcon,
            num: data.item_count,
            id: data.item_id
        };
        return obj;
    }
    
    /**获取合成物品obj */            
    static createComposeItemObj(item) {
        let obj = {
            itemName: {
                text: item.name
            },
            itemSkin: {
                skin: "res/icon/icon_" + item.skin
            },
            itemNum: {
                text: "1"
            },
            btn_reduce: {
                mouseEnabled: true,
                skin: "common/btn_-_0.png"
            },
            btn_plus: {
                mouseEnabled: true,
                skin: "common/btn_+_0.png"
            },
            box_needNum: {
                text_needNum: {
                    text: item.composeNum,
                    color: "#68ff3f",
                    strokeColor: "#004719"
                }
            },
            btn_compose: {
                skin: "basePic/btn_yellow.png",
                labelStrokeColor: "#70200b",
                labelColors: "#ffffff"
            },
            itemData: item
        };
        return obj;
    }
    
    /**获取合成记录Obj */            
    static createComposeRecordObj(data) {
        let item = PlayerData.Instance.getItemData(+data.dst_item_id);
        let time = GlobalFunc.getTime(data.time * 1e3);
        let days = (time.days + "").length == 1 ? "0" + time.days : time.days;
        let minutes = (time.minutes + "").length == 1 ? "0" + time.minutes : time.minutes;
        let obj = {
            text_time: {
                text: time.years + "/" + time.months + "/" + days + " " + time.hours + ":" + time.minutes
            },
            text_used: {
                text: "合成" + item.itemName + "*" + data.dst_item_count
            },
            text_composed: {
                text: "消耗" + data.debris_count + "碎片"
            }
        };
        return obj;
    }
}