/**
 * CivicPulse API Service
 * 
 * Centralized API client with automatic fallback to mock data
 * when backend is unreachable. Ensures the demo always works.
 */

const API_BASE = '/api';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API call failed: ${path}`, err.message);
    return null;
  }
}

// ---- Issues API ----

export async function fetchIssues(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.reporterId) params.set('reporterId', filters.reporterId);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  const qs = params.toString();
  const data = await request(`/issues${qs ? '?' + qs : ''}`);
  return data || getMockIssues(filters);
}

export async function fetchIssue(id) {
  const data = await request(`/issues/${id}`);
  return data || getMockIssues().find(i => i.id === id) || null;
}

export async function createIssue(payload) {
  const data = await request('/issues/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data || mockCreateIssue(payload);
}

export async function updateIssueStatus(id, status, note = '') {
  const data = await request(`/issues/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
  return data;
}

export async function upvoteIssue(id) {
  return await request(`/issues/${id}/upvote`, { method: 'POST' });
}

export async function fetchStats() {
  const data = await request('/issues/stats');
  return data || getMockStats();
}

export async function fetchLeaderboard() {
  const data = await request('/issues/leaderboard/top');
  return data || getMockLeaderboard();
}

// ---- Mock Data Fallback ----

function getMockIssues(filters = {}) {
  const now = new Date().toISOString();
  const issues = [
    {
      id: 'ISS-001',
      title: 'Large pothole on MG Road near Shivaji Chowk',
      description: 'A large pothole approximately 2 feet wide has formed on the main carriageway. Multiple vehicles have been damaged.',
      imageUrl: '',
      location: { latitude: 18.5204, longitude: 73.8567, address: 'MG Road, Shivaji Chowk, Pune' },
      aiAnalysis: { category: 'Road Damage', visionConfidence: 0.94, extractedKeywords: ['pothole', 'road damage', 'asphalt', 'vehicle hazard'] },
      severity: 4,
      priorityScore: 87,
      priorityReasons: ['High traffic area', 'Safety hazard', 'Multiple reports'],
      department: 'Roads & Infrastructure',
      status: 'In Progress',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
        { status: 'Verified', timestamp: now, note: 'AI verified with 94% confidence' },
        { status: 'In Progress', timestamp: now, note: 'Assigned to field crew' },
      ],
      reporterId: 'usr_citizen_77',
      reporterName: 'Jane Doe',
      verificationCount: 12,
      upvotes: 34,
      createdTime: now,
      updatedTime: now,
    },
    {
      id: 'ISS-002',
      title: 'Broken street light on FC Road',
      description: 'Street light pole #247 has been non-functional for 3 weeks. The area becomes very dark at night.',
      imageUrl: '',
      location: { latitude: 18.5250, longitude: 73.8410, address: 'FC Road, Near Goodluck Chowk, Pune' },
      aiAnalysis: { category: 'Street Lighting', visionConfidence: 0.91, extractedKeywords: ['street light', 'broken', 'dark', 'safety'] },
      severity: 3,
      priorityScore: 72,
      priorityReasons: ['Safety concern', 'Pedestrian area'],
      department: 'Electrical & Lighting',
      status: 'Submitted',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
        { status: 'Verified', timestamp: now, note: 'AI verified with 91% confidence' },
      ],
      reporterId: 'usr_citizen_77',
      reporterName: 'Jane Doe',
      verificationCount: 8,
      upvotes: 19,
      createdTime: now,
      updatedTime: now,
    },
    {
      id: 'ISS-003',
      title: 'Garbage overflow at Kothrud bus stop',
      description: 'Municipal garbage bin has been overflowing for 4 days. Waste spilling onto sidewalk.',
      imageUrl: '',
      location: { latitude: 18.5074, longitude: 73.8077, address: 'Kothrud Bus Stop, Pune' },
      aiAnalysis: { category: 'Waste Management', visionConfidence: 0.97, extractedKeywords: ['garbage', 'overflow', 'waste', 'sanitation'] },
      severity: 3,
      priorityScore: 78,
      priorityReasons: ['Health hazard', 'Public area'],
      department: 'Sanitation & Waste',
      status: 'Submitted',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
      ],
      reporterId: 'usr_citizen_22',
      reporterName: 'Rahul Patil',
      verificationCount: 5,
      upvotes: 27,
      createdTime: now,
      updatedTime: now,
    },
    {
      id: 'ISS-004',
      title: 'Water pipeline leak near Swargate',
      description: 'Major water leak from underground pipeline on the main road. Water flooding the street.',
      imageUrl: '',
      location: { latitude: 18.5018, longitude: 73.8636, address: 'Swargate Main Road, Pune' },
      aiAnalysis: { category: 'Water Supply', visionConfidence: 0.89, extractedKeywords: ['water leak', 'pipeline', 'flooding', 'infrastructure'] },
      severity: 5,
      priorityScore: 95,
      priorityReasons: ['Critical infrastructure', 'Water wastage', 'Traffic disruption', 'Urgent'],
      department: 'Water Supply',
      status: 'In Progress',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
        { status: 'Verified', timestamp: now, note: 'AI verified with 89% confidence' },
        { status: 'In Progress', timestamp: now, note: 'Emergency team dispatched' },
      ],
      reporterId: 'usr_citizen_22',
      reporterName: 'Rahul Patil',
      verificationCount: 21,
      upvotes: 56,
      createdTime: now,
      updatedTime: now,
    },
    {
      id: 'ISS-005',
      title: 'Damaged footpath tiles on JM Road',
      description: 'Multiple footpath tiles are broken and raised, creating a tripping hazard for pedestrians.',
      imageUrl: '',
      location: { latitude: 18.5234, longitude: 73.8456, address: 'JM Road, Near Sambhaji Park, Pune' },
      aiAnalysis: { category: 'Footpath & Sidewalk', visionConfidence: 0.86, extractedKeywords: ['footpath', 'broken tiles', 'tripping hazard'] },
      severity: 2,
      priorityScore: 54,
      priorityReasons: ['Pedestrian safety', 'Accessibility issue'],
      department: 'Roads & Infrastructure',
      status: 'Resolved',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
        { status: 'In Progress', timestamp: now, note: 'Repair crew assigned' },
        { status: 'Resolved', timestamp: now, note: 'Tiles replaced and leveled' },
      ],
      reporterId: 'usr_citizen_77',
      reporterName: 'Jane Doe',
      verificationCount: 3,
      upvotes: 11,
      createdTime: now,
      updatedTime: now,
    },
    {
      id: 'ISS-006',
      title: 'Illegal construction blocking drainage on Karve Road',
      description: 'Unauthorized construction material dumped near storm drain. Blocked, posing flood risk.',
      imageUrl: '',
      location: { latitude: 18.5012, longitude: 73.8170, address: 'Karve Road, Deccan Gymkhana, Pune' },
      aiAnalysis: { category: 'Drainage & Flooding', visionConfidence: 0.82, extractedKeywords: ['drainage', 'blocked', 'construction', 'flood risk'] },
      severity: 4,
      priorityScore: 83,
      priorityReasons: ['Monsoon risk', 'Flood hazard', 'Illegal activity'],
      department: 'Drainage & Stormwater',
      status: 'Submitted',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
      ],
      reporterId: 'usr_citizen_33',
      reporterName: 'Anjali Sharma',
      verificationCount: 7,
      upvotes: 42,
      createdTime: now,
      updatedTime: now,
    },
  ];

  if (filters.reporterId) {
    return issues.filter(i => i.reporterId === filters.reporterId);
  }
  if (filters.status) {
    return issues.filter(i => i.status === filters.status);
  }
  return issues;
}

