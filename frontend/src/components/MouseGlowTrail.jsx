// MouseDisc.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Solid cursor disc (flat, non-blurry) with smooth trailing.
 * - Disc size: 12px (feel free to change `DISC_SIZE`)
 * - Color: very pale purple (#F6EEFF). Adjust if you want lighter/darker.
 * - Hides automatically on touch devices.
 */

const DISC_SIZE = 22; // px - small flat disc
const DISC_COLOR = "#e7d2feff"; // very light purple (change if needed)
const LERP_FACTOR = 0.35; // smoothing (0 = no movement, 1 = immediate)

const MouseDisc = () => {
  const [visible, setVisible] = useState(false);

  // Target position (raw mouse)
  const target = useRef({ x: 0, y: 0 });
  // Rendered position (interpolated)
  const renderPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const discRef = useRef(null);

  // Hide on touch devices immediately
  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      return; // do not attach listeners for touch devices
    }

    const handleMove = (e) => {
      // Use clientX/Y for cursor
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mouseenter", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mouseenter", handleMove);
    };
  }, [visible]);

  // RAF loop to lerp the render position toward the target
  useEffect(() => {
    const loop = () => {
      // lerp each axis
      renderPos.current.x += (target.current.x - renderPos.current.x) * LERP_FACTOR;
      renderPos.current.y += (target.current.y - renderPos.current.y) * LERP_FACTOR;

      // update element transform
      if (discRef.current) {
        // center the disc by subtracting half the DISC_SIZE
        const tx = Math.round(renderPos.current.x - DISC_SIZE / 2);
        const ty = Math.round(renderPos.current.y - DISC_SIZE / 2);
        discRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Render nothing on touch devices (defensive check)
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "opacity 220ms ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Disc element: absolutely positioned via transform in RAF loop */}
      <div
        ref={discRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: `${DISC_SIZE}px`,
          width: `${DISC_SIZE}px`,
          borderRadius: "50%", // disc shape
          backgroundColor: DISC_COLOR,
          boxShadow: "none", // keep it a flat disc (no blur)
          transform: `translate3d(-9999px, -9999px, 0)`, // start off-screen
          transition: "transform 120ms linear", // tiny smoothing on abrupt jumps
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default MouseDisc;
