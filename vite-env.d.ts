/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PRICE_API_URL: string
    readonly GEMINI_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
