export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const LEAD_STATUSES = ['To Contact', 'Contacted', 'Replied', 'In Discussion', 'Proposal Sent', 'Won', 'Lost', 'No Response']
export const PRIORITIES = ['High', 'Medium', 'Low']
export const SOURCES = ['Upwork', 'Fiverr', 'LinkedIn', 'Instagram', 'Google Maps', 'Referral', 'Cold Email', 'Website', 'Other']
export const SERVICES = ['Web Development', 'App Development', 'Automation / Bots', 'Browser Extension', 'Bug Fixing', 'UI/UX Design', 'Maintenance', 'Other']
export const PROJECT_STATUSES = ['Not Started', 'In Progress', 'Review', 'Completed', 'On Hold']
export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue']
export const WIN_PCTS = [10, 25, 50, 75, 90]
export const OWNERS = ['You', 'Partner', 'Team']
export const EXPENSE_CATEGORIES = ['Software', 'Subscriptions', 'Marketing', 'Equipment', 'Fees', 'Travel', 'Misc']
export const PAYMENT_METHODS = ['Bank Transfer', 'Wise', 'PayPal', 'Payoneer', 'Stripe', 'Card', 'Cash']
export const RECURRING = ['Yes', 'No']

// badge color maps: { bg, fg }
export const STATUS_COLORS = {
  'To Contact': { bg: '#fef3c7', fg: '#92400e' },
  Contacted: { bg: '#dbeafe', fg: '#1e40af' },
  Replied: { bg: '#bfdbfe', fg: '#1e40af' },
  'In Discussion': { bg: '#e0e7ff', fg: '#3730a3' },
  'Proposal Sent': { bg: '#c7d2fe', fg: '#3730a3' },
  Won: { bg: '#d1fae5', fg: '#065f46' },
  Lost: { bg: '#fee2e2', fg: '#991b1b' },
  'No Response': { bg: '#f1f5f9', fg: '#475569' },
}
export const PRIORITY_COLORS = {
  High: { bg: '#fee2e2', fg: '#991b1b' },
  Medium: { bg: '#fef3c7', fg: '#92400e' },
  Low: { bg: '#f1f5f9', fg: '#475569' },
}
export const PROJECT_COLORS = {
  'Not Started': { bg: '#ffe4e6', fg: '#9f1239' },
  'In Progress': { bg: '#dbeafe', fg: '#1e40af' },
  Review: { bg: '#fef3c7', fg: '#92400e' },
  Completed: { bg: '#d1fae5', fg: '#065f46' },
  'On Hold': { bg: '#f1f5f9', fg: '#475569' },
}
export const INVOICE_COLORS = {
  Draft: { bg: '#f1f5f9', fg: '#475569' },
  Sent: { bg: '#fef3c7', fg: '#92400e' },
  Paid: { bg: '#d1fae5', fg: '#065f46' },
  Overdue: { bg: '#fee2e2', fg: '#991b1b' },
}

export const CHART_COLORS = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#475569', '#64748b', '#94a3b8', '#cbd5e1']

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
]

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10))

export const DEFAULT_SETTINGS = {
  annualGoal: 30000,
  currency: 'USD',
  businessName: 'Your Name / Studio',
  businessEmail: '',
  businessAddress: '',
  paymentTerms: 'Payable within 7 days. Thank you!',
}

export function emptyData() {
  return { leads: [], projects: [], invoices: [], expenses: [], settings: { ...DEFAULT_SETTINGS } }
}

