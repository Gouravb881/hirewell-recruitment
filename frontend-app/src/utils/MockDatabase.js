const DB_KEY = 'hirewell_mock_db';

const defaultData = () => ({
  user: { name: 'Sara Abraham', role: 'Senior Recruiter', email: 'sara.a@hirewell.ai', initials: 'SA' },
  theme: 'light',
  anonymization: {
    name: true, institution: true, gradYear: true, gender: true, location: true, links: true, photo: true
  },
  weights: {
    technical: 40, communication: 20, experience: 15, alignment: 10, trajectory: 10, culture: 5
  },
  activeJob: {
    id: 1,
    title: 'Senior UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    status: 'Active',
    applicants: 124,
    description: `We are seeking a Senior UX Designer to lead the design of our product ecosystem. You will conduct user research, create wireframes and prototypes, build scalable design systems in Figma, and collaborate with product managers and engineers to deliver accessible, user-centered experiences.

Responsibilities:
- Lead end-to-end UX design processes
- Conduct user research and usability testing
- Build and maintain design systems in Figma
- Collaborate with cross-functional teams
- Ensure designs meet WCAG accessibility standards

Requirements:
- 5+ years of UX/Product Design experience
- Strong portfolio of digital product design work
- Expertise in Figma, user research, and prototyping
- Knowledge of React and front-end collaboration
- Understanding of accessibility and UX best practices`,
    postedDate: '2024-03-01'
  },
  candidates: [
    {
      id: 'A1',
      name: 'Alex Rivers',
      email: 'alex.rivers@email.com',
      role: 'Senior UX Designer',
      status: 'Shortlist',
      stage: 'Screened',
      score: 94,
      file_name: 'Alex_Rivers_Senior_UX.pdf',
      applied_date: '2024-03-02',
      match_details: {
        skills: ['Figma', 'Prototyping', 'Accessibility', 'UX Research', 'Design Systems'],
        experience: '8 Years',
        missing: []
      }
    },
    {
      id: 'A2',
      name: 'Jordan Lee',
      email: 'jordan.lee@email.com',
      role: 'Senior UX Designer',
      status: 'Review',
      stage: 'Screened',
      score: 72,
      file_name: 'Jordan_Lee_Designer.pdf',
      applied_date: '2024-03-03',
      match_details: {
        skills: ['Figma', 'UI Design', 'Photoshop'],
        experience: '3 Years',
        missing: ['Accessibility', 'UX Research Metrics']
      }
    },
    {
      id: 'A3',
      name: 'Pat Smith',
      email: 'pat.smith@email.com',
      role: 'Senior UX Designer',
      status: 'Rejected',
      stage: 'Rejected',
      score: 38,
      file_name: 'Pat_Smith_Print_Manager.pdf',
      applied_date: '2024-03-04',
      match_details: {
        skills: ['Printing', 'Customer Service', 'Excel'],
        experience: '9 Years (Print)',
        missing: ['UX Design', 'Figma', 'Prototyping']
      }
    }
  ],
  results: [
    { candidate_id: 'A1', final_score: 94, decision: 'Shortlist', confidence_score: 98, confidence_label: 'High', explainability: { missing: [] } },
    { candidate_id: 'A2', final_score: 72, decision: 'Review', confidence_score: 88, confidence_label: 'Medium', explainability: { missing: ['Accessibility Standards', 'UX Research Metrics'] } },
    { candidate_id: 'A3', final_score: 38, decision: 'Reject', confidence_score: 95, confidence_label: 'High', explainability: { missing: ['Figma', 'Product Strategy', 'UX/Product Design Experience', 'Digital Product Portfolio'] } }
  ],
  appointments: [
    { id: 1, date: 24, time: '10:00 AM', title: 'Technical Interview', candidateId: 'A1', type: 'Video Call', duration: '60m' },
    { id: 2, date: 24, time: '11:30 AM', title: 'Portfolio Review', candidateId: 'A2', type: 'Video Call', duration: '45m' },
  ]
});

