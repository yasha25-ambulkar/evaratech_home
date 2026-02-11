/**
 * Responsive/**
 * Hooks - Index
 * Version: 2.0.0
 * 
 * Centralized exports for custom hooks
 */

// Responsive hooks
export { useResponsive, useBreakpoint, useMediaQuery, BREAKPOINTS, isBreakpoint, getBreakpointValue } from './useResponsive';

// Interaction hooks
export { useRipple } from './useRipple';

// Form hooks
export { useFormValidation } from './useFormValidation';

// Sprint 6: Toast Hook
export { useToast, ToastProvider } from './useToastHook';
export { default as useToastDefault } from './useToastHook';

// Types
export type { ResponsiveState, Breakpoint } from './useResponsive';
export type { RippleOptions } from './useRipple';
export type { ValidationRule, FormValidation } from './useFormValidation';
