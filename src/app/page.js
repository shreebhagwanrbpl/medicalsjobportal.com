"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, getDoc } from "@/lib/client-api";
import { db } from "@/lib/client-api";
import { fetchFullCatalog } from "@/lib/data-fetcher";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  Wrench,
  Activity,
  Truck,
  Headphones,
} from "lucide-react";

/* ==========================================================
   HOME PRODUCT CARD
========================================================== */

function HomeProductCard({
  product,
  district = null,
}) {
  if (!product) return null;

  const slug =
    product.slug ||
    product.productSlug ||
    product.title
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const productLink = district
    ? `/${district}/items/${slug}`
    : `/items/${slug}`;

  let imageUrl = "/placeholder.png";

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      imageUrl = firstImage;
    } else if (firstImage?.url) {
      imageUrl = firstImage.url;
    } else if (firstImage?.src) {
      imageUrl = firstImage.src;
    }
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (product.imageURL) {
    imageUrl = product.imageURL;
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-100">

      {/* IMAGE */}

      <Link href={productLink}>
        <div className="relative flex h-[250px] items-center justify-center overflow-hidden bg-green-50 p-6">

          <Image
            src={imageUrl}
            alt={
              product.title ||
              "Biomedical Equipment"
            }
            width={500}
            height={400}
            unoptimized
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />

        </div>
      </Link>

      {/* PRODUCT DETAILS */}

      <div className="flex flex-1 flex-col p-6">

        <Link href={productLink}>
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-slate-900 transition-colors duration-300 group-hover:text-green-600">
            {product.title ||
              "Biomedical Equipment"}
          </h3>
        </Link>

        {/* BRAND + MODEL */}

        <div className="mt-5 space-y-2">

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Brand:
            </span>

            <span className="line-clamp-1 text-sm font-semibold text-green-700">
              {product.brand || "N/A"}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Model:
            </span>

            <span className="line-clamp-1 text-sm font-medium text-slate-700">
              {product.model || "N/A"}
            </span>

          </div>

        </div>

        {/* BUTTON */}

        <div className="mt-auto pt-6">

          <Link
            href={productLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold !text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-200"
          >

            <span className="!text-white">
              View Details
            </span>

            <ArrowRight
              size={17}
              className="!text-white"
            />

          </Link>

        </div>

      </div>

    </div>
  );
}


/* ==========================================================
   HOME PAGE
========================================================== */

