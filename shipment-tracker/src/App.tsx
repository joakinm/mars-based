import { ShipmentProvider, useShipments } from './context/ShipmentContext';
import { Header } from './components/Header';
import { OperationsView } from './components/OperationsView';

function DashboardRouter() {
  const { role } = useShipments();

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      {role === 'OPERATIONS' ? (
        <OperationsView />
      ) : (
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Portal de Seguimiento de Clientes</h2>
          <p className="text-sm text-slate-500">
            Vista activa de autoservicio con ETAs claros y avisos proactivos.
          </p>
        </section>
      )}
    </main>
  );
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