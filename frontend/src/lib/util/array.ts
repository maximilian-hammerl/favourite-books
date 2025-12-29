// Overload for number arrays (no attribute allowed)
export function sumOfArray(array: Array<number>): number
// Overload for object arrays (attribute required)
export function sumOfArray<T extends object, K extends keyof T>(
  array: Array<T>,
  attribute: K extends string ? (T[K] extends number ? K : never) : never,
): number
// Implementation
export function sumOfArray<T>(array: Array<T> | Array<number>, attribute?: keyof T): number {
  if (attribute === undefined) {
    return (array as Array<number>).reduce((sum, value) => sum + value, 0)
  }
  return (array as Array<T>).reduce((sum, obj) => sum + (obj[attribute] as number), 0)
}

// Overload for number arrays (no attribute allowed)
export function productOfArray(array: Array<number>): number
// Overload for object arrays (attribute required)
export function productOfArray<T extends object, K extends keyof T>(
  array: Array<T>,
  attribute: K extends string ? (T[K] extends number ? K : never) : never,
): number
// Implementation
export function productOfArray<T>(array: Array<T> | Array<number>, attribute?: keyof T): number {
  if (attribute === undefined) {
    return (array as Array<number>).reduce((product, value) => product * value, 1)
  }
  return (array as Array<T>).reduce((product, obj) => product * (obj[attribute] as number), 1)
}

export function sortByAttribute<T extends object, K extends keyof T>(
  array: Array<T>,
  attribute: K,
  ascending: boolean = true,
): Array<T> {
  return array.toSorted((a, b) => {
    const aVal = a[attribute]
    const bVal = b[attribute]

    if (aVal < bVal) return ascending ? -1 : 1
    if (aVal > bVal) return ascending ? 1 : -1
    return 0
  })
}
