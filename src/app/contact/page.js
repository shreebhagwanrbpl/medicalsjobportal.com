"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
// import CTASection from "@/components/CTASection";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);
  const [contactInfo, setContactInfo] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);
  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const currentDistrict =
    pathParts.length > 0
      ? pathParts[0]
      : null;
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

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

    if (!form.message.trim()) {
      return toast.error(
        "Message is required"
      );
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "centralbiomedicals",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success(
        "Message submitted successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            currentDistrict
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [currentDistrict]);
  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);



  const phone =
    contactInfo.find(
      (x) => x.label === "Phone Number"
    )?.value || "";

  const email =
    contactInfo.find(
      (x) => x.label === "Email Address"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address"
    )?.value || "";

  const hours =
    contactInfo.find(
      (x) => x.label === "Working Hours"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const mapAddress = encodeURIComponent(
    dynamicAddress
  );
  if (loading) {
    return (
  <section className="section-padding bg-gradient-to-br from-[#FDFBD4] via-[#FBFAF2] to-[#D9D7B6]">

  <div className="container-custom">

    <div className="grid gap-12 lg:grid-cols-2">

      {/* Left Skeleton */}

      <div>

        <div className="mb-8 h-12 w-64 animate-pulse rounded-xl bg-[#D9D7B6]" />

        {[...Array(4)].map((_, i) => (

          <div
            key={i}
            className="mb-6 rounded-3xl border border-[#D9D7B6] bg-white/80 p-6 shadow-lg backdrop-blur"
          >

            <div className="mb-5 h-8 w-40 animate-pulse rounded-lg bg-[#D9D7B6]" />

            <div className="mb-3 h-4 w-full animate-pulse rounded bg-[#D9D7B6]/80" />

            <div className="mb-3 h-4 w-11/12 animate-pulse rounded bg-[#D9D7B6]/80" />

            <div className="h-4 w-8/12 animate-pulse rounded bg-[#D9D7B6]/80" />

          </div>

        ))}

      </div>

      {/* Right Skeleton */}

      <div className="rounded-3xl border border-[#D9D7B6] bg-white/80 p-10 shadow-xl backdrop-blur">

        <div className="mb-8 h-10 w-52 animate-pulse rounded-xl bg-[#D9D7B6]" />

        {[...Array(6)].map((_, i) => (

          <div
            key={i}
            className="mb-5 h-14 animate-pulse rounded-2xl bg-[#D9D7B6]/80"
          />

        ))}

        <div className="mt-8 h-14 w-48 animate-pulse rounded-2xl bg-[#545333]/20" />

      </div>

    </div>

  </div>

</section>
    );
  }
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with Central Biomedicals for premium diagnostic and biomedical solutions."
      />

      {/* Contact Section */}
<section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#FCFAEF] via-[#F7F5E8] to-[#ECE7D0]">

  {/* Background Glow */}
  <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#878672]/15 blur-[140px]" />
  <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#545333]/10 blur-[160px]" />

  <div className="container-custom relative grid gap-16 lg:grid-cols-2">

    {/* Left */}

    <div>

      <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#D9D7B6]/40 px-5 py-2 font-semibold text-[#545333]">

        Contact Information

      </span>

      <h2 className="mt-6 text-4xl font-black leading-tight text-[#545333] lg:text-5xl">

        Let's Start a Conversation

      </h2>

      <p className="mt-6 max-w-xl leading-8 text-[#6A6954]">

        Reach out to us for biomedical equipment, laboratory solutions,
        healthcare consultation, installation support and professional
        diagnostic assistance. Our experts are always ready to help.

      </p>

      <div className="mt-10 space-y-6">

        {[
          {
            icon: <Phone size={24} className="text-[#545333] group-hover:text-white" />,
            title: "Phone Number",
            value: phone,
          },
          {
            icon: <Mail size={24} className="text-[#545333] group-hover:text-white" />,
            title: "Email Address",
            value: email,
          },
          {
            icon: <MapPin size={24} className="text-[#545333] group-hover:text-white" />,
            title: "Office Address",
            value: dynamicAddress,
          },
          {
            icon: <Clock3 size={24} className="text-[#545333] group-hover:text-white" />,
            title: "Working Hours",
            value: hours,
          },
        ].map((item, index) => (

          <div
            key={index}
            className="group flex items-start gap-5 rounded-[30px] border border-[#D9D7B6] bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[#878672] hover:shadow-2xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9D7B6] transition-all duration-300 group-hover:bg-[#545333]">

              {item.icon}

            </div>

            <div>

              <h4 className="text-lg font-bold text-[#545333]">

                {item.title}

              </h4>

              <p className="mt-2 leading-7 text-[#6A6954] break-words">

                {item.value}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* Right Form */}

    <div className="rounded-[40px] border border-[#D9D7B6] bg-white p-10 shadow-xl">

      <span className="inline-flex rounded-full border border-[#D9D7B6] bg-[#D9D7B6]/40 px-4 py-2 text-sm font-semibold text-[#545333]">

        Get In Touch

      </span>

      <h3 className="mt-5 text-3xl font-black text-[#545333]">

        Send Us a Message

      </h3>

      <p className="mt-3 leading-7 text-[#6A6954]">

        Fill out the form below and our team will contact you shortly with the
        best biomedical solution for your requirements.

      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#D9D7B6] bg-white px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:ring-4 focus:ring-[#545333]/15"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#D9D7B6] bg-white px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:ring-4 focus:ring-[#545333]/15"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
          className="w-full rounded-2xl border border-[#D9D7B6] bg-white px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:ring-4 focus:ring-[#545333]/15"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#D9D7B6] bg-white px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:ring-4 focus:ring-[#545333]/15"
        />

        <textarea
          rows={5}
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none rounded-2xl border border-[#D9D7B6] bg-white px-5 py-4 text-[#545333] outline-none transition-all duration-300 placeholder:text-[#878672] focus:border-[#545333] focus:ring-4 focus:ring-[#545333]/15"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-gradient-to-r from-[#545333] to-[#6B6A45] py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-[#45452A] hover:to-[#545333] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
        >

          {submitting ? "Submitting..." : "Send Message"}

        </button>

      </form>

    </div>

  </div>

</section>

      {/* Google Map */}
<section className="relative overflow-hidden pb-24 bg-gradient-to-br from-[#FCFAEF] via-[#F7F5E8] to-[#ECE7D0]">

  {/* Background Glow */}

  <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#878672]/15 blur-[150px]" />

  <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#545333]/10 blur-[170px]" />

  <div className="container-custom relative">

    <div className="overflow-hidden rounded-[42px] border border-[#D9D7B6] bg-white p-4 shadow-xl transition-all duration-500 hover:shadow-2xl">

      <iframe
        src={`https://maps.google.com/maps?q=${mapAddress}&z=13&output=embed`}
        loading="lazy"
        className="h-[500px] w-full rounded-[32px] border-0"
      />

    </div>

  </div>

</section>

      {/* CTA */}
      {/* <CTASection /> */}
    </>
  );
}