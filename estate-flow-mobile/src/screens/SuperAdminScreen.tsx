import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Users,
  Building2,
  UserCheck,
  History,
  Plus,
  Search,
  LogOut,
  Globe,
  Activity,
  ChevronRight,
  TrendingUp,
  Mail,
  Sliders,
  Lock,
  Database,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { Owner as OwnerType } from '../mock/data';

interface SuperAdminScreenProps {
  owners: OwnerType[];
  onAddOwner: (name: string, email: string, totalBuildings: number, residentialCount: number, commercialCount: number) => void;
  onLogout: () => void;
}

export default function SuperAdminScreen({
  owners,
  onAddOwner,
  onLogout,
}: SuperAdminScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'owners' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Owner Form State
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerBuildings, setNewOwnerBuildings] = useState('');
  const [newOwnerResCount, setNewOwnerResCount] = useState('');
  const [newOwnerComCount, setNewOwnerComCount] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calculations
  const totalBuildings = owners.reduce((acc, o) => acc + o.totalBuildings, 0);
  const activeOwners = owners.filter(o => o.isActive).length;
  const inactiveOwners = owners.filter(o => !o.isActive).length;

  const handleRegisterOwner = () => {
    if (!newOwnerName || !newOwnerEmail || !newOwnerBuildings) {
      Alert.alert('Error', 'Please fill in name, email and total buildings.');
      return;
    }
    const bldCount = parseInt(newOwnerBuildings) || 0;
    const resCount = parseInt(newOwnerResCount) || 0;
    const comCount = parseInt(newOwnerComCount) || 0;

    onAddOwner(newOwnerName, newOwnerEmail, bldCount, resCount, comCount);

    // Reset fields
    setNewOwnerName('');
    setNewOwnerEmail('');
    setNewOwnerBuildings('');
    setNewOwnerResCount('');
    setNewOwnerComCount('');
    setIsModalOpen(false);
    Alert.alert('Success', 'New property owner manager registered successfully!');
  };

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>PORTFOLIO COMMAND CENTRE</Text>
          <Text style={styles.headerTitle}>Super Admin Portal</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutCircleBtn} activeOpacity={0.8}>
          <LogOut size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Global Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={styles.metricCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: COLORS.infoLight }]}>
                    <Users size={16} color={COLORS.info} />
                  </View>
                </View>
                <Text style={styles.metricValue}>{owners.length}</Text>
                <Text style={styles.metricLabel}>Total Owners</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
                    <Building2 size={16} color={COLORS.primary} />
                  </View>
                </View>
                <Text style={styles.metricValue}>{totalBuildings}</Text>
                <Text style={styles.metricLabel}>Total Buildings</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={styles.metricCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: COLORS.errorLight }]}>
                    <History size={16} color={COLORS.error} />
                  </View>
                </View>
                <Text style={styles.metricValue}>{inactiveOwners}</Text>
                <Text style={styles.metricLabel}>Inactive Owners</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: COLORS.successLight }]}>
                    <UserCheck size={16} color={COLORS.success} />
                  </View>
                </View>
                <Text style={styles.metricValue}>{activeOwners}</Text>
                <Text style={styles.metricLabel}>Active Owners</Text>
              </View>
            </View>

            {/* SLA Integrity Monitoring Dashboard Card */}
            <View style={styles.performanceCard}>
              <View style={styles.perfHeader}>
                <View style={styles.perfTitleRow}>
                  <Activity size={18} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
                  <Text style={styles.perfTitle}>System Integrity & SLA</Text>
                </View>
                <View style={[styles.slaBadge, { backgroundColor: COLORS.successLight }]}>
                  <Text style={[styles.slaText, { color: COLORS.success }]}>99.9% Uptime</Text>
                </View>
              </View>
              <Text style={styles.perfDesc}>
                All cloud microservices are active. Local database checkins latency averages sub-10ms. Operational checks complete.
              </Text>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseInner} />
                </View>
                <Text style={styles.liveIndicatorText}>LIVE SYSTEM MONITOR OK</Text>
              </View>
            </View>

            {/* System Management Utilities */}
            <Text style={styles.sectionHeader}>System Core Utilities</Text>
            <View style={styles.utilityGrid}>
              <TouchableOpacity 
                style={[styles.utilityCard, { borderLeftColor: COLORS.primary, borderLeftWidth: 3 }]}
                onPress={() => Alert.alert('Database Backup', 'Executing cloud database hot-backup. Finished.')}
                activeOpacity={0.85}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.primaryLight }]}>
                  <Database size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.utilityCardTitle}>DB Backup</Text>
                <Text style={styles.utilityCardSub}>Hot snapshot log</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.utilityCard, { borderLeftColor: COLORS.secondary, borderLeftWidth: 3 }]}
                onPress={() => Alert.alert('System Logs', 'Opening federated microservice cloud logs.')}
                activeOpacity={0.85}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.secondaryLight }]}>
                  <Sliders size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.utilityCardTitle}>Log Viewers</Text>
                <Text style={styles.utilityCardSub}>Audit microservices</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.utilityGrid}>
              {/* Locked server scale Card */}
              <TouchableOpacity 
                style={[styles.utilityCard, styles.utilityCardLocked]}
                onPress={() => Alert.alert('Enterprise License', 'Dynamic Server Scale-up requires an active Enterprise Platform License.')}
                activeOpacity={0.7}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
                  <Activity size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.utilityCardTitle}>Scale Server</Text>
                <Text style={styles.utilityCardSub}>Auto-scale nodes</Text>
                <View style={styles.lockBadge}>
                  <Lock size={10} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>

              {/* Locked security export Card */}
              <TouchableOpacity 
                style={[styles.utilityCard, styles.utilityCardLocked]}
                onPress={() => Alert.alert('Enterprise License', 'Global Security Audit Export requires an active Enterprise Platform License.')}
                activeOpacity={0.7}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
                  <Globe size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.utilityCardTitle}>Global Audits</Text>
                <Text style={styles.utilityCardSub}>Security logs compliance</Text>
                <View style={styles.lockBadge}>
                  <Lock size={10} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Portfolio Insights list */}
            <Text style={styles.sectionHeader}>Portfolio Highlights</Text>
            {owners.slice(0, 3).map((o) => (
              <View key={o.id} style={styles.insightCard}>
                <View style={styles.insightLeft}>
                  <View style={[styles.avatarCircle, { backgroundColor: COLORS.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: COLORS.primary }]}>{o.name.charAt(0)}</Text>
                  </View>
                  <View style={{ marginLeft: SPACING.md }}>
                    <Text style={styles.insightName}>{o.name}</Text>
                    <Text style={styles.insightSub}>
                      {o.residentialCount} Res • {o.commercialCount} Com properties
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge, 
                  o.isActive ? { backgroundColor: COLORS.successLight } : { backgroundColor: COLORS.errorLight }
                ]}>
                  <Text style={[
                    styles.statusBadgeText, 
                    { color: o.isActive ? COLORS.success : COLORS.error }
                  ]}>
                    {o.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'owners' && (
          <View style={styles.tabBodyWrapper}>
            <View style={styles.searchHeader}>
              <View style={[styles.searchContainer, focusedField === 'search' && styles.searchContainerFocused]}>
                <Search size={15} color={focusedField === 'search' ? COLORS.primary : COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search owners roster..."
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setFocusedField('search')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => setIsModalOpen(true)}
                activeOpacity={0.8}
              >
                <Plus size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
              {filteredOwners.map(o => (
                <View key={o.id} style={styles.ownerCard}>
                  <View style={styles.ownerCardTop}>
                    <View style={styles.ownerAvatar}>
                      <Text style={styles.ownerAvatarText}>{o.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={styles.ownerName}>{o.name}</Text>
                      <Text style={styles.ownerEmail}>{o.email}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      o.isActive ? { backgroundColor: COLORS.successLight } : { backgroundColor: COLORS.errorLight }
                    ]}>
                      <Text style={[
                        styles.statusBadgeText, 
                        { color: o.isActive ? COLORS.success : COLORS.error }
                      ]}>
                        {o.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ownerCardDivider} />

                  <View style={styles.ownerCardBottom}>
                    <View style={styles.ownerMetricCol}>
                      <Text style={styles.ownerMetricVal}>{o.totalBuildings}</Text>
                      <Text style={styles.ownerMetricLabel}>Properties</Text>
                    </View>
                    <View style={styles.ownerMetricCol}>
                      <Text style={styles.ownerMetricVal}>{o.residentialCount}</Text>
                      <Text style={styles.ownerMetricLabel}>Residential</Text>
                    </View>
                    <View style={styles.ownerMetricCol}>
                      <Text style={styles.ownerMetricVal}>{o.commercialCount}</Text>
                      <Text style={styles.ownerMetricLabel}>Commercial</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'settings' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>Global Command Setup</Text>
            <Text style={styles.tabSubheading}>Operational guidelines and deployment checks for system core.</Text>
            
            <View style={styles.settingsCard}>
              <Globe size={18} color={COLORS.primary} style={{ marginBottom: SPACING.sm }} />
              <Text style={styles.settingsCardTitle}>Federated Nodes</Text>
              <Text style={styles.settingsCardText}>
                EstateFlow mobile gateways are connected directly to the primary cloud server on port 443. Keep checkins within latency guidelines.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <LogOut size={15} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
              <Text style={styles.logoutBtnText}>Log Out Account</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Active-State Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        {([
          { id: 'dashboard', label: 'Global Info', Icon: Globe },
          { id: 'owners', label: 'Managers', Icon: Users },
          { id: 'settings', label: 'Setup', Icon: Sliders },
        ] as const).map(tab => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.Icon;
          return (
            <TouchableOpacity 
              key={tab.id}
              style={styles.tabItem} 
              onPress={() => setActiveTab(tab.id)} 
              activeOpacity={0.8}
            >
              <View style={[
                styles.tabIconBox,
                isActive && styles.tabIconBoxActive
              ]}>
                <TabIcon 
                  size={16} 
                  color={isActive ? COLORS.primary : COLORS.textMuted} 
                  strokeWidth={isActive ? 2.5 : 1.8}
                  fill={isActive ? 'rgba(255, 107, 53, 0.1)' : 'transparent'}
                />
              </View>
              <Text style={[
                styles.tabLabelText, 
                isActive && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MODALS */}

      {/* Register Owner Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Register Property Manager</Text>
            <Text style={styles.modalSubtitle}>Create a new owner account to oversee buildings portfolios.</Text>
            
            <Text style={styles.modalFieldLabel}>Manager Name</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'ownerName' && styles.modalTextInputFocused]} 
              placeholder="e.g. Jared Dunn" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newOwnerName}
              onChangeText={setNewOwnerName}
              onFocus={() => setFocusedField('ownerName')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Email Address</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'ownerEmail' && styles.modalTextInputFocused]} 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. jared@piedpiper.com" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newOwnerEmail}
              onChangeText={setNewOwnerEmail}
              onFocus={() => setFocusedField('ownerEmail')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Buildings Owned Count</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'ownerBld' && styles.modalTextInputFocused]} 
              keyboardType="number-pad"
              placeholder="e.g. 5" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newOwnerBuildings}
              onChangeText={setNewOwnerBuildings}
              onFocus={() => setFocusedField('ownerBld')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Residential Properties Count</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'ownerRes' && styles.modalTextInputFocused]} 
              keyboardType="number-pad"
              placeholder="e.g. 3" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newOwnerResCount}
              onChangeText={setNewOwnerResCount}
              onFocus={() => setFocusedField('ownerRes')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Commercial Properties Count</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'ownerCom' && styles.modalTextInputFocused]} 
              keyboardType="number-pad"
              placeholder="e.g. 2" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newOwnerComCount}
              onChangeText={setNewOwnerComCount}
              onFocus={() => setFocusedField('ownerCom')}
              onBlur={() => setFocusedField(null)}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: COLORS.success }]} 
                onPress={handleRegisterOwner}
                activeOpacity={0.9}
              >
                <Text style={[styles.modalBtnSubmitText, { color: COLORS.white }]}>Register Owner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  logoutCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    ...TYPOGRAPHY.titleMedium,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  performanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.md,
  },
  perfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  perfTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  slaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  slaText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  perfDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  pulseContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  liveIndicatorText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
  },
  insightName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  insightSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // OWNERS TAB
  tabBodyWrapper: {
    flex: 1,
    padding: SPACING.lg,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 10,
  },
  addBtn: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  ownerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md,
  },
  ownerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerAvatarText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.primary,
  },
  ownerName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ownerEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  ownerCardDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
  },
  ownerCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ownerMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  ownerMetricVal: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ownerMetricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // SETTINGS TAB
  tabHeading: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  tabSubheading: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  settingsCardTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  settingsCardText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  logoutBtn: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  logoutBtnText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
  },

  // BOTTOM TAB NAVIGATION
  bottomTabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    ...SHADOWS.lg,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconBox: {
    width: 44,
    height: 28,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabIconBoxActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabLabelText: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },

  // MODALS STYLE
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    ...SHADOWS.xl,
  },
  modalTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  modalFieldLabel: {
    ...TYPOGRAPHY.labelUpper,
    fontSize: 8,
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  modalTextInputField: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalTextInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  radioBlock: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    marginHorizontal: -4,
  },
  radioPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  radioPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  radioPillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  radioPillTextActive: {
    color: COLORS.primary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    marginHorizontal: -4,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalBtnCancel: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalBtnCancelText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  modalBtnSubmit: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  modalBtnSubmitText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '700',
  },
  utilityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
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
