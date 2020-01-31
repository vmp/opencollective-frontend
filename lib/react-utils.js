/**
 * Combine multiple refs into one
 */

export const combineRefs = (...refs) => {
  return target => {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(target);
      } else {
        ref.current = target;
      }
    });
  };
};
