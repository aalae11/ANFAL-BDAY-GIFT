"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function LetterReveal({ onComplete }) {
  const [open, setOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setVisibleLines(0);
    const timer = window.setInterval(() => {
      setVisibleLines((count) => {
        const nextCount = count + 1;

        if (nextCount >= birthdayConfig.letter.length) {
          window.clearInterval(timer);
          onComplete?.();
          return birthdayConfig.letter.length;
        }

        return nextCount;
      });
    }, 560);
    return () => window.clearInterval(timer);
  }, [onComplete, open]);

  return (
    <section className={styles.letterSection}>
      <motion.div className={styles.letterEnvelope} whileHover={{ y: -6 }}>
        {!open && (
          <button type="button" className={styles.primaryButton} onClick={() => setOpen(true)}>
            Open the letter
          </button>
        )}
        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.letterPaper}
              initial={{ opacity: 0, y: 60, rotateX: -24 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            >
              {birthdayConfig.letter.slice(0, visibleLines).map((line) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
