import { SoundNode } from "./SoundNode";
import GlobalVar from "../const/GlobalVar";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { SoundManager } from "../common/SoundManager";
import GlobalConst from "../const/GlobalConst";
import { EventDis } from "../Helpers/EventDis";
import {BattleData} from "../datas/BattleData"

export class WxSoundNode extends SoundNode{
    lastPlayed: number;
    isMusic: boolean;
    node: any;
    playTime: any;
    constructor(isMusic = false) {
        super();
        /**上次记录播放次数 */                
        this.lastPlayed = 0;
        this.isMusic = isMusic;
        if (this.isMusic) {
            this.node = wx.createInnerAudioContext();
            this.node.autoplay = true;
            this.node.loop = true;
            EventDis.Instance.addEvntListener(GlobalVar.WX_ONSHOW, this, this.keepPlayMusic);
            //wx.onAudioInterruptionEnd(this.keepPlayMusic);
        }
    }
    /**播放音效 */            
    playSound() {
        if (this.node) {
            this.deleteNode();
        }
        this.newNode();
        this.sound = GlobalVar.reUrl + this.fileName + GlobalVar.soundType;
        this.node.src = this.sound;
        this.node.loop = this.playTimes == 0;
        this.node.play();
        this.playTime = GlobalFunc.getClientTime();
    }
    /**停止音效 */            stopSound() {
        if (this.node) {
            this.node.stop();
            this.deleteNode();
        }
    }
    /**播放音乐 */            playMusic() {
        this.node.stop();
        this.node.src = this.sound;
        Laya.timer.once(500, this, this.laterPlay);
    }
    /**停止音乐 */            stopMusic() {
        this.node.stop();
    }
    /**继续播放音乐 */            
    keepPlayMusic() {
        if (BattleData.Instance.isInRoom) {
            GlobalFunc.playRoomMusic();
        } else {
            SoundManager.Instance.playMusic(GlobalConst.Sud_bg_hall);
        }
    }
    /**重新播放 */            replay() {
        if (!this.node) {
            this.newNode();
            this.node.src = this.sound;
            this.node.loop = false;
        }
        this.node.stop();
        this.onlyPlay();
    }
    /**只负责重头播放 */            onlyPlay() {
        if (!this.node) {
            this.newNode();
            this.node.src = this.sound;
            this.node.loop = this.isMusic;
        }
        this.node.stop();
        if (this.isMusic) {
            Laya.timer.once(500, this, this.laterPlay);
        } else {
            this.node.play();
        }
    }
    /**延迟播放 */            laterPlay() {
        if (!this.node) {
            this.newNode();
            this.node.src = this.sound;
            this.node.loop = this.isMusic;
        }
        this.node.play();
    }
    /**建立新的节点 */            newNode() {
        this.node = wx.createInnerAudioContext();
    }
    /**删除音效节点 */            deleteNode() {
        if (this.node) {
            this.node.destroy();
            this.node = undefined;
        }
    }
    /**获取音效是否结束 */            getIsFinish() {
        if (!this.node) {
            return true;
        }
        let nowTime1 = GlobalFunc.getClientTime();
        let soundLength = this.node.duration * 1e3;
        let endTime = this.playTime + soundLength + (soundLength == 0 ? 2e3 : 0);
        if (endTime > nowTime1) return false;
        if (this.node.paused && soundLength != 0) {
            return true;
        } else if (!this.node.paused && endTime < nowTime1 && this.node.duration == 0) {
            this.deleteNode();
            return true;
        }
        return false;
    }
    destroy() {
        this.deleteNode();
    }
}