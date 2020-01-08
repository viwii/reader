import { FishData } from "../datas/FishData";
import { BattleData } from "../datas/BattleData";

export class SpecialCannonNode {
    seat: number;
    isSelf: boolean;
    destroyed: boolean;
    roomPlayerData: any;
    seatNode: any;
    seatPanel: any;
    cannonNode: any;
    constructor(seat) {
        /**鸿运座位 */
        this.seat = 0;
        /**是否是自己 */                
        this.isSelf = false;
        /**是否已经删除 */                
        this.destroyed = false;
        this.seat = seat;
        this.isSelf = seat == FishData.mySeatIndex;
        this.roomPlayerData = BattleData.Instance.getSitInfo(seat);
        this.seatNode = FishData.seatNodes[seat];
        this.seatPanel = this.seatNode.numPanel;
        this.cannonNode = this.seatNode.cannonNode;
    }
}