import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/account/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your MOUSE HUB orders, rewards and profile.",
};

export default function AccountPage() {
  return (
    // Suspense обязателен: AccountView читает useSearchParams (?tab=…).
    <Suspense
      fallback={
        <div className="container flex min-h-[55vh] items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
        </div>
      }
    >
      <AccountView />
    </Suspense>
  );
}
