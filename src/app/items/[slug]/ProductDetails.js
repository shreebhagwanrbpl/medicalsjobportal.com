"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
export default function ProductDetails({ slug }) {
    const [product, setProduct] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);

    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] =
        useState(false);
    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const city =
        pathParts.length > 1
            ? pathParts[0]
            : "India";

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {

                // NORMAL PRODUCTS
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "centralbiomedicals",
                        "pages",
                        "products"
                    )
                );

                let allProducts = [];

                if (snap.exists()) {
                    allProducts = (snap.data().products || []).map((item) => ({
                        ...item,
                        slug:
                            item.slug ||
                            item.productSlug ||
                            makeSlug(item.title),
                    }));
                }

                // CATEGORY PRODUCTS
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

                categorySnap.forEach((docSnap) => {
                    const data = docSnap.data();

                    if (data.products?.length) {
                        allProducts.push(
                            ...(data.products || []).map((item) => ({
                                ...item,
                                slug:
                                    item.slug ||
                                    item.productSlug ||
                                    makeSlug(item.title),
                            }))
                        );
                    }
                });

                const found = allProducts.find(
                    (p) => p.slug === slug
                );
                console.log("URL SLUG:", slug);

                allProducts.forEach((p) => {
                    console.log("PRODUCT:", p.title);
                    console.log("PRODUCT SLUG:", p.slug);
                });
                console.log("SLUG FROM URL:", slug);
                console.log(
                    "TOTAL PRODUCTS:",
                    allProducts.length
                );
                console.log(
                    "FOUND PRODUCT:",
                    found
                );

                setProduct(found || null);

                if (found) {

                    if (
                        found.images?.length > 0
                    ) {
                        setSelectedImage(
                            found.images[0]
                        );
                    } else {
                        setSelectedImage(
                            found.image || ""
                        );
                    }

                    setSelectedMedia("image");
                }

            } catch (error) {
                console.error(error);
            }
        };

        loadProduct();
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error(
                "Name is required"
            );
        }

        if (!emailRegex.test(form.email)) {
            return toast.error(
                "Enter valid email"
            );
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error(
                "Enter valid mobile number"
            );
        }

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "centralbiomedicals",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success(
                "Your enquiry has been submitted successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };
    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name: product.brand || "Central Biomedicals",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
        );
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram direct sharing available nahi hai. Link copied.");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
            });
        } else {
            setShowShare(!showShare);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);
    }, []);

    if (!product) {
        return (
         <section className="relative overflow-hidden py-10 md:py-20 bg-gradient-to-br from-[#FCFAEF] via-[#F7F5E8] to-[#ECE7D0]">

  {/* Background Glow */}

  <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#878672]/15 blur-[150px]" />

  <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#545333]/10 blur-[170px]" />

  <div className="container-custom relative">

    {/* Hero Skeleton */}

    <div className="grid gap-12 lg:grid-cols-2">

      <div className="h-[420px] rounded-[36px] border border-[#D9D7B6] bg-white p-5 shadow-xl">

        <div className="h-full w-full animate-pulse rounded-[28px] bg-[#D9D7B6]" />

      </div>

      <div>

        <div className="mb-8 h-12 w-3/4 animate-pulse rounded-xl bg-[#D9D7B6]" />

        {[...Array(8)].map((_, i) => (

          <div
            key={i}
            className="mb-4 h-6 animate-pulse rounded-lg bg-[#D9D7B6]/80"
          />

        ))}

      </div>

    </div>

    {/* Bottom Cards */}

    <div className="mt-16 grid gap-8 lg:grid-cols-[600px_1fr]">

      {/* Left Card */}

      <div className="rounded-[32px] border border-[#D9D7B6] bg-white p-6 shadow-xl md:p-8">

        <div className="mb-6 h-10 w-48 animate-pulse rounded-lg bg-[#D9D7B6]" />

        {[...Array(4)].map((_, i) => (

          <div
            key={i}
            className="mb-4 h-14 animate-pulse rounded-2xl bg-[#D9D7B6]/80"
          />

        ))}

      </div>

      {/* Right Card */}

      <div className="rounded-[32px] border border-[#D9D7B6] bg-white p-6 shadow-xl md:p-8">

        <div className="mb-6 h-10 w-60 animate-pulse rounded-lg bg-[#D9D7B6]" />

        {[...Array(6)].map((_, i) => (

          <div
            key={i}
            className="mb-4 h-5 animate-pulse rounded bg-[#D9D7B6]/80"
          />

        ))}

      </div>

    </div>

  </div>

</section>
        );
    }
    return (
        <section className="py-10 md:py-20 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
            <div className="container-custom">
                <div className="mb-6 text-sm text-[#878672]">
                    Home / Products / {product.title}
                </div>
                {/* Top Section */}

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Image */}

               <div>

  <div className="relative h-[340px] overflow-hidden rounded-[28px] border border-[#D9D7B6] bg-gradient-to-br from-[#FCFAEF] via-white to-[#ECE7D0] shadow-[0_25px_80px_rgba(84,83,51,0.18)] sm:h-[420px] md:h-[500px] lg:h-[580px]">

    {/* Premium Badge */}

    <div className="absolute left-5 top-5 z-20 rounded-full bg-[#545333] px-4 py-2 text-xs font-semibold text-white shadow-lg">

      Premium Quality

    </div>

    {selectedMedia === "video" && product.video ? (

      <video
        controls
        autoPlay
        className="h-full w-full object-contain p-6"
      >
        <source
          src={product.video}
          type="video/mp4"
        />
      </video>

    ) : (

      <>

        {/* Loading Skeleton */}

        {!imageLoaded && (

          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ECE7D0] via-[#F7F5E8] to-white animate-pulse">

            <div className="h-20 w-20 animate-spin rounded-full border-4 border-[#D9D7B6] border-t-[#545333]"></div>

          </div>

        )}

        {/* Product Image */}

        <Image
          src={selectedImage || product.image}
          alt={product.title}
          fill
          priority
          onLoad={() => setImageLoaded(true)}
          className={`object-contain p-6 transition-all duration-500 hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

      </>

    )}

  </div>

  {/* Thumbnails */}

  <div className="mt-6 flex flex-wrap gap-4">

    {(product.images?.length
      ? product.images
      : [product.image]
    ).map((img, index) => (

      <button
        key={index}
        onClick={() => {
          setSelectedImage(img);
          setSelectedMedia("image");
        }}
        className={`group relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg

        ${
          selectedMedia === "image" &&
          selectedImage === img
            ? "border-[#545333] shadow-lg"
            : "border-[#D9D7B6] hover:border-[#878672]"
        }`}
      >

        <Image
          src={img}
          alt={`Thumbnail ${index + 1}`}
          width={80}
          height={80}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

      </button>

    ))}

    {/* Video */}

    {product.video && (

      <button
        onClick={() => setSelectedMedia("video")}
        className={`group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg

        ${
          selectedMedia === "video"
            ? "border-[#545333] bg-[#FCFAEF] shadow-lg"
            : "border-[#D9D7B6] hover:border-[#878672] hover:bg-[#FCFAEF]"
        }`}
      >

        <FaPlay
          size={20}
          className="text-[#545333]"
        />

        <span className="mt-2 text-xs font-medium text-[#545333]">

          Video

        </span>

      </button>

    )}

    {/* PDF */}

    {product.pdf && (

      <a
        href={product.pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-[#D9D7B6] transition-all duration-300 hover:-translate-y-1 hover:border-[#878672] hover:bg-[#FCFAEF] hover:shadow-lg"
      >

        <span className="text-2xl">

          📄

        </span>

        <span className="mt-2 text-xs font-medium text-[#545333]">

          PDF

        </span>

      </a>

    )}

  </div>

</div>

                    {/* Product Details */}

                    <div>

                       <div className="relative flex items-start justify-between gap-4">

  {/* Product Title */}

  <div>

    <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#ECE7D0]/60 px-4 py-2 text-sm font-semibold text-[#545333]">

      Premium Biomedical Equipment

    </span>

    <h1 className="mt-4 text-2xl font-black leading-tight text-[#545333] sm:text-3xl md:text-4xl lg:text-5xl">

      {product.title}

    </h1>

  </div>

  {/* Share */}

  <div
    ref={shareRef}
    className="relative flex-shrink-0"
  >

    <button
      onClick={handleNativeShare}
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D7B6] bg-white text-[#545333] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#878672] hover:bg-[#FCFAEF] hover:shadow-xl"
      aria-label="Share Product"
    >

      <FaShareAlt
        size={18}
        className="transition-transform duration-300 group-hover:rotate-12"
      />

    </button>

    {showShare && (

      <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-[#D9D7B6] bg-white shadow-2xl">

        <button
          onClick={handleCopy}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#545333] transition hover:bg-[#FCFAEF]"
        >

          <FaLink className="text-[#878672]" />

          Copy Link

        </button>

        <button
          onClick={handleWhatsapp}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#545333] transition hover:bg-[#FCFAEF]"
        >

          <FaWhatsapp className="text-[#25D366]" />

          WhatsApp

        </button>

        <button
          onClick={handleFacebook}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#545333] transition hover:bg-[#FCFAEF]"
        >

          <FaFacebook className="text-[#1877F2]" />

          Facebook

        </button>

        <button
          onClick={handleInstagram}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#545333] transition hover:bg-[#FCFAEF]"
        >

          <FaInstagram className="text-[#E4405F]" />

          Instagram

        </button>

      </div>

    )}

  </div>

</div>

                      <div className="mt-6 rounded-[32px] border border-[#D9D7B6] bg-white/90 p-6 shadow-[0_20px_60px_rgba(84,83,51,0.12)] backdrop-blur md:mt-8 md:p-8">

  {/* Heading */}

  <div className="mb-8 flex items-center gap-3">

    <div className="h-10 w-2 rounded-full bg-[#545333]" />

    <h3 className="text-2xl font-black text-[#545333]">

      Product Specifications

    </h3>

  </div>

  {/* Specification Grid */}

  <div className="grid gap-5 sm:grid-cols-2">

    {[
      {
        label: "Brand",
        value: product.brand || "N/A",
      },
      {
        label: "Model",
        value: product.model || "N/A",
      },
      {
        label: "Instrument",
        value: product.instrument || "N/A",
      },
      {
        label: "Capacity",
        value: product.capacity || "N/A",
      },
      {
        label: "Throughput",
        value: product.throughput || "N/A",
      },
      {
        label: "Usage",
        value: product.usage || "N/A",
      },
      {
        label: "Automation",
        value: product.automation || "N/A",
      },
      {
        label: "Availability",
        value: product.availability || "N/A",
      },
    ].map((item, index) => (

      <div
        key={index}
        className="group rounded-2xl border border-[#D9D7B6] bg-gradient-to-br from-[#FCFAEF] via-white to-[#ECE7D0] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#878672] hover:shadow-xl"
      >

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#878672]">

          {item.label}

        </p>

        <p className="mt-3 text-lg font-bold text-[#545333] break-words">

          {item.value}

        </p>

      </div>

    ))}

  </div>

</div>

                    </div>

                </div>

                {/* Description + Form */}

                <div className="mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-6 md:gap-8">

                        {/* Quote Form */}

                     <div className="h-fit rounded-[32px] border border-[#D9D7B6] bg-white/90 p-5 shadow-[0_20px_60px_rgba(84,83,51,0.12)] backdrop-blur lg:sticky lg:top-24 sm:p-6 md:p-8">

  {/* Header */}

  <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#ECE7D0]/60 px-4 py-2 text-sm font-semibold text-[#545333]">

    Quick Enquiry

  </span>

  <h2 className="mt-5 text-2xl font-black text-[#545333] md:text-3xl">

    Request A Quote

  </h2>

  <p className="mt-3 leading-7 text-[#6A6954]">

    Product:

    <span className="ml-2 font-semibold text-[#545333]">

      {product.title}

    </span>

  </p>

  {/* Form */}

  <form
    onSubmit={handleSubmit}
    className="mt-8 space-y-5"
  >

    {/* Name */}

    <input
      type="text"
      placeholder="Your Name"
      value={form.name}
      onChange={(e) =>
        setForm({
          ...form,
          name: e.target.value,
        })
      }
      className="w-full rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:bg-white focus:ring-4 focus:ring-[#D9D7B6]"
    />

    {/* Email */}

    <input
      type="email"
      placeholder="Email Address"
      value={form.email}
      onChange={(e) =>
        setForm({
          ...form,
          email: e.target.value,
        })
      }
      className="w-full rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:bg-white focus:ring-4 focus:ring-[#D9D7B6]"
    />

    {/* Phone */}

    <input
      type="tel"
      placeholder="Phone Number"
      maxLength={10}
      value={form.phone}
      onChange={(e) =>
        setForm({
          ...form,
          phone: e.target.value.replace(/\D/g, ""),
        })
      }
      className="w-full rounded-2xl border border-[#D9D7B6] bg-[#FCFAEF] px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:bg-white focus:ring-4 focus:ring-[#D9D7B6]"
    />

    {/* Submit Button */}

    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-2xl bg-[#545333] py-4 font-semibold text-[#FDFBD4] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#45452A] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
    >

      {submitting ? "Submitting..." : "Get Quote"}

    </button>

  </form>

</div>
                        {/* Description */}

                        <div className="rounded-[32px] border border-[#D9D7B6] bg-white p-5 shadow-xl shadow-[#D9D7B6] sm:p-6 md:p-10">

                            {/* Header */}

                          <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#ECE7D0]/60 px-4 py-2 text-sm font-semibold text-[#545333]">

    Product Details

</span>

<h3 className="mt-5 text-2xl font-black text-[#545333] md:text-3xl">

    Product Description

</h3>

<p className="mt-6 text-base leading-8 text-[#6A6954] md:text-lg md:leading-9">

    {product.desc ||
        product.description ||
        "No description available."}

</p>

                            {/* Specifications */}

                          <div className="mt-10 overflow-x-auto rounded-[28px] border border-[#D9D7B6] bg-white shadow-[0_15px_40px_rgba(84,83,51,0.08)]">

  <table className="w-full border-collapse">

    <tbody>

      {[
        {
          label: "Brand",
          value: product.brand || "N/A",
        },
        {
          label: "Model",
          value: product.model || "N/A",
        },
        {
          label: "Usage",
          value: product.usage || "N/A",
        },
        {
          label: "Automation",
          value: product.automation || "N/A",
        },
        {
          label: "Capacity",
          value: product.capacity || "N/A",
        },
        {
          label: "Throughput",
          value: product.throughput || "N/A",
        },
      ].map((item, index) => (

        <tr
          key={index}
          className="border-b border-[#D9D7B6] last:border-b-0 transition-all duration-300 hover:bg-[#FCFAEF]"
        >

          <td className="w-1/3 bg-gradient-to-r from-[#FCFAEF] to-[#ECE7D0] px-5 py-4 font-semibold text-[#545333]">

            {item.label}

          </td>

          <td className="px-5 py-4 font-medium text-[#6A6954]">

            {item.value}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>


                            {/* SEO Content */}
<div className="mt-12 rounded-[32px] border border-[#D9D7B6] bg-white/90 p-6 shadow-[0_20px_60px_rgba(84,83,51,0.10)] backdrop-blur md:p-10">

    {/* Badge */}

    <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#ECE7D0]/60 px-4 py-2 text-sm font-semibold text-[#545333]">

        Product Information

    </span>

    {/* Content */}

    <div className="mt-8 space-y-8">

        {[
            {
                title: `Why Choose Central Biomedicals in ${cityName}?`,
                content: `Central Biomedicals is a trusted supplier and distributor of ${product.title} in ${cityName}. We provide high-quality biomedical and laboratory equipment for hospitals, pathology laboratories, diagnostic centres and healthcare facilities.`,
            },
            {
                title: `Features of ${product.title}`,
                content: `${product.title} offers reliable performance, accurate results, user-friendly operation, long service life and efficient workflow for laboratories, hospitals and healthcare professionals.`,
            },
            {
                title: `Applications of ${product.title}`,
                content: `Widely used in hospitals, pathology laboratories, diagnostic centres, blood banks, research institutes and healthcare facilities for accurate and efficient diagnostics.`,
            },
            {
                title: `${product.title} Supplier in ${cityName}`,
                content: `Central Biomedicals supplies ${product.title} in ${cityName} with expert consultation, installation support, technical guidance and dependable after-sales service.`,
            },
            {
                title: `${product.title} Dealer in ${cityName}`,
                content: `We are a trusted dealer of ${product.title} in ${cityName}, offering premium biomedical equipment, laboratory instruments and diagnostic systems at competitive prices.`,
            },
            {
                title: `${product.title} Distributor in ${cityName}`,
                content: `Looking for a reliable distributor of ${product.title} in ${cityName}? We provide fast delivery, installation support, maintenance assistance and professional customer service.`,
            },
            {
                title: `Buy ${product.title} in ${cityName}`,
                content: `Purchase high-quality ${product.title} in ${cityName} from Central Biomedicals with genuine products, competitive pricing and reliable nationwide support.`,
            },
            {
                title: `${product.title} Price in ${cityName}`,
                content: `The price of ${product.title} depends on the selected model, specifications and configuration. Contact our team for the latest quotation, availability and delivery information.`,
            },
        ].map((item, index) => (

            <div
                key={index}
                className="rounded-[24px] border border-[#D9D7B6] bg-gradient-to-br from-[#FCFAEF] via-white to-[#ECE7D0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#878672] hover:shadow-[0_15px_40px_rgba(84,83,51,0.12)]"
            >

                <h3 className="text-2xl font-bold text-[#545333]">

                    {item.title}

                </h3>

                <p className="mt-4 leading-8 text-[#6A6954]">

                    {item.content}

                </p>

            </div>

        ))}

    </div>

</div>

                            {/* FAQ Section */}

                         <div className="mt-12 rounded-[32px] border border-[#D9D7B6] bg-white/90 p-6 shadow-[0_20px_60px_rgba(84,83,51,0.10)] backdrop-blur md:p-10">

    {/* Badge */}

    <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#ECE7D0]/60 px-4 py-2 text-sm font-semibold text-[#545333]">

        Help Center

    </span>

    {/* Heading */}

    <h3 className="mt-5 text-2xl font-black text-[#545333] md:text-3xl">

        Frequently Asked Questions

    </h3>

    {/* FAQ List */}

    <div className="mt-8 space-y-5">

        {[
            {
                question: `What is ${product.title} used for in ${cityName}?`,
                answer: `${product.title} is commonly used in hospitals, pathology laboratories, diagnostic centres and healthcare facilities for accurate diagnostic and laboratory applications.`,
            },
            {
                question: `What is the price of ${product.title} in ${cityName}?`,
                answer: `The price depends on the model, configuration and specifications. Contact our team for the latest quotation and availability.`,
            },
            {
                question: `Are you an authorized supplier of ${product.title}?`,
                answer: `Yes. We supply genuine biomedical and laboratory equipment sourced from trusted manufacturers and brands.`,
            },
            {
                question: `Can hospitals in ${cityName} order this product?`,
                answer: `Yes. Hospitals, pathology laboratories, diagnostic centres, research institutes and healthcare facilities can purchase this product.`,
            },
            {
                question: "Do you provide installation support?",
                answer: `Yes. Installation guidance, technical assistance and after-sales support are available for eligible products.`,
            },
            {
                question: "Can I request a quotation?",
                answer: `Absolutely. Simply submit the enquiry form on this page and our team will provide pricing, availability and product details.`,
            },
            {
                question: "Do you provide warranty?",
                answer: `Warranty coverage depends on the manufacturer and selected product model. Our team will share complete warranty information.`,
            },
            {
                question: "Do you deliver across India?",
                answer: `Yes. We provide safe packaging and reliable delivery services across India.`,
            },
            {
                question: "How can I contact Central Biomedicals?",
                answer: `You can submit the enquiry form on this page or contact our sales team directly for quotations, product information and technical assistance.`,
            },
        ].map((item, index) => (

            <div
                key={index}
                className="rounded-[24px] border border-[#D9D7B6] bg-gradient-to-br from-[#FCFAEF] via-white to-[#ECE7D0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#878672] hover:shadow-[0_15px_40px_rgba(84,83,51,0.12)]"
            >

                <h4 className="text-lg font-bold text-[#545333]">

                    {item.question}

                </h4>

                <p className="mt-3 leading-8 text-[#6A6954]">

                    {item.answer}

                </p>

            </div>

        ))}

    </div>

</div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}