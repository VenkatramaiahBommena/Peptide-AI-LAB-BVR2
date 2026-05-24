/**
 * PeptideAI Lab – File & Report Generation Service
 * Generates downloadable reports in TXT, CSV, and JSON formats
 */

const rid = () => 'PA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()

/* ─── Text Report ────────────────────────────────────────────── */
export const generateTextReport = (data) => `
╔══════════════════════════════════════════════════════════════════╗
║            PEPTIDEAI LAB  –  ANALYSIS REPORT v2.1               ║
╚══════════════════════════════════════════════════════════════════╝
Report ID : ${rid()}
Generated : ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] PEPTIDE SEQUENCE
─────────────────────────────────────────────────────────────────
Sequence         : ${data.sequence}
Length           : ${data.properties?.length ?? 'N/A'} amino acids
Molecular Weight : ${data.properties?.molecularWeight ?? 'N/A'} Da
Net Charge       : ${data.properties?.netCharge ?? 'N/A'}
Isoelectric Pt   : ${data.properties?.isoelectricPoint ?? 'N/A'}

[2] PHYSICOCHEMICAL PROPERTIES
─────────────────────────────────────────────────────────────────
Hydrophobicity   : ${data.properties?.hydrophobicity ?? 'N/A'} %
Aromaticity      : ${data.properties?.aromaticity ?? 'N/A'} %
Proline Content  : ${data.properties?.prolineContent ?? 'N/A'} %
Instability Idx  : ${data.properties?.instabilityIndex ?? 'N/A'}

[3] BIOACTIVITY PREDICTION
─────────────────────────────────────────────────────────────────
Antimicrobial    : ${data.bioactivity?.antimicrobial ?? 'N/A'} %
Antifungal       : ${data.bioactivity?.antifungal ?? 'N/A'} %
Anticancer       : ${data.bioactivity?.anticancer ?? 'N/A'} %
Antiviral        : ${data.bioactivity?.antiviral ?? 'N/A'} %

[4] SAFETY ASSESSMENT
─────────────────────────────────────────────────────────────────
Toxicity Risk    : ${data.toxicity ?? 'N/A'} %  (${classifyTox(data.toxicity)})
Stability Score  : ${data.stability ?? 'N/A'} %
Solubility Score : ${data.solubility ?? 'N/A'} %

[5] MOLECULAR DOCKING
─────────────────────────────────────────────────────────────────
Target Protein   : ${data.docking?.targetProtein ?? 'N/A'}
Docking Score    : ${data.docking?.dockingScore ?? 'N/A'} kcal/mol
Binding Affinity : ${data.docking?.bindingAffinity ?? 'N/A'} nM  (Kd)
Hydrogen Bonds   : ${data.docking?.hydrogenBonds ?? 'N/A'}
RMSD             : ${data.docking?.rmsd ?? 'N/A'} Å
Confidence       : ${data.docking?.confidence ?? 'N/A'} %

[6] RECOMMENDATIONS
─────────────────────────────────────────────────────────────────
${buildRecommendations(data)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCLAIMER: All predictions are in-silico estimates and require
experimental validation before any biomedical application.
PeptideAI Lab  •  www.peptideailab.io
`.trim()

/* ─── CSV Report ─────────────────────────────────────────────── */
export const generateCSVReport = (data) => {
  const rows = [
    ['Category', 'Property', 'Value', 'Unit'],
    ['Sequence', 'Sequence', data.sequence, ''],
    ['Sequence', 'Length', data.properties?.length, 'aa'],
    ['Sequence', 'Molecular Weight', data.properties?.molecularWeight, 'Da'],
    ['Sequence', 'Net Charge', data.properties?.netCharge, ''],
    ['Sequence', 'Isoelectric Point', data.properties?.isoelectricPoint, 'pH'],
    ['Properties', 'Hydrophobicity', data.properties?.hydrophobicity, '%'],
    ['Properties', 'Aromaticity', data.properties?.aromaticity, '%'],
    ['Properties', 'Proline Content', data.properties?.prolineContent, '%'],
    ['Properties', 'Instability Index', data.properties?.instabilityIndex, ''],
    ['Bioactivity', 'Antimicrobial', data.bioactivity?.antimicrobial, '%'],
    ['Bioactivity', 'Antifungal', data.bioactivity?.antifungal, '%'],
    ['Bioactivity', 'Anticancer', data.bioactivity?.anticancer, '%'],
    ['Bioactivity', 'Antiviral', data.bioactivity?.antiviral, '%'],
    ['Safety', 'Toxicity Risk', data.toxicity, '%'],
    ['Safety', 'Stability Score', data.stability, '%'],
    ['Safety', 'Solubility Score', data.solubility, '%'],
    ['Docking', 'Target Protein', data.docking?.targetProtein, ''],
    ['Docking', 'Docking Score', data.docking?.dockingScore, 'kcal/mol'],
    ['Docking', 'Binding Affinity', data.docking?.bindingAffinity, 'nM'],
    ['Docking', 'Hydrogen Bonds', data.docking?.hydrogenBonds, ''],
    ['Docking', 'RMSD', data.docking?.rmsd, 'Å'],
    ['Docking', 'Confidence', data.docking?.confidence, '%'],
  ]
  return rows.map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')
}

