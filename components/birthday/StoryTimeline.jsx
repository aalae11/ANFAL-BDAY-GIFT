"use client";

import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function StoryTimeline({ lineIndex = 0 }) {
  const line = birthdayConfig.story[lineIndex] ?? birthdayConfig.story[0];

  return (
    <section className={styles.storySection}>
      <motion.article
        className={styles.storyPanel}
        initial={{ opacity: 0, y: 48, scale: 0.95, filter: "blur(16px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{String(lineIndex + 1).padStart(2, "0")}</span>
        <h2>{line}</h2>
      </motion.article>
    </section>
  );
}
