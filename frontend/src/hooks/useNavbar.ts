import { useState, useEffect, useRef } from 'react';

export function useNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDropdownMenu = (label: string) => {
    clearCloseTimer();
    setOpenDropdown(label);
  };

  const scheduleCloseDropdown = () => {
    clearCloseTimer();
    // Small delay prevents accidental close while moving from chevron to menu.
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
      closeTimerRef.current = null;
    }, 180);
  };

  const cancelScheduledClose = () => {
    clearCloseTimer();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return {
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
    openDropdownMenu,
    scheduleCloseDropdown,
    cancelScheduledClose,
    scrolled,
  };
}
