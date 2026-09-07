import { useCart } from '../context/CartContext';
import { IconClose, IconMapPin } from './Icons';

const tables = [
  { id: 1, seats: 2, occupied: false },
  { id: 2, seats: 2, occupied: true },
  { id: 3, seats: 4, occupied: false },
  { id: 4, seats: 4, occupied: false },
  { id: 5, seats: 2, occupied: true },
  { id: 6, seats: 6, occupied: false },
  { id: 7, seats: 4, occupied: false },
  { id: 8, seats: 2, occupied: false },
  { id: 9, seats: 6, occupied: true },
  { id: 10, seats: 4, occupied: false },
  { id: 11, seats: 8, occupied: false },
  { id: 12, seats: 2, occupied: false },
];

const TableSelector = () => {
  const {
    isTableSelectorOpen, setIsTableSelectorOpen,
    selectedTable, setSelectedTable,
    placeOrder, cart, grandTotal,
  } = useCart();

  if (!isTableSelectorOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setIsTableSelectorOpen(false)} />
      <div className="modal">
        <div style={{ padding: '1.75rem 2rem 1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Select Your Table</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', marginBottom: 0 }}>
              Choose a table to place your order — greyed out tables are occupied.
            </p>
          </div>
          <button onClick={() => setIsTableSelectorOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <IconClose s={22} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', padding: '1rem 2rem 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }} />
            Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-accent)' }} />
            Selected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', opacity: 0.3 }} />
            Occupied
          </div>
        </div>

        <div className="table-grid">
          {tables.map(table => (
            <div
              key={table.id}
              className={`table-seat ${table.occupied ? 'occupied' : ''} ${selectedTable === table.id ? 'selected' : ''}`}
              onClick={() => !table.occupied && setSelectedTable(table.id)}
            >
              <span style={{ display: 'flex', justifyContent: 'center', color: selectedTable === table.id ? '#111' : 'var(--color-accent)' }}>
                <IconMapPin s={table.seats <= 2 ? 18 : 22} />
              </span>
              <span style={{ fontWeight: '700', fontSize: '1rem' }}>T{table.id}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{table.seats} seats</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>Order Total: </span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <button className="btn btn-primary" disabled={!selectedTable || cart.length === 0} onClick={placeOrder}
            style={{ opacity: (!selectedTable || cart.length === 0) ? 0.4 : 1, cursor: (!selectedTable || cart.length === 0) ? 'not-allowed' : 'pointer' }}
          >
            Place Order at Table {selectedTable || '...'}
          </button>
        </div>
      </div>
    </>
  );
};

export default TableSelector;
