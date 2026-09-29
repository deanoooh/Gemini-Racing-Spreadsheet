const STORAGE_KEY = 'gemini-racing-spreadsheet-v1';

const initialRows = [
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

function currency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function percent(value) {
  return `${((value || 0) * 100).toFixed(2)}%`;
}

function calculatePnl(row) {
  const stake = safeNumber(row.stake);
  const returnValue = safeNumber(row.return);
  return returnValue - stake;
}

function normalizeRow(row) {
  const normalized = { ...row };
  normalized.odds = safeNumber(row.odds);
  normalized.stake = safeNumber(row.stake);
  normalized.return = safeNumber(row.return);
  normalized.pnl = calculatePnl(normalized);
  return normalized;
}

function getRows() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return initialRows.map(normalizeRow);
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
  const resultOptions = getResultOptions()
    .map((option) => `<option value="${option}" ${row.result === option ? 'selected' : ''}>${option}</option>`)
    .join('');

  const tierOptions = getTierOptions()
    .map((option) => `<option value="${option}" ${row.tier === option ? 'selected' : ''}>${option}</option>`)
    .join('');

  const betTypeOptions = getBetTypeOptions()
    .map((option) => `<option value="${option}" ${row.betType === option ? 'selected' : ''}>${option}</option>`)
    .join('');

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
      <td>${currency(row.pnl || 0)}</td>
      <td class="actions-col"><button type="button" class="delete-btn" data-delete-index="${index}">Delete</button></td>
    </tr>
  `;
}

function renderTable() {
  const rows = getRows();
  tableBody.innerHTML = rows.map(buildRowHtml).join('');
  bindTableEvents();
  updateDashboard();
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
  const value = event.target.type === 'number' ? safeNumber(event.target.value) : event.target.value;

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

function updateDashboard() {
  const rows = getRows();
  const totalBets = rows.length;
  const totalStaked = rows.reduce((sum, row) => sum + safeNumber(row.stake), 0);
  const totalReturns = rows.reduce((sum, row) => sum + safeNumber(row.return), 0);
  const totalPnl = rows.reduce((sum, row) => sum + safeNumber(row.pnl), 0);
  const wins = rows.filter((row) => row.result === 'Won').length;
  const roi = totalStaked > 0 ? totalPnl / totalStaked : 0;
  const winRate = totalBets > 0 ? wins / totalBets : 0;

  const today = new Date();
  const cutoff = new Date();
  cutoff.setDate(today.getDate() - 7);

  const rollingRows = rows.filter((row) => {
    if (!row.date) return false;
    const rowDate = new Date(row.date);
    return rowDate >= cutoff && rowDate <= today;
  });

  const rollingStaked = rollingRows.reduce((sum, row) => sum + safeNumber(row.stake), 0);
  const rollingReturns = rollingRows.reduce((sum, row) => sum + safeNumber(row.return), 0);
  const rollingPnl = rollingRows.reduce((sum, row) => sum + safeNumber(row.pnl), 0);
  const rollingRoi = rollingStaked > 0 ? rollingPnl / rollingStaked : 0;

  document.getElementById('totalBets').textContent = String(totalBets);
  document.getElementById('totalStaked').textContent = currency(totalStaked);
  document.getElementById('totalReturns').textContent = currency(totalReturns);
  document.getElementById('totalPnl').textContent = currency(totalPnl);
  document.getElementById('roi').textContent = percent(roi);
  document.getElementById('winRate').textContent = percent(winRate);

  document.getElementById('rollingStaked').textContent = currency(rollingStaked);
  document.getElementById('rollingReturns').textContent = currency(rollingReturns);
  document.getElementById('rollingPnl').textContent = currency(rollingPnl);
  document.getElementById('rollingRoi').textContent = percent(rollingRoi);

  const tierGroups = getTierOptions().map((tier) => {
    const filtered = rows.filter((row) => row.tier === tier);
    const stake = filtered.reduce((sum, row) => sum + safeNumber(row.stake), 0);
    const returns = filtered.reduce((sum, row) => sum + safeNumber(row.return), 0);
    const pnl = filtered.reduce((sum, row) => sum + safeNumber(row.pnl), 0);
    const roiTier = stake > 0 ? pnl / stake : 0;

    return {
      tier,
      bets: filtered.length,
      stake,
      returns,
      pnl,
      roiTier
    };
  });

  const tierContainer = document.getElementById('tierBreakdown');
  tierContainer.innerHTML = tierGroups
    .map((entry) => `
      <div class="tier-item">
        <span>${entry.tier}</span>
        <strong class="${entry.pnl >= 0 ? 'positive' : 'negative'}">${currency(entry.pnl)}</strong>
      </div>
    `)
    .join('');

  const pnlElement = document.getElementById('totalPnl');
  pnlElement.className = totalPnl >= 0 ? 'positive' : 'negative';
}

addRowBtn.addEventListener('click', addRow);
loadSampleBtn.addEventListener('click', setSampleData);
resetBtn.addEventListener('click', clearAll);

renderTable();
