import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function findUserByEmail(supabase, email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      throw error;
    }

    const users = data.users ?? [];
    const match = users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase());
    if (match) {
      return match;
    }

    if (users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureUser(supabase, config) {
  const existing = await findUserByEmail(supabase, config.email);
  if (existing) {
    return { user: existing, created: false };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: config.email,
    password: config.password,
    email_confirm: true,
    user_metadata: config.user_metadata,
  });

  if (error) {
    throw error;
  }

  return { user: data.user, created: true };
}

function updateSeedFile(seedPath, replacements) {
  let content = fs.readFileSync(seedPath, "utf8");

  for (const replacement of replacements) {
    content = content.replaceAll(replacement.placeholder, replacement.value);
  }

  fs.writeFileSync(seedPath, content);
}

loadEnvFile(path.resolve(".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedPath = path.resolve("database/seed/001_sample_data.sql");

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!fs.existsSync(seedPath)) {
  console.error(`Seed file not found: ${seedPath}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const userConfigs = [
  {
    label: "admin",
    email: "admin@northwind-health.test",
    password: "Admin123!@#",
    placeholder: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    user_metadata: { full_name: "Northwind Admin", role: "admin" },
  },
  {
    label: "provider",
    email: "provider@northwind-health.test",
    password: "Provider123!@#",
    placeholder: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    user_metadata: { full_name: "Elena Park", role: "provider" },
  },
];

const replacements = [];

for (const config of userConfigs) {
  const result = await ensureUser(supabase, config);
  replacements.push({ placeholder: config.placeholder, value: result.user.id });

  console.log(`${config.label} user ${result.created ? "created" : "already exists"}`);
  console.log(`  email: ${result.user.email}`);
  console.log(`  uuid:  ${result.user.id}`);
  console.log(`  password: ${config.password}`);
}

updateSeedFile(seedPath, replacements);

console.log(`Updated seed file: ${seedPath}`);
console.log("Next step: run database/seed/001_sample_data.sql in Supabase SQL Editor.");
