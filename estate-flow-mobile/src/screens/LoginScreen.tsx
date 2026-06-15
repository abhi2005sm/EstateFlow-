import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Shield, Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { apiRequest, setAuthToken, setLoggedInUser } from '../api/api';

const MOCK_CREDENTIALS = {
  superadmin: { email: 'superadmin@estateflow.com', password: 'Admin@123' },
  admin: { email: 'admin@example.com', password: 'password123' },
  tenant: { email: 'user@example.com', password: 'password123' },
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

  // Autofill credentials when switching tabs
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
      // Connect to the local Django Gateway using our central API helper
      const data = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password }),
      });

      // Successful API Login
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

      // Determine user screen routing based on detected role
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

      // Offline Dev Session fallback
      const credentialsMatch = MOCK_CREDENTIALS[role];
      if (email.toLowerCase() === credentialsMatch.email.toLowerCase() && password === credentialsMatch.password) {
        // Mock session login success
        setTimeout(() => {
          setIsLoading(false);
          const routeRole = role === 'superadmin' ? 'superadmin' : role === 'admin' ? 'admin' : role === 'security' ? 'security' : 'tenant';
          onLogin(routeRole as any);
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMessage(err.message || 'Connection failed. Please check credentials or backend service.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Glow Orbs */}
      <View style={styles.glowOrb1} />
      <View style={styles.glowOrb2} />

      <View style={styles.loginContent}>
        {/* Header Branding */}
        <View style={styles.logoSection}>
          <TouchableOpacity style={styles.logoBadge} onPress={onAbort}>
            <Building2 size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.logoText}>EstateFlow</Text>
          <Text style={styles.logoSubtitle}>Smart Real Estate Ecosystem</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Experience{'\n'}EstateFlow.</Text>
          <Text style={styles.cardSub}>Secure access to your dashboard.</Text>

          {/* Role Tabs Switcher */}
          <View style={styles.tabsContainer}>
            {(['superadmin', 'admin', 'tenant', 'security'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.tabButton,
                  role === r && styles.tabButtonActive
                ]}
                onPress={() => handleRoleChange(r)}
              >
                <Text style={[
                  styles.tabButtonText,
                  role === r && styles.tabButtonTextActive
                ]}>
                  {r === 'superadmin' ? 'S. Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage.toUpperCase()}</Text>
            </View>
          ) : null}

          {/* Input Fields */}
          <View style={styles.inputsGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email or Username</Text>
              <View style={styles.inputRow}>
                <Mail size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="email@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Security Key</Text>
              <View style={styles.inputRow}>
                <Lock size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
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

          {/* Checkbox Notice */}
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxMock}>
              <View style={styles.checkboxInner} />
            </View>
            <Text style={styles.checkboxLabel}>Secure monitored access session.</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLoginSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <View style={styles.arrowIconContainer}>
                    <ArrowRight size={14} color={COLORS.white} />
                  </View>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.abortBtn} onPress={onAbort}>
              <Text style={styles.abortBtnText}>Abort</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footerInfoRow}>
          <View style={styles.footerBadge}>
            <Building2 size={12} color={COLORS.textSecondary} />
            <Text style={styles.footerBadgeText}>Secure Node</Text>
          </View>
          <Text style={styles.footerVersion}>V4.0.2</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  glowOrb1: {
    position: 'absolute',
    top: '-5%',
    left: '-10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(242, 105, 34, 0.08)',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '-5%',
    right: '-10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  loginContent: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  logoSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  loginCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 32,
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '300',
    marginBottom: SPACING.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabButtonActive: {
    backgroundColor: COLORS.black,
  },
  tabButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  tabButtonTextActive: {
    color: COLORS.white,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.accentUnpaid,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputsGroup: {
    marginBottom: SPACING.md,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '300',
    paddingVertical: 6,
  },
  eyeBtn: {
    padding: SPACING.xs,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkboxMock: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 6,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: COLORS.black,
  },
  checkboxLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  loginBtnDisabled: {
    opacity: 0.5,
  },
  loginBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  arrowIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  abortBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  abortBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  footerBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  footerVersion: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
});
