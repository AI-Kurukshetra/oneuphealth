import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export function routeError(error: unknown) {
  if (error instanceof AuthenticationError) {
    return apiError("unauthorized", error.message || "Authentication required", 401);
  }

  if (error instanceof AuthorizationError) {
    return apiError("forbidden", error.message || "Access denied", 403);
  }

  if (error instanceof ZodError) {
    return apiError("invalid_request", error.issues[0]?.message ?? "Invalid request", 400);
  }

  if (error instanceof Error) {
    return apiError("bad_request", error.message, 400);
  }

  return apiError("bad_request", "Unexpected request error", 400);
}
