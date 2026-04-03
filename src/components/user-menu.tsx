"use client";

import { useRouter } from "next/navigation";
import { LogOut, Shield, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        <User className="size-4" />
        <span className="hidden sm:inline">{user.name}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="size-4" />
              {t("adminPanel")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="size-4" />
          {t("logoutButton")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
