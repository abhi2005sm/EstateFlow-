import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from './src/styles/theme';
import {
  buildingsData as initialBuildings,
  tenantsData as initialTenants,
  paymentHistoryData as initialPayments,
  maintenanceRequestsData as initialRequests,
  visitorsData as initialVisitors,
  ownersData as initialOwners,
  Building as BuildingType,
  Tenant as TenantType,
  PaymentHistory as PaymentType,
  MaintenanceRequest as RequestType,
  Visitor as VisitorType,
  Owner as OwnerType,
  SecurityStaff,
} from './src/mock/data';

import { apiRequest } from './src/api/api';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import TenantScreen from './src/screens/TenantScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import SuperAdminScreen from './src/screens/SuperAdminScreen';

export default function App() {
  // Shared Live Simulation State Database
  const [screenState, setScreenState] = useState<'landing' | 'login' | 'superadmin' | 'admin' | 'tenant' | 'security'>('landing');
  const [onDutyGuard, setOnDutyGuard] = useState<SecurityStaff | null>(null);

  const [buildings, setBuildings] = useState<BuildingType[]>(initialBuildings);
  const [tenants, setTenants] = useState<TenantType[]>(initialTenants);
  const [payments, setPayments] = useState<PaymentType[]>(initialPayments);
  const [requests, setRequests] = useState<RequestType[]>(initialRequests);
  const [visitors, setVisitors] = useState<VisitorType[]>(initialVisitors);
  const [owners, setOwners] = useState<OwnerType[]>(initialOwners);

  // Load live data from the backend microservices when authenticated
  useEffect(() => {
    const loadBackendData = async () => {
      if (screenState === 'landing' || screenState === 'login') return;

      console.log(`[Mobile App] Loading backend data for screen: ${screenState}`);

      try {
        if (screenState === 'superadmin') {
          const res = await apiRequest('/users/super-admin/owners/');
          if (res && res.owners) {
            const mappedOwners = res.owners.map((o: any) => ({
              id: String(o.owner_id),
              name: o.name || 'Unknown',
              email: o.email || '',
              totalBuildings: o.total_buildings || 0,
              residentialCount: o.residential_count || 0,
              commercialCount: o.commercial_count || 0,
              isActive: o.is_active ?? true,
            }));
            setOwners(mappedOwners);
          }
        } 
        else if (screenState === 'admin') {
          // 1. Fetch buildings
          const buildingsRes = await apiRequest('/users/buildings/');
          let mappedBuildings = initialBuildings;
          if (buildingsRes && buildingsRes.buildings) {
            mappedBuildings = buildingsRes.buildings.map((b: any, idx: number) => ({
              id: String(b.building_id),
              serialNumber: idx + 1,
              name: b.name,
              type: b.building_type as any,
              totalUnits: b.total_units || 0,
              occupiedUnits: b.units ? b.units.filter((u: any) => u.is_occupied).length : 0,
              rentPaid: parseFloat(b.rent_paid) || 0,
              rentDue: parseFloat(b.rent_due) || 0,
              address: b.area_name ? `${b.area_name}, ${b.city || ''}` : 'Local Address',
              units: b.units || [],
            }));
            setBuildings(mappedBuildings);
          }

          // 2. Fetch tenants
          const tenantsRes = await apiRequest('/users/tenants/');
          if (Array.isArray(tenantsRes)) {
            const mappedTenants = tenantsRes.map((t: any, idx: number) => {
              const bld = mappedBuildings.find((b: any) => String(b.id) === String(t.building));
              return {
                id: String(t.tenant_id),
                serialNumber: idx + 1,
                name: t.name || 'Unknown',
                unit: t.unit ? `Unit ${t.unit}` : 'N/A',
                buildingId: String(t.building),
                buildingName: bld ? bld.name : 'Unknown Building',
                phone: t.phone_number || '',
                email: t.email || '',
                rentAmount: parseFloat(t.rent_amount) || 0,
                rentStatus: t.rent_status as any,
                dueAmount: parseFloat(t.due_amount) || 0,
                moveInDate: t.lease_start_date || 'N/A',
                complainRate: 100,
              };
            });
            setTenants(mappedTenants);
          }

          // 3. Fetch payments
          const paymentsRes = await apiRequest('/users/payments/');
          if (Array.isArray(paymentsRes)) {
            const mappedPayments = paymentsRes.map((p: any) => ({
              id: String(p.payment_id),
              tenantName: p.tenant_name || 'Resident',
              feeType: p.fee_type || 'Rent',
              amount: parseFloat(p.amount) || 0,
              date: p.payment_date || p.created_at?.split('T')[0] || '',
              status: (p.status === 'Paid' ? 'Paid' : 'Pending') as 'Paid' | 'Pending',
            }));
            setPayments(mappedPayments);
          }

          // 4. Fetch maintenance requests
          const requestsRes = await apiRequest('/users/owners/maintenance/');
          if (Array.isArray(requestsRes)) {
            const mappedRequests = requestsRes.map((r: any) => ({
              id: String(r.request_id),
              tenantName: r.tenant_name || 'Resident',
              unit: `${r.building_name || 'Building'}, ${r.unit_code || 'Unit'}`,
              title: r.issue_title || 'Maintenance Request',
              description: r.description || '',
              category: 'Plumbing' as 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other',
              priority: 'Medium' as 'High' | 'Medium' | 'Low',
              status: r.status as any,
              date: r.created_at?.split('T')[0] || '',
            }));
            setRequests(mappedRequests);
          }
        } 
        else if (screenState === 'tenant') {
          // 1. Fetch profile to get tenant info
          const profile = await apiRequest('/users/tenants/me/').catch(() => ({ name: 'John Smith' }));
          
          // 2. Fetch payments
          const paymentsRes = await apiRequest('/users/payments/').catch(() => []);
          if (Array.isArray(paymentsRes)) {
            const mappedPayments = paymentsRes.map((p: any) => ({
              id: String(p.payment_id),
              tenantName: p.tenant_name || profile.name || 'Resident',
              feeType: p.fee_type || 'Rent',
              amount: parseFloat(p.amount) || 0,
              date: p.payment_date || p.created_at?.split('T')[0] || '',
              status: (p.status === 'Paid' ? 'Paid' : 'Pending') as 'Paid' | 'Pending',
            }));
            setPayments(mappedPayments);
          }

          // 3. Fetch maintenance
          const requestsRes = await apiRequest('/users/tenants/maintenance/').catch(() => []);
          if (Array.isArray(requestsRes)) {
            const mappedRequests = requestsRes.map((r: any) => ({
              id: String(r.request_id),
              tenantName: r.tenant_name || profile.name || 'Resident',
              unit: `${r.building_name || 'Building'}, ${r.unit_code || 'Unit'}`,
              title: r.issue_title || 'Maintenance Request',
              description: r.description || '',
              category: 'Plumbing' as 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other',
              priority: 'Medium' as 'High' | 'Medium' | 'Low',
              status: r.status as any,
              date: r.created_at?.split('T')[0] || '',
            }));
            setRequests(mappedRequests);
          }

          // 4. Fetch visitor logs
          const visitorsRes = await apiRequest('/users/security/visitors/').catch(() => []);
          const visitorsList = Array.isArray(visitorsRes) ? visitorsRes : visitorsRes.results || [];
          if (Array.isArray(visitorsList)) {
            const mappedVisitors = visitorsList.map((v: any) => ({
              id: String(v.request_id),
              visitor_name: v.visitor_name,
              visitor_phone: v.visitor_phone || '',
              purpose: v.purpose || '',
              unit: v.unit || '',
              tenant_name: v.tenant_name_display || v.tenant_name || '',
              tenant_id: String(v.tenant || ''),
              status: v.status as any,
              created_at: v.created_at || new Date().toISOString(),
              security_staff: v.security_staff ? String(v.security_staff) : 'Gate Guard',
            }));
            setVisitors(mappedVisitors);
          }
        } 
        else if (screenState === 'security') {
          // 1. Fetch tenants for selection list
          const tenantsRes = await apiRequest('/users/tenants/').catch(() => []);
          if (Array.isArray(tenantsRes)) {
            const mappedTenants = tenantsRes.map((t: any, idx: number) => ({
              id: String(t.tenant_id),
              serialNumber: idx + 1,
              name: t.name || 'Unknown',
              unit: t.unit ? `Unit ${t.unit}` : 'N/A',
              buildingId: String(t.building),
              buildingName: 'Sunset Apartments',
              phone: t.phone_number || '',
              email: t.email || '',
              rentAmount: parseFloat(t.rent_amount) || 0,
              rentStatus: (t.rent_status === 'Paid' ? 'Paid' : 'Unpaid') as 'Paid' | 'Unpaid',
              dueAmount: parseFloat(t.due_amount) || 0,
              moveInDate: t.lease_start_date || 'N/A',
              complainRate: 100,
            }));
            setTenants(mappedTenants);
          }

          // 2. Fetch visitor logs
          const visitorsRes = await apiRequest('/users/security/visitors/').catch(() => []);
          const visitorsList = Array.isArray(visitorsRes) ? visitorsRes : visitorsRes.results || [];
          if (Array.isArray(visitorsList)) {
            const mappedVisitors = visitorsList.map((v: any) => ({
              id: String(v.request_id),
              visitor_name: v.visitor_name,
              visitor_phone: v.visitor_phone || '',
              purpose: v.purpose || '',
              unit: v.unit || '',
              tenant_name: v.tenant_name_display || v.tenant_name || '',
              tenant_id: String(v.tenant || ''),
              status: v.status as any,
              created_at: v.created_at || new Date().toISOString(),
              security_staff: v.security_staff ? String(v.security_staff) : 'Gate Guard',
            }));
            setVisitors(mappedVisitors);
          }
        }
      } catch (err) {
        console.warn(`[Mobile App] Failed loading live backend, using offline mocks:`, err);
      }
    };

    loadBackendData();
  }, [screenState]);

  // Global Handlers
  const handleLogout = () => {
    setScreenState('landing');
    setOnDutyGuard(null);
  };

  // 1. Admin Handler: Add Building
  const handleAddBuilding = async (name: string, type: 'Residential' | 'Commercial', units: number, address: string) => {
    const newBldMock: BuildingType = {
      id: `b${buildings.length + 1}`,
      serialNumber: buildings.length + 1,
      name,
      type,
      totalUnits: units,
      occupiedUnits: 0,
      rentPaid: 0,
      rentDue: 0,
      address,
    };

    try {
      const floorsCount = Math.ceil(units / 4) || 1;
      const floorsData = [];
      let unitCount = 0;
      for (let f = 1; f <= floorsCount; f++) {
        const floorUnits = [];
        for (let u = 1; u <= 4 && unitCount < units; u++) {
          unitCount++;
          const unitNumber = `${f}0${u}`;
          const unitType = u === 1 ? '1 RK' : u === 2 ? '1 BHK' : u === 3 ? '2 BHK' : '3 BHK';
          floorUnits.push({
            unit_number: unitNumber,
            unit_type: unitType
          });
        }
        floorsData.push({
          floor_number: f,
          units: floorUnits
        });
      }

      const payload = {
        name,
        building_type: type,
        total_floors: floorsCount,
        price_1rk: 1200,
        price_1bhk: 1500,
        price_2bhk: 2000,
        price_3bhk: 2500,
        floors_data: floorsData
      };

      const res = await apiRequest('/users/buildings/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res && res.building_id) {
        // Fetch fresh buildings from database
        const buildingsRes = await apiRequest('/users/buildings/');
        if (buildingsRes && buildingsRes.buildings) {
          const mappedBuildings = buildingsRes.buildings.map((b: any, idx: number) => ({
            id: String(b.building_id),
            serialNumber: idx + 1,
            name: b.name,
            type: b.building_type as any,
            totalUnits: b.total_units || 0,
            occupiedUnits: b.units ? b.units.filter((u: any) => u.is_occupied).length : 0,
            rentPaid: parseFloat(b.rent_paid) || 0,
            rentDue: parseFloat(b.rent_due) || 0,
            address: b.area_name ? `${b.area_name}, ${b.city || ''}` : 'Local Address',
            units: b.units || [],
          }));
          setBuildings(mappedBuildings);
          return;
        }
      }
    } catch (err) {
      console.warn('[Mobile App] Failed to post building to backend, fallback to memory', err);
    }

    setBuildings([...buildings, newBldMock]);
  };

  // 2. Admin Handler: Toggle ticket state
  const handleToggleRequestStatus = async (id: string, currentStatus: 'Pending' | 'In Progress' | 'Resolved') => {
    let nextStatus: 'Pending' | 'In Progress' | 'Resolved' = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Resolved';

    // Optimistically update local UI state
    setRequests(requests.map(r => r.id === id ? { ...r, status: nextStatus } : r));

    try {
      await apiRequest(`/users/owners/maintenance/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: nextStatus,
          owner_reply: `Status updated to ${nextStatus} via mobile`
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to update ticket status on backend', err);
    }
  };

  // 3. Tenant Handler: Pay Rent
  const handlePayRent = async () => {
    // Find first unpaid tenant (or default to t2)
    const targetTenant = tenants.find(t => t.rentStatus === 'Unpaid') || tenants.find(t => t.id === 't2');
    if (!targetTenant) return;

    const paymentAmount = targetTenant.rentAmount || 1200;

    // Optimistically update state
    const newPaymentMock: PaymentType = {
      id: `h${payments.length + 1}`,
      tenantName: targetTenant.name,
      feeType: 'Rent',
      amount: paymentAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
    };
    setPayments([newPaymentMock, ...payments]);
    setTenants(tenants.map(t => t.id === targetTenant.id ? { ...t, rentStatus: 'Paid', dueAmount: 0 } : t));
    setBuildings(buildings.map(b => b.id === targetTenant.buildingId ? { ...b, rentPaid: b.rentPaid + paymentAmount, rentDue: Math.max(0, b.rentDue - paymentAmount) } : b));

    try {
      await apiRequest('/users/payments/submit/', {
        method: 'POST',
        body: JSON.stringify({
          fee_type: 'Rent',
          amount: paymentAmount,
          rent_month: new Date().toLocaleString('en-US', { month: 'long' }),
          rent_year: new Date().getFullYear(),
          payment_method: 'Online',
          transaction_id: 'TXN' + Date.now()
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to submit payment', err);
    }
  };

  // 4. Tenant Handler: Submit Repair Ticket
  const handleAddRequest = async (
    title: string,
    desc: string,
    category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other',
    priority: 'High' | 'Medium' | 'Low'
  ) => {
    const newReqMock: RequestType = {
      id: `r${requests.length + 1}`,
      tenantName: 'John Smith',
      unit: 'Sunset Apartments, Apt 202',
      title,
      description: desc,
      category,
      priority,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    setRequests([newReqMock, ...requests]);

    try {
      await apiRequest('/users/tenants/maintenance/', {
        method: 'POST',
        body: JSON.stringify({
          issue_title: title,
          description: desc
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to create maintenance ticket on backend', err);
    }
  };

  // 5. Tenant Handler: Pre-register Visitor Guest
  const handleAddVisitor = async (name: string, phone: string, purpose: string, expectedTime: string) => {
    const newVisMock: VisitorType = {
      id: `v${visitors.length + 1}`,
      visitor_name: name,
      visitor_phone: phone,
      purpose,
      unit: 'Apt 202',
      tenant_name: 'John Smith',
      tenant_id: 't2',
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      security_staff: 'Pre-Approved by Resident',
    };

    setVisitors([newVisMock, ...visitors]);

    try {
      await apiRequest('/users/security/visitors/', {
        method: 'POST',
        body: JSON.stringify({
          visitor_name: name,
          visitor_phone: phone,
          purpose,
          unit: 'Apt 202',
          status: 'APPROVED'
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to pre-approve guest', err);
    }
  };

  // 6. Security Handler: Dispatch gate entrance request to tenant
  const handleDispatchVisitor = async (
    visitorName: string,
    phone: string,
    purpose: string,
    unit: string,
    tenantName: string,
    tenantId: string
  ) => {
    const newVisMock: VisitorType = {
      id: `v${visitors.length + 1}`,
      visitor_name: visitorName,
      visitor_phone: phone,
      purpose,
      unit,
      tenant_name: tenantName,
      tenant_id: tenantId,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      security_staff: onDutyGuard?.name || 'Gate Guard',
    };

    setVisitors([newVisMock, ...visitors]);

    try {
      await apiRequest('/users/security/visitors/', {
        method: 'POST',
        body: JSON.stringify({
          visitor_name: visitorName,
          visitor_phone: phone,
          purpose,
          unit,
          tenant: parseInt(tenantId) || null,
          status: 'PENDING'
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to dispatch visitor on backend', err);
    }
  };

  // 7. Tenant Handler: Approve/Reject Gate Entrance request
  const handleAuthorizeVisitor = async (id: string, authStatus: 'APPROVED' | 'REJECTED') => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: authStatus } : v));

    try {
      await apiRequest(`/users/security/visitors/${id}/action/`, {
        method: 'POST',
        body: JSON.stringify({ action: authStatus })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to authorize visitor', err);
    }
  };

  // 8. Super Admin Handler: Add Owner Manager
  const handleAddOwner = async (
    name: string,
    email: string,
    totalBuildings: number,
    residentialCount: number,
    commercialCount: number
  ) => {
    const newOwnerMock: OwnerType = {
      id: `o${owners.length + 1}`,
      name,
      email,
      totalBuildings,
      residentialCount,
      commercialCount,
      isActive: true,
    };

    setOwners([...owners, newOwnerMock]);

    try {
      await apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          phone_number: '1234567890',
          area_name: 'Downtown',
          city: 'Los Angeles',
          state: 'CA',
          zip_code: '90001'
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to register owner on backend', err);
    }
  };

  // 9. Admin Handler: Add Tenant
  const handleAddTenant = async (
    name: string,
    email: string,
    phone: string,
    buildingId: string,
    buildingName: string,
    unit: string,
    rentAmount: number
  ) => {
    const newTenantMock: TenantType = {
      id: `t${tenants.length + 1}`,
      serialNumber: tenants.length + 1,
      name,
      unit,
      buildingId,
      buildingName,
      phone,
      email,
      rentAmount,
      rentStatus: 'Unpaid',
      dueAmount: rentAmount,
      moveInDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      complainRate: 100,
    };

    setTenants([...tenants, newTenantMock]);
    setBuildings(buildings.map(b => b.id === buildingId ? { ...b, occupiedUnits: Math.min(b.totalUnits, b.occupiedUnits + 1) } : b));

    try {
      // Lookup unit code
      const building = buildings.find(b => String(b.id) === String(buildingId));
      let unitCode = '';
      if (building && building.units) {
        const foundUnit = building.units.find((u: any) => u.unit_number === unit || u.unit_code?.endsWith(unit));
        if (foundUnit) {
          unitCode = foundUnit.unit_code;
        }
      }

      if (!unitCode) {
        unitCode = `o-1-b-${buildingId}-${unit}`;
      }

      await apiRequest('/auth/register-tenant/', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          phone_number: phone,
          unit_code: unitCode,
          tenant_type: 'Family',
          male_count: 1,
          female_count: 1,
          adult_count: 2,
          children_count: 0,
          dietary_preference: 'Any',
          pet_details: 'None',
          occupancy_type: 'Rent'
        })
      });
    } catch (err) {
      console.warn('[Mobile App] Failed to register tenant', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {screenState === 'landing' && (
        <LandingScreen onNavigateToLogin={() => setScreenState('login')} />
      )}

      {screenState === 'login' && (
        <LoginScreen 
          onLogin={setScreenState} 
          onAbort={() => setScreenState('landing')} 
        />
      )}

      {screenState === 'superadmin' && (
        <SuperAdminScreen
          owners={owners}
          onAddOwner={handleAddOwner}
          onLogout={handleLogout}
        />
      )}

      {screenState === 'admin' && (
        <AdminScreen
          buildings={buildings}
          tenants={tenants}
          payments={payments}
          requests={requests}
          onLogout={handleLogout}
          onAddBuilding={handleAddBuilding}
          onToggleRequestStatus={handleToggleRequestStatus}
          onAddTenant={handleAddTenant}
        />
      )}

      {screenState === 'tenant' && (
        <TenantScreen
          tenants={tenants}
          payments={payments}
          requests={requests}
          visitors={visitors}
          onLogout={handleLogout}
          onPayRent={handlePayRent}
          onAddRequest={handleAddRequest}
          onAddVisitor={handleAddVisitor}
          onAuthorizeVisitor={handleAuthorizeVisitor}
        />
      )}

      {screenState === 'security' && (
        <SecurityScreen
          tenants={tenants}
          visitors={visitors}
          onDutyGuard={onDutyGuard}
          setOnDutyGuard={setOnDutyGuard}
          onDispatchVisitor={handleDispatchVisitor}
          onLogout={handleLogout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
});
