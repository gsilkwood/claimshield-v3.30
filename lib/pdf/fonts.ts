import { Font } from '@react-pdf/renderer'
import { readFileSync } from 'fs'
import path from 'path'

let fontsRegistered = false

export function registerPDFFonts() {
  if (fontsRegistered) return

  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'),
        fontWeight: 400,
      },
      {
        src: path.join(process.cwd(), 'public/fonts/Inter-Medium.ttf'),
        fontWeight: 500,
      },
      {
        src: path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'),
        fontWeight: 700,
      },
    ],
  })

  fontsRegistered = true
}

export function getSatoriFonts() {
  return [
    {
      name: 'Inter',
      data: readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf')),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Inter',
      data: readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Medium.ttf')),
      weight: 500 as const,
      style: 'normal' as const,
    },
    {
      name: 'Inter',
      data: readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf')),
      weight: 700 as const,
      style: 'normal' as const,
    },
  ]
}
