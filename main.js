/* ============================================================
BORING OSCARS — main.js
Charts, interactions, animations
============================================================ */

‘use strict’;

// ─── GLOBAL CHART DEFAULTS ───────────────────────────────────
Chart.defaults.font.family = “‘DM Mono’, monospace”;
Chart.defaults.font.size = 11;
Chart.defaults.color = ‘#6b6055’;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.animation.duration = 800;
Chart.defaults.animation.easing = ‘easeOutQuart’;

const C = {
red:      ‘#c0392b’,
redL:     ‘#e74c3c’,
redPale:  ‘rgba(192,57,43,0.12)’,
teal:     ‘#1a7f8e’,
tealL:    ‘rgba(26,127,142,0.12)’,
gold:     ‘#b8860b’,
goldL:    ‘rgba(184,134,11,0.15)’,
ink:      ‘#0e0e0e’,
cream:    ‘#f5f0e8’,
muted:    ‘#6b6055’,
border:   ‘#d4cdc2’,
preColor: ‘rgba(192,57,43,0.8)’,
postColor:‘rgba(26,127,142,0.85)’,
};

// ─── COUNTER ANIMATION ───────────────────────────────────────
function animateCounter(el, target, duration = 1600) {
const start = performance.now();
const update = (now) => {
const progress = Math.min((now - start) / duration, 1);
const ease = 1 - Math.pow(1 - progress, 4);
el.textContent = Math.round(ease * target);
if (progress < 1) requestAnimationFrame(update);
};
requestAnimationFrame(update);
}

// ─── NAV SCROLL ──────────────────────────────────────────────
const nav = document.getElementById(‘nav’);
window.addEventListener(‘scroll’, () => {
nav.classList.toggle(‘scrolled’, window.scrollY > 60);
});

document.getElementById(‘navToggle’).addEventListener(‘click’, () => {
document.querySelector(’.nav-links’).classList.toggle(‘open’);
});

// ─── INTERSECTION OBSERVER ───────────────────────────────────
const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add(‘visible’);
// Trigger stat counters when hero is visible
if (entry.target.classList.contains(‘hero-stats’)) {
entry.target.querySelectorAll(’.stat-card[data-target]’).forEach(card => {
const el = card.querySelector(’.count’);
if (el) animateCounter(el, parseInt(card.dataset.target));
});
}
}
});
}, { threshold: 0.15 });

// Observe fade-in elements
document.querySelectorAll(’.section-label, .section-title, .section-desc, .chart-card, .method-card, .author-card, .abstract-grid, .table-wrapper’).forEach(el => {
el.classList.add(‘fade-in’);
io.observe(el);
});

// Observe hero stats
const heroStats = document.querySelector(’.hero-stats’);
if (heroStats) io.observe(heroStats);

// ─── COPY CITATION ───────────────────────────────────────────
document.getElementById(‘copyBtn’).addEventListener(‘click’, function() {
const text = ‘Amell F, Sikora R, Beaudry JR, et al. Better opioid responsibility: implementing novel guidance as an opioid standard of care in academic and rural settings. Reg Anesth Pain Med 2026;0:1–3. doi:10.1136/rapm-2025-106699’;
navigator.clipboard.writeText(text).then(() => {
this.textContent = ‘✓ Copied!’;
this.classList.add(‘copied’);
setTimeout(() => { this.textContent = ‘Copy Citation’; this.classList.remove(‘copied’); }, 2500);
});
});

