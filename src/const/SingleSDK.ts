import GlobalVar from "./GlobalVar"
import {EventDis} from "../Helpers/EventDis"
import GlobalFunc from "../GlobalFuncs/GlobalFunc"
import LoadManager_WXGAME from "../game/gameLoader/LoadManager_WXGAME";

export class SingleConfig {
    static platform: any;
    static runType: any;
    static versionCode: number;
    static versionName: any;
}


/**
 * 资源服地址
 */            
export class RES_URL {
    /**
     * 微信小游戏
     */            
    static WXGAME = "https://dmzresonline.gameabc2.com/h5/wxgame/";
    /**
     * 边锋H5
     */            
    static H5Bianf = "http://dmzresonline.gameabc2.com/h5/bianfeng/";
    /**
     * UC
     */   
    static H5UC = "http://dmzresonline.gameabc2.com/h5/uc/";
    /**
     * 趣头条
     */            
    static H5QTT = "http://dmzresonline.gameabc2.com/h5_test/H5QTT/";
    /**
     * APP官包
     */            
    static H5APP = "http://dmzresonline.gameabc2.com/h5_test/H5APP/";
}
    /**
* 运行阶段
*/            
export class RunType {
    /**
     * 开发环境
     */            
    static DEBUG = "DEBUG";
    /**
     * 生产环境
     */            
    static RELEASE = "RELEASE";
    /**
    * 预发布生产环境
    */            
    static PRE_RELEASE = "RELEASE";
}


/**
 * 平台
 */            
export class Platform {
    /**
     * 微信小游戏
     */            
    static WXGAME = "WXGAME";
    /**
     * 边锋H5
     */            
    static H5Bianf = "H5Bianf";
    /**
     * UC
     */            
    static H5UC = "H5UC";
    /**
     * 趣头条
     */            
    static H5QTT = "H5QTT";
    /**
     * APP官包
     */            
    static H5APP = "H5APP";

}

export class ServerConfig {
    static announcement_url: any;
    static login_url: any;
    static pay_url: any;
    /**
    * 初始化服务器地址配置
    * @param obj
    */
    static init(obj) {
        this.announcement_url = obj["announcement_url"];
        this.login_url = obj["login_url"];
        this.pay_url = obj["pay_url"];
    }
}
            
