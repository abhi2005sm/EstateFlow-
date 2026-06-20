import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { ChevronRight, Home, ArrowUpRight, LogIn, Shield, Users, Compass, Activity } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';

const { width } = Dimensions.get('window');

interface LandingScreenProps {
  onNavigateToLogin: () => void;
}

export default function LandingScreen({ onNavigateToLogin }: LandingScreenProps) {
  return (
    <View style={styles.container}>
      {/* 2025 Premium Glass-style Top Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <View style={styles.logoIconContainer}>
            <Home size={16} color={COLORS.white} />
          </View>
          <Text style={styles.logoText}>EstateFlow</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerActionButton}
          onPress={onNavigateToLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.headerActionText}>Sign In</Text>
          <View style={styles.headerActionIconBox}>
            <ChevronRight size={12} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <Activity size={10} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Smart Resident Ecosystem</Text>
          </View>

          <Text style={styles.heroTitle}>
            Premium Living,{'\n'}
            <Text style={styles.heroTitleHighlight}>Seamless Control.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            A production-grade platform connecting tenants, gates, property managers, and administrators in real-time.
          </Text>

          {/* Operational Status Card - CRED Style */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeaderRow}>
              <View style={styles.statusTitleGroup}>
                <View style={styles.livePulseOuter}>
                  <View style={styles.livePulseInner} />
                </View>
                <Text style={styles.statusHeaderTitle}>Platform Gateway</Text>
              </View>
              <View style={styles.liveIndicatorBadge}>
                <Text style={styles.liveIndicatorText}>ACTIVE NODE</Text>
              </View>
            </View>

            <View style={styles.statusMetricsGrid}>
              <View style={styles.statusCol}>
                <Text style={styles.statusLabel}>Uptime</Text>
                <Text style={styles.statusValue}>99.98%</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statusCol}>
                <Text style={styles.statusLabel}>Active Ports</Text>
                <Text style={styles.statusValue}>12 Integrated</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statusCol}>
                <Text style={styles.statusLabel}>Response</Text>
                <Text style={styles.statusValue}>8ms Latency</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryAccessBtn}
              onPress={onNavigateToLogin}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryAccessBtnText}>Access Secured Portal</Text>
              <View style={styles.btnIconArrow}>
                <LogIn size={14} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Metric Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGridRow}>
            <View style={styles.statMetricCard}>
              <Text style={styles.statMetricNumber}>15K+</Text>
              <Text style={styles.statMetricLabel}>Units Managed</Text>
            </View>
            <View style={styles.statMetricCard}>
              <Text style={styles.statMetricNumber}>2.4M</Text>
              <Text style={styles.statMetricLabel}>Clearances Logged</Text>
            </View>
          </View>
          <View style={styles.statsGridRow}>
            <View style={styles.statMetricCard}>
              <Text style={styles.statMetricNumber}>99.4%</Text>
              <Text style={styles.statMetricLabel}>Rent Compliance</Text>
            </View>
            <View style={styles.statMetricCard}>
              <Text style={styles.statMetricNumber}>200K+</Text>
              <Text style={styles.statMetricLabel}>Verified Guard Shifts</Text>
            </View>
          </View>
        </View>

        {/* Roles Segment - MyGate Inspired */}
        <View style={styles.rolesSection}>
          <Text style={styles.rolesSectionTag}>ECOSYSTEM SUITE</Text>
          <Text style={styles.rolesSectionTitle}>Designed for All Roles</Text>
          <Text style={styles.rolesSectionDesc}>
            Tailored dashboard structures built dynamically to serve each segment of the community workspace.
          </Text>

          {/* Superadmin Card */}
          <View style={[styles.roleServiceCard, styles.roleSuperadminBorder]}>
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconWrapper, { backgroundColor: COLORS.infoLight }]}>
                <Shield size={20} color={COLORS.info} />
              </View>
              <View style={styles.roleTitleGroup}>
                <Text style={styles.roleCardTitle}>Portfolio Registry</Text>
                <Text style={styles.roleCardSubtitle}>Super Admin Control</Text>
              </View>
            </View>
            <Text style={styles.roleCardText}>
              Oversee the complete database. Administer property manager privileges, global SLAs, and core server configurations.
            </Text>
            <View style={styles.rolesPillContainer}>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Global Analytics</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>IAM Roles</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>SLA Audits</Text></View>
            </View>
          </View>

          {/* Admin Card */}
          <View style={[styles.roleServiceCard, styles.roleAdminBorder]}>
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
                <Compass size={20} color={COLORS.primary} />
              </View>
              <View style={styles.roleTitleGroup}>
                <Text style={styles.roleCardTitle}>Property Command</Text>
                <Text style={styles.roleCardSubtitle}>Manager / Owner Portal</Text>
              </View>
            </View>
            <Text style={styles.roleCardText}>
              Deploy unit floor-plans, monitor collections efficiency, assign tenant leases, and track maintenance operations.
            </Text>
            <View style={styles.rolesPillContainer}>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Lease Assign</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Meters & Dues</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Tickets</Text></View>
            </View>
          </View>

          {/* Resident / Security Portal */}
          <View style={[styles.roleServiceCard, styles.roleResidentBorder]}>
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconWrapper, { backgroundColor: COLORS.successLight }]}>
                <Users size={20} color={COLORS.success} />
              </View>
              <View style={styles.roleTitleGroup}>
                <Text style={styles.roleCardTitle}>Resident & Security</Text>
                <Text style={styles.roleCardSubtitle}>Tenant & Gate Command</Text>
              </View>
            </View>
            <Text style={styles.roleCardText}>
              Pre-approve guest codes, process rent ledger payments, register visitors, and manage real-time entry approvals.
            </Text>
            <View style={styles.rolesPillContainer}>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Visitor Codes</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Rent Pay</Text></View>
              <View style={styles.tagPill}><Text style={styles.tagPillText}>Gate Checkins</Text></View>
            </View>
          </View>
        </View>

        {/* Premium Bottom Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogoContainer}>
            <View style={styles.footerLogoIconBg}>
              <Home size={11} color={COLORS.white} />
            </View>
            <Text style={styles.footerLogoText}>EstateFlow</Text>
          </View>
          <Text style={styles.footerHeader}>Ready to upgrade your residential management?</Text>
          <TouchableOpacity 
            style={styles.footerCTAButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.footerCTAText}>Launch App Dashboard</Text>
            <ArrowUpRight size={14} color={COLORS.white} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <Text style={styles.footerVersionText}>EstateFlow Cloud Core v4.0.2 • © 2026 All rights reserved</Text>
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
  header: {
    height: Platform.OS === 'ios' ? 95 : 75,
    paddingTop: Platform.OS === 'ios' ? 45 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    ...SHADOWS.sm,
    zIndex: 100,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    width: 26,
    height: 26,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  logoText: {
    ...TYPOGRAPHY.titleSmall,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
  },
  headerActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 6,
  },
  headerActionIconBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  heroTitleHighlight: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginBottom: SPACING.xl,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl, // Premium 24px Rounded corners
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md, // Soft layered depth shadows
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  statusTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livePulseOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  livePulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusHeaderTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  liveIndicatorBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
  },
  liveIndicatorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusCol: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    ...TYPOGRAPHY.labelUpper,
    fontSize: 8,
    marginBottom: 4,
  },
  statusValue: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.cardBorder,
  },
  primaryAccessBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  primaryAccessBtnText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
  },
  btnIconArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  statMetricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  statMetricNumber: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
    fontWeight: '800',
  },
  statMetricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  rolesSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  rolesSectionTag: {
    ...TYPOGRAPHY.labelUpper,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  rolesSectionTitle: {
    ...TYPOGRAPHY.titleMedium,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  rolesSectionDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  roleServiceCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  roleSuperadminBorder: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  roleAdminBorder: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  roleResidentBorder: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  roleIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  roleTitleGroup: {
    flex: 1,
  },
  roleCardTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleCardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  roleCardText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  rolesPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  tagPill: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 6,
    marginBottom: 4,
  },
  tagPillText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.xxl,
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    marginTop: SPACING.md,
    ...SHADOWS.lg,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerLogoIconBg: {
    width: 22,
    height: 22,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  footerLogoText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.white,
  },
  footerHeader: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.white,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  footerCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    marginBottom: SPACING.xl,
  },
  footerCTAText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
  },
  footerVersionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 9,
  },
});