// ─── AUTHORS DATA ─────────────────────────────────────────────
const AUTHORS = [
{ name: ‘Fredrik Amell’, degree: ‘MD’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Robbie Sikora’, degree: ‘MD’, affil: ‘In His Image Family Medicine Residency, Tulsa, OK’ },
{ name: ‘Jesse R. Beaudry’, degree: ‘PharmD’, affil: ‘Alice Peck Day Memorial Hospital’ },
{ name: ‘Peter Lang’, degree: ‘BS’, affil: ‘Analytics Institute, DHMC’ },
{ name: ‘Jose Mercado’, degree: ‘MD’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Sarah Johnston’, degree: ‘MSN’, affil: ‘Internal Medicine, Alice Peck Day’ },
{ name: ‘Shane Greene’, degree: ‘MD’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Carson Wenz’, degree: ‘PharmD’, affil: ‘Internal Medicine, Alice Peck Day’ },
{ name: ‘Marshall Ward’, degree: ‘MD’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Pablo Martinez Camblor’, degree: ‘PhD’, affil: ‘Biostatistics, DHMC’ },
{ name: ‘Brian D. Sites’, degree: ‘MD’, affil: ‘Anesthesiology & Orthopaedics, Dartmouth’ },
{ name: ‘Milan Radovanovic’, degree: ‘MD’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Charles Brackett’, degree: ‘MD’, affil: ‘GIM, DHMC’ },
{ name: ‘Sage Gale’, degree: ‘DO’, affil: ‘Hospital Medicine, DHMC’ },
{ name: ‘Adam Ackerman’, degree: ‘MD’, affil: ‘Yale New Haven Health’ },
];

const authGrid = document.getElementById(‘authorsGrid’);
AUTHORS.forEach((a, i) => {
const card = document.createElement(‘div’);
card.className = ‘author-card fade-in’;
card.style.transitionDelay = `${i * 40}ms`;
card.innerHTML = `<div class="author-name">${a.name}</div><div class="author-degree">${a.degree}</div><div class="author-affil">${a.affil}</div>`;
authGrid.appendChild(card);
io.observe(card);
});

// ─── LAZY TIMESERIES LOADER ───────────────────────────────────
const TS_FILE = {
MHMH:     ‘data-ts-mhmh.js’,
APDH:     ‘data-ts-apdh.js’,
Combined: ‘data-ts-combined.js’,
};

function loadTS(site) {
return new Promise((resolve) => {
if (TS_CACHE[site]) return resolve(TS_CACHE[site]);
const script = document.createElement(‘script’);
script.src = TS_FILE[site];
script.onload = () => resolve(TS_CACHE[site]);
document.head.appendChild(script);
});
}

// ─── CHART HELPERS ───────────────────────────────────────────
function makeBarChart(id, labels, prePre, postData, yLabel = ‘’, titleText = ‘’) {
const ctx = document.getElementById(id);
if (!ctx) return;
return new Chart(ctx, {
type: ‘bar’,
data: {
labels,
datasets: [
{
label: ‘Pre-Implementation’,
data: prePre,
backgroundColor: C.preColor,
borderColor: C.red,
borderWidth: 1.5,
},
{
label: ‘Post-Implementation’,
data: postData,
backgroundColor: C.postColor,
borderColor: C.teal,
borderWidth: 1.5,
}
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: true,
position: ‘top’,
labels: { boxWidth: 12, padding: 12, font: { size: 10 } }
},
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 10,
callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}` }
}
},
scales: {
x: { grid: { display: false }, ticks: { font: { size: 10 } } },
y: {
beginAtZero: true,
grid: { color: ‘rgba(0,0,0,0.05)’ },
title: { display: !!yLabel, text: yLabel, font: { size: 10 } }
}
}
}
});
}

// ─── CHART 1: IV Doses per patient-day ───────────────────────
makeBarChart(‘ivChart’,
[‘Combined’, ‘AMC (MHMH)’, ‘CAH (APD)’],
[0.158, 0.142, 0.167],
[0.043, 0.049, 0.040],
‘Doses / patient-day’
);

// ─── CHART 2: Total MME ──────────────────────────────────────
makeBarChart(‘mmeChart’,
[‘Combined’, ‘AMC (MHMH)’, ‘CAH (APD)’],
[14.46, 13.50, 14.98],
[7.65, 4.70, 9.28],
‘MME / patient-day’
);

// ─── CHART 3: Route distribution AMC ─────────────────────────
(function() {
const ctx = document.getElementById(‘routeAmcChart’);
if (!ctx) return;
new Chart(ctx, {
type: ‘bar’,
data: {
labels: [‘IV’, ‘SQ’, ‘Oral’, ‘Total’, ‘Parenteral’],
datasets: [
{ label: ‘Pre’, data: [0.14, 0, 0.53, 0.68, 0.14], backgroundColor: C.preColor, borderColor: C.red, borderWidth: 1.5 },
{ label: ‘Post’, data: [0.05, 0.05, 0.30, 0.41, 0.10], backgroundColor: C.postColor, borderColor: C.teal, borderWidth: 1.5 }
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { display: true, position: ‘top’, labels: { boxWidth: 12, font: { size: 10 } } },
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 10
}
},
scales: {
x: { grid: { display: false }, ticks: { font: { size: 10 } } },
y: { beginAtZero: true, grid: { color: ‘rgba(0,0,0,0.05)’ }, title: { display: true, text: ‘Doses / patient-day’, font: { size: 10 } } }
}
}
});
})();

// ─── CHART 4: Doses per IV order (histogram-style) ───────────
(function() {
const ctx = document.getElementById(‘orderChart’);
if (!ctx) return;
const orders = META.orders;

// Bin doses into buckets
const bins = [1,2,3,4,5,6,7,‘8+’];
function binData(arr) {
const counts = new Array(8).fill(0);
arr.forEach(v => {
const idx = Math.min(Math.floor(v), 8) - 1;
if (idx >= 0) counts[Math.min(idx, 7)]++;
});
const total = arr.length;
return counts.map(c => +(c / total * 100).toFixed(1));
}

new Chart(ctx, {
type: ‘bar’,
data: {
labels: bins.map(b => String(b)),
datasets: [
{ label: ‘Pre’, data: binData(orders.Control), backgroundColor: C.preColor, borderColor: C.red, borderWidth: 1.5 },
{ label: ‘Post’, data: binData(orders.Intervention), backgroundColor: C.postColor, borderColor: C.teal, borderWidth: 1.5 }
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { display: true, position: ‘top’, labels: { boxWidth: 12, font: { size: 10 } } },
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 10,
callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` }
}
},
scales: {
x: { grid: { display: false }, title: { display: true, text: ‘Doses per order’, font: { size: 10 } } },
y: { beginAtZero: true, grid: { color: ‘rgba(0,0,0,0.05)’ }, title: { display: true, text: ‘% of orders’, font: { size: 10 } } }
}
}
});
})();

