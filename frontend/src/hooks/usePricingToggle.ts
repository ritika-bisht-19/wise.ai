import { useState } from 'react';

export function usePricingToggle() {
  const [annual, setAnnual] = useState(false);
  const toggleAnnual = () => setAnnual((a) => !a);

  return { annual, toggleAnnual };
}
