import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";

// https://astro.build/config
export default defineConfig({
  site: "https://eauploader-docs.uslog.tech",
  integrations: [
    starlight({
      plugins: [starlightImageZoom()],
      title: "EAUploader Docs",
      logo: {
        src: "./public/favicon.svg",
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.svg",
          },
        },
      ],
      customCss: [
        "@fontsource/lexend-deca",
        "@fontsource/noto-sans-jp",
        "./src/styles/custom.css",
      ],
      editLink: {
        baseUrl:
          "https://github.com/Project-EAUploader/eauploader-docs/edit/main/",
      },
      defaultLocale: "root",
      locales: {
        root: {
          label: "日本語",
          lang: "ja",
        },
        en: {
          label: "English",
        },
      },
      social: {
        github: "https://github.com/Project-EAUploader",
        discord: "https://discord.gg/RhUQPghgMQ",
      },
      sidebar: [
        {
          label: "Guides",
          translations: {
            ja: "ガイド",
          },
          items: [
            {
              label: "Introduction",
              translations: {
                ja: "はじめに",
              },
              slug: "guides/introduction",
            },
            {
              label: "Getting Started",
              translations: {
                ja: "初めての方向けガイド",
              },
              slug: "guides/getting_started",
            },
          ],
        },
        {
          label: "For Developers",
          translations: {
            ja: "開発者向け",
          },
          items: [
            {
              label: "Environment Setup",
              translations: {
                ja: "環境構築",
              },
              slug: "for_dev/environment",
            },
            {
              label: "Construction",
              translations: {
                ja: "構造",
              },
              slug: "for_dev/construction",
            },
            {
              label: "Editor",
              slug: "for_dev/editor",
            },
            {
              label: "Runtime",
              slug: "for_dev/runtime",
            },
            {
              label: "Extension Development",
              translations: {
                ja: "拡張機能開発",
              },
              slug: "for_dev/extension",
            },
            {
              label: "Logging",
              translations: {
                ja: "ログ出力機能仕様書",
              },
              slug: "for_dev/logging",
            },
          ],
        },
        {
          label: "API Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
