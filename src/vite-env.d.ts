/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_GITHUB_OWNER?: string
  readonly VITE_GITHUB_REPO?: string
  readonly VITE_GITHUB_BRANCH?: string
  readonly VITE_GITHUB_MAIN_BRANCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
