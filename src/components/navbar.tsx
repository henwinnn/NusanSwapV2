"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@xellar/kit";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        isScrolled ? "py-2 bg-black/80 backdrop-blur-md" : "py-4 bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Navigation */}
        <div
          className="flex items-center space-x-8"
          style={{ width: "60%", paddingRight: "10px" }}
        >
          <Link href="/">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="text-white font-bold text-xl tracking-tight"
                style={{ width: "100px" }}
              >
                NusanSwap
              </span>
            </motion.div>
          </Link>

          <div className="md:flex space-x-6" style={{ overflow: "auto" }}>
            <NavLink href="/" active={pathname === "/"}>
              Swap
            </NavLink>
            <NavLink href="/pool" active={pathname.startsWith("/pool")}>
              Pools
            </NavLink>
            <NavLink href="/earn" active={pathname.startsWith("/earn")}>
              Earn
            </NavLink>
          </div>
        </div>

        {/* Connect Wallet Button */}

        <div
          style={{
            // wordBreak: "break-all",
            whiteSpace: "nowrap",
          }}
        >
          <ConnectButton />
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <span
        className={`text-sm font-medium cursor-pointer transition-colors ${
          active ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
