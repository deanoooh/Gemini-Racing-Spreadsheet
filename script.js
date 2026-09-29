const STORAGE_KEY = 'gemini-racing-spreadsheet-v1';

const INITIAL_ROWS = [
  {
    date: '2026-09-28',
    raceTime: '19:30',
    course: 'Wolverhampton',
    distance: '1m 142y',
    tier: 'Primary',
    horseName: 'Crown The Future',
    odds: 5,
    betType: 'E/W',
    stake: 1,
    result: 'Won',
    placePaid: 'Yes',
    return: 4,
    pnl: 3
  }
];

const tableBody = document.getElementById('logTableBody');
const addRowBtn = document.getElementById('addRowBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const resetBtn = document.getElementById('resetBtn');

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toCurrency(value) {
  const amount = safeNumber(value);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function toPercent(value) {
  const amount = safeNumber(value);
  return `${(amount * 100).toFixed(2)}%`;
}

function normalizeRow(row = {}) {
  const normalized = { ...row };
  normalized.date = normalized.date || '';
  normalized.raceTime = normalized.raceTime || '';
  normalized.course = normalized.course || '';
  normalized.distance = normalized.distance || '';
  normalized.tier = normalized.tier || 'Primary';
  normalized.horseName = normalized.horseName || '';
  normalized.odds = safeNumber(normalized.odds);
  normalized.betType = normalized.betType || 'Win';
  normalized.stake = safeNumber(normalized.stake);
  normalized.result = normalized.result || 'Lost';
  normalized.placePaid = normalized.placePaid || '';
  normalized.return = safeNumber(normalized.return);
  normalized.pnl = safeNumber(normalized.return) - safeNumber(normalized.stake);
  return normalized;
}

function isFilledRow(row) {
  return String(row.horseName || '').trim() !== '';
}

function getRows() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!Array.isArray(raw) || raw.length === 0) {
    return INITIAL_ROWS.map(normalizeRow);
  }
  return raw.map(normalizeRow);
}

function persistRows(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function getResultOptions() {
  return ['Won', 'Placed', 'Lost', 'Void'];
}

function getTierOptions() {
  return ['Primary', 'Secondary', 'Chaos'];
}

function getBetTypeOptions() {
  return ['Win', 'E/W', 'Place', 'Each Way', 'Forecast'];
}

function buildRowHtml(row, index) {
  const resultOptions = getResultOptions().map((option) => `
    <option value="${option}" ${row.result === option ? 'selected' : ''}>${option}</option>
  `).join('');

  const tierOptions = getTierOptions().map((option) => `
    <option value="${option}" ${row.tier === option ? 'selected' : ''}>${option}</option>
  `).join('');

  const betTypeOptions = getBetTypeOptions().map((option) => `
    <option value="${option}" ${row.betType === option ? 'selected' : ''}>${option}</option>
  `).join('');

  return `
    <tr data-index="${index}">
      <td><input data-field="date" type="date" value="${row.date || ''}" /></td>
      <td><input data-field="raceTime" type="text" value="${row.raceTime || ''}" /></td>
      <td><input data-field="course" type="text" value="${row.course || ''}" /></td>
      <td><input data-field="distance" type="text" value="${row.distance || ''}" /></td>
      <td>
        <select data-field="tier">
          ${tierOptions}
        </select>
      </td>
      <td><input data-field="horseName" type="text" value="${row.horseName || ''}" /></td>
      <td><input data-field="odds" type="number" step="0.01" value="${row.odds || 0}" /></td>
      <td>
        <select data-field="betType">
          ${betTypeOptions}
        </select>
      </td>
      <td><input data-field="stake" type="number" step="0.01" value="${row.stake || 0}" /></td>
      <td>
        <select data-field="result">
          ${resultOptions}
        </select>
      </td>
      <td><input data-field="placePaid" type="text" value="${row.placePaid || ''}" /></td>
      <td><input data-field="return" type="number" step="0.01" value="${row.return || 0}" /></td>
      <td class="pnl-cell ${row.pnl >= 0 ? 'positive' : 'negative'}">${toCurrency(row.pnl)}</td>
      <td class="actions-col"><button type="button" class="delete-btn" data-delete-index="${index}">Delete</button></td>
    </tr>
  `;
}

function renderTable() {
  const rows = getRows();
  tableBody.innerHTML = rows.map(buildRowHtml).join('');
  bindTableEvents();
  renderDashboard();
}

function bindTableEvents() {
  tableBody.querySelectorAll('input, select').forEach((element) => {
    element.addEventListener('input', handleRowChange);
    element.addEventListener('change', handleRowChange);
  });

  tableBody.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const rows = getRows();
      const index = Number(button.dataset.deleteIndex);
      rows.splice(index, 1);
      persistRows(rows);
      renderTable();
    });
  });
}

