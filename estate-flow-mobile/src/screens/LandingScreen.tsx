import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { ChevronRight, Home, ArrowUpRight, LogIn, Shield, Users, Compass } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

const { width } = Dimensions.get('window');

interface LandingScreenProps {
  onNavigateToLogin: () => void;
}

export default function LandingScreen({ onNavigateToLogin }: LandingScreenProps) {
  return (
    <View style={styles.container}>
      {/* Navigation Bar Header */}
      <View style={styles.navBar}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBg}>
            <Home size={16} color={COLORS.black} />
          </View>
          <Text style={styles.logoText}>EstateFlow</Text>
        </View>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={onNavigateToLogin}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
          <ChevronRight size={14} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop' }}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
        >
          {/* Overlay Gradients */}
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Next-Gen Property Management</Text>
            </View>

            <Text style={styles.heroTitle}>
              Manage your{'\n'}
              <Text style={styles.heroTitleHighlight}>Assets Smarter.</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              A unified command center for Super Admins, Property Managers, and Tenants. Streamline your real estate operations with industrial precision.
            </Text>

            {/* Platform Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusCol}>
                  <Text style={styles.statusLabel}>System Role</Text>
                  <View style={styles.activeDotRow}>
                    <View style={styles.activeDot} />
                    <Text style={styles.statusValue}>Super Admin</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statusCol}>
                  <Text style={styles.statusLabel}>Active Modules</Text>
                  <Text style={styles.statusValue}>12 Integrated</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statusCol}>
                  <Text style={styles.statusLabel}>Platform</Text>
                  <Text style={styles.statusValue}>99.9% Up</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.accessBtn}
                onPress={onNavigateToLogin}
              >
                <LogIn size={16} color={COLORS.black} style={styles.btnIcon} />
                <Text style={styles.accessBtnText}>Access Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Stats Grid Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRowGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValueBig}>15,000+</Text>
              <Text style={styles.statLabelMuted}>Units Managed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValueBig}>99.9%</Text>
              <Text style={styles.statLabelMuted}>Uptime SLA</Text>
            </View>
          </View>
          <View style={styles.statsRowGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValueBig}>92%</Text>
              <Text style={styles.statLabelMuted}>Tenant Retention</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValueBig}>10+</Text>
              <Text style={styles.statLabelMuted}>Years of Trust</Text>
            </View>
          </View>
        </View>

        {/* Role Modules Section */}
        <View style={styles.rolesSection}>
          <Text style={styles.rolesSubtitle}>PLATFORM ROLES</Text>
          <Text style={styles.rolesTitle}>Built for every Role.</Text>
          <Text style={styles.rolesDescription}>
            Tailored experiences designed for administrators, portfolio owners, and residents alike.
          </Text>

          {/* Super Admin Card */}
          <View style={styles.roleCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop' }}
              style={styles.roleCardImage}
              imageStyle={styles.roleCardImgStyle}
            >
              <View style={styles.roleCardOverlay} />
              <View style={styles.roleCardBadge}>
                <Text style={styles.roleCardBadgeText}>Super Admin</Text>
              </View>
            </ImageBackground>
            <View style={styles.roleCardInfo}>
              <View style={styles.roleHeaderRow}>
                <Shield size={20} color={COLORS.primary} />
                <Text style={styles.roleCardTitle}>Global Governance</Text>
              </View>
              <Text style={styles.roleCardDesc}>
                Full-scale ecosystem management for multi-property portfolios. Oversee administrator permissions, cross-building analytics, and system-wide configurations.
              </Text>
              <View style={styles.tagsContainer}>
                {['Analytics', 'Roles', 'Audit Logs'].map(t => (
                  <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                ))}
              </View>
            </View>
          </View>

          {/* Property Manager Card */}
          <View style={styles.roleCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=600&auto=format&fit=crop' }}
              style={styles.roleCardImage}
              imageStyle={styles.roleCardImgStyle}
            >
              <View style={styles.roleCardOverlay} />
              <View style={styles.roleCardBadge}>
                <Text style={styles.roleCardBadgeText}>Property Manager</Text>
              </View>
            </ImageBackground>
            <View style={styles.roleCardInfo}>
              <View style={styles.roleHeaderRow}>
                <Compass size={20} color={COLORS.warning} />
                <Text style={styles.roleCardTitle}>Executive Command</Text>
              </View>
              <Text style={styles.roleCardDesc}>
                A dedicated command center for day-to-day operations. Track unit occupancy, automate maintenance workflows, and generate comprehensive financial reports.
              </Text>
              <View style={styles.tagsContainer}>
                {['Occupancy', 'CRM Support', 'Ledger'].map(t => (
                  <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                ))}
              </View>
            </View>
          </View>

          {/* Resident Card */}
          <View style={styles.roleCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop' }}
              style={styles.roleCardImage}
              imageStyle={styles.roleCardImgStyle}
            >
              <View style={styles.roleCardOverlay} />
              <View style={styles.roleCardBadge}>
                <Text style={[styles.roleCardBadgeText, { color: COLORS.accent }]}>Resident Portal</Text>
              </View>
            </ImageBackground>
            <View style={styles.roleCardInfo}>
              <View style={styles.roleHeaderRow}>
                <Users size={20} color={COLORS.accent} />
                <Text style={styles.roleCardTitle}>Seamless Living</Text>
              </View>
              <Text style={styles.roleCardDesc}>
                A modern mobile-first hub for tenants. Process rent payments instantly, sign digital lease agreements, and request concierge services with one click.
              </Text>
              <View style={styles.tagsContainer}>
                {['Payments', 'Mobile Keys', 'Tickets'].map(t => (
                  <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <View style={[styles.logoIconBg, { backgroundColor: COLORS.white }]}>
              <Home size={14} color={COLORS.black} />
            </View>
            <Text style={[styles.logoText, { color: COLORS.white }]}>EstateFlow</Text>
          </View>
          <Text style={styles.footerHeading}>Ready to optimize your operations?</Text>
          <TouchableOpacity 
            style={styles.footerBtn}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.footerBtnText}>Get Started Now</Text>
            <ArrowUpRight size={16} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.copyrightText}>© 2026 EstateFlow Real Estate. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    backgroundColor: 'rgba(245, 243, 240, 0.85)',
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconBg: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  signInButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 2,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  heroBackground: {
    width: '100%',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImage: {
    opacity: 0.55,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 13, 13, 0.75)',
  },
  heroContent: {
    marginTop: SPACING.md,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: SPACING.md,
  },
  heroTitleHighlight: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '300',
    lineHeight: 18,
    marginBottom: SPACING.xl,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusCol: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  activeDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 4,
  },
  statusValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.cardBorder,
  },
  accessBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: SPACING.sm,
  },
  accessBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  statsRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statValueBig: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabelMuted: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  rolesSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  rolesSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  rolesTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  rolesDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '300',
    lineHeight: 18,
    marginBottom: SPACING.xl,
  },
  roleCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  roleCardImgStyle: {
    opacity: 0.75,
  },
  roleCardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 13, 13, 0.4)',
  },
  roleCardBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  roleCardBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleCardInfo: {
    padding: SPACING.lg,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  roleCardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    fontWeight: '300',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    marginTop: SPACING.xl,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  copyrightText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
