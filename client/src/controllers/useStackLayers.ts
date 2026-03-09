import { useState } from 'react';

export function useStackLayers() {
  const [active, setActive] = useState(0);
  return { active, setActive };
}
