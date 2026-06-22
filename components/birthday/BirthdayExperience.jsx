"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import PinGate from "./PinGate";
import IntroScene from "./IntroScene";
import GiftScene3D from "./GiftScene3D";
import HerGallery from "./HerGallery";
import StoryTimeline from "./StoryTimeline";
import LetterReveal from "./LetterReveal";
import FinalScene from "./FinalScene";
import MusicController from "./MusicController";
import styles from "./BirthdayExperience.module.css";

const PIN_PAGE = 0;
const INTRO_PAGE = 1;
const GIFT_PAGE = 2;
const GALLERY_PAGE = 3;
const STORY_START_PAGE = 4;

export default function BirthdayExperience() {
  const [started, setStarted] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [letterComplete, setLetterComplete] = useState(false);
  const [experienceKey, setExperienceKey] = useState(0);
  const [pageIndex, setPageIndex] = useState(PIN_PAGE);
  const [direction, setDirection] = useState(1);
  const pageSwipeStart = useRef(null);

  const letterPage = STORY_START_PAGE + birthdayConfig.story.length;
  const finalPage = letterPage + 1;
  const navPages = Array.from({ length: finalPage - GIFT_PAGE + 1 }, (_, index) => GIFT_PAGE + index);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pageIndex]);

  const goToPage = useCallback((nextPage) => {
    setPageIndex((currentPage) => {
      const boundedPage = Math.min(Math.max(nextPage, PIN_PAGE), finalPage);
      setDirection(boundedPage >= currentPage ? 1 : -1);
      return boundedPage;
    });
  }, [finalPage]);

  function handleUnlock() {
    goToPage(INTRO_PAGE);
  }

  function handleStart() {
    setStarted(true);
    goToPage(GIFT_PAGE);
  }

  function handleGiftOpen() {
    if (giftOpened) return;
    setGiftOpened(true);
    window.setTimeout(() => {
      goToPage(GALLERY_PAGE);
    }, 1150);
  }

  const handleLetterComplete = useCallback(() => {
    setLetterComplete(true);
  }, []);

  function handleReplay() {
    setExperienceKey((key) => key + 1);
    setStarted(false);
    setGiftOpened(false);
    setLetterComplete(false);
    setDirection(-1);
    setPageIndex(PIN_PAGE);
  }

  function renderPage() {
    if (pageIndex === PIN_PAGE) {
      return <PinGate onUnlock={handleUnlock} />;
    }

    if (pageIndex === INTRO_PAGE) {
      return <IntroScene started={started} onStart={handleStart} />;
    }

    if (pageIndex === GIFT_PAGE) {
      return (
        <section className={styles.heroScene} aria-label="Gift box scene">
          <GiftScene3D opened={giftOpened} onOpen={handleGiftOpen} active={started} />
        </section>
      );
    }

    if (pageIndex === GALLERY_PAGE) {
      return <HerGallery unlocked={giftOpened} />;
    }

    if (pageIndex >= STORY_START_PAGE && pageIndex < letterPage) {
      return <StoryTimeline lineIndex={pageIndex - STORY_START_PAGE} />;
    }

    if (pageIndex === letterPage) {
      return <LetterReveal onComplete={handleLetterComplete} />;
    }

    return <FinalScene onReplay={handleReplay} />;
  }

  const canGoBack = pageIndex > INTRO_PAGE && pageIndex < finalPage;
  const canGoNext =
    (pageIndex === GIFT_PAGE && giftOpened) ||
    (pageIndex >= GALLERY_PAGE && pageIndex < letterPage) ||
    (pageIndex === letterPage && letterComplete);
  const nextLabel = pageIndex === letterPage ? (letterComplete ? "Finish" : "Read letter") : "Continue";
  const canSwipePage = pageIndex > INTRO_PAGE && pageIndex < finalPage && pageIndex !== GALLERY_PAGE;

  function handleNextPage() {
    if (!canGoNext) return;
    goToPage(pageIndex + 1);
  }

  function handlePreviousPage() {
    if (!canGoBack) return;
    goToPage(pageIndex - 1);
  }

  function handlePagePointerDown(event) {
    if (!canSwipePage) return;
    if (event.target.closest?.("button, input, textarea, select, a, label")) return;

    pageSwipeStart.current = {
      x: event.clientX,
      y: event.clientY
    };
  }

  function handlePagePointerUp(event) {
    if (!pageSwipeStart.current) return;

    const distanceX = event.clientX - pageSwipeStart.current.x;
    const distanceY = event.clientY - pageSwipeStart.current.y;
    pageSwipeStart.current = null;

    if (Math.abs(distanceX) < 64 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) return;

    if (distanceX < 0) {
      handleNextPage();
      return;
    }

    handlePreviousPage();
  }

  useEffect(() => {
    if (pageIndex <= INTRO_PAGE || pageIndex >= finalPage) return undefined;

    function handleKeyDown(event) {
      if (event.key === "ArrowRight" && canGoNext) {
        goToPage(pageIndex + 1);
      }

      if (event.key === "ArrowLeft" && canGoBack) {
        goToPage(pageIndex - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, canGoNext, finalPage, goToPage, pageIndex]);

  return (
    <main key={experienceKey} className={styles.experience}>
      <MusicController started={started} />
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          animate={{ opacity: 1, x: 0, scale: 1, rotateZ: 0, filter: "blur(0px)" }}
          className={styles.pageShell}
          custom={direction}
          exit={{ opacity: 0, x: direction * -58, scale: 0.985, rotateZ: direction * -0.45, filter: "blur(14px)" }}
          initial={pageIndex === PIN_PAGE ? false : { opacity: 0, x: direction * 58, scale: 0.985, rotateZ: direction * 0.45, filter: "blur(14px)" }}
          key={pageIndex}
          onPointerCancel={() => {
            pageSwipeStart.current = null;
          }}
          onPointerDown={handlePagePointerDown}
          onPointerUp={handlePagePointerUp}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {pageIndex > INTRO_PAGE && pageIndex < finalPage && (
        <nav className={styles.pageControls} aria-label="Page navigation">
          <button type="button" className={styles.pageBackButton} onClick={handlePreviousPage} disabled={!canGoBack}>
            Back
          </button>
          <div className={styles.pageDots} aria-label="Birthday page progress">
            {navPages.map((page) => {
              const locked = !giftOpened && page > GIFT_PAGE;
              return (
                <button
                  aria-label={`Go to page ${page - GIFT_PAGE + 1}`}
                  aria-current={page === pageIndex ? "step" : undefined}
                  className={styles.pageDot}
                  data-active={page === pageIndex}
                  data-seen={page < pageIndex}
                  disabled={locked}
                  key={page}
                  onClick={() => goToPage(page)}
                  type="button"
                />
              );
            })}
          </div>
          <button type="button" className={styles.pageContinueButton} onClick={handleNextPage} disabled={!canGoNext}>
            {nextLabel}
          </button>
        </nav>
      )}
    </main>
  );
}
