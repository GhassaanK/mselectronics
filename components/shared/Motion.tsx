"use client"

import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"

// ── Reveal: single element fade-up on scroll ──────────────
export function Reveal({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── FadeIn: opacity only, no Y movement ──────────────────
export function FadeIn({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerParent: wraps a group, staggers children ───────
export function StaggerParent({
  children,
  className,
  stagger = 0.07,
}: PropsWithChildren<{ className?: string; stagger?: number }>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerChild: must be a direct child of StaggerParent ─
export function StaggerChild({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}