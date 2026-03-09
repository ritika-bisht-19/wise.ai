import { useState, type FormEvent } from 'react';

export function useContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return { submitted, handleSubmit };
}