// ─── TIME SERIES CHART ────────────────────────────────────────
let tsChart = null;
let currentSite = ‘MHMH’;
let currentMetric = ‘iv’;

const metricMap = {
iv: { key: ‘iv’, label: ‘IV Doses / patient-day’, color: C.red },
total: { key: ‘total’, label: ‘Total Doses / patient-day’, color: C.teal },
mme_total: { key: ‘mme_total’, label: ‘Total MME / patient-day’, color: C.gold },
mme_par: { key: ‘mme_par’, label: ‘Parenteral MME / patient-day’, color: ‘#8e44ad’ },
par: { key: ‘par’, label: ‘Parenteral Doses / patient-day’, color: ‘#e67e22’ },
};

// Crossover dates
const CROSSOVER_START = new Date(‘2021-06-22’);
const CROSSOVER_END = new Date(‘2021-10-22’);

function buildTSData(site, metric) {
const rows = TS_CACHE[site] || [];
const m = metricMap[metric];
const pts = rows.map(r => ({ x: r.d, y: r[m.key], period: r.p }));
return { pts, m };
}

function computeRolling(pts, window = 7) {
return pts.map((p, i) => {
const slice = pts.slice(Math.max(0, i - window + 1), i + 1).map(p => p.y).filter(v => v != null);
return { x: p.x, y: slice.length ? +(slice.reduce((a,b)=>a+b,0)/slice.length).toFixed(4) : null, period: p.period };
});
}

function computeMean(arr) {
const vals = arr.filter(v => v != null && !isNaN(v));
return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
}

function computeUCL(arr, n = 3) {
const vals = arr.filter(v => v != null && !isNaN(v));
const mean = computeMean(vals);
const std = Math.sqrt(vals.map(v => (v-mean)**2).reduce((a,b)=>a+b,0)/vals.length);
return mean + n * std;
}

async function renderTSChart(site, metric) {
const ctx = document.getElementById(‘tsChart’);
if (!ctx) return;

// Show loading state
ctx.style.opacity = ‘0.3’;
await loadTS(site);
ctx.style.opacity = ‘1’;
const { pts, m } = buildTSData(site, metric);
const rolled = computeRolling(pts, 7);

const prePts = pts.filter(p => p.period === ‘Control’);
const postPts = pts.filter(p => p.period === ‘Intervention’);
const preMean = computeMean(prePts.map(p => p.y));
const postMean = computeMean(postPts.map(p => p.y));
const preUCL = computeUCL(prePts.map(p => p.y));
const postUCL = computeUCL(postPts.map(p => p.y));

// Build mean/UCL lines (only shown in respective period)
const preMeanLine = pts.map(p => p.period === ‘Control’ ? { x: p.x, y: preMean } : { x: p.x, y: null });
const postMeanLine = pts.map(p => p.period === ‘Intervention’ ? { x: p.x, y: postMean } : { x: p.x, y: null });
const preUCLLine = pts.map(p => p.period === ‘Control’ ? { x: p.x, y: preUCL } : { x: p.x, y: null });
const postUCLLine = pts.map(p => p.period === ‘Intervention’ ? { x: p.x, y: postUCL } : { x: p.x, y: null });

if (tsChart) tsChart.destroy();

tsChart = new Chart(ctx, {
type: ‘line’,
data: {
datasets: [
// Raw data points
{
label: ‘Daily value’,
data: pts.map(p => ({ x: p.x, y: p.y })),
pointRadius: 2,
pointHoverRadius: 4,
borderWidth: 0,
showLine: false,
pointBackgroundColor: pts.map(p => {
const d = new Date(p.x);
if (d >= CROSSOVER_START && d <= CROSSOVER_END) return C.gold;
return p.period === ‘Control’ ? C.red : C.teal;
}),
pointBorderColor: ‘transparent’,
},
// 7-day rolling average
{
label: ‘7-day average’,
data: rolled.map(p => ({ x: p.x, y: p.y })),
borderColor: m.color,
borderWidth: 2,
pointRadius: 0,
tension: 0.3,
fill: false,
},
// Pre mean
{ label: ‘Mean (pre)’, data: preMeanLine, borderColor: ‘rgba(192,57,43,0.5)’, borderWidth: 1.5, borderDash: [4,3], pointRadius: 0, fill: false },
// Post mean
{ label: ‘Mean (post)’, data: postMeanLine, borderColor: ‘rgba(26,127,142,0.5)’, borderWidth: 1.5, borderDash: [4,3], pointRadius: 0, fill: false },
// Pre UCL
{ label: ‘UCL (pre)’, data: preUCLLine, borderColor: ‘rgba(192,57,43,0.3)’, borderWidth: 1, borderDash: [2,4], pointRadius: 0, fill: false },
// Post UCL
{ label: ‘UCL (post)’, data: postUCLLine, borderColor: ‘rgba(26,127,142,0.25)’, borderWidth: 1, borderDash: [2,4], pointRadius: 0, fill: false },
]
},
options: {
responsive: true,
maintainAspectRatio: false,
interaction: { mode: ‘index’, intersect: false },
plugins: {
legend: { display: false },
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 12,
filter: (item) => item.datasetIndex <= 1,
callbacks: {
title: items => items[0]?.label,
label: item => ` ${item.dataset.label}: ${item.raw.y != null ? item.raw.y.toFixed(3) : 'N/A'}`,
}
},
annotation: {
annotations: {
crossover: {
type: ‘box’,
xMin: ‘2021-06-22’,
xMax: ‘2021-10-22’,
backgroundColor: ‘rgba(184,134,11,0.06)’,
borderColor: ‘rgba(184,134,11,0.2)’,
borderWidth: 1,
}
}
}
},
scales: {
x: {
type: ‘time’,
time: { unit: ‘month’, displayFormats: { month: ‘MMM yy’ } },
grid: { color: ‘rgba(255,255,255,0.05)’ },
ticks: { color: ‘rgba(245,240,232,0.4)’, maxRotation: 0 }
},
y: {
beginAtZero: true,
grid: { color: ‘rgba(255,255,255,0.06)’ },
ticks: { color: ‘rgba(245,240,232,0.4)’ },
title: { display: true, text: m.label, color: ‘rgba(245,240,232,0.35)’, font: { size: 10 } }
}
}
}
});
}

// Init TS chart
renderTSChart(currentSite, currentMetric);

// Site buttons
document.querySelectorAll(’.ts-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
document.querySelectorAll(’.ts-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
currentSite = btn.dataset.site;
renderTSChart(currentSite, currentMetric);
});
});

