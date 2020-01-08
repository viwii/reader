    /**
     * 功能开关管理
     */
    export default class OnOffManager{
    static isSkillOn = false;
    //技能
    static isBullet = true;
    //导弹
    static isLongPaoOn = true;
    //龙炮
    static isLeftBoxOn = true;
    //渔场左边box
    static isRewardOn = true;
    //领取奖励
    static isBubbleEffOn = true;
    //切换渔场泡泡
    static isFishMapOn = true;
    //鱼鉴
    static isJackPotOn = false;
    //彩金
    static isGuideOn = true;
    //新手
    static isRotate = true;
    //登录转盘
    static isMarquee = true;
    //跑马灯
    static isTicketTipsOn = true;
    //渔场内奖券兑换提示
    //大厅
    static isVipOn = true;
    //vip
    static isActivityOn = true;
    //活动
    static isExchangeOn = true;
    //兑换
    static isMailOn = true;
    //邮件
    static isPackageOn = true;
    //背包
    static isPlayerInfoOn = false;
    //玩家信息
    static isRankListOn = true;
    //排行榜
    static isRankWarOn = true;
    //海王争霸
    static isChaozOn = 0;
    //超值礼包 0.关闭状态，1.三合一礼包状态,2.金币礼包状态
    static isShopOn = true;
    //商城
    static isShare = false;
    //分享
    static isMenu = true;
    //菜单
    static isFree = true;
    static isService = true;
    //客服
    static isNotice = true;
    //公告
    static isHelp = true;
    //救济金
    static isRebate = true;
    //返奖券
    static isInvite = true;
    //邀请
    static isReserve = false;
    //收藏
    static isLuck = false;
    //幸运抽奖
    static isWhole = true;
    //整点奖励
    static isSpceialView = true;
    //特色鱼游戏中
    static isShake = false;
    //摇一摇
    static isTomorrom = false;
    //明日礼包
    static isGiftOn = false;
    //礼包
    static isGIftSp = false;
    //礼包sp
    static isMonthCardOn = false;
    //月卡
    //充值相关
    static isChargeOn = true;
    //是否显示IOS充值相关
    static isShenheOn = false;
    //是否审核版本屏蔽相关
    //活动相关
    static isPhoneBillOn = false;
    //兑换话费
    static isDateActivelOn = false;
    //每日活动
    static isGoldPagOn = false;
    //金猪送礼
    static isGongZhongHaoOn = false;
    //关注有礼
    static isVipConfirmOn = false;
    //VIP认证
    static isAddGroupOn = false;
    //加群有礼
    //特殊
    static isTicketFirstPayOn = false;
    //首冲礼包进大厅时弹出
    static init() {
        this.isChaozOn = 0;
        this.isPhoneBillOn = false;
        //兑换话费
        this.isDateActivelOn = false;
        //每日活动
        this.isGoldPagOn = false;
        //金猪送礼
        this.isGongZhongHaoOn = false;
        //关注有礼
        this.isVipConfirmOn = false;
        //VIP认证
        this.isAddGroupOn = false;
        this.isChargeOn = true;
        //是否显示IOS充值相关
        this.isShenheOn = false;
    }
}