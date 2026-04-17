export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`[WARNING] Missing environment variable: ${key}`)
    }
  }
}
