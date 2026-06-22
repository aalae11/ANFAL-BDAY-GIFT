"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

function normalizeDigits(value) {
  return String(value)
    .normalize("NFKC")
    .replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code <= 0x0669 ? code - 0x0660 : code - 0x06f0);
    });
}

function getPinDigits(value, digitCount) {
  return normalizeDigits(value).replace(/[^0-9]/g, "").slice(0, digitCount);
}

export default function PinGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const codeRef = useRef("");
  const digitCount = birthdayConfig.access.code.length;

  function focusInput() {
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function clearCode() {
    codeRef.current = "";
    setCode("");
    focusInput();
  }

  function handleSubmit(event) {
    event?.preventDefault();
    const pin = getPinDigits(codeRef.current || code, digitCount);
    const expectedPin = String(birthdayConfig.access.code);

    console.log("[PinGate] Open button clicked");
    console.log("[PinGate] Code value:", pin);

    if (pin === expectedPin) {
      setError("");
      onUnlock();
      return;
    }

    setError(birthdayConfig.access.error);
    clearCode();
  }

  function handleCodeChange(event) {
    const nextCode = getPinDigits(event.target.value, digitCount);
    codeRef.current = nextCode;
    setCode(nextCode);
    setError("");
  }

  function handleCodeKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <section className={styles.pinSection}>
      <motion.div
        className={styles.pinAura}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className={styles.pinCard}
        initial={false}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        role="form"
      >
        <p>{birthdayConfig.access.hint}</p>
        <h1>{birthdayConfig.access.title}</h1>
        <div className={styles.pinInputWrap} onClick={focusInput}>
          <span>{birthdayConfig.access.placeholder}</span>
          <div className={styles.pinDigitRow} aria-hidden="true">
            {Array.from({ length: digitCount }).map((_, index) => (
              <i className={styles.pinDigit} data-filled={Boolean(code[index])} key={index} />
            ))}
          </div>
          <input
            ref={inputRef}
            aria-label={birthdayConfig.access.placeholder}
            autoComplete="one-time-code"
            autoFocus
            className={styles.pinHiddenInput}
            enterKeyHint="done"
            inputMode="numeric"
            onChange={handleCodeChange}
            onKeyDown={handleCodeKeyDown}
            pattern="[0-9]*"
            spellCheck={false}
            type="tel"
            value={code}
          />
        </div>
        <button type="button" className={styles.primaryButton} onClick={handleSubmit}>
          {birthdayConfig.access.submitLabel}
        </button>
        <span className={styles.pinError} aria-live="polite">
          {error}
        </span>
      </motion.div>
    </section>
  );
}
