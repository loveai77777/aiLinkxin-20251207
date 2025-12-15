import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "default-secret-change-in-production";

/**
 * Create an admin session token
 */
export async function createAdminSession(): Promise<string> {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const data = `${timestamp}:${random}`;
  
  const hmac = createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  return `${data}:${signature}`;
}

/**
 * Verify admin session token
 */
export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    
    const [timestamp, random, signature] = parts;
    
    // Check expiration (24 hours)
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    if (now - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    // Verify signature
    const data = `${timestamp}:${random}`;
    const hmac = createHmac("sha256", SECRET_KEY);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    // Use timing-safe comparison
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Get admin session from cookies
 */
export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return false;
  }

  return await verifyAdminSession(sessionToken);
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/**
 * Clear admin session
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}






