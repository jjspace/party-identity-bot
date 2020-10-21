module.exports = {
  apps: [
    {
      name: 'party-identity-bot',
      script: './src/bot.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: false,
      wait_ready: true,
      listen_timeout: 10000,
      max_restarts: 10,
      max_memory_restart: '100M',
      log_file: 'party-identity-bot-pm2.log',
      merge_logs: true,
      node_args: '-r dotenv/config', // import env variables from .env - Requires dotenv installed, not ideal
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
