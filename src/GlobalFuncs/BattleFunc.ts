import { BattleData } from "../datas/BattleData";
import GlobalConst from "../const/GlobalConst";
import { PlayerData } from "../datas/PlayerData";
import { DialogManager } from "../common/DialogManager";
import { FishData } from "../datas/FishData";
import { GameData } from "../datas/GameData";
import GlobalFunc from "./GlobalFunc";
import { UIUtils } from "../game/utils/UIUtils";
import { SceneManager } from "../common/SceneManager";
import { EventDis } from "../Helpers/EventDis";

export class BattleFunc{
    static getFishUniqId(teamId, formationId, formationIndex) {
        return teamId + "_" + formationId + "_" + formationIndex;
    }
    
    //数组掉落合并，同itemID数量相加,去重
    static getDropMapByItems(items) {
        var kMap = {};
        for (let k in items) {
            let v = items[k];
            var kv = kMap[v.item_id];
            !kv && (kv = 0);
            kv = kv + v.count;
            kMap[v.item_id] = kv;
        }
        return kMap;
    }
    
    //资源变化,所有最终资源的数值更新都走这里
    static resChangeFunc(seatIndex, data) {
        BattleData.Instance.setSitPlayerInfoByObj(seatIndex, {
            gold: data.gold,
            ticket: data.liquan ? data.liquan : BattleData.roomPlayerData[seatIndex].ticket
        },null);
        //更新自己金币
        if (seatIndex == FishData.mySeatIndex) {
            let ticketData = data.drops && data.drops.items ? data.drops.items : [];
            let ticket = 0;
            let debris = 0;
            let point = 0;
            ticketData.forEach(e => {
                e.item_id == GlobalConst.ticket && (ticket = e.count);
                e.item_id == +GlobalConst.DebrisID && (debris = e.count);
                e.item_id == +GlobalConst.PointID && (point = e.count);
            });
            PlayerData.Instance.setItemNum(GlobalConst.GoldCoinID, data.gold);
            PlayerData.Instance.addItemsNum([ {
                item_id: 4,
                item_count: !!ticket ? ticket : 0
            } ], false, false);
            PlayerData.Instance.addItemsNum([ {
                item_id: +GlobalConst.DebrisID,
                item_count: debris
            } ], false, false);
            PlayerData.Instance.addItemsNum([ {
                item_id: +GlobalConst.PointID,
                item_count: point
            } ], false, false);
        }
    }
    
