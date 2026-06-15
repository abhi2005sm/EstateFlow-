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
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
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

  const currentTenant = tenants.find(t => t.id === 't2') || tenants[1]; // Default John Smith

  const handlePayRentConfirm = () => {
    onPayRent();
    setIsPayRentModalOpen(false);
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
  };

  // Filter pending visitor notifications that belong to this tenant
  const myPendingVisitors = visitors.filter(v => v.tenant_id === currentTenant.id && v.status === 'PENDING');

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>RESIDENT HUB</Text>
          <Text style={styles.headerTitle}>Welcome, {currentTenant.name.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            
            {/* Real-time visitor authorization request notification */}
            {myPendingVisitors.length > 0 && (
              <View style={styles.authNoticeCard}>
                <View style={styles.authHeader}>
                  <AlertTriangle size={18} color="#F26922" />
                  <Text style={styles.authTitle}>Gate Entrance Request</Text>
                </View>
                {myPendingVisitors.map(v => (
                  <View key={v.id} style={styles.authDetailRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.authDetailName}>{v.visitor_name}</Text>
                      <Text style={styles.authDetailPurpose}>{v.purpose} • {v.visitor_phone}</Text>
                    </View>
                    <View style={styles.authActionRow}>
                      <TouchableOpacity 
                        style={[styles.authBtn, styles.authRejectBtn]}
                        onPress={() => {
                          onAuthorizeVisitor(v.id, 'REJECTED');
                          Alert.alert('Visitor Rejected', 'Gate entry request denied.');
                        }}
                      >
                        <Text style={styles.authBtnText}>Deny</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.authBtn, styles.authApproveBtn]}
                        onPress={() => {
                          onAuthorizeVisitor(v.id, 'APPROVED');
                          Alert.alert('Visitor Approved', 'Access granted. Security informed.');
                        }}
                      >
                        <Text style={[styles.authBtnText, { color: COLORS.black }]}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Rent Status Card */}
            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardCardSub}>Rent Ledger Status</Text>
              
              {currentTenant.rentStatus === 'Paid' ? (
                <View>
                  <Text style={[styles.largeTotalAmount, { color: COLORS.accent }]}>PAID</Text>
                  <Text style={styles.collectionEfficiency}>Rent paid for the month. Thank you!</Text>
                </View>
              ) : (
                <View>
                  <Text style={[styles.largeTotalAmount, { color: COLORS.accentUnpaid }]}>${currentTenant.dueAmount} Due</Text>
                  <Text style={styles.collectionEfficiency}>Due Date: June 15, 2026</Text>
                  
                  <TouchableOpacity 
                    style={styles.payNowBtn}
                    onPress={() => setIsPayRentModalOpen(true)}
                  >
                    <CreditCard size={16} color={COLORS.black} style={{ marginRight: SPACING.sm }} />
                    <Text style={styles.payNowBtnText}>Pay Rent Instantly</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionHeader}>Quick Operations</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={styles.gridActionCard}
                onPress={() => setIsVisitorModalOpen(true)}
              >
                <UserCheck size={24} color={COLORS.primary} />
                <Text style={styles.gridActionTitle}>Pre-Approve Guest</Text>
                <Text style={styles.gridActionSub}>Gate clearance codes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.gridActionCard}
                onPress={() => setIsRequestModalOpen(true)}
              >
                <Wrench size={24} color={COLORS.warning} />
                <Text style={styles.gridActionTitle}>Request Repair</Text>
                <Text style={styles.gridActionSub}>File ticket to admin</Text>
              </TouchableOpacity>
            </View>

            {/* General Announcements */}
            <Text style={styles.sectionHeader}>Notice Board</Text>
            <View style={styles.announcementCard}>
              <AlertTriangle size={18} color={COLORS.warning} style={{ marginRight: SPACING.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.announcementTitle}>Elevator Service Maintenance</Text>
                <Text style={styles.announcementDesc}>
                  Elevator B will be shut down for routine cable inspection tomorrow, 1:00 PM to 3:00 PM.
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'payments' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <Text style={styles.tabTitle}>Receipts & Ledger</Text>
            
            {/* Bill breakdown */}
            <View style={styles.dashboardCard}>
              <Text style={styles.cardTitle}>Monthly Fee Structure</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Base Rent</Text>
                <Text style={styles.breakdownValue}>$1,100</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Amenities & Cleaning</Text>
                <Text style={styles.breakdownValue}>$70</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Utility Reserve</Text>
                <Text style={styles.breakdownValue}>$30</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { fontWeight: 'bold' }]}>Total Monthly Bill</Text>
                <Text style={[styles.breakdownValue, { fontWeight: 'bold' }]}>$1,200</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Payment History</Text>
            {payments.map(p => (
              <View key={p.id} style={styles.transactionItem}>
                <View style={styles.transIconCircle}>
                  <CheckCircle2 size={16} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.transTitle}>{p.feeType}</Text>
                  <Text style={styles.transSub}>{p.date}</Text>
                </View>
                <Text style={[styles.transAmount, { color: COLORS.accent }]}>+${p.amount}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'requests' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBarRow}>
              <Text style={styles.tabTitle}>My Support Tickets</Text>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => setIsRequestModalOpen(true)}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {requests.filter(r => r.tenantName === currentTenant.name).map(r => (
                <View key={r.id} style={styles.requestCard}>
                  <View style={styles.reqHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reqTitle}>{r.title}</Text>
                      <Text style={styles.reqSub}>{r.date}</Text>
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
                    <View style={[
                      styles.statusToggleBtn,
                      r.status === 'Resolved' ? styles.btnResolved : r.status === 'In Progress' ? styles.btnProgress : styles.btnPending
                    ]}>
                      <Text style={styles.statusToggleText}>{r.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'visitors' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBarRow}>
              <Text style={styles.tabTitle}>Pre-Approved Visitors</Text>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => setIsVisitorModalOpen(true)}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {visitors.filter(v => v.tenant_id === currentTenant.id).map(v => (
                <View key={v.id} style={styles.visitorCard}>
                  <View style={styles.visHeader}>
                    <UserCheck size={20} color={COLORS.primary} />
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={styles.visName}>{v.visitor_name}</Text>
                      <Text style={styles.visSub}>{v.purpose} • Shift Guard: {v.security_staff}</Text>
                    </View>
                    <View style={[
                      styles.visStatusBadge,
                      v.status === 'PENDING' ? styles.visPending : v.status === 'APPROVED' ? styles.visApproved : styles.visCompleted
                    ]}>
                      <Text style={styles.visStatusText}>{v.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'settings' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <Text style={styles.tabTitle}>Resident Settings</Text>
            
            <View style={styles.profileCard}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>JS</Text>
              </View>
              <Text style={styles.profileName}>{currentTenant.name}</Text>
              <Text style={styles.profileEmail}>{currentTenant.email}</Text>
              <Text style={styles.profileUnit}>{currentTenant.buildingName} • {currentTenant.unit}</Text>
            </View>

            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert('Information', 'Tenant profile edits are disabled in mock mode.')}>
                <Text style={styles.settingsItemText}>Personal Details</Text>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert('Information', 'Notifications configuration.')}>
                <Text style={styles.settingsItemText}>App Notifications</Text>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert('Digital Lease', 'Loading Lease Agreement PDF...')}>
                <Text style={styles.settingsItemText}>Lease Agreement (PDF)</Text>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, styles.logoutBtnAction]} 
              onPress={onLogout}
            >
              <LogOut size={16} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
              <Text style={styles.loginBtnText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('dashboard')}>
          <HomeIcon size={20} color={activeTab === 'dashboard' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('payments')}>
          <CreditCard size={20} color={activeTab === 'payments' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'payments' && styles.tabLabelActive]}>Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('requests')}>
          <Wrench size={20} color={activeTab === 'requests' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'requests' && styles.tabLabelActive]}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('visitors')}>
          <UserCheck size={20} color={activeTab === 'visitors' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'visitors' && styles.tabLabelActive]}>Guests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('settings')}>
          <SettingsIcon size={20} color={activeTab === 'settings' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabLabelText, activeTab === 'settings' && styles.tabLabelActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {/* Pay Rent Modal */}
      <Modal visible={isPayRentModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rent Paydesk</Text>
            <Text style={styles.payModalText}>You are checking out for Sunset Apartments, Apt 202.</Text>
            
            <View style={styles.paymentSumCard}>
              <Text style={styles.paySumLabel}>Total Rent Invoice</Text>
              <Text style={styles.paySumAmount}>$1,200.00</Text>
            </View>

            <Text style={styles.inputLabel}>Choose Card</Text>
            <View style={styles.paymentOptionCard}>
              <Text style={styles.paymentOptionTitle}>Credit Card</Text>
              <Text style={styles.paymentOptionSub}>Visa •••• 4242</Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsPayRentModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: COLORS.accent }]} 
                onPress={handlePayRentConfirm}
              >
                <Text style={[styles.modalBtnSubmitText, { color: COLORS.black }]}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Request Ticket Modal */}
      <Modal visible={isRequestModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>File Maintenance Ticket</Text>
            
            <Text style={styles.inputLabel}>Issue Title</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. Bathroom light flickering" 
              placeholderTextColor={COLORS.textMuted}
              value={newReqTitle}
              onChangeText={setNewReqTitle}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput 
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]} 
              multiline
              placeholder="Write descriptive detail of repair request..." 
              placeholderTextColor={COLORS.textMuted}
              value={newReqDesc}
              onChangeText={setNewReqDesc}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalSelector}>
              {(['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Other'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.selectionTag, newReqCategory === cat && styles.selectionTagActive]}
                  onPress={() => setNewReqCategory(cat)}
                >
                  <Text style={[styles.selectionTagText, newReqCategory === cat && styles.selectionTagTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.radioRow}>
              {(['Low', 'Medium', 'High'] as const).map(prio => (
                <TouchableOpacity
                  key={prio}
                  style={[styles.radioOption, newReqPriority === prio && styles.radioActive]}
                  onPress={() => setNewReqPriority(prio)}
                >
                  <Text style={[styles.radioText, newReqPriority === prio && styles.radioTextActive]}>{prio}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsRequestModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit]} 
                onPress={handleCreateRequest}
              >
                <Text style={styles.modalBtnSubmitText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Visitor Pre-approve Modal */}
      <Modal visible={isVisitorModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pre-Approve Guest Entry</Text>
            
            <Text style={styles.inputLabel}>Visitor Full Name</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. Elon Musk" 
              placeholderTextColor={COLORS.textMuted}
              value={newVisName}
              onChangeText={setNewVisName}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              style={styles.modalInput} 
              keyboardType="phone-pad"
              placeholder="e.g. +1 555-9876" 
              placeholderTextColor={COLORS.textMuted}
              value={newVisPhone}
              onChangeText={setNewVisPhone}
            />

            <Text style={styles.inputLabel}>Purpose of Visit</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. Dinner / Business Meeting" 
              placeholderTextColor={COLORS.textMuted}
              value={newVisPurpose}
              onChangeText={setNewVisPurpose}
            />

            <Text style={styles.inputLabel}>Expected Arrival Time</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="e.g. Today, 7:30 PM" 
              placeholderTextColor={COLORS.textMuted}
              value={newVisTime}
              onChangeText={setNewVisTime}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setIsVisitorModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSubmit]} 
                onPress={handleCreateVisitor}
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
  authNoticeCard: {
    backgroundColor: 'rgba(242, 105, 34, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(242, 105, 34, 0.2)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  authTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F26922',
    marginLeft: SPACING.sm,
  },
  authDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(242, 105, 34, 0.1)',
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
  },
  authDetailName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  authDetailPurpose: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  authActionRow: {
    flexDirection: 'row',
  },
  authBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  authRejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  authApproveBtn: {
    backgroundColor: COLORS.accent,
  },
  authBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
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
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  payNowBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  gridActionCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  gridActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  gridActionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  announcementDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  // BILLS
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  breakdownLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  },

  // SUPPORT
  searchBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

  // GUESTS
  visitorCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  visHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  visSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  visStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  visPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  visApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  visCompleted: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  visStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // SETTINGS
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarLargeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileUnit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
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
    backgroundColor: COLORS.accentUnpaid,
    justifyContent: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
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
  payModalText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.lg,
  },
  paymentSumCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  paySumLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  paySumAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  paymentOptionCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  paymentOptionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentOptionSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  horizontalSelector: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  selectionTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selectionTagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectionTagText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  selectionTagTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
});
