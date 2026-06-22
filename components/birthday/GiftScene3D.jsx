"use client";

import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function GiftScene3D({ opened, onOpen, active }) {
  return (
    <div className={styles.giftStage}>
      <motion.div
        className={styles.giftCopy}
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, delay: 0.35 }}
      >
        <p>{birthdayConfig.gift.eyebrow}</p>
        <h2>{birthdayConfig.gift.title}</h2>
        <span>{opened ? "Her gallery is opening..." : birthdayConfig.gift.hint}</span>
      </motion.div>
      <motion.div
        className={styles.canvasShell}
        initial={{ opacity: 0, scale: 0.82, filter: "blur(18px)" }}
        animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.2, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={birthdayConfig.gift.image}
          alt="Animated pink gift box"
          className={styles.giftGif}
          draggable="false"
          animate={opened ? { scale: 1.05, y: -8 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className={opened ? styles.portalOpen : styles.portalGlow} />
        <button className={styles.giftHitArea} type="button" onClick={onOpen} aria-label="Open the gift" />
      </motion.div>
    </div>
  );
}
