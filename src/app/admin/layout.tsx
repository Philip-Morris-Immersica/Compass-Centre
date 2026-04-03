"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/admin/prompt", label: "System Prompt", icon: FileText },
  { href: "/admin/config", label: "Configuration", icon: Settings },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/admin/history", label: "Chat History", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Compass Centre</p>
        </div>
        <Separator />
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
