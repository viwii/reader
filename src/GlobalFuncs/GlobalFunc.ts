import GlobalVar from "../const/GlobalVar"
import GlobalConst from "../const/GlobalConst"
import StringFunc from "./StringFunc";
import {BattleData} from "../datas/BattleData"
import {GameData} from "../datas/GameData"
import {FishData} from "../datas/FishData";
import { SoundManager } from "../common/SoundManager";
import { SceneManager } from "../common/SceneManager";
import { TimeLineManager } from "../const/TimeLineManager";
import { ConfigData } from "../const/ConfigData";
import { PlayerData } from "../datas/PlayerData";
import { NetManager } from "../netWork/NetManager";
import { EventDis } from "../Helpers/EventDis";
import OnOffManager from "../const/OnOffManager";
import Single, { Platform } from "../const/SingleSDK";
import { UIUtils } from "../game/utils/UIUtils";

export default class GlobalFunc{
    static aniNum=0;
    static timeNum: any;
    static timeLineArr: any;
    static valNotDefined(val) {
        return typeof val == "undefined";
    }
    //找出两个json同键不同值
    // todo:找出多余和减少得键
    static  getDiffJson(json1, json2) {
        var arr = [];
        if (!json1 || !json2) return arr;
        var tmpV = {};
        for (var key in json1) {
            var oldkey = json1[key];
            tmpV[oldkey.loaddir] = oldkey.ver;
        }
        for (var key in json2) {
            var newKey = json2[key].loaddir;
            var num1 = tmpV[newKey];
            var num2 = json2[key].ver;
            if (num2 > num1) {
                GlobalFunc.log("热更差异文件:", newKey, num1, num2);
                arr.push(newKey);
            }
        }
        return arr;
    }
    /**是否为ios系统 */            
    static isIos() {
        if (GlobalVar.phoneBrand == GlobalConst.iosBrand || GlobalVar.phoneSystem == GlobalConst.iosSystem) {
            return true;
        }
        return false;
    }
    //适配屏幕比例
    static  getScreenRet() {
        return Laya.stage.width / Laya.stage.height / (1334 / 750);
    }
    
    //需要特殊适配
    static isNeedScaleMode() {
        return Laya.Browser.clientWidth / Laya.Browser.clientHeight >= 1.9;
    }
    
    //适配调整x,大厅居中建筑:全局layer添加东西
    static adaptX() {
        var diffx = (Laya.stage.width - 1334) / 2;
        return diffx > 0 ? diffx : 0;
    }
    
    //适配调整x,靠左右图标
    static adaptX2() {
        var diffx = (1630 - Laya.stage.width) / 2;
        return diffx > 0 ? diffx : 0;
    }
    
    //适配调整，全局addToLayer，设计分辨率1630
    static adaptX3() {
        var num = Laya.stage.width - 1630;
        var diffx = num > 0 ? num : 0;
        return diffx;
    }
    
    static doLayerAddAdapt(node) {
        node.x = node.x + GlobalFunc.adaptX3() / 2;
    }
    
    //统一处理左右图标位置
    // function doLRAdapt(node,isRight=false)
    static  doLRAdapt(param) {
        var node = param.node;
        var isRight = param.isRight || false;
        var time = param.time || 10;
        var num = isRight ? -GlobalFunc.adaptX2() : GlobalFunc.adaptX2();
        if (node) {
            let vsb = node.visible;
            node.visible = false;
            Laya.timer.once(time, this, () => {
                //适配处理,左边
                node.x = node.x + num;
                node.visible = vsb;
            });
        }
    }
    
    //刘海屏处理
    static adaptLiuHai(node, isRight = false) {
        var num = isRight ? -80 : 80;
        if (Laya.stage.width / Laya.stage.height > 1.9) {
            Laya.timer.once(50, this, () => {
                //适配处理,左边
                node.x = node.x + num;
            });
        }
    }
    
    static  getClassName(obj) {
        if (obj && obj.constructor && obj.constructor.toString()) {
            if (obj.constructor.name) {
                return obj.constructor.name;
            }
            var str = obj.constructor.toString();
            if (str.charAt(0) == "[") {
                var arr = str.match(/\[\w+\s*(\w+)\]/);
            } else {
                var arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length == 2) {
                return arr[1];
            }
        }
        return undefined;
    }
    
    static getRandom(n1, n2) {
        var s = Math.random();
        return Math.ceil(n1 + s * (n2 - n1));
    }
    
    //缓存动画
    static getFrameArr(PreName, frameCount) {
        var arr = new Array();
        // var firstName = "fishes2"
        // //新手房鱼，放到新手资源里
        // GlobalConst.newUserFishArr.forEach(newFish => {
        //     if (PreName == newFish) {
        //         firstName = "res/fishes"
        //     }
        // });
                        var firstName = "fishes/" + PreName;
        for (var i = 0; i < frameCount; i++) {
            var index = i + 1;
            var str = firstName + "/" + PreName + "_" + index + ".png";
            arr[i] = str;
        }
        return arr;
    }
    
    //加载渔场中的粒子特效
    // export function loadParticle() {
    //     Laya.loader.create([
    //         globalVar.reUrl + "lizi/bitBoom/BitCrab_Boom.lh",
    //         globalVar.reUrl + "lizi/bitFire/BitCrab_FireTrail.lh",
    //         globalVar.reUrl + "lizi/bitHit/BitCrab_02.lh",
    //         globalVar.reUrl + "lizi/bitReady/BitCrab_01.lh",
    //         globalVar.reUrl + "lizi/bitTrailing/BitCrab_Trail.lh",
    //     ])
    // }
    //深拷贝
    static clone(obj) {
        function _copy(obj1) {
            if (typeof obj1 != "object") {
                return obj1;
            }
            var newTable = {};
            for (var index in obj1) {
                newTable[index] = _copy(obj1[index]);
            }
            return newTable;
        }
        return _copy(obj);
    }
    /**播放点击音效 */            
    static playClickSound() {
        SoundManager.Instance.playSound(GlobalConst.Sud_click, 1);
    }
    
    /**播放房间背景音乐 */            
    static playRoomMusic() {
        let path;
        let roomId = BattleData.Instance.room_type;
        if (BattleData.Instance.scene_type == 1) {
            path = GlobalConst.Sud_bg_king;
        } else {
            path = GlobalConst["Sud_room" + (roomId == 0 ? "1" : BattleData.Instance.room_type)];
        }
        SoundManager.Instance.playMusic(path);
    }
    
    // export function buttonDot(data) {
    //     g_httpManager.connect(g_httpManager.sendButtonDotToHttp({ "actionId": data }), null);
    // }
    //截取名字，超过11个字显示..
    static cutNickName(name) {
        if (name) {
            return name.length > 11 ? name.substr(0, 10) + ".." : name;
        }
        return "....";
    }
    
    static getActivity(task, btnText, jumpType) {
        var btnState = {};
        if (task.state == 0) {
            btnState = {
                skin: "common/btn_blue.png",
                label: btnText,
                mouseEnable: true,
                labelStrokeColor: "#0b3170"
            };
        } else if (task.state == 1) {
            btnState = {
                skin: "basePic/btn_yellow.png",
                label: "领取",
                mouseEnable: true,
                labelStrokeColor: "#70200b"
            };
        } else {
            btnState = {
                skin: "noZip/btn_gray.png",
                label: "已领取",
                mouseEnable: false,
                labelStrokeColor: "#0b3170"
            };
        }
        if (jumpType == 0 && task.state == 0) {
            btnState = {
                skin: "noZip/btn_gray.png",
                label: btnText,
                mouseEnable: false,
                labelStrokeColor: "#0b3170"
            };
        }
        btnState["state"] = task.state;
        btnState["jumpType"] = jumpType;
        return btnState;
    }
    
    static getClientTime() {
        return GameData.Instance.serverTimeStamp;
    }
    
    /**秒转换分钟字符串 00:00 */            
    static SecsToMinStr(num) {
        var m = Math.floor(num / 60).toString();
        var s = (num % 60).toString();
        return GlobalFunc.FillStrStart(m, 2, "0") + ":" + GlobalFunc.FillStrStart(s, 2, "0");
    }
    
