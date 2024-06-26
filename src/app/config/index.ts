import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Define a TypeScript interface for the configuration
interface Config {
  nodeEnv: string | undefined
  port: string | undefined
  databaseUrl: string | undefined
  defaultPassword: string | undefined
  saltRound: string | undefined
  jwtAccessSecretKey: string | undefined
  jwtRefreshSecretKey: string | undefined
  jwtAccessExpiresIn: string | undefined
  jwtRefreshExpiresIn: string | undefined
}

// Export the configuration as an object implementing the Config interface
const config: Config = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  saltRound: process.env.SALT_ROUND,
  jwtAccessSecretKey: process.env.JWT_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_KEY,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}

export default config
