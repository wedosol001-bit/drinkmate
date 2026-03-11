// PM2 Ecosystem configuration for DrinkMate
module.exports = {
  apps: [
    {
      name: 'drinkmate-backend',
      script: './server/server.js',
      cwd: '/var/www/drinkmate',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,

        // Database
        MONGODB_URI: 'mongodb+srv://wedosol001_db_user:loWTVujexgrdnaOZ@cluster0.k5rmfrm.mongodb.net/drinkmate?retryWrites=true&w=majority&appName=Cluster0',

        // Auth
        JWT_SECRET: '59ecH3Cn3hjuykKZGnLTMuZvBSsprjWFWrzAKPXJX5k=',
        JWT_EXPIRES_IN: '24h',
        REFRESH_TOKEN_EXPIRES_IN: '7d',
        SESSION_SECRET: 'qKGkETLOcOo/C8KTL3s9IvXvvMJb3sTVoOzlJo3zZiY=',

        // Cloudinary
        CLOUDINARY_CLOUD_NAME: 'da6dzmflp',
        CLOUDINARY_API_KEY: '694537626126534',
        CLOUDINARY_API_SECRET: 'elu06tzJWrK_Yb_M8H2bmGNfUL0',

        // Email / SMTP
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '587',
        SMTP_USER: 'devops.drinkmate@gmail.com',
        SMTP_PASS: 'ejfo bcdu fmmr wfwj',
        EMAIL_USER: 'devops.drinkmate@gmail.com',
        EMAIL_PASS: 'ejfo bcdu fmmr wfwj',

        // Aramex
        ARAMEX_USERNAME: 'testingapi@aramex.com',
        ARAMEX_PASSWORD: 'R123456789$r',
        ARAMEX_ACCOUNT_NUMBER: '4004636',
        ARAMEX_ACCOUNT_PIN: '432432',
        ARAMEX_ACCOUNT_ENTITY: 'RUH',
        ARAMEX_ACCOUNT_COUNTRY_CODE: 'SA',
        ARAMEX_API_URL: 'http://ws.sbx.aramex.net/shippingapi/shipping/service_1_0.svc',
        ARAMEX_VERSION: '1.0',

        // Urway Payments
        URWAYS_TERMINAL_ID: 'aqualinesa',
        URWAYS_TERMINAL_PASSWORD: 'URWAY@026_a',
        URWAYS_MERCHANT_KEY: 'e51ef25d3448a823888e3f38f9ffcc3693a40e3590cf4bb6e7ac5b352a00f30d',
        URWAYS_API_URL: 'https://payments.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest',

        // Tap Payments
        TAP_API_KEY: 'your_tap_api_key',
        TAP_SECRET_KEY: 'your_tap_secret_key',
        TAP_MERCHANT_ID: 'your_tap_merchant_id',
        TAP_ENVIRONMENT: 'production',

        // URLs
        FRONTEND_URL: 'https://drinkmate.sa',
        CORS_ORIGIN: 'https://drinkmate.sa',
        PAYMENT_CALLBACK_URL: 'https://api.drinkmate.sa/api/payments/arb/callback',

        // Chat
        MAX_CONCURRENT_CHATS: '10',
        CHAT_BUSINESS_HOURS_START: '9',
        CHAT_BUSINESS_HOURS_END: '24',
        CHAT_TIMEZONE: 'Asia/Riyadh',

        // Server tuning
        SERVER_TIMEOUT_MS: '120000',
        SERVER_KEEP_ALIVE_TIMEOUT_MS: '65000',
        SERVER_HEADERS_TIMEOUT_MS: '66000',

        // DB pool
        DB_MAX_POOL_SIZE: '10',
        DB_MAX_RETRIES: '3',
        DB_CONNECT_TIMEOUT_MS: '30000',
        DB_SOCKET_TIMEOUT_MS: '30000',
        DB_SERVER_SELECTION_TIMEOUT_MS: '30000',
        DB_HEARTBEAT_FREQUENCY_MS: '10000',
        DB_MAX_IDLE_TIME_MS: '30000',

        // Rate limiting
        RATE_LIMIT_MAX_REQUESTS: '100',
        RATE_LIMIT_WINDOW_MS: '900000',

        // Files
        MAX_FILE_SIZE: '10485760',
        MAX_FILE_SIZE_MB: '10',
        MAX_FILES_PER_REQUEST: '5',

        // Security
        SESSION_COOKIE_SECURE: 'true',
        SESSION_COOKIE_HTTPONLY: 'true',
        SESSION_COOKIE_SAMESITE: 'strict',
        SECURITY_LOGGING: 'true',

        // Misc
        LOG_LEVEL: 'warn',
        NODE_ENV: 'production',
        BACKUP_ENABLED: 'true',
        BACKUP_SCHEDULE: '0 2 * * *',
        CACHE_MAX_ENTRIES: '100',
      },
      error_file: '/var/log/drinkmate/backend-error.log',
      out_file: '/var/log/drinkmate/backend-out.log',
      log_file: '/var/log/drinkmate/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
    },
    {
      name: 'drinkmate-frontend',
      script: './drinkmate-main/.next/standalone/server.js',
      cwd: '/var/www/drinkmate',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_API_URL: 'https://drinkmate.sa/api',
        NEXT_PUBLIC_FRONTEND_URL: 'https://drinkmate.sa',
        NEXT_PUBLIC_API_RETRY_ATTEMPTS: '3',
        NEXT_PUBLIC_API_RETRY_DELAY: '1000',
        NEXT_PUBLIC_API_TIMEOUT: '30000',
        NEXT_PUBLIC_MAX_CONCURRENT_CHATS: '10',
        NEXT_PUBLIC_MAX_FILE_SIZE_MB: '10',
      },
      error_file: '/var/log/drinkmate/frontend-error.log',
      out_file: '/var/log/drinkmate/frontend-out.log',
      log_file: '/var/log/drinkmate/frontend-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
    }
  ]
};