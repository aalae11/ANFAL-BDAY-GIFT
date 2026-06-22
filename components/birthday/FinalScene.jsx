"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function FinalScene({ onReplay }) {
  const [wishMade, setWishMade] = useState(false);
  const [holdingCandle, setHoldingCandle] = useState(false);
  const holdTimerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const clearHoldTimer = useCallback(() => {
    if (!holdTimerRef.current) return;
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  const revealWish = useCallback(() => {
    clearHoldTimer();
    setHoldingCandle(false);
    setWishMade(true);
  }, [clearHoldTimer]);

  function handleCandlePress() {
    if (wishMade) return;

    clearHoldTimer();
    setHoldingCandle(true);
    holdTimerRef.current = window.setTimeout(revealWish, prefersReducedMotion ? 80 : 900);
  }

  function handleCandleRelease() {
    setHoldingCandle(false);
    clearHoldTimer();
  }

  function handleCandleKeyDown(event) {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    handleCandlePress();
  }

  function handleCandleKeyUp(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleCandleRelease();
  }

  useEffect(() => {
    return () => clearHoldTimer();
  }, [clearHoldTimer]);

  return (
    <section className={styles.finalSection} data-wish-made={wishMade}>
      <div className={styles.finalLights} aria-hidden="true" />
      <motion.div
        className={styles.finalCake}
        initial={{ opacity: 0, y: 70, scale: 0.86 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={birthdayConfig.final.cakeImage} alt="" className={styles.cakeGif} draggable="false" />
        <button
          aria-label={birthdayConfig.final.candlePrompt}
          className={styles.candleWishButton}
          data-holding={holdingCandle}
          data-wish-made={wishMade}
          onPointerCancel={handleCandleRelease}
          onPointerDown={handleCandlePress}
          onPointerLeave={handleCandleRelease}
          onPointerUp={handleCandleRelease}
          onKeyDown={handleCandleKeyDown}
          onKeyUp={handleCandleKeyUp}
          type="button"
        >
          <span className={styles.candleFlame} aria-hidden="true" />
        </button>
      </motion.div>
      <AnimatePresence mode="wait">
        {!wishMade && (
          <motion.span
            className={styles.candlePrompt}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.44 }}
          >
            {birthdayConfig.final.candlePrompt}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.h2
        initial={{ opacity: 0, y: 42, filter: "blur(16px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay: 0.18 }}
      >
        {birthdayConfig.final.headlinePrefix} {birthdayConfig.personName}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.45 }}
      >
        {birthdayConfig.final.subtext}
      </motion.p>
      <AnimatePresence>
        {wishMade && (
          <motion.strong
            className={styles.finalWishReveal}
            initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            {birthdayConfig.final.wishReveal}
          </motion.strong>
        )}
      </AnimatePresence>
      <button type="button" className={styles.primaryButton} onClick={onReplay}>
        Replay the surprise
      </button>
    </section>
  );
}