/* ─── JSON Report ────────────────────────────────────────────── */
export const generateJSONReport = (data) =>
  JSON.stringify({
    metadata: {
      report_id: rid(),
      generated_at: new Date().toISOString(),
      platform: 'PeptideAI Lab v2.1',
      analysis_type: 'comprehensive_peptide_analysis',
    },
    sequence: {
      sequence: data.sequence,
      length: data.properties?.length,
      molecular_weight: data.properties?.molecularWeight,
      net_charge: data.properties?.netCharge,
      isoelectric_point: data.properties?.isoelectricPoint,
    },
    physicochemical_properties: {
      hydrophobicity: data.properties?.hydrophobicity,
      aromaticity: data.properties?.aromaticity,
      proline_content: data.properties?.prolineContent,
      instability_index: data.properties?.instabilityIndex,
    },
    bioactivity: data.bioactivity,
    safety: {
      toxicity_risk: data.toxicity,
      stability_score: data.stability,
      solubility_score: data.solubility,
    },
    molecular_docking: data.docking,
    recommendations: buildRecommendations(data),
  }, null, 2)

/* ─── FASTA Export ───────────────────────────────────────────── */
export const generateFASTA = (data) => {
  const am = data.bioactivity?.antimicrobial ?? '?'
  const tox = data.toxicity ?? '?'
  const header = `>PeptideAI|${data.sequence.length}aa|AM=${am}%|Tox=${tox}%|${new Date().toISOString().split('T')[0]}`
  const seq = (data.sequence.match(/.{1,60}/g) || []).join('\n')
  return `${header}\n${seq}`
}

/* ─── Download Helper ────────────────────────────────────────── */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename, style: 'display:none' })
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 200)
}

/* ─── Download All Formats ───────────────────────────────────── */
export const downloadAllReports = (data) => {
  const ts = Date.now()
  downloadFile(generateTextReport(data), `PeptideAI_${ts}.txt`,  'text/plain')
  setTimeout(() => downloadFile(generateCSVReport(data),  `PeptideAI_${ts}.csv`,  'text/csv'), 300)
  setTimeout(() => downloadFile(generateJSONReport(data), `PeptideAI_${ts}.json`, 'application/json'), 600)
}

/* ─── Helpers ────────────────────────────────────────────────── */
function classifyTox(t) {
  if (!t && t !== 0) return 'Unknown'
  if (t < 15) return 'Very Low Risk'
  if (t < 30) return 'Low Risk'
  if (t < 50) return 'Moderate Risk'
  if (t < 70) return 'High Risk'
  return 'Very High Risk'
}

function buildRecommendations(data) {
  const lines = []
  const maxBA  = data.bioactivity ? Math.max(...Object.values(data.bioactivity)) : 0
  if (maxBA >= 75) lines.push('✓ Excellent bioactivity – Proceed to synthesis & in-vitro testing')
  else if (maxBA >= 55) lines.push('• Moderate bioactivity – Consider N/C-terminal modifications')
  else lines.push('⚠ Low bioactivity – Sequence redesign recommended')
  if ((data.toxicity ?? 0) > 50) lines.push('⚠ High toxicity detected – Review charge and hydrophobicity')
  if ((data.stability ?? 100) < 50) lines.push('⚠ Low stability – Add proline residues or disulfide bonds')
  if ((data.solubility ?? 100) < 50) lines.push('• Poor solubility – Introduce charged/polar residues')
  if (Math.abs(data.docking?.dockingScore ?? -5) > 7) lines.push('✓ Strong docking score – High binding affinity predicted')
  return lines.join('\n')
}
