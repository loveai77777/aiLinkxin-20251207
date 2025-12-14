import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow all requests through - no authentication required
  return NextResponse.next();
}

export const config = {
  matcher: [],
};


