import React from 'react';
import * as XLSX from 'xlsx';
import { ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { PROJECT_FEATURES } from '../data/featuresData';

const COLUMNS = [
  { key: 'id', label: '#', width: 50 },
  { key: 'module', label: 'Module', width: 170 },
  { key: 'feature', label: 'Feature', width: 260 },
  { key: 'description', label: 'Description', width: 420 },
  { key: 'status', label: 'Status', width: 110 },
];

function statusColor(status) {
  if (status === 'Done') return { bg: '#dcfce7', color: '#15803d' };
  if (status === 'In Progress') return { bg: '#fef9c3', color: '#a16207' };
  return { bg: '#e2e8f0', color: '#475569' };
}

function handleDownload() {
  const rows = PROJECT_FEATURES.map((f) => ({
    '#': f.id,
    Module: f.module,
    Feature: f.feature,
    Description: f.description,
    Status: f.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 4 }, { wch: 24 }, { wch: 34 }, { wch: 60 }, { wch: 14 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Features');
  XLSX.writeFile(workbook, 'SIH-2026-project-features.xlsx');
}

export default function FeaturesSheet({ onBack }) {
  return (
    <div style={{ padding: '20px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, margin: 0, color: '#0f172a' }}>
            <FileSpreadsheet size={22} color="#15803d" />
            Project Feature Sheet
          </h1>
        </div>

        <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#15803d', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Download size={14} />
          Download as Excel (.xlsx)
        </button>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} style={{ textAlign: 'left', background: '#0f172a', color: '#fff', padding: '10px 12px', minWidth: col.width, borderRight: '1px solid #1e293b', position: 'sticky', top: 0 }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROJECT_FEATURES.map((row, i) => {
              const sc = statusColor(row.status);
              return (
                <tr key={row.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={cellStyle}>{row.id}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#0f172a' }}>{row.module}</td>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.feature}</td>
                  <td style={{ ...cellStyle, color: '#475569' }}>{row.description}</td>
                  <td style={cellStyle}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: '9px 12px',
  borderRight: '1px solid #f1f5f9',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'top',
};