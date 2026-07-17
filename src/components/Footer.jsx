"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [district]);

  const phone =
    contactInfo.find(
      (x) => x.label === "Phone Number"
    )?.value || "";

  const email =
    contactInfo.find(
      (x) => x.label === "Email Address"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  if (loading) {
    return (
  <footer className="border-t border-[#D9D7B6] bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  <div className="container-custom py-16">

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {[...Array(4)].map((_, i) => (

        <div key={i}>

          {/* Heading Skeleton */}

          <div className="mb-6 h-8 w-40 animate-pulse rounded-xl bg-[#D9D7B6]" />

          {/* Links Skeleton */}

          {[...Array(5)].map((_, j) => (

            <div
              key={j}
              className="mb-4 h-5 animate-pulse rounded-lg bg-[#D9D7B6]/80"
            />

          ))}

        </div>

      ))}

    </div>

    {/* Bottom */}

    <div className="mt-12 border-t border-[#D9D7B6] pt-6">

      <div className="h-5 w-72 animate-pulse rounded-lg bg-[#D9D7B6]" />

    </div>

  </div>

</footer>
    );
  }
  return (
<footer className="border-t border-[#D9D7B6] bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  <div className="container-custom py-16">

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {/* Company */}

      <div>

        <h2 className="text-3xl font-black tracking-tight">

          <span className="text-[#545333]">
            Central
          </span>

          <span className="text-[#878672]">
            {" "}Biomedicals
          </span>

        </h2>

        <p className="mt-5 leading-8 text-[#6A6954]">

          Delivering trusted diagnostic and biomedical solutions with
          innovation, quality, and precision healthcare support across India.

        </p>

      </div>

      {/* Quick Links */}

      <div>

        <h3 className="mb-5 text-xl font-bold text-[#545333]">

          Quick Links

        </h3>

        <div className="flex flex-col gap-4">

          {[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Services", link: "/services" },
            { name: "Products", link: "/items" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (

            <Link
              key={item.name}
              href={makeLink(item.link)}
              className="font-medium text-[#6A6954] transition-all duration-300 hover:translate-x-2 hover:text-[#545333]"
            >

              {item.name}

            </Link>

          ))}

        </div>

      </div>

      {/* Services */}

      <div>

        <h3 className="mb-5 text-xl font-bold text-[#545333]">

          Services

        </h3>

        <div className="space-y-4">

          {[
            "Diagnostic Equipment",
            "Laboratory Solutions",
            "Biomedical Instruments",
            "Maintenance Support",
          ].map((service) => (

            <p
              key={service}
              className="cursor-pointer font-medium text-[#6A6954] transition-all duration-300 hover:translate-x-2 hover:text-[#545333]"
            >

              {service}

            </p>

          ))}

        </div>

      </div>

      {/* Contact */}

      <div>

        <h3 className="mb-5 text-xl font-bold text-[#545333]">

          Contact Info

        </h3>

        <div className="space-y-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9D7B6]">

              <MapPin
                size={18}
                className="text-[#545333]"
              />

            </div>

            <p className="leading-7 text-[#6A6954]">

              {dynamicAddress}

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9D7B6]">

              <Phone
                size={18}
                className="text-[#545333]"
              />

            </div>

            <p className="text-[#6A6954]">

              {phone}

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9D7B6]">

              <Mail
                size={18}
                className="text-[#545333]"
              />

            </div>

            <p className="text-[#6A6954]">

              {email}

            </p>

          </div>

        </div>

      </div>

    </div>

    {/* Bottom */}

    <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#D9D7B6] pt-8 text-sm md:flex-row">

      <p className="text-[#6A6954]">

        © 2026
        <span className="font-semibold text-[#545333]">
          {" "}Central Biomedicals
        </span>
        . All rights reserved.

      </p>

      <p className="text-[#6A6954]">

        Designed with
        <span className="mx-1 text-red-500">❤️</span>
        for modern diagnostics.

      </p>

    </div>

  </div>

</footer>
  );
}