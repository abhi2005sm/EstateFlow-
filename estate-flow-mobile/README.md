# EstateFlow Mobile App

A high-fidelity Expo (React Native) mobile application that serves as the companion app to the **EstateFlow** web application. 

It replicates the theme, styles, and core operations of the main web dashboard, optimized specifically for a premium, mobile-first resident and administrator experience.

---

## 🌟 Key Features

### 🔐 1. Unified Access Portal (Login)
- Clean, dark-mode landing screen featuring glassmorphism elements.
- Immediate role selection options: **Super Admin/Manager** or **Resident/Tenant** to allow easy previewing.

---

### 🛡️ 2. Super Admin & Property Manager Panel
Designed for executive portfolio command on the go:
- **Overview Dashboard**: High-level statistical cards showing active buildings count, total units, overall occupancy rate, and month-to-date collection. Includes a visual collection progress bar.
- **Buildings & Properties**: Complete searchable list of assets. Supports adding a new building with input for properties, units, and address.
- **Tenant Management**: Interactive catalog of residents with direct contact shortcuts (Quick Call / Email reminder) and real-time payment status filtering (All, Paid, Unpaid).
- **Collections Ledger**: Live summary of portfolio financial inflow and complete list of transactions.
- **Maintenance Desk**: Priority-coded support ticket dashboard. Managers can tap and progress tickets through workflow stages (`Pending` ➔ `In Progress` ➔ `Resolved`).

---

### 🏠 3. Resident / Tenant Hub
A modern concierge interface for tenants (demo logged in as *John Smith*):
- **Rent Center**: Clear widget highlighting due balance, due date, and a functional "Pay Rent Instantly" flow.
- **Visitor Pre-Approval**: Allow residents to pre-register guests, generating instant clearances that update in the security ledger.
- **Repair Tickets**: Log plumbing, HVAC, electrical, or appliance issues with detail, priority flags, and live status monitoring.
- **Tenant Settings**: View profile information, notification configuration, lease details, and secure log out.

---

## 🛠️ Technology Stack & Structure

- **Core**: React Native, Expo (SDK 56), TypeScript
- **Styling**: Structured Design Tokens (`src/styles/theme.ts`) with deep dark AMOLED `#0D0D0D` color palettes matching the website.
- **Icons**: Vector Icons via `lucide-react-native`
- **Navigation**: Clean, high-performance tab-based UI state switcher directly integrated for instant responsiveness.

---

## 🚀 How to Run the App

1. Make sure you have Node.js and npm installed.
2. Open your terminal and navigate to the mobile folder:
   ```bash
   cd estate-flow-mobile
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Expo server:
   ```bash
   npm run start
   ```
5. Choose how to view/test:
   - Press **`a`** to launch on an Android emulator (requires Android Studio).
   - Press **`i`** to launch on an iOS simulator (requires macOS & Xcode).
   - Press **`w`** to view the app directly in your web browser.
   - Scan the QR code using the **Expo Go** app on your iOS or Android mobile device.
