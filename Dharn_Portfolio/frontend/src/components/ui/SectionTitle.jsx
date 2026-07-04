const SectionTitle = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-12">

      <p className="text-blue-500 uppercase tracking-widest">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {subtitle}
      </h2>

    </div>
  );
};

export default SectionTitle;