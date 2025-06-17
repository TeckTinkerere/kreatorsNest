import { useRef } from "react";
import { motion/*, useAnimation */ } from "framer-motion";

const badClientScenarios = [
  {
    scenario: "Client keeps changing project scope without adjusting budget.",
    advice: "Set clear boundaries and update contracts for any scope changes before proceeding.",
  },
  {
    scenario: "Late payments affecting your cash flow.",
    advice: "Always specify payment terms upfront and consider partial upfront deposits.",
  },
  {
    scenario: "Client requests multiple unlimited revisions.",
    advice: "Define revision limits clearly in your agreement to avoid burnout.",
  },
  {
    scenario: "No clear brief or project details from client.",
    advice: "Use a project intake form or questionnaire to clarify requirements before starting.",
  },
  {
    scenario: "Client demands work before contract signing.",
    advice: "Never start work without a signed agreement; it protects your time and rights.",
  },
  {
    scenario: "Client is unresponsive or delays feedback repeatedly.",
    advice: "Set clear deadlines for feedback and communicate consequences of delays upfront."
  },
  {
    scenario: "Client asks for free samples or work without compensation.",
    advice: "Politely decline unpaid work and offer paid trial options if necessary."
  },
  {
    scenario: "Client provides contradictory instructions or changes mind frequently.",
    advice: "Document all communications and confirm key decisions in writing."
  },
  {
    scenario: "Client expects work to be done outside of agreed hours or scope.",
    advice: "Stick to agreed terms and negotiate additional work as a separate project."
  },
  {
    scenario: "Client compares your rates to cheaper competitors constantly.",
    advice: "Focus on the value and quality you provide rather than competing on price."
  },
  {
    scenario: "Client ignores professional advice or insists on unfeasible requests.",
    advice: "Explain your recommendations clearly and decide if the project is a good fit."
  },
  {
    scenario: "Client is rude or disrespectful in communication.",
    advice: "Maintain professionalism but set boundaries and consider ending the relationship if it continues."
  },
  {
    scenario: "Client pressures you for unrealistic deadlines.",
    advice: "Negotiate timelines honestly and explain the impact of rushing on quality."
  },
  {
    scenario: "Client requests confidential or unethical work.",
    advice: "Refuse any work that compromises your ethics or legal standards."
  },
  {
    scenario: "Client uses your work without proper credit or payment.",
    advice: "Protect your work with contracts and enforce your rights if necessary."
  },
  {
    scenario: "Client constantly micromanages or second-guesses your expertise.",
    advice: "Set expectations about your workflow and establish trust early."
  },
  {
    scenario: "Client fails to provide necessary resources or access to complete the work.",
    advice: "Clarify required resources upfront and pause work until they are provided."
  },
  {
    scenario: "Client asks for 'just one more thing' repeatedly after project completion.",
    advice: "Define a clear project completion point and charge for additional work."
  },
  {
    scenario: "Client requests you to work for free as a favor or to 'build relationship.'",
    advice: "Value your time and explain that your professional work requires fair compensation."
  },
  {
    scenario: "Client disputes or delays payment without valid reasons.",
    advice: "Have a clear invoicing and dispute resolution process in your contract."
  },  
];

export default function AdviceCarousel() {
  const carouselRef = useRef(null);

  // Scroll Left & Right functions
  function scrollLeft() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }
  function scrollRight() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }

  return (
    <div className="relative py-12 bg-gray-50">
      <h3 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Common Freelancer Challenges & How to Handle Them
      </h3>

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-6 px-8 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {badClientScenarios.map(({ scenario, advice }, idx) => (
          <motion.div
            key={idx}
            className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-lg p-6 flex flex-col snap-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <h4 className="text-lg font-semibold text-red-600 mb-3">
              ❌ Problem:
            </h4>
            <p className="text-gray-700 mb-5 flex-grow">{scenario}</p>
            <h5 className="text-md font-semibold text-green-700 mb-1">💡 Advice:</h5>
            <p className="text-gray-600 italic">{advice}</p>
          </motion.div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll Left"
        className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 transition"
      >
        ‹
      </button>
      <button
        onClick={scrollRight}
        aria-label="Scroll Right"
        className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 transition"
      >
        ›
      </button>
    </div>
  );
}
