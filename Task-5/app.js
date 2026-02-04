/**
 * Income Expense Calculator (Tailwind version)
 * CRUD + Filters + LocalStorage
 */

const STORAGE_KEY = "iec_entries_v1";

let entries = [];
let activeFilter = "all";
let editingId = null;

// Elements
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netBalanceEl = document.getElementById("netBalance");

const formTitleEl = document.getElementById("formTitle");
const entryForm = document.getElementById("entryForm");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const errorMsgEl = document.getElementById("errorMsg");

const entryListEl = document.getElementById("entryList");
const emptyStateEl = document.getElementById("emptyState");

// ---------- Storage ----------
function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    entries = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(entries)) entries = [];
  } catch {
    entries = [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ---------- Utils ----------
function uid() {
  return crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return "₹" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getSelectedType() {
  const checked = document.querySelector('input[name="type"]:checked');
  return checked ? checked.value : "income";
}

function setSelectedType(type) {
  const el = document.querySelector(`input[name="type"][value="${type}"]`);
  if (el) el.checked = true;
}

function showError(msg) {
  errorMsgEl.textContent = msg;
  errorMsgEl.classList.remove("hidden");
}

function clearError() {
  errorMsgEl.textContent = "";
  errorMsgEl.classList.add("hidden");
}

// ---------- Totals ----------
function computeTotals(allEntries) {
  let income = 0;
  let expense = 0;

  for (const e of allEntries) {
    if (e.type === "income") income += e.amount;
    if (e.type === "expense") expense += e.amount;
  }

  return { income, expense, net: income - expense };
}

function renderTotals() {
  const { income, expense, net } = computeTotals(entries);

  totalIncomeEl.textContent = formatMoney(income);
  totalExpenseEl.textContent = formatMoney(expense);
  netBalanceEl.textContent = formatMoney(net);

  netBalanceEl.style.color = net >= 0 ? "#34d399" : "#fb7185";
}

// ---------- List Rendering ----------
function getFilteredEntries() {
  if (activeFilter === "all") return entries;
  return entries.filter(e => e.type === activeFilter);
}

function renderList() {
  const filtered = getFilteredEntries();

  entryListEl.innerHTML = "";

  if (filtered.length === 0) {
    emptyStateEl.classList.remove("hidden");
    return;
  }

  emptyStateEl.classList.add("hidden");

  for (const e of filtered) {
    const li = document.createElement("li");
        li.className = "nb-card p-4 grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-3 items-start min-w-0 overflow-visible " +
          (e.type === "income" ? "border-l-4 border-l-emerald-400/60" : "border-l-4 border-l-rose-400/60");

    const left = document.createElement("div");
    // left column: allow wrapping, avoid forcing truncation
    left.className = "min-w-0";

    const desc = document.createElement("div");
    desc.className = "font-semibold whitespace-normal break-words";
    desc.textContent = e.description;

    const tag = document.createElement("div");
    // keep the tag short on small screens and allow tooltip for full timestamp
    tag.className = "text-sm text-slate-400 whitespace-normal";
    const fullTime = new Date(e.createdAt).toLocaleString();
    const shortTime = new Date(e.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    tag.textContent = `${e.type.toUpperCase()} • ${shortTime}`;
    tag.title = fullTime;

    left.appendChild(desc);
    left.appendChild(tag);

    const right = document.createElement("div");
        right.className = "flex items-center gap-2 mt-2 sm:mt-0 sm:justify-end sm:flex-shrink-0 w-full sm:w-auto justify-center";

    const amount = document.createElement("div");
        // apply min-width on small+ screens only so it won't force overflow on very small widths
        // prevent sign and amount from wrapping separately
        amount.className = `font-bold ${e.type === 'income' ? 'text-emerald-400' : 'text-rose-400'} sm:min-w-[64px] whitespace-nowrap sm:text-right text-center`;
        const sign = e.type === "expense" ? "-" : "+";
        amount.innerHTML = sign + "\u00A0" + formatMoney(e.amount);

    const buttons = document.createElement("div");
        buttons.className = "flex items-center gap-2 flex-wrap";

    const editBtn = document.createElement("button");
    editBtn.className = "px-2 py-1 rounded-md border border-sky-500 text-slate-100 bg-transparent text-xs";
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(e.id));

    const delBtn = document.createElement("button");
    delBtn.className = "px-2 py-1 rounded-md border border-rose-400 text-slate-100 bg-transparent text-xs";
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteEntry(e.id));

    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    right.appendChild(amount);
    right.appendChild(buttons);

    li.appendChild(left);
    li.appendChild(right);

    entryListEl.appendChild(li);
  }
}

function render() {
  renderTotals();
  renderList();
}

// ---------- Form / CRUD ----------
function resetForm() {
  descriptionEl.value = "";
  amountEl.value = "";
  setSelectedType("income");
  clearError();
  exitEditMode();
}

function enterEditMode(entry) {
  editingId = entry.id;
  formTitleEl.textContent = "Edit Entry";
  submitBtn.textContent = "Update";
  cancelEditBtn.classList.remove("hidden");
}

function exitEditMode() {
  editingId = null;
  formTitleEl.textContent = "Add Entry";
  submitBtn.textContent = "Add";
  cancelEditBtn.classList.add("hidden");
}

function startEdit(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  descriptionEl.value = entry.description;
  amountEl.value = String(entry.amount);
  setSelectedType(entry.type);
  clearError();
  enterEditMode(entry);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function upsertEntry(payload) {
  if (!payload.description.trim()) {
    showError("Please enter a description.");
    return;
  }
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Amount must be a number greater than 0.");
    return;
  }

  clearError();

  if (editingId) {
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx === -1) return;

    entries[idx] = {
      ...entries[idx],
      description: payload.description.trim(),
      amount,
      type: payload.type
    };
  } else {
    entries.unshift({
      id: uid(),
      description: payload.description.trim(),
      amount,
      type: payload.type,
      createdAt: Date.now()
    });
  }

  saveEntries();
  render();
  resetForm();
}

function deleteEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  const ok = confirm(`Delete "${entry.description}"?`);
  if (!ok) return;

  entries = entries.filter(e => e.id !== id);

  if (editingId === id) resetForm();

  saveEntries();
  render();
}

// ---------- Events ----------
entryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  upsertEntry({
    description: descriptionEl.value,
    amount: amountEl.value,
    type: getSelectedType()
  });
});

resetBtn.addEventListener("click", resetForm);
cancelEditBtn.addEventListener("click", resetForm);

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    activeFilter = e.target.value;
    renderList();
  });
});

// ---------- Init ----------
loadEntries();
render();
