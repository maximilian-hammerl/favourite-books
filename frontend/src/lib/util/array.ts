// Overload for number arrays (no attribute allowed)
export function sumOfArray(array: Array<number>): number
// Overload for object arrays (attribute required)
export function sumOfArray<T extends object, K extends keyof T>(
  array: T[],
  attribute: K extends string ? (T[K] extends number ? K : never) : never,
): number
// Implementation
export function sumOfArray<T>(array: T[] | Array<number>, attribute?: keyof T): number {
  if (attribute === undefined) {
    return (array as Array<number>).reduce((sum, value) => sum + value, 0)
  }
  return (array as T[]).reduce((sum, obj) => sum + (obj[attribute] as number), 0)
}

// Overload for number arrays (no attribute allowed)
export function productOfArray(array: Array<number>): number
// Overload for object arrays (attribute required)
export function productOfArray<T extends object, K extends keyof T>(
  array: T[],
  attribute: K extends string ? (T[K] extends number ? K : never) : never,
): number
// Implementation
export function productOfArray<T>(array: T[] | Array<number>, attribute?: keyof T): number {
  if (attribute === undefined) {
    return (array as Array<number>).reduce((product, value) => product * value, 1)
  }
  return (array as T[]).reduce((product, obj) => product * (obj[attribute] as number), 1)
}
