function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get DATABASE_URL() {
    return requireEnv("DATABASE_URL");
  },
  get DEEPSEEK_API_KEY() {
    return requireEnv("DEEPSEEK_API_KEY");
  },
  get NEXTAUTH_SECRET() {
    return requireEnv("NEXTAUTH_SECRET");
  },
  // Optional
  get GITHUB_CLIENT_ID() {
    return process.env.GITHUB_CLIENT_ID || "";
  },
  get GITHUB_CLIENT_SECRET() {
    return process.env.GITHUB_CLIENT_SECRET || "";
  },
};
