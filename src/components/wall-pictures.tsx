"use client";

import { useLanguage } from "@/lib/language-context";
import { services, type ServiceId } from "@/lib/services-data";
import {
  Shield,
  GraduationCap,
  Briefcase,
  Heart,
  Home,
  HandHeart,
  type LucideIcon,
} from "lucide-react";

type WallPicturesProps = {
  onServiceClick: (id: ServiceId) => void;
};

const serviceIcons: Record<ServiceId, LucideIcon> = {
  protection: Shield,
  education: GraduationCap,
  labor: Briefcase,
  health: Heart,
  housing: Home,
  social: HandHeart,
};

const serviceStyles: Record<ServiceId, string> = {
  protection: "bg-gradient-to-r from-blue-600 to-blue-500",
  education: "bg-gradient-to-r from-amber-600 to-amber-500",
  labor: "bg-gradient-to-r from-emerald-600 to-emerald-500",
  health: "bg-gradient-to-r from-rose-500 to-rose-400",
  housing: "bg-gradient-to-r from-violet-600 to-violet-500",
  social: "bg-gradient-to-r from-teal-600 to-teal-500",
};

export function WallPictures({ onServiceClick }: WallPicturesProps) {
  const { language } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-center gap-2 sm:gap-3">
      {services.map((service) => {
        const Icon = serviceIcons[service.id];
        return (
          <button
            key={service.id}
            onClick={() => onServiceClick(service.id)}
            className={`flex w-48 items-center gap-3 rounded-xl px-4 py-4 shadow-lg transition-opacity hover:opacity-90 sm:w-56 sm:gap-4 sm:px-5 sm:py-5 md:w-64 ${serviceStyles[service.id]}`}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/20 sm:size-11">
              <Icon className="size-5 text-white sm:size-6" />
            </div>
            <span className="text-left text-xs font-semibold leading-tight text-white sm:text-sm md:text-[15px]">
              {language ? service.title[language] : service.title.en}
            </span>
          </button>
        );
      })}
    </div>
  );
}
