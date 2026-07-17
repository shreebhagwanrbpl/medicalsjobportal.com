"use client";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
// import CTASection from "@/components/CTASection";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Services"
        subtitle="Delivering trusted biomedical and diagnostic services with innovation, precision, and healthcare excellence."
      />

      {/* Services Grid */}
     <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  {/* Background Glow */}
  <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#878672]/15 blur-[120px]" />
  <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#545333]/10 blur-[140px]" />

  <div className="container-custom relative">

    <SectionTitle
      badge="What We Offer"
      title="Premium Biomedical Services"
      description="We provide innovative healthcare and biomedical solutions tailored to modern diagnostics and laboratory excellence."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {loading
        ? Array.from({ length: 6 }).map((_, index) => (

            <div
              key={index}
              className="animate-pulse rounded-[32px] border border-[#D9D7B6] bg-white/85 p-10 shadow-xl backdrop-blur"
            >

              {/* Icon */}

              <div className="mb-8 h-20 w-20 rounded-3xl bg-[#D9D7B6]"></div>

              {/* Title */}

              <div className="mb-6 h-8 w-2/3 rounded bg-[#D9D7B6]"></div>

              {/* Description */}

              <div className="space-y-3">

                <div className="h-4 rounded bg-[#D9D7B6]/80"></div>

                <div className="h-4 w-11/12 rounded bg-[#D9D7B6]/80"></div>

                <div className="h-4 w-8/12 rounded bg-[#D9D7B6]/80"></div>

              </div>

            </div>

          ))
        : services.map((service, index) => (

            <ServiceCard
              key={index}
              icon={icons[index]}
              title={service.title}
              description={service.desc}
            />

          ))}

    </div>

  </div>

</section>

      {/* Working Process */}
   <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  {/* Background Glow */}

  <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#878672]/15 blur-[120px]" />

  <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#545333]/10 blur-[140px]" />

  <div className="container-custom relative">

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
          title: "Consultation",
          desc:
            "Understanding healthcare requirements, laboratory needs and recommending the most suitable biomedical solutions.",
        },
        {
          step: "02",
          title: "Implementation",
          desc:
            "Supplying, installing and configuring biomedical equipment with complete technical guidance.",
        },
        {
          step: "03",
          title: "Support",
          desc:
            "Providing ongoing maintenance, expert assistance and after-sales support for long-term reliability.",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group relative overflow-hidden rounded-[32px] border border-[#D9D7B6] bg-white/85 p-8 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-3 hover:bg-[#545333] hover:shadow-2xl"
        >

          {/* Background Number */}

          <span className="absolute right-6 top-4 text-7xl font-black text-[#D9D7B6]/60 transition-all duration-500 group-hover:text-white/10">

            {item.step}

          </span>

          {/* Step Badge */}

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9D7B6] font-bold text-[#545333] transition-all duration-500 group-hover:bg-[#878672] group-hover:text-white">

            {item.step}

          </div>

          {/* Title */}

          <h3 className="relative z-10 mt-6 text-2xl font-bold text-[#545333] transition-colors duration-300 group-hover:text-[#FDFBD4]">

            {item.title}

          </h3>

          {/* Description */}

          <p className="relative z-10 mt-4 leading-8 text-[#6A6954] transition-colors duration-300 group-hover:text-[#FDFBD4]/90">

            {item.desc}

          </p>

          {/* Bottom Accent */}

          <div className="relative z-10 mt-8 h-1 w-16 rounded-full bg-[#878672] transition-all duration-500 group-hover:w-28 group-hover:bg-[#FDFBD4]"></div>

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