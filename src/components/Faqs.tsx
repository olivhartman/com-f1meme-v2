"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useTranslation } from "../i18n/TranslationContext"

export default function Faqs() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: t.additional.faq1Question,
      answer: t.additional.faq1Answer,
    },
    {
      question: t.additional.faq2Question,
      answer: t.additional.faq2Answer,
    },
    {
      question: t.additional.faq3Question,
      answer: t.additional.faq3Answer,
    },
    {
      question: t.additional.faq4Question,
      answer: t.additional.faq4Answer,
    },
    {
      question: t.additional.faq5Question,
      answer: t.additional.faq5Answer,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-16 relative z-10"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-yellow-500 mb-4">{t.additional.faq}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          {t.additional.faqDesc}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-3 sm:space-y-4"
      >
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={item} className="overflow-hidden">
            <Card className="backdrop-blur-sm border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 hover:bg-yellow-500/5 transition-colors duration-200 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-yellow-400">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-yellow-500/5"
                  >
                    <CardContent className="p-6 pt-2 text-gray-300 leading-relaxed border-t border-yellow-500/10">
                      {faq.answer}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mt-16 text-center">
        <Card className="backdrop-blur-sm border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">{t.additional.stillHaveQuestions}</h3>
            <p className="text-gray-300 mb-6">
              {t.additional.joinCommunity}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/F1memeBoxbox"
                className="px-6 py-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors duration-300 flex items-center gap-2"
              >
                <span>{t.additional.twitter}</span>
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors duration-300 flex items-center gap-2"
              >
                <span>{t.additional.telegram}</span>
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors duration-300 flex items-center gap-2"
              >
                <span>{t.additional.youtube}</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