function handleRowChange(event) {
  const rowIndex = Number(event.target.closest('tr').dataset.index);
  const rows = getRows();
  const field = event.target.dataset.field;
  const value = ['number'].includes(event.target.type) ? safeNumber(event.target.value) : event.target.value;

  rows[rowIndex][field] = value;
  rows[rowIndex] = normalizeRow(rows[rowIndex]);
  persistRows(rows);
  renderTable();
}

function addRow() {
  const rows = getRows();
  rows.push({
    date: new Date().toISOString().slice(0, 10),
    raceTime: '',
    course: '',
    distance: '',
    tier: 'Primary',
    horseName: '',
    odds: 0,
    betType: 'Win',
    stake: 0,
    result: 'Lost',
    placePaid: '',
    return: 0,
    pnl: 0
  });
  persistRows(rows);
  renderTable();
}

function setSampleData() {
  const rows = [
    {
      date: '2026-09-28',
      raceTime: '19:30',
      course: 'Wolverhampton',
      distance: '1m 142y',
      tier: 'Primary',
      horseName: 'Crown The Future',
      odds: 5,
      betType: 'E/W',
      stake: 1,
      result: 'Won',
      placePaid: 'Yes',
      return: 4,
      pnl: 3
    },
    {
      date: '2026-09-27',
      raceTime: '15:45',
      course: 'Ascot',
      distance: '1m 4f',
      tier: 'Secondary',
      horseName: 'Irish Whisper',
      odds: 3.5,
      betType: 'Win',
      stake: 2,
      result: 'Placed',
      placePaid: 'No',
      return: 0,
      pnl: -2
    },
    {
      date: '2026-09-26',
      raceTime: '17:20',
      course: 'Haydock',
      distance: '5f',
      tier: 'Chaos',
      horseName: 'Night Signal',
      odds: 8,
      betType: 'E/W',
      stake: 1.5,
      result: 'Lost',
      placePaid: 'No',
      return: 0,
      pnl: -1.5
    }
  ].map(normalizeRow);

  persistRows(rows);
  renderTable();
}

function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
  renderTable();
}

function sum(values) {
  return values.reduce((total, value) => total + safeNumber(value), 0);
}

function countMatches(rows, field, value) {
  return rows.filter((row) => String(row[field] || '').trim() === String(value).trim()).length;
}

function getOverallPerformance(rows) {
  const validRows = rows.filter(isFilledRow);
  const totalBets = validRows.length;
  const totalStaked = sum(validRows.map((row) => row.stake));
  const totalReturns = sum(validRows.map((row) => row.return));
  const totalPnl = sum(validRows.map((row) => row.pnl));
  const overallROI = totalStaked > 0 ? totalPnl / totalStaked : 0;
  const wins = countMatches(validRows, 'result', 'Won');
  const placed = countMatches(validRows, 'result', 'Placed');
  const winRate = totalBets > 0 ? wins / totalBets : 0;
  const strikeRate = totalBets > 0 ? (wins + placed) / totalBets : 0;

  return {
    totalBets,
    totalStaked,
    totalReturns,
    totalPnl,
    overallROI,
    winRate,
    strikeRate
  };
}

