import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQ() {
  return (
    <div>
      <div className="">
        <h1>Frequently Asked Questions</h1>
        <p>
          Here are some frequently asked questions by students. If you can't
          find an answer for your query here, feel free to contact us.
        </p>
      </div>
      <div className="">
        <Accordion type="multiple" >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How many tests are there and what is the schedule?
            </AccordionTrigger>
            <AccordionContent>
              Please refer to this section: Click here
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I attempt a test any time or is it mandatory to attempt it on
              the particular date & time mentioned in the schedule?
            </AccordionTrigger>
            <AccordionContent>
              The dates listed in the test schedule show when the tests will be
              uploaded. This means you can start attempting them from those
              dates. You don't have to take the tests on those exact days. Once
              they're uploaded and ready, you can take the tests whenever you
              want until the test series expires. Note: 1. The previously
              uploaded tests can also be attempted. 2. You will get analysis and
              ranking irrespective of the date on which you attempt the test.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it for only Mathematics?</AccordionTrigger>
            <AccordionContent>
              No, the test series includes all the three subjects i.e., Physics,
              Chemistry and Mathematics.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What is the price and validity?</AccordionTrigger>
            <AccordionContent>
              The price is mentioned in pricing section. Please refer to it.
              Both the test series i.e., Chapter-wise & Full Syllabus for JEE
              Advanced are valid till JEE Advanced 2025 (whenever it commences).{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Is there any discount?</AccordionTrigger>
            <AccordionContent>
              Yes. Refer to the pricing section
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>Is there any refund policy?</AccordionTrigger>
            <AccordionContent>
              No. The fee paid is non-refundable in any case.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>Can I take the tests on mobile?</AccordionTrigger>
            <AccordionContent>
              Yes, you can take the tests on any device like mobile, PC, laptop
              as long as it supports Google Chrome browser and has internet
              connection.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger>
              What are the technical requirements to take the tests?
            </AccordionTrigger>
            <AccordionContent>
              A device supporting Google Chrome web-browser and a good internet
              connection.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger>Can I take a test twice?</AccordionTrigger>
            <AccordionContent>No, you cannot.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger>
              Can I give the tests inside the MathonGo app?
            </AccordionTrigger>
            <AccordionContent>
              No. You need to take it on our website whose link you will receive
              after registration.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-11">
            <AccordionTrigger>Is there any scholarship?</AccordionTrigger>
            <AccordionContent>
              Yes. In JEE Advanced 2025, if you get All India Rank (AIR): Under
              1000: 100% refund Under 2500: 50% refund Under 5000: 30% refund
              Under 10000: 10% refund of the amount paid. You will be required
              to share your JEE Advanced 2025 score/rank card along with a video
              testimonial. Note: The acceptance period for scholarship results
              extends until 60 days following the declaration of said results.
              Requests made beyond this timeframe will not be entertained.{" "}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
export default FAQ;
