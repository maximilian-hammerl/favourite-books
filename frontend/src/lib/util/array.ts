export function sumOfArray(array: Array<number>): number {
  return array.reduce((sum, value) => sum + value, 0)
}

export function productOfArray(array: Array<number>): number {
  return array.reduce((product, value) => product * value, 1)
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
