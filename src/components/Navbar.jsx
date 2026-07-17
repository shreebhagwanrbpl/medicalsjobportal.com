"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
<header className="sticky top-0 z-50 border-b border-[#D9D7B6]/60 bg-[#FDFBD4]/85 backdrop-blur-xl shadow-lg">

  <div className="container-custom flex h-20 items-center justify-between">

    {/* Logo */}

    <Link href={makeLink("/")}>

      <h1 className="text-2xl font-black tracking-tight">

        <span className="text-[#545333]">
          Central
        </span>

        <span className="text-[#878672]">
          {" "}Biomedicals
        </span>

      </h1>

    </Link>

    {/* Desktop Menu */}

    <nav className="hidden items-center gap-8 lg:flex">

      {navLinks.map((link) => (

        <Link
          key={link.name}
          href={makeLink(link.path)}
          className="
            relative
            font-semibold
            text-[#545333]
            transition-all
            duration-300
            hover:text-[#878672]
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-[#545333]
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
        >

          {link.name}

        </Link>

      ))}

    </nav>

    {/* Desktop Button */}

    <div className="hidden lg:block">

      <Link href={makeLink("/contact")}>

        <button
          className="
            rounded-xl
            bg-[#545333]
            px-6
            py-3
            font-semibold
            text-[#FDFBD4]
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#45452A]
            hover:shadow-xl
          "
        >

          Get Quote

        </button>

      </Link>

    </div>

    {/* Mobile Button */}

    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="
        rounded-xl
        border
        border-[#D9D7B6]
        bg-white/70
        p-2
        transition-all
        duration-300
        hover:bg-[#D9D7B6]
        lg:hidden
      "
    >

      {menuOpen ? (

        <X
          size={26}
          className="text-[#545333]"
        />

      ) : (

        <Menu
          size={26}
          className="text-[#545333]"
        />

      )}

    </button>

  </div>

  {/* Mobile Menu */}

  <div
    className={`overflow-hidden transition-all duration-300 lg:hidden ${
      menuOpen ? "max-h-[500px]" : "max-h-0"
    }`}
  >

    <div className="border-t border-[#D9D7B6] bg-[#FDFBD4]/95 backdrop-blur-xl px-6 py-6">

      <nav className="flex flex-col gap-5">

        {navLinks.map((link) => (

          <Link
            key={link.name}
            href={makeLink(link.path)}
            onClick={() => setMenuOpen(false)}
            className="
              font-semibold
              text-[#545333]
              transition-all
              duration-300
              hover:translate-x-2
              hover:text-[#878672]
            "
          >

            {link.name}

          </Link>

        ))}

        <Link
          href={makeLink("/contact")}
          onClick={() => setMenuOpen(false)}
        >

          <button
            className="
              mt-3
              w-full
              rounded-xl
              bg-[#545333]
              py-3
              font-semibold
              text-[#FDFBD4]
              transition-all
              duration-300
              hover:bg-[#45452A]
            "
          >

            Get Quote

          </button>

        </Link>

      </nav>

    </div>

  </div>

</header>
  );
}