// Metric selector
document.getElementById(‘tsMetric’).addEventListener(‘change’, (e) => {
currentMetric = e.target.value;
renderTSChart(currentSite, currentMetric);
});

// ─── PAIN SCORES CHART ────────────────────────────────────────
(function() {
const ctx = document.getElementById(‘painChart’);
if (!ctx) return;
const pd = META.pain_scores;
new Chart(ctx, {
type: ‘line’,
data: {
labels: pd.days.map(d => `Day ${d}`),
datasets: [
{
label: `Pre (n=${pd.pre_n})`,
data: pd.pre,
borderColor: C.red,
backgroundColor: C.redPale,
borderWidth: 2,
pointRadius: 5,
pointBackgroundColor: C.red,
tension: 0.3,
fill: false,
},
{
label: `Post (n=${pd.post_n})`,
data: pd.post,
borderColor: C.teal,
backgroundColor: C.tealL,
borderWidth: 2,
pointRadius: 5,
pointBackgroundColor: C.teal,
tension: 0.3,
fill: false,
}
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: true,
position: ‘top’,
labels: { boxWidth: 12, padding: 14, font: { size: 11 } }
},
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 12,
callbacks: {
afterBody: (items) => {
const dayIdx = pd.days.indexOf(items[0].dataIndex + 1);
return dayIdx >= 0 ? [`p = ${pd.pvalues[items[0].dataIndex]}`] : [];
}
}
}
},
scales: {
x: { grid: { display: false } },
y: {
min: 0, max: 6,
title: { display: true, text: ‘Mean pain score (0–10)’, font: { size: 10 } },
grid: { color: ‘rgba(0,0,0,0.05)’ }
}
}
}
});
})();

