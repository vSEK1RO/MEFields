import type { IconifyJSON } from '@iconify/types'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss'
import { presetFluid } from 'unocss-preset-fluid'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetFluid({
      minWidth: 390,
      maxWidth: 1280,
      ranges: {
        xs: [4, 8],
        sm: [8, 16],
        md: [16, 24],
        lg: [16, 32],
        xl: [24, 64],
        lt: [8, 32],
      },
    }),
    presetWebFonts({
      provider: 'none',
      fonts: { sans: 'Gilroy' },
    }),
    presetIcons({
      collections: {
        ms: () => import('@iconify-json/material-symbols/icons.json').then((i) => i.default as IconifyJSON),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: [
    {
      'prose-heading-1': 'font-bold f-text-24-40 lh-124%',
      'prose-heading-2': 'font-bold f-text-20-24 lh-124%',
      'prose-heading-3': 'font-semibold f-text-16-20 lh-124%',
      'prose-body': 'font-normal f-text-16-16 lh-120%',
      'prose-tag': 'font-medium f-text-14-16 lh-121%',
      'prose-caption-1': 'font-normal f-text-14-16 lh-120%',
      'prose-caption-2': 'font-normal text-14px lh-120%',
      'prose-caption-1-u': 'prose-caption-1 underline',
      'prose-caption-2-u': 'prose-caption-2 underline',
      'prose-btn': 'prose-tag',
    },
  ],
})
