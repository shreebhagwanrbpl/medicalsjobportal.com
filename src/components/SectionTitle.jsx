export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}) {
  return (
    <div
      className={`${center ? "mx-auto text-center" : ""
        } max-w-3xl`}
    >

      {/* Badge */}
      {badge && (
        <div className="mb-5 inline-flex items-center rounded-full border border-[#15803D]/20 bg-[#15803D]/10 px-5 py-2 text-sm font-semibold text-[#15803D] shadow-sm">
          {badge}
        </div>
      )}

      {/* Title */}
      <h2 className="section-title text-[#15803D]">
        {title}
      </h2>

      {/* Description */}
      <p className="section-subtitle mt-4 text-[#15803D]/80">
        {description}
      </p>

    </div>
  );
}