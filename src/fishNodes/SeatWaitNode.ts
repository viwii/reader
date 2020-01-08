import { EventDis } from "../Helpers/EventDis";

export class SeatWaitNode /*extends layaMaxUI_1.ui.roleNodes.SeatWaitNodeUI*/{
    seatIndex: number;
    name: string;
    image_invite: any;
    constructor(seatIndex) {
        //super();
        this.seatIndex = 0;
        this.name = "waitNode" + seatIndex;
    }
    destroy() {
        this.destroyEvent();
        this.removeSelf();
    }
    removeSelf() {
        throw new Error("Method not implemented.");
    }
    init(seatIndex) {
        this.seatIndex = seatIndex;
        if (seatIndex > 2) {
            this.image_invite.rotation = 180;
        }
    }
    initEvent() {}
    destroyEvent() {
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
    }
}