"use server";

import { cookies } from "next/headers";
import { PENDING_QUOTE_COOKIE } from "./pending";

/** Clear the stashed quote once it's been completed (or abandoned). */
export async function clearPendingQuote(): Promise<void> {
  const store = await cookies();
  store.delete(PENDING_QUOTE_COOKIE);
}
