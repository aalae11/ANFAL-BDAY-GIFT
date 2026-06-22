"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

function getCarouselOffset(index, activeIndex, total) {
  const rawOffset = index - activeIndex;
  const half = total / 2;

  if (rawOffset > half) return rawOffset - total;
  if (rawOffset < -half) return rawOffset + total;

  return rawOffset;
}

function normalizeIndex(index, total) {
  return ((index % total) + total) % total;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function HerGallery({ unlocked }) {
  const cards = birthdayConfig.galleryCards ?? [];
  const [rotationStep, setRotationStep] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);
  const pointerStartX = useRef(null);
  const dragWidth = useRef(1);
  const dragMoved = useRef(false);
  const dragProgressRef = useRef(0);
  const secretTimerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = cards.length ? normalizeIndex(rotationStep, cards.length) : 0;
  const gallerySecret = birthdayConfig.gallerySecret;

  const clearSecretPress = useCallback(() => {
    if (!secretTimerRef.current) return;
    window.clearTimeout(secretTimerRef.current);
    secretTimerRef.current = null;
  }, []);

  const showCard = useCallback(
    (nextIndex) => {
      if (!cards.length) return;
      setRotationStep((step) => {
        const currentIndex = normalizeIndex(step, cards.length);
        let distance = normalizeIndex(nextIndex, cards.length) - currentIndex;

        if (distance > cards.length / 2) distance -= cards.length;
        if (distance < -cards.length / 2) distance += cards.length;

        return step + distance;
      });
    },
    [cards.length]
  );

  useEffect(() => {
    if (!unlocked || prefersReducedMotion || isDragging || cards.length < 2) return undefined;

    const rotation = window.setInterval(() => {
      setRotationStep((step) => step + 1);
    }, 4200);

    return () => window.clearInterval(rotation);
  }, [cards.length, isDragging, prefersReducedMotion, unlocked]);

  useEffect(() => {
    clearSecretPress();
    setSecretVisible(false);
  }, [activeIndex, clearSecretPress]);

  useEffect(() => {
    return () => clearSecretPress();
  }, [clearSecretPress]);

  if (!cards.length) return null;

  const activeCard = cards[activeIndex];

  function handlePointerDown(event) {
    if (cards.length < 2) return;

    pointerStartX.current = event.clientX;
    dragWidth.current = event.currentTarget.clientWidth || 1;
    dragMoved.current = false;
    dragProgressRef.current = 0;
    setDragProgress(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    const progress = distance / Math.max(dragWidth.current * 0.34, 1);

    dragMoved.current = Math.abs(distance) > 7;
    if (dragMoved.current) clearSecretPress();
    dragProgressRef.current = clamp(progress, -1, 1);
    setDragProgress(dragProgressRef.current);
  }

  function handlePointerUp(event) {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    const finalDragProgress = dragProgressRef.current;
    const shouldSlide = Math.abs(distance) > 42 || Math.abs(finalDragProgress) > 0.28;

    pointerStartX.current = null;
    dragProgressRef.current = 0;
    clearSecretPress();
    setIsDragging(false);
    setDragProgress(0);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (!shouldSlide) return;

    if (finalDragProgress > 0) {
      setRotationStep((step) => step - 1);
      return;
    }

    setRotationStep((step) => step + 1);
  }

  function handlePointerCancel(event) {
    pointerStartX.current = null;
    dragProgressRef.current = 0;
    clearSecretPress();
    setIsDragging(false);
    setDragProgress(0);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function handleCardPointerDown(index) {
    if (index !== activeIndex || !gallerySecret?.reveal) return;

    clearSecretPress();
    secretTimerRef.current = window.setTimeout(() => {
      setSecretVisible(true);
      secretTimerRef.current = null;
    }, prefersReducedMotion ? 80 : 720);
  }

  return (
    <motion.section
      className={styles.gallerySection}
      initial={false}
      animate={unlocked ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.3, y: 34, scale: 0.98 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
    >
      <div className={styles.sectionHeader}>
        <p className={styles.galleryKicker}>Every picture has its own kind of light.</p>
        <h2>Her Gallery</h2>
        <span className={styles.gallerySubtitle}>A little universe made from your pictures.</span>
      </div>

      <div className={styles.carouselShell} aria-label="Her photo gallery">
        <div
          className={styles.carouselViewport}
          data-dragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerLeave={() => {
            if (pointerStartX.current !== null) return;
            setIsDragging(false);
          }}
          onPointerCancel={handlePointerCancel}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onContextMenu={(event) => event.preventDefault()}
        >
          <div className={styles.carouselAnchor}>
            <div className={styles.carouselStage}>
              {cards.map((card, index) => {
                const offset = getCarouselOffset(index, activeIndex, cards.length);
                const visualOffset = offset + dragProgress;
                const absoluteOffset = Math.abs(visualOffset);
                const isVisible = absoluteOffset <= 2.35;
                const scale = clamp(1.08 - absoluteOffset * 0.18, 0.56, 1.08);
                const opacity = absoluteOffset <= 0.35 ? 1 : absoluteOffset <= 1.35 ? 0.72 : absoluteOffset <= 2.35 ? 0.2 : 0;
                const blur = absoluteOffset <= 0.35 ? 0 : absoluteOffset <= 1.35 ? 0.3 : 1.9;
                const translateZ = clamp(72 - absoluteOffset * 82, -135, 72);
                const rotateY = clamp(visualOffset * -32, -54, 54);
                const translateX = visualOffset * 82;
                const imageLoading = isVisible ? "eager" : "lazy";

                return (
                  <button
                    aria-label={`Show ${card.title}`}
                    aria-hidden={!isVisible}
                    className={styles.carouselCard}
                    data-active={absoluteOffset <= 0.35}
                    data-visible={isVisible}
                    key={card.image}
                    onClick={() => {
                      if (dragMoved.current) return;
                      showCard(index);
                    }}
                    onPointerDown={() => handleCardPointerDown(index)}
                    style={{
                      opacity,
                      transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      "--gallery-card-blur": `${blur}px`,
                      zIndex: Math.round(100 - absoluteOffset * 16)
                    }}
                    tabIndex={isVisible ? 0 : -1}
                    type="button"
                  >
                    <span className={styles.carouselFrame}>
                      <img
                        className={styles.carouselImage}
                        src={card.image}
                        alt={card.title}
                        loading={imageLoading}
                        fetchPriority={absoluteOffset <= 0.35 ? "high" : "auto"}
                        decoding="async"
                        draggable="false"
                      />
                      <img
                        className={styles.carouselReflection}
                        src={card.image}
                        alt=""
                        aria-hidden="true"
                        loading={imageLoading}
                        decoding="async"
                        draggable="false"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.carouselProgress} aria-hidden="true">
          <div className={styles.carouselDots}>
            {cards.map((card, index) => (
              <span className={styles.carouselDot} data-active={index === activeIndex} key={card.image} />
            ))}
          </div>
          <span>Swipe the gallery</span>
          {gallerySecret?.hint && <small>{gallerySecret.hint}</small>}
        </div>

        <div className={styles.galleryCaption} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className={styles.galleryCaptionInner}
              exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              key={activeCard.image}
              transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.galleryCaptionIndex}>
                {String(activeIndex + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
              </span>
              <h3>{activeCard.title}</h3>
              <p>
                <span aria-hidden="true">"</span>
                {activeCard.quote}
                <span aria-hidden="true">"</span>
              </p>
              <AnimatePresence>
                {secretVisible && gallerySecret?.reveal && (
                  <motion.strong
                    className={styles.gallerySecret}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {gallerySecret.reveal}
                  </motion.strong>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
