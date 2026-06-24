import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Shield, Mail, Lock, Eye, EyeOff, Building2, ArrowRight, UserCheck, ShieldAlert, Key } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { apiRequest, setAuthToken, setLoggedInUser } from '../api/api';

const MOCK_CREDENTIALS = {
  superadmin: { email: 'superadmin@estateflow.com', password: 'admin123' },
  admin: { email: 'johndoe@example.com', password: 'password123' },
  tenant: { email: 'tenant@example.com', password: 'password123' },
  security: { email: 'security@example.com', password: 'password123' }
};

type RoleType = keyof typeof MOCK_CREDENTIALS;

interface LoginScreenProps {
  onLogin: (role: 'superadmin' | 'admin' | 'tenant' | 'security') => void;
  onAbort: () => void;
}

export default function LoginScreen({ onLogin, onAbort }: LoginScreenProps) {
  const [role, setRole] = useState<RoleType>('superadmin');
  const [email, setEmail] = useState(MOCK_CREDENTIALS.superadmin.email);
  const [password, setPassword] = useState(MOCK_CREDENTIALS.superadmin.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Track field focus for dynamic styling
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleRoleChange = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setEmail(MOCK_CREDENTIALS[selectedRole].email);
    setPassword(MOCK_CREDENTIALS[selectedRole].password);
    setErrorMessage('');
  };

  const handleLoginSubmit = async () => {
    setErrorMessage('');
    setIsLoading(true);

    let loginEmail = email;
    if (role === 'security' && !email.includes('@')) {
      loginEmail = `${email}@security.estatia.local`;
    }

    try {
      const data = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password }),
      });

      const token = data.access_token || data.access || data.token;
      if (token) {
        setAuthToken(token);
        if (Platform.OS === 'web') {
          localStorage.setItem('access_token', token);
        }
      }

      setLoggedInUser({
        email: data.email || loginEmail,
        name: data.name || (role === 'admin' ? 'Admin Owner' : role),
        role: data.role || data.user_type || role,
      });

      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify({
          email: data.email || loginEmail,
          name: data.name || (role === 'admin' ? 'Admin Owner' : role),
        }));
      }

      let detectedRole = data.role || data.user_type || role;
      if (data.is_superuser) detectedRole = 'superadmin';
      else if (data.is_staff) detectedRole = 'admin';

      const userRole = String(detectedRole).toLowerCase();

      setIsLoading(false);

      if (userRole === 'superadmin') {
        onLogin('superadmin');
      } else if (userRole === 'admin' || userRole === 'owner') {
        onLogin('admin');
      } else if (userRole === 'security') {
        onLogin('security');
      } else {
        onLogin('tenant');
      }
    } catch (err: any) {
      console.warn('[API Login Failed, checking offline fallback]', err);

      // Only allow offline fallback if it is a network error (backend is unreachable)
      if (err.isNetworkError) {
        const credentialsMatch = MOCK_CREDENTIALS[role];
        if (email.toLowerCase() === credentialsMatch.email.toLowerCase() && password === credentialsMatch.password) {
          setTimeout(() => {
            setIsLoading(false);
            const routeRole = role === 'superadmin' ? 'superadmin' : role === 'admin' ? 'admin' : role === 'security' ? 'security' : 'tenant';
            onLogin(routeRole as any);
          }, 800);
          return;
        }
      }

      setIsLoading(false);
      setErrorMessage(err.message || 'Connection failed. Please check credentials or backend service.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Branding - Airbnb Style */}
          <View style={styles.brandingSection}>
            <TouchableOpacity style={styles.brandingBadge} onPress={onAbort} activeOpacity={0.8}>
              <Building2 size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.brandTitle}>EstateFlow</Text>
            <Text style={styles.brandSubtitle}>Secure Gateway Node</Text>
          </View>

          {/* Form Surface */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Authorized Login</Text>
            <Text style={styles.cardHeaderSubtitle}>Select your account category and provide credentials.</Text>

            {/* Custom Horizontal Role Selection Grid */}
            <View style={styles.roleGrid}>
              {([
                { id: 'superadmin', label: 'S. Admin', Icon: Shield },
                { id: 'admin', label: 'Owner', Icon: UserCheck },
                { id: 'tenant', label: 'Resident', Icon: Building2 },
                { id: 'security', label: 'Guard', Icon: ShieldAlert },
              ] as const).map((item) => {
                const isSelected = role === item.id;
                const RoleIcon = item.Icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.roleButton,
                      isSelected && styles.roleButtonActive
                    ]}
                    onPress={() => handleRoleChange(item.id)}
                    activeOpacity={0.85}
                  >
                    <View style={[
                      styles.roleIconBox,
                      isSelected ? { backgroundColor: COLORS.primaryLight } : { backgroundColor: COLORS.background }
                    ]}>
                      <RoleIcon size={18} color={isSelected ? COLORS.primary : COLORS.textSecondary} />
                    </View>
                    <Text style={[
                      styles.roleButtonText,
                      isSelected && styles.roleButtonTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Error Area */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.inputsSection}>
              {/* Email Input Wrapper */}
              <View style={[
                styles.fieldWrapper,
                focusedField === 'email' && styles.fieldWrapperFocused
              ]}>
                <Text style={styles.fieldLabel}>Registered Email / ID</Text>
                <View style={styles.fieldRow}>
                  <Mail size={16} color={focusedField === 'email' ? COLORS.primary : COLORS.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="name@domain.com"
                    placeholderTextColor={COLORS.textPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Password Input Wrapper */}
              <View style={[
                styles.fieldWrapper,
                focusedField === 'password' && styles.fieldWrapperFocused
              ]}>
                <Text style={styles.fieldLabel}>Security Passkey</Text>
                <View style={styles.fieldRow}>
                  <Lock size={16} color={focusedField === 'password' ? COLORS.primary : COLORS.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color={COLORS.textSecondary} />
                    ) : (
                      <Eye size={16} color={COLORS.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.actionsBlock}>
              <TouchableOpacity
                style={[styles.primaryLoginBtn, isLoading && styles.primaryLoginBtnDisabled]}
                onPress={handleLoginSubmit}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryLoginBtnText}>Authenticate</Text>
                    <View style={styles.arrowIconContainer}>
                      <ArrowRight size={13} color={COLORS.white} />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.abortButton} onPress={onAbort} activeOpacity={0.7}>
                <Text style={styles.abortButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Security Badging */}
          <View style={styles.footerRow}>
            <View style={styles.securityBadge}>
              <Key size={11} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.securityBadgeText}>TLS v1.3 Secured</Text>
            </View>
            <Text style={styles.versionText}>System Node 4.0.2</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brandingBadge: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  brandTitle: {
    ...TYPOGRAPHY.titleLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl, // Premium 24px rounded corners
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.lg, // Soft layered depth shadows
  },
  cardHeaderTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardHeaderSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
  },
  roleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  roleButtonActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  roleIconBox: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleButtonText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  roleButtonTextActive: {
    color: COLORS.primary,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorBoxText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700',
  },
  inputsSection: {
    marginBottom: SPACING.md,
  },
  fieldWrapper: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.xl, // Premium 20px corners
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  fieldWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  fieldLabel: {
    ...TYPOGRAPHY.labelUpper,
    fontSize: 8,
    marginTop: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 6,
  },
  eyeButton: {
    padding: SPACING.xs,
  },
  actionsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  primaryLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  primaryLoginBtnDisabled: {
    opacity: 0.5,
  },
  primaryLoginBtnText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  arrowIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  abortButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  abortButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityBadgeText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});
