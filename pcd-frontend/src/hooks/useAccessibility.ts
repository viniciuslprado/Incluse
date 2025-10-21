import { useContext } from 'react';
import { AccessibilityContext } from '../contexts/AccessibilityContext';

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
}