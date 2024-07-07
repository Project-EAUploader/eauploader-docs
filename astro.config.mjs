import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'EAUploader Docs',
      disable404Route: true,
      head: [
        {
          tag: 'script',
          content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'docs/')`
        }
      ],
      editLink: {
        baseUrl:
          'https://github.com/Project-EAUploader/eauploader.uslog.tech/edit/main/'
      },
      defaultLocale: 'ja',
      locales: {
        en: {
          label: 'English'
        },
        ja: {
          label: '日本語'
        }
      },
      social: {
        github: 'https://github.com/Project-EAUploader',
        discord: 'https://discord.gg/RhUQPghgMQ'
      },
      sidebar: [
        {
          label: 'Guides',
          translations: {
            ja: 'ガイド'
          },
          items: [
            {
              label: 'Introduction',
              translations: {
                ja: 'はじめに'
              },
              slug: 'docs/guides/introduction'
            },
            {
              label: 'Getting Started',
              translations: {
                ja: '初めての方向けガイド'
              },
              slug: 'docs/guides/getting_started'
            }
          ]
        },
        {
          label: 'For Developers',
          translations: {
            ja: '開発者向け'
          },
          items: [
            {
              label: 'Environment Setup',
              translations: {
                ja: '環境構築'
              },
              slug: 'docs/for_dev/environment'
            },
            {
              label: 'Construction',
              translations: {
                ja: '構造'
              },
              slug: 'docs/for_dev/construction'
            },
            {
              label: 'Editor',
              slug: 'docs/for_dev/editor'
            },
            {
              label: 'Runtime',
              slug: 'docs/for_dev/runtime'
            },
            {
              label: 'Extension Development',
              translations: {
                ja: '拡張機能開発'
              },
              slug: 'docs/for_dev/extension'
            },
            {
              label: 'Logging',
              translations: {
                ja: 'ログ出力機能仕様書'
              },
              slug: 'docs/for_dev/logging'
            }
          ]
        },
        {
          label: 'API Reference',
          autogenerate: { directory: 'reference' }
        }
      ]
    })
  ]
})
