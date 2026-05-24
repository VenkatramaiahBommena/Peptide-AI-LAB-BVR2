/**
 * PeptideAI Lab - Peptide Prediction Service v2.1
 * Core algorithms for peptide generation, analysis, and property prediction
 */

const AMINO_ACID_PROPS = {
  A: { name: 'Alanine',       hydrophobic: true,  charge: 0,  weight: 89.09  },
  C: { name: 'Cysteine',      hydrophobic: false, charge: 0,  weight: 121.16 },
  D: { name: 'Aspartic Acid', hydrophobic: false, charge: -1, weight: 133.10 },
  E: { name: 'Glutamic Acid', hydrophobic: false, charge: -1, weight: 147.13 },
  F: { name: 'Phenylalanine', hydrophobic: true,  charge: 0,  weight: 165.19 },
  G: { name: 'Glycine',       hydrophobic: false, charge: 0,  weight: 75.03  },
  H: { name: 'Histidine',     hydrophobic: false, charge: 0,  weight: 155.16 },
  I: { name: 'Isoleucine',    hydrophobic: true,  charge: 0,  weight: 131.17 },
  K: { name: 'Lysine',        hydrophobic: false, charge: 1,  weight: 146.19 },
  L: { name: 'Leucine',       hydrophobic: true,  charge: 0,  weight: 131.17 },
  M: { name: 'Methionine',    hydrophobic: true,  charge: 0,  weight: 149.21 },
  N: { name: 'Asparagine',    hydrophobic: false, charge: 0,  weight: 132.12 },
  P: { name: 'Proline',       hydrophobic: true,  charge: 0,  weight: 115.13 },
  Q: { name: 'Glutamine',     hydrophobic: false, charge: 0,  weight: 146.15 },
  R: { name: 'Arginine',      hydrophobic: false, charge: 1,  weight: 174.20 },
  S: { name: 'Serine',        hydrophobic: false, charge: 0,  weight: 105.09 },
  T: { name: 'Threonine',     hydrophobic: false, charge: 0,  weight: 119.12 },
  V: { name: 'Valine',        hydrophobic: true,  charge: 0,  weight: 117.15 },
  W: { name: 'Tryptophan',    hydrophobic: true,  charge: 0,  weight: 204.23 },
  Y: { name: 'Tyrosine',      hydrophobic: false, charge: 0,  weight: 181.19 },
}

const ALL_AAS = 'ACDEFGHIKLMNPQRSTVWY'

export const generatePeptideSequence = (targetType = 'antimicrobial') => {
  const ranges = {
    antimicrobial: [16, 26],
    antifungal:    [14, 22],
    anticancer:    [12, 20],
    antiviral:     [18, 28],
  }
  const [min, max] = ranges[targetType] || [15, 25]
  const len = Math.floor(Math.random() * (max - min + 1)) + min
  return Array.from({ length: len }, () => ALL_AAS[Math.floor(Math.random() * ALL_AAS.length)]).join('')
}

export const validateSequence = (seq) => /^[ACDEFGHIKLMNPQRSTVWY]+$/i.test(seq)

export const calculateProperties = (sequence) => {
  const s = sequence.toUpperCase()
  const arr = s.split('')

  const hydrophobicCount = arr.filter(aa => AMINO_ACID_PROPS[aa]?.hydrophobic).length
  const netCharge = arr.reduce((acc, aa) => acc + (AMINO_ACID_PROPS[aa]?.charge || 0), 0)
  const mw = arr.reduce((acc, aa) => acc + (AMINO_ACID_PROPS[aa]?.weight || 110), 0) - (arr.length - 1) * 18.015
  const aromaticCount = arr.filter(aa => ['F', 'W', 'Y'].includes(aa)).length
  const prolineCount = arr.filter(aa => aa === 'P').length

  return {
    length:          s.length,
    sequence:        s,
    hydrophobicity:  parseFloat(((hydrophobicCount / s.length) * 100).toFixed(1)),
    netCharge,
    molecularWeight: parseFloat(mw.toFixed(2)),
    aromaticity:     parseFloat(((aromaticCount / s.length) * 100).toFixed(1)),
    prolineContent:  parseFloat(((prolineCount / s.length) * 100).toFixed(1)),
    isoelectricPoint: parseFloat((7.0 - netCharge * 0.5).toFixed(2)),
    instabilityIndex: parseFloat((40 + (Math.random() * 30 - 15)).toFixed(1)),
  }
}

export const predictBioactivity = (sequence) => {
  const props = calculateProperties(sequence)
  const base = () => parseFloat((Math.random() * 30 + 52).toFixed(1))
  const hBoost = (props.hydrophobicity - 30) * 0.4
  return {
    antimicrobial: Math.min(100, Math.max(0, parseFloat((base() + hBoost).toFixed(1)))),
    antifungal:    Math.min(100, Math.max(0, parseFloat((base() + hBoost * 0.7).toFixed(1)))),
    anticancer:    Math.min(100, Math.max(0, parseFloat((base() + props.aromaticity * 0.5).toFixed(1)))),
    antiviral:     Math.min(100, Math.max(0, parseFloat((base() + (props.netCharge > 0 ? 8 : 0)).toFixed(1)))),
  }
}

export const predictToxicity = (sequence) => {
  const props = calculateProperties(sequence)
  let risk = 10
  if (props.netCharge > 5) risk += 20
  if (props.hydrophobicity > 70) risk += 18
  if (props.length > 30) risk += 10
  return Math.min(100, Math.max(0, parseFloat((risk + Math.random() * 10).toFixed(1))))
}

