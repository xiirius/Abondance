import { useRef } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";

const COVER_URL =
  "https://static.prod-images.emergentagent.com/jobs/be65cac7-0d82-47fa-bfb3-1ce38ce057f2/images/dc00c9b97cbf43afcc71cbc2af5b370c76a12969e323906fd1a393edcbd7fa84.jpeg";

export function BookCover() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [9, -9]);
  const rotateY = useTransform(mx, [0, 1], [-12, 12]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-56 sm:w-64 lg:w-72"
      data-testid="book-cover-3d"
    >
      <div className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full aura" aria-hidden="true" />
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <img
          src={COVER_URL}
          alt="Couverture du Guide de l'Abondance Intérieure"
          className="book-shadow w-full rounded-r-xl rounded-l-sm"
          loading="eager"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[6%] rounded-l-sm bg-gradient-to-r from-black/25 via-black/5 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-r-xl bg-gradient-to-tr from-transparent via-white/0 to-white/25"
          aria-hidden="true"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-white/90 px-4 py-1.5 font-sans text-xs font-medium text-ink shadow-md backdrop-blur"
        data-testid="book-cover-badge"
      >
        Ebook PDF — accès immédiat
      </motion.div>
    </div>
  );
}
