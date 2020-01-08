import { EventDis } from "../Helpers/EventDis";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { BattleData } from "../datas/BattleData";

export class OtherOneInfoNode /*extends layaMaxUI_1.ui.roleNodes.OtherOneInfoNodeUI*/ {
    seatIndex: number;
    name: string;
    pos(x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    img_head: any;
    label_nick: any;
    label_id: any;
    visible: any;
    constructor(seatIndex) {
        //super();
        this.seatIndex = 0;
        this.seatIndex = seatIndex;
        this.name = "otherNode" + this.seatIndex;
        this.initUI();
        this.closeNode();
        let posData = GlobalFunc.getOtherOneInfoPos();
        this.pos(posData[seatIndex].x, posData[seatIndex].y);
        EventDis.Instance.addEvntListener("other_node_click", this, this.otherNodeClick);
    }
    initUI() {
        let seatInfo = BattleData.Instance.roomPlayerData[this.seatIndex];
        if (!seatInfo) return;
        this.img_head.skin = !!seatInfo.head_image ? seatInfo.head_image : "common/img_toux.png";
        this.label_nick.text = GlobalFunc.cutNickName(seatInfo.nick_name);
        this.label_id.text = "贵族等级：" + seatInfo.vip_level;
        // this.img_vip.skin = globalFun.getVipIcon(+seatInfo.vip_level);
        // this.label_vip.text = seatInfo.vip_level + "";
                }
    otherNodeClick(seatIndex) {
        if (seatIndex != this.seatIndex) return;
        if (this.visible) {
            this.closeNode();
        } else {
            this.openNode();
        }
    }
    openNode() {
        this.initUI();
        this.visible = true;
        Laya.timer.once(3e3, this, this.closeNode);
    }
    closeNode() {
        this.visible = false;
        Laya.timer.clear(this, this.closeNode);
    }
    destroy() {
        EventDis.Instance.delAllEvnt(this);
    }
}