    static getRestTime(targetTime, currentTime) {
        var date = (targetTime - currentTime) / 1e3;
        var days = Math.floor(date / 86400);
        date = date % 86400;
        var hours = Math.floor(date / 3600);
        date = date % 3600;
        var minutes = Math.floor(date / 60);
        var seconds = Math.floor(date % 60);
        var time = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
        return time;
    }
    
    static getTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear();
        var M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var D = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        let time = {
            years: Y,
            months: M,
            days: D,
            hours: h,
            minutes: m
        };
        return time;
    }
    
    static getMousePos() {
        return {
            x: Laya.stage.mouseX,
            y: Laya.stage.mouseY
        };
    }
    
    //炮台位置
    static getSeatPos() {
        var y1 = 786;
        var y2 = -37;
        var sw = GlobalConst.stageW;
        var x1 = sw * 1 / 4;
        var x2 = sw * 3 / 4;
        if (!BattleData.Instance.isFlip) {
            return [ {}, {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y1
            }, {
                x: x1,
                y: y2
            }, {
                x: x2,
                y: y2
            } ];
        } else {
            //翻转
            return [ {}, {
                x: x1,
                y: y2
            }, {
                x: x2,
                y: y2
            }, {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y1
            } ];
        }
    }
    
    static getCannonPos() {
        var y1 = 750;
        var y2 = 0;
        var sw = GlobalConst.stageW;
        var x1 = sw * 1 / 4;
        var x2 = sw * 3 / 4;
        if (!BattleData.Instance.isFlip) {
            return [ {}, {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y1
            }, {
                x: x1,
                y: y2
            }, {
                x: x2,
                y: y2
            } ];
        } else {
            //翻转
            return [ {}, {
                x: x1,
                y: y2
            }, {
                x: x2,
                y: y2
            }, {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y1
            } ];
        }
    }
    
    //座位钻石金币
    static getSeatInfoPos() {
        var x1 = Laya.stage.width - 96;
        var y1 = BattleData.Instance.isFlip ? 50 : 700;
        var y2 = BattleData.Instance.isFlip ? 700 : 50;
        // 固定方案
                        return [ {}, {
            x: 96,
            y: y1
        }, {
            x: x1,
            y: y1
        }, {
            x: 96,
            y: y2
        }, {
            x: x1,
            y: y2
        } ];
    }
    
    //大鱼展示位置
    static getBigFishPos() {
        var sw = GlobalConst.stageW;
        var x1 = sw * 1 / 4;
        var x2 = sw * 3 / 4;
        // var x1 = 180;
        // var x2 = 855;
                        var y1_ = 170;
        var y2_ = 570;
        var y1 = BattleData.Instance.isFlip ? y1_ : y2_;
        var y2 = BattleData.Instance.isFlip ? y2_ : y1_;
        return [ {}, {
            x: x1,
            y: y1
        }, {
            x: x2,
            y: y1
        }, {
            x: x1,
            y: y2
        }, {
            x: x2,
            y: y2
        } ];
    }
    
    /**获取渔场内玩家辅助面板位置 */            
    static getRoomHelpPos() {
        var sw = GlobalConst.stageW;
        var x1 = sw * 1 / 4;
        var x2 = sw * 3 / 4;
        var y = 494;
        return [ {}, {
            x: x1,
            y: y
        }, {
            x: x2,
            y: y
        }, {
            x: x1,
            y: y
        }, {
            x: x2,
            y: y
        } ];
    }
    
    /**其他玩家信息面板位置 */            
    static getOtherOneInfoPos() {
        var sw = GlobalConst.stageW;
        var x1 = sw * 1 / 4;
        var x2 = sw * 3 / 4;
        var y11 = 550;
        var y22 = 750 - y11;
        var y1 = BattleData.Instance.isFlip ? y22 : y11;
        var y2 = BattleData.Instance.isFlip ? y11 : y22;
        return [ {}, {
            x: x1,
            y: y1
        }, {
            x: x2,
            y: y1
        }, {
            x: x1,
            y: y2
        }, {
            x: x2,
            y: y2
        } ];
    }
    
    static getBulletSpeed() {
        return Math.ceil(Math.sqrt(Math.pow(GlobalConst.stageW, 2) + Math.pow(GlobalConst.stageH, 2)) + 100) / 2;
    }
    
    static uiClose(ui) {
        ui.visible = false;
        ui.mouseEnabled = false;
    }
    
    static uiOpen(ui) {
        ui.visible = true;
        ui.mouseEnabled = true;
    }
    
    static getStageBounds() {
        GlobalConst.stageW = Laya.stage.width;
        GlobalConst.stageH = Laya.stage.height;
    }
    
    /** 改变数据显示方式，超过万则显示多少万等 */            
    static changeNum(num_) {
        var num = Number(num_);
        if (num < 1e8) return String(num > 9999 ? parseInt(String(num / 1e3)) / 10 + "万" : num); else return String(parseInt(String(num / 1e7)) / 10 + "亿");
    }
    
    static pDotPos(node1, node2) {
        return node1.x * node2.x + node1.y * node2.y;
    }
    
    static pSubPos(node1, node2) {
        return {
            x: node1.x - node2.x,
            y: node1.y - node2.y
        };
    }
    
    static pMulPos(node1, factor) {
        return {
            x: node1.x * factor,
            y: node1.y * factor
        };
    }
    
    static pAddPos(node1, node2) {
        return {
            x: node1.x + node2.x,
            y: node1.y + node2.y
        };
    }
    
    static pGetLength(node1) {
        return Math.sqrt(node1.x * node1.x + node1.y * node1.y);
    }
    
    static pGetDistance(node1, node2) {
        return GlobalFunc.pGetLength(GlobalFunc.pSubPos(node1, node2));
    }
    
    //vec求角度
    static vecToAngle(ptFrom, ptTo) {
        return GlobalFunc.getFloat(-Math.atan2(ptTo.y - ptFrom.y, ptTo.x - ptFrom.x) / Math.PI * 180, 2);
    }
    
    //角度弧度互相转换
    static radToangle(rad) {
        return rad / Math.PI * 180;
    }
    
    static angleToRad(angle) {
        return angle * Math.PI / 180;
    }
    
    //保留小数点后多少位
    static getFloat(f, n = 2) {
        var m = Math.pow(10, n);
        return Math.round(f * m) / m;
    }
    
    //前面字符填充，类似printf(%02d)
    static FillStrStart(str, len, ch) {
        while (str.length < len) str = ch + str;
        return str;
    }
    
    //数字显示用逗号隔开
    static  transNumByComma(num_) {
        var num = (num_ || 0).toString();
        var result = "";
        while (num.length > 3) {
            result = "," + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        return result;
    }
    
    //将付费道具加到免费道具中,用下面的
    // export function transDanTou2(data) {
    //     if (!data) return;
    //     for (var i in data) {
    //         var itemId = Number(data[i].item_id);
    //         if ((itemId >= 15 && itemId <= 18) || itemId == 5 || itemId == 6) {
    //             var flag = 0;
    //             for (var j in data) {
    //                 if (Number(data[j].item_id) == itemId - 4) {
    //                     //后端的字段有时是count有的是item_count,先将就一下
    //                     if (data[j].item_count) {
    //                         data[j].item_count += data[i].item_count;
    //                         data[i].item_count = 0;
    //                     } else {
    //                         data[j].count += data[i].count;
    //                         data[i].count = 0;
    //                     }
    //                     flag = 1;
    //                     break;
    //                 }
    //             }
    //             if (flag != 1) {
    //                 data[i].item_id = itemId - 4;
    //             }
    //         }
    //     }
    //     //item数量为零的删除
    //     var len = data.length;
    //     for (var k = len - 1; k >= 0; k--) {
    //         //原因同上
    //         if (data[k].item_count != null) {
    //             if (data[k].item_count == 0) {
    //                 data.splice(k, 1);
    //             }
    //         } else {
    //             if (data[k].count == 0) {
    //                 data.splice(k, 1);
    //             }
    //         }
    //     }
    //     return data;
    // }
    /**付费金币和免费金币转换 */            
    static transGoldItem(data) {
        if (!data) return;
        for (let i in data) {
            if (data[i].item_id == 5) data[i].item_id = 1;
            if (data[i].itemID == 5) data[i].itemID = 1;
        }
        return data;
    }
    
    /**获取VIP相应等级ICON */            
    static getVipIcon(level) {
        let skin = "";
        if (level == 0) {
            skin = "common/img_huiz_0.png";
        } else if (level == 1) {
            skin = "common/img_huiz_1.png";
        } else if (level == 2) {
            skin = "common/img_huiz_2.png";
        } else if (level == 3) {
            skin = "common/img_huiz_3.png";
        } else if (level == 4) {
            skin = "common/img_huiz_4.png";
        } else if (level == 5) {
            skin = "common/img_huiz_5.png";
        } else if (level == 6) {
            skin = "common/img_huiz_6.png";
        } else if (level == 7) {
            skin = "common/img_huiz_7.png";
        } else if (level == 8) {
            skin = "common/img_huiz_8.png";
        } else if (level == 9) {
            skin = "common/img_huiz_9.png";
        } else if (level == 10) {
            skin = "common/img_huiz_10.png";
        }
        return skin;
    }
    
    /**切换左侧tab数据及资源 */            
    static changeRankState(children, target) {
        let targetIndex = undefined;
        for (let index = 0; index < children.length; index++) {
            var child = children[index];
            child.skin = "common/btn_4.png";
            child.labelColors = "#0b3170";
            child.labelStroke = 0;
            child.zOrder = index + 1;
        }
        target.skin = "common/btn_5.png";
        target.labelColors = "#ffffff";
        target.labelStroke = 4;
        target.zOrder = 10;
        if (target.name == "item0") {
            targetIndex = 0;
        } else if (target.name == "item1") {
            targetIndex = 1;
        } else if (target.name == "item2") {
            targetIndex = 2;
        } else if (target.name == "item3") {
            targetIndex = 3;
        }
        if (target != undefined) {
            return targetIndex;
        } else {
            GlobalFunc.log("获取tab-target对象失败");
        }
    }
    
    /**获取html */            
    static getHtmlText(array) {
        let html = "";
        // for (let index = 0; index < array.length; index++) {
        //     let textData = array[index];
        //     html += getHtml(textData.text, textData.color, textData.size);
        // }
        return html;
    }
    
    // italic:true|false;					是否是斜体
    // bold:true|false;						是否是粗体
    // letter-spacing:10px;					字间距
    // font-family:宋体; 					字体
    // font-size:20px;						字体大小
    // font-weight:bold:none;				字体是否是粗体，功能同bold
    //  color:#ff0000;						字体颜色
    //  stroke:2px;							字体描边宽度
    //  strokeColor:#ff0000;					字体描边颜色
    //  padding:10px 10px 20px 20px;			边缘的距离
    //  vertical-align:top|bottom|middle;	垂直对齐方式
    //  align:left|right|center;				水平对齐方式
    //  line-height:20px;					行高
    //  background-color:#ff0000;			背景颜色
    //  border-color:#ff0000;				边框颜色
    //  width:100px;							对象宽度
    //  height:100px;						对象高度
    static getHtml(text, color, size = "26") {
        let labelColor;
        let strokeColor;
        switch (color) {
          case GlobalConst.GoldText:
            labelColor = "#ffec4c";
            strokeColor = "#70200b";
            break;

          case GlobalConst.WhiteText:
            labelColor = "#ffffff";
            strokeColor = "#0b3170";
            break;

          case GlobalConst.BlueText:
            labelColor = "#85efff";
            strokeColor = "#004b6e";
            break;

          case GlobalConst.RedText:
            labelColor = "#f34a47";
            strokeColor = "#0b3170";
            break;

          default:
            return undefined;
        }
        var html = "<span style='color:" + labelColor + ";bold:true;font-family:SimHei;" + "font-size:" + size + "px;stroke:4px;strokeColor:" + strokeColor + ";'>" + text + "</span>";
        return html;
    }
    
    /**获取label组件 */            
    static getColorText(string, size = 32, color = "#ffffff", strokeColor = "#0b3170", font = null, stroke = 4) {
        var txt = new Laya.Label();
        txt.color = color;
        txt.font = "SimHei";
        txt.fontSize = size;
        txt.text = string;
        txt.strokeColor = strokeColor;
        txt.align = "left";
        txt.valign = "middle";
        txt.stroke = 4;
        txt.bold = true;
        txt.autoSize = true;
        font && (txt.font = font);
        return txt;
    }
    
    /**按钮切换成橙色 */            
    static changeButtonToOrange(button, text = undefined) {
        button.skin = "basePic/btn_yellow.png";
        button.strokeColors = "#70200b";
        button.mouseEnabled = true;
        if (text) {
            button.label = text;
        }
    }
    
    
    /**按钮切换成绿色 */            
    static changeButtonToGreen(button, text = undefined) {
        button.skin = "noZip/btn_green.png";
        button.strokeColors = "#226306";
        button.mouseEnabled = true;
        if (text) {
            button.label = text;
        }
    }
    
    /**按钮切换成灰色 */            
    static changeButtonToGray(button, text = undefined) {
        button.skin = "noZip/btn_gray.png";
        button.strokeColors = "#0b3170";
        button.mouseEnabled = false;
        if (text) {
            button.label = text;
        }
    }
    
    /**按钮切换成蓝色 */            
    static  changeButtonToBlue(button, text = undefined) {
        button.skin = "common/btn_blue.png";
        button.strokeColors = "#0b3170";
        button.mouseEnabled = true;
        if (text) {
            button.label = text;
        }
    }
    
    /**计算合法的炮台旋转角度 */            
    static  calLegalAngle(angle) {
        if (angle < 1 && angle > -90) {
            angle = 1;
        } else if (angle > 179 || angle < -90 && angle > -180) {
            angle = 179;
        }
        return angle;
    }
    
    //tips
    static globalTip(txt) {
        //BattleData.Instance.roomWarnMessage = new WarningMessage_1.WarningMessage(txt, true);
    }
    
    /**屏幕中是否有鱼 */            
    static isHaveFishInScreen() {
        let nodes = FishData.fishNodesObj;
        for (let index in nodes) {
            let fish = nodes[index];
            if (!fish) continue;
            if (fish.isInScreen) {
                return true;
            }
        }
        return false;
    }
    
    /**判断子弹是否在鱼的锁定点内 */            
    static isBulletHitFish(obj1, fish, radius = 35) {
        if (fish.beginDead == true) return false;
        if (GlobalFunc.pGetDistance({
            x: fish.x,
            y: fish.y
        }, {
            x: obj1.x,
            y: obj1.y
        }) > Math.max(fish.selfH, fish.selfW) + radius) return false;
        var lockP = fish.getLockP();
        var lockPLen = lockP.length;
        for (var i = 0; i < lockPLen; ++i) {
            var lock = lockP[i];
            var len = GlobalFunc.pGetDistance({
                x: obj1.x,
                y: obj1.y
            }, {
                x: lock.x,
                y: lock.y
            });
            if (len <= lock.r + radius) return true;
        }
        return false;
    }
    
    /**鱼的锁定点移出屏幕外切换锁定点 */            
    static changeLockP(fishNode) {
        if (!fishNode) return {
            x: 0,
            y: 0
        };
        var p = fishNode.getLockP();
        var len = p.length;
        if (!len) return {
            x: 0,
            y: 0
        };
        for (var i = 0; i < len; i++) {
            if (p[i].x < 0 || p[i].y < 0 || p[i].x > GlobalConst.stageW || p[i].y > GlobalConst.stageH) continue;
            return {
                x: p[i].x,
                y: p[i].y
            };
        }
        return {
            x: p[len - 1].x,
            y: p[len - 1].y
        };
    }
    
    /**获取五龙珠龙座索引值 */            
    static getDragonSeatindex(color) {
        if (color == "white") {
            return 0;
        } else if (color == "blue") {
            return 1;
        } else if (color == "purple") {
            return 2;
        } else if (color == "red") {
            return 3;
        } else if (color == "green") {
            return 4;
        } else {
            return -1;
        }
    }
    
    /**获取五龙珠颜色 */            
    static getDragonSeatColor(index) {
        if (index == 0) {
            return "white";
        } else if (index == 1) {
            return "blue";
        } else if (index == 2) {
            return "purple";
        } else if (index == 3) {
            return "red";
        } else if (index == 4) {
            return "green";
        }
    }
    
    /**获取五龙珠龙座皮肤 */            
    static getDragonSeatSkin(index) {
        if (index == 0) {
            return "scene/DragonSeatNode/image_dragon_white.png";
        } else if (index == 1) {
            return "scene/DragonSeatNode/image_dragon_blue.png";
        } else if (index == 2) {
            return "scene/DragonSeatNode/image_dragon_purple.png";
        } else if (index == 3) {
            return "scene/DragonSeatNode/image_dragon_red.png";
        } else if (index == 4) {
            return "scene/DragonSeatNode/image_dragon_green.png";
        }
    }
    
    /**获取龙座倍数 */            
    static getDragonSeatTimes(index) {
        if (index == 0) {
            return 4;
        } else if (index == 1) {
            return 8;
        } else if (index == 2) {
            return 20;
        } else if (index == 3) {
            return 10;
        } else if (index == 4) {
            return 8;
        }
    }
    
    static getFishById(id) {
        return FishData.fishNodesObj[id];
    }
    
    
    /**直接添加ani动画到舞台 */            
    static addGlobalAni(x, y, aniName, scale = 1, rotation = 0, layer = GlobalConst.bulletLayer) {
        var sp = GlobalFunc.getBaseEffectNode(aniName);
        if (aniName == "bombBaozha" || aniName == "zuantouBaozha") {
            sp.zOrder = 100;
        }
        sp.scaleX = sp.scaleY = scale;
        sp.rotation = rotation;
        SceneManager.Instance.addToLayer(sp, layer, x, y);
        let ani = sp.getChildByName("ani");
        ani.on(Laya.Event.COMPLETE, this, node => {
            node.removeSelf();
            node.destroy();
        }, [ sp ]);
        return sp;
    }
    
    /**获取基础ani动画节点 */            
    static getBaseEffectNode(frameName) {
        var sp = Laya.Pool.getItemByClass(frameName, Laya.Sprite);
        let ani = Laya.Pool.getItemByClass(frameName, Laya.Animation);
        ani.name = "ani";
        ani = ani.loadAnimation(Laya.ResourceVersion.addVersionPrefix("animation/" + frameName + ".ani"), null, Laya.ResourceVersion.addVersionPrefix("res/atlas2/animation/" + frameName + ".atlas"));
        ani.rotation = 0;
        ani.scale(1, 1);
        ani.play(0, false);
        sp.addChild(ani);
        return sp;
    }
    
    /**直接获取ani动画 */            
    static getAni(frameName, scale = 1) {
        let ani = Laya.Pool.getItemByClass(frameName, Laya.Animation);
        ani = ani.loadAnimation(Laya.ResourceVersion.addVersionPrefix("animation/" + frameName + ".ani"), null, Laya.ResourceVersion.addVersionPrefix("res/atlas2/animation/" + frameName + ".atlas"));
        ani.scale(scale, scale);
        ani.pos(0, 0);
        ani.alpha = 1;
        ani.rotation = 0;
        ani.name = frameName + "_" + GlobalFunc.aniNum++;
        return ani;
    }
    
    /**获取随机方向 */            
    static getRandomDir() {
        return Math.random() - .5 <= 0 ? -1 : 1;
    }
    /**
    * 弹窗弹出动画效果
    * @param dialog 需要弹出的弹窗
    * @param handler 回调函数
    */           
   static openDialog(dialog, handler, isDialogAni = true) {
        let param = {
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        };
        if (dialog.black_bg) {
            dialog.black_bg.alpha = 0;
            Laya.Tween.to(dialog.black_bg, {
                alpha: .75
            }, 200, Laya.Ease.quadIn);
        }
        if (dialog.box_dialog && isDialogAni) {
            dialog.box_dialog.scale(0, 0);
            dialog.box_dialog.alpha = 0;
            Laya.Tween.to(dialog.box_dialog, param, 200, Laya.Ease.quadIn, handler);
        }
    }
    
    /**
    * 弹窗关闭动画效果
    * @param dialog 需要关闭的弹窗
    * @param handler 回调函数
    */            
    static closeDialog(dialog, handler, delay = 200) {
        let param = {
            scaleX: 0,
            scaleY: 0,
            alpha: 0
        };
        // if (dialog.constructor.name == DialogManager_1.default.nowDlg) {
        //     DialogManager_1.default.nowDlg = null;
        // }
        if (dialog.black_bg) {
            Laya.Tween.to(dialog.black_bg, {
                alpha: 0
            }, delay, Laya.Ease.quadOut);
        }
        dialog.box_dialog && Laya.Tween.to(dialog.box_dialog, param, delay, Laya.Ease.quadOut, handler);
    }
    
    /**UI放大效果 */            
    static enlargeUI(node, handler = undefined, delay = 0) {
        Laya.Tween.to(node, {
            scaleX: 1,
            scaleY: 1
        }, 200, Laya.Ease.backOut, handler, delay);
    }
    
    /**UI缩小效果 */            
    static narrowUI(node, handler = undefined, delay = 0) {
        Laya.Tween.to(node, {
            scaleX: 0,
            scaleY: 0
        }, 200, Laya.Ease.backIn, handler, delay);
    }
    
    /**
    * 切换ui
    * @param caller 执行域
    * @param current 当前UI
    * @param target 目标UI
    * @param handler 完成时的回调
    */            
    static changeUI(current, target, handler = undefined) {
        GlobalFunc.narrowUI(current);
        GlobalFunc.enlargeUI(target, handler, 200);
    }
    
    /**
    * 渔场金币动画效果(返回动画实例)
    * @param pos 起始位置
    * @param endPos 终点位置
    * @param handler 动画完成是回调函数
    * @param flyDelay 飞向终点的延迟时间
    */            
    static goldCoinAni(pos, endPos, handler, flyDelay = 0, randomHeight = 50, aniName = "goldCoinAni", startLabel = false) {
        let ani = GlobalFunc.getAni(aniName);
        let timeline = TimeLineManager.Instance.creatTimeLine();
        let backPos = {
            x: (endPos.x - pos.x) * .3,
            y: (endPos.y - pos.y) * .3
        };
        ani.pos(pos.x, pos.y);
        if (startLabel) {
            ani.y += randomHeight * 2;
        }
        if (BattleData.Instance.isInFlyWars) {
            ani.rotation = -90;
            timeline.addLabel("ani_0", 0).to(ani, {
                x: pos.x
            }, 300, Laya.Ease.quadInOut).addLabel("ani_1", 0).to(ani, {
                x: pos.x + randomHeight
            }, 300, Laya.Ease.quadInOut).addLabel("ani_2", 0).to(ani, {
                x: pos.x
            }, 300, Laya.Ease.quadInOut).addLabel("ani_3", 0).to(ani, {
                x: pos.x + randomHeight * .7
            }, 200, Laya.Ease.quadInOut).addLabel("ani_4", 0).to(ani, {
                x: pos.x
            }, flyDelay + 200, Laya.Ease.quadInOut).addLabel("ani_5", 0).to(ani, {
                x: pos.x - backPos.x,
                y: pos.y - backPos.y
            }, 300, Laya.Ease.quadInOut).addLabel("ani_6", 0).to(ani, {
                x: endPos.x,
                y: endPos.y,
                scaleX: .6,
                scaleY: .6
            }, 600, Laya.Ease.quadInOut);
        } else {
            timeline.addLabel("ani_0", 0).to(ani, {
                y: pos.y
            }, 300, Laya.Ease.quadInOut).addLabel("ani_1", 0).to(ani, {
                y: pos.y + randomHeight
            }, 300, Laya.Ease.quadInOut).addLabel("ani_2", 0).to(ani, {
                y: pos.y
            }, 300, Laya.Ease.quadInOut).addLabel("ani_3", 0).to(ani, {
                y: pos.y + randomHeight * .7
            }, 200, Laya.Ease.quadInOut).addLabel("ani_4", 0).to(ani, {
                y: pos.y
            }, flyDelay + 200, Laya.Ease.quadInOut).addLabel("ani_5", 0).to(ani, {
                x: pos.x - backPos.x,
                y: pos.y - backPos.y
            }, 300, Laya.Ease.quadInOut).addLabel("ani_6", 0).to(ani, {
                x: endPos.x,
                y: endPos.y,
                scaleX: .6,
                scaleY: .6
            }, 600, Laya.Ease.quadInOut);
        }
        timeline.play(startLabel ? 0 : "ani_1", false);
        ani.play(0, true);
        timeline.on(Laya.Event.COMPLETE, this, (ani, handler) => {
            if (handler) {
                handler.run();
            }
            ani.removeSelf();
        }, [ ani, handler ]);
        return ani;
    }
    
    /**
    * 金币数字漂浮动画
    * @param pos 起始位置
    * @param handler 动画完成是回调函数
    * @param caller 执行域
    * @param num 金币增加数
    */            
    static numberTextFly(pos, handler, caller, num, scale = .5) {
        let text = new Laya.Label();
        text.text = "+" + Math.floor(num);
        text.anchorX = text.anchorY = .5;
        text.scale(scale, scale);
        text.alpha = 0;
        text.font = GlobalConst.fontNum1;
        text.pos(pos.x, pos.y);
        Laya.Tween.to(text, {
            alpha: 1
        }, 800);
        Laya.Tween.to(text, {
            alpha: 0
        }, 600, Laya.Ease.strongOut, undefined, 800);
        Laya.Tween.to(text, {
            alpha: 0
        }, 1200, Laya.Ease.strongOut, undefined, 1400);
        Laya.Tween.to(text, {
            y: text.y - 200
        }, 2e3, undefined, Laya.Handler.create(caller, data => {
            if (data.handler) {
                data.handler.run();
            }
            data.text.removeSelf();
            data.text.destroy();
        }, [ {
            text: text,
            handler: handler
        } ]));
        return text;
    }
    
    /**道具飞行动画 */            
    static  itemFlyAni(startPos, endPos, itemId, handler) {
        let skin = "res/icon/" + (itemId < 10 ? "skin_" : "icon_") + PlayerData.Instance.getItemData(itemId).skin;
        let img = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(skin));
        img.anchorX = img.anchorY = .5;
        img.pos(startPos.x, startPos.y);
        img.scale(0, 0);
        if (BattleData.Instance.isInFlyWars) img.rotation = -90;
        let isTicket = itemId == GlobalConst.ticket;
        let timeline = TimeLineManager.Instance.creatTimeLine();
        let times = isTicket ? 1.5 : 1;
        let scaleArr = [ 1.2 * times, 1 * times, 1.2 * times, 1 * times, 1.5, .4 * times ];
        timeline.addLabel("ani_0", 0).to(img, {
            scaleX: scaleArr[0],
            scaleY: scaleArr[0]
        }, 300, Laya.Ease.quadInOut).addLabel("ani_1", 0).to(img, {
            scaleX: scaleArr[1],
            scaleY: scaleArr[1]
        }, 300, Laya.Ease.quadInOut).addLabel("ani_2", 0).to(img, {
            scaleX: scaleArr[2],
            scaleY: scaleArr[2]
        }, 300, Laya.Ease.quadInOut).addLabel("ani_3", 0).to(img, {
            scaleX: scaleArr[3],
            scaleY: scaleArr[3]
        }, 300, Laya.Ease.quadInOut).addLabel("ani_4", 0).to(img, {
            scaleX: scaleArr[4],
            scaleY: scaleArr[4]
        }, 300, Laya.Ease.quadInOut).addLabel("ani_5", 0).to(img, {
            scaleX: scaleArr[5],
            scaleY: scaleArr[5]
        }, 300, Laya.Ease.quadInOut);
        Laya.Tween.to(img, {
            x: endPos.x,
            y: endPos.y
        }, 600, Laya.Ease.quadInOut, handler, 1200);
        timeline.on(Laya.Event.COMPLETE, this, data => {
            data.timeline.destroy();
            data.img.removeSelf();
        }, [ {
            img: img,
            timeline: timeline
        } ]);
        timeline.play(0, false);
        return img;
    }
    
    /**执行物品飞行动画 */            
    static  doItemFlyAni(param) {
        let coinNums = [ 3, 6, 11 ];
        let coinIndex;
        let count;
        let isSmall = param.characterType == 1;
        let isMiddle = param.characterType == 2 || param.characterType == 3 || param.characterType == 50;
        let isVipFish = param.characterType == 60;
        let isBig = param.characterType == 10 || param.characterType == 30 || GlobalFunc.checkSpFish(param.characterType);
        if (!isSmall && !isMiddle && !isBig && !isVipFish) return;
        coinIndex = isSmall ? 0 : isMiddle ? 1 : 2;
        count = coinNums[coinIndex];
        count + Math.floor(Math.random() + .5);
        let coinArea = [ 60, 100, 130 ];
        let points = [];
        let width = param.isCommon ? 70 : coinArea[coinIndex];
        initPoint(param.isCommon, true);
        while (count > 0) {
            initPoint(param.isCommon);
            count--;
            if (count == 1) {
                points.forEach((value, index) => {
                    delete points[index];
                });
            }
        }
        function initPoint(isCommon, isFirst = false) {
            //iscommom是否是大厅免费金币掉落的效果
            let point = GlobalFunc.checkPoint(param.startPoint, width, points, isCommon);
            points.push(point);
            let item = GlobalFunc.goldCoinAni(point, param.endPoint, new Laya.Handler(this, () => {
                //需要加有效数据拦截
                if (isCommon || !isFirst) return;
                let soundName = GlobalConst.Sud_getDiamond;
                if (BattleData.Instance.isInFlyWars || !!param.seat && param.seat.seatIndex == FishData.mySeatIndex) {
                    SoundManager.Instance.playSound(soundName, 1, 10, undefined, undefined, true);
                }
                if (!param.seat) return;
                if (param.aniName == "goldCoinAni") param.seat.updateGold(true); else if (param.aniName == "diamondCoinAni") param.seat.updateTicket(true);
            }), count * 40, 50, param.aniName);
            SceneManager.Instance.addToLayer(item, GlobalConst.effectTopLayer);
        }
    }
    
    static  canNodeInfoEffext(params) {
        var timeLine = TimeLineManager.Instance.creatTimeLine();
        timeLine.addLabel("numPlay1", 0).to(params.obsp, {
            scaleX: 1.2,
            scaleY: 1.2
        }, 100).addLabel("numPlay2", 0).to(params.obsp, {
            scaleX: 1,
            scaleY: 1
        }, 200);
        var timeIndex = this.timeNum++ % 1e3;
        this.timeLineArr[timeIndex] = timeLine;
        timeLine.play();
        if (params.callBack) {
            timeLine.on(Laya.Event.COMPLETE, this, params.callBack);
        }
    }
    
    static checkPoint(startPoint, width, points = [], isCommon = false) {
        let point = setPoint(startPoint, width);
        for (let i = 0; i < points.length; i++) {
            if (isCommon) {
                break;
            }
            if (points[i] && point.distance(points[i].x, points[i].y) < 63) {
                return GlobalFunc.checkPoint(startPoint, width, points);
            }
        }
        return point;
        function setPoint(startPoint, width) {
            let x = GlobalFunc.getRandom(startPoint.x - width, startPoint.x + width);
            let y = GlobalFunc.getRandom(startPoint.y - width, startPoint.y + width);
            return new Laya.Point(x, y);
        }
    }
    
    /**获取黄金鱼爆炸动画 */            
    static getGoldFishBoomEffect(deadPos, scale = 1.8, isSelf = true, isMoney = true) {
        var max_gold = 80;
        //单次爆炸最大金币数
        var min_gold = 70;
        var goldNum = GlobalFunc.getRandom(min_gold, max_gold);
        isMoney && (goldNum = 0);
        var pos;
        var sp = new Laya.Sprite();
        sp.width = 475;
        sp.height = 475;
        sp.pivot(0, 0);
        sp.pos(deadPos.x, deadPos.y);
        var sp1 = GlobalFunc.getAniEffectNode("goldFishBoomBg");
        sp1.blendMode = "lighter";
        sp1.scale(scale, scale);
        sp1.on(Laya.Event.COMPLETE, this, sp1 => {
            sp1.removeSelf();
            sp1.destroy();
            sp.removeSelf();
            sp.destroy();
            // Laya.Loader.clearTextureRes(globalVar.reUrl + "atlas/goldFishBoomBg.atlas")
                        }, [ sp1 ]);
        sp.addChild(sp1);
        var sp2 = [];
        for (var i = 0; i < goldNum; i++) {
            initData(sp, i, 1.8, isSelf);
        }
        return sp;
        function initData(sp, i, scale = 1.8, isSelf = true) {
            pos = GlobalFunc.getRandNum();
            sp2[i] = GlobalFunc.getAniEffectNode(isSelf ? "goldCoinAni" : "sliverCoinAni", true, pos.f, pos.rota);
            sp.addChild(sp2[i]);
            scale != 1.8 && sp2[i].scale(.1, .1);
            scale != 1.8 && Laya.Tween.to(sp2[i], {
                scaleX: 1,
                scaleY: 1
            }, 1e3);
            Laya.Tween.to(sp2[i], {
                x: pos.x,
                y: pos.y,
                alpha: pos.a
            }, pos.t, null, Laya.Handler.create(sp2, coinNode => {
                coinNode.clear();
                coinNode.removeSelf();
                coinNode.destroy();
            }, [ sp2[i] ], false));
        }
    }
    
    static getSpGoldEffect(deadPos, skin = "") {
        var max_gold = 200;
        //单次爆炸最大金币数
        var min_gold = 70;
        var goldNum = GlobalFunc.getRandom(min_gold, max_gold);
        var pos;
        var sp = new Laya.Sprite();
        sp.width = 475;
        sp.height = 475;
        sp.pivot(0, 0);
        sp.pos(deadPos.x, deadPos.y);
        var sp2 = [];
        for (var i = 0; i < goldNum; i++) {
            initData(sp, i, skin);
        }
        return sp;
        function initData(sp, i, skin) {
            pos = GlobalFunc.getRandNum(1400, 300);
            if (skin == "") {
                sp2[i] = GlobalFunc.getAniEffectNode("goldCoinAni", true, pos.f, pos.rota);
            } else {
                sp2[i] = new Laya.Image(Laya.ResourceVersion.addVersionPrefix(skin));
            }
            let delay = 0;
            sp.addChild(sp2[i]);
            sp2[i].scale(.1, .1);
            let posx = sp2[i].x;
            let posy = sp2[i].y;
            let k = (pos.y - posy) / (pos.x - posx);
            let minus = posy - k * posx;
            let mid = (pos.x + posx) / 2;
            let targer = mid * k + minus;
            Laya.Tween.to(sp2[i], {
                x: mid,
                y: targer,
                alpha: 1,
                scaleX: 1,
                scaleY: 1
            }, pos.t / 2, null);
            Laya.Tween.to(sp2[i], {
                x: pos.x,
                y: pos.y,
                scaleX: 1.5,
                scaleY: 1.5
            }, 1500, null, Laya.Handler.create(sp2, img => {
                img.removeSelf();
                img.destroy();
            }, [ sp2[i] ], false), pos.t / 2);
        }
    }
    
    /**获取Ani动画节点 */            
    static getAniEffectNode(frameName, isRepeat = false, frame = null, rota = 0, scalem = 1, name = null) {
        var ani = new Laya.Animation();
        ani.loadAnimation(Laya.ResourceVersion.addVersionPrefix("animation/" + frameName + ".ani"), null, Laya.ResourceVersion.addVersionPrefix("res/atlas2/animation/" + frameName + ".atlas"));
        ani.name = "anim";
        ani.rotation = rota;
        ani.scale(scalem, scalem);
        if (name) {
            ani.play(frame, isRepeat, name);
        } else {
            ani.play(frame, isRepeat);
        }
        return ani;
    }

    static getRandNum(max_s = 750, min_s = 150) {
        var max_s = max_s;
        //随机速度最大值
        var min_s = min_s;
        var max_r = 360;
        //随机角度最大值
        var min_r = 0;
        var max_t = 1e3;
        //随机时间最大值
        var min_t = 500;
        var max_f = 7;
        //随机初始帧率最大值
        var min_f = 0;
        var max_a = 8;
        //随机透明度最大值
        var min_a = 6;
        var rota = GlobalFunc.getRandom(min_r, max_r);
        //金币初始旋转角度
        var f = GlobalFunc.getRandom(min_f, max_f);
        //帧率
        var s = GlobalFunc.getRandom(min_s, max_s);
        //速度
        var t = GlobalFunc.getRandom(min_t, max_t);
        //时间 单位毫秒
        var a = GlobalFunc.getRandom(min_a, max_a);
        //透明度
        var t_s = t / 1e3;
        //时间 单位秒
        var d = s * t_s;
        //距离
        var k = 0;
        //斜率
        var r;
        //角度
        var x;
        var y;
        r = Math.floor(Math.random() * (max_r - min_r + 1) + min_r);
        if (r != 90 && r != 270) {
            k = Math.tan(r);
            x = d / Math.sqrt(Math.pow(k, 2) + 1);
            if (r > 90 && r < 270) {
                x = -x;
            }
            y = k * x;
        } else if (r == 90) {
            x = 0;
            y = -d;
        } else if (r == 270) {
            x = 0;
            y = d;
        }
        return {
            x: x,
            y: y,
            t: t,
            f: f,
            rota: rota,
            a: a / 10
        };
    }
    
    static searchTarget(fishs) {
        if (!fishs) return;
        let target;
        for (let index in fishs) {
            let fish = fishs[index];
            if (!fish) continue;
            if (!target && !fish.beginDead && fish.isInScreen) {
                target = fish;
                continue;
            }
            let isTarget = target && !fish.beginDead && fish.isInScreen;
            if (isTarget && (fish.characterType > target.characterType || fish.characterType == target.characterType && fish.type > target.type)) {
                target = fish;
            }
        }
        return target;
    }
    
    /**
    * 获取鱼种图标
    * @param id 鱼的ID
    */
    // export function getFishIcon(id: string): Laya.Image {
    //     let fishInfo = g_battleData.fishData[id];
    //     let image: Laya.Image;
    //     image = new Laya.Image(fishInfo ? ("res/icon/" + fishInfo.Icon + ".png") : "");
    //     return image;
    // }
    //解锁新渔场
    static switchRoom(id) {
        if (id == 1 || id == 2) {
            UIUtils.showDisplay("NewRoomChangeDlg", this, () => {
                let dlg = SceneManager.Instance.getSceneByName("NewRoomChangeDlg");
                SceneManager.Instance.addToMiddLayer(dlg, GlobalConst.dialogLayer);
            });
        }
    }
    
    /**按属性排序辅助函数*/            
    static compare(property) {
        return function(a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        };
    }
    
    //根据鱼fishuniqid反推teamid formationid formationindex
    static getFishCfgIds(fishUniqId) {
        var arr = fishUniqId.split("_");
        return {
            teamId: arr[0],
            formationId: arr[1],
            formationIndex: arr[2]
        };
    }
    
    
    /**封装打印*/            
    static log(...optionalParams) {
        // return;
        var logHasObj = true;
        var includeStr = {
            heart: true
        };
        var excludeStr = {
            heart: true
        };

        if (!!!optionalParams) return;
        var s = "";
        for (var i = 0; i < optionalParams.length; i++) {
            var v = optionalParams[i];
            if (typeof v == "object" && logHasObj) {
                console.log(v);
            } else {
                s = s + " " + optionalParams[i];
            }
        }
        if (!StringFunc.isContainStr(s, excludeStr)) {
            console.log(s);
        }
    }
    
    //封装zorder，避免zorder混乱
    static globalSetZorder(node, zOrder) {
        if (!!node) {
            node.zOrder = zOrder;
        }
    }
    
    //获取区间内合法值
    static getLoopValue(v, min, max) {
        if (!v) return min;
        if (v < min) return max;
        if (v > max) return min;
        return v;
    }
    
    /**判断是否是特色鱼 */            
    static checkSpFish(type) {
        return type >= 21 && type <= 26;
    }
    
    /**时间差 */
    // export function testFish(step) {
    //     var nowTime = getClientTime()
    //     var lastTime = g_battleData.lastTime || nowTime
    //     GlobalFunc.log("testFish "+ step, nowTime- lastTime)
    //     g_battleData.lastTime = getClientTime()
    // }
    /**获取物品数组中指定物品ID数量 */            
    static getItemNumFromArr(arr, item_id) {
        let itemNum = 0;
        for (let index = 0; index < arr.length; index++) {
            let item = arr[index];
            if (item.item_id == item_id) {
                itemNum = item.count;
            }
        }
        return itemNum;
    }
    
    static sortObj(obj, isPc = false) {
        let newkey = Object.keys(obj).sort();
        let str = "";
        for (var i = 0; i < newkey.length; i++) {
            str += newkey[i] + "=" + obj[newkey[i]] + "&";
        }
        !isPc && (str += `session_key=${GameData.Instance.wx_session_key}`);
        return str;
    }
    
    /**获取渔场中我的炮台的角度 */            
    static getMyCannonAngle() {
        if (!FishData.mySeatNode) return;
        var myCannon = FishData.mySeatNode.cannonNode;
        if (!myCannon) return;
        var ptTo = {
            x: Laya.stage.mouseX,
            y: Laya.stage.mouseY
        };
        var ptFrom = {
            x: myCannon.x,
            y: myCannon.y - 34
        };
        var originAngle = GlobalFunc.vecToAngle(ptFrom, ptTo);
        var angle = GlobalFunc.calLegalAngle(originAngle);
        return angle;
    }
    
    /**停服公告 */            
    static serverCloseNotice(notice) {
        UIUtils.showDisplay("OutNoticeDlg", this, () => {
            // let outNoticeDlg = new NoticeDialog_1.OutNoticeDlg();
            // outNoticeDlg.initOutNotice(notice);
            // SceneManager.Instance.addToMiddLayer(outNoticeDlg, GlobalConst.dialogLayer);
        });
    }
    /**上下浮动效果 */            
    static  upDown(obj, oriY) {
        Laya.Tween.clearAll(obj);
        obj.y = oriY;
        Laya.Tween.to(obj, {
            y: obj.y - 15
        }, 800, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(obj, {
                y: obj.y + 15
            }, 800, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
                GlobalFunc.upDown(obj, oriY);
            }));
        }));
    }
    /**炮倍因贵族等级不足打开提示 */            
    static  openTipsForVip(cur_pao) {
        let handler = new Laya.Handler(this, () => {
            //DialogManager_1.default.getDialogByName(GlobalConst.DIA_VIPCHARGE);
        });
        let needVip = "0";
        let vipDatas = ConfigData.Instance.vipData;
        for (let i in vipDatas) {
            let oneData = vipDatas[i];
            let maxGun = +oneData.maxGun;
            if (BattleData.Instance.isInFlyWars) maxGun = +oneData.plane_maxGun;
            if (FishData.isVipBattle) maxGun = +oneData.vipRoom_maxGun;
            if (maxGun >= +cur_pao) {
                needVip = oneData;
                break;
            }
        }
        let vipData = ConfigData.Instance.getVipDataByKey(PlayerData.Instance.vip_level);
        let vipMax = +vipData.maxGun;
        BattleData.Instance.isInFlyWars && (vipMax = +vipData.plane_maxGun);
        FishData.isVipBattle && (vipMax = +vipData.vipRoom_maxGun);
        var param = {
            pao: vipMax
        };
        NetManager.Instance.reqChangePao(param);
        BattleData.Instance.roomPlayerData[FishData.mySeatIndex].cur_pao = vipMax;
        EventDis.Instance.dispatchEvent("updatepao", vipMax);
        // let tips = new VipPaoDialog_1.default(cur_pao, needVip);
        // SceneManager.Instance.addToMiddLayer(tips, GlobalConst.dialogLayer);
    }

    /**确认当前炮倍是贵族等级足够 */            
    static checkVipToFire(cur_pao = undefined, isTips = true) {
        let vipData = ConfigData.Instance.getVipDataByKey(PlayerData.Instance.vip_level);
        let vipMax = +vipData.maxGun;
        if (BattleData.Instance.isInFlyWars) vipMax = +vipData.plane_maxGun;
        if (FishData.isVipBattle) vipMax = +vipData.vipRoom_maxGun;
        cur_pao = cur_pao != undefined ? cur_pao : +BattleData.Instance.getSitInfo(FishData.mySeatIndex).cur_pao;
        if (cur_pao > vipMax) {
            if (FishData.isAutoButtonOn) {
                EventDis.Instance.dispatchEvent(GlobalVar.CHANGE_AUTO_PAO_STATE);
                GlobalFunc.openTipsForVip(cur_pao);
            } else {
                isTips && GlobalFunc.openTipsForVip(cur_pao);
            }
            FishData.isAutoButtonOn = false;
            return false;
        }
        return true;
    }
    
    /**获取空格宽度 */            
    static getInterval(width, fontSize = 25) {
        let spaceWidth;
        let space = new Laya.Label(" ");
        space.font = "SimHei";
        space.bold = true;
        space.fontSize = fontSize;
        spaceWidth = space.displayWidth;
        let text = "";
        let spaceNum = Math.ceil(width / spaceWidth);
        for (let index = 0; index < spaceNum; index++) {
            text += " ";
        }
        return text;
    }
    
    /**深拷贝对象 */            
    static copyObj(obj) {
        if (!obj) {
            return {};
        } else {
            return JSON.parse(JSON.stringify(obj));
        }
    }
    
    /**获取龙炮对应ID */            
    static getDragonCannonID(type) {
        // if (type == DragonCannonNode_1.DragonType.GREEN_CANNON) {
        //     return "34";
        // } else if (type == DragonCannonNode_1.DragonType.SILVER_CANNON) {
        //     return "35";
        // } else if (type == DragonCannonNode_1.DragonType.GOLD_CANNON) {
        //     return "36";
        // }
        return "";
    }
    
    static enterRoomFailed(needGold) {
        let str1 = GlobalFunc.getColorText("你的金币不足");
        let str3 = GlobalFunc.getColorText("" + needGold, 32, "#ffde00");
        //, "#5e2100");
                        let str2 = GlobalFunc.getColorText(`无法进入该房间`);
        let alert;
        // if (!OnOffManager.isChargeOn) {
        //     alert = new CommonDialog_1.default(1, [ str1, str3 ], [ str2 ], "确定", "提示", true);
        // } else {
        //     alert = new CommonDialog_1.default(1, [ str1, str3 ], [ str2 ], "充值", "提示", false, new Laya.Handler(this, () => {
        //         DialogManager_1.default.getDialogByName(GlobalConst.DIA_SHOP);
        //     }));
        // }
        SceneManager.Instance.addToMiddLayer(alert, GlobalConst.dialogLayer);
    }
    
    static setReset(isChild = false, box, target = []) {
        let visibles = [];
        let childs = target;
        box.removeChildren();
        for (let i = 0; i < childs.length; i++) {
            let child = childs[i];
            visibles[i] = isChild ? child._children[0] && child._children[0].visible : child.visible;
            //显示的控件是否是子对象
                                visibles[i] && box.addChild(child);
        }
    }
    
    /**渔场内多物品掉落动画 */            
    static roomItemsFlyAni(data) {
        let isSelf = data.seatIndex == FishData.mySeatIndex;
        let picNum = Math.min(data.itemNum, 10);
        let points = [];
        for (let i = 0; i < picNum; i++) {
            points.push(GlobalFunc.checkPoint(data.startPos, 40 + picNum * 10, points));
        }
        let callBack;
        if (!BattleData.Instance.isInFlyWars) {
            let seatInfo = FishData.seatNodes[data.seatIndex].seatInfoNode;
            if (data.itemId == +GlobalConst.TicketID) {
                callBack = new Laya.Handler(seatInfo, seatInfo.updateTicket, [ true ]);
            }
            points.forEach((point, index, arr) => {
                let newEnd = PlayerData.Instance.getItemFlyPos(data.flyPos, data.seatIndex);
                let pic = GlobalFunc.itemFlyAni(point, newEnd, data.itemId, index == arr.length - 1 ? callBack : undefined);
                SceneManager.Instance.addToLayer(pic, GlobalConst.effectTopLayer);
                //奖券
                                });
        }
        if (isSelf && (data.itemId == +GlobalConst.TicketID || data.itemId == 41)) {
            EventDis.Instance.dispatchEvent("kill_ticket");
            let type = data.itemId == +GlobalConst.TicketID ? 1 : 2;
            // UIUtils.showDisplay("TicketTip", this, () => {
            //     let view = new TicketView_1.TicketView();
            //     view.setData(data.itemNum, type);
            //     if (BattleData.isInFlyWars) {
            //         view.rotation = -90;
            //         view.pos(Laya.stage.width / 2 - 400, Laya.stage.height / 2);
            //     } else {
            //         view.pos(Laya.stage.width / 2, Laya.stage.height / 2 - 100);
            //     }
            //     SceneManager.Instance.addToLayer(view, GlobalConst.effectBottomLayer);
            //     //奖券框
            // });
        }
    }
    
    /**获取跑马灯字体颜色 */            
    static getMarqueeColor(color) {
        let data = {
            color: "#ffffff",
            strokeColor: "#000000"
        };
        switch (color) {
          case "green":
            data.color = "#68ff3f";
            data.strokeColor = "#004719";
            break;

          case "red":
            data.color = "#ff5551";
            data.strokeColor = "#5a0000";
            break;

          case "white":
            data.color = "#ffffff";
            data.strokeColor = "#0b3170";
            break;

          case "blue":
            data.color = "#85efff";
            data.strokeColor = "#004b6e";
            break;

          case "yellow":
            data.color = "#ffde00";
            data.strokeColor = "#70200b";
            break;

          default:
            break;
        }
        return data;
    }
    
    
    /**获取龙炮炮倍数 */            
    static getDragonCanPao(type) {
        let pao = 0;
        // switch (type) {
        //   case DragonCannonNode_1.DragonType.GREEN_CANNON:
        //     pao = 100;
        //     break;

        //   case DragonCannonNode_1.DragonType.SILVER_CANNON:
        //     pao = 1e3;
        //     break;

        //   case DragonCannonNode_1.DragonType.GOLD_CANNON:
        //     pao = 1e4;
        //     break;

        //   default:
        //     break;
        // }
        return pao;
    }
    
    static setMonthTime() {
        let serverTime = GameData.Instance.serverTimeStamp;
        let endtime = GameData.Instance.monthEndTime - Math.floor(serverTime * .001);
        GameData.Instance.monthEndDay = Math.max(Math.ceil(endtime / (24 * 60 * 60)), 0);
    }
    
    static setGiftMr(data) {
        if (data && JSON.parse(data)) {
            let info = JSON.parse(data);
            if (+info.takeFlag != 0) GameData.Instance.tomrrowState = 3; else if (PlayerData.Instance.checkMatchDate(info["canTakeTime"])) GameData.Instance.tomrrowState = 2; else GameData.Instance.tomrrowState = 1;
        } else {
            GameData.Instance.tomrrowState = 0;
        }
    }
    
    static decodeUnit8(data) {
        var dataString = "";
        for (var i = 0; i < data.length; i++) {
            dataString += String.fromCharCode(data[i]);
        }
        return dataString;
    }
    
    /**判断是否有新的特惠礼包 */            
    static isHasNewTehuiGift() {
        let thStates = GameData.Instance.newTehuiStates;
        for (let i in thStates) {
            if (thStates[i]) return true;
        }
        return false;
    }
    
    static  setStorage(k, value) {
        if (Single.SingleConfig.platform == Platform.WXGAME) {
            //wx.setStorageSync(k, value);
        } else {
            Laya.LocalStorage.setItem(k, value);
        }
    }
    
    static  getStorage(key) {
        return Single.SingleConfig.platform == Platform.WXGAME ? wx.getStorageSync(key) : Laya.LocalStorage.getItem(key);
    }
    
    static  checkPlatform(platform) {
        return Single.SingleConfig.platform == platform;
    }
    
    static  checkLoginErr(code) {
        GlobalFunc.checkErr(code, true);
        EventDis.Instance.dispatchEvent("loginError");
    }
    
    static  checkErr(code, islogin = false) {
        if (!code || code == 0) return;
        // if (code == ProtoMsg.emResponseCode.WEB_CODE_LOGIN_DEVICE_COUNT_MAX || code == ProtoMsg.emResponseCode.WEB_CODE_LOGIN_IP_COUNT_MAX) {
        //     //小号判定
        //     EventDis.Instance.dispatchEvent("loginError");
        // }
        // showDlg(code);
        // function showDlg(code) {
        //     //return __awaiter(this, void 0, void 0, function*() {
        //         let data = GameModel_1.default.getJson("error");
        //         let str;
        //         if (data && data.error) {
        //             if (Object.keys(GameData.errors).length == 0) {
        //                 for (let index in data.error) {
        //                     let key = Object.keys(data.error[index])[0];
        //                     GameData.errors[key] = data.error[index][key];
        //                 }
        //             }
        //             let error = GameData.errors[code];
        //             str = GlobalFunc.getColorText(error ? error : "系统错误", 24, "#ffffff", "#0b3170");
        //             let commonDialog = new CommonDialog_1.default(1, [ str ], undefined, "确定", "温馨提示");
        //             SceneManager.Instance.addToMiddLayer(commonDialog, GlobalConst.dialogLayer);
        //         }
        //     //});
        // }
    }
    
    static checkLoginAccount(name, pwd) {
        // let acs = buyu.sendToJava("GETLOCALDATA", {
        //     type: "appAc"
        // });
        // let pwds = buyu.sendToJava("GETLOCALDATA", {
        //     type: "appPwd"
        // });
        // let acinfo = acs.split(",");
        // let pwdinfo = pwds.split(",");
        // let index = acinfo.indexOf(name);
        // let newAcs = acs;
        // let newPwd = pwds;
        // if (index != -1) {
        //     //修改密码
        //     pwdinfo[index] = pwd;
        //     if (index == 1) {
        //         newAcs = name + "," + acinfo[0] + (!!acinfo[2] ? "," + acinfo[2] : "");
        //         newPwd = pwd + "," + pwdinfo[0] + (!!pwdinfo[2] ? "," + pwdinfo[2] : "");
        //     } else if (index == 2) {
        //         newAcs = name + "," + acinfo[0] + "," + acinfo[1];
        //         newPwd = pwd + "," + pwdinfo[0] + "," + pwdinfo[1];
        //     } else {
        //         newAcs = acinfo.join();
        //         newPwd = pwdinfo.join();
        //     }
        // } else {
        //     if (acinfo.length >= 2) {
        //         newAcs = name + "," + acinfo[0] + "," + acinfo[1];
        //         newPwd = pwd + "," + pwdinfo[0] + "," + pwdinfo[1];
        //     } else {
        //         if (acs == "" || !acs) {
        //             newAcs = name;
        //             newPwd = pwd;
        //         } else {
        //             newAcs = name + "," + acs;
        //             newPwd = pwd + "," + pwds;
        //         }
        //     }
        // }
        // buyu.sendToJava("SAVELOCALDATA", {
        //     type: "appAc",
        //     data: newAcs
        // });
        // buyu.sendToJava("SAVELOCALDATA", {
        //     type: "appPwd",
        //     data: newPwd
        // });
    }
    
    static resetBtn(btn, time = 2e3) {
        btn.mouseEnabled = false;
        Laya.timer.once(time, this, () => {
            btn.mouseEnabled = true;
        });
    }
    
    static getRandomAccount() {
        var returnStr = "";
        let max = 20;
        let min = 10;
        let range = max ? Math.round(Math.random() * (max - min)) + min : min;
        let arr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
        for (var i = 0; i < range; i++) {
            var index = Math.round(Math.random() * (arr.length - 1));
            returnStr += arr[index];
        }
        return returnStr;
    }
}