import { useState } from 'react';

/**
 * Pointer hover state for web. Returns props to spread onto a Pressable
 * (onHoverIn/onHoverOut are no-ops on touch devices). Lets interactive
 * surfaces show a hover affordance on desktop web without per-component
 * boilerplate or untyped Pressable style-callback fields.
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    hoverProps: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
    },
  };
}
