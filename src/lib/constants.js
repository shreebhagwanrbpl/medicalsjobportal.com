export function parseContactDetails(raw, districtData = null) {
  const data = raw?.data ?? raw ?? {};
  const contactInfo = Array.isArray(data.contactInfo)
    ? data.contactInfo
    : Array.isArray(raw)
      ? raw
      : [];

  const findEntry = (regex) =>
    contactInfo.find((entry) => entry && regex.test(String(entry.label || entry.key || entry.name || "")));

  const toList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val
        .flatMap((v) => (typeof v === "string" ? v.split(/[\n,]+/) : String(v)))
        .map((s) => String(s).trim())
        .filter(Boolean);
    }
    if (typeof val === "string") {
      return val.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    }
    return [String(val).trim()].filter(Boolean);
  };

  // Phone Number (Only Dynamic)
  const phoneEntry = findEntry(/phone|mobile|call|tel|contact/i);
  const phoneRaw = phoneEntry?.value ?? data.phone ?? data.phoneNumber ?? data.mobile ?? data.phoneNumbers;
  const phones = toList(phoneRaw);
  const primaryPhone = phones[0] || "";
  const phone = phones.join("\n");

  // Email Address (Only Dynamic)
  const emailEntry = findEntry(/email|mail/i);
  const emailRaw = emailEntry?.value ?? data.email ?? data.emailAddress ?? data.emails ?? data.mail;
  const emails = toList(emailRaw);
  const email = (typeof emailRaw === "string" && emailRaw.trim()) || emails[0] || "";

  // Office Address (Only Dynamic)
  const addressEntry = findEntry(/address|location|office/i);
  const addressRaw = addressEntry?.value ?? data.address ?? data.officeAddress ?? data.location;
  const baseAddress =
    (typeof addressRaw === "string" && addressRaw.trim()) ||
    (Array.isArray(addressRaw) ? addressRaw.join(", ") : "") ||
    "";

  const address = districtData?.district
    ? `${districtData.district}, ${districtData.state ? `${districtData.state}, ` : ""}India`
    : baseAddress;

  // Working Hours (Only Dynamic)
  const hoursEntry = findEntry(/hour|timing|time|schedule|working/i);
  const hoursRaw = hoursEntry?.value ?? data.workingHours ?? data.hours ?? data.timings;
  const workingHours =
    (typeof hoursRaw === "string" && hoursRaw.trim()) ||
    (Array.isArray(hoursRaw) ? hoursRaw.join(", ") : "") ||
    "";

  // Social Links (Dynamic if in data, otherwise empty or link)
  const facebookEntry = findEntry(/facebook/i);
  const facebook = facebookEntry?.value ?? data.facebook ?? "";

  const instagramEntry = findEntry(/instagram/i);
  const instagram = instagramEntry?.value ?? data.instagram ?? "";

  return {
    contactInfo,
    phones,
    phone,
    primaryPhone,
    email,
    emails,
    address,
    baseAddress,
    workingHours,
    facebook,
    instagram,
  };
}
