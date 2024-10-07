import TestimonialCard from "./TestimonialCard"

function Testimonials() {
  return (
    <div className="pt-16 pb-8 px-6">
        <div className="flex items-center">
            <h1 className="text-[42px] font-bold max-w-5xl"><span className="text-[#df4759]">Many questions</span> at JEE Main 2022 were <span className="text-[#df4759]">same/similar</span> to the ones asked in our test series.</h1>
        </div>
        <div className="flex gap-8 ">
            <div className="py-[50vh]">
                <h1 className="sticky top-[50%] text-[44px] font-bold max-w-80">Trusted by thousands of <span className="text-[#df4759]">students</span> & their <span className="text-[#df4759]">parents</span> across the nation</h1>
            </div>
            <div className="max-w-xl px-5 pt-32 pb-20 space-y-5">
                <TestimonialCard name={'Arnav Agarwal'} percentile={'99.94'} video={'https://www.youtube.com/embed/wusE3bhsHoc?si=AAh6BkggRjQVmAQ3'} text={'I joined the test series as it was recommended by my friends. The test series was very relevant. It matched with the exact pattern of questions in the real JEE Main exam. The 15-page analysis after every test helped me a lot. The video analysis of Anup sir after every test was also great. It was a great experience.'} />
                <TestimonialCard name={'Sameer Bharadwaj Pasgi'} percentile={'99.91'} video={'https://www.youtube.com/embed/KXyFS-5xGPY?si=yn_BXFtYN5tPSUZ3'} text={'Thank you team MathonGo & Anup sir for providing this test series. The 15 page analysis helped me a lot to overcome my mistakes. The standard of the test series was pretty relevant to actual JEE Main exam. The mock tests helped me to become familiar with the JEE pattern. I was able to learn time management by taking these mocks.'}/>
                <TestimonialCard name={'Tejas Singh'} percentile={'99.91'} video={'https://www.youtube.com/embed/bLEEYikSCSM?si=atkBwLiLwLT_Hvls'} text={'The test and questions were very relevant. All types of questions were covered. This helped a lot in improving my percentile. Many similar questions were asked in JEE Main which I had practiced in this test series especially in the Chemistry and Physics part. I would definitely recommend this test series.'}/>
                <TestimonialCard name={'Satvik Bhat'} percentile={'99.89'} video={'https://www.youtube.com/embed/CWc2bMERYAs?si=NI36iBk0ViNACvtS'} text={"The test series was very relevant. The 15 page detailed analysis pin pointed my mistakes that I had done in the paper. The video solutions provided for the full length mocks helped a lot. I would very much recommend this test series to my juniors because it is very much relevant for JEE Main. I would say it is 'THE' most relevant test series."}/>
                <TestimonialCard name={'Debapriya Maity'} percentile={'99.89'} video={'https://www.youtube.com/embed/VNxvR8XjYSw?si=sPYaLO_qx63gmf3Z'} text={'The test series provided the most relevant questions along with accurate analysis of my test attempts. The video analysis by Anup sir and the 15 page detailed analysis were brilliant. The solutions were perfect. I would highly recommend everyone to join this platform.'}/>
            </div>
        </div>
    </div>
  )
}
export default Testimonials