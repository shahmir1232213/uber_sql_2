// src/hooks/useGSAP.js
import { useLayoutEffect } from 'react';
import gsap from 'gsap';

/**
 * A custom hook for running GSAP animations.
 *
 * @param {object} ref - The React ref for the target element.
 * @param {object} animationProps - The GSAP animation properties.
 * @param {Array} deps - Additional dependencies that will re-run the animation.
 */
const useGSAP = (ref, animationProps, deps = []) => {
  useLayoutEffect(() => {
    if (ref.current) {
      gsap.to(ref.current, animationProps);
    }
    // We intentionally exclude gsap and other internals from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
};

export default useGSAP;
