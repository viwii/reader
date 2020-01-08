import GlobalConst from "../const/GlobalConst";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import OnOffManager from "../const/OnOffManager";
import { WaitManager } from "./WaitManager";
import { FishData } from "../datas/FishData";
import { PlayerData } from "../datas/PlayerData";
import { GameData } from "../datas/GameData";
import { SceneManager } from "./SceneManager";
import { EventDis } from "../Helpers/EventDis";

export class DialogManager{
    isDoDel: boolean;
    dlgQueue: any[];
    DialogStackArr: any[];
    _nowDlg: string;
    openingDialog: boolean;
    static _Instance:any;
    static get Instance(){
        if (DialogManager._Instance == null){
            DialogManager._Instance = new DialogManager;
        }

        return DialogManager._Instance;
    }
    constructor() {
        /**
 * 记录打开的界面
 */
        this.isDoDel = false;
        this.dlgQueue = [];
        /**
 * 弹窗栈列表
 */                this.DialogStackArr = [];
        this._nowDlg = "";
    }
    /**
* 获取dialog实例
*/            set nowDlg(value) {
        this._nowDlg = value;
    }
    get nowDlg() {
        return this._nowDlg;
    }
    getDialogByName(dialogName, param = undefined, isStack = false) {
        // if (this.openingDialog && isStack) {
        //     this.DialogStackArr.push(this.openingDialog);
        //     //从父容器删除自己
        //     this.openingDialog.removeSelf();
        // }
        this.openingDialog = undefined;
        if (dialogName == GlobalConst.DIA_CHAOZHI) {
            if (GlobalFunc.isIos()) return;
            if (OnOffManager.isChaozOn == 1) {
                dialogName = "GiftCzDlg";
            } else {
                dialogName = "GiftCzDialog2";
            }
        }
        if (dialogName == "ExChangeDlg" || dialogName == "RankingListDialog" || dialogName == "SetDialog" || dialogName == "FreeAllDlg" || dialogName == "ActivityDialog" || dialogName == "ExChangeRecordDlg") {
            this._openDialog(dialogName, param);
        } else {
            if (!Laya.Loader.loadedMap[Laya.URL.basePath + "res/atlas2/scene/" + dialogName + ".atlas"]) {
                WaitManager.Instance.showWaitLayer("loadingView", 60);
                Laya.loader.load( Laya.ResourceVersion.addVersionPrefix("res/atlas2/scene/" + dialogName + ".atlas"), Laya.Handler.create(this, () => {
                    this._openDialog(dialogName, param, isStack);
                    WaitManager.Instance.hideWaitLayer("loadingView");
                }));
            } else {
                this._openDialog(dialogName, param, isStack);
            }
        }
    }
    _openDialog(dialogName, param = undefined, isStack = false) {
        if (dialogName == this._nowDlg) return;
        this._nowDlg = dialogName;
        GlobalFunc.log(dialogName + "/" + this._nowDlg);
        switch (dialogName) {
        //   case GlobalConst.DIA_SHOP:
        //     //商城
        //     this.openingDialog = new ShopDialog();
        //     break;

        //   case GlobalConst.DIA_PACKAGE:
        //     //背包
        //     this.openingDialog = new PackageDialog();
        //     break;

        //   case GlobalConst.DIA_ACTIVITY:
        //     //活动
        //     this.openingDialog = new ActivityDialog_1.ActivityDialog();
        //     break;

        //   case GlobalConst.DIA_VIPCHARGE:
        //     this.openingDialog = new VipDlg_1.VipDlg();
        //     break;

        //   case GlobalConst.DIA_EXCHANGEDLG:
        //     this.openingDialog = new ExChangeDlg_1.ExChangeDlg(param);
        //     break;

        //   case GlobalConst.DIA_MAIL:
        //     this.openingDialog = new MailDialog_1.MailDialog();
        //     break;

        //   case GlobalConst.DIA_PLAYERINFO:
        //     this.openingDialog = new PlayerInfoDialog_1.PlayerDataDialog();
        //     break;

        //   case GlobalConst.DIA_SERVICE:
        //     this.openingDialog = new ServiceTipsDialog_1.ServiceTipsDialog();
        //     break;

        //   case GlobalConst.DIA_NOTICE:
        //     this.openingDialog = new NoticeDialog_1.NoticeDialog();
        //     break;

        //   case GlobalConst.DIA_RANKLIST:
        //     this.openingDialog = new RankingListDialog_1.RankingListDialog();
        //     break;

        //   case GlobalConst.DIA_RANKINGWAR:
        //     this.openingDialog = new RankingWarDialog_1.RankingWarDialog();
        //     break;

        //   case GlobalConst.DIA_FIRSTPAY:
        //     //首充禮包
        //     this.openingDialog = new GiftScDlg_1.GiftScDlg(param);
        //     break;

        //   case GlobalConst.DIA_PREFERENTIAL:
        //     //特惠礼包
        //     this.openingDialog = new GiftKyDlg_1.GiftKyDlg(param);
        //     break;

        //   case GlobalConst.DIA_SECONDDAY:
        //     //明日礼包
        //     this.openingDialog = new GiftMrDlg_1.GiftMrDlg();
        //     break;

        //   case GlobalConst.DIA_GIFTSHAKE:
        //     //摇一摇礼包窗口
        //     this.openingDialog = new GiftShakeDlg_1.GiftShakeDlg();
        //     break;

        //   case GlobalConst.DIA_REBATE:
        //     //捕鱼返奖券窗口
        //     this.openingDialog = new ActivityRebateDlg();
        //     break;

        //   case GlobalConst.DIA_FISHMAP:
        //     //鱼鉴
        //     this.openingDialog = new FishMapDialog_1.FishMapDialog();
        //     break;

        //   case GlobalConst.DIA_ROULETTE:
        //     //登陆转盘
        //     this.openingDialog = new RouletteDialog();
        //     break;

        //   case GlobalConst.DIA_SET:
        //     //设置
        //     this.openingDialog = new SetDialog();
        //     break;

        //   case GlobalConst.DIA_MONTHCARD:
        //     //月卡
        //     this.openingDialog = new MonthCardDlg_1.MonthCardDlg();
        //     break;

        //   case GlobalConst.DIA_COMPOSE:
        //     //合成
        //     this.openingDialog = new ComposeDialog();
        //     break;

        //   case GlobalConst.DIA_NEWTHGIFT:
        //     //新特惠礼包
        //     this.openingDialog = new GiftNewThDlg(param);
        //     break;

        //   case "GiftCzDlg":
        //     //超值礼包
        //     if (GlobalFunc.isIos()) return;
        //     this.openingDialog = new GiftCzDlg();
        //     break;

        //   case "GiftCzDialog2":
        //     if (GlobalFunc.isIos()) return;
        //     this.openingDialog = new GiftCzDlgDialog2();
        //     break;

        //   case GlobalConst.DIA_FREEALL:
        //     this.openingDialog = new FreeAllDlg_1.FreeAllDlg(param);
        //     break;

        //   case GlobalConst.DIA_RECORE:
        //     this.openingDialog = new ExChangeRecordDlg_1.ExChangeRecordDlg(param);
        //     break;

        //   case GlobalConst.DIA_SURE:
        //     this.openingDialog = new ExchangeSureDlg_1.ExchangeSureDlg(param);

          default:
            break;
        }
        // if (this.openingDialog) {
        //     SceneM.addToMiddLayer(this.openingDialog, GlobalConst.dialogLayer);
        //     if (isStack) {
        //         this.openingDialog.onClosed = (() => {
        //             let dialog = this.DialogStackArr.splice(this.DialogStackArr.length - 1, 1)[0];
        //             SceneM.addToMiddLayer(dialog, GlobalConst.dialogLayer);
        //             GlobalFunc.openDialog(dialog);
        //             this.openingDialog = dialog;
        //         });
        //     }
        // } else {
        //     GlobalFunc.log("未找到名为:" + dialogName + " 的界面");
        // }
    }
    doCloseDlg() {
        // if (this.openingDialog && !this.openingDialog.destroyed) {
        //     this.openingDialog.doClose && this.openingDialog.doClose();
        // }
    }
    /*使用于12321类型的界面，123界面初始化的时候把自己当参数，界面3的isDodel为true*/            
    addDlg(dlg, isDoDel = false) {
        this.dlgQueue.push(dlg);
        let _this = this;
        this.isDoDel = isDoDel;
        if (!dlg) {
            return;
        }
        dlg.onClosed = (() => {
            _this.delDlg();
        });
    }
    /**删除窗口 */            delDlg() {
        if (!this.isDoDel) return;
        this.dlgQueue.pop();
        this.dlgQueue.length > 0 && this.doShow();
        this.dlgQueue.length == 0 && (this.isDoDel = false);
    }
    /**显示窗口 */            
    doShow() {
        let len = this.dlgQueue.length;
        if (FishData.stopPop) {
            this.dlgQueue = [];
            FishData.stopPop = false;
            return;
        }
        if (len > 0) {
            let dialog = this.dlgQueue[len - 1];
            if (!dialog) {
                //救济金特殊
                if (PlayerData.Instance.left_count > 0) {
                    GameData.Instance.isHelping = true;
                    EventDis.Instance.dispatchEvent("showHelp");
                    return;
                } else {
                    //dialog = new WarningMessage_1.WarningMessage("今日救济金已领完，明日还可领取", true, undefined);
                }
            }
            //if (!(dialog instanceof WarningMessage_1.WarningMessage)) {
            //    SceneManager.Instance.addToMiddLayer(dialog, GlobalConst.dialogLayer);
            //}
        }
    }
}