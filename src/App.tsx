import { ShipmentProvider, useShipments } from './context/ShipmentContext';
import { Header } from './components/Header';
import { OperationsView } from './components/OperationsView';
import { CustomerView } from './components/CustomerView';

function DashboardRouter() {
  const { role } = useShipments();
  return <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{role === 'OPERATIONS' ? <OperationsView /> : <CustomerView />}</main>;
}

export default function App() {
  return (
    <ShipmentProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Header />
        <DashboardRouter />
      </div>
    </ShipmentProvider>
  );
}