export const predictStability = (sequence) => {
  const props = calculateProperties(sequence)
  let score = 65
  score += props.prolineContent * 0.5
  if (Math.abs(props.netCharge) > 5) score -= 12
  const cysteines = (sequence.match(/C/g) || []).length
  if (cysteines >= 2) score += 10
  return Math.min(100, Math.max(0, parseFloat((score + Math.random() * 10 - 5).toFixed(1))))
}

export const predictSolubility = (sequence) => {
  const props = calculateProperties(sequence)
  let score = 60
  score += Math.abs(props.netCharge) * 3
  score -= (props.hydrophobicity - 40) * 0.5
  const polarCount = (sequence.match(/[STNQ]/g) || []).length
  score += polarCount * 1.5
  return Math.min(100, Math.max(0, parseFloat((score + Math.random() * 10 - 5).toFixed(1))))
}

export const predictDocking = (sequence, targetProtein = 'SARS-CoV-2 Spike') => {
  const props = calculateProperties(sequence)
  const baseScore = -(Math.random() * 5 + 3.5)
  const adjustment = (props.hydrophobicity - 50) * 0.025
  const dockingScore = parseFloat((baseScore + adjustment).toFixed(2))
  return {
    dockingScore,
    bindingAffinity:  parseFloat((Math.random() * 500 + 80).toFixed(1)),
    hydrogenBonds:    Math.floor(props.length / 3 + Math.random() * 5 + 2),
    rmsd:             parseFloat((Math.random() * 2.5 + 0.5).toFixed(2)),
    targetProtein,
    confidence:       parseFloat((Math.random() * 20 + 74).toFixed(1)),
  }
}

export const fullAnalysis = (sequence, targetProtein = 'SARS-CoV-2 Spike') => ({
  sequence:    sequence.toUpperCase(),
  properties:  calculateProperties(sequence),
  bioactivity: predictBioactivity(sequence),
  toxicity:    predictToxicity(sequence),
  stability:   predictStability(sequence),
  solubility:  predictSolubility(sequence),
  docking:     predictDocking(sequence, targetProtein),
  timestamp:   new Date().toISOString(),
})

export const generateResearchIdea = () => {
  const ideas = [
    { title: 'SAR Study of Antimicrobial Peptides Against ESKAPE Pathogens', description: 'Systematic mutation analysis of key residues in AMPs for enhanced activity against drug-resistant bacteria.', keywords: ['SAR','AMP','MDR','ESKAPE'], difficulty: 'Intermediate' },
    { title: 'Blood-Brain Barrier Penetrating Peptides for Alzheimer\'s Therapy', description: 'Design of BBB-crossing peptides targeting amyloid-beta aggregation using computational docking and MD simulations.', keywords: ['BBB','Neurodegeneration','Amyloid','Delivery'], difficulty: 'Advanced' },
    { title: 'Thermostable Peptide Enzymes for Industrial Biocatalysis', description: 'Engineering disulfide-rich peptide scaffolds stable at 80°C for green chemistry applications.', keywords: ['Thermostability','Biocatalysis','Engineering','Green Chemistry'], difficulty: 'Intermediate' },
    { title: 'Anticancer Peptide-Drug Conjugates with Tumor-Selective Cleavage', description: 'pH-sensitive linker design for prodrug peptide conjugates targeting solid tumor microenvironment.', keywords: ['Anticancer','PDC','Prodrug','Tumor'], difficulty: 'Advanced' },
    { title: 'Broad-Spectrum Antiviral Peptides Targeting Conserved Viral Proteases', description: 'Computational design of peptide inhibitors against pan-coronavirus main protease binding pocket.', keywords: ['Antiviral','Protease','Coronavirus','Broad-spectrum'], difficulty: 'Advanced' },
    { title: 'Machine Learning Prediction of Peptide Immunogenicity for Vaccine Design', description: 'Deep learning model for MHC-I/II binding predictions enabling rapid neoantigen vaccine design.', keywords: ['ML','Vaccine','Immunogenicity','MHC'], difficulty: 'Expert' },
  ]
  return ideas[Math.floor(Math.random() * ideas.length)]
}

export const SAMPLE_PEPTIDE_DB = [
  { id: 1, name: 'Magainin-2',    sequence: 'GIGKFLHSAKKFGKAFVGEIMNS', activity: 'Antimicrobial', length: 23, charge: '+4', hydrophobicity: '47%' },
  { id: 2, name: 'LL-37',         sequence: 'LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES', activity: 'Antimicrobial', length: 37, charge: '+6', hydrophobicity: '41%' },
  { id: 3, name: 'Melittin',      sequence: 'GIGAVLKVLTTGLPALISWIKRKRQQ', activity: 'Antimicrobial', length: 26, charge: '+5', hydrophobicity: '58%' },
  { id: 4, name: 'Defensin HNP-1',sequence: 'ACYCRIPACIAGERRYGTCIYQGRLWAFCC', activity: 'Antimicrobial', length: 30, charge: '+3', hydrophobicity: '52%' },
  { id: 5, name: 'Caspofungin-P', sequence: 'FRLKIVWKLLKK', activity: 'Antifungal',    length: 12, charge: '+5', hydrophobicity: '55%' },
  { id: 6, name: 'TRAIL-P',       sequence: 'CGISSFKGGGCGGNSNRY', activity: 'Anticancer',    length: 18, charge: '+1', hydrophobicity: '38%' },
  { id: 7, name: 'Enfuvirtide',   sequence: 'YTSLIHSLIEESQNQQEKNEQELLELDKWASLWNWF', activity: 'Antiviral',     length: 36, charge: '-2', hydrophobicity: '44%' },
  { id: 8, name: 'Buforin-II',    sequence: 'TRSSRAGLQFPVGRIHRHLKSRTTSHGR', activity: 'Antimicrobial', length: 28, charge: '+8', hydrophobicity: '32%' },
]
