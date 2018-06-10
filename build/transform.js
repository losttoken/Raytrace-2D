import { smin } from "./lib.js";
import { Color } from "./lib.js";
/**
 *
 * @param {SDF} sdf
 * @param {Number} dx
 * @param {SDF} dy
 * @returns {SDF}
 */
function translate(sdf, dx, dy) {
    return (x, y) => sdf(x - dx, y - dy);
}
/**
 *
 * @param {SDF} sdf
 * @param {Number} kx
 * @param {Number} [ky]
 * @returns {SDF}
 */
function scale(sdf, kx, ky) {
    kx = kx === undefined ? 1 : kx;
    ky = ky === undefined ? kx : ky;
    return (x, y) => sdf(x / kx, y / ky);
}
/**
 *
 * @param {SDF} sdf
 * @param {Number} rad
 * @returns {SDF}
 */
function rotate(sdf, rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return (x, y) => sdf(x * cos - y * sin, x * sin + y * cos);
}
/**
 *
 * @param {SDF} sdf1
 * @param {SDF} sdf2
 * @returns {SDF}
 */
function union(sdf1, sdf2) {
    return (x, y) => {
        let [d1, c1] = sdf1(x, y);
        let [d2, c2] = sdf2(x, y);
        if (d1 < d2)
            return [d1, c1];
        else
            return [d2, c2];
    };
}
/**
 *
 * @param {SDF} sdf1
 * @param {SDF} sdf2
 * @returns {SDF}
 */
function subtract(sdf1, sdf2) {
    return (x, y) => {
        let [d1, c1] = sdf1(x, y);
        let [d2, c2] = sdf2(x, y);
        d2 = -d2;
        if (d1 > d2)
            return [d1, c1];
        else
            return [d2, c2];
    };
}
/**
 *
 * @param {SDF} sdf1
 * @param {SDF} sdf2
 * @returns {SDF}
 */
function intersect(sdf1, sdf2) {
    return (x, y) => {
        let [d1, c1] = sdf1(x, y);
        let [d2, c2] = sdf2(x, y);
        if (d1 > d2)
            return [d1, c1];
        else
            return [d2, c2];
    };
}
/**
 *
 * @param {SDF} sdf
 * @param {Number} radius
 * @returns {SDF}
 */
function expand(sdf, radius) {
    return (x, y) => {
        let [d, c] = sdf(x, y);
        return [d - radius, c];
    };
}
/*
function repeat(sdf:SDF, dx, dy = dx, ox = 0, oy = 0)
{
    return (x, y) => sdf(x % dx + ox, y % dy + oy);
}*/
/**
 *
 * @param {SDF} sdf1
 * @param {SDF} sdf2
 * @returns {SDF}
 */
function displace(sdf1, sdf2) {
    const color1 = sdf1(0, 0)["1"];
    const color2 = sdf2(0, 0)["1"];
    const color = Color.add(color1, color2);
    return (x, y) => [sdf1(x, y)["0"] + sdf2(x, y)["0"], color];
}
/**
 *
 * @param {SDF} sdf1
 * @param {SDF} sdf2
 * @param {Number} k
 * @returns {SDF}
 */
function blend(sdf1, sdf2, k) {
    const color1 = sdf1(0, 0)["1"];
    const color2 = sdf2(0, 0)["1"];
    const color = new Color(smin(color1.red, color2.red, k), smin(color1.green, color2.green, k), smin(color1.blue, color2.blue, k), smin(color1.alpha, color2.alpha, k));
    return (x, y) => [smin(sdf1(x, y)["0"], sdf2(x, y)["0"], k), color];
}
function colorSDF(sdf, color) {
    return (x, y) => [sdf(x, y)["0"], color];
}
export { translate, union, scale, rotate, expand, subtract, displace, blend, colorSDF };
//# sourceMappingURL=transform.js.map