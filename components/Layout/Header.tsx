"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface NavItem {
  href: string;
  label: string;
}

const navigationItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Product" },
  { href: "/playbook", label: "Playbook" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

function Header() {
  // ① 拿到当前路径，例如 "/"、"/solutions"、"/playbook/xxx"
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isPlaybookPage = pathname.startsWith("/playbook");

  return (
    <header 
      role="banner" 
      className={
        isHomePage 
          ? "sticky top-0 z-50 bg-gradient-to-b from-[#05030d] via-[#050018] to-[#120428] border-none" 
          : isPlaybookPage
          ? "sticky top-0 z-50 bg-black border-none"
          : "bg-white border-b border-gray-200 z-50"
      }
    >
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between pl-2 pr-6">
        {/* 左侧品牌区域 */}
        <div className="brand -ml-4">
          <Link href="/" prefetch={true} className="brand-link flex flex-col" aria-label="AILINKXIN Home">
            <span className={`text-2xl md:text-3xl font-bold ${
              isHomePage || isPlaybookPage ? "text-white" : "text-gray-900"
            }`}>
              AILINKXIN
            </span>
          </Link>
        </div>

        {/* 右侧导航 */}
        <nav role="navigation" aria-label="Main navigation">
          <ul className="flex gap-4 md:gap-6 list-none m-0 p-0 flex-wrap">
            {navigationItems.map((item) => {
              // ② 当前是否激活（高亮）
              const isActive =
                item.href === "/"
                  ? pathname === "/" // Home 只在首页高亮
                  : pathname.startsWith(item.href); // 其它栏目，子路由也高亮，如 /solutions/xxx

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={`text-base md:text-lg font-medium transition-colors relative z-10 pointer-events-auto ${
                      isHomePage
                        ? `text-white hover:text-purple-300 ${isActive ? "border-b-2 border-purple-300" : ""}`
                        : isPlaybookPage
                        ? `text-white hover:text-emerald-400 ${isActive ? "border-b-2 border-emerald-400" : ""}`
                        : `text-gray-900 hover:text-blue-600 ${isActive ? "border-b-2 border-blue-600" : ""}`
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default memo(Header);
