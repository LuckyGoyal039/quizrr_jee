function ExamStatsCard({ label, labelColor, labelBg, borderColor, values, mr }) {
    // const borderColor = `border-t-${labelColor}`
  return (
    <div className="transition-all hover:-translate-y-2">
      <p className={`${labelColor} ${labelBg} font-bold uppercase tracking-wide w-fit px-3 rounded-md `}>
        {label}
      </p>
      <div className={`!bg-white border-t-4 ${borderColor} flex rounded my-4`}>
        {values.map((value, index) => (
          <div className="flex flex-col items-center w-44 m-8" key={value.text}>
            <h3 className="text-3xl font-bold">{value?.title}</h3>
            <p className="text-center text-[#869ab8] font-normal">{value?.text}</p>
            {/* {index ===3 && mr && <p className="text-red after:content-[''] after:bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/img/underline_red.svg')]">Most Relevant</p>} */}
            {index === 3 && mr && (
              <p className="text-red-500 relative after:content-[''] after:absolute after:-bottom-[6px] after:left-0 after:w-full after:h-[16px] after:bg-no-repeat after:bg-contain after:bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/img/underline_red.svg')]">
                Most Relevant
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default ExamStatsCard;
