export default class StringFunc{
    /**对象长度 */
    static getObjLen(obj) {
        return !!obj ? Object.keys(obj).length : 0;
    }
    
    /**string 包含，str1 是否含有 strArr 中的敏感词 */            
    static isContainStr(str1, strArr) {
        if (!str1 || !strArr) return false;
        for (var key in strArr) {
            if (str1.indexOf(key) >= 0) {
                return true;
            }
        }
        return false;
    }
}