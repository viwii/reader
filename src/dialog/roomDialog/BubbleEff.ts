import { EventDis } from "../../Helpers/EventDis";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import { SoundManager } from "../../common/SoundManager";
import { SceneManager } from "../../common/SceneManager";
import GlobalConst from "../../const/GlobalConst";

export class BubbleEff {
    constructor() {
        this.playBubbleEff();
        EventDis.Instance.addEvntListener("leave_room", this, this.destroy);
    }
    destroy() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
        EventDis.Instance.delAllEvnt(this);
    }
    //切鱼潮，放泡泡
    playBubbleEff() {
        var params = {
            max_scale: 22,
            min_scale: 6,
            max_time: 2002,
            min_time: 2e3,
            max_speed: 1200,
            min_speed: 700,
            max_px: 1700,
            min_px: -100,
            max_py: 1300,
            min_py: 780
        };
        this.bubbleEffect(params);
        SoundManager.Instance.stopAllSound(false);
        // g_SoundManager.playSound(GlobalConst.Sud_bubble, 1);
                }
    bubbleEffect(params) {
        var times1 = 50;
        var times2 = 50;
        Laya.timer.frameLoop(4, this, this.loopCreateBubble, [ params, times1, times2 ]);
        Laya.timer.once(1800, this, function() {
            Laya.timer.clear(this, this.loopCreateBubble);
        });
    }
    loopCreateBubble(params, times1, times2) {
        var times_ = GlobalFunc.getRandom(times1, times2);
        for (var i = 0; i < times_; i++) {
            this.createBubble(params);
        }
    }
    createBubble(params) {
        var randoms = this.getBubbleRand(params);
        var px = randoms.px;
        var py = randoms.py;
        var time = randoms.time;
        var scale = randoms.scale;
        var py_ = randoms.py_;
        var sp_ = Laya.Pool.getItemByClass("img", Laya.Image);
        sp_.skin = "res/icon/img_qip_1.png";
        sp_.alpha = .8;
        sp_.scale(scale, scale);
        sp_.pos(px, py);
        SceneManager.Instance.addToLayer(sp_, GlobalConst.maskLayer);
        Laya.Tween.to(sp_, {
            y: py_
        }, time, null, Laya.Handler.create(this, sp_ => {
            if (sp_) {
                sp_.removeSelf();
                sp_.destroy();
            } else {
                GlobalFunc.log("泡泡不正常销毁");
            }
        }, [ sp_ ]));
    }
    getBubbleRand(params) {
        var px = GlobalFunc.getRandom(params.min_px, params.max_px);
        var py = GlobalFunc.getRandom(params.min_py, params.max_py);
        var speed = GlobalFunc.getRandom(params.min_speed, params.max_speed);
        var time = GlobalFunc.getRandom(params.min_time, params.max_time);
        var scale = GlobalFunc.getRandom(params.min_scale, params.max_scale) / 10;
        var py_ = 800 - time * speed / 1e3;
        return {
            px: px,
            py: py,
            time: time,
            scale: scale,
            py_: py_
        };
    }
}