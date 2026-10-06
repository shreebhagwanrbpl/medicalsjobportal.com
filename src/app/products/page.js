"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
// import CTASection from "@/components/CTASection";

export default function ProductsPage() {

  const products = [

    {
      category: "Electrolyte Reagents",
      title: "Roche 9180 Electrolyte Reagent",
      image: "/images/product-1.jpg",
      description:
        "High precision electrolyte reagent for Roche analyzers.",
      brand: "Roche",
      model: "9180",
      slug: "roche-9180-electrolyte-reagent",
    },

    {
      category: "Electrolyte Reagents",
      title: "ERBA EC 90 Reagent",
      image: "/images/product-2.jpg",
      description:
        "Premium quality electrolyte reagent.",
      brand: "ERBA",
      model: "EC90",
      slug: "erba-ec90",
    },

    {
      category: "Rapid Test Kits",
      title: "COVID Rapid Test Kit",
      image: "/images/product-3.jpg",
      description:
        "Fast and reliable rapid testing solution.",
      brand: "Bio",
      model: "RT-100",
      slug: "covid-kit",
    },

    {
      category: "Rapid Test Kits",
      title: "Dengue Rapid Kit",
      image: "/images/product-4.jpg",
      description:
        "High sensitivity dengue rapid test.",
      brand: "Bio",
      model: "DG200",
      slug: "dengue-kit",
    },

    {
      category: "Hematology",
      title: "Hematology Reagent",
      image: "/images/product-5.jpg",
      description:
        "Premium hematology solution.",
      brand: "Mindray",
      model: "BC5300",
      slug: "hematology",
    },

  ];

  const [search, setSearch] =
    useState("");

  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const filteredProducts =
    useMemo(() => {

      return products.filter((item) => {

        const text = `
        ${item.title}
        ${item.brand}
        ${item.category}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      });

    }, [search]);

  const groupedProducts =
    useMemo(() => {

      const obj = {};

      filteredProducts.forEach((item) => {

        if (!obj[item.category]) {

          obj[item.category] = [];

        }

        obj[item.category].push(item);

      });

      return obj;

    }, [filteredProducts]);

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

    setTimeout(() => {

      const el =
        document.getElementById(slug);

      if (el) {

        el.scrollIntoView({

          behavior: "smooth",

          block: "start",

        });

      }

    }, 250);

  };

  return (
    <>
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      <section className="py-24 bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#D1FAE5]">

        <div className="max-w-7xl mx-auto px-5">

          <SectionTitle
            badge="Featured Products"
            title="Premium Biomedical Equipment"
            description="Explore our comprehensive range of high-quality biomedical and diagnostic equipment designed to deliver precision, reliability, and advanced healthcare solutions for hospitals, laboratories, clinics, and research centers across India."
            center
          />
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 mt-16">

            {/* ======================
                LEFT SIDEBAR
          ====================== */}

            <aside className="sticky top-28 h-fit rounded-[32px] border border-[#D1FAE5] bg-white/85 p-6 shadow-2xl backdrop-blur">

              {/* Heading */}

              <div className="mb-6">

                <span className="inline-flex rounded-full border border-[#D1FAE5] bg-[#D1FAE5]/40 px-4 py-2 text-sm font-semibold text-[#15803D]">

                  Browse

                </span>

                <h2 className="mt-4 text-2xl font-bold text-[#15803D]">

                  Categories

                </h2>

              </div>

              {/* Search */}

              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] px-4 text-[#15803D] outline-none transition-all duration-300 placeholder:text-[#64748B] focus:border-[#15803D] focus:bg-white focus:ring-4 focus:ring-[#D1FAE5]"
              />

              {/* Categories */}

              <div className="mt-6 space-y-3">

                {categories.map((category) => (

                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-[#D1FAE5]"
                  >

                    <button
                      onClick={() => toggleCategory(category)}
                      className={`flex w-full items-center justify-between px-5 py-4 font-medium transition-all duration-300 ${activeCategory === category
                        ? "bg-[#15803D] text-[#ECFDF5] shadow-lg"
                        : "bg-white text-[#15803D] hover:bg-[#ECFDF5]"
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
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === category
                          ? "bg-white/20 text-[#ECFDF5]"
                          : "bg-[#D1FAE5] text-[#15803D]"
                          }`}
                      >

                        {groupedProducts[category].length}

                      </span>

                    </button>

                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight:
                          openedCategory === category
                            ? groupedProducts[category].length * 48 + "px"
                            : "0px",
                      }}
                    >

                      {groupedProducts[category].map((item) => (

                        <button
                          key={item.slug}
                          onClick={() => scrollToProduct(item.slug, category)}
                          className="block w-full border-t border-[#D1FAE5] px-6 py-3 text-left text-sm text-[#64748B] transition-all duration-300 hover:bg-[#ECFDF5] hover:text-[#15803D]"
                        >

                          {item.title}

                        </button>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </aside>

            {/* ======================
                RIGHT SIDE
          ====================== */}

            <div>

              <div className="space-y-16">

                {Object.entries(groupedProducts).map(([category, list]) => (

                  <section
                    key={category}
                    id={category.replace(/\s+/g, "-").toLowerCase()}
                  >

                    {/* Category Header */}

                    <div className="mb-10 flex items-center justify-between border-b border-[#D1FAE5] pb-5">

                      <div>

                        <span className="inline-flex rounded-full border border-[#D1FAE5] bg-[#D1FAE5]/40 px-4 py-2 text-sm font-semibold text-[#15803D]">

                          Category

                        </span>

                        <h2 className="mt-4 text-4xl font-black text-[#15803D]">

                          {category}

                        </h2>

                      </div>

                      <div className="rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-5 py-2 font-semibold text-[#15803D] shadow-sm">

                        {list.length} Products

                      </div>

                    </div>

                    {/* Products */}

                    <div className="space-y-8">

                      {list.map((product) => (

                        <div
                          key={product.slug}
                          id={product.slug}
                          className="group rounded-[32px] border border-[#D1FAE5] bg-white/85 p-7 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-[#15803D] hover:shadow-2xl"
                        >

                          <div className="grid items-center gap-8 lg:grid-cols-[250px_1fr_190px]">

                            {/* Image */}

                            <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-3xl border border-[#D1FAE5] bg-gradient-to-br from-[#ECFDF5] via-white to-[#D1FAE5]">

                              <Image
                                src={product.image}
                                alt={product.title}
                                width={220}
                                height={220}
                                className="max-h-[180px] object-contain transition-all duration-500 group-hover:scale-110"
                              />

                            </div>

                            {/* Content */}

                            <div>

                              <h3 className="text-2xl font-bold text-[#15803D] transition-colors duration-300 group-hover:text-[#ECFDF5]">

                                {product.title}

                              </h3>

                              <p className="mt-4 leading-8 text-[#64748B] transition-colors duration-300 group-hover:text-[#ECFDF5]/90">

                                {product.description}

                              </p>

                              <div className="mt-6 grid grid-cols-2 gap-4">

                                {/* Brand */}

                                <div className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-4 transition-all duration-300 group-hover:bg-[#64748B]">

                                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] group-hover:text-[#ECFDF5]">

                                    Brand

                                  </p>

                                  <p className="mt-2 font-bold text-[#15803D] group-hover:text-white">

                                    {product.brand}

                                  </p>

                                </div>

                                {/* Model */}

                                <div className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-4 transition-all duration-300 group-hover:bg-[#64748B]">

                                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] group-hover:text-[#ECFDF5]">

                                    Model

                                  </p>

                                  <p className="mt-2 font-bold text-[#15803D] group-hover:text-white">

                                    {product.model}

                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* Button */}

                            <div className="flex justify-center lg:justify-end">

                              <Link
                                href={`/products/${product.slug}`}
                                className="w-full lg:w-auto"
                              >

                                <button className="w-full rounded-xl bg-[#15803D] px-8 py-4 font-semibold text-[#ECFDF5] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#14532D] hover:shadow-xl lg:w-auto">

                                  View Details →

                                </button>

                              </Link>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </section>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
            WHY CHOOSE US
      =========================== */}

      <section className="py-24 bg-gradient-to-b from-white to-green-50">

        <div className="max-w-7xl mx-auto px-5">

          <SectionTitle
            badge="Why Choose Our Products"
            title="Trusted Quality & Innovation"
            description="Every biomedical product is engineered with precision, tested for quality, and backed by reliable support to ensure exceptional performance in hospitals and laboratories."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: <ShieldCheck size={32} />,
                title: "Certified Quality",
                desc: "Every product undergoes strict quality testing to ensure safety, durability and reliable performance.",
              },

              {
                icon: <Truck size={32} />,
                title: "Fast Delivery",
                desc: "Quick and secure delivery across India with safe packaging and timely logistics support.",
              },

              {
                icon: <BadgeCheck size={32} />,
                title: "Trusted Support",
                desc: "Dedicated technical assistance and after-sales service whenever you need expert guidance.",
              },

              {
                icon: <PackageCheck size={32} />,
                title: "Premium Equipment",
                desc: "Advanced biomedical equipment designed for modern laboratories, hospitals and healthcare professionals.",
              },

            ].map((item, index) => (

              <div
                key={index}
                className="group rounded-[30px] border border-green-100 bg-white p-8 text-center shadow-lg shadow-green-100 transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-2xl hover:shadow-green-200"
              >

                {/* Icon */}

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white">

                  {item.icon}

                </div>

                {/* Title */}

                <h3 className="text-2xl font-bold text-slate-900">

                  {item.title}

                </h3>

                {/* Description */}

                <p className="mt-4 leading-7 text-slate-600">

                  {item.desc}

                </p>

                {/* Bottom Line */}

                <div className="mx-auto mt-8 h-1 w-14 rounded-full bg-green-500 transition-all duration-300 group-hover:w-24"></div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      {/* <CTASection /> */}

    </>

  );

}