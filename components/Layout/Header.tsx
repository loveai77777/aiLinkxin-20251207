"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState, useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
}

const navigationItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Product" },
  { href: "/playbook", label: "Playbook" },
  { href: "/picks", label: "Picks" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isPlaybookPage = pathname.startsWith("/playbook");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 关闭菜单当路径改变时
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 阻止背景滚动当菜单打开时
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
      <div className="mx-auto flex h-16 md:h-20 max-w-4xl items-center justify-between px-4 md:pl-2 md:pr-6">
        {/* 左侧品牌区域 */}
        <div className="brand -ml-2 md:-ml-4">
          <Link href="/" prefetch={true} className="brand-link flex flex-col" aria-label="AILINKXIN Home">
            <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${
              isHomePage || isPlaybookPage ? "text-white" : "text-gray-900"
            }`}>
              AILINKXIN
            </span>
          </Link>
        </div>

        {/* 桌面端导航 */}
        <nav role="navigation" aria-label="Main navigation" className="hidden md:block">
          <ul className="flex gap-4 md:gap-6 list-none m-0 p-0">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

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

        {/* 移动端汉堡菜单按钮 */}
        <button
          type="button"
          className="md:hidden relative z-50 p-2 touch-manipulation"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isHomePage || isPlaybookPage ? "text-white" : "text-gray-900"
              } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isHomePage || isPlaybookPage ? "text-white" : "text-gray-900"
              } ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                isHomePage || isPlaybookPage ? "text-white" : "text-gray-900"
              } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>

        {/* 移动端菜单覆盖层 */}
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* 滑动菜单 */}
            <nav
              role="navigation"
              aria-label="Mobile navigation"
              className="fixed top-16 right-0 bottom-0 w-64 bg-gradient-to-b from-[#05030d] via-[#050018] to-[#120428] z-40 md:hidden transform transition-transform duration-300 ease-out shadow-2xl overflow-y-auto"
            >
              <ul className="flex flex-col p-6 gap-1">
                {navigationItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={true}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-all touch-manipulation active:scale-95 ${
                          isActive
                            ? "bg-purple-500/20 text-purple-300 border-l-4 border-purple-300"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
