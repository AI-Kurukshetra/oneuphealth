import { createHash } from "node:crypto";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthenticationError, AuthorizationError } from "@/lib/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { apiKeyRepository } from "@/repositories/apiKeyRepository";
import { userRepository } from "@/repositories/userRepository";
import type { RequestContext, UserRole } from "@/types/domain";

const demoContext: RequestContext = {
  organizationId: "00000000-0000-0000-0000-000000000001",
  userId: "00000000-0000-0000-0000-000000000002",
  role: "admin",
};

export async function getRequestContext(): Promise<RequestContext> {
  const headerStore = await headers();
  const headerContext = getHeaderContext(headerStore);

  if (headerContext) {
    return headerContext;
  }

  const apiKeyContext = await getApiKeyContext(headerStore);
  if (apiKeyContext) {
    return apiKeyContext;
  }

  const appUser = await getSessionAppUser();

  if (!appUser) {
    throw new AuthenticationError("Authentication required");
  }

  return {
    organizationId: appUser.organization_id,
    userId: appUser.id,
    role: appUser.role,
  };
}

export async function requirePageContext() {
  try {
    return await getRequestContext();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect("/login");
    }

    throw error;
  }
}

export async function getNavigationSession() {
  const headerStore = await headers();
  const headerContext = getHeaderContext(headerStore);

  if (headerContext) {
    const appUser = await userRepository.getById(headerContext.userId);

    return {
      isAuthenticated: true,
      userId: headerContext.userId,
      role: headerContext.role,
      fullName: appUser?.full_name ?? null,
      email: appUser?.email ?? null,
    };
  }

  const appUser = await getSessionAppUser();

  return {
    isAuthenticated: Boolean(appUser),
    userId: appUser?.id ?? null,
    role: appUser?.role ?? null,
    fullName: appUser?.full_name ?? null,
    email: appUser?.email ?? null,
  };
}

export function assertRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) {
    throw new AuthorizationError("Access denied");
  }
}

function getHeaderContext(headerStore: Headers): RequestContext | null {
  const organizationId = headerStore.get("x-organization-id");
  const userId = headerStore.get("x-user-id");
  const role = headerStore.get("x-user-role") as UserRole | null;

  if (!organizationId || !userId || !role) {
    return null;
  }

  return {
    organizationId,
    userId,
    role,
  };
}

async function getApiKeyContext(headerStore: Headers): Promise<RequestContext | null> {
  const authorization = headerStore.get("authorization")?.trim();

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const rawToken = authorization.slice("Bearer ".length).trim();
  if (!rawToken) {
    throw new AuthenticationError("Invalid API key");
  }

  const keyHash = createHash("sha256").update(rawToken).digest("hex");
  const apiKey = await apiKeyRepository.getByHash(keyHash);

  if (!apiKey) {
    throw new AuthenticationError("Invalid API key");
  }

  const user = await userRepository.getById(apiKey.user_id);

  if (!user || user.organization_id !== apiKey.organization_id) {
    throw new AuthorizationError("API key owner is not provisioned for this organization");
  }

  return {
    organizationId: apiKey.organization_id,
    userId: user.id,
    role: user.role,
  };
}

async function getSessionAppUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoContext.role ? await userRepository.getById(demoContext.userId) : null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const appUser = await userRepository.getByAuthUserId(user.id);

  if (!appUser) {
    throw new AuthorizationError("Authenticated user is not provisioned in the application");
  }

  return appUser;
}
