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
  ActivityIndicator,
} from 'react-native';
import {
  Home as HomeIcon,
  CreditCard,
  Wrench,
  UserCheck,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ArrowRight,
  Shield,
  FileText,
  Building,
  Calendar,
  AlertCircle,
  Search,
  Lock,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { Tenant as TenantType, PaymentHistory as PaymentType, MaintenanceRequest as RequestType, Visitor as VisitorType } from '../mock/data';

interface TenantScreenProps {
  tenants: TenantType[];
  payments: PaymentType[];
  requests: RequestType[];
  visitors: VisitorType[];
  onLogout: () => void;
  onPayRent: () => void;
  onAddRequest: (title: string, desc: string, category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other', priority: 'High' | 'Medium' | 'Low') => void;
  onAddVisitor: (name: string, phone: string, purpose: string, expectedTime: string) => void;
  onAuthorizeVisitor: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

export default function TenantScreen({
  tenants,
  payments,
  requests,
  visitors,
  onLogout,
  onPayRent,
  onAddRequest,
  onAddVisitor,
  onAuthorizeVisitor,
}: TenantScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'requests' | 'visitors' | 'settings'>('dashboard');

  // Modals
  const [isPayRentModalOpen, setIsPayRentModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);

  // Form states
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqDesc, setNewReqDesc] = useState('');
  const [newReqCategory, setNewReqCategory] = useState<'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other'>('Other');
  const [newReqPriority, setNewReqPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const [newVisName, setNewVisName] = useState('');
  const [newVisPhone, setNewVisPhone] = useState('');
  const [newVisPurpose, setNewVisPurpose] = useState('');
  const [newVisTime, setNewVisTime] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const currentTenant = tenants.find(t => t.id === 't2') || tenants[1]; // Default John Smith

  const handlePayRentConfirm = () => {
    onPayRent();
    setIsPayRentModalOpen(false);
    Alert.alert('Payment Success', 'Rent payment processed successfully.');
  };

  const handleCreateRequest = () => {
    if (!newReqTitle || !newReqDesc) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onAddRequest(newReqTitle, newReqDesc, newReqCategory, newReqPriority);
    setIsRequestModalOpen(false);
    setNewReqTitle('');
    setNewReqDesc('');
    setNewReqCategory('Other');
    setNewReqPriority('Medium');
    Alert.alert('Ticket Created', 'Support ticket logged with management.');
  };

  const handleCreateVisitor = () => {
    if (!newVisName || !newVisPhone || !newVisPurpose || !newVisTime) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onAddVisitor(newVisName, newVisPhone, newVisPurpose, newVisTime);
    setIsVisitorModalOpen(false);
    setNewVisName('');
    setNewVisPhone('');
    setNewVisPurpose('');
    setNewVisTime('');
    Alert.alert('Guest Pre-Approved', 'Gate system notified. QR code sent.');
  };

  const myPendingVisitors = visitors.filter(v => v.tenant_id === currentTenant.id && v.status === 'PENDING');

  return (
    <View style={styles.container}>
      {/* Premium Top Navigation */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTagline}>{currentTenant.buildingName.toUpperCase()} • UNIT {currentTenant.unit.replace('Unit ', '')}</Text>
          <Text style={styles.headerTitle}>Welcome, {currentTenant.name.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutCircleBtn} activeOpacity={0.8}>
          <LogOut size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Body Surface */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* High-priority Pending Visitor Clearance Panel */}
            {myPendingVisitors.length > 0 && (
              <View style={styles.pendingVisContainer}>
                <View style={styles.pendingVisHeader}>
                  <View style={styles.shieldPulseContainer}>
                    <Shield size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.pendingVisTitle}>Security Authorization</Text>
                </View>
                
                {myPendingVisitors.map(v => (
                  <View key={v.id} style={styles.pendingVisCard}>
                    <View style={styles.pendingVisInfo}>
                      <Text style={styles.pendingVisName}>{v.visitor_name}</Text>
                      <Text style={styles.pendingVisDetails}>
                        {v.purpose.toUpperCase()} • {v.visitor_phone}
                      </Text>
                    </View>
                    <View style={styles.pendingVisActions}>
                      <TouchableOpacity 
                        style={[styles.pendingVisBtn, styles.pendingVisDenyBtn]}
                        onPress={() => {
                          onAuthorizeVisitor(v.id, 'REJECTED');
                          Alert.alert('Visitor Blocked', 'Access denied. Security desk notified.');
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.pendingVisDenyText}>Block</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.pendingVisBtn, styles.pendingVisApproveBtn]}
                        onPress={() => {
                          onAuthorizeVisitor(v.id, 'APPROVED');
                          Alert.alert('Access Cleared', 'Access granted. Gate notified.');
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.pendingVisApproveText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Premium Rent Ledger Widget */}
            <View style={styles.ledgerCard}>
              <View style={styles.ledgerHeader}>
                <Text style={styles.ledgerHeaderLabel}>Rent Ledger</Text>
                <View style={[
                  styles.statusBadge, 
                  currentTenant.rentStatus === 'Paid' ? { backgroundColor: COLORS.successLight } : { backgroundColor: COLORS.errorLight }
                ]}>
                  <Text style={[
                    styles.statusBadgeText, 
                    currentTenant.rentStatus === 'Paid' ? { color: COLORS.success } : { color: COLORS.error }
                  ]}>
                    {currentTenant.rentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              {currentTenant.rentStatus === 'Paid' ? (
                <View style={styles.ledgerBody}>
                  <Text style={[styles.largeAmountText, { color: COLORS.success }]}>$0.00 Due</Text>
                  <Text style={styles.ledgerFooterLabel}>Your ledger is completely settled. Thank you!</Text>
                </View>
              ) : (
                <View style={styles.ledgerBody}>
                  <Text style={[styles.largeAmountText, { color: COLORS.error }]}>${currentTenant.dueAmount} Due</Text>
                  <Text style={styles.ledgerFooterLabel}>Due Date: June 15, 2026</Text>
                  
                  <TouchableOpacity 
                    style={styles.payRentBtn}
                    onPress={() => setIsPayRentModalOpen(true)}
                    activeOpacity={0.9}
                  >
                    <CreditCard size={14} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
                    <Text style={styles.payRentBtnText}>Resettle Ledger</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Quick Actions grid - MyGate style */}
            <Text style={styles.sectionTitle}>Ecosystem Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, { borderLeftColor: COLORS.secondary, borderLeftWidth: 3 }]}
                onPress={() => setIsVisitorModalOpen(true)}
                activeOpacity={0.85}
              >
                <View style={[styles.actionIconBg, { backgroundColor: COLORS.secondaryLight }]}>
                  <UserCheck size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.actionCardTitle}>Pre-Approve</Text>
                <Text style={styles.actionCardSub}>Register guests</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { borderLeftColor: COLORS.warning, borderLeftWidth: 3 }]}
                onPress={() => setIsRequestModalOpen(true)}
                activeOpacity={0.85}
              >
                <View style={[styles.actionIconBg, { backgroundColor: COLORS.warningLight }]}>
                  <Wrench size={18} color={COLORS.warning} />
                </View>
                <Text style={styles.actionCardTitle}>Support Ticket</Text>
                <Text style={styles.actionCardSub}>File a complaint</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { borderLeftColor: COLORS.success, borderLeftWidth: 3 }]}
                onPress={() => {
                  if (currentTenant.rentStatus === 'Paid') {
                    Alert.alert('Ledger Settled', 'Your invoices are fully paid!');
                  } else {
                    setIsPayRentModalOpen(true);
                  }
                }}
                activeOpacity={0.85}
              >
                <View style={[styles.actionIconBg, { backgroundColor: COLORS.successLight }]}>
                  <CreditCard size={18} color={COLORS.success} />
                </View>
                <Text style={styles.actionCardTitle}>Pay Invoice</Text>
                <Text style={styles.actionCardSub}>Resettle accounts</Text>
              </TouchableOpacity>

              {/* Locked Amenity Booking Card */}
              <TouchableOpacity 
                style={[styles.actionCard, styles.actionCardLocked]}
                onPress={() => Alert.alert('Premium Amenity', 'Amenities booking is currently locked for this unit. Please contact management.')}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBg, { backgroundColor: COLORS.textMuted + '15' }]}>
                  <Building size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.actionCardTitle}>Book Amenities</Text>
                <Text style={styles.actionCardSub}>Clubhouse, pool</Text>
                <View style={styles.lockBadge}>
                  <Lock size={10} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Notices feed */}
            <Text style={styles.sectionTitle}>Notice Board</Text>
            <View style={styles.noticeCard}>
              <View style={styles.noticeIconCircle}>
                <AlertTriangle size={16} color={COLORS.warning} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.noticeTitle}>Elevator Service Maintenance</Text>
                <Text style={styles.noticeDesc}>
                  Elevator B will be shut down for routine cable inspection tomorrow, 1:00 PM to 3:00 PM.
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'payments' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>Receipts & Ledger</Text>
            <Text style={styles.tabSubheading}>Breakdown of monthly fee structure and historical receipts.</Text>
            
            <View style={styles.structureCard}>
              <Text style={styles.structureTitle}>Monthly Fee Structure</Text>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Base Rent</Text>
                <Text style={styles.structureValue}>$1,100.00</Text>
              </View>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Amenities & Cleaning</Text>
                <Text style={styles.structureValue}>$70.00</Text>
              </View>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Utility Reserve</Text>
                <Text style={styles.structureValue}>$30.00</Text>
              </View>
              <View style={styles.structureDivider} />
              <View style={styles.structureTotalRow}>
                <Text style={styles.structureTotalLabel}>Total Monthly Rent</Text>
                <Text style={styles.structureTotalValue}>$1,200.00</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Payment Logs</Text>
            {payments.map(p => (
              <View key={p.id} style={styles.transactionCard}>
                <View style={[styles.transIconBox, { backgroundColor: COLORS.successLight }]}>
                  <CheckCircle2 size={16} color={COLORS.success} />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.transCardTitle}>{p.feeType} Payment</Text>
                  <Text style={styles.transCardSub}>{p.date} • Verified receipt</Text>
                </View>
                <Text style={[styles.transCardAmount, { color: COLORS.success }]}>+${p.amount.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'requests' && (
          <View style={styles.tabBodyWrapper}>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Support Tickets</Text>
                <Text style={styles.tabSubheading}>Audit and submit building repair tickets.</Text>
              </View>
              <TouchableOpacity 
                style={styles.addFloatingBtn}
                onPress={() => setIsRequestModalOpen(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
              {requests.filter(r => r.tenantName === currentTenant.name).map(r => {
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
                        <Text style={styles.ticketDate}>{r.date}</Text>
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
                      <View style={[styles.ticketStatusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.ticketStatusText, { color: statusStyle.txt }]}>{r.status.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === 'visitors' && (
          <View style={styles.tabBodyWrapper}>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Guest Registers</Text>
                <Text style={styles.tabSubheading}>Configure pre-approved guest entries.</Text>
              </View>
              <TouchableOpacity 
                style={styles.addFloatingBtn}
                onPress={() => setIsVisitorModalOpen(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
              {visitors.filter(v => v.tenant_id === currentTenant.id).map(v => {
                const isApproved = v.status === 'APPROVED';
                return (
                  <View key={v.id} style={styles.guestCard}>
                    <View style={styles.guestCardHeader}>
                      <View style={styles.guestAvatarCircle}>
                        <Text style={styles.guestAvatarText}>{v.visitor_name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: SPACING.md }}>
                        <Text style={styles.guestName}>{v.visitor_name}</Text>
                        <Text style={styles.guestSub}>{v.purpose} • Shift: Guard {v.security_staff}</Text>
                      </View>
                      <View style={[
                        styles.guestStatusBadge, 
                        isApproved ? { backgroundColor: COLORS.successLight } : { backgroundColor: COLORS.warningLight }
                      ]}>
                        <Text style={[
                          styles.guestStatusText, 
                          isApproved ? { color: COLORS.success } : { color: COLORS.warning }
                        ]}>
                          {v.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === 'settings' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>Profile & Settings</Text>
            <Text style={styles.tabSubheading}>Configure security options and check digital lease logs.</Text>
            
            <View style={styles.profileCard}>
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.profileAvatarLargeText}>JS</Text>
              </View>
              <Text style={styles.profileName}>{currentTenant.name}</Text>
              <Text style={styles.profileEmail}>{currentTenant.email}</Text>
              <Text style={styles.profileUnit}>{currentTenant.buildingName} • {currentTenant.unit}</Text>
            </View>

            <View style={styles.optionsList}>
              <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Offline Mode', 'Profile editing disabled.')} activeOpacity={0.7}>
                <Text style={styles.optionItemText}>Personal Details</Text>
                <ChevronRight size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Offline Mode', 'Notifications config.')} activeOpacity={0.7}>
                <Text style={styles.optionItemText}>App Notifications</Text>
                <ChevronRight size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Lease Agreement', 'Loading digital contract lease logs...')} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={15} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.optionItemText}>Lease Agreement (PDF)</Text>
                </View>
                <ChevronRight size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.actionLogoutBtn} 
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <LogOut size={15} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
              <Text style={styles.actionLogoutText}>Log Out Account</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Modern Active-State Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        {([
          { id: 'dashboard', label: 'Home', Icon: HomeIcon },
          { id: 'payments', label: 'Bills', Icon: CreditCard },
          { id: 'requests', label: 'Support', Icon: Wrench },
          { id: 'visitors', label: 'Guests', Icon: UserCheck },
          { id: 'settings', label: 'Profile', Icon: SettingsIcon },
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
      
      {/* Rent Payment Modal */}
      <Modal visible={isPayRentModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rent Paydesk</Text>
            <Text style={styles.modalSubtitle}>Settle due invoices for {currentTenant.buildingName}, {currentTenant.unit}.</Text>
            
            <View style={styles.ledgerSumCard}>
              <Text style={styles.ledgerSumLabel}>Invoice Sum Total</Text>
              <Text style={styles.ledgerSumAmount}>${currentTenant.dueAmount.toFixed(2)}</Text>
            </View>

            <Text style={styles.modalFieldLabel}>Select payment card</Text>
            <View style={styles.cardSelectCard}>
              <Text style={styles.cardSelectTitle}>Credit Card (Default)</Text>
              <Text style={styles.cardSelectSub}>Visa Card •••• 4242</Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsPayRentModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: COLORS.success }]} 
                onPress={handlePayRentConfirm}
                activeOpacity={0.9}
              >
                <Text style={[styles.modalBtnSubmitText, { color: COLORS.white }]}>Settle Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Raise Support Ticket Modal */}
      <Modal visible={isRequestModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>File Complaint Ticket</Text>
            <Text style={styles.modalSubtitle}>Report property/unit issues to the property owner.</Text>
            
            <Text style={styles.modalFieldLabel}>Ticket Title</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'title' && styles.modalTextInputFocused]} 
              placeholder="e.g. Bathroom sink pipe leaking" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newReqTitle}
              onChangeText={setNewReqTitle}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Issue Description</Text>
            <TextInput 
              style={[styles.modalTextInputField, { height: 75, textAlignVertical: 'top' }, focusedField === 'desc' && styles.modalTextInputFocused]} 
              multiline
              placeholder="Provide a detailed description of the maintenance requested..." 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newReqDesc}
              onChangeText={setNewReqDesc}
              onFocus={() => setFocusedField('desc')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Category Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
              {(['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Other'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pillSelector, newReqCategory === cat && styles.pillSelectorActive]}
                  onPress={() => setNewReqCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillSelectorText, newReqCategory === cat && styles.pillSelectorTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalFieldLabel}>Priority Severity</Text>
            <View style={styles.radioBlock}>
              {(['Low', 'Medium', 'High'] as const).map(prio => (
                <TouchableOpacity
                  key={prio}
                  style={[styles.radioPill, newReqPriority === prio && styles.radioPillActive]}
                  onPress={() => setNewReqPriority(prio)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.radioPillText, newReqPriority === prio && styles.radioPillTextActive]}>{prio.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsRequestModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit]} 
                onPress={handleCreateRequest}
                activeOpacity={0.9}
              >
                <Text style={styles.modalBtnSubmitText}>Create Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Guest Clearance Modal */}
      <Modal visible={isVisitorModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pre-Approve Guest Entry</Text>
            <Text style={styles.modalSubtitle}>Dispatch digital clearance code to gate guard roster.</Text>
            
            <Text style={styles.modalFieldLabel}>Visitor Full Name</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'guestName' && styles.modalTextInputFocused]} 
              placeholder="e.g. Richard Hendricks" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newVisName}
              onChangeText={setNewVisName}
              onFocus={() => setFocusedField('guestName')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Phone Number</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'guestPhone' && styles.modalTextInputFocused]} 
              keyboardType="phone-pad"
              placeholder="e.g. +1 (555) 0199" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newVisPhone}
              onChangeText={setNewVisPhone}
              onFocus={() => setFocusedField('guestPhone')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Purpose of Visit</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'guestPurpose' && styles.modalTextInputFocused]} 
              placeholder="e.g. Dinner Guest / Package Delivery" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newVisPurpose}
              onChangeText={setNewVisPurpose}
              onFocus={() => setFocusedField('guestPurpose')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.modalFieldLabel}>Expected Arrival Time</Text>
            <TextInput 
              style={[styles.modalTextInputField, focusedField === 'guestTime' && styles.modalTextInputFocused]} 
              placeholder="e.g. Today, 6:00 PM" 
              placeholderTextColor={COLORS.textPlaceholder}
              value={newVisTime}
              onChangeText={setNewVisTime}
              onFocus={() => setFocusedField('guestTime')}
              onBlur={() => setFocusedField(null)}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsVisitorModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: COLORS.secondary }]} 
                onPress={handleCreateVisitor}
                activeOpacity={0.9}
              >
                <Text style={styles.modalBtnSubmitText}>Register Guest</Text>
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
  headerTagline: {
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
  pendingVisContainer: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  pendingVisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  shieldPulseContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  pendingVisTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.warningDark,
  },
  pendingVisCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  pendingVisInfo: {
    marginBottom: SPACING.md,
  },
  pendingVisName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pendingVisDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  pendingVisActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pendingVisBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  pendingVisDenyBtn: {
    backgroundColor: COLORS.errorLight,
  },
  pendingVisApproveBtn: {
    backgroundColor: COLORS.successLight,
  },
  pendingVisDenyText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.error,
  },
  pendingVisApproveText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.success,
  },
  ledgerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ledgerHeaderLabel: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ledgerBody: {
    marginTop: SPACING.sm,
  },
  largeAmountText: {
    ...TYPOGRAPHY.display,
    marginVertical: SPACING.xs,
    letterSpacing: -1,
  },
  ledgerFooterLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  payRentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  payRentBtnText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleSmall,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'flex-start',
    ...SHADOWS.sm,
  },
  actionCardLocked: {
    opacity: 0.55,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textMuted,
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
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionCardTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  actionCardSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  noticeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noticeDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },

  // BILLS TAB
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
  structureCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  structureTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  structureLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  structureValue: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  structureDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
  },
  structureTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  structureTotalLabel: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  structureTotalValue: {
    ...TYPOGRAPHY.titleSmall,
    fontWeight: '800',
    color: COLORS.primary,
  },
  transactionCard: {
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
  transIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transCardTitle: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  transCardSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  transCardAmount: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
  },

  // SUPPORT TAB
  tabBodyWrapper: {
    flex: 1,
    padding: SPACING.lg,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addFloatingBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
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
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ticketDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
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
    letterSpacing: 0.5,
  },
  ticketDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.md,
  },
  ticketCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ticketCategoryText: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontWeight: '800',
  },
  ticketStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  ticketStatusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // GUESTS TAB
  guestCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  guestCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestAvatarText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  guestName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  guestSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  guestStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  guestStatusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // SETTINGS TAB
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.md,
  },
  profileAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  profileAvatarLargeText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  profileName: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  profileEmail: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileUnit: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  optionsList: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  optionItemText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  actionLogoutBtn: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  actionLogoutText: {
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
    marginBottom: 4,
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
  selectionScroll: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  pillSelector: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  pillSelectorActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillSelectorText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  pillSelectorTextActive: {
    color: COLORS.white,
    fontWeight: '800',
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
  ledgerSumCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ledgerSumLabel: {
    ...TYPOGRAPHY.labelUpper,
    fontSize: 8,
  },
  ledgerSumAmount: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  cardSelectCard: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardSelectTitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primary,
    fontWeight: '700',
  },
  cardSelectSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
});
