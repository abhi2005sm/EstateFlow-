import { PaymentRequest } from '../../admin/payments/types';

interface DashboardCardsProps {
  payments?: PaymentRequest[];
  profile?: any;
}

export default function DashboardCards({ payments = [], profile }: DashboardCardsProps) {
  const totalRent = profile?.rent_amount !== undefined 
    ? Number(profile.rent_amount) 
    : payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const paidAmount = payments.filter(p => p.status === 'Paid' || p.approval_status === 'Approved').reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  
  const dueAmount = profile?.due_amount !== undefined 
    ? Number(profile.due_amount) 
    : payments.reduce((acc, p) => acc + (Number(p.due_amount) || 0), 0);
  
  // Find next due date: get earliest due_date that is in the future
  const upcomingPayments = payments.filter(p => p.status !== 'Paid' && p.approval_status !== 'Approved' && p.due_date);
  upcomingPayments.sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  const nextDueDate = upcomingPayments.length > 0 ? new Date(upcomingPayments[0].due_date!).toLocaleDateString() : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card title="Total Rent" value={`₹${totalRent.toLocaleString('en-IN')}`} />
      <Card title="Paid Amount" value={`₹${paidAmount.toLocaleString('en-IN')}`} color="text-emerald-600" />
      <Card title="Due Amount" value={`₹${dueAmount.toLocaleString('en-IN')}`} color={dueAmount > 0 ? "text-red-600" : "text-gray-900"} />
      <Card title="Next Due Date" value={nextDueDate} color="text-[#F26922]" />
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);