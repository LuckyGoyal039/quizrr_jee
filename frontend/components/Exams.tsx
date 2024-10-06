import ExamBadge from "./ExamBadge"

function Exams() {
  return (
    <div className="flex justify-center w-full bg-[#f9fbfd]">
    <div className="grid grid-cols-6 gap-x-8 gap-y-1 py-12 w-[1024px]">
        <ExamBadge title="JEE Main" src="https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png" />
        <ExamBadge title="JEE Advanced" src="https://cdn.quizrr.in/web-assets/icons/exams/jee-advanced.png" />
        <ExamBadge title="BITSAT" src="https://cdn.quizrr.in/web-assets/icons/exams/bitsat.png" />
        <ExamBadge title="UGEE" src="https://cdn.quizrr.in/web-assets/icons/exams/ugee.png" />
        <ExamBadge title="COMEDK" src="https://cdn.quizrr.in/web-assets/icons/exams/comedk.png" />
        <ExamBadge title="KCET" src="https://cdn.quizrr.in/web-assets/icons/exams/kcet.png" />
        <ExamBadge title="AP EAMCET" src="https://cdn-assets.getmarks.app/app_assets/img/exams/ic_content_exam_ap_eamcet.png" />
        <ExamBadge title="TS EAMCET" src="https://cdn-assets.getmarks.app/app_assets/img/exams/ic_content_exam_ts_eamcet.png" />
        <ExamBadge title="WBJEE" src="https://cdn.quizrr.in/web-assets/icons/exams/wbjee.png" />
        <ExamBadge title="MHT CET" src="https://cdn.quizrr.in/web-assets/icons/exams/mht-cet.png" />
        <ExamBadge title="VITEEE" src="https://cdn.quizrr.in/web-assets/icons/exams/viteee.png" />
        <ExamBadge title="Manipal (MET)" src="https://cdn.quizrr.in/web-assets/icons/exams/manipal.png" />
        <ExamBadge title="SRMJEEE" src="https://cdn.quizrr.in/web-assets/icons/exams/srmjeee.png" />
    </div>
    </div>
  )
}
export default Exams