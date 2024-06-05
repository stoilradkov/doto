import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = [
  'green',
  'cyan',
  'zinc',
  'red',
  'orange',
  'amber',
  'blue',
  'purple',
  'pink',
] as const

export type Color = (typeof COLORS)[number]

export const getColor = (color: Color) => {
  switch (color) {
    case 'green':
      return 'bg-green-400'
    case 'cyan':
      return 'bg-cyan-400'
    case 'zinc':
      return 'bg-zinc-400'
    case 'red':
      return 'bg-red-400'
    case 'orange':
      return 'bg-orange-400'
    case 'amber':
      return 'bg-amber-400'
    case 'blue':
      return 'bg-blue-400'
    case 'purple':
      return 'bg-purple-400'
    case 'pink':
      return 'bg-pink-400'
  }
}
