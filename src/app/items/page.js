"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { usePathname } from "next/navigation";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
// import CTASection from "@/components/CTASection";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categorySearch, setCategorySearch] =
    useState("");

  const [productSearch, setProductSearch] =
    useState("");
  const [loading, setLoading] = useState(true);



  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const [pendingScroll, setPendingScroll] =
    useState(null);

  const [loadedImages, setLoadedImages] =
    useState({});

  const [showTopButton, setShowTopButton] =
    useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const district =
    pathParts[0] === "items"
      ? null
      : pathParts[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const categorySnap = await getDocs(
          collection(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        const allProducts = [];

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          const categoryProducts =
            (data.products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `${categoryDoc.id}-${index}`,
                category:
                  data.category ||
                  categoryDoc.id,
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...categoryProducts
          );

        });

        const oldSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "products"
          )
        );

        if (oldSnap.exists()) {

          const oldProducts =
            (oldSnap.data().products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `other-${index}`,
                category:
                  "Other Products",
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...oldProducts
          );

        }
        console.log("ALL PRODUCTS", allProducts);
        setProducts(allProducts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `
      ${item.title}
      ${item.brand}
      ${item.model}
      ${item.category}
      `
        .toLowerCase();

      return text.includes(
        productSearch.toLowerCase()
      );
    });
  }, [products, productSearch]);

  const groupedProducts = useMemo(() => {
    const obj = {};

    filteredProducts.forEach((item) => {
      if (!obj[item.category]) {
        obj[item.category] = [];
      }

      obj[item.category].push(item);
    });

    return obj;
  }, [filteredProducts]);

  const sortedGroupedProducts =
    useMemo(() => {

      const entries =
        Object.entries(
          groupedProducts
        );

      entries.sort(([a], [b]) => {

        if (
          a === "Other Products"
        )
          return 1;

        if (
          b === "Other Products"
        )
          return -1;

        return a.localeCompare(b);

      });

      return Object.fromEntries(
        entries
      );

    }, [groupedProducts]);
  const categories =
    Object.keys(groupedProducts);

  const toggleCategory = (category) => {
    if (openedCategory === category) {
      setOpenedCategory("");
      return;
    }

    setOpenedCategory(category);
  };

  const scrollToProduct = (
    slug,
    category
  ) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setPendingScroll(slug);
  };

  useEffect(() => {
    if (!pendingScroll) return;

    const timer = setTimeout(() => {
      const el =
        document.getElementById(
          pendingScroll
        );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPendingScroll(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [openedCategory, pendingScroll]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(
        window.scrollY > 500
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
    <section className="section-padding bg-gradient-to-br from-[#FCFAEF] via-[#F7F5E8] to-[#ECE7D0]">

  <div className="container-custom">

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {[...Array(8)].map((_, i) => (

        <div
          key={i}
          className="overflow-hidden rounded-[32px] border border-[#D9D7B6] bg-white p-5 shadow-lg"
        >

          {/* Image */}

          <div className="h-48 w-full animate-pulse rounded-[24px] bg-[#D9D7B6]" />

          {/* Category */}

          <div className="mt-6 h-6 w-24 animate-pulse rounded-full bg-[#D9D7B6]/80" />

          {/* Title */}

          <div className="mt-5 h-7 w-4/5 animate-pulse rounded-lg bg-[#D9D7B6]" />

          {/* Description */}

          <div className="mt-5 space-y-3">

            <div className="h-4 rounded bg-[#D9D7B6]/70" />

            <div className="h-4 w-11/12 rounded bg-[#D9D7B6]/70" />

            <div className="h-4 w-8/12 rounded bg-[#D9D7B6]/70" />

          </div>

          {/* Button */}

          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-[#545333]/20" />

        </div>

      ))}

    </div>

  </div>

</section>
    );
  }

  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      {/* Products */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          <SectionTitle
            badge="Our Product Collection"
            title="Advanced Biomedical & Diagnostic Equipment"
            description="Explore our comprehensive range of premium biomedical, laboratory, pathology, and diagnostic equipment engineered for precision, reliability, and exceptional performance. Designed to meet the evolving needs of hospitals, laboratories, clinics, and healthcare professionals across India."
            center
          />

        </div>

        {/* Search */}
      <div className="relative mx-auto mt-6 max-w-2xl px-4 lg:mt-10 lg:px-0">

  <Search
    size={22}
    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#878672]"
  />

  <input
    type="text"
    placeholder="Search biomedical products..."
    value={productSearch}
    onChange={(e) => setProductSearch(e.target.value)}
    className="
      h-16
      w-full
      rounded-2xl
      border
      border-[#D9D7B6]
      bg-white
      pl-14
      pr-5
      text-[#545333]
      shadow-lg
      transition-all
      duration-300
      placeholder:text-[#878672]
      focus:border-[#545333]
      focus:bg-[#FCFAEF]
      focus:outline-none
      focus:ring-4
      focus:ring-[#545333]/15
    "
  />

</div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 mt-8 lg:mt-16 items-start px-4 lg:px-0">

          {/* Sidebar */}

   <aside
  className="
    lg:sticky
    lg:top-24
    self-start
    rounded-[32px]
    border
    border-[#D9D7B6]
    bg-white
    shadow-xl
    p-5
    lg:p-6
  "
>

  {/* Heading */}

  <div className="mb-6">

    <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#D9D7B6]/40 px-4 py-2 text-sm font-semibold text-[#545333]">

      Browse

    </span>

    <h3 className="mt-4 text-2xl font-black text-[#545333]">

      Categories

    </h3>

  </div>

  {/* Category List */}

  <div className="space-y-3">

    {Object.keys(sortedGroupedProducts)
      .filter((category) =>
        category
          .toLowerCase()
          .includes(categorySearch.toLowerCase())
      )
      .map((category) => (

        <div
          key={category}
          className="overflow-hidden rounded-2xl border border-[#D9D7B6]"
        >

          <button
            onClick={() => toggleCategory(category)}
            className={`flex w-full items-center justify-between px-5 py-4 font-medium transition-all duration-300

            ${
              activeCategory === category
                ? "bg-[#545333] text-white shadow-lg"
                : "bg-white text-[#545333] hover:bg-[#FCFAEF]"
            }`}
          >

            <span className="flex items-center gap-3">

              {openedCategory === category ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

              {category}

            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold

              ${
                activeCategory === category
                  ? "bg-white/20 text-white"
                  : "bg-[#D9D7B6] text-[#545333]"
              }`}
            >

              {groupedProducts[category].length}

            </span>

          </button>

          <div
            className={`custom-scrollbar overflow-y-auto transition-all duration-300

            ${
              openedCategory === category
                ? "max-h-72"
                : "max-h-0 overflow-hidden"
            }`}
          >

            {groupedProducts[category].map((item) => (

              <button
                key={item.uid}
                onClick={() =>
                  scrollToProduct(item.slug, category)
                }
                className="
                  block
                  w-full
                  border-t
                  border-[#D9D7B6]
                  px-6
                  py-3
                  text-left
                  text-sm
                  text-[#6A6954]
                  transition-all
                  duration-300
                  hover:bg-[#FCFAEF]
                  hover:text-[#545333]
                "
              >

                {item.title}

              </button>

            ))}

          </div>

        </div>

      ))}

  </div>

</aside>





          {/* ==========================
                RIGHT SIDE START
            ========================== */}

          <div className="space-y-16">
            {filteredProducts.length === 0 ? (
                <div className="rounded-[32px] border border-[#D9D7B6] bg-white p-10 text-center shadow-xl lg:p-16">

                  {/* Icon */}

                  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#D9D7B6] to-[#FDFBD4] text-5xl shadow-lg">

                    🔍

                  </div>

                  {/* Title */}

                  <h2 className="text-3xl font-black text-[#545333] lg:text-4xl">

                    Product Not Found

                  </h2>

                  {/* Description */}

                  <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6A6954]">

                    We couldn't find any biomedical products matching

                    <span className="mx-1 font-bold text-[#545333]">

                      "{productSearch}"

                    </span>

                    Please try another keyword, browse a different category, or clear the search to explore all available products.

                  </p>

                  {/* Button */}

                  <button
                    onClick={() => setProductSearch("")}
                    className="mt-10 rounded-2xl bg-gradient-to-r from-[#545333] to-[#6B6A45] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-[#45452A] hover:to-[#545333] hover:shadow-2xl"
                  >

                    View All Products

                  </button>

                </div>

            ) : (

              Object.entries(groupedProducts).map(
                ([category, list]) => (

                  <section
                    key={category}
                    id={category
                      .replace(/\s+/g, "-")
                      .toLowerCase()}
                  >

                    {/* Category Header */}

             <div className="mb-8 flex flex-col gap-4 border-b border-[#D9D7B6] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#D9D7B6]/40 px-4 py-2 text-sm font-semibold text-[#545333]">
                  Product Category
                </span>
                <h2 className="mt-4 text-3xl font-black text-[#545333] lg:text-4xl">
                  {category}
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#D9D7B6] bg-[#FCFAEF] px-5 py-3 font-semibold text-[#545333] shadow-sm">
                {list.length} Products
              </div>
            </div>
                    {/* Product List */}

                    <div className="space-y-8">

                      {list.map((product) => (

                        <div
                          key={product.uid}
                          id={product.slug}
                          className="bg-white rounded-[30px] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
                        >

                       <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_180px] gap-5 lg:gap-8 items-center">

  {/* Image */}

  <div className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-3xl border border-[#D9D7B6] bg-gradient-to-br from-[#FCFAEF] via-white to-[#ECE7D0] sm:h-[220px]">

    {/* Loading Skeleton */}

    {!loadedImages[product.uid] && (
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#ECE7D0] via-[#F7F5E8] to-white" />
    )}

    {/* Product Image */}

    <img
      src={
        product.images?.[0] ||
        product.image ||
        "/placeholder.jpg"
      }
      alt={product.title}
      loading="lazy"
      onLoad={() =>
        setLoadedImages((prev) => ({
          ...prev,
          [product.uid]: true,
        }))
      }
      onError={(e) => {
        e.currentTarget.src = "/placeholder.jpg";
      }}
      className={`relative z-10 max-h-[170px] w-auto max-w-[85%] object-contain p-4 transition-all duration-500 group-hover:scale-105 ${
        loadedImages[product.uid]
          ? "opacity-100"
          : "opacity-0"
      }`}
    />

    {/* Premium Badge */}

    <div className="absolute right-4 top-4 rounded-full bg-[#545333] px-3 py-1 text-xs font-semibold text-white shadow-lg">

      Premium

    </div>

  </div>

  {/* Content */}

  <div>

    {/* Product Title */}

    <h3 className="text-2xl font-black text-[#545333] lg:text-3xl">

      {product.title}

    </h3>

    {/* Description */}

    <p className="mt-5 leading-8 text-[#6A6954]">

      {product.description ||
        product.desc ||
        "Premium biomedical equipment designed for hospitals, laboratories, diagnostic centres and healthcare professionals."}

    </p>

    {/* Product Information */}

    <div className="mt-8 grid gap-4 md:grid-cols-2">

      {/* Brand */}

      <div className="rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] p-5 transition-all duration-300 hover:border-[#878672] hover:shadow-lg">

        <p className="text-xs font-semibold uppercase tracking-wider text-[#878672]">

          Brand

        </p>

        <p className="mt-2 text-lg font-bold text-[#545333]">

          {product.brand || "N/A"}

        </p>

      </div>

      {/* Model */}

      <div className="rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] p-5 transition-all duration-300 hover:border-[#878672] hover:shadow-lg">

        <p className="text-xs font-semibold uppercase tracking-wider text-[#878672]">

          Model

        </p>

        <p className="mt-2 text-lg font-bold text-[#545333]">

          {product.model || "N/A"}

        </p>

      </div>

      {/* Instrument */}

      <div className="rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] p-5 transition-all duration-300 hover:border-[#878672] hover:shadow-lg">

        <p className="text-xs font-semibold uppercase tracking-wider text-[#878672]">

          Instrument

        </p>

        <p className="mt-2 text-lg font-bold text-[#545333]">

          {product.instrument || "N/A"}

        </p>

      </div>

      {/* Category */}

      <div className="rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] p-5 transition-all duration-300 hover:border-[#878672] hover:shadow-lg">

        <p className="text-xs font-semibold uppercase tracking-wider text-[#878672]">

          Category

        </p>

        <p className="mt-2 text-lg font-bold text-[#545333]">

          {product.category || "N/A"}

        </p>

      </div>

    </div>

  </div>

  {/* Button */}

  <div className="flex justify-center lg:justify-end">

    <Link
      href={
        district
          ? `/${district}/items/${product.slug}`
          : `/items/${product.slug}`
      }
      onClick={() => {
        console.log("CLICKED");
        console.log("SLUG:", product.slug);
        console.log(
          "URL:",
          district
            ? `/${district}/items/${product.slug}`
            : `/items/${product.slug}`
        );
      }}
      className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#545333] to-[#6B6A45] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-[#45452A] hover:to-[#545333] hover:shadow-2xl"
    >

      View Details

      <svg
        className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>

    </Link>

  </div>

</div>

                        </div>

                      ))}

                    </div>

                  </section>

                ))
            )}

          </div>

        </div>

      </section>

      {/* Why Choose Products */}
<section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#FCFAEF] via-[#F7F5E8] to-[#ECE7D0]">

  {/* Background Glow */}

  <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#878672]/15 blur-[150px]" />

  <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#545333]/10 blur-[170px]" />

  <div className="container-custom relative">

    <SectionTitle
      badge="Why Choose Our Products"
      title="Trusted Quality & Innovation"
      description="We deliver premium biomedical and diagnostic equipment engineered for precision, reliability, and exceptional healthcare performance."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {[
        {
          icon: <ShieldCheck size={30} />,
          title: "Certified Quality",
          desc: "Manufactured and tested under strict international quality standards.",
        },
        {
          icon: <Truck size={30} />,
          title: "Fast Delivery",
          desc: "Safe and timely delivery with reliable logistics across India.",
        },
        {
          icon: <BadgeCheck size={30} />,
          title: "Trusted Support",
          desc: "Dedicated technical guidance and responsive after-sales service.",
        },
        {
          icon: <PackageCheck size={30} />,
          title: "Premium Equipment",
          desc: "Advanced biomedical solutions for hospitals and laboratories.",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group rounded-[32px] border border-[#D9D7B6] bg-white p-8 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#878672] hover:shadow-2xl"
        >

          {/* Icon */}

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#D9D7B6] to-[#FCFAEF] text-[#545333] transition-all duration-300 group-hover:bg-[#545333] group-hover:text-white">

            {item.icon}

          </div>

          {/* Title */}

          <h3 className="text-xl font-bold text-[#545333]">

            {item.title}

          </h3>

          {/* Description */}

          <p className="mt-4 leading-7 text-[#6A6954]">

            {item.desc}

          </p>

          {/* Bottom Line */}

          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-[#878672] transition-all duration-300 group-hover:w-20 group-hover:bg-[#545333]"></div>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* CTA */}

      {/* <CTASection /> */}

      {/* Back To Top */}

 {showTopButton && (

  <button
    onClick={scrollToTop}
    aria-label="Scroll to top"
    className="group fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#D9D7B6] bg-gradient-to-br from-[#545333] to-[#6B6A45] text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:shadow-2xl"
  >

    {/* Glow */}
    <span className="absolute inset-0 rounded-full bg-[#878672]/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

    <ChevronUp
      size={24}
      className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
    />

  </button>

)}

    </>

  );

}