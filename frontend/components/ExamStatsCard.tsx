interface LabelInterface {
  label: string;
  labelColor: string;
  labelBg: string;
  borderColor: string;
  values: Array<{
    title: string;
    text: string;
  }>;
  mr: boolean;
}

function ExamStatsCard({ label, labelColor, labelBg, borderColor, values, mr }: LabelInterface) {
  return (
    <div className="transition-all hover:-translate-y-2 w-full py-5">
      <div className="w-full flex justify-center lg:justify-start">
        <p className={`${labelColor} ${labelBg} font-bold uppercase  w-fit px-3 rounded-md text-sm lg:text-xl`}>
          {label}
        </p>
      </div>
      <div className={`!bg-white border-t-4 ${borderColor} rounded my-4 flex flex-col lg:flex-row lg:justify-between gap-10`}>
        {values.map((value, index) => (
          <div className="flex flex-col items-center gap-2" key={value.text}>
            <h3 className="text-3xl font-bold">{value?.title}</h3>
            <p className="text-center text-[#869ab8] font-normal w-52">{value?.text}</p>
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
