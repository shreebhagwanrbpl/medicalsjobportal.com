import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";


export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Raj Biosis"
        subtitle="Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision."
      />

      {/* About Section */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#D1FAE5]">

        {/* Background Glow */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#64748B]/15 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#15803D]/10 blur-[140px]" />

        <div className="container-custom relative grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Image */}

          <div className="relative">

            <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[40px] border border-[#D1FAE5] bg-gradient-to-br from-[#ECFDF5] via-white to-[#D1FAE5] p-10 shadow-2xl">

              <Image
                src="/about.png"
                alt="About"
                width={1200}
                height={900}
                className="max-h-full max-w-full object-contain transition duration-500 hover:scale-105"
              />

            </div>

            {/* Experience Card */}

            <div className="absolute bottom-8 left-8 hidden rounded-[28px] border border-[#D1FAE5] bg-white/90 px-8 py-6 shadow-2xl backdrop-blur lg:block">

              <h3 className="text-4xl font-black text-[#15803D]">

                10+

              </h3>

              <p className="mt-2 text-[#64748B]">

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

            <p className="mt-8 leading-8 text-[#64748B]">

              At Raj Biosis, we specialize in providing premium
              biomedical and diagnostic equipment that enhances laboratory
              performance, healthcare accuracy and clinical efficiency across
              hospitals, laboratories and healthcare institutions.

            </p>

            <p className="mt-6 leading-8 text-[#64748B]">

              Our mission is to empower healthcare professionals through
              advanced technology, reliable products and dedicated after-sales
              support while maintaining the highest standards of quality and
              innovation.

            </p>

            {/* Features */}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              {/* Card 1 */}

              <div className="group rounded-3xl border border-[#D1FAE5] bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-[#15803D] hover:shadow-2xl">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D1FAE5] text-2xl transition duration-300 group-hover:bg-[#64748B]">

                  🏥

                </div>

                <h4 className="text-xl font-bold text-[#15803D] transition-colors duration-300 group-hover:text-[#ECFDF5]">

                  Premium Equipment

                </h4>

                <p className="mt-3 leading-7 text-[#64748B] transition-colors duration-300 group-hover:text-[#ECFDF5]/90">

                  High-quality laboratory and diagnostic instruments designed
                  for maximum precision and long-term reliability.

                </p>

              </div>

              {/* Card 2 */}

              <div className="group rounded-3xl border border-[#D1FAE5] bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-[#15803D] hover:shadow-2xl">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D1FAE5] text-2xl transition duration-300 group-hover:bg-[#64748B]">

                  🤝

                </div>

                <h4 className="text-xl font-bold text-[#15803D] transition-colors duration-300 group-hover:text-[#ECFDF5]">

                  Expert Support

                </h4>

                <p className="mt-3 leading-7 text-[#64748B] transition-colors duration-300 group-hover:text-[#ECFDF5]/90">

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