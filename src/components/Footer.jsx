"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "@/lib/client-api";
import { db } from "@/lib/client-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { fetchFullCatalog, fetchContactData } from "@/lib/data-fetcher";
import { parseContactDetails } from "@/lib/constants";

export default function Footer() {
  const [contactData, setContactData] = useState(() => parseContactDetails(null));
  const [districtData, setDistrictData] = useState(null);
  const [categories, setCategories] = useState([]);

  const pathname = usePathname();

  const pathParts = pathname
    ? pathname.split("/").filter(Boolean)
    : [];

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  // Load dynamic contact data
  useEffect(() => {
    let isMounted = true;

    const loadContact = async () => {
      try {
        const raw = await fetchContactData();
        if (isMounted && raw) {
          setContactData(parseContactDetails(raw, districtData));
        }
      } catch (err) {
        console.error("Footer: error loading contact data", err);
      }
    };

    loadContact();

    return () => {
      isMounted = false;
    };
  }, [districtData]);

  // Load district specific data if on district route
  useEffect(() => {
    let isMounted = true;
    if (!district) {
      setDistrictData(null);
      return;
    }

    const loadDistrict = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "medicalsjobportalcom",
            "districts",
            district
          )
        );

        if (isMounted && snap.exists()) {
          const dData = snap.data();
          setDistrictData(dData);
          setContactData((prev) => parseContactDetails(prev, dData));
        }
      } catch (err) {
        console.error("Footer: error loading district", err);
      }
    };

    loadDistrict();

    return () => {
      isMounted = false;
    };
  }, [district]);

  // Load dynamic categories
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const catalog = await fetchFullCatalog();
        const uniqueCategories = Array.from(
          new Set(
            catalog
              .map((item) => item.category)
              .filter(Boolean)
          )
        );

        if (isMounted) {
          setCategories(uniqueCategories.slice(0, 7));
        }
      } catch (err) {
        console.error("Error loading categories in footer:", err);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const { phones, email, address } = contactData;

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };

  const hasContactInfo = (phones && phones.length > 0) || email || address;

  return (
    <footer className="bg-white border-t border-green-100">
      <div className="container-custom py-14">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          {/* =========================================
              BRAND
          ========================================= */}
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              Raj
              <span className="text-slate-800"> Biosis</span>
            </h2>

            <p className="mt-5 text-slate-500 leading-7">
              Delivering trusted diagnostic and biomedical solutions with
              innovation, quality, and precision healthcare support.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href={contactData.facebook || "https://www.facebook.com/rajbiosispvtltd/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-green-50
                  border
                  border-green-100
                  flex
                  items-center
                  justify-center
                  text-green-600
                  hover:bg-green-600
                  hover:text-white
                  hover:border-green-600
                  transition
                "
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href={contactData.instagram || "https://www.instagram.com/rajbiosisindia/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-green-50
                  border
                  border-green-100
                  flex
                  items-center
                  justify-center
                  text-green-600
                  hover:bg-green-600
                  hover:text-white
                  hover:border-green-600
                  transition
                "
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* =========================================
              QUICK LINKS
          ========================================= */}
          <div className="w-fit">
            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Quick Links
            </h3>

            <div className="flex w-fit flex-col gap-3 text-slate-500">
              <Link
                href={makeLink("/")}
                className="hover:text-green-600 transition"
              >
                Home
              </Link>

              <Link
                href={makeLink("/about")}
                className="hover:text-green-600 transition"
              >
                About
              </Link>

              <Link
                href={makeLink("/services")}
                className="hover:text-green-600 transition"
              >
                Services
              </Link>

              <Link
                href={makeLink("/items")}
                className="hover:text-green-600 transition"
              >
                Products
              </Link>

              <Link
                href={makeLink("/contact")}
                className="hover:text-green-600 transition"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* =========================================
              CATEGORIES
          ========================================= */}
          <div className="w-fit">
            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Our Categories
            </h3>

            <div className="flex w-fit flex-col gap-3 text-slate-500">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={makeLink(
                    `/items#${cat
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`
                  )}
                  className="
                    w-fit
                    hover:text-green-600
                    transition
                    text-left
                  "
                >
                  {cat}
                </Link>
              ))}

              {categories.length === 0 && (
                <>
                  <p>Diagnostic Equipment</p>
                  <p>Laboratory Solutions</p>
                  <p>Biomedical Instruments</p>
                  <p>Maintenance Support</p>
                </>
              )}
            </div>
          </div>

          {/* =========================================
              CONTACT
          ========================================= */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Contact Info
            </h3>

            <div className="space-y-4 text-slate-500">
              {/* Address */}
              {address ? (
                <div className="flex items-start gap-3">
                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-green-50
                      border
                      border-green-100
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <MapPin
                      size={21}
                      className="text-green-600"
                    />
                  </div>

                  <p className="leading-6 pt-1">
                    {address}
                  </p>
                </div>
              ) : null}

              {/* Phone */}
              {phones && phones.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {phones.map((num, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3"
                    >
                      <Phone
                        size={17}
                        className="text-green-600 flex-shrink-0"
                      />

                      <a
                        href={`tel:${num.replace(/\s+/g, "")}`}
                        className="hover:text-green-600 transition"
                      >
                        {num}
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Email */}
              {email ? (
                <div className="flex items-center gap-3">
                  <Mail
                    size={17}
                    className="text-green-600 flex-shrink-0"
                  />

                  <p>
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-green-600 transition"
                    >
                      {email}
                    </a>
                  </p>
                </div>
              ) : null}

              {!hasContactInfo && (
                <p className="text-slate-400 text-sm">
                  Loading contact information...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM
        ========================================= */}
        <div
          className="
            border-t
            border-green-100
            mt-10
            pt-5
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            text-sm
            text-slate-500
          "
        >
          <p>
            © 2026 Raj Biosis. All rights reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Designed with precision for modern diagnostics.
          </p>
        </div>
      </div>
    </footer>
  );
}