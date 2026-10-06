"use client";

import { motion } from "framer-motion";

export default function PageBanner({
  title,
  subtitle,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F0FDF4] via-white to-[#DCFCE7] py-28 lg:py-36">

      {/* Background Glow */}

      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#64748B]/15 blur-[130px]" />

      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#15803D]/10 blur-[150px]" />

      {/* Premium Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(#D1FAE540_1px,transparent_1px),linear-gradient(90deg,#D1FAE540_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Decorative Circles */}

      <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full border border-[#D1FAE5]/30" />

      <div className="absolute left-1/2 top-16 h-[300px] w-[300px] -translate-x-1/2 rounded-full border border-[#D1FAE5]/20" />

      <div className="container-custom relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-4xl text-center"
        >

          {/* Badge */}

          <span className="inline-flex rounded-full border border-[#D1FAE5] bg-[#DCFCE7]/60 px-5 py-2 text-sm font-semibold text-[#15803D] shadow-md backdrop-blur">

            Welcome to Our Company

          </span>

          {/* Title */}

          <h1 className="mt-8 text-5xl font-black leading-tight text-[#15803D] lg:text-7xl">

            {title}

          </h1>

          {/* Divider */}

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-[#15803D] via-[#64748B] to-[#D1FAE5]" />

          {/* Subtitle */}

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#64748B]">

            {subtitle}

          </p>

        </motion.div>

      </div>

    </section>
  );
}