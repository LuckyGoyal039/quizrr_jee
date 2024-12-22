"use client";
import Image from "next/image";
import Link from "next/link";
import { Link as LinkTag } from "react-scroll";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  isScrollLink: boolean;
} & (
    | {
      isScrollLink: true;
      to: string;
      href?: never;
      isExternal?: never;
    }
    | {
      isScrollLink: false;
      href: string;
      to?: never;
      isExternal?: boolean;
    }
  );

function Navbar() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Initial scroll position
    setScrollPosition(window.scrollY);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array

  const navLinks: NavLink[] = [
    { href: "/", label: "Home", isScrollLink: false },
    { to: "testseries", label: "Test Series", isScrollLink: true },
    { to: "institute", label: "For Institutes", isScrollLink: true },
    { href: "mailto:luckgoyalconnect@gmail.com", label: "Contact Us", isScrollLink: false, isExternal: true }
  ];

  return (
    <div className={`fixed top-0 w-full transition-colors duration-300 ${scrollPosition < 5 ? "bg-transparent" : "bg-white shadow-sm"
      } z-50`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-5">
          <div>
            <Image
              width={95}
              height={38}
              alt="Quizrr Logo"
              src={scrollPosition < 5
                ? "https://www.mathongo.com/public/brand/quizrr/logo-light.svg"
                : "https://www.mathongo.com/public/brand/quizrr/logo-dark.svg"
              }
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex gap-2">
              {navLinks.map((link) =>
                link.isScrollLink ? (
                  <LinkTag
                    key={link.to}
                    to={link.to}
                    activeClass="active"
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className={`py-2 px-6 transition-colors hover:text-blue-500 ${scrollPosition < 5 ? "text-white" : "text-gray-800"
                      }`}
                  >
                    {link.label}
                  </LinkTag>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-6 transition-colors hover:text-blue-500 ${scrollPosition < 5 ? "text-white" : "text-gray-800"
                      }`}
                    {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
            <Link href="/auth/login">
              <Button className="bg-blue-500 hover:bg-blue-600 transition-colors">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className={scrollPosition < 5 ? "text-white" : "text-gray-800"} />
            ) : (
              <Menu size={24} className={scrollPosition < 5 ? "text-white" : "text-gray-800"} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white">
            <nav className="flex flex-col">
              {navLinks.map((link) =>
                link.isScrollLink ? (
                  <LinkTag
                    key={link.to}
                    to={link.to}
                    activeClass="active"
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="py-2 px-6 text-gray-800 hover:text-blue-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </LinkTag>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-2 px-6 text-gray-800 hover:text-blue-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="px-6 py-2">
                <Link href="/auth/login">
                  <Button className="bg-blue-500 hover:bg-blue-600 transition-colors w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;