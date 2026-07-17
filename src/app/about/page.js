import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Central Biomedicals"
        subtitle="Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision."
      />

      {/* About Section */}
<section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  {/* Background Glow */}
  <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#878672]/15 blur-[120px]" />
  <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#545333]/10 blur-[140px]" />

  <div className="container-custom relative grid lg:grid-cols-2 gap-20 items-center">

    {/* Left Image */}

    <div className="relative">

      <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[40px] border border-[#D9D7B6] bg-gradient-to-br from-[#FDFBD4] via-white to-[#D9D7B6] p-10 shadow-2xl">

        <Image
          src={DDS}
          alt="About"
          width={1200}
          height={900}
          className="max-h-full max-w-full object-contain transition duration-500 hover:scale-105"
        />

      </div>

      {/* Experience Card */}

      <div className="absolute bottom-8 left-8 hidden rounded-[28px] border border-[#D9D7B6] bg-white/90 px-8 py-6 shadow-2xl backdrop-blur lg:block">

        <h3 className="text-4xl font-black text-[#545333]">

          10+

        </h3>

        <p className="mt-2 text-[#6A6954]">

          Years of Excellence

        </p>

      </div>

    </div>

    {/* Right Content */}

    <div>

      <SectionTitle
        badge="Who We Are"
        title="Trusted Partner in Biomedical & Diagnostics"
        description="Delivering innovative biomedical equipment and laboratory solutions with quality, precision and trusted healthcare support."
      />

      <p className="mt-8 leading-8 text-[#6A6954]">

        At Central Biomedicals, we specialize in providing premium
        biomedical and diagnostic equipment that enhances laboratory
        performance, healthcare accuracy and clinical efficiency across
        hospitals, laboratories and healthcare institutions.

      </p>

      <p className="mt-6 leading-8 text-[#6A6954]">

        Our mission is to empower healthcare professionals through
        advanced technology, reliable products and dedicated after-sales
        support while maintaining the highest standards of quality and
        innovation.

      </p>

      {/* Features */}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">

        {/* Card 1 */}

        <div className="group rounded-3xl border border-[#D9D7B6] bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-[#545333] hover:shadow-2xl">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9D7B6] text-2xl transition duration-300 group-hover:bg-[#878672]">

            🏥

          </div>

          <h4 className="text-xl font-bold text-[#545333] transition-colors duration-300 group-hover:text-[#FDFBD4]">

            Premium Equipment

          </h4>

          <p className="mt-3 leading-7 text-[#6A6954] transition-colors duration-300 group-hover:text-[#FDFBD4]/90">

            High-quality laboratory and diagnostic instruments designed
            for maximum precision and long-term reliability.

          </p>

        </div>

        {/* Card 2 */}

        <div className="group rounded-3xl border border-[#D9D7B6] bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-[#545333] hover:shadow-2xl">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9D7B6] text-2xl transition duration-300 group-hover:bg-[#878672]">

            🤝

          </div>

          <h4 className="text-xl font-bold text-[#545333] transition-colors duration-300 group-hover:text-[#FDFBD4]">

            Expert Support

          </h4>

          <p className="mt-3 leading-7 text-[#6A6954] transition-colors duration-300 group-hover:text-[#FDFBD4]/90">

            Professional consultation, installation, maintenance and
            dedicated customer support across India.

          </p>

        </div>

      </div>

    </div>

  </div>

</section>
    </>
  );
}