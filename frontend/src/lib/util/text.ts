const LETTERS_IN_INITIALS = 3

export function computeInitialsForName(firstName: string, lastName: string): string {
  const firstNameSplit = firstName.trim().split(/\s+/)
  const lastNameSplit = lastName.trim().split(/\s+/)

  // Take at most LETTERS_IN_INITIALS - 1 words from last name
  let split = lastNameSplit.splice(0, LETTERS_IN_INITIALS - 1)

  // Take remaining words from first name
  split = firstNameSplit.splice(0, LETTERS_IN_INITIALS - split.length).concat(split)

  return split.map((x) => x.charAt(0)).join('')
}

export function computeInitialsForTitle(title: string): string {
  // TODO: Prioritise upper case letters, if more letters than max
  return title
    .trim()
    .split(/\s+/)
    .slice(0, LETTERS_IN_INITIALS)
    .map((x) => x.charAt(0))
    .join('')
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}
