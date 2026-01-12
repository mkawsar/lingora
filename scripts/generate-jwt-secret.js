#!/usr/bin/env node

/**
 * Generate a secure JWT secret and automatically update .env file
 * Usage: node scripts/generate-jwt-secret.js
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Generate a random 64-byte (512-bit) secret
const secret = crypto.randomBytes(64).toString("hex");
const envPath = path.join(process.cwd(), ".env");

console.log("\n🔐 Generated JWT Secret:");
console.log("=".repeat(80));
console.log(secret);
console.log("=".repeat(80));

// Read existing .env file if it exists
let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
  console.log("\n📄 Found existing .env file");
} else {
  console.log("\n📄 Creating new .env file");
}

// Update or add JWT_SECRET
const jwtSecretRegex = /^JWT_SECRET=.*$/m;
const jwtExpiresInRegex = /^JWT_EXPIRES_IN=.*$/m;

if (jwtSecretRegex.test(envContent)) {
  // Replace existing JWT_SECRET
  envContent = envContent.replace(jwtSecretRegex, `JWT_SECRET=${secret}`);
  console.log("✅ Updated existing JWT_SECRET in .env file");
} else {
  // Add JWT_SECRET to the end of the file
  if (envContent && !envContent.endsWith("\n")) {
    envContent += "\n";
  }
  envContent += `\n# JWT Configuration\nJWT_SECRET=${secret}\n`;
  
  // Add JWT_EXPIRES_IN if it doesn't exist
  if (!jwtExpiresInRegex.test(envContent)) {
    envContent += `JWT_EXPIRES_IN=7d\n`;
  }
  
  console.log("✅ Added JWT_SECRET to .env file");
}

// Write updated content back to .env file
fs.writeFileSync(envPath, envContent, "utf8");

console.log(`\n📝 JWT_SECRET has been automatically updated in: ${envPath}`);
console.log("✅ Done!\n");
