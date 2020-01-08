import GlobalFunc from "../GlobalFuncs/GlobalFunc";

export class MathFunc{
    /**判断炸弹鱼是否在爆炸圆范围内 */
    static getFishsInCircle(x, y, radius, fishes) {
        var fish_ids = [];
        for (var i in fishes) {
            let fish = fishes[i];
            if (GlobalFunc.pGetDistance({
                x: x,
                y: y
            }, fish) <= radius) {
                fish_ids.push(fish.fishUniqId);
            }
        }
        return fish_ids;
    }
}