import ExamStatsCard from "./ExamStatsCard"

function ExamStats() {
  return (
    <div className="bg-white pt-12">
        <h1 className="text-5xl font-bold my-8">Our Result: The Choice of Toppers</h1>
        <ExamStatsCard label={'JEE Main 2024'} mr labelColor={'text-[#df4759]'} borderColor={'border-t-[#df4759]'} labelBg={'bg-[rgb(223,71,89,0.1)]'} values={[
            {title: '2017', text: 'Got 99+ percentile (overall)'},
            {title: '192', text: 'Got 100 percentile in one or more subjects'},
            {title: '11', text: 'Got All India Rank (AIR) under 100'},
            {title: '98.3%', text: 'Found the test series'}
            ]} />
        <ExamStatsCard label={'JEE Main 2023'} mr labelColor={'text-[#335eea]'} borderColor={'border-t-[#335eea]'} labelBg={'bg-[rgb(51,94,234,0.1)]'} values={[
            {title: '630', text: 'Got 99+ percentile (overall)'},
            {title: '1108', text: 'Got 99+ percentile in one or more subjects'},
            {title: '85%', text: 'Improved their score by 25 percentile'},
            {title: '93%', text: 'Found the test series'}
            ]} />
        <ExamStatsCard label={'JEE Main 2022'} mr labelColor={'text-[#335eea]'} borderColor={'border-t-[#335eea]'} labelBg={'bg-[rgb(51,94,234,0.1)]'} values={[
            {title: '253', text: 'Got 99+ percentile (overall)'},
            {title: '508', text: 'Got 99+ percentile in one or more subjects'},
            {title: '89%', text: 'Improved their score by 25 percentile'},
            {title: '92.33%', text: 'Found the test series'}
            ]} />
        <ExamStatsCard label={'JEE Main 2021'} mr labelColor={'text-[#335eea]'} borderColor={'border-t-[#335eea]'} labelBg={'bg-[rgb(51,94,234,0.1)]'} values={[
            {title: '150', text: 'Got 99+ percentile (overall)'},
            {title: '301', text: 'Got 99+ percentile in one or more subjects'},
            {title: '85%', text: 'Improved their score by 25 percentile'},
            {title: '89%', text: 'Found the test series'}
            ]} />

       
    </div>
  )
}
export default ExamStats