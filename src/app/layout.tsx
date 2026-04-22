import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NAV_ITEMS, SITE } from "@/lib/constants/locale";
import { getTeamProfile } from "@/lib/data/team";

export const dynamic = 'force-dynamic'

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "鹏飏足球 — 深圳市龙华区观湖实验学校",
  description:
    "深圳市龙华区观湖实验学校鹏飏足球队官方网站，查看赛程、比赛结果和球队动态。",
  openGraph: {
    title: "鹏飏足球 — 深圳市龙华区观湖实验学校",
    description:
      "深圳市龙华区观湖实验学校鹏飏足球队官方网站，查看赛程、比赛结果和球队动态。",
    locale: "zh_CN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getTeamProfile();

  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
        <SiteHeader navItems={[...NAV_ITEMS]} badgeUrl={profile.badgeUrl} />
        <main className="flex-1">{children}</main>
        <SiteFooter
          navItems={[...NAV_ITEMS]}
          teamName={SITE.teamFullName}
          badgeUrl={profile.badgeUrl}
          contactAddress={profile.contactAddress}
          contactEmail={profile.contactEmail}
        />
        </AuthProvider>
      </body>
    </html>
  );
}
