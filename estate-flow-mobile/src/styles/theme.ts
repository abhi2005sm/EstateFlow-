export const COLORS = {
  // Neutral Canvas Palette (Airbnb & CRED Style)
  background: '#F8FAFC',      // Slate-50: Cool premium canvas background
  cardBg: '#FFFFFF',          // Pure White for card surfaces
  cardBorder: '#F1F5F9',      // Slate-100: Soft thin outlines for layered depth
  
  // Slate Scale for Advanced Typography
  textPrimary: '#0F172A',     // Slate-900: High contrast primary text
  textSecondary: '#475569',   // Slate-600: Accessible subtitle text
  textMuted: '#94A3B8',       // Slate-400: Descriptive tags and borders
  textPlaceholder: '#CBD5E1', // Slate-300: Placeholder states
  
  // Brand Identities
  primary: '#FF6B35',         // Coral Orange: Premium signature branding
  primaryLight: '#FFECE5',    // Coral Soft Tint: Tag/badge backgrounds
  primaryDark: '#E04E1D',     // Dark Coral: Dynamic active touch indicators
  
  secondary: '#6366F1',       // Indigo: Primary operations (Pre-Approve/Action)
  secondaryLight: '#EEF2FF',  // Indigo Soft Tint: Secondary badge colors
  secondaryDark: '#4F46E5',   // Deep Indigo: Active states
  
  // System Semantic Statuses
  success: '#10B981',         // Emerald Green: Verified, Approved, Paid
  successLight: '#ECFDF5',    // Soft Green background
  successDark: '#047857',
  
  error: '#EF4444',           // Red: Unpaid, Alert, Declined
  errorLight: '#FEF2F2',      // Soft Red background
  errorDark: '#B91C1C',
  
  warning: '#F59E0B',         // Amber Yellow: Pending, In Progress, Wait
  warningLight: '#FFFBEB',    // Soft Yellow background
  warningDark: '#B45309',
  
  info: '#3B82F6',            // Blue: General notice, badge info
  infoLight: '#EFF6FF',       // Soft Blue background
  infoDark: '#1D4ED8',

  // Accent Helpers
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(15, 23, 42, 0.4)', // Muted slate backdrop for modals
  glassBg: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(241, 245, 249, 0.8)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Premium Depth Shadows (CRED & Material 3)
export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.09,
    shadowRadius: 30,
    elevation: 8,
  },
};

// Typography Scale System
export const TYPOGRAPHY = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
  },
  titleMedium: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  titleSmall: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    color: COLORS.textMuted,
  },
  labelUpper: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: COLORS.textMuted,
  },
};

