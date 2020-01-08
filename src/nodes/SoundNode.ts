import GlobalVar from "../const/GlobalVar";
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import {BattleData} from "../datas/BattleData"

export class SoundNode{
    isFinished: boolean;
    sound: string;
    playTimes: number;
    name: string;
    fileName: any;
    constructor() {
        /**音效是否播放完毕 */
        this.isFinished = true;
        /**音效名 */                
        this.sound = "";
        /**播放次数 0:循环播放*/                
        this.playTimes = 1;
        /**名字 */                
        this.name = "";
    }
    playSound() {
        this.isFinished = false;
        if (this.playTimes == 1) {
            Laya.SoundManager.playSound(this.sound, this.playTimes, new Laya.Handler(this, this.runCallBackFunc));
        } else {
            Laya.SoundManager.playSound(this.sound, this.playTimes);
        }
    }
    stopSound() {
        this.isFinished = true;
        Laya.SoundManager.stopSound(this.sound);
    }
    playMusic() {
        console.log("背景音乐");
        this.isFinished = false;
        Laya.SoundManager.playMusic(this.sound, this.playTimes);
    }
    stopMusic() {
        this.isFinished = true;
        Laya.SoundManager.stopMusic();
    }
    keepPlayMusic() {
        if (BattleData.Instance.isInRoom) {
            GlobalFunc.playRoomMusic();
        } else {
            Laya.SoundManager.playMusic(this.sound);
        }
    }
    replay() {
        this.sound = GlobalVar.reUrl + this.fileName + GlobalVar.soundType;
        Laya.SoundManager.playSound(this.sound, this.playTimes);
    }
    onlyPlay() {
        if (this.sound) {
            Laya.SoundManager.playSound(this.sound, this.playTimes);
        }
    }
    getIsFinish() {
        return this.isFinished;
    }
    runCallBackFunc() {
        this.isFinished = true;
        this.sound = undefined;
    }
}