export default function HomePage() {

  const pathname = usePathname();

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] =
    useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });


  /* ========================================================
     CITY / DISTRICT
  ======================================================== */

  const pathParts =
    pathname?.split("/").filter(Boolean) || [];

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const currentDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const currentCity = currentDistrict
    ? currentDistrict
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
    : "";


  /* ========================================================
     LINK HANDLER
  ======================================================== */

  const makeLink = (path) => {

    if (!currentDistrict) {
      return path;
    }

    if (path === "/") {
      return `/${currentDistrict}`;
    }

    return `/${currentDistrict}${path}`;
  };


  /* ========================================================
     LOAD HERO DATA
  ======================================================== */

  useEffect(() => {

    const loadHero = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "medicalsjobportalcom",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }

      } catch (error) {

        console.error(
          "Hero data error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadHero();

  }, []);


  /* ========================================================
     LOAD SERVICES + PRODUCTS
  ======================================================== */

  useEffect(() => {

    const loadHomeData = async () => {

      try {

        /* SERVICES */

        const serviceSnap = await getDoc(
          doc(
            db,
            "websites",
            "medicalsjobportalcom",
            "pages",
            "services"
          )
        );

        if (serviceSnap.exists()) {

          const serviceData =
            serviceSnap.data();

          setServices(
            Array.isArray(
              serviceData.services
            )
              ? serviceData.services
              : []
          );

        }


        /* PRODUCTS */

        const allProducts =
          await fetchFullCatalog();

        const normalizedProducts =
          Array.isArray(allProducts)
            ? allProducts.map((product) => ({
              ...product,

              slug:
                product.slug ||
                product.productSlug ||
                product.title
                  ?.toLowerCase()
                  .trim()
                  .replace(
                    /[^a-z0-9\s-]/g,
                    ""
                  )
                  .replace(
                    /\s+/g,
                    "-"
                  ),
            }))
            : [];

        setProducts(
          normalizedProducts
        );

      } catch (error) {

        console.error(
          "Home data error:",
          error
        );

      } finally {

        setProductsLoading(false);

      }

    };

    loadHomeData();

  }, []);


  /* ========================================================
     ONLY 3 PRODUCTS
  ======================================================== */

  const featuredProducts = products
    .filter(
      (product) =>
        product &&
        product.title
    )
    .slice(0, 3);


  /* ========================================================
     ONLY 3 SERVICES
  ======================================================== */

  const featuredServices = services
    .filter(Boolean)
    .slice(0, 3);


  /* ========================================================
     SERVICE ICONS
  ======================================================== */

  const serviceIcons = [
    <Microscope
      key="microscope"
      size={30}
    />,
    <FlaskConical
      key="flask"
      size={30}
    />,
    <ShieldCheck
      key="shield"
      size={30}
    />,
    <Stethoscope
      key="stethoscope"
      size={30}
    />,
    <Wrench
      key="wrench"
      size={30}
    />,
    <Activity
      key="activity"
      size={30}
    />,
  ];


  return (
    <>

      {/* ====================================================
    HERO BANNER
==================================================== */}

      <section className="bg-white px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">

        <div
          className="
      relative
      mx-auto
      max-w-[1500px]
      overflow-hidden
      rounded-[28px]
      sm:rounded-[34px]
      lg:rounded-[40px]
      min-h-[420px]
      sm:min-h-[460px]
      lg:min-h-[500px]
    "
        >

          {/* =================================================
        BANNER IMAGE
    ================================================= */}

          <Image
            src="/home.png"
            alt="Modern Laboratory Equipment"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />


          {/* =================================================
        IMAGE OVERLAY
    ================================================= */}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />


          {/* =================================================
        GREEN DECORATIVE CIRCLE
    ================================================= */}

          <div
            className="
        absolute
        -right-24
        -top-32
        h-[360px]
        w-[360px]
        rounded-full
        border-[60px]
        border-green-600/90
        opacity-90
      "
          />

          <div
            className="
        absolute
        -right-40
        -bottom-40
        h-[360px]
        w-[360px]
        rounded-full
        border-[45px]
        border-green-500/50
      "
          />


          {/* =================================================
        CONTENT AREA
    ================================================= */}

          <div
            className="
        relative
        z-10
        flex
        min-h-[420px]
        items-center
        sm:min-h-[460px]
        lg:min-h-[500px]
      "
          >

            <div className="container-custom w-full">

              <motion.div
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="max-w-3xl"
              >

                {/* =================================================
              BADGE
          ================================================= */}

                <div
                  className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              backdrop-blur-md
              sm:px-5
              sm:py-2.5
              sm:text-sm
            "
                >

                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                  Biomedical & Diagnostic Solutions

                </div>


                {/* =================================================
              TITLE
          ================================================= */}

                {loading ? (

                  <div className="space-y-3 animate-pulse">

                    <div className="h-11 w-[90%] rounded-xl bg-white/20 sm:h-12" />

                    <div className="h-11 w-[75%] rounded-xl bg-white/20 sm:h-12" />

                  </div>

                ) : (

                  <h1
                    className="
                max-w-3xl
                text-3xl
                font-black
                leading-[1.05]
                tracking-tight
                text-white
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
              "
                  >

                    {heroData.title ||
                      "Advanced Biomedical Solutions For Modern Healthcare"}

                  </h1>

                )}


                {/* =================================================
              CITY
          ================================================= */}

                {currentCity && (

                  <p
                    className="
                mt-3
                text-lg
                font-bold
                text-green-300
                sm:text-xl
              "
                  >

                    Serving Healthcare Professionals in{" "}
                    {currentCity}

                  </p>

                )}


                {/* =================================================
              DESCRIPTION
          ================================================= */}

                <p
                  className="
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-slate-200
              sm:text-base
              sm:leading-7
            "
                >

                  {heroData.description ||
                    "Reliable biomedical equipment, laboratory solutions and professional support for hospitals, laboratories and healthcare institutions."}

                </p>


                {/* =================================================
              BUTTONS
          ================================================= */}

                <div className="mt-6 flex flex-wrap gap-3">

                  {/* BUTTON 1 */}

                  <Link
                    href={makeLink("/items")}
                    className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-green-600
                px-6
                py-3
                text-sm
                font-semibold
                !text-white
                shadow-lg
                shadow-green-950/30
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-green-500
              "
                  >

                    <span className="!text-white">
                      {heroData.button1Text ||
                        "Explore Products"}
                    </span>

                    <ArrowRight
                      size={17}
                      className="!text-white"
                    />

                  </Link>


                  {/* BUTTON 2 */}

                  <Link
                    href={makeLink("/contact")}
                    className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/40
                bg-white/10
                px-6
                py-3
                text-sm
                font-semibold
                !text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-white
                hover:!text-black
              "
                  >

                    <span className="!text-white transition-colors duration-300 hover:!text-black">
                      {heroData.button2Text ||
                        "Contact Us"}
                    </span>

                  </Link>

                </div>


                {/* =================================================
              STATS
          ================================================= */}

                <div
                  className="
              mt-6
              flex
              flex-wrap
              gap-6
              sm:gap-10
            "
                >

                  {/* STAT 1 */}

                  <div>

                    <p className="text-xl font-black text-white sm:text-2xl">
                      5000+
                    </p>

                    <p className="mt-0.5 text-xs text-slate-300">
                      Happy Clients
                    </p>

                  </div>


                  <div className="hidden h-10 w-px bg-white/20 sm:block" />


                  {/* STAT 2 */}

                  <div>

                    <p className="text-xl font-black text-white sm:text-2xl">
                      3500+
                    </p>

                    <p className="mt-0.5 text-xs text-slate-300">
                      Products
                    </p>

                  </div>


                  <div className="hidden h-10 w-px bg-white/20 sm:block" />


                  {/* STAT 3 */}

                  <div>

                    <p className="text-xl font-black text-white sm:text-2xl">
                      10+
                    </p>

                    <p className="mt-0.5 text-xs text-slate-300">
                      Years Experience
                    </p>

                  </div>

                </div>

              </motion.div>

            </div>

          </div>


          {/* =================================================
        TRUSTED QUALITY CARD
    ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.5,
            }}
            className="
        absolute
        bottom-4
        right-4
        z-20
        hidden
        rounded-xl
        border
        border-white/20
        bg-white/10
        px-4
        py-3
        backdrop-blur-xl
        lg:block
      "
          >

            <div className="flex items-center gap-3">

              <div
                className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-green-600
          "
              >

                <ShieldCheck
                  size={19}
                  className="text-white"
                />

              </div>


              <div>

                <p className="text-xs font-bold text-white">
                  Trusted Quality
                </p>

                <p className="text-[10px] text-slate-300">
                  Reliable Laboratory Solutions
                </p>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ====================================================
          TRUST
      ==================================================== */}

      <section className="bg-white py-20">

        <div className="container-custom">

          <div className="text-center">

            <span className="rounded-full bg-green-50 px-5 py-2 text-sm font-semibold text-green-700">
              TRUSTED ACROSS INDIA
            </span>

            <h2 className="mt-5 text-4xl font-black text-slate-900">
              Trusted By Hospitals, Laboratories & Healthcare Professionals
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-600">
              Delivering reliable biomedical equipment with quality,
              innovation and professional service support.
            </p>

          </div>


          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                number: "5000+",
                title: "Happy Clients",
                icon: Building2,
              },
              {
                number: "3500+",
                title: "Products",
                icon: Microscope,
              },
              {
                number: "10+",
                title: "Years Experience",
                icon: ShieldCheck,
              },
              {
                number: "24/7",
                title: "Support",
                icon: Truck,
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.15,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="group rounded-3xl border border-green-100 bg-green-50 p-8 transition duration-300 hover:-translate-y-2 hover:bg-green-600 hover:text-white"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">

                    <Icon
                      size={30}
                      className="text-green-600"
                    />

                  </div>

                  <h3 className="mt-8 text-5xl font-black">
                    {item.number}
                  </h3>

                  <p className="mt-3 text-slate-600 group-hover:text-white">
                    {item.title}
                  </p>

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>


      {/* ====================================================
          FEATURED PRODUCTS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="Featured Products"
            title="Popular Biomedical Equipment"
            description="Explore selected biomedical and diagnostic equipment from our complete product catalog."
            center
          />


          {/* LOADING */}

          {productsLoading ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {Array.from({
                length: 3,
              }).map((_, index) => (

                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-md"
                >

                  <div className="h-[250px] bg-green-50" />

                  <div className="p-6">

                    <div className="h-7 w-4/5 rounded bg-green-50" />

                    <div className="mt-5 h-4 w-3/5 rounded bg-green-50" />

                    <div className="mt-3 h-4 w-2/3 rounded bg-green-50" />

                    <div className="mt-6 h-12 w-full rounded-xl bg-green-50" />

                  </div>

                </div>

              ))}

            </div>

          ) : featuredProducts.length > 0 ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {featuredProducts.map(
                (product) => (

                  <HomeProductCard
                    key={
                      product.uid ||
                      product.slug ||
                      product.id ||
                      product.title
                    }
                    product={product}
                    district={
                      currentDistrict ||
                      null
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="mt-16 rounded-[30px] border border-green-100 bg-green-50 p-12 text-center">

              <p className="text-lg font-semibold text-slate-600">
                No products found in the catalog.
              </p>

            </div>

          )}


          {/* VIEW ALL */}

          <div className="mt-14 text-center">

            <Link
              href={makeLink("/items")}
              className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold !text-white transition hover:bg-green-700"
            >

              <span className="!text-white">
                View All Products
              </span>

              <ArrowRight
                size={18}
                className="!text-white"
              />

            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          WHY CHOOSE US
      ==================================================== */}

      <section className="section-padding bg-green-50">

        <div className="container-custom">

          <SectionTitle
            badge="Why Choose Us"
            title="Reliable Solutions For Modern Healthcare"
            description="We combine quality biomedical equipment with professional guidance and dependable customer support."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: (
                  <ShieldCheck
                    size={30}
                  />
                ),
                title:
                  "Quality Equipment",
                description:
                  "Reliable biomedical products selected for healthcare and laboratory applications.",
              },
              {
                icon: (
                  <Truck
                    size={30}
                  />
                ),
                title:
                  "Delivery Support",
                description:
                  "Professional coordination for smooth and dependable product delivery.",
              },
              {
                icon: (
                  <Wrench
                    size={30}
                  />
                ),
                title:
                  "Technical Assistance",
                description:
                  "Practical guidance and support for equipment-related requirements.",
              },
              {
                icon: (
                  <Activity
                    size={30}
                  />
                ),
                title:
                  "Healthcare Focus",
                description:
                  "Solutions designed around real laboratory and diagnostic workflows.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-[30px] border border-green-100 bg-white p-8 text-center shadow-lg shadow-green-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          WORKING PROCESS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="How We Work"
            title="Simple & Professional Process"
            description="We follow a streamlined process to deliver reliable biomedical and healthcare solutions with precision and excellence."
            center
          />


          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {[
              {
                step: "01",
                title:
                  "Consultation",
                desc:
                  "Understanding healthcare requirements, laboratory needs and recommending the most suitable biomedical solutions.",
              },
              {
                step: "02",
                title:
                  "Implementation",
                desc:
                  "Supplying, installing and configuring biomedical equipment with complete technical guidance.",
              },
              {
                step: "03",
                title:
                  "Support",
                desc:
                  "Providing ongoing maintenance, expert assistance and after-sales support for long-term reliability.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[30px] border border-green-100 bg-white p-8 shadow-lg shadow-green-100 transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-2xl hover:shadow-green-200"
                >

                  <span className="text-6xl font-black text-green-100 transition group-hover:text-green-200">
                    {item.step}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {item.desc}
                  </p>

                  <div className="mt-8 h-1 w-16 rounded-full bg-green-500 transition-all duration-300 group-hover:w-24" />

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          AFTER SALES SUPPORT
      ==================================================== */}

      <section className="section-padding bg-gradient-to-b from-white to-green-50">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <span className="inline-block rounded-full border border-green-100 bg-green-50 px-5 py-2 font-semibold text-green-700">
                After-Sales Support
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Support That Continues After Installation
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Biomedical equipment requires proper coordination, maintenance and technical attention throughout its working life. Our support approach is designed to help healthcare facilities maintain dependable equipment performance.
              </p>


              <div className="mt-8 space-y-5">

                {[
                  "Installation and setup coordination",
                  "Equipment usage and application guidance",
                  "Maintenance assistance and technical coordination",
                  "Product-related troubleshooting support",
                  "Ongoing communication with healthcare teams",
                ].map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >

                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">

                        <ShieldCheck
                          size={15}
                        />

                      </div>

                      <p className="leading-7 text-slate-700">
                        {item}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="rounded-[35px] border border-green-100 bg-white p-8 shadow-xl shadow-green-100 md:p-10">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200">

                <Headphones
                  size={30}
                />

              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900">
                Need Help With Your Biomedical Equipment?
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Whether you are planning a new laboratory setup, replacing existing equipment or looking for technical assistance, our team can help you understand the available options.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-green-50 p-5">

                  <p className="text-sm font-semibold text-green-700">
                    Equipment
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Product Guidance
                  </p>

                </div>


                <div className="rounded-2xl bg-green-50 p-5">

                  <p className="text-sm font-semibold text-green-700">
                    Support
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Technical Assistance
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          FINAL CONTENT
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom max-w-5xl">

          <div className="rounded-[35px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50 p-8 text-center shadow-lg shadow-green-100 md:p-12">

            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              A Reliable Partner For Biomedical Solutions
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              From laboratory requirements and diagnostic equipment to installation coordination and ongoing assistance, we focus on delivering practical solutions that support efficient healthcare operations.
            </p>


            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-green-700 shadow-sm ring-1 ring-green-100">
                Biomedical Equipment
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-green-700 shadow-sm ring-1 ring-green-100">
                Laboratory Solutions
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-green-700 shadow-sm ring-1 ring-green-100">
                Technical Support
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-green-700 shadow-sm ring-1 ring-green-100">
                Healthcare Solutions
              </span>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}