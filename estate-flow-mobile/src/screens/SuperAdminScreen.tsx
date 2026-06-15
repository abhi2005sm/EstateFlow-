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
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
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
          <Text style={styles.headerSubtitle}>PORTFOLIO GLOBAL COMMAND</Text>
          <Text style={styles.headerTitle}>Super Admin Portal</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <Text style={styles.tabTitle}>Global Overview</Text>
            <Text style={styles.tabSubtitle}>Performance and status metrics across your entire real estate portfolio.</Text>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Users size={20} color="#3B82F6" />
                </View>
                <Text style={styles.metricLabel}>TOTAL OWNERS</Text>
                <Text style={styles.metricValue}>{owners.length}</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Building2 size={20} color="#10B981" />
                </View>
                <Text style={styles.metricLabel}>TOTAL BUILDINGS</Text>
                <Text style={styles.metricValue}>{totalBuildings}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <History size={20} color="#EF4444" />
                </View>
                <Text style={styles.metricLabel}>INACTIVE OWNERS</Text>
                <Text style={styles.metricValue}>{inactiveOwners}</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <UserCheck size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.metricLabel}>ACTIVE OWNERS</Text>
                <Text style={styles.metricValue}>{activeOwners}</Text>
              </View>
            </View>

            {/* Performance Card */}
            <View style={styles.performanceCard}>
              <View style={styles.perfHeader}>
                <View style={styles.perfTitleRow}>
                  <TrendingUp size={20} color={COLORS.primary} />
                  <Text style={styles.perfTitle}>System Integrity & SLA</Text>
                </View>
                <View style={styles.slaBadge}>
                  <Text style={styles.slaText}>99.9% Uptime</Text>
                </View>
              </View>
              <Text style={styles.perfDesc}>
                All microservices (Gateway, Auth, Users, Security) are running normally. Local sync latencies are sub-10ms.
              </Text>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveIndicatorText}>LIVE SYSTEM MONITOR STATUS OK</Text>
              </View>
            </View>

            {/* Portfolio Insights */}
            <Text style={styles.sectionHeader}>Portfolio Insights</Text>
            {owners.slice(0, 3).map((o, idx) => (
              <View key={o.id} style={styles.insightCard}>
                <View style={styles.insightLeft}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{o.name.charAt(0)}</Text>
                  </View>
                  <View style={{ marginLeft: SPACING.md }}>
                    <Text style={styles.insightName}>{o.name}</Text>
                    <Text style={styles.insightSub}>
                      {o.residentialCount} Res • {o.commercialCount} Com properties
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, o.isActive ? styles.statusActive : styles.statusInactive]}>
                  <Text style={[styles.statusBadgeText, { color: o.isActive ? '#10B981' : '#EF4444' }]}>
                    {o.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'owners' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Manager Roster</Text>
            <Text style={styles.tabSubtitle}>Audit and configure security privileges or building manager assignments.</Text>

            {/* Search Bar */}
            <View style={styles.searchBarRow}>
              <View style={styles.searchBarContainer}>
                <Search size={18} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search owners or emails..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalOpen(true)}>
                <Plus size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* List of Owners */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredOwners.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No owners match your search.</Text>
                </View>
              ) : (
                filteredOwners.map(o => (
                  <View key={o.id} style={styles.ownerItemCard}>
                    <View style={styles.ownerHeaderRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.avatarCircleSmall}>
                          <Text style={styles.avatarTextSmall}>{o.name.charAt(0)}</Text>
                        </View>
                        <View style={{ marginLeft: SPACING.sm }}>
                          <Text style={styles.ownerNameText}>{o.name}</Text>
                          <Text style={styles.ownerEmailText}>{o.email}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, o.isActive ? styles.statusActive : styles.statusInactive]}>
                        <Text style={[styles.statusBadgeText, { color: o.isActive ? '#10B981' : '#EF4444' }]}>
                          {o.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ownerStatsRow}>
                      <View style={styles.ownerStatItem}>
                        <Text style={styles.ownerStatLabel}>BUILDINGS</Text>
                        <Text style={styles.ownerStatValue}>{o.totalBuildings}</Text>
                      </View>
                      <View style={styles.ownerStatItem}>
                        <Text style={styles.ownerStatLabel}>RESIDENTIAL</Text>
                        <Text style={styles.ownerStatValue}>{o.residentialCount}</Text>
                      </View>
                      <View style={styles.ownerStatItem}>
                        <Text style={styles.ownerStatLabel}>COMMERCIAL</Text>
                        <Text style={styles.ownerStatValue}>{o.commercialCount}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {activeTab === 'settings' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <Text style={styles.tabTitle}>Global Platform Config</Text>
            <Text style={styles.tabSubtitle}>System governance parameters and deployment controls.</Text>

            <View style={styles.settingsGroup}>
              <View style={styles.settingsItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Globe size={18} color={COLORS.primary} style={{ marginRight: SPACING.md }} />
                  <Text style={styles.settingsItemText}>Multi-Tenant Gateway Routing</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </View>

              <View style={styles.settingsItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Activity size={18} color={COLORS.primary} style={{ marginRight: SPACING.md }} />
                  <Text style={styles.settingsItemText}>Gateway SLA Latency Logs</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </View>

              <View style={styles.settingsItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sliders size={18} color={COLORS.primary} style={{ marginRight: SPACING.md }} />
                  <Text style={styles.settingsItemText}>Environment Variables & API Keys</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.settingsItem, styles.logoutBtnAction]} 
              onPress={onLogout}
            >
              <Text style={styles.logoutBtnActionText}>Exit Platform Portal</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation Tabs */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <Activity size={20} color={activeTab === 'dashboard' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.tabLabelActive]}>
            Insights
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('owners')}
        >
          <Users size={20} color={activeTab === 'owners' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'owners' && styles.tabLabelActive]}>
            Owners
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('settings')}
        >
          <Sliders size={20} color={activeTab === 'settings' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'settings' && styles.tabLabelActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register Owner Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Register New Owner Manager</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Richard Hendricks"
              placeholderTextColor={COLORS.textMuted}
              value={newOwnerName}
              onChangeText={setNewOwnerName}
            />

            <Text style={styles.inputLabel}>Primary Contact Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. richard@piedpiper.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              value={newOwnerEmail}
              onChangeText={setNewOwnerEmail}
            />

            <Text style={styles.inputLabel}>Total Managed Buildings</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 3"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={newOwnerBuildings}
              onChangeText={setNewOwnerBuildings}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: SPACING.sm }}>
                <Text style={styles.inputLabel}>Residential Properties</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 2"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={newOwnerResCount}
                  onChangeText={setNewOwnerResCount}
                />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={styles.inputLabel}>Commercial Properties</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 1"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={newOwnerComCount}
                  onChangeText={setNewOwnerComCount}
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSubmit]}
                onPress={handleRegisterOwner}
              >
                <Text style={styles.modalBtnSubmitText}>Register</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  body: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tabSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  performanceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  slaBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  slaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  perfDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.md,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveIndicatorText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  insightName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  insightSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchBarRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  ownerItemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ownerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingBottom: SPACING.md,
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  ownerNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  ownerEmailText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ownerStatsRow: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
  },
  ownerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  ownerStatLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  ownerStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.xl,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  settingsItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  logoutBtnAction: {
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
  },
  logoutBtnActionText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabelText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalBtnCancel: {
    backgroundColor: COLORS.cardBorder,
  },
  modalBtnCancelText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBtnSubmit: {
    backgroundColor: COLORS.primary,
  },
  modalBtnSubmitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