export const MockDB = {
  get: () => {
    const data = localStorage.getItem(DB_KEY);
    const parsed = data ? JSON.parse(data) : defaultData();
    
    // FORCE SYNC demo results to screeningResults cache only if names match
    const savedResults = localStorage.getItem("screeningResults");
    let currentMatches = savedResults ? JSON.parse(savedResults) : [];
    
    const demoResults = [
      { id: 'A1', name: 'Alex Rivers', score: 94, decision: 'Shortlist' },
      { id: 'A2', name: 'Jordan Lee', score: 72, decision: 'Review' },
      { id: 'A3', name: 'Pat Smith', score: 38, decision: 'Reject' }
    ];

    demoResults.forEach(demo => {
      const actualCand = (parsed.candidates || []).find(c => String(c.id) === String(demo.id));
      // Only force the score if the name also matches the demo candidate
      if (actualCand && actualCand.name?.toLowerCase().includes(demo.name.toLowerCase())) {
        const idx = currentMatches.findIndex(m => String(m.candidate_id) === String(demo.id));
        const resultObj = {
          candidate_id: demo.id,
          final_score: demo.score,
          decision: demo.decision,
          confidence_score: 95,
          explainability: { missing: demo.score < 50 ? ['Domain Alignment'] : [] }
        };
        if (idx !== -1) currentMatches[idx] = resultObj;
        else currentMatches.push(resultObj);
      }
    });

    localStorage.setItem("screeningResults", JSON.stringify(currentMatches));
    
    return parsed;
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

  addCandidate: (file, extractedText = '') => {
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
      type: file.type || 'application/octet-stream',
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
      contentBase64: '',
      resumeText: extractedText,
      isMedia: file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')
    };
    return new Promise((resolve) => {
      reader.onload = () => {
        newCand.contentBase64 = reader.result.split(',')[1];
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

  updateCandidateStatus: (id, status) => {
    const data = MockDB.get();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      cand.status = status;
      // Map status to stage for consistency
      if (status === 'Shortlist') cand.stage = 'Screened';
      else if (status === 'Interviewed') cand.stage = 'Interviewed';
      else if (status === 'Rejected') cand.stage = 'Rejected';
      else if (status === 'Hold') cand.stage = 'On Hold';
      
      // Also update screeningResults cache if it exists
      const savedResults = localStorage.getItem("screeningResults");
      if (savedResults) {
        const results = JSON.parse(savedResults);
        const matchIdx = results.findIndex(m => String(m.candidate_id) === String(id));
        if (matchIdx !== -1) {
          results[matchIdx].decision = status;
          localStorage.setItem("screeningResults", JSON.stringify(results));
        }
      }
    }
    MockDB.save(data);
  },

  deleteCandidate: (id) => {
    console.log(`Attempting to delete candidate with ID: ${id}`);
    const data = MockDB.get();
    const initialCount = data.candidates.length;
    data.candidates = data.candidates.filter(c => String(c.id) !== String(id));
    
    if (data.candidates.length === initialCount) {
      console.warn(`No candidate found with ID ${id} to delete.`);
    } else {
      console.log(`Successfully deleted candidate ${id}. New count: ${data.candidates.length}`);
    }
    
    // Also clean up from screeningResults
    const savedResults = localStorage.getItem("screeningResults");
    if (savedResults) {
      const results = JSON.parse(savedResults);
      const filteredResults = results.filter(m => String(m.candidate_id) !== String(id));
      localStorage.setItem("screeningResults", JSON.stringify(filteredResults));
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

  updateSettings: (settings) => {
    const data = MockDB.get();
    if (settings.anonymization) data.anonymization = settings.anonymization;
    if (settings.weights) data.weights = settings.weights;
    MockDB.save(data);
  },

  setTheme: (theme) => {
    const data = MockDB.get();
    data.theme = theme;
    MockDB.save(data);
  }
};