function mockCreateIssue(payload) {
  const id = 'ISS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const now = new Date().toISOString();
  
  // Simulate AI analysis
  const categories = ['Road Damage', 'Street Lighting', 'Waste Management', 'Water Supply', 'Drainage & Flooding'];
  const departments = ['Roads & Infrastructure', 'Electrical & Lighting', 'Sanitation & Waste', 'Water Supply', 'Drainage & Stormwater'];
  const catIdx = Math.floor(Math.random() * categories.length);

  return {
    id,
    title: payload.title || 'Civic Issue Report',
    description: payload.description || '',
    imageUrl: payload.imageUrl || '',
    location: { latitude: payload.latitude, longitude: payload.longitude },
    aiAnalysis: {
      category: categories[catIdx],
      visionConfidence: +(0.8 + Math.random() * 0.15).toFixed(2),
      extractedKeywords: ['infrastructure', 'civic issue', 'maintenance'],
    },
    severity: Math.floor(Math.random() * 3) + 2,
    priorityScore: Math.floor(Math.random() * 40) + 50,
    priorityReasons: ['AI auto-classified'],
    department: departments[catIdx],
    status: 'Submitted',
    timeline: [
      { status: 'Submitted', timestamp: now, note: 'Issue reported by citizen' },
      { status: 'Verified', timestamp: now, note: 'AI verified' },
    ],
    reporterId: 'usr_citizen_77',
    reporterName: 'Jane Doe',
    verificationCount: 1,
    upvotes: 0,
    createdTime: now,
    updatedTime: now,
  };
}

function getMockStats() {
  return {
    totalIssues: 6,
    statusBreakdown: { 'Submitted': 3, 'In Progress': 2, 'Resolved': 1 },
    categoryBreakdown: {
      'Road Damage': 1, 'Street Lighting': 1, 'Waste Management': 1,
      'Water Supply': 1, 'Footpath & Sidewalk': 1, 'Drainage & Flooding': 1,
    },
    departmentBreakdown: {
      'Roads & Infrastructure': 2, 'Electrical & Lighting': 1,
      'Sanitation & Waste': 1, 'Water Supply': 1, 'Drainage & Stormwater': 1,
    },
    avgSeverity: 3.5,
    avgPriority: 78.2,
    resolvedRate: 16.7,
  };
}

function getMockLeaderboard() {
  return [
    { id: 'usr_citizen_22', name: 'Rahul Patil', xp: 620, issuesReported: 5, issuesResolved: 3, badges: ['First Report', 'Water Guardian', 'Top Reporter', 'Streak 14'] },
    { id: 'usr_citizen_55', name: 'Priya Kulkarni', xp: 510, issuesReported: 4, issuesResolved: 2, badges: ['First Report', 'Night Owl', 'Streak 7'] },
    { id: 'usr_citizen_77', name: 'Jane Doe', xp: 450, issuesReported: 3, issuesResolved: 1, badges: ['First Report', 'Road Warrior', 'Streak 7'] },
    { id: 'usr_citizen_33', name: 'Anjali Sharma', xp: 380, issuesReported: 2, issuesResolved: 1, badges: ['First Report', 'Eco Warrior'] },
    { id: 'usr_citizen_44', name: 'Vikram Deshmukh', xp: 290, issuesReported: 2, issuesResolved: 0, badges: ['First Report'] },
  ];
}
