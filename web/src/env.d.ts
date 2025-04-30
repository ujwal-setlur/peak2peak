interface ImportMetaEnv {
  readonly PUBLIC_GRAPHQL_API_BASE_URL?: string;
  readonly PUBLIC_EMAIL_KEY?: string;
  readonly PUBLIC_EMAIL_SERVICE_ID?: string;
  readonly PUBLIC_EMAIL_TEMPLATE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
