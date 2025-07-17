#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import crypto from 'crypto';

interface CloudflareConfig {
  accountId?: string;
  d1DatabaseId?: string;
  apiToken?: string;
  kvNamespaceId?: string;
  r2BucketName?: string;
  r2AccessKeyId?: string;
  r2SecretAccessKey?: string;
}

function generateSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

function promptUser(question: string): string {
  const answer = process.argv.find(arg => arg.startsWith(`--${question.toLowerCase().replace(' ', '-')}=`));
  if (answer) {
    return answer.split('=')[1];
  }
  
  // In a real setup, you'd use a proper prompting library like inquirer
  // For now, we'll return empty strings for optional values
  return '';
}

function createEnvFile(config: CloudflareConfig): void {
  const secret = generateSecret();
  
  const envContent = `# Better Auth Configuration
BETTER_AUTH_SECRET="${secret}"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudflare Configuration (Optional - enables enhanced features)
${config.accountId ? `CLOUDFLARE_ACCOUNT_ID="${config.accountId}"` : '# CLOUDFLARE_ACCOUNT_ID="your-account-id"'}
${config.d1DatabaseId ? `CLOUDFLARE_D1_DATABASE_ID="${config.d1DatabaseId}"` : '# CLOUDFLARE_D1_DATABASE_ID="your-d1-database-id"'}
${config.apiToken ? `CLOUDFLARE_API_TOKEN="${config.apiToken}"` : '# CLOUDFLARE_API_TOKEN="your-api-token"'}

# KV Storage (Optional - for session caching)
${config.kvNamespaceId ? `CLOUDFLARE_KV_NAMESPACE_ID="${config.kvNamespaceId}"` : '# CLOUDFLARE_KV_NAMESPACE_ID="your-kv-namespace-id"'}

# R2 File Storage (Optional - for file uploads)
${config.r2BucketName ? `CLOUDFLARE_R2_BUCKET_NAME="${config.r2BucketName}"` : '# CLOUDFLARE_R2_BUCKET_NAME="your-r2-bucket"'}
${config.r2AccessKeyId ? `CLOUDFLARE_R2_ACCESS_KEY_ID="${config.r2AccessKeyId}"` : '# CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key"'}
${config.r2SecretAccessKey ? `CLOUDFLARE_R2_SECRET_ACCESS_KEY="${config.r2SecretAccessKey}"` : '# CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-key"'}

# Feature Flags
ENABLE_GEOLOCATION_TRACKING="true"
`;

  const apps = ['apps/app', 'apps/api', 'apps/web'];
  
  apps.forEach(app => {
    const envPath = `${app}/.env.local`;
    if (!existsSync(envPath)) {
      writeFileSync(envPath, envContent);
      console.log(`✅ Created ${envPath}`);
    } else {
      console.log(`⚠️  ${envPath} already exists, skipping...`);
    }
  });
}

function setupDatabase(): void {
  try {
    console.log('🗄️  Setting up database...');
    
    // Check if drizzle is available
    try {
      execSync('pnpm db:push', { stdio: 'inherit' });
      console.log('✅ Database schema pushed successfully');
    } catch (error) {
      console.log('⚠️  Database push failed. You may need to run this manually later.');
      console.log('   Try: pnpm db:push');
    }
  } catch (error) {
    console.log('⚠️  Database setup failed:', error);
  }
}

function installDependencies(): void {
  try {
    console.log('📦 Installing dependencies...');
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('⚠️  Failed to install dependencies:', error);
  }
}

function createWranglerConfig(): void {
  const wranglerContent = `name = "your-app-name"
compatibility_date = "2024-01-01"

[env.production]
# D1 Database
[[env.production.d1_databases]]
binding = "DB"
database_name = "your-database-name"
database_id = "your-database-id"

# KV Namespace
[[env.production.kv_namespaces]]
binding = "AUTH_KV"
id = "your-kv-namespace-id"

# R2 Bucket
[[env.production.r2_buckets]]
binding = "FILES"
bucket_name = "your-r2-bucket"

[env.preview]
# Same as production but with preview IDs
`;

  const wranglerPath = 'wrangler.toml';
  if (!existsSync(wranglerPath)) {
    writeFileSync(wranglerPath, wranglerContent);
    console.log('✅ Created wrangler.toml template');
  } else {
    console.log('⚠️  wrangler.toml already exists, skipping...');
  }
}

async function main(): Promise<void> {
  console.log('🚀 Setting up Better Auth + Cloudflare integration...\n');

  // Collect configuration
  const config: CloudflareConfig = {
    accountId: promptUser('account-id'),
    d1DatabaseId: promptUser('d1-database-id'),
    apiToken: promptUser('api-token'),
    kvNamespaceId: promptUser('kv-namespace-id'),
    r2BucketName: promptUser('r2-bucket-name'),
    r2AccessKeyId: promptUser('r2-access-key-id'),
    r2SecretAccessKey: promptUser('r2-secret-access-key'),
  };

  // Setup steps
  console.log('1. Creating environment files...');
  createEnvFile(config);

  console.log('\n2. Creating Wrangler configuration...');
  createWranglerConfig();

  console.log('\n3. Installing dependencies...');
  installDependencies();

  console.log('\n4. Setting up database...');
  setupDatabase();

  console.log('\n✅ Setup complete!\n');
  
  console.log('Next steps:');
  console.log('1. Update your .env.local files with your Cloudflare credentials');
  console.log('2. Update wrangler.toml with your resource IDs');
  console.log('3. Run "pnpm dev" to start development');
  console.log('4. Test the geolocation feature at /auth/test-geolocation');
  
  console.log('\nCloudflare setup:');
  console.log('- Create D1 database: wrangler d1 create your-database');
  console.log('- Create KV namespace: wrangler kv:namespace create "AUTH_KV"');
  console.log('- Create R2 bucket: wrangler r2 bucket create your-bucket');
  
  console.log('\nFor more information, see BETTER_AUTH_CLOUDFLARE_README.md');
}

if (require.main === module) {
  main().catch(console.error);
}