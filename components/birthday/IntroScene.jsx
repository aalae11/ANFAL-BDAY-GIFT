"use client";

import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function IntroScene({ started, onStart }) {
  return (
    <AnimatePresence>
      {!started && (
        <motion.section
          className={styles.intro}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)", scale: 1.04 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className={styles.introAura}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
          <div className={styles.introContent}>
            <motion.p
              className={styles.introEyebrow}
              initial={false}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.25 }}
            >
              {birthdayConfig.intro.headsetText}
            </motion.p>
            <motion.h1
              className={styles.introTitle}
              initial={false}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
            >
              For {birthdayConfig.personName}
            </motion.h1>
            <motion.p
              className={styles.introSubtitle}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              {birthdayConfig.intro.subtitle}
            </motion.p>
            <motion.button
              type="button"
              className={styles.primaryButton}
              onClick={onStart}
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.8, delay: 1.05 }}
            >
              {birthdayConfig.intro.startLabel}
            </motion.button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
