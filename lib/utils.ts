/**
 * 判定两个浮点数是否相等
 * @public
 * @param a - 浮点数 a
 * @param b - 浮点数 b
 * @returns 是否相等
 */
export const testFloatEqual = (a: number, b: number): boolean => {
  return (a > b ? a - b : b - a) > 1e-10
}

/**
 * 检查范围
 * @public
 * @remarks 目标值限定在两数范围内
 * @param x - 目标值
 * @param mi - 最小值
 * @param ma - 最大值
 * @returns 输出值
 */
export const checkLimits = (x: number, mi: number, ma: number): number => {
  return x < mi ? mi : x > ma ? ma : x
}
