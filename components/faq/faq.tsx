"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "Do I need a referral?",
    answer:
      "No. You don’t need permission, paperwork, or a referral to get started. If you have a concern, you can submit your case directly.",
  },
  {
    question: "Do you take insurance?",
    answer:
      "No. XPRT2ND is cash-based so we can move quickly and connect you with the top orthopedic specialists from across the country, without waiting weeks for insurance approval. Most reviews are completed within 24–48 hours.",
  },
  {
    question: "What do I need to submit?",
    answer:
      "Upload whatever you have. X-rays, MRIs, prior reports, or notes from your doctor. You’ll also describe your pain and symptoms in your own words. If something important is missing, we’ll guide you.",
  },
  {
    question: "Can I cancel or reschedule?",
    answer:
      "You can manage appointments from your dashboard where cancellations and rescheduling are available.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All user data is encrypted and handled securely following healthcare protection standards.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach support through the contact page or from your dashboard help section.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-5">     Frequently Asked Questions        </h2>
        <p className="text-black text-center mb-12">When you have a question, chances are someone else has too. Here are the answers to the most common questions about our platform.

</p>

        <div className="grid gap-4 md:grid-cols-1">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <span
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
