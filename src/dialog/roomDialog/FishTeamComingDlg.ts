import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import GlobalConst from "../../const/GlobalConst";

export class FishTeamComingDlg{
    visible: boolean;
    ani1: any;
    mouseThrough: boolean;
    mouseEnabled: boolean;
    img_fishes: any;
    constructor() {
        //super();
        this.visible = false;
        this.initUI();
        this.ani1.on(Laya.Event.COMPLETE, this, function() {
            this.box_bg1.visible = this.box_bg2.visible = this.img_yuchao.visible = false;
            GlobalFunc.closeDialog(this, new Laya.Handler(this, this.destroy));
        });
    }
    initUI() {
        this.mouseThrough = true;
        this.mouseEnabled = false;
        this.img_fishes.x = GlobalConst.stageW / 2 - 300;
        this.ani1.play(0, false);
        this.visible = true;
    }
}