export function seedData() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    leads: [
      { id: uid(), company: 'Bright Cafe', contact: 'Sarah Khan', service: 'Web Development', source: 'Google Maps', status: 'Proposal Sent', priority: 'High', dealValue: 400, winPct: 50, nextFollowUp: '2026-06-20', owner: 'You', notes: 'No online menu' },
      { id: uid(), company: 'NovaFit Studio', contact: 'Mike Reyes', service: 'Automation / Bots', source: 'Instagram', status: 'Won', priority: 'High', dealValue: 650, winPct: 90, nextFollowUp: '', owner: 'You', notes: 'Booking bot' },
      { id: uid(), company: 'Acme Legal', contact: 'Dana Holt', service: 'Web Development', source: 'LinkedIn', status: 'In Discussion', priority: 'Medium', dealValue: 1800, winPct: 50, nextFollowUp: '2026-06-18', owner: 'You', notes: 'Marketing site redesign' },
      { id: uid(), company: 'Pixel Mart', contact: 'Omar Z.', service: 'Bug Fixing', source: 'Upwork', status: 'Contacted', priority: 'Low', dealValue: 250, winPct: 25, nextFollowUp: '2026-06-24', owner: 'You', notes: 'Checkout bug' },
      { id: uid(), company: 'GreenLeaf', contact: 'Tina M.', service: 'UI/UX Design', source: 'Referral', status: 'Won', priority: 'Medium', dealValue: 900, winPct: 90, nextFollowUp: '', owner: 'You', notes: 'App redesign' },
      { id: uid(), company: 'Skyline Realty', contact: 'Paul N.', service: 'Web Development', source: 'Cold Email', status: 'Lost', priority: 'Low', dealValue: 1200, winPct: 10, nextFollowUp: '', owner: 'You', notes: 'Went with agency' },
    ],
    projects: [
      { id: uid(), name: 'NovaFit booking bot', client: 'NovaFit Studio', service: 'Automation / Bots', start: '2026-05-18', deadline: '2026-06-02', status: 'Completed', progress: 100, amount: 650, received: 650, notes: 'Delivered' },
      { id: uid(), name: 'GreenLeaf app redesign', client: 'GreenLeaf', service: 'UI/UX Design', start: '2026-06-01', deadline: '2026-06-28', status: 'In Progress', progress: 55, amount: 900, received: 450, notes: 'Mid-fi done' },
      { id: uid(), name: 'Acme marketing site', client: 'Acme Legal', service: 'Web Development', start: '2026-06-10', deadline: '2026-06-14', status: 'Review', progress: 80, amount: 1800, received: 600, notes: 'Awaiting feedback' },
    ],
    invoices: [
      { id: uid(), client: 'NovaFit Studio', description: 'Booking bot — full', issueDate: '2026-02-04', dueDate: '2026-02-11', amount: 650, taxPct: 0, status: 'Paid', datePaid: '2026-02-08', method: 'Wise', notes: '' },
      { id: uid(), client: 'GreenLeaf', description: 'App redesign — 50%', issueDate: '2026-04-02', dueDate: '2026-04-09', amount: 450, taxPct: 0, status: 'Paid', datePaid: '2026-04-05', method: 'PayPal', notes: 'Deposit' },
      { id: uid(), client: 'Bright Cafe', description: 'Website build', issueDate: '2026-05-10', dueDate: '2026-05-17', amount: 400, taxPct: 0, status: 'Paid', datePaid: '2026-05-15', method: 'Stripe', notes: '' },
      { id: uid(), client: 'Acme Legal', description: 'Marketing site — deposit', issueDate: '2026-06-10', dueDate: '2026-06-17', amount: 600, taxPct: 0, status: 'Sent', datePaid: '', method: '', notes: '' },
      { id: uid(), client: 'Pixel Mart', description: 'Checkout fix', issueDate: '2026-05-28', dueDate: '2026-06-04', amount: 250, taxPct: 0, status: 'Overdue', datePaid: '', method: '', notes: 'Chase payment' },
    ],
    expenses: [
      { id: uid(), date: '2026-06-01', category: 'Software', vendor: 'Hosting + domain', amount: 18, recurring: 'Yes', notes: '' },
      { id: uid(), date: '2026-06-03', category: 'Subscriptions', vendor: 'Design tools', amount: 22, recurring: 'Yes', notes: '' },
      { id: uid(), date: '2026-04-12', category: 'Fees', vendor: 'Payment processor', amount: 14, recurring: 'No', notes: '' },
      { id: uid(), date: '2026-02-20', category: 'Marketing', vendor: 'Ads', amount: 60, recurring: 'No', notes: 'Lead gen' },
    ],
  }
}
