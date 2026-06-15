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
  Home,
  Building,
  Users,
  CreditCard,
  Wrench,
  LogOut,
  TrendingUp,
  Phone,
  Mail,
  Search,
  Plus,
  DollarSign,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { Building as BuildingType, Tenant as TenantType, PaymentHistory as PaymentType, MaintenanceRequest as RequestType } from '../mock/data';

interface AdminScreenProps {
  buildings: BuildingType[];
  tenants: TenantType[];
  payments: PaymentType[];
  requests: RequestType[];
  onLogout: () => void;
  onAddBuilding: (name: string, type: 'Residential' | 'Commercial', units: number, address: string) => void;
  onToggleRequestStatus: (id: string, currentStatus: 'Pending' | 'In Progress' | 'Resolved') => void;
  onAddTenant: (name: string, email: string, phone: string, buildingId: string, buildingName: string, unit: string, rentAmount: number) => void;
}

export default function AdminScreen({
  buildings,
  tenants,
  payments,
  requests,
  onLogout,
  onAddBuilding,
  onToggleRequestStatus,
  onAddTenant,
}: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buildings' | 'tenants' | 'payments' | 'requests'>('dashboard');
  
  // Floorwise detail view states
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedUnitForAdd, setSelectedUnitForAdd] = useState<string | null>(null);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  // New Tenant Form State
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');
  const [newTenantRent, setNewTenantRent] = useState('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantFilter, setTenantFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');

  // Modals
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [newBldName, setNewBldName] = useState('');
  const [newBldType, setNewBldType] = useState<'Residential' | 'Commercial'>('Residential');
  const [newBldUnits, setNewBldUnits] = useState('');
  const [newBldAddress, setNewBldAddress] = useState('');

  const handleCreateBuilding = () => {
    if (!newBldName || !newBldUnits || !newBldAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onAddBuilding(newBldName, newBldType, parseInt(newBldUnits) || 10, newBldAddress);
    setIsBuildingModalOpen(false);
    setNewBldName('');
    setNewBldUnits('');
    setNewBldAddress('');
  };

  const handleCreateTenant = () => {
    if (!newTenantName || !newTenantEmail || !newTenantPhone || !newTenantRent) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const building = buildings.find(b => b.id === selectedBuildingId);
    if (!building || !selectedUnitForAdd) return;

    onAddTenant(
      newTenantName,
      newTenantEmail,
      newTenantPhone,
      building.id,
      building.name,
      selectedUnitForAdd,
      parseFloat(newTenantRent) || 1200
    );

    // Reset Form
    setNewTenantName('');
    setNewTenantEmail('');
    setNewTenantPhone('');
    setNewTenantRent('');
    setIsTenantModalOpen(false);
    setSelectedUnitForAdd(null);
    Alert.alert('Success', 'Tenant assigned and registered successfully!');
  };

  const getBuildingFloors = (bldId: string) => {
    const bldTenants = tenants.filter(t => t.buildingId === bldId);
    
    // Simulating 3 floors of units
    return {
      1: [
        { unit: 'Apt 101', tenant: bldTenants.find(t => t.unit === 'Apt 101' || t.unit === '101') || null },
        { unit: 'Apt 102', tenant: bldTenants.find(t => t.unit === 'Apt 102' || t.unit === '102') || null },
        { unit: 'Apt 103', tenant: bldTenants.find(t => t.unit === 'Apt 103' || t.unit === '103') || null },
        { unit: 'Apt 104', tenant: bldTenants.find(t => t.unit === 'Apt 104' || t.unit === '104') || null },
        { unit: 'Apt 105', tenant: bldTenants.find(t => t.unit === 'Apt 105' || t.unit === '105') || null },
      ],
      2: [
        { unit: 'Apt 201', tenant: bldTenants.find(t => t.unit === 'Apt 201' || t.unit === '201') || null },
        { unit: 'Apt 202', tenant: bldTenants.find(t => t.unit === 'Apt 202' || t.unit === '202') || null },
        { unit: 'Apt 203', tenant: bldTenants.find(t => t.unit === 'Apt 203' || t.unit === '203') || null },
        { unit: 'Apt 204', tenant: bldTenants.find(t => t.unit === 'Apt 204' || t.unit === '204') || null },
        { unit: 'Apt 205', tenant: bldTenants.find(t => t.unit === 'Apt 205' || t.unit === '205') || null },
        { unit: 'Apt 208', tenant: bldTenants.find(t => t.unit === 'Apt 208' || t.unit === '208') || null },
      ],
      3: [
        { unit: 'Apt 301', tenant: bldTenants.find(t => t.unit === 'Apt 301' || t.unit === '301') || null },
        { unit: 'Apt 302', tenant: bldTenants.find(t => t.unit === 'Apt 302' || t.unit === '302') || null },
        { unit: 'Apt 303', tenant: bldTenants.find(t => t.unit === 'Apt 303' || t.unit === '303') || null },
        { unit: 'Penthouse', tenant: bldTenants.find(t => t.unit.toLowerCase() === 'penthouse') || null },
      ]
    };
  };

  const filteredBuildings = buildings.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.buildingName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = tenantFilter === 'All' || 
                          (tenantFilter === 'Paid' && t.rentStatus === 'Paid') ||
                          (tenantFilter === 'Unpaid' && t.rentStatus === 'Unpaid');
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>GLOBAL PORTFOLIO</Text>
          <Text style={styles.headerTitle}>Owner Panel</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Portal Content Area */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Buildings</Text>
                <Text style={styles.statValue}>{buildings.length}</Text>
                <View style={styles.statBadgeGreen}>
                  <TrendingUp size={12} color={COLORS.accent} />
                  <Text style={styles.statBadgeText}>Active</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Units</Text>
                <Text style={styles.statValue}>
                  {buildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                </Text>
                <Text style={styles.statCardSub}>Across portfolio</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Occupancy Rate</Text>
                <Text style={styles.statValue}>90.6%</Text>
                <Text style={styles.statCardSub}>135 of 149 Units</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Rent Collections</Text>
                <Text style={[styles.statValue, { color: COLORS.accent }]}>$142k</Text>
                <Text style={styles.statCardSub}>This month</Text>
              </View>
            </View>

            {/* Collection progress */}
            <View style={styles.dashboardCard}>
              <Text style={styles.cardTitle}>Collection Progress</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '92%' }]} />
              </View>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>Collected: $142,500</Text>
                <Text style={styles.progressLabel}>Pending: $12,500</Text>
              </View>
            </View>

            {/* Immediate Action items */}
            <Text style={styles.sectionHeader}>Immediate Action Items</Text>
            {tenants.filter(t => t.rentStatus === 'Unpaid').map(t => (
              <View key={t.id} style={styles.actionItemCard}>
                <View style={styles.actionCardHeader}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{t.name.split(' ').map(n=>n[0]).join('')}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.actionItemTitle}>{t.name}</Text>
                    <Text style={styles.actionItemSub}>{t.buildingName} • {t.unit}</Text>
                  </View>
                  <View style={styles.unpaidBadge}>
                    <Text style={styles.unpaidBadgeText}>-${t.dueAmount}</Text>
                  </View>
                </View>
                <View style={styles.cardActionRow}>
                  <TouchableOpacity 
                    style={styles.actionIconButton} 
                    onPress={() => Alert.alert('Calling Tenant', `Connecting to ${t.name} at ${t.phone}...`)}
                  >
                    <Phone size={14} color={COLORS.primary} />
                    <Text style={styles.actionIconText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionIconButton}
                    onPress={() => Alert.alert('Invoice Dispatched', `Digital invoice resent to ${t.email}`)}
                  >
                    <Mail size={14} color={COLORS.textSecondary} />
                    <Text style={styles.actionIconText}>Send Reminder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'buildings' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBarRow}>
              <View style={styles.searchBarContainer}>
                <Search size={16} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search buildings..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => setIsBuildingModalOpen(true)}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredBuildings.map(b => (
                <View key={b.id} style={styles.buildingCard}>
                  <View style={styles.bldHeader}>
                    <Building size={24} color={COLORS.primary} />
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={styles.bldName}>{b.name}</Text>
                      <Text style={styles.bldAddress}>{b.address}</Text>
                    </View>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{b.type}</Text>
                    </View>
                  </View>

                  <View style={styles.bldGrid}>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Total Units</Text>
                      <Text style={styles.gridValue}>{b.totalUnits}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Occupied</Text>
                      <Text style={styles.gridValue}>{b.occupiedUnits}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Collected</Text>
                      <Text style={[styles.gridValue, { color: COLORS.accent }]}>${b.rentPaid.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'tenants' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBarContainer}>
              <Search size={16} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tenants..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.filterRow}>
              {['All', 'Paid', 'Unpaid'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterButton,
                    tenantFilter === f && styles.filterButtonActive
                  ]}
                  onPress={() => setTenantFilter(f as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    tenantFilter === f && styles.filterButtonTextActive
                  ]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredTenants.map(t => (
                <View key={t.id} style={styles.tenantCard}>
                  <View style={styles.tenantHeader}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>{t.name.split(' ').map(n=>n[0]).join('')}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={styles.tenantName}>{t.name}</Text>
                      <Text style={styles.tenantDetails}>{t.buildingName} • {t.unit}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      t.rentStatus === 'Paid' ? styles.statusBadgePaid : styles.statusBadgeUnpaid
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        t.rentStatus === 'Paid' ? styles.statusBadgeTextPaid : styles.statusBadgeTextUnpaid
                      ]}>{t.rentStatus}</Text>
                    </View>
                  </View>

                  <View style={styles.tenantInfoRow}>
                    <View>
                      <Text style={styles.infoLabel}>Monthly Rent</Text>
                      <Text style={styles.infoValue}>${t.rentAmount}</Text>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Balance Due</Text>
                      <Text style={[styles.infoValue, t.dueAmount > 0 && { color: COLORS.accentUnpaid }]}>
                        ${t.dueAmount}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Move In</Text>
                      <Text style={styles.infoValue}>{t.moveInDate}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'payments' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Collections & Receipts</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardSub}>Total Revenue Inflow</Text>
                <Text style={styles.largeTotalAmount}>$142,500</Text>
                <Text style={styles.collectionEfficiency}>92% Collection Efficiency Rate</Text>
              </View>

              <Text style={styles.sectionHeader}>Ledger Logs</Text>
              {payments.map(p => (
                <View key={p.id} style={styles.transactionItem}>
                  <View style={styles.transIconCircle}>
                    <DollarSign size={16} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.transTitle}>{p.tenantName}</Text>
                    <Text style={styles.transSub}>{p.feeType} • {p.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.transAmount}>+${p.amount}</Text>
                    <Text style={[
                      styles.transStatus,
                      p.status === 'Paid' ? { color: COLORS.accent } : { color: COLORS.warning }
                    ]}>{p.status}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'requests' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Maintenance Tickets</Text>
            <Text style={styles.tabSubtitle}>Tap ticket status button to toggle progress state</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {requests.map(r => (
                <View key={r.id} style={styles.requestCard}>
                  <View style={styles.reqHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reqTitle}>{r.title}</Text>
                      <Text style={styles.reqSub}>{r.unit} • {r.date}</Text>
                    </View>
                    <View style={[
                      styles.priorityBadge,
                      r.priority === 'High' ? styles.badgeHigh : r.priority === 'Medium' ? styles.badgeMedium : styles.badgeLow
                    ]}>
                      <Text style={styles.priorityText}>{r.priority}</Text>
                    </View>
                  </View>

                  <Text style={styles.reqDesc}>{r.description}</Text>

                  <View style={styles.reqFooter}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{r.category}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.statusToggleBtn,
                        r.status === 'Resolved' ? styles.btnResolved : r.status === 'In Progress' ? styles.btnProgress : styles.btnPending
                      ]}
                      onPress={() => onToggleRequestStatus(r.id, r.status)}
                    >
                      <Text style={styles.statusToggleText}>{r.status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Navigation tabs */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('dashboard')}>
          <Home size={20} color={activeTab === 'dashboard' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.tabLabelActive]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('buildings')}>
          <Building size={20} color={activeTab === 'buildings' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'buildings' && styles.tabLabelActive]}>Buildings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('tenants')}>
          <Users size={20} color={activeTab === 'tenants' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'tenants' && styles.tabLabelActive]}>Tenants</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('payments')}>
          <CreditCard size={20} color={activeTab === 'payments' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'payments' && styles.tabLabelActive]}>Payments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('requests')}>
          <Wrench size={20} color={activeTab === 'requests' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'requests' && styles.tabLabelActive]}>Tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Add Building Modal */}
      <Modal visible={isBuildingModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Property</Text>
            
            <Text style={styles.inputLabel}>Building Name</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. Sunset Apartments" 
              placeholderTextColor={COLORS.textMuted}
              value={newBldName}
              onChangeText={setNewBldName}
            />

            <Text style={styles.inputLabel}>Building Type</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity 
                style={[styles.radioOption, newBldType === 'Residential' && styles.radioActive]}
                onPress={() => setNewBldType('Residential')}
              >
                <Text style={[styles.radioText, newBldType === 'Residential' && styles.radioTextActive]}>Residential</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.radioOption, newBldType === 'Commercial' && styles.radioActive]}
                onPress={() => setNewBldType('Commercial')}
              >
                <Text style={[styles.radioText, newBldType === 'Commercial' && styles.radioTextActive]}>Commercial</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Total Units</Text>
            <TextInput 
              style={styles.modalInput} 
              keyboardType="number-pad"
              placeholder="e.g. 40" 
              placeholderTextColor={COLORS.textMuted}
              value={newBldUnits}
              onChangeText={setNewBldUnits}
            />

            <Text style={styles.inputLabel}>Location Address</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. 102 Sunset Blvd, Los Angeles" 
              placeholderTextColor={COLORS.textMuted}
              value={newBldAddress}
              onChangeText={setNewBldAddress}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsBuildingModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit]} 
                onPress={handleCreateBuilding}
              >
                <Text style={styles.modalBtnSubmitText}>Create Building</Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },
  statBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 4,
  },
  statCardSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  dashboardCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
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
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionItemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  actionItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  actionItemSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  unpaidBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BORDER_RADIUS.sm,
  },
  unpaidBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accentUnpaid,
  },
  cardActionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  actionIconButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  actionIconText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },

  // BUILDINGS
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
    marginBottom: SPACING.md,
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
  buildingCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  bldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bldName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  bldAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  bldGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  // TENANTS
  filterRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.cardBg,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  tenantCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  tenantDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusBadgePaid: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusBadgeUnpaid: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadgeTextPaid: {
    color: COLORS.accent,
  },
  statusBadgeTextUnpaid: {
    color: COLORS.accentUnpaid,
  },
  tenantInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  infoLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  // PAYMENTS
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
  dashboardCardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  largeTotalAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: SPACING.sm,
  },
  collectionEfficiency: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  transIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  transSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  transStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // REQUESTS/TICKETS
  requestCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  reqSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  badgeMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  badgeLow: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  reqDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  reqFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    backgroundColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statusToggleBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnResolved: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  btnProgress: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  btnPending: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },

  // BOTTOM TAB NAVIGATION
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

  // MODAL
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
  radioRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  radioOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  radioText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  radioTextActive: {
    color: COLORS.primary,
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
    color: COLORS.white,
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
