// Shared Framer Motion animation variants

// ─── PAGE TRANSITIONS ─────────────────────────────────────
// Energetic: slide in from right with spring physics, slide out to left
export const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// ─── CARDS / LIST ITEMS ───────────────────────────────────
// Usage: custom={index} on each motion.div child
export const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      type: 'spring',
      stiffness: 300,
      damping: 22,
    },
  }),
};

// Stagger container — wrap a list of cardVariants children with this
export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

// ─── SLIDE UP (for sections / stat blocks) ────────────────
export const slideUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

// ─── MODALS ───────────────────────────────────────────────
export const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// ─── FADE IN (simple) ─────────────────────────────────────
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ─── SECTION STAGGER (dashboard page sections) ───────────
// Wrap a page's top-level sections; each child uses slideUpVariants
export const sectionStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// ─── SIDEBAR (mobile overlay) ────────────────────────────
export const sidebarOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
