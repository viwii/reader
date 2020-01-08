import { SpecialCannonNode } from "./SpecialCannonNode";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { PlayerData } from "../datas/PlayerData";
import { FishData } from "../datas/FishData";
import { EventDis } from "../Helpers/EventDis";
import GlobalVar from "../const/GlobalVar";

export enum DragonType{
    GREEN_CANNON = 4,
    SILVER_CANNON = 5,
    GOLD_CANNON = 6
}

export class DragonCannonNode extends SpecialCannonNode {
    seatIndex: number;
    dragonType: any;
    leftBullet: any;
    btnLayer: any;
    lastPao: number;
    constructor(seat, dragonType) {
        super(seat);
        /**当前座位 */                
        this.seatIndex = 0;
        this.seatIndex = seat;
        this.dragonType = dragonType;
        this.leftBullet = PlayerData.Instance.getItemNum(GlobalFunc.getDragonCannonID(dragonType));
        this.cannonNode.isDragonStart = true;
        this.cannonNode.dragonCannonNode = this;
        this.isSelf && (FishData.isSelfDragonTime = true);
        this.roomPlayerData.isDragonCannon = dragonType;
        this.seatPanel.closePaoBeiUI();
        this.initCannonSkin();
        if (this.isSelf) {
            EventDis.Instance.dispatchEvent(GlobalVar.LAST_BULLET_VIEW_OPEN, {
                name: "龙炮子弹",
                bulletNum: this.leftBullet,
                node: this
            });
        }
        this.changePaoBei();
        EventDis.Instance.addEvntListener("paySuccess", this, () => {
            this.leftBullet = PlayerData.Instance.getItemNum(GlobalFunc.getDragonCannonID(dragonType));
        });
    }
    /**初始化炮台炮座皮肤 */            initCannonSkin() {
        let cannon = "";
        let turret = "";
        switch (this.dragonType) {
          case DragonType.GREEN_CANNON:
            cannon = "res/icon/skin_dragonCannon_1.png";
            break;

          case DragonType.SILVER_CANNON:
            cannon = "res/icon/skin_dragonCannon_2.png";
            break;

          case DragonType.GOLD_CANNON:
            cannon = "res/icon/skin_dragonCannon_3.png";
            turret = "res/icon/skin_dragonTurret_2.png";
            break;

          default:
            break;
        }
        this.cannonNode.changeSpecialSkin(cannon, turret);
    }
    /**剩余子弹数量 */            
    setLeftButtle(num) {
        PlayerData.Instance.setItemNum(GlobalFunc.getDragonCannonID(this.dragonType), num);
        this.leftBullet = num;
        this.isSelf && this.btnLayer.setSurplusNum(num);
        if (num == 0 && this.isSelf) {
            this.btnLayer.sendDragonCannonClose();
            this.btnLayer.stopDragonCannon(FishData.mySeatIndex);
        }
    }
    changePaoBei() {
        let paobei = GlobalFunc.getDragonCanPao(this.dragonType);
        this.lastPao = +this.seatPanel.text_paobei.text;
        this.seatPanel.text_paobei.text = paobei + "";
    }
    destroy() {
        this.destroyed = true;
        this.roomPlayerData.isDragonCannon = -1;
        this.roomPlayerData.cur_pao = this.lastPao;
        this.isSelf && (FishData.isSelfDragonTime = false);
        this.isSelf && this.btnLayer.closeBoxSurplus();
        this.btnLayer = undefined;
        this.seatPanel.openPaoBeiUI();
        this.cannonNode.isDragonStart = false;
        this.cannonNode.changeSkin({
            pao_item: PlayerData.Instance.equipMap[this.seat],
            uid: this.roomPlayerData.uid
        }, true);
        EventDis.Instance.delAllEvnt(this);
        Laya.timer.clearAll(this);
    }
}