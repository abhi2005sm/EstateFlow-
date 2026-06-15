import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Activity,
  LogOut,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
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

  // Dropdown visibility for Unit picker simulation
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // Selected tenant details helper
  const activeTenant = tenants.find(t => t.unit === selectedUnit);

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
        <View style={styles.glowOrb} />
        
        <View style={styles.rosterCard}>
          <View style={styles.logoRow}>
            <View style={styles.shieldIconCircle}>
              <Shield size={24} color="#F26922" />
            </View>
            <Text style={styles.logoTitle}>Gate Security</Text>
          </View>

          <Text style={styles.rosterTitle}>Duty Roster Login</Text>
          <Text style={styles.rosterSubtitle}>Select your name to start gate shift logging</Text>

          <View style={styles.rosterList}>
            {securityStaffData.map(guard => (
              <TouchableOpacity
                key={guard.id}
                style={styles.rosterItem}
                onPress={() => setOnDutyGuard(guard)}
              >
                <Text style={styles.rosterItemName}>{guard.name}</Text>
                <View style={styles.rosterItemRight}>
                  <Text style={styles.rosterItemStatus}>{guard.status}</Text>
                  <ArrowRight size={16} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={onLogout}>
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
        <TouchableOpacity onPress={() => setOnDutyGuard(null)} style={styles.logoutBtn}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Sync Status Badge */}
        <View style={styles.syncCard}>
          <View style={styles.pulseIndicator} />
          <Text style={styles.syncText}>LIVELINK LOGS SYNCHRONIZED</Text>
        </View>

        {/* New Visitor Form */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>New Visitor Registration</Text>

          {/* Unit Dropdown */}
          <Text style={styles.inputLabel}>Destination Unit</Text>
          <TouchableOpacity 
            style={styles.dropdownTrigger}
            onPress={() => setShowUnitPicker(!showUnitPicker)}
          >
            <Text style={[styles.dropdownTriggerText, !selectedUnit && { color: COLORS.textMuted }]}>
              {selectedUnit ? `Unit ${selectedUnit}` : 'Select Destination Unit...'}
            </Text>
          </TouchableOpacity>

          {showUnitPicker && (
            <View style={styles.dropdownMenu}>
              {tenants.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedUnit(t.unit);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Unit {t.unit} ({t.name})</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTenant && (
            <Text style={styles.tenantNameHint}>✓ Resident Host: {activeTenant.name}</Text>
          )}

          <Text style={styles.inputLabel}>Visitor's Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={COLORS.textMuted}
            value={visitorName}
            onChangeText={setVisitorName}
          />

          <Text style={styles.inputLabel}>Visitor's Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="+1 555-0000"
            placeholderTextColor={COLORS.textMuted}
            value={visitorPhone}
            onChangeText={setVisitorPhone}
          />

          <Text style={styles.inputLabel}>Purpose of Visit</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Amazon Delivery / Dinner Guest"
            placeholderTextColor={COLORS.textMuted}
            value={purposeOfVisit}
            onChangeText={setPurposeOfVisit}
          />

          <TouchableOpacity 
            style={styles.dispatchBtn}
            onPress={handleSubmitVisitor}
          >
            <Text style={styles.dispatchBtnText}>Dispatch Entry Request</Text>
            <Activity size={16} color={COLORS.white} style={{ marginLeft: SPACING.sm }} />
          </TouchableOpacity>
        </View>

        {/* Live Operations Feed */}
        <Text style={styles.sectionTitle}>Gate Logs & Feed</Text>
        
        {visitors.length === 0 ? (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyText}>No visitors logged today.</Text>
          </View>
        ) : (
          visitors.map(v => {
            let statusStyles = {
              bg: 'rgba(245, 158, 11, 0.05)',
              border: 'rgba(245, 158, 11, 0.2)',
              text: '#F59E0B',
              Icon: Clock
            };

            if (v.status === 'APPROVED') {
              statusStyles = {
                bg: 'rgba(16, 185, 129, 0.05)',
                border: 'rgba(16, 185, 129, 0.2)',
                text: COLORS.accent,
                Icon: CheckCircle2
              };
            } else if (v.status === 'REJECTED') {
              statusStyles = {
                bg: 'rgba(239, 68, 68, 0.05)',
                border: 'rgba(239, 68, 68, 0.2)',
                text: COLORS.accentUnpaid,
                Icon: XCircle
              };
            }

            const StatusIcon = statusStyles.Icon;

            return (
              <View 
                key={v.id} 
                style={[
                  styles.visitorFeedCard, 
                  { backgroundColor: statusStyles.bg, borderColor: statusStyles.border }
                ]}
              >
                <View style={styles.feedCardLeft}>
                  <View style={[styles.statusIconBox, { borderColor: statusStyles.border }]}>
                    <StatusIcon size={18} color={statusStyles.text} />
                  </View>
                  <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                    <View style={styles.feedCardHeaderRow}>
                      <Text style={styles.feedVisitorName}>{v.visitor_name}</Text>
                      <Text style={styles.feedUnitText}>Unit {v.unit}</Text>
                    </View>
                    <Text style={styles.feedVisitorSub}>{v.purpose} • {v.visitor_phone}</Text>
                    <Text style={styles.feedHostText}>Host: {v.tenant_name}</Text>
                  </View>
                </View>
                <View style={styles.feedCardRight}>
                  <View style={[styles.statusBadge, { borderColor: statusStyles.border }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyles.text }]}>{v.status}</Text>
                  </View>
                  <Text style={styles.feedTimeText}>
                    {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            );
          })
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#F26922',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  logoutBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  scrollBody: {
    flex: 1,
    padding: SPACING.lg,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: SPACING.sm,
  },
  syncText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  dropdownTrigger: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  dropdownTriggerText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  dropdownMenu: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    maxHeight: 180,
    overflow: 'scroll',
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  dropdownItemText: {
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  tenantNameHint: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: SPACING.xs,
    marginLeft: 2,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F26922',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
  },
  dispatchBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  emptyFeed: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  visitorFeedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  feedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIconBox: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  feedVisitorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  feedUnitText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  feedCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedVisitorSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  feedHostText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  feedCardRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  feedTimeText: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },

  // ROSTER LOGIN
  rosterContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  glowOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(242, 105, 34, 0.1)',
    top: '20%',
  },
  rosterCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  shieldIconCircle: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(242, 105, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  rosterTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  rosterSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  rosterList: {
    marginBottom: SPACING.lg,
  },
  rosterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  rosterItemName: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  rosterItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rosterItemStatus: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
    textTransform: 'uppercase',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