function getRollingPerformance(rows) {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - 7);

  const recentRows = rows.filter((row) => {
    if (!row.date || !isFilledRow(row)) return false;
    const rowDate = new Date(row.date);
    return !Number.isNaN(rowDate.getTime()) && rowDate >= cutoff && rowDate <= today;
  });

  const rollingStaked = sum(recentRows.map((row) => row.stake));
  const rollingReturns = sum(recentRows.map((row) => row.return));
  const rollingPnl = sum(recentRows.map((row) => row.pnl));
  const rollingROI = rollingStaked > 0 ? rollingPnl / rollingStaked : 0;

  return {
    rollingStaked,
    rollingReturns,
    rollingPnl,
    rollingROI
  };
}

function getTierBreakdown(rows) {
  return getTierOptions().map((tier) => {
    const tierRows = rows.filter((row) => row.tier === tier && isFilledRow(row));
    const bets = tierRows.length;
    const staked = sum(tierRows.map((row) => row.stake));
    const returns = sum(tierRows.map((row) => row.return));
    const pnl = sum(tierRows.map((row) => row.pnl));
    const roi = staked > 0 ? pnl / staked : 0;

    return { tier, bets, staked, returns, pnl, roi };
  });
}

function renderMetricList(containerId, metrics) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = metrics
    .map((metric) => `
      <div class="metric-row">
        <span>${metric.label}</span>
        <strong class="${metric.valueClass || ''}">${metric.value}</strong>
      </div>
    `)
    .join('');
}

function renderDashboard() {
  const rows = getRows();
  const overview = getOverallPerformance(rows);
  const rolling = getRollingPerformance(rows);
  const tierBreakdown = getTierBreakdown(rows);

  renderMetricList('overallMetrics', [
    { label: 'Total Bets Placed', value: overview.totalBets },
    { label: 'Total Outlay / Staked', value: toCurrency(overview.totalStaked) },
    { label: 'Total Returns', value: toCurrency(overview.totalReturns) },
    { label: 'Net Profit / Loss', value: toCurrency(overview.totalPnl), valueClass: overview.totalPnl >= 0 ? 'positive' : 'negative' },
    { label: 'Overall ROI (%)', value: toPercent(overview.overallROI) },
    { label: 'Overall Win Rate (%)', value: toPercent(overview.winRate) },
    { label: 'Overall Strike Rate (Win + Place %)', value: toPercent(overview.strikeRate) }
  ]);

  renderMetricList('rollingMetrics', [
    { label: '7-Day Outlay', value: toCurrency(rolling.rollingStaked) },
    { label: '7-Day Returns', value: toCurrency(rolling.rollingReturns) },
    { label: '7-Day Net P/L', value: toCurrency(rolling.rollingPnl), valueClass: rolling.rollingPnl >= 0 ? 'positive' : 'negative' },
    { label: '7-Day Rolling ROI (%)', value: toPercent(rolling.rollingROI) }
  ]);

  const tierTable = document.getElementById('tierTableBody');
  if (tierTable) {
    tierTable.innerHTML = tierBreakdown.map((tier) => `
      <tr>
        <td>${tier.tier}</td>
        <td>${tier.bets}</td>
        <td>${toCurrency(tier.staked)}</td>
        <td>${toCurrency(tier.returns)}</td>
        <td class="${tier.pnl >= 0 ? 'positive' : 'negative'}">${toCurrency(tier.pnl)}</td>
        <td>${toPercent(tier.roi)}</td>
      </tr>
    `).join('');
  }
}

addRowBtn.addEventListener('click', addRow);
loadSampleBtn.addEventListener('click', setSampleData);
resetBtn.addEventListener('click', clearAll);

renderTable();
