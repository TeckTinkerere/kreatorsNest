/**
 * Shared Framer Motion presets — always pair with useReducedMotion().
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/** Page enter/exit (route-level) */
export const pageTransition = (reduceMotion) =>
  reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: EASE_OUT_EXPO };

export const pageVariants = (reduceMotion) =>
  reduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

/** Content swap (mode / filter / tab) */
export const contentTransition = (reduceMotion) =>
  reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: EASE_OUT_EXPO };

export const contentVariants = (reduceMotion) =>
  reduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

/** Staggered list container */
export const staggerContainer = (reduceMotion, stagger = 0.06) =>
  reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: 0.04 },
        },
      };

export const staggerItem = (reduceMotion) =>
  reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE_OUT_EXPO },
        },
      };

/** Spring for layoutId pills / indicators */
export const layoutSpring = (reduceMotion) =>
  reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 420, damping: 32 };
