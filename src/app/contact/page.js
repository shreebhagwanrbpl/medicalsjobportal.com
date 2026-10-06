"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "@/lib/client-api";
import { db } from "@/lib/client-api";
import toast from "react-hot-toast";
import { fetchContactData } from "@/lib/data-fetcher";
import { parseContactDetails } from "@/lib/constants";

import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactData, setContactData] = useState(() => parseContactDetails(null));
  const [submitting, setSubmitting] = useState(false);

  const pathname = usePathname();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const pathParts = pathname ? pathname.split("/").filter(Boolean) : [];

  const staticRoutes = ["about", "services", "products", "contact", "items"];

  const currentDistrict =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  // ==========================================================
  // FORM CHANGE
  // ==========================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================================
  // FORM SUBMIT
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error("Name is required");
    }

    if (!emailRegex.test(form.email)) {
      return toast.error("Enter valid email");
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Enter valid mobile number");
    }

    if (!form.message.trim()) {
      return toast.error("Message is required");
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "medicalsjobportalcom",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success("Message submitted successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // LOAD DISTRICT
  // ==========================================================
  useEffect(() => {
    let isMounted = true;
    if (!currentDistrict) {
      setDistrictData(null);
      return;
    }

    const loadDistrict = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "medicalsjobportalcom",
            "districts",
            currentDistrict
          )
        );

        if (isMounted && snap.exists()) {
          const dData = snap.data();
          setDistrictData(dData);
          setContactData((prev) => parseContactDetails(prev, dData));
        }
      } catch (err) {
        console.error("Error loading district in contact page:", err);
      }
    };

    loadDistrict();

    return () => {
      isMounted = false;
    };
  }, [currentDistrict]);

  // ==========================================================
  // LOAD CONTACT
  // ==========================================================
  useEffect(() => {
    let isMounted = true;

    const loadContact = async () => {
      try {
        const raw = await fetchContactData();
        if (isMounted && raw) {
          setContactData(parseContactDetails(raw, districtData));
        }
      } catch (err) {
        console.error("Error loading contact data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContact();

    return () => {
      isMounted = false;
    };
  }, [districtData]);

  const { phones, email, address, workingHours } = contactData;
  const hasCards = (phones && phones.length > 0) || email || address || workingHours;

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="h-12 w-64 bg-slate-200 rounded animate-pulse mb-8" />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-slate-200 rounded-3xl animate-pulse mb-6"
                />
              ))}
            </div>

            <div className="bg-white p-10 rounded-3xl border border-[#D1FAE5]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-5"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ======================================================
          CONTACT SECTION
      ====================================================== */}
      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-14">
          {/* ==================================================
              LEFT INFO
          ================================================== */}
          <div>
            {/* Badge */}
            <span className="inline-block bg-[#F0FDF4] border border-[#D1FAE5] text-[#14532D] px-5 py-2 rounded-full font-semibold mb-5">
              Contact Information
            </span>

            {/* Heading */}
            <h1 className="section-title text-[#0F172A]">
              Let’s Start a Conversation
            </h1>

            {/* Description */}
            <p className="section-subtitle text-[#14532D]">
              Reach out to us for healthcare consultation, biomedical products, and
              advanced diagnostic support.
            </p>

            {/* ==================================================
                CONTACT CARDS (ONLY DYNAMIC)
            ================================================== */}
            <div className="space-y-6 mt-10">
              {/* Phone */}
              {phones && phones.length > 0 ? (
                <div className="flex items-start gap-5 bg-[#F0FDF4] p-6 rounded-[28px] border border-[#D1FAE5] hover:border-[#22C55E] hover:shadow-[0_15px_40px_rgba(82,88,39,0.12)] transition-all duration-300">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-[#166534]/20">
                    <Phone size={24} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg text-[#0F172A]">
                      Phone Number
                    </h2>

                    <div className="space-y-1 mt-2">
                      {phones.map((num, i) => (
                        <p key={i} className="text-[#14532D]">
                          <a
                            href={`tel:${num.replace(/\s+/g, "")}`}
                            className="hover:text-[#166534] transition font-medium"
                          >
                            {num}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Email */}
              {email ? (
                <div className="flex items-start gap-5 bg-[#F0FDF4] p-6 rounded-[28px] border border-[#D1FAE5] hover:border-[#22C55E] hover:shadow-[0_15px_40px_rgba(82,88,39,0.12)] transition-all duration-300">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-[#166534]/20">
                    <Mail size={24} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg text-[#0F172A]">
                      Email Address
                    </h2>

                    <p className="text-[#14532D] mt-2 break-all font-medium">
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-[#166534] transition"
                      >
                        {email}
                      </a>
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Address */}
              {address ? (
                <div className="flex items-start gap-5 bg-[#F0FDF4] p-6 rounded-[28px] border border-[#D1FAE5] hover:border-[#22C55E] hover:shadow-[0_15px_40px_rgba(82,88,39,0.12)] transition-all duration-300">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-[#166534]/20">
                    <MapPin size={24} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg text-[#0F172A]">
                      Office Address
                    </h2>

                    <p className="text-[#14532D] mt-2 leading-7 font-medium">
                      {address}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Working Hours */}
              {workingHours ? (
                <div className="flex items-start gap-5 bg-[#F0FDF4] p-6 rounded-[28px] border border-[#D1FAE5] hover:border-[#22C55E] hover:shadow-[0_15px_40px_rgba(82,88,39,0.12)] transition-all duration-300">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-[#166534]/20">
                    <Clock3 size={24} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg text-[#0F172A]">
                      Working Hours
                    </h2>

                    <p className="text-[#14532D] mt-2 font-medium">
                      {workingHours}
                    </p>
                  </div>
                </div>
              ) : null}

              {!hasCards && (
                <div className="bg-[#F0FDF4] p-6 rounded-[28px] border border-[#D1FAE5] text-slate-500 text-sm">
                  Contact details will be displayed here once available.
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT FORM
          ================================================== */}
          <div className="bg-white rounded-[40px] p-8 lg:p-10 border border-[#D1FAE5] shadow-[0_20px_60px_rgba(82,88,39,0.12)]">
            <h3 className="text-3xl font-bold text-[#0F172A]">
              Send Us Message
            </h3>

            <p className="text-[#14532D] mt-3">
              Fill out the form and our team will contact you soon.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-[#D1FAE5] bg-[#FFFFFF] rounded-2xl px-5 py-4 outline-none text-[#0F172A] placeholder:text-[#16A34A] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-[#D1FAE5] bg-[#FFFFFF] rounded-2xl px-5 py-4 outline-none text-[#0F172A] placeholder:text-[#16A34A] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition"
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                maxLength={10}
                value={form.phone}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full border border-[#D1FAE5] bg-[#FFFFFF] rounded-2xl px-5 py-4 outline-none text-[#0F172A] placeholder:text-[#16A34A] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition"
              />


              {/* Message */}
              <textarea
                rows={5}
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-[#D1FAE5] bg-[#FFFFFF] rounded-2xl px-5 py-4 outline-none text-[#0F172A] placeholder:text-[#16A34A] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition resize-none"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#166534] text-white hover:text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#166534]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#166534]/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ======================================================
          GOOGLE MAP (ONLY IF DYNAMIC ADDRESS EXISTS)
      ====================================================== */}
      {address ? (
        <section className="pb-24 bg-white">
          <div className="container-custom">
            <div className="rounded-[40px] overflow-hidden border border-[#D1FAE5] shadow-lg shadow-[#166534]/10">
              <iframe
                title="Office Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`}
                width="100%"
                height="500"
                loading="lazy"
                className="border-0 w-full"
              ></iframe>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}