// ─── NON-HOSPITALIST CHARTS ───────────────────────────────────
function makeNonHospChart(id, amc) {
const ctx = document.getElementById(id);
if (!ctx) return;
const labels = [‘IV’, ‘SQ’, ‘Oral’, ‘Total’, ‘Parenteral’];
const pre = amc
? [0.14, 0, 0.53, 0.68, 0.14]
: [0.0002, 0, 0.0075, 0.0077, 0.0002];
const post = amc
? [0.05, 0.05, 0.30, 0.41, 0.10]
: [0, 0.0004, 0.0037, 0.0041, 0.0004];
const pvals = amc
? [’<0.001’, ‘<0.001’, ‘<0.001’, ‘<0.001’, ‘0.006’]
: [‘0.318’, ‘0.318’, ‘0.274’, ‘0.295’, ‘0.751’];

new Chart(ctx, {
type: ‘bar’,
data: {
labels,
datasets: [
{ label: ‘Control’, data: pre, backgroundColor: C.preColor, borderColor: C.red, borderWidth: 1.5 },
{ label: ‘Intervention’, data: post, backgroundColor: C.postColor, borderColor: C.teal, borderWidth: 1.5 }
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { display: true, position: ‘top’, labels: { boxWidth: 12, font: { size: 10 } } },
tooltip: {
backgroundColor: C.ink,
titleColor: C.cream,
bodyColor: ‘rgba(245,240,232,0.7)’,
padding: 10,
callbacks: {
afterBody: (items) => {
const idx = labels.indexOf(items[0].label);
return idx >= 0 ? [`p = ${pvals[idx]}`] : [];
}
}
}
},
scales: {
x: { grid: { display: false }, ticks: { font: { size: 10 } } },
y: { beginAtZero: true, grid: { color: ‘rgba(0,0,0,0.05)’ }, title: { display: true, text: ‘Doses / patient-day’, font: { size: 10 } } }
}
}
});
}
makeNonHospChart(‘nonHospAmcChart’, true);
makeNonHospChart(‘nonHospCahChart’, false);
