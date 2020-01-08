import { EventDis } from "../../Helpers/EventDis";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import { SceneManager } from "../../common/SceneManager";
import GlobalConst from "../../const/GlobalConst";
import { FishData } from "../../datas/FishData";
import { BattleData } from "../../datas/BattleData";
import { SeatNode } from "../../fishNodes/SeatNode";

export class SeatFactory {
    seatNodes: any[];
    constructor() {
        this.seatNodes = [];
        this.initCannons();
        this.initEvent();
    }
    destroy() {
        Laya.timer.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
        for (let index = 0; index < this.seatNodes.length; index++) {
            let seatNode = this.seatNodes[index];
            if (seatNode) {
                seatNode.destroy();
                seatNode.removeSelf();
                seatNode.removeChildren();
            }
        }
        GlobalFunc.log("座位场销毁");
        this.seatNodes = [];
    }
    //初始化炮台
    initCannons() {
        GlobalFunc.log("座位场初始化");
        this.seatNodes = new Array();
        for (let index = 1; index <= 4; index++) {
            console.log("创建座位");
            this.seatNodes[index] = new SeatNode(index);
            SceneManager.Instance.addToLayer(this.seatNodes[index], GlobalConst.btnsLayer);
        }
        console.log("***************");
        //座位节点
        FishData.seatNodes = this.seatNodes;
        FishData.mySeatNode = FishData.seatNodes[FishData.mySeatIndex];
        for (let index = 1; index < this.seatNodes.length; index++) {
            let node = this.seatNodes[index];
            node.buildSpecialFish() || node.bulidDragonCannonState();
        }
    }
    initEvent() {
        EventDis.Instance.addEvntListener("player_enter_room", this, this.updateSeat);
        EventDis.Instance.addEvntListener("player_leave_room", this, this.updateSeat);
        EventDis.Instance.addEvntListener("change_paobei_notice", this, this.updatePaoBei);
        EventDis.Instance.addEvntListener("update_zuantou_score", this, this.updateZtPanel);
    }
    updateSeat(data) {
        GlobalFunc.log(this.seatNodes + "座位更新" + (data.room_pos + 1));
        this.seatNodes[data.room_pos + 1] && this.seatNodes[data.room_pos + 1].updateSeatUI();
        if (!this.seatNodes[data.room_pos + 1]) {
            GlobalFunc.log("座位消失" + (data.room_pos + 1));
        }
    }
    updatePaoBei(data) {
        GlobalFunc.log("当前炮倍", data.pao);
        var seat = BattleData.Instance.getUserSeatByUid(data.uid);
        if (!this || !this.seatNodes) return;
        this.seatNodes[seat] && this.seatNodes[seat].numPanel.changePaoBack(data);
    }
    updateZtPanel(data) {
        let seat = data.seatIndex;
        let num = data.num;
        GlobalFunc.log(this.seatNodes + "座位" + seat);
        this.seatNodes[seat] && this.seatNodes[seat].numPanel.updateZtPanel(num);
        if (!this.seatNodes[seat]) {
            GlobalFunc.log("座位消失" + seat);
        }
    }
}