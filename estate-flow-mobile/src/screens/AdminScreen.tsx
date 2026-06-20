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
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
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
  ChevronDown,
  ChevronUp,
  UserPlus,
  CheckCircle2,
  Clock,
  Briefcase,
  Lock,
  Shield,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
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

  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    Alert.alert('Asset Added', 'New building asset registered successfully.');
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
        { unit: 'Apt 101', tenant: bldTenants.find(t => t.unit === 'Apt 101' || t.unit === '101' || t.unit === 'Unit 101') || null },
        { unit: 'Apt 102', tenant: bldTenants.find(t => t.unit === 'Apt 102' || t.unit === '102' || t.unit === 'Unit 102') || null },
        { unit: 'Apt 103', tenant: bldTenants.find(t => t.unit === 'Apt 103' || t.unit === '103' || t.unit === 'Unit 103') || null },
        { unit: 'Apt 104', tenant: bldTenants.find(t => t.unit === 'Apt 104' || t.unit === '104' || t.unit === 'Unit 104') || null },
        { unit: 'Apt 105', tenant: bldTenants.find(t => t.unit === 'Apt 105' || t.unit === '105' || t.unit === 'Unit 105') || null },
      ],
      2: [
        { unit: 'Apt 201', tenant: bldTenants.find(t => t.unit === 'Apt 201' || t.unit === '201' || t.unit === 'Unit 201') || null },
        { unit: 'Apt 202', tenant: bldTenants.find(t => t.unit === 'Apt 202' || t.unit === '202' || t.unit === 'Unit 202') || null },
        { unit: 'Apt 203', tenant: bldTenants.find(t => t.unit === 'Apt 203' || t.unit === '203' || t.unit === 'Unit 203') || null },
        { unit: 'Apt 204', tenant: bldTenants.find(t => t.unit === 'Apt 204' || t.unit === '204' || t.unit === 'Unit 204') || null },
        { unit: 'Apt 205', tenant: bldTenants.find(t => t.unit === 'Apt 205' || t.unit === '205' || t.unit === 'Unit 205') || null },
        { unit: 'Apt 208', tenant: bldTenants.find(t => t.unit === 'Apt 208' || t.unit === '208' || t.unit === 'Unit 208') || null },
      ],
      3: [
        { unit: 'Apt 301', tenant: bldTenants.find(t => t.unit === 'Apt 301' || t.unit === '301' || t.unit === 'Unit 301') || null },
        { unit: 'Apt 302', tenant: bldTenants.find(t => t.unit === 'Apt 302' || t.unit === '302' || t.unit === 'Unit 302') || null },
        { unit: 'Apt 303', tenant: bldTenants.find(t => t.unit === 'Apt 303' || t.unit === '303' || t.unit === 'Unit 303') || null },
        { unit: 'Penthouse', tenant: bldTenants.find(t => t.unit.toLowerCase() === 'penthouse' || t.unit.toLowerCase() === 'unit penthouse') || null },
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
      {/* Top Navigation */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>GLOBAL PORTFOLIO</Text>
          <Text style={styles.headerTitle}>Owner Panel</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutCircleBtn} activeOpacity={0.8}>
          <LogOut size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Workspace Body */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Stats Metrics Cards Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: COLORS.primaryLight }]}>
                    <Building size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.activeTag}>
                    <Text style={styles.activeTagText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{buildings.length}</Text>
                <Text style={styles.statLabel}>Buildings Managed</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: COLORS.secondaryLight }]}>
                    <Users size={16} color={COLORS.secondary} />
                  </View>
                </View>
                <Text style={styles.statValue}>
                  {buildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Units Leased</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: COLORS.infoLight }]}>
                    <TrendingUp size={16} color={COLORS.info} />
                  </View>
                </View>
                <Text style={styles.statValue}>90.6%</Text>
                <Text style={styles.statLabel}>Occupancy Rate</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: COLORS.successLight }]}>
                    <DollarSign size={16} color={COLORS.success} />
                  </View>
                </View>
                <Text style={[styles.statValue, { color: COLORS.success }]}>$142.5K</Text>
                <Text style={styles.statLabel}>Month Collections</Text>
              </View>
            </View>

            {/* Collection Progress Card */}
            <View style={styles.dashboardCard}>
              <Text style={styles.cardHeaderTitle}>Collection Progress</Text>
              <View style={styles.progressBarWrapper}>
                <View style={[styles.progressBarFill, { width: '92%' }]} />
              </View>
              <View style={styles.progressFooterRow}>
                <Text style={styles.progressFooterLabel}>Collected: $142,500</Text>
                <Text style={styles.progressFooterLabel}>Unpaid Dues: $12,500</Text>
              </View>
            </View>

            {/* Quick Management Utilities */}
            <Text style={styles.sectionTitle}>Management Utilities</Text>
            <View style={styles.utilityGrid}>
              <TouchableOpacity 
                style={[styles.utilityCard, { borderLeftColor: COLORS.primary, borderLeftWidth: 3 }]}
                onPress={() => Alert.alert('Gate Logs', 'Opening global gate visitor timeline reports.')}
                activeOpacity={0.85}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.primaryLight }]}>
                  <Shield size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.utilityCardTitle}>Gate Reports</Text>
                <Text style={styles.utilityCardSub}>Visitor entry timelines</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.utilityCard, { borderLeftColor: COLORS.secondary, borderLeftWidth: 3 }]}
                onPress={() => Alert.alert('Broadcast Alert', 'Opening tenant push broadcast composer.')}
                activeOpacity={0.85}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.secondaryLight }]}>
                  <Mail size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.utilityCardTitle}>Send Broadcast</Text>
                <Text style={styles.utilityCardSub}>Alert residents</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.utilityGrid}>
              {/* Locked Staff roster Card */}
              <TouchableOpacity 
                style={[styles.utilityCard, styles.utilityCardLocked]}
                onPress={() => Alert.alert('Premium Utility', 'Staff Roster Manager requires an active Enterprise subscription.')}
                activeOpacity={0.7}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
                  <Users size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.utilityCardTitle}>Staff Rosters</Text>
                <Text style={styles.utilityCardSub}>Manage guards shift</Text>
                <View style={styles.lockBadge}>
                  <Lock size={10} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>

              {/* Locked Financial Export Card */}
              <TouchableOpacity 
                style={[styles.utilityCard, styles.utilityCardLocked]}
                onPress={() => Alert.alert('Premium Utility', 'Finance Audit Export requires an active Enterprise subscription.')}
                activeOpacity={0.7}
              >
                <View style={[styles.utilityIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
                  <DollarSign size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.utilityCardTitle}>Export Audits</Text>
                <Text style={styles.utilityCardSub}>Financial reporting</Text>
                <View style={styles.lockBadge}>
                  <Lock size={10} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Action Items List - MyGate styled notifications */}
            <Text style={styles.sectionTitle}>High Priority Reminders</Text>
            {tenants.filter(t => t.rentStatus === 'Unpaid').map(t => (
              <View key={t.id} style={styles.actionCard}>
                <View style={styles.actionCardTop}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.actionCardTitle}>{t.name}</Text>
                    <Text style={styles.actionCardSub}>{t.buildingName} • {t.unit}</Text>
                  </View>
                  <View style={styles.dueBadge}>
                    <Text style={styles.dueBadgeText}>-${t.dueAmount.toFixed(0)}</Text>
                  </View>
                </View>
                
                <View style={styles.actionCardBtns}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.actionCallBtn]} 
                    onPress={() => Alert.alert('Voice Link', `Connecting dialer to ${t.name} at ${t.phone}...`)}
                    activeOpacity={0.7}
                  >
                    <Phone size={12} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.actionCallText}>Call Resident</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.actionNotifyBtn]}
                    onPress={() => Alert.alert('Invoice Reminded', `Invoice notification dispatched to ${t.email}`)}
                    activeOpacity={0.7}
                  >
                    <Mail size={12} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                    <Text style={styles.actionNotifyText}>Send Reminder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'buildings' && (
          <View style={styles.tabBodyWrapper}>
            <View style={styles.searchHeader}>
              <View style={[styles.searchContainer, focusedField === 'search' && styles.searchContainerFocused]}>
                <Search size={15} color={focusedField === 'search' ? COLORS.primary : COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search properties..."
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setFocusedField('search')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => setIsBuildingModalOpen(true)}
                activeOpacity={0.8}
              >
                <Plus size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
              {filteredBuildings.map(b => {
                const isExpanded = selectedBuildingId === b.id;
                
                return (
                  <View key={b.id} style={styles.buildingCard}>
                    <TouchableOpacity 
                      style={styles.bldHeader} 
                      onPress={() => setSelectedBuildingId(isExpanded ? null : b.id)}
                      activeOpacity={0.9}
                    >
                      <View style={[styles.bldIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
                        <Building size={18} color={COLORS.primary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: SPACING.md }}>
                        <Text style={styles.bldCardName}>{b.name}</Text>
                        <Text style={styles.bldCardAddress}>{b.address}</Text>
                      </View>
                      <View style={styles.bldHeaderRight}>
                        <View style={[
                          styles.typeTag, 
                          { backgroundColor: b.type === 'Residential' ? COLORS.secondaryLight : COLORS.warningLight }
                        ]}>
                          <Text style={[
                            styles.typeTagText, 
                            { color: b.type === 'Residential' ? COLORS.secondary : COLORS.warning }
                          ]}>{b.type.toUpperCase()}</Text>
                        </View>
                        {isExpanded ? (
                          <ChevronUp size={16} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                        ) : (
                          <ChevronDown size={16} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                        )}
                      </View>
                    </TouchableOpacity>

                    <View style={styles.bldGridMetrics}>
                      <View style={styles.gridMetricItem}>
                        <Text style={styles.gridMetricLabel}>Total Units</Text>
                        <Text style={styles.gridMetricValue}>{b.totalUnits}</Text>
                      </View>
                      <View style={styles.gridMetricItem}>
                        <Text style={styles.gridMetricLabel}>Occupied</Text>
                        <Text style={styles.gridMetricValue}>{b.occupiedUnits}</Text>
                      </View>
                      <View style={styles.gridMetricItem}>
                        <Text style={styles.gridMetricLabel}>Collected</Text>
                        <Text style={[styles.gridMetricValue, { color: COLORS.success }]}>${b.rentPaid.toLocaleString()}</Text>
                      </View>
                    </View>

                    {/* Interactive Blueprints Unit Map Expansion */}
                    {isExpanded && (
                      <View style={styles.blueprintContainer}>
                        <Text style={styles.blueprintTitle}>Interactive Blueprint & Floors Map</Text>
                        {Object.entries(getBuildingFloors(b.id)).map(([floor, unitsList]) => (
                          <View key={floor} style={styles.blueprintFloorRow}>
                            <View style={styles.floorBadge}>
                              <Text style={styles.floorBadgeText}>FL {floor}</Text>
                            </View>
                            <View style={styles.blueprintUnitsGrid}>
                              {unitsList.map(item => (
                                <TouchableOpacity 
                                  key={item.unit}
                                  style={[
                                    styles.blueprintUnitTile,
                                    item.tenant ? styles.unitOccupiedTile : styles.unitVacantTile
                                  ]}
                                  onPress={() => {
                                    if (!item.tenant) {
                                      setSelectedBuildingId(b.id);
                                      setSelectedUnitForAdd(item.unit);
                                      setIsTenantModalOpen(true);
                                    } else {
                                      Alert.alert('Tenant Details', `Leased Unit: ${item.unit}\nResident: ${item.tenant.name}\nContact: ${item.tenant.phone}`);
                                    }
                                  }}
                                  activeOpacity={0.85}
                                >
                                  <Text style={[
                                    styles.unitTileText, 
                                    item.tenant ? { color: COLORS.textPrimary } : { color: COLORS.primary }
                                  ]}>
                                    {item.unit.replace('Apt ', '')}
                                  </Text>
                                  {item.tenant ? (
                                    <Text numberOfLines={1} style={styles.unitTileName}>{item.tenant.name.split(' ')[0]}</Text>
                                  ) : (
                                    <View style={styles.vacantTileAction}>
                                      <UserPlus size={10} color={COLORS.primary} style={{ marginRight: 2 }} />
                                      <Text style={styles.vacantTileLabel}>Add</Text>
                                    </View>
                                  )}
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === 'tenants' && (
          <View style={styles.tabBodyWrapper}>
            <View style={styles.searchHeader}>
              <View style={[styles.searchContainer, focusedField === 'tenantSearch' && styles.searchContainerFocused]}>
                <Search size={15} color={focusedField === 'tenantSearch' ? COLORS.primary : COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search tenant roster..."
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setFocusedField('tenantSearch')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.filterPillsRow}>
              {(['All', 'Paid', 'Unpaid'] as const).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, tenantFilter === f && styles.filterPillActive]}
                  onPress={() => setTenantFilter(f)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterPillText, tenantFilter === f && styles.filterPillTextActive]}>{f.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
              {filteredTenants.map(t => {
                const isPaid = t.rentStatus === 'Paid';
                return (
                  <View key={t.id} style={styles.tenantCard}>
                    <View style={styles.tenantCardTop}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: SPACING.md }}>
                        <Text style={styles.tenantCardName}>{t.name}</Text>
                        <Text style={styles.tenantCardSub}>{t.buildingName} • {t.unit}</Text>
                      </View>
                      <View style={[
                        styles.tenantStatusBadge,
                        isPaid ? { backgroundColor: COLORS.successLight } : { backgroundColor: COLORS.errorLight }
                      ]}>
                        <Text style={[
                          styles.tenantStatusText,
                          isPaid ? { color: COLORS.success } : { color: COLORS.error }
                        ]}>
                          {t.rentStatus.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tenantCardMid}>
                      <Text style={styles.tenantMetaLabel}>Move in: {t.moveInDate}</Text>
                      <Text style={styles.tenantMetaAmount}>${t.rentAmount}/mo</Text>
                    </View>

                    <View style={styles.actionCardBtns}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.actionCallBtn]} 
                        onPress={() => Alert.alert('Dialer Connection', `Calling ${t.name} at ${t.phone}...`)}
                        activeOpacity={0.7}
                      >
                        <Phone size={11} color={COLORS.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.actionCallText}>Call</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.actionNotifyBtn]}
                        onPress={() => Alert.alert('SMS Reminded', `Text message reminder dispatched to ${t.phone}`)}
                        activeOpacity={0.7}
                      >
                        <Mail size={11} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={styles.actionNotifyText}>Remind</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === 'payments' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>Transaction Logs</Text>
            <Text style={styles.tabSubheading}>Audit ledger verification and recent receipts across all units.</Text>
            
            {payments.map(p => (
              <View key={p.id} style={styles.transactionItem}>
                <View style={[styles.transIconBox, { backgroundColor: COLORS.successLight }]}>
                  <CheckCircle2 size={15} color={COLORS.success} />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.transItemTitle}>{p.feeType} Receipt</Text>
                  <Text style={styles.transItemSub}>Tenant: {p.tenantName} • {p.date}</Text>
                </View>
                <Text style={[styles.transItemAmount, { color: COLORS.success }]}>+${p.amount.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'requests' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>Maintenance Command</Text>
            <Text style={styles.tabSubheading}>Dispatch service technicians and toggle ticket statuses.</Text>

            {requests.map(r => {
              const priorityStyle = r.priority === 'High' 
                ? { bg: COLORS.errorLight, txt: COLORS.error }
                : r.priority === 'Medium' 
                  ? { bg: COLORS.warningLight, txt: COLORS.warning } 
                  : { bg: COLORS.infoLight, txt: COLORS.info };

              const statusStyle = r.status === 'Resolved'
                ? { bg: COLORS.successLight, txt: COLORS.success }
                : r.status === 'In Progress'
                  ? { bg: COLORS.warningLight, txt: COLORS.warning }
                  : { bg: COLORS.background, txt: COLORS.textSecondary };

              return (
                <View key={r.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ticketTitle}>{r.title}</Text>
                      <Text style={styles.ticketSubText}>{r.unit} • {r.date}</Text>
                    </View>
                    <View style={[styles.ticketPriorityBadge, { backgroundColor: priorityStyle.bg }]}>
                      <Text style={[styles.ticketPriorityText, { color: priorityStyle.txt }]}>{r.priority.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.ticketDesc}>{r.description}</Text>
                  
                  <View style={styles.ticketFooter}>
                    <View style={styles.ticketCategory}>
                      <Text style={styles.ticketCategoryText}>{r.category.toUpperCase()}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.ticketStatusBtn, { backgroundColor: statusStyle.bg }]}
                      onPress={() => {
                        onToggleRequestStatus(r.id, r.status);
                        Alert.alert('Status Logged', `Support ticket state toggled successfully.`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.ticketStatusBtnText, { color: statusStyle.txt }]}>
                        {r.status.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Premium Active-State Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        {([
          { id: 'dashboard', label: 'Overview', Icon: Home },
          { id: 'buildings', label: 'Units Map', Icon: Building },
          { id: 'tenants', label: 'Tenants', Icon: Users },
          { id: 'payments', label: 'Receipts', Icon: CreditCard },
          { id: 'requests', label: 'Tickets', Icon: Wrench },
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

      {/* Add Building Modal */}
      <Modal visible={isBuildingModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Register Asset Building</Text>
            <Text style={styles.modalSubtitle}>Register a new building property into your portfolio.</Text>
            
            <Text style={styles.modalFieldLabel}>Building Name</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'bldName' && styles.modalTextInputFocused]} 
              placeholder="e.g. Sunset Apartments" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newBldName}
              onChangeText={setNewBldName}
              onFocus={() => setFocusedField('bldName')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Property Type</Text>
            <View style={styles.radioBlock}>
              {(['Residential', 'Commercial'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.radioPill, newBldType === t && styles.radioPillActive]}
                  onPress={() => setNewBldType(t)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.radioPillText, newBldType === t && styles.radioPillTextActive]}>{t.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalFieldLabel}>Units Volume</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'bldUnits' && styles.modalTextInputFocused]} 
              keyboardType="number-pad"
              placeholder="e.g. 15" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newBldUnits}
              onChangeText={setNewBldUnits}
              onFocus={() => setFocusedField('bldUnits')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Property Address</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'bldAddr' && styles.modalTextInputFocused]} 
              placeholder="e.g. 404 Ocean Drive, Miami FL" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newBldAddress}
              onChangeText={setNewBldAddress}
              onFocus={() => setFocusedField('bldAddr')}
              onBlur={() => setFocusedField(null)}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsBuildingModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit]} 
                onPress={handleCreateBuilding}
                activeOpacity={0.9}
              >
                <Text style={styles.modalBtnSubmitText}>Add Property</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Lease Tenant Assignment Modal */}
      <Modal visible={isTenantModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lease Tenant Assignment</Text>
            <Text style={styles.modalSubtitle}>Assign a tenant profile to Unit {selectedUnitForAdd}.</Text>
            
            <Text style={styles.modalFieldLabel}>Tenant Full Name</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'tName' && styles.modalTextInputFocused]} 
              placeholder="e.g. Richard Hendricks" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newTenantName}
              onChangeText={setNewTenantName}
              onFocus={() => setFocusedField('tName')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Email Address</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'tEmail' && styles.modalTextInputFocused]} 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. richard@piedpiper.com" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newTenantEmail}
              onChangeText={setNewTenantEmail}
              onFocus={() => setFocusedField('tEmail')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Phone Number</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'tPhone' && styles.modalTextInputFocused]} 
              keyboardType="phone-pad"
              placeholder="e.g. +1 (555) 0199" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newTenantPhone}
              onChangeText={setNewTenantPhone}
              onFocus={() => setFocusedField('tPhone')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Monthly Rent Amount ($)</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'tRent' && styles.modalTextInputFocused]} 
              keyboardType="numeric"
              placeholder="e.g. 1500" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newTenantRent}
              onChangeText={setNewTenantRent}
              onFocus={() => setFocusedField('tRent')}
              onBlur={() => setFocusedField(null)}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => {
                  setIsTenantModalOpen(false);
                  setSelectedUnitForAdd(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: COLORS.success }]} 
                onPress={handleCreateTenant}
                activeOpacity={0.9}
              >
                <Text style={[styles.modalBtnSubmitText, { color: COLORS.white }]}>Assign Lease</Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTag: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  activeTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.success,
  },
  statValue: {
    ...TYPOGRAPHY.titleMedium,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  dashboardCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.md,
  },
  cardHeaderTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.full,
  },
  progressFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressFooterLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  actionCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionCardTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionCardSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  dueBadge: {
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  dueBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.error,
  },
  actionCardBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  actionCallBtn: {
    backgroundColor: COLORS.primaryLight,
  },
  actionCallText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionNotifyBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  actionNotifyText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },

  // BUILDINGS TAB
  tabBodyWrapper: {
    flex: 1,
    padding: SPACING.lg,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
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
  buildingCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md,
  },
  bldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  bldIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bldCardName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bldCardAddress: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  bldHeaderRight: {
    alignItems: 'flex-end',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: 4,
  },
  typeTagText: {
    fontSize: 8,
    fontWeight: '800',
  },
  bldGridMetrics: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  gridMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridMetricLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  gridMetricValue: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  // Interactive Blueprints Unit Map Expansion
  blueprintContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
    marginTop: SPACING.md,
  },
  blueprintTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  blueprintFloorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  floorBadge: {
    width: 44,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  floorBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  blueprintUnitsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  blueprintUnitTile: {
    width: (width - 160) / 4,
    minWidth: 54,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    marginBottom: 6,
    borderWidth: 1,
  },
  unitOccupiedTile: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  unitVacantTile: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  unitTileText: {
    fontSize: 9,
    fontWeight: '800',
  },
  unitTileName: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 1,
  },
  vacantTileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  vacantTileLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // TENANTS TAB
  filterPillsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: SPACING.sm,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  tenantCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md,
  },
  tenantCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenantCardName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tenantCardSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  tenantStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  tenantStatusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tenantCardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tenantMetaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tenantMetaAmount: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  // RECEIPTS TAB
  tabHeading: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  tabSubheading: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  transIconBox: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  transItemTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  transItemSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  transItemAmount: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
  },

  // TICKETS TAB
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  ticketTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  ticketCategory: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ticketCategoryText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  ticketSubText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  ticketPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
  },
  ticketPriorityText: {
    fontSize: 8,
    fontWeight: '800',
  },
  ticketDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginVertical: SPACING.sm,
  },
  ticketStatusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.xs,
  },
  ticketStatusBtnText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
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
