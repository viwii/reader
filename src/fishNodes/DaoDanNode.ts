import { TrackBulletNode } from "./TrackBulletNode";
import { FishData } from "../datas/FishData";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { SceneManager } from "../common/SceneManager";
import GlobalConst from "../const/GlobalConst";
import { BulletType } from "./BulletFactory";

export class DaoDanNode {
    bomb: TrackBulletNode;
    constructor(data) {
        this.updateView(data);
    }
    updateView(data) {
        let fishNode = data.fishNode;
        let specialButtle;
        switch (data.item_id) {
          case 11:
          case 15:
            specialButtle = "img_zid_10";
            break;

          case 12:
          case 16:
            specialButtle = "img_zid_11";
            break;

          case 13:
          case 17:
            specialButtle = "img_zid_12";
            break;

          case 14:
          case 18:
            specialButtle = "img_zid_13";
            break;
        }
        this.bomb = new TrackBulletNode();
        let seat = FishData.seatNodes[data.seatIndex];
        if (!seat) return;
        let cannonPos = seat.cannonNode.node_cannon.localToGlobal(new Laya.Point(0, 0));
        let ratio = seat.isSeatFlip ? 1 : -1;
        let ptFrom = new Laya.Point(cannonPos.x, cannonPos.y + ratio * 34);
        if (!fishNode) return;
        let angle = GlobalFunc.vecToAngle(ptFrom, GlobalFunc.changeLockP(fishNode));
        this.bomb.lockFishId = fishNode.fishUniqId;
        this.bomb.daoDanHandler = data.callBack;
        this.bomb.initBullet({
            seatIndex: data.seatIndex,
            sprcialButtle: specialButtle,
            angle: angle
        });
        this.bomb.pos(ptFrom.x, ptFrom.y);
        this.bomb.doTrackFire(fishNode);
        SceneManager.Instance.addToLayer(this.bomb, GlobalConst.bulletLayer, ptFrom.x, ptFrom.y);
        seat.cannonNode.rotateAndFire(angle, BulletType.bullet_type_daoDan);
        if (data.seatIndex == FishData.mySeatIndex) {
            SceneManager.Instance.playSound(GlobalConst.Sud_cannon_bomb, 1);
        }
    }
}