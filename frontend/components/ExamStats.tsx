import ExamStatsCard from "./ExamStatsCard";

function ExamStats() {
  const statsData = [
    {
      label: "JEE Main 2024",
      labelColor: "text-[#df4759]",
      borderColor: "border-t-[#df4759]",
      labelBg: "bg-[rgb(223,71,89,0.1)]",
      values: [
        { title: "2017", text: "Got 99+ percentile (overall)" },
        { title: "192", text: "Got 100 percentile in one or more subjects" },
        { title: "11", text: "Got All India Rank (AIR) under 100" },
        { title: "98.3%", text: "Found the test series" },
      ],
    },
    {
      label: "JEE Main 2023",
      labelColor: "text-[#335eea]",
      borderColor: "border-t-[#335eea]",
      labelBg: "bg-[rgb(51,94,234,0.1)]",
      values: [
        { title: "630", text: "Got 99+ percentile (overall)" },
        { title: "1108", text: "Got 99+ percentile in one or more subjects" },
        { title: "85%", text: "Improved their score by 25 percentile" },
        { title: "93%", text: "Found the test series" },
      ],
    },
    {
      label: "JEE Main 2022",
      labelColor: "text-[#335eea]",
      borderColor: "border-t-[#335eea]",
      labelBg: "bg-[rgb(51,94,234,0.1)]",
      values: [
        { title: "253", text: "Got 99+ percentile (overall)" },
        { title: "508", text: "Got 99+ percentile in one or more subjects" },
        { title: "89%", text: "Improved their score by 25 percentile" },
        { title: "92.33%", text: "Found the test series" },
      ],
    },
    {
      label: "JEE Main 2021",
      labelColor: "text-[#335eea]",
      borderColor: "border-t-[#335eea]",
      labelBg: "bg-[rgb(51,94,234,0.1)]",
      values: [
        { title: "150", text: "Got 99+ percentile (overall)" },
        { title: "301", text: "Got 99+ percentile in one or more subjects" },
        { title: "85%", text: "Improved their score by 25 percentile" },
        { title: "89%", text: "Found the test series" },
      ],
    },
  ];

  return (
    <div className="bg-white pt-12 w-full overflow-hidden px-8 lg:px-44">
      <h1 className="text-3xl lg:text-5xl font-bold my-8 text-center lg:text-start">Our Result: The Choice of Toppers</h1>
      {statsData.map(({ label, labelColor, borderColor, labelBg, values }, index) => (
        <ExamStatsCard
          key={label}
          label={label}
          labelColor={labelColor}
          borderColor={borderColor}
          labelBg={labelBg}
          values={values}
          mr={index !== statsData.length - 1}
        />
      ))}
    </div>
  );
}

export default ExamStats;
