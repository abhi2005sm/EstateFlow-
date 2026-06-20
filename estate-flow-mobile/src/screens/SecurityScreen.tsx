import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Activity,
  LogOut,
  ChevronDown,
  User,
  Phone,
  Briefcase,
  Building,
  Lock,
  Bell,
  Truck,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { Tenant as TenantType, Visitor as VisitorType, securityStaffData, SecurityStaff } from '../mock/data';

interface SecurityScreenProps {
  tenants: TenantType[];
  visitors: VisitorType[];
  onDutyGuard: SecurityStaff | null;
  setOnDutyGuard: (guard: SecurityStaff | null) => void;
  onDispatchVisitor: (visitorName: string, phone: string, purpose: string, unit: string, tenantName: string, tenantId: string) => void;
  onLogout: () => void;
}

export default function SecurityScreen({
  tenants,
  visitors,
  onDutyGuard,
  setOnDutyGuard,
  onDispatchVisitor,
  onLogout,
}: SecurityScreenProps) {
  // Visitor Form State
  const [selectedUnit, setSelectedUnit] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');

  // Form Field Focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Dropdown visibility for Unit picker simulation
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // Selected tenant details helper
  const activeTenant = tenants.find(t => t.unit === selectedUnit || t.unit.replace('Unit ', '') === selectedUnit);

  const handleSubmitVisitor = () => {
    if (!selectedUnit || !visitorName || !visitorPhone || !purposeOfVisit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!activeTenant) {
      Alert.alert('Error', 'Invalid destination unit selected');
      return;
    }

    onDispatchVisitor(
      visitorName,
      visitorPhone,
      purposeOfVisit,
      selectedUnit,
      activeTenant.name,
      activeTenant.id
    );

    // Reset Form
    setSelectedUnit('');
    setVisitorName('');
    setVisitorPhone('');
    setPurposeOfVisit('');
    Alert.alert('Success', 'Visitor dispatch notification sent to resident!');
  };

  // 1. ROSTER LOGIN VIEW
  if (!onDutyGuard) {
    return (
      <View style={styles.rosterContainer}>
        <View style={styles.rosterCard}>
          {/* Logo Branding */}
          <View style={styles.logoRow}>
            <View style={styles.shieldIconCircle}>
              <Shield size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.logoTitle}>Gate Command</Text>
          </View>

          <Text style={styles.rosterTitle}>Duty Roster Shift Login</Text>
          <Text style={styles.rosterSubtitle}>Select your active duty profile to begin gate clearances logging.</Text>

          <View style={styles.rosterList}>
            {securityStaffData.map(guard => (
              <TouchableOpacity
                key={guard.id}
                style={styles.rosterItem}
                onPress={() => setOnDutyGuard(guard)}
                activeOpacity={0.85}
              >
                <View style={styles.rosterLeft}>
                  <View style={styles.rosterAvatar}>
                    <Text style={styles.rosterAvatarText}>{guard.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.rosterItemName}>{guard.name}</Text>
                    <Text style={styles.rosterItemSub}>Duty: {guard.role || 'Gate Officer'}</Text>
                  </View>
                </View>
                <View style={styles.rosterItemRight}>
                  <View style={styles.rosterStatusPill}>
                    <Text style={styles.rosterItemStatus}>{guard.status.toUpperCase()}</Text>
                  </View>
                  <View style={styles.arrowCircle}>
                    <ArrowRight size={12} color={COLORS.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={onLogout} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>Exit Portal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. MAIN SECURITY NODE WORKSPACE
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SECURITY COMMAND NODE</Text>
          <Text style={styles.headerTitle}>Shift: {onDutyGuard.name}</Text>
        </View>
        <TouchableOpacity onPress={() => setOnDutyGuard(null)} style={styles.logoutBtn} activeOpacity={0.8}>
          <LogOut size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Sync Status Badge */}
        <View style={styles.syncCard}>
          <View style={styles.syncIndicator}>
            <View style={styles.pulseInnerDot} />
          </View>
          <Text style={styles.syncText}>LIVELINK GATE SYSTEM ONLINE</Text>
        </View>

        {/* New Visitor Registration Card */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Visitor Entrance dispatch</Text>
          <Text style={styles.cardHeaderSub}>Log arrival and dispatch request code to tenant unit.</Text>

          {/* Unit Dropdown Selector */}
          <Text style={styles.inputLabel}>Destination Unit</Text>
          <TouchableOpacity 
            style={[
              styles.dropdownTrigger, 
              showUnitPicker && styles.dropdownTriggerActive
            ]}
            onPress={() => setShowUnitPicker(!showUnitPicker)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownTriggerLeft}>
              <Building size={15} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.dropdownTriggerText, !selectedUnit && { color: COLORS.textPlaceholder }]}>
                {selectedUnit ? `Unit ${selectedUnit}` : 'Select destination unit...'}
              </Text>
            </View>
            <ChevronDown size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {showUnitPicker && (
            <View style={styles.dropdownMenu}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                {tenants.map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedUnit(t.unit.replace('Unit ', ''));
                      setShowUnitPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dropdownItemText}>Unit {t.unit.replace('Unit ', '')} • {t.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {activeTenant && (
            <View style={styles.tenantMatchBox}>
              <Text style={styles.tenantMatchText}>✓ Verified Host: {activeTenant.name}</Text>
            </View>
          )}

          {/* Visitor Name Field */}
          <Text style={styles.inputLabel}>Visitor's Full Name</Text>
          <View style={[
            styles.inputWrapper,
            focusedField === 'visitorName' && styles.inputWrapperFocused
          ]}>
            <User size={15} color={focusedField === 'visitorName' ? COLORS.primary : COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Richard Hendricks"
              placeholderTextColor={COLORS.textPlaceholder}
              value={visitorName}
              onChangeText={setVisitorName}
              onFocus={() => setFocusedField('visitorName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Visitor Phone Field */}
          <Text style={styles.inputLabel}>Visitor's Phone Number</Text>
          <View style={[
            styles.inputWrapper,
            focusedField === 'visitorPhone' && styles.inputWrapperFocused
          ]}>
            <Phone size={15} color={focusedField === 'visitorPhone' ? COLORS.primary : COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="e.g. +1 555-0199"
              placeholderTextColor={COLORS.textPlaceholder}
              value={visitorPhone}
              onChangeText={setVisitorPhone}
              onFocus={() => setFocusedField('visitorPhone')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Purpose of Visit Field */}
          <Text style={styles.inputLabel}>Purpose of Visit</Text>
          <View style={[
            styles.inputWrapper,
            focusedField === 'purpose' && styles.inputWrapperFocused
          ]}>
            <Briefcase size={15} color={focusedField === 'purpose' ? COLORS.primary : COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Amazon Delivery / Dinner Guest"
              placeholderTextColor={COLORS.textPlaceholder}
              value={purposeOfVisit}
              onChangeText={setPurposeOfVisit}
              onFocus={() => setFocusedField('purpose')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Submit Action */}
          <TouchableOpacity 
            style={styles.dispatchBtn}
            onPress={handleSubmitVisitor}
            activeOpacity={0.9}
          >
            <Text style={styles.dispatchBtnText}>Dispatch Entry Request</Text>
            <Activity size={13} color={COLORS.white} style={{ marginLeft: SPACING.sm }} />
          </TouchableOpacity>
        </View>

        {/* Gate Operator Utilities */}
        <Text style={styles.sectionTitle}>Gate Command Utilities</Text>
        <View style={styles.utilityGrid}>
          <TouchableOpacity 
            style={[styles.utilityCard, { borderLeftColor: COLORS.error, borderLeftWidth: 3 }]}
            onPress={() => Alert.alert('Emergency Broadcast', 'SOS Alert Broadcast sent to estate central command!')}
            activeOpacity={0.85}
          >
            <View style={[styles.utilityIconBg, { backgroundColor: COLORS.errorLight }]}>
              <Bell size={18} color={COLORS.error} />
            </View>
            <Text style={styles.utilityCardTitle}>SOS Alert</Text>
            <Text style={styles.utilityCardSub}>Emergency broadcast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.utilityCard, { borderLeftColor: COLORS.secondary, borderLeftWidth: 3 }]}
            onPress={() => Alert.alert('Overnight Parking Log', 'Opening overnight vehicle parking logs.')}
            activeOpacity={0.85}
          >
            <View style={[styles.utilityIconBg, { backgroundColor: COLORS.secondaryLight }]}>
              <Truck size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.utilityCardTitle}>Vehicle Logs</Text>
            <Text style={styles.utilityCardSub}>Overnight parking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.utilityGrid}>
          {/* Locked Cab Scanner Card */}
          <TouchableOpacity 
            style={[styles.utilityCard, styles.utilityCardLocked]}
            onPress={() => Alert.alert('Premium Module', 'Automatic Cab QR Scanner requires a connected OCR camera system.')}
            activeOpacity={0.7}
          >
            <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
              <User size={18} color={COLORS.textMuted} />
            </View>
            <Text style={styles.utilityCardTitle}>Cab Scanner</Text>
            <Text style={styles.utilityCardSub}>Auto plate scanning</Text>
            <View style={styles.lockBadge}>
              <Lock size={10} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Locked Baggage Scanner Card */}
          <TouchableOpacity 
            style={[styles.utilityCard, styles.utilityCardLocked]}
            onPress={() => Alert.alert('Premium Module', 'Digital Baggage Checklist Log requires a security hub upgrade.')}
            activeOpacity={0.7}
          >
            <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
              <Shield size={18} color={COLORS.textMuted} />
            </View>
            <Text style={styles.utilityCardTitle}>Baggage Log</Text>
            <Text style={styles.utilityCardSub}>Material register</Text>
            <View style={styles.lockBadge}>
              <Lock size={10} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Live Gate Feed Timeline - MyGate Inspired */}
        <Text style={styles.sectionTitle}>Gate Entry Logs Feed</Text>
        
        {visitors.length === 0 ? (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyText}>No visitors logged today.</Text>
          </View>
        ) : (
          <View style={styles.timelineFeed}>
            {visitors.map((v, index) => {
              let statusStyles = {
                bg: COLORS.warningLight,
                border: 'rgba(245, 158, 11, 0.12)',
                text: COLORS.warning,
                Icon: Clock
              };

              if (v.status === 'APPROVED') {
                statusStyles = {
                  bg: COLORS.successLight,
                  border: 'rgba(16, 185, 129, 0.12)',
                  text: COLORS.success,
                  Icon: CheckCircle2
                };
              } else if (v.status === 'REJECTED') {
                statusStyles = {
                  bg: COLORS.errorLight,
                  border: 'rgba(239, 68, 68, 0.12)',
                  text: COLORS.error,
                  Icon: XCircle
                };
              }

              const StatusIcon = statusStyles.Icon;
              const isLast = index === visitors.length - 1;

              return (
                <View key={v.id} style={styles.timelineItem}>
                  {/* Vertical Connector Line */}
                  {!isLast && <View style={styles.timelineLine} />}

                  <View style={[styles.timelineNode, { backgroundColor: statusStyles.bg, borderColor: statusStyles.border }]}>
                    <StatusIcon size={14} color={statusStyles.text} />
                  </View>

                  <View style={styles.feedCardContainer}>
                    <View style={styles.visitorFeedCard}>
                      <View style={styles.feedCardTop}>
                        <View>
                          <Text style={styles.feedVisitorName}>{v.visitor_name}</Text>
                          <Text style={styles.feedVisitorSub}>{v.purpose.toUpperCase()} • {v.visitor_phone}</Text>
                        </View>
                        <View style={styles.feedUnitBadge}>
                          <Text style={styles.feedUnitText}>Unit {v.unit.replace('Unit ', '')}</Text>
                        </View>
                      </View>

                      <View style={styles.feedDivider} />

                      <View style={styles.feedCardBottom}>
                        <View style={styles.feedBottomLeft}>
                          <Text style={styles.feedMetaLabel}>Cleared Host</Text>
                          <Text style={styles.feedMetaValue}>{v.tenant_name || 'Resident'}</Text>
                        </View>
                        <View style={[styles.feedStatusBadge, { backgroundColor: statusStyles.bg }]}>
                          <Text style={[styles.feedStatusText, { color: statusStyles.text }]}>{v.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.labelUpper,
    color: COLORS.primary,
  },
  headerTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  syncIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pulseInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  syncText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  cardHeaderTitle: {
    ...TYPOGRAPHY.titleMedium,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardHeaderSub: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.labelUpper,
    fontSize: 8,
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dropdownTriggerActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.xs,
    padding: 6,
    ...SHADOWS.md,
    zIndex: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  dropdownItemText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tenantMatchBox: {
    backgroundColor: COLORS.successLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginTop: SPACING.sm,
  },
  tenantMatchText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 12,
  },
  dispatchBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  dispatchBtnText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  emptyFeed: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textMuted,
  },
  timelineFeed: {
    paddingLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: -20,
    width: 2,
    backgroundColor: COLORS.cardBorder,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 10,
    ...SHADOWS.sm,
  },
  feedCardContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  visitorFeedCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  feedCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feedVisitorName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feedVisitorSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  feedUnitBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  feedUnitText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  feedDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
  },
  feedCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedBottomLeft: {
    flex: 1,
  },
  feedMetaLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  feedMetaValue: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  feedStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  feedStatusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ROSTER LOGIN STYLES
  rosterContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  rosterCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  shieldIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  logoTitle: {
    ...TYPOGRAPHY.titleSmall,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  rosterTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  rosterSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  rosterList: {
    marginBottom: SPACING.lg,
  },
  rosterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  rosterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rosterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rosterAvatarText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.white,
  },
  rosterItemName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rosterItemSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rosterItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rosterStatusPill: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    marginRight: SPACING.sm,
  },
  rosterItemStatus: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  arrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  utilityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  utilityCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'flex-start',
    ...SHADOWS.sm,
  },
  utilityCardLocked: {
    opacity: 0.55,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textMuted,
  },
  utilityIconBg: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  utilityCardTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  utilityCardSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(71, 85, 105, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
