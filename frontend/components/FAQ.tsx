import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: 'item-1',
    question: 'How many tests are there and what is the schedule?',
    answer: 'Please refer to this section: Click here'
  },
  {
    id: 'item-2',
    question: 'Can I attempt a test any time or is it mandatory to attempt it on the particular date & time mentioned in the schedule?',
    answer: 'The dates listed in the test schedule show when the tests will be uploaded. This means you can start attempting them from those dates. You don\'t have to take the tests on those exact days. Once they\'re uploaded and ready, you can take the tests whenever you want until the test series expires. Note: 1. The previously uploaded tests can also be attempted. 2. You will get analysis and ranking irrespective of the date on which you attempt the test.'
  },
  {
    id: 'item-3',
    question: 'Is it for only Mathematics?',
    answer: 'No, the test series includes all the three subjects i.e., Physics, Chemistry and Mathematics.'
  },
  {
    id: 'item-4',
    question: 'What is the price and validity?',
    answer: 'The price is mentioned in pricing section. Please refer to it. Both the test series i.e., Chapter-wise & Full Syllabus for JEE Advanced are valid till JEE Advanced 2025 (whenever it commences).'
  },
  {
    id: 'item-5',
    question: 'Is there any discount?',
    answer: 'Yes. Refer to the pricing section'
  },
  {
    id: 'item-6',
    question: 'Is there any refund policy?',
    answer: 'No. The fee paid is non-refundable in any case.'
  },
  {
    id: 'item-7',
    question: 'Can I take the tests on mobile?',
    answer: 'Yes, you can take the tests on any device like mobile, PC, laptop as long as it supports Google Chrome browser and has internet connection.'
  },
  {
    id: 'item-8',
    question: 'What are the technical requirements to take the tests?',
    answer: 'A device supporting Google Chrome web-browser and a good internet connection.'
  },
  {
    id: 'item-9',
    question: 'Can I take a test twice?',
    answer: 'No, you cannot.'
  },
  {
    id: 'item-10',
    question: 'Can I give the tests inside the MathonGo app?',
    answer: 'No. You need to take it on our website whose link you will receive after registration.'
  },
  {
    id: 'item-11',
    question: 'Is there any scholarship?',
    answer: 'Yes. In JEE Advanced 2025, if you get All India Rank (AIR): Under 1000: 100% refund Under 2500: 50% refund Under 5000: 30% refund Under 10000: 10% refund of the amount paid. You will be required to share your JEE Advanced 2025 score/rank card along with a video testimonial. Note: The acceptance period for scholarship results extends until 60 days following the declaration of said results. Requests made beyond this timeframe will not be entertained.'
  }
];

const FAQ = () => {
  return (
    <section className="w-full px-4 py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-[#869ab8] font-normal">
            Here are some frequently asked questions by students. If you can&apos;t
            find an answer for your query here, feel free to contact us.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Accordion
            type="multiple"
            className="space-y-4"
          >
            {faqData.map(({ id, question, answer }) => (
              <AccordionItem
                key={id}
                value={id}
                className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <AccordionTrigger className="px-4 py-4 text-left">
                  <span className="text-base md:text-lg font-medium">
                    {question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-sm md:text-base text-gray-600">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;