class Single{
    static Platform: Platform;
    static SingleConfig: any;
    /**
     * 初始化
     * @param platform 平台
     * @param runType 运行环境
     * @param versionName 版本名称
     * @param versionCode 版本号        APP必传，其他平台只穿versionName即可
     */
    static init(platform, runType, versionName, versionCode = 0) {
        SingleConfig.platform = platform;
        SingleConfig.runType = runType;
        SingleConfig.versionCode = versionCode;
        SingleConfig.versionName = versionName;
        if (SingleConfig.platform != Platform.WXGAME) //buyu.init(platform);
        switch (platform) {
            case Platform.WXGAME:
            // Laya.MiniAdpter.autoCacheFile = false;
            // Laya.MiniAdpter.AutoCacheDownFile = false;
            break;

            case Platform.H5Bianf:
            this.initSound();
            break;

            case Platform.H5UC:
            // uc.requestScreenOrientation({
            //     orientaiton: 2,
            //     success: res => {
            //         console.log(res);
            //     },
            //     fail: res => {
            //         console.error(res);
            //     }
            // });
            break;

            case Platform.H5QTT:
            break;

            case Platform.H5APP:
            break;

            default:
            break;
        }
        this.initServerConfig();
    }
    /**
     * 声音设置
     * 目前只针对H5-IOS端音效破音进行特殊设置
     */                
    static initSound() {
        var u = navigator.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("Adr") > -1) {
            console.log("安卓");
            // globalVar.soundType = '.mp3';
                            } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            console.log("苹果");
            // globalVar.soundType = '.wav';
                                    Laya.SoundManager.useAudioMusic = false;
        }
    }
    /**
     * 获取背景音乐格式
     */                
    static getBgMusicFormat() {
        let format;
        switch (SingleConfig.platform) {
            case Platform.WXGAME:
            format = ".mp3";
            break;

            case Platform.H5Bianf:
            format = ".wav";
            break;

            case Platform.H5UC:
            format = ".mp3";
            break;

            case Platform.H5QTT:
            format = ".mp3";
            break;

            case Platform.H5APP:
            format = ".mp3";
            break;

            default:
            format = ".mp3";
            break;
        }
        return format;
    }
    /**
     * 获取服务器配置接口地址
     */                
    static initServerConfig() {
        switch (SingleConfig.runType) {
            case RunType.DEBUG:
            //外网QA
            ServerConfig.announcement_url = "https://dmzbuyu.gameabc2.com/qa/api/announcement";
            ServerConfig.login_url = "https://dmzbuyu.gameabc2.com/qa/svr/login";
            if (SingleConfig.platform == Platform.WXGAME) 
                ServerConfig.pay_url = "https://dmzbuyu.gameabc2.com/qa/pay/wechat_midas";
            if (SingleConfig.platform == Platform.H5QTT) 
                ServerConfig.pay_url = "https://dmzbuyu.gameabc2.com/qa/pay/qtt";
            break;

            case RunType.RELEASE:
            //外网正式
            ServerConfig.announcement_url = "https://dmzonline.gameabc2.com/buyuxia/public_api/announcement";
            ServerConfig.login_url = "https://dmzonline.gameabc2.com/buyuxia/public_svr/login";
            if (SingleConfig.platform == Platform.WXGAME) ServerConfig.pay_url = "https://dmzonline.gameabc2.com/buyuxia/public_pay/wechat_midas";
            if (SingleConfig.platform == Platform.H5QTT) ServerConfig.pay_url = "https://dmzonline.gameabc2.com/buyuxia/public_pay";
            break;

            case RunType.PRE_RELEASE:
            //外网预发布
            ServerConfig.announcement_url = "https://dmzbuyu.gameabc2.com/qa/api_pre/announcement";
            ServerConfig.login_url = "https://dmzbuyu.gameabc2.com/qa/svr_pre/login";
            if (SingleConfig.platform == Platform.WXGAME) ServerConfig.pay_url = "https://dmzbuyu.gameabc2.com/qa/pay_pre/wechat_midas";
            if (SingleConfig.platform == Platform.H5QTT) ServerConfig.pay_url = "https://dmzbuyu.gameabc2.com/qa/pay_pre";
            break;
        }
    }
    /**
    * 开始走登录流程
    * @param playform 平台
    */                
    static start() {
        switch (SingleConfig.platform) {
            case Platform.WXGAME:
            SingleSDK.setClientConfig(SingleSDK.SingleConfig.versionName + "", "WXGAME");
            EventDis.Instance.addEvntListener("clientConf", this, () => {
                EventDis.Instance.delEventName("clientConf", this);
                LoadManager_WXGAME.init();
            });
            break;

            case Platform.H5Bianf:
            //LoadManager_H5BF.init();
            break;

            case Platform.H5UC:
            //LoadManager_H5UC.init();
            break;

            case Platform.H5QTT:
            //LoadManager_H5QTT.init();
            break;

            case Platform.H5APP:
            //LoadManager_H5APP.init();
            break;

            default:
            break;
        }
    }
    /**
     * 支付
     * @param playform 平台
     */                
    static pay(decodeMsg) {
        let order_info = decodeMsg.order_info;
        let order_id = GlobalFunc.decodeUnit8(decodeMsg.order_info.info_id);
        switch (SingleConfig.platform) {
            case Platform.WXGAME:
            this.pay_WXGAME(order_id, order_info);
            break;

            case Platform.H5Bianf:
            this.pay_H5BF(order_id, order_info);
            break;

            case Platform.H5UC:
            let pre_order_json = JSON.parse(decodeMsg.pre_order_info);
            this.pay_H5UC(pre_order_json);
            break;

            case Platform.H5QTT:
            this.pay_H5QTT(order_id, order_info);
            break;

            case Platform.H5APP:
            order_info = JSON.parse(decodeMsg.pre_order_info);
            // buyu.sendToJava("pay", {
            //     noncestr: order_info.Noncestr,
            //     package: order_info.Package,
            //     prepay_id: order_info.PrepayId,
            //     sign: order_info.Sign,
            //     timestamp: order_info.Timestamp
            // });
            break;

            default:
            break;
        }
    }
    /**
     * 边锋H5渠道支付
     * @param order_id
     * @param order_info
     */                
    static pay_H5BF(order_id, order_info) {
        // buyu.payInRMB({
        //     order_id: order_id,
        //     product_id: order_info.product_id,
        //     price: +order_info.amount / 100,
        //     product_name: "1",
        //     user_name: GameData.nickName,
        //     role_id: GameData.account,
        //     uid: GameData.uid,
        //     server: "1",
        //     vip: PlayerData.vip_level
        // });
    }
    /**
     * 微信小游戏支付
     * @param order_id
     * @param order_info
     */                
    static pay_WXGAME(order_id, order_info) {
        // wx.requestMidasPayment({
        //     mode: "game",
        //     env: 0,
        //     offerId: "1450018131",
        //     currencyType: "CNY",
        //     platform: "android",
        //     buyQuantity: +order_info.amount / 100,
        //     zoneId: 1,
        //     success: function(res) {
        //         // that.payOrderId.push(orderId);
        //         // that.payOrderObj[orderId] = `${amount}/${product_id}`;
        //         console.log("支付米大师成功" + res.data);
        //         Single.reqShopPay({
        //             Uid: GameData.uid,
        //             Amount: +order_info.amount / 100,
        //             Gsid: 2e4,
        //             Platform: 1,
        //             QdId: 1,
        //             Openid: GameData.account,
        //             ProductId: order_info.product_id,
        //             OrderId: order_id
        //         });
        //     },
        //     fail: function(res) {
        //         GameData.isPaing = false;
        //         EventDis.dispatchEvent(GlobalVar.COMMODITY_PAY_FALSE);
        //         console.log("米大师支付取消");
        //     }
        // });
    }
    /**
     * 微信小游戏服务器扣钱
    */                
    static reqShopPay(info) {
        // let sign = GlobalFunc.sortObj(info);
        // info["Sign"] = MD5(sign);
        // let that = this;
        // GlobalFunc.log("wxpay");
        // GlobalFunc.log(this);
        // wx.request({
        //     url: ServerConfig.pay_url,
        //     method: "POST",
        //     data: info,
        //     header: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     success: function(res) {
        //         //扣钱成功
        //         for (let k in res) {
        //             GlobalFunc.log(res[k]);
        //         }
        //         if (res.data) {
        //             for (let k in res.data) {
        //                 GlobalFunc.log(res.data[k]);
        //             }
        //         }
        //         if (res.data && res.data.ret == 0) {
        //             GlobalFunc.log("扣费成功");
        //             GameData.isPaing = false;
        //             EventDis.dispatchEvent(GlobalVar.COMMODITY_PAY_OK);
        //         } else {
        //             GameData.isPaing = false;
        //             GlobalFunc.log("扣费失败");
        //             EventDis.dispatchEvent(GlobalVar.COMMODITY_PAY_FALSE);
        //         }
        //     },
        //     fail: function(res) {
        //         GameData.isPaing = false;
        //         EventDis.dispatchEvent(GlobalVar.COMMODITY_PAY_FALSE);
        //         GlobalFunc.log("服务器扣费失败");
        //     }
        // });
    }
    /**
     * H5UC渠道支付
     * @param pre_order_json
     */                
    static pay_H5UC(pre_order_json) {
        // uc.requestPayment({
        //     biz_id: "f28ac12ac5ef4fcaba0c484e6608907c",
        //     token: pre_order_json["data"].token,
        //     trade_id: pre_order_json["data"].trade_id,
        //     success: function(data) {
        //         console.log(data);
        //         /**
        //  */                        },
        //     fail: function(data) {
        //         console.error(data);
        //         /**
        // {
        //     code: 0, // JSAPI调用回调code
        //     data: {
        //         code: 0,// 交易返回的异常码，详情见异常码一栏
        //     msg: "", // 异常信息
        //     order_id: "" // 支付成功后返回的订单ID, 供商户请求后端是否成功支付
        //     }
        // }
        // */                        }
        // });
    }
    /**
     * H5趣头条支付
     * @param order_id
     * @param order_info
     */                
    static pay_H5QTT(order_id, order_info) {
        // let str = order_info["openid"];
        // let openid = str.replace("8_account:", "");
        // let param = buyu.getLoginParam("qtt_h5");
        // buyu.qtt_pay({
        //     money: order_info.amount,
        //     notifyUrl: ServerConfig.pay_url,
        //     openId: openid,
        //     platform: GameData.loginParams["platform"],
        //     land: "1",
        //     gameName: param["app_name"],
        //     appId: "a3M4fiitnJCq",
        //     ext: JSON.stringify({
        //         uid: GameData.uid,
        //         order_id: order_id
        //     })
        // });
    }
    /**
     * 获取资源服地址
     */                
    static getResUrl() {
        if (SingleConfig.runType == RunType.DEBUG) return ""


        let res_url;
        switch (SingleConfig.platform) {
            case Platform.WXGAME:
            res_url = RES_URL.WXGAME;
            break;

            case Platform.H5Bianf:
            res_url = RES_URL.H5Bianf;
            break;

            case Platform.H5UC:
            res_url = RES_URL.H5UC;
            break;

            case Platform.H5QTT:
            res_url = RES_URL.H5QTT;
            break;

            case Platform.H5APP:
            res_url = RES_URL.H5APP;
            break;

            default:
            break;
        }
        return res_url;
    }
    /**
     * 获取资源服地址
     */                
    static getPayType() {
        let payType;
        switch (SingleConfig.platform) {
            // case Platform.WXGAME:
            // payType = ProtoMsg.emPayType.midas;
            // break;

            // case Platform.H5Bianf:
            // payType = ProtoMsg.emPayType.bfh5;
            // break;

            // case Platform.H5UC:
            // payType = ProtoMsg.emPayType.uc;
            // break;

            // case Platform.H5QTT:
            // payType = ProtoMsg.emPayType.qtt;
            // break;

            // case Platform.H5APP:
            // payType = ProtoMsg.emPayType.wechat;
            // break;

            // default:
            // break;
        }
        return payType;
    }
}
           

class SingleSDK{
    static setClientConfig(version, plat) {
        let json;
        let url = "https://dmzresonline.gameabc2.com/clientConf/ClientConfig.json";
        Laya.loader.load(url, new Laya.Handler(this, () => {
            let config = Laya.Loader.getRes(url);
            GlobalVar.isShenHeVer = config && config["v" + version] && config["v" + version][plat + "_shenHeVer"];
            EventDis.Instance.dispatchEvent("clientConf");
        }), null, Laya.Loader.JSON);
    }
    static SingleConfig = SingleConfig;
    static Single = Single;
    static Platform = Platform;
    static RES_URL = RES_URL;
}

export default Single;