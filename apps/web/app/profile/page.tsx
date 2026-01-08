// app/settings/profile/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/contexts/auth-context";

function InfoItem({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      {Icon && (
        <div className="mt-0.5 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="space-y-1 flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {href ? (
          <Link
            href={href}
            className="text-sm text-primary hover:underline underline-offset-4 block truncate"
          >
            {value}
          </Link>
        ) : (
          <p className="text-sm text-foreground font-medium break-words">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <Separator />
    </div>
  );
}

const user1 = {
  name: "Sarah Connor",
  role: "Senior Product Designer",
  email: "sarah.connor@simpleconf.com",
  phone: "+1 (555) 012-3456",
  slack: "@sarahc",
  location: "San Francisco, CA (PST)",
  department: "Product Design",
  manager: "Kyle Reese",
  joinedDate: "March 12, 2023",
  about:
    "Passionate about creating intuitive and accessible user experiences. Currently leading the design system initiative at SimpleConf. Previously worked at Cyberdyne Systems on interface design. In my free time, I enjoy hiking and photography.",
  avatarUrl:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const curUser = useMemo(() => {
    const joinedDate = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : user1.joinedDate;

    return {
      ...user1,
      name: user?.displayName || user1.name,
      email: user?.email || user1.email,
      department: user?.department || user1.department,
      joinedDate,
      avatarUrl: user1.avatarUrl,
    };
  }, [user]);

  const initials = curUser.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-foreground font-medium">My Profile</span>
        </div>

        <Card className="border-muted bg-background/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="space-y-4">
              {/* Top row: Back button and Edit button */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm" className="shrink-0">
                  Edit Profile
                </Button>
              </div>

              {/* Profile section */}
              <div className="flex gap-4 items-start">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-muted shrink-0">
                  <AvatarImage src={curUser.avatarUrl} alt={curUser.name} />
                  <AvatarFallback className="text-lg sm:text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                    {curUser.name}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {curUser.role}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Briefcase className="h-3 w-3" />
                      {curUser.department}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {curUser.location.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Sections */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <SectionTitle title="Contact Information" icon={Mail} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoItem
                    label="Email Address"
                    value={curUser.email}
                    icon={Mail}
                  />
                  <InfoItem label="Phone" value={curUser.phone} icon={Phone} />
                  <InfoItem label="Slack" value={curUser.slack} href="#" />
                  <InfoItem
                    label="Location"
                    value={curUser.location}
                    icon={MapPin}
                  />
                </div>
              </div>

              {/* Organization */}
              <div className="space-y-4">
                <SectionTitle title="Organization" icon={Briefcase} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoItem
                    label="Department"
                    value={curUser.department}
                    icon={Briefcase}
                  />
                  <InfoItem
                    label="Manager"
                    value={curUser.manager}
                    href="#"
                    icon={Users}
                  />
                  <InfoItem
                    label="Joined Date"
                    value={curUser.joinedDate}
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* About */}
              <div className="space-y-4">
                <SectionTitle title="About" />
                <div className="rounded-lg bg-muted/30 p-4 border border-muted">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {curUser.about}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
