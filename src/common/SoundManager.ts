import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import GlobalVar from "../const/GlobalVar";
import Single from "../const/SingleSDK";
import { SoundNode } from "../nodes/SoundNode";
import { WxSoundNode } from "../nodes/WxSoundNode";

export class SoundManager{
    allSoundNum: number;
    soundEnabled: boolean;
    musicEnabled: boolean;
    soundValue: number;
    fireIndex: number;
    iswx: boolean;
    soundArray: any[];
    fireNode: any[];
    musicNode: any;
    static _Instance:any;
    static get Instance(){
        if (SoundManager._Instance == null){
            SoundManager._Instance = new SoundManager;
        }

        return SoundManager._Instance;
    }
    constructor() {
        /**允许最大声效同时存在数量 */
        this.allSoundNum = 5;
        /**音效开关 */                
        this.soundEnabled = true;
        /**音乐开关 */                
        this.musicEnabled = true;
        /**音效音量 */                
        this.soundValue = 1;
        /**开炮下标 */                
        this.fireIndex = 0;
        this.iswx = false;
        this.soundArray = new Array();
        this.fireNode = new Array();
    }
    setSoundNum(number) {
        this.allSoundNum = number;
    }
    /**音效管理初始化 */            
    init() {
        // this.iswx = globalFun.checkPlatform(SingleSDK.Platform.WXGAME);
        this.iswx = false;
        let soundData;
        soundData = GlobalFunc.getStorage("GameSoundData");
        if (!soundData) {
            soundData = "1_1_1";
        }
        soundData = soundData.split("_");
        this.setsoundValue(Number(soundData[0]));
        this.setSoundEnabled(soundData[1] == "1" ? true : false, soundData[2] == "1" ? true : false);
        if (this.iswx) {
            this.musicNode = new WxSoundNode(true);
        } else {
            this.musicNode = new SoundNode();
        }
    }
    /**音效数据存入本地 */            
    savesoundValue() {
        let saveValue = this.soundValue + "_" + (this.soundEnabled == true ? "1" : "0") + "_" + (this.musicEnabled == true ? "1" : "0");
        GlobalFunc.setStorage("GameSoundData", saveValue);
    }
    /**
    * 设置音效是否打开
    * @param isOpenSound true:打开音效 ,false:关闭音效
    */            
    setSoundEnabled(isOpenSound, isOpenMusic) {
        if (this.soundEnabled != isOpenSound) {
            this.soundEnabled = isOpenSound;
            if (!isOpenSound) {
                this.stopAllSound();
            }
        }
        if (this.musicEnabled != isOpenMusic) {
            this.musicEnabled = isOpenMusic;
            if (!isOpenMusic && this.musicNode) {
                this.musicNode.stopMusic();
            } else if (!!this.musicNode) {
                this.musicNode.keepPlayMusic();
            }
        }
        this.savesoundValue();
    }
    /**
    * 设置音量 默认音量:1
    * @param value 设置音量 0~1.0
    */            
    setsoundValue(value) {
        this.soundValue = value;
        Laya.SoundManager.setSoundVolume(value);
        Laya.SoundManager.setMusicVolume(value);
        this.savesoundValue();
    }
    /**播放音效
    * @param param1 音效名
    * @param param2 音效播放次数
    * @param type 音效优先级
    * @param handler 播放完成后回调
    * @param data 回调参数
    */            
    playSound(param1, param2, type = 10, handler = undefined, data = undefined, check = false) {
        if (!this.soundEnabled) return;
        let soundNode = undefined;
        if (!this.soundEnabled && this.soundValue != 0) {
            return;
        }
        if (!param1) {}
        for (let index = 0; index < this.soundArray.length; index++) {
            let sound = this.soundArray[index];
            if (param1 == sound.fileName && (sound.getIsFinish() || check)) {
                sound.replay();
                return;
            }
        }
        for (let index = 0; index < this.soundArray.length; index++) {
            let sound = this.soundArray[index];
            if (sound && sound.getIsFinish()) {
                soundNode = sound;
                break;
            }
        }
        if (!soundNode && this.soundArray.length < this.allSoundNum - 1) {
            if (this.iswx) {
                soundNode = new WxSoundNode(false);
                soundNode.name = "sound_" + this.soundArray.length;
            } else {
                soundNode = new SoundNode();
            }
            this.soundArray.push(soundNode);
        }
        if (soundNode) {
            soundNode.sound = GlobalVar.reUrl + param1 + GlobalVar.soundType;
            soundNode.playTimes = param2;
            soundNode.fileName = param1;
            soundNode.playSound();
        }
    }
    /**播放开火音效节点 */            playFireSound(param1) {
        if (!this.soundEnabled) return;
        let node;
        if (!this.fireNode[this.fireIndex]) {
            this.fireNode[this.fireIndex] = new SoundNode();
            this.fireNode[this.fireIndex] = this.iswx ? new WxSoundNode(false) : new SoundNode();
        }
        node = this.fireNode[this.fireIndex];
        this.fireIndex++;
        this.fireIndex > 3 && (this.fireIndex = 0);
        if (node) {
            if (node.fileName == param1) {
                node.replay();
            } else {
                node.playTimes = 1;
                node.fileName = param1;
                node.playSound();
            }
        } else {
            this.playSound(param1, 1, 1, undefined, undefined);
        }
    }
    /**停止音效
    * @param param1 音效名
    */            
    stopSound(param1) {
        for (let index = 0; index < this.soundArray.length; index++) {
            let node = this.soundArray[index];
            if (node.fileName == param1) {
                node.stopSound();
            }
        }
    }
    /**播放背景音乐 */            playMusic(param) {
        if (!this.musicEnabled) return;
        if (!this.musicNode) {
            this.musicNode = undefined;
            if (this.iswx) {
                this.musicNode = new WxSoundNode(true);
            } else {
                this.musicNode = new SoundNode();
            }
        }
        // if (param == this.musicNode.fileName) {
        //     console.log('继续播放房间背景音乐')
        //     this.musicNode.isFinished && this.musicNode.playMusic();
        //     return;
        // }
                        if (param == this.musicNode.fileName) {
            if (this.iswx) {
                this.musicNode.onlyPlay();
            } else {
                this.musicNode.isFinished && this.musicNode.playMusic();
            }
            return;
        }
        this.musicNode.fileName = param;
        this.musicNode.playTimes = 0;
        this.musicNode.sound = GlobalVar.reUrl + param + Single.getBgMusicFormat();
        console.log("继续播放房间背景音乐");
        this.musicNode.playMusic();
    }
    /**停止所有音效 */            
    stopAllSound(isDeleteFire = true) {
        for (let index = 0; index < this.soundArray.length; index++) {
            let node = this.soundArray[index];
            node.stopSound();
        }
        if (isDeleteFire) {
            for (let index = 0; index < this.fireNode.length; index++) {
                let node = this.fireNode[index];
                node.stopSound();
            }
        }
    }
    stopMusic() {
        this.musicNode.stopMusic();
    }
}