/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional broker proxy base URL. Unset → transparent local simulation. */
  readonly VITE_BACKEND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
