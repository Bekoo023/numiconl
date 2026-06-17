import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: total } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: pending } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "In behandeling");

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        fullName={fullName}
        email={user.email ?? ""}
        pending={pending ?? 0}
        total={total ?? 0}
      />
      <div className="flex-1 lg:ml-60 pb-20 lg:pb-0">{children}</div>
    </div>
  );
}
