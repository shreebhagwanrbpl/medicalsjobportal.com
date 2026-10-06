import ProductDetails from "./ProductDetails";
import { fetchProductBySlug, fetchContactDetails } from "@/lib/data-fetcher-server";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    const productName = product?.title || slug
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const title = `${productName} Supplier in India | Price, Dealer & Distributor | Raj Biosis`;

    const description = product?.description || product?.desc || `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact Raj Biosis for latest quotation and product details.`;

    const url = `https://medicalsjobportal.com/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Dealer`,
            `${productName} Distributor`,
            `${productName} Manufacturer`,
            `${productName} Exporter`,
            `${productName} Price`,
            `${productName} Price in India`,
            `${productName} Supplier in India`,
            `${productName} Dealer in India`,
            `${productName} Distributor in India`,
            `Buy ${productName}`,
            `${productName} for Laboratory`,
            `${productName} for Hospital`,
            `${productName} for Diagnostic Center`,
            "Biomedical Equipment",
            "Medical Equipment",
            "Laboratory Equipment",
            "Diagnostic Equipment",
            "Hospital Equipment",
            "Healthcare Equipment",
            "Raj Biosis",
        ],

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Raj Biosis",
            type: "website",
            locale: "en_IN",
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        metadataBase: new URL("https://medicalsjobportal.com"),
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const [product, contactData] = await Promise.all([
        fetchProductBySlug(slug),
        fetchContactDetails(),
    ]);

    return (
        <ProductDetails
            slug={slug}
            initialProduct={product}
            initialContactData={contactData}
        />
    );
}