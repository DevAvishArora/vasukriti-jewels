#!/usr/bin/env node

/**
 * Interactive Environment Setup Helper
 * Helps you update .env files with your credentials
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
};

console.log(`${colors.blue}
╔════════════════════════════════════════════════════════╗
║     🔐 Vasukriti Jewels - Environment Setup Helper    ║
╚════════════════════════════════════════════════════════╝
${colors.reset}`);

console.log('This tool will help you set up your environment variables.\n');
console.log('Press Ctrl+C to exit at any time.\n');

const questions = [
  {
    key: 'MONGODB_URI',
    prompt: '📦 MongoDB Connection String',
    description: 'Example: mongodb://localhost:27017/vasukriti-jewels\n   Or: mongodb+srv://user:pass@cluster.mongodb.net/vasukriti-jewels',
    default: 'mongodb://localhost:27017/vasukriti-jewels',
    file: 'backend',
  },
  {
    key: 'CLOUDINARY_CLOUD_NAME',
    prompt: '☁️  Cloudinary Cloud Name',
    description: 'Found in your Cloudinary dashboard (e.g., dj2klmn3p)',
    default: '',
    file: 'both',
  },
  {
    key: 'CLOUDINARY_API_KEY',
    prompt: '🔑 Cloudinary API Key',
    description: 'Found in your Cloudinary dashboard',
    default: '',
    file: 'backend',
  },
  {
    key: 'CLOUDINARY_API_SECRET',
    prompt: '🔐 Cloudinary API Secret',
    description: 'Found in your Cloudinary dashboard',
    default: '',
    file: 'backend',
  },
];

const optionalQuestions = [
  {
    key: 'RAZORPAY_KEY_ID',
    prompt: '💳 Razorpay Key ID (Optional)',
    description: 'Test key: rzp_test_xxxxx (skip for now: press Enter)',
    default: '',
    file: 'both',
  },
  {
    key: 'RAZORPAY_KEY_SECRET',
    prompt: '🔑 Razorpay Key Secret (Optional)',
    description: 'Skip for now: press Enter',
    default: '',
    file: 'backend',
  },
  {
    key: 'EMAIL_USER',
    prompt: '📧 Email Address (Optional)',
    description: 'Your Gmail address (skip for now: press Enter)',
    default: '',
    file: 'backend',
  },
  {
    key: 'EMAIL_PASSWORD',
    prompt: '🔐 Email App Password (Optional)',
    description: 'Gmail app password (skip for now: press Enter)',
    default: '',
    file: 'backend',
  },
];

const answers = {};

function ask(question) {
  return new Promise((resolve) => {
    console.log(`\n${colors.yellow}${question.prompt}${colors.reset}`);
    console.log(`   ${question.description}`);
    
    const defaultText = question.default ? ` (default: ${question.default})` : '';
    rl.question(`   Enter value${defaultText}: `, (answer) => {
      resolve(answer.trim() || question.default);
    });
  });
}

async function askQuestions() {
  console.log(`${colors.green}\n✅ REQUIRED Configuration${colors.reset}`);
  console.log('These are essential to run the application:\n');

  for (const question of questions) {
    answers[question.key] = {
      value: await ask(question),
      file: question.file,
    };
  }

  console.log(`\n${colors.yellow}Would you like to configure optional services?${colors.reset}`);
  const configureOptional = await new Promise((resolve) => {
    rl.question('   Configure optional services? (y/N): ', (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });

  if (configureOptional) {
    console.log(`${colors.blue}\n⚙️  OPTIONAL Configuration${colors.reset}`);
    console.log('These can be added later:\n');

    for (const question of optionalQuestions) {
      answers[question.key] = {
        value: await ask(question),
        file: question.file,
      };
    }
  }

  return answers;
}

function updateEnvFile(filePath, updates) {
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
      } else {
        content += `\n${key}=${value}`;
      }
    }
  }

  fs.writeFileSync(filePath, content);
}

async function main() {
  try {
    const responses = await askQuestions();

    console.log(`\n${colors.green}✅ Configuration complete!${colors.reset}`);
    console.log('\nUpdating environment files...\n');

    // Update backend .env
    const backendUpdates = {};
    const frontendUpdates = {};

    for (const [key, data] of Object.entries(responses)) {
      if (data.file === 'backend' || data.file === 'both') {
        backendUpdates[key] = data.value;
      }
      if (data.file === 'frontend' || data.file === 'both') {
        // Frontend uses NEXT_PUBLIC_ prefix for Cloudinary and Razorpay
        if (key === 'CLOUDINARY_CLOUD_NAME') {
          frontendUpdates['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] = data.value;
        } else if (key === 'RAZORPAY_KEY_ID') {
          frontendUpdates['NEXT_PUBLIC_RAZORPAY_KEY_ID'] = data.value;
        }
      }
    }

    const backendEnvPath = path.join(__dirname, '.env');
    const frontendEnvPath = path.join(__dirname, '../frontend/.env.local');

    updateEnvFile(backendEnvPath, backendUpdates);
    console.log(`${colors.green}✅ Updated backend/.env${colors.reset}`);

    if (Object.keys(frontendUpdates).length > 0) {
      updateEnvFile(frontendEnvPath, frontendUpdates);
      console.log(`${colors.green}✅ Updated frontend/.env.local${colors.reset}`);
    }

    console.log(`\n${colors.blue}🎉 Setup Complete!${colors.reset}\n`);
    console.log('Next steps:');
    console.log('1. Test your configuration: node test-env.js');
    console.log('2. Start the backend: npm run dev');
    console.log('3. Start the frontend: cd ../frontend && npm run dev\n');

    rl.close();
  } catch (error) {
    console.error(`\n${colors.reset}❌ Error:`, error.message);
    rl.close();
    process.exit(1);
  }
}

main();
