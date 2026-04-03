"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession as getSessionFromCookie,
  type SessionPayload,
} from "@/lib/auth";

type AuthResult =
  | { success: true; user: SessionPayload }
  | { success: false; error: string };

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "email_exists" };
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      })
      .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

    const session: SessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(session);
    await setSessionCookie(token);

    return { success: true, user: session };
  } catch (e) {
    console.error("Register error:", e);
    return { success: false, error: "server_error" };
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (!user || !user.passwordHash) {
      return { success: false, error: "invalid_credentials" };
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "invalid_credentials" };
    }

    const session: SessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(session);
    await setSessionCookie(token);

    return { success: true, user: session };
  } catch (e) {
    console.error("Login error:", e);
    return { success: false, error: "server_error" };
  }
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
}

export async function getSession(): Promise<SessionPayload | null> {
  return getSessionFromCookie();
}
