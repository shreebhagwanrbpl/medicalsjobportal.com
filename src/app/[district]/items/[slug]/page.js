import ProductDetails from "../../../items/[slug]/ProductDetails";
import { fetchProductBySlug, fetchContactDetails, fetchDistrictData } from "@/lib/data-fetcher-server";

export default async function Page({ params }) {
    const { slug, district } = await params;
    const [product, districtData] = await Promise.all([
        fetchProductBySlug(slug),
        fetchDistrictData(district),
    ]);
    const contactData = await fetchContactDetails(districtData);

    return (
        <ProductDetails
            slug={slug}
            district={district}
            initialProduct={product}
            initialContactData={contactData}
        />
    );
}