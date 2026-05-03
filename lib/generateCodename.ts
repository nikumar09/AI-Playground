const ADJECTIVES = ['Swift', 'Silent', 'Bold', 'Clever', 'Nimble', 'Sly', 'Fierce', 'Daring']
const COLORS = ['Crimson', 'Jade', 'Amber', 'Cobalt', 'Scarlet', 'Ivory', 'Onyx', 'Violet']
const ANIMALS = ['Fox', 'Hawk', 'Wolf', 'Lynx', 'Raven', 'Viper', 'Falcon', 'Otter']

function pick(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)]
}

export function generateCodename(): string {
  return pick(ADJECTIVES) + pick(COLORS) + pick(ANIMALS)
}
