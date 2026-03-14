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

loadEnvFile(path.resolve(".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment or .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const users = [
  {
    label: "admin",
    email: "admin@northwind-health.test",
    password: "Admin123!@#",
    user_metadata: { full_name: "Northwind Admin", role: "admin" },
  },
  {
    label: "provider",
    email: "provider@northwind-health.test",
    password: "Provider123!@#",
    user_metadata: { full_name: "Elena Park", role: "provider" },
  },
];

for (const user of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: user.user_metadata,
  });

  if (error) {
    console.error(`Failed to create ${user.label} user (${user.email}): ${error.message}`);
    continue;
  }

  console.log(`${user.label} user created`);
  console.log(`  email: ${data.user.email}`);
  console.log(`  uuid:  ${data.user.id}`);
  console.log(`  password: ${user.password}`);
}
