'use client';

import { useState, useEffect } from 'react';
import { getBrokerInfo } from '@/lib/brokers';

interface SummaryRecord {
  emiten: string;
  sector?: string;
  tradingDays: number;
  hitR1: number;
  hitMax: number;
  hitRateR1: number;
  hitRateMax: number;
  totalHitRate: number;
  topBandars: { name: string; count: number }[];
}

const ROW_COUNT_OPTIONS = [3, 5, 10, 20, 50];
const HEADER_HEIGHT = 45;
const ROW_HEIGHT = 65;

export default function EmitenSummaryCard() {
  const [data, setData] = useState<SummaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchSummary();
  }, [limit]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/summary?limit=${limit}`);
      const json = await response.json();
      if (json.success) {
        setData(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching summary stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const renderBandarCell = (bandarObj?: { name: string; count: number }) => {
    if (!bandarObj) return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>;
    const info = getBrokerInfo(bandarObj.name);
    const typeLabel = info.type === 'Smartmoney' ? 'Smart Money' : info.type;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{bandarObj.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>({bandarObj.count})</span>
        </div>
        <div style={{ 
          fontSize: '0.65rem', 
          color: 'var(--text-secondary)',
          background: 'var(--border-color)',
          padding: '1px 4px',
          borderRadius: '3px',
          whiteSpace: 'nowrap'
        }}>
          {typeLabel}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat ringkasan performa...</p>
      </div>
    );
  }

  return (
    <div className="glass-card-static" style={{ marginBottom: '1rem' }}>
      <div className="broker-flow-header">
        <span className="broker-flow-title">🎯 Emiten Hit Target Rate ({limit} Hari Terakhir)</span>
        <div className="broker-flow-filters">
          {ROW_COUNT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setLimit(option)}
              className={`broker-flow-filter-btn ${limit === option ? 'active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-card)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)', height: `${HEADER_HEIGHT}px`, borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '0 1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Emiten</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Days</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hit R1</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hit Max</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>R1 Rate</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Max Rate</th>
                <th style={{ padding: '0 1rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Rate</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, borderLeft: '1px solid var(--border-color)' }}>Top 1</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Top 2</th>
                <th style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Top 3</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={record.emiten}
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    borderBottom: index < data.length - 1 ? '1px solid var(--border-color)' : 'none',
                    background: index % 2 === 0 ? 'transparent' : 'var(--glass-inner-glow)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '0 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{record.emiten}</div>
                    {record.sector && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{record.sector}</div>
                    )}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {record.tradingDays}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-success)' }}>
                    {record.hitR1}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-warning)' }}>
                    {record.hitMax}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-success)' }}>
                    {formatPercent(record.hitRateR1)}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-warning)' }}>
                    {formatPercent(record.hitRateMax)}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: record.totalHitRate >= 80 ? 'var(--accent-success)' : record.totalHitRate >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                    }}>
                      {formatPercent(record.totalHitRate)}
                    </div>
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                    {renderBandarCell(record.topBandars[0])}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center' }}>
                    {renderBandarCell(record.topBandars[1])}
                  </td>
                  <td style={{ padding: '0 1rem', textAlign: 'center' }}>
                    {renderBandarCell(record.topBandars[2])}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Tidak ada data performa untuk periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
