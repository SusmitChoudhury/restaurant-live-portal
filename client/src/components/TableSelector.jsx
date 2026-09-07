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
      <div className="modal" style={{ maxHeight: '90dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem clamp(1rem, 4vw, 2rem) 0.85rem', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Select Your Table</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: 0 }}>
              Tap your table number below to confirm dining seat.
            </p>
          </div>
          <button
            onClick={() => setIsTableSelectorOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="Close table selector"
          >
            <IconClose s={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', padding: '0.75rem 1rem 0', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
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

        <div className="table-grid" style={{ overflowY: 'auto', flexGrow: 1 }}>
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

        <div style={{
          padding: '1rem clamp(1rem, 4vw, 2rem)',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))'
        }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Order Total: </span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '700' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            className="btn btn-primary"
            disabled={!selectedTable || cart.length === 0}
            onClick={placeOrder}
            style={{
              opacity: (!selectedTable || cart.length === 0) ? 0.4 : 1,
              cursor: (!selectedTable || cart.length === 0) ? 'not-allowed' : 'pointer',
              flexGrow: 1,
              justifyContent: 'center',
              padding: '0.8rem 1.25rem',
              fontSize: '0.85rem'
            }}
          >
            Place Order at Table {selectedTable ? `T${selectedTable}` : '...'}
          </button>
        </div>
      </div>
    </>
  );
};

export default TableSelector;
