const DB_KEY = 'hirewell_mock_db';

const defaultData = () => ({
  user: { name: 'Sara Abraham', role: 'Senior Recruiter', email: 'sara.a@hirewell.ai', initials: 'SA' },
  theme: 'light',
  jd: null,
  candidates: [],
  results: [],
  appointments: [
    { id: 1, date: 24, time: '10:00 AM', title: 'Technical Round 1', candidateId: 'A3', type: 'Video Call', duration: '45m' },
    { id: 2, date: 24, time: '11:30 AM', title: 'System Design Review', candidateId: 'A2', type: 'Video Call', duration: '60m' },
    { id: 3, date: 24, time: '02:00 PM', title: 'Culture Fit Chat', candidateId: 'A1', type: 'Video Call', duration: '30m' },
    { id: 4, date: 25, time: '10:00 AM', title: 'Final Debrief', candidateId: 'Internal Team', type: 'Meeting', duration: '30m' },
  ]
});

export const MockDB = {
  get: () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : defaultData();
  },

  save: (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  reset: () => {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData()));
  },

  updateJD: (jd) => {
    const data = MockDB.get();
    
    // Simulate extraction logic
    const skillsList = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'System Design', 'Leadership', 'Communication', 'Strategic Planning', 'Agile', 'SQL', 'NoSQL', 'TypeScript'];
    const extractedCompetencies = skillsList.filter(s => jd.jd.toLowerCase().includes(s.toLowerCase()));
    
    // If not enough skills found, add some defaults from the title
    if (extractedCompetencies.length < 4) {
      if (jd.title.toLowerCase().includes('engineer')) extractedCompetencies.push('System Design', 'Algorithms');
      if (jd.title.toLowerCase().includes('manager')) extractedCompetencies.push('Team Leadership', 'Strategic Planning');
    }

    const extractionData = {
      match: Math.floor(85 + Math.random() * 14),
      competencies: [...new Set(extractedCompetencies)].slice(0, 7),
      secondaryTraits: ['Public Speaking', 'Mentorship', 'Open Source'].slice(0, 3),
      exclusionRules: ['Contract Only', 'No Cloud Exp', 'Relocation Only'].slice(0, 3)
    };

    data.jd = { ...jd, extraction: extractionData };
    MockDB.save(data);
  },

  addCandidate: (file) => {
    // Read file as base64 string for later parsing
    const reader = new FileReader();
    const data = MockDB.get();
    
    // Improved ID generation to avoid collisions after deletion
    const maxId = (data.candidates || []).reduce((max, c) => {
      const num = parseInt(c.id.replace('A', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    
    const newCand = {
      id: `A${maxId + 1}`,
      name: file.name,
      status: 'Ready',
      score: 0,
      aiUsage: 0,
      skills: [],
      isReal: true,
      size: (file.size / 1024).toFixed(1) + ' KB',
      stage: 'Uploaded',
      taskScore: null,
      taskStatus: 'Pending',
      onboardingProgress: 0,
      onboardingStatus: 'Not Started',
      interviewScore: null,
      contentBase64: '' // will be set after reading
    };
    return new Promise((resolve) => {
      // Async read – store result then resolve
      reader.onload = () => {
        newCand.contentBase64 = reader.result.split(',')[1]; // strip DataURL prefix
        data.candidates.push(newCand);
        MockDB.save(data);
        resolve(newCand);
      };
      reader.readAsDataURL(file);
    });
  },

  processCandidate: (id, score, aiUsage, skills, isReal) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      cand.score = score;
      cand.aiUsage = aiUsage;
      cand.skills = skills;
      cand.isReal = isReal;
      cand.status = 'Processed';
      cand.stage = 'Screened';
    }
    MockDB.save(data);
  },

  // Assign interview task to a candidate
  assignTask: (candidateId, taskTitle) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.taskStatus = 'Assigned';
      cand.taskTitle = taskTitle;
      cand.stage = 'Task Assigned';
    }
    MockDB.save(data);
  },

  // Submit and score an interview task
  submitTask: (candidateId, taskScore) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.taskScore = taskScore;
      cand.taskStatus = 'Evaluated';
      cand.stage = 'Task Done';
      // Recalculate composite score
      const resumeScore = parseFloat(cand.score) || 0;
      cand.compositeScore = ((resumeScore * 0.6) + (taskScore * 0.4)).toFixed(1);
    }
    MockDB.save(data);
  },

  // Save interview result
  saveInterviewResult: (candidateId, interviewScore) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.interviewScore = interviewScore;
      cand.stage = 'Interviewed';
      const resumeScore = parseFloat(cand.score) || 0;
      const taskScore = parseFloat(cand.taskScore) || resumeScore;
      cand.compositeScore = ((resumeScore * 0.4) + (taskScore * 0.3) + (interviewScore * 0.3)).toFixed(1);
    }
    MockDB.save(data);
  },

  // Advance candidate to onboarding
  startOnboarding: (candidateId) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.stage = 'Onboarding';
      cand.onboardingStatus = 'In Progress';
      cand.onboardingProgress = 10;
    }
    MockDB.save(data);
  },

  // Update onboarding progress
  updateOnboarding: (candidateId, progress, status) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.onboardingProgress = progress;
      cand.onboardingStatus = status;
      if (progress >= 100) {
        cand.stage = 'Hired';
        cand.onboardingStatus = 'Complete';
      }
    }
    MockDB.save(data);
  },

  rejectCandidate: (id) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      cand.stage = 'Rejected';
      cand.status = 'Rejected';
    }
    MockDB.save(data);
  },

  holdCandidate: (id) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      cand.stage = 'On Hold';
      cand.status = 'Hold';
    }
    MockDB.save(data);
  },

  removeCandidate: (id) => {
    const data = MockDB.get();
    data.candidates = data.candidates.filter(c => c.id !== id);
    MockDB.save(data);
  },

  getShortlist: () => {
    const data = MockDB.get();
    return data.candidates
      .filter(c => ['Processed', 'Rejected', 'Hold'].includes(c.status) && c.isReal)
      .sort((a, b) => parseFloat(b.compositeScore || b.score) - parseFloat(a.compositeScore || a.score));
  },

  // Update an existing candidate's fields (e.g., resumeText)
  updateCandidate: (id, updates) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      Object.assign(cand, updates);
    }
    MockDB.save(data);
  },

  addAppointment: (appointment) => {
    const data = MockDB.get();
    if (!data.appointments) data.appointments = [];
    appointment.id = Date.now();
    data.appointments.push(appointment);
    data.appointments.sort((a, b) => a.time.localeCompare(b.time));
    MockDB.save(data);
  },

  deleteAppointment: (id) => {
    const data = MockDB.get();
    if (data.appointments) {
      data.appointments = data.appointments.filter(a => a.id !== id);
      MockDB.save(data);
    }
  },

  updateUser: (user) => {
    const data = MockDB.get();
    data.user = { ...data.user, ...user };
    if (user.name) {
      data.user.initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    MockDB.save(data);
  },

  setTheme: (theme) => {
    const data = MockDB.get();
    data.theme = theme;
    MockDB.save(data);
  }
};
