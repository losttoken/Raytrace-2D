import { Color, sqrt, min, max, length, abs, clamp } from "./lib.js";

type SDFResult = [number, Color];
type SDF = (x: number, y: number) => SDFResult;

/**
 * 
 * @param {Number} r - radius
 * @param {Color} color - The color
 * @returns {SDF}
 */
function circle(r: number, color: Color): SDF
{
    return (x, y) => [sqrt(x * x + y * y) - r, color];
}
/**
 * 
 * @param {Number} w - Width of rectangle
 * @param {Number} h - Height of rectangle
 * @param {Color} color - The color
 * @returns {SDF}
 */
function rect(w:number, h:number, color:Color): SDF
{
    return (x, y) =>
    {
        const dx = Math.abs(x) - w / 2;
        const dy = Math.abs(y) - h / 2;
        return [min(max(dx, dy), 0) + length(max(dx, 0), max(dy, 0)), color];
    };
}
/**
 * 
 * @param {Number} rOuter - Outer radius
 * @param {Number} rInner - Inner radius
 * @param {Color} color - The color
 * @returns {SDF}
 */
function torus(rOuter:number, rInner:number,color:Color):SDF
{
    const mid = (rOuter + rInner) / 2;
    const wide = (rOuter - rInner) / 2;
    return (x, y) =>
    {
        const l = length(x, y);
        return [abs(l - mid) - wide, color];
    }
}

/**
 * 
 * @param {Number} wide - Width of the belt
 * @param {Color} color - The color
 * @returns {SDF}
 */
function belt(wide: number, color: Color): SDF
{
    return (x, y) => [y - wide / 2, color];
}

/**
 * 
 * @param {Number} l - Length between two center of semi-circle
 * @param {Number} radius - The radius of the semi-circle at end
 * @param {Color} color - The color
 * @returns {SDF}
 */
function capsule(l:number, radius:number, color:Color):SDF
{
    const half = l / 2;
    return (x, y) =>
    {
        const dx = abs(x) - half;
        return [length(clamp(dx, 0, abs(dx)), y) - radius, color];
    }
}

export { circle, rect, torus, belt, capsule };