    //渔场检测没钱弹出界面
    static checkFishPop() {
        DialogManager.Instance.dlgQueue = [];
        let popDlg = [];
        let sad = FishData.popindex;
        let sad1 = GameData.Instance.isFirstRecharge;
        let sad2 = GameData.Instance.tehuiState1;
        let sad3 = GameData.Instance.tehuiState2;
        let sad4 = !GlobalFunc.isHasNewTehuiGift();
        if (GameData.Instance.isHelping) return;
        UIUtils.showDisplay("ShopDialog", this, () => {
            UIUtils.showDisplay("MonthCardDlg", this, () => {
                UIUtils.showDisplay("GiftScDlg", this, () => {
                    UIUtils.showDisplay("GiftKyDlg", this, () => {
                        UIUtils.showDisplay("GiftKyDlg", this, () => {
                            UIUtils.showDisplay("GiftNewThDlg", this, () => {
                                if (!GlobalFunc.isIos() && FishData.popCount < GlobalConst.dlgPopMax) {
                                    // if (FishData.popindex <= 1 && popDlg.length == 0 && !GameData.isFirstRecharge && PlayerData.left_count == 0 && FishData.isshowSc) {
                                    //     let dlg = new GiftScDlg_1.GiftScDlg();
                                    //     popDlg.push(dlg);
                                    //     FishData.popindex = 2;
                                    //     FishData.popCount++;
                                    // }
                                    // if (FishData.popindex <= 1 && popDlg.length == 0 && GameData.tehuiState1 != 2) {
                                    //     if (PlayerData.left_count == 0) {
                                    //         if (sad1 || !FishData.isshowSc) {
                                    //             let dlg = new GiftKyDlg_1.GiftKyDlg();
                                    //             popDlg.push(dlg);
                                    //             FishData.popindex = 2;
                                    //             FishData.popCount++;
                                    //         }
                                    //     } else {
                                    //         let dlg = new GiftKyDlg_1.GiftKyDlg();
                                    //         popDlg.push(dlg);
                                    //         FishData.popindex = 2;
                                    //         FishData.popCount++;
                                    //     }
                                    // }
                                    // if (FishData.popindex <= 1 && popDlg.length == 0 && GameData.tehuiState2 != 2) {
                                    //     if (PlayerData.left_count == 0) {
                                    //         if (sad1 || !FishData.isshowSc) {
                                    //             let dlg = new GiftKyDlg_1.GiftKyDlg();
                                    //             popDlg.push(dlg);
                                    //             FishData.popindex = 2;
                                    //             FishData.popCount++;
                                    //         }
                                    //     } else {
                                    //         let dlg = new GiftKyDlg_1.GiftKyDlg();
                                    //         popDlg.push(dlg);
                                    //         FishData.popindex = 2;
                                    //         FishData.popCount++;
                                    //     }
                                    // }
                                    // if (FishData.popindex <= 1 && popDlg.length == 0 && GlobalFunc.isHasNewTehuiGift()) {
                                    //     if (PlayerData.left_count == 0) {
                                    //         if (sad1 || !FishData.isshowSc) {
                                    //             let dlg = new GiftNewThDlg();
                                    //             popDlg.push(dlg);
                                    //             FishData.popindex = 2;
                                    //             FishData.popCount++;
                                    //         }
                                    //     } else {
                                    //         let dlg = new GiftNewThDlg();
                                    //         popDlg.push(dlg);
                                    //         FishData.popindex = 2;
                                    //         FishData.popCount++;
                                    //     }
                                    // }
                                    // if (FishData.popindex <= 1 && popDlg.length == 0) {
                                    //     let dlg = new ShopDialog(false);
                                    //     popDlg.push(dlg);
                                    //     FishData.popCount++;
                                    // }
                                    FishData.popindex = 0;
                                    FishData.isshowSc = !FishData.isshowSc;
                                }
                                let dlg = null;
                                popDlg.push(dlg);
                                let len = popDlg.length;
                                let dlg1 = popDlg[0];
                                for (let i = 0; i < len; i++) {
                                    let dlg = popDlg.pop();
                                    // len > 1 && DialogManager.addDlg(dlg, popDlg.length == 0);
                                    // if (i == 0) {
                                    //     if (dlg == null && len == 1) {
                                    //         if (PlayerData.Instance.left_count > 0) {
                                    //             GameData.isHelping = true;
                                    //             EventDis.Instance.dispatchEvent("showHelp");
                                    //             return;
                                    //         } else {
                                    //             dlg1 = new WarningMessage_1.WarningMessage("今日救济金已领完，明日还可领取", true, undefined);
                                    //         }
                                    //     }
                                    //     if (!(dlg1 instanceof WarningMessage_1.WarningMessage)) {
                                    //         GlobalFunc.log("礼包添加" + dlg1);
                                    //         SceneManager.Instance.addToMiddLayer(dlg1, GlobalConst.dialogLayer);
                                    //     }
                                    // }
                                }
                            });
                        });
                    });
                });
            });
        });
    }
    /**检测飞机场没钱弹出界面 */            
    static checkFlyWarPop(flag) {
        if (GlobalFunc.isIos()) {
            if (PlayerData.Instance.left_count > 0) {
                EventDis.Instance.dispatchEvent("fiy_show_help", true);
            }
        } else {
            let handler = new Laya.Handler(this, () => {
                EventDis.Instance.dispatchEvent("fiy_show_help", true);
            });
            if (PlayerData.Instance.left_count <= 0) {
                handler = null;
            }
        }
    }
}