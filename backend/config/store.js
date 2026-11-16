import bcrypt from 'bcryptjs';

// Pre-hashed passwords for 'student123' and 'admin123'
const STUDENT_HASH = bcrypt.hashSync('student123', 10);
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);

export const initialSubjects = [
  {
    _id: '65f3c1111111111111111101',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    department: 'Computer Science & Engineering',
    semester: 3,
    description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Dynamic Programming',
    icon: 'Layers',
  },
  {
    _id: '65f3c1111111111111111102',
    name: 'Database Management Systems',
    code: 'CS202',
    department: 'Computer Science & Engineering',
    semester: 4,
    description: 'Relational algebra, SQL, Normalization, Transactions, Concurrency & NoSQL',
    icon: 'Database',
  },
  {
    _id: '65f3c1111111111111111103',
    name: 'Operating Systems',
    code: 'CS203',
    department: 'Computer Science & Engineering',
    semester: 4,
    description: 'Process management, Threads, CPU scheduling, Memory management & File systems',
    icon: 'Cpu',
  },
  {
    _id: '65f3c1111111111111111104',
    name: 'Computer Networks',
    code: 'CS301',
    department: 'Computer Science & Engineering',
    semester: 5,
    description: 'OSI & TCP/IP layers, Routing algorithms, Transport protocols, DNS & Network Security',
    icon: 'Network',
  },
  {
    _id: '65f3c1111111111111111105',
    name: 'Web Technologies & Full Stack Dev',
    code: 'CS302',
    department: 'Information Technology',
    semester: 5,
    description: 'HTML5, CSS3, JavaScript ES6+, React, Node.js, Express & REST APIs',
    icon: 'Globe',
  },
  {
    _id: '65f3c1111111111111111106',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'CS401',
    department: 'Artificial Intelligence & Data Science',
    semester: 6,
    description: 'Supervised & Unsupervised learning, Neural Networks, Regression, Classification & NLP',
    icon: 'Sparkles',
  },
  {
    _id: '65f3c1111111111111111107',
    name: 'Software Engineering & Project Management',
    code: 'CS304',
    department: 'Computer Science & Engineering',
    semester: 6,
    description: 'Agile methodologies, SDLC, UML modeling, Testing, CI/CD & Design patterns',
    icon: 'CheckSquare',
  },
  {
    _id: '65f3c1111111111111111108',
    name: 'Digital Electronics & Logic Design',
    code: 'EC201',
    department: 'Electronics & Communication',
    semester: 3,
    description: 'Logic gates, Karnaugh maps, Combinational & Sequential circuits, Flip-flops',
    icon: 'Zap',
  },
];

export const initialUsers = [
  {
    _id: '65f1a1111111111111111101',
    name: 'Alex Johnson',
    email: 'student@studyhub.edu',
    password: STUDENT_HASH,
    role: 'student',
    department: 'Computer Science & Engineering',
    semester: 4,
    bio: 'CS student focusing on algorithms, full-stack development, and competitive programming.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bookmarks: ['65f2b1111111111111111101', '65f2b1111111111111111102'],
    createdAt: new Date('2025-01-10T10:00:00Z'),
  },
  {
    _id: '65f1a1111111111111111102',
    name: 'Dr. Sarah Mitchell',
    email: 'admin@studyhub.edu',
    password: ADMIN_HASH,
    role: 'admin',
    department: 'Computer Science & Engineering',
    semester: 8,
    bio: 'Platform Administrator & Faculty Coordinator for Student Academic Materials.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bookmarks: [],
    createdAt: new Date('2025-01-01T08:00:00Z'),
  },
];

export const initialResources = [
  {
    _id: '65f2b1111111111111111100',
    title: 'Operating Systems Unit 3: Deadlocks, Banker Algorithm & RAG',
    description: 'Complete classroom lecture notes covering Deadlock definition, 4 necessary conditions, Resource Allocation Graph with Tape Drive & Printer example, Banker Avoidance Algorithm, and recovery methods.',
    department: 'Computer Science & Engineering',
    semester: 4,
    subject: 'Operating Systems',
    subjectCode: 'CS203',
    category: 'Handwritten Notes',
    fileUrl: '/uploads/sample_os_unit3_deadlock.pdf',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    originalFileName: 'OS_Unit3_Deadlocks_Complete_Notes.pdf',
    externalLink: '',
    tags: ['OperatingSystems', 'Deadlock', 'BankersAlgorithm', 'RAG', 'Unit3'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 780,
    views: 2950,
    rating: 5.0,
    totalRatings: 62,
    createdAt: new Date('2025-02-22T10:00:00Z'),
  },
  {
    _id: '65f2b1111111111111111101',
    title: 'Complete Hand-Written Notes: Trees, Binary Search & Graphs',
    description: 'Comprehensive, color-coded classroom notes covering AVL Trees, Red-Black Trees, BFS/DFS traversal with solved university exam problems and complexity analysis.',
    department: 'Computer Science & Engineering',
    semester: 3,
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS201',
    category: 'Handwritten Notes',
    fileUrl: '/uploads/sample_dsa_handwritten_notes.pdf',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    originalFileName: 'DSA_Tree_Graph_Comprehensive_Notes.pdf',
    externalLink: '',
    tags: ['DSA', 'Trees', 'Graphs', 'Handwritten', 'ExamPrep'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 342,
    views: 1280,
    rating: 4.9,
    totalRatings: 38,
    createdAt: new Date('2025-02-15T11:20:00Z'),
  },
  {
    _id: '65f2b1111111111111111102',
    title: 'DBMS End-Semester Question Papers (2020 - 2024 Solved)',
    description: 'Collection of the last 5 years university end-semester question papers with detailed step-by-step SQL solutions, normalization proofs up to BCNF, and ER diagrams.',
    department: 'Computer Science & Engineering',
    semester: 4,
    subject: 'Database Management Systems',
    subjectCode: 'CS202',
    category: 'Previous Year Papers',
    fileUrl: '/uploads/sample_dbms_pyq_papers.pdf',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    originalFileName: 'DBMS_University_Papers_2020_2024_Solved.pdf',
    externalLink: '',
    tags: ['DBMS', 'SQL', 'PYQ', 'SolvedPapers', 'Semester4'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 512,
    views: 2190,
    rating: 4.8,
    totalRatings: 45,
    createdAt: new Date('2025-02-20T14:45:00Z'),
  },
  {
    _id: '65f2b1111111111111111103',
    title: 'Operating Systems Complete Lab Manual & Shell Scripts',
    description: 'Official university lab manual containing all 12 OS lab experiments: fork(), pthread multithreading, CPU scheduling algorithms in C, Banker algorithm, and memory paging simulations.',
    department: 'Computer Science & Engineering',
    semester: 4,
    subject: 'Operating Systems',
    subjectCode: 'CS203',
    category: 'Lab Manuals',
    fileUrl: '/uploads/sample_os_lab_manual.pdf',
    fileType: 'pdf',
    fileSize: '2.6 MB',
    originalFileName: 'OS_Lab_Manual_Full_Code.pdf',
    externalLink: '',
    tags: ['OS', 'LabManual', 'Linux', 'C-Programs', 'Multithreading'],
    uploadedBy: '65f1a1111111111111111102',
    uploaderName: 'Dr. Sarah Mitchell',
    status: 'approved',
    downloads: 289,
    views: 940,
    rating: 4.7,
    totalRatings: 24,
    createdAt: new Date('2025-01-18T09:15:00Z'),
  },
  {
    _id: '65f2b1111111111111111104',
    title: 'Computer Networks TCP/IP & OSI Layer Master Slides',
    description: 'Professor presentation slides with intuitive diagrams illustrating packet routing, subnetting, CIDR calculation, TCP 3-way handshake, and SSL/TLS handshake.',
    department: 'Computer Science & Engineering',
    semester: 5,
    subject: 'Computer Networks',
    subjectCode: 'CS301',
    category: 'PPT Slides',
    fileUrl: '/uploads/sample_cn_presentation_slides.pdf',
    fileType: 'pdf',
    fileSize: '6.1 MB',
    originalFileName: 'CN_Lecture_Slides_Full_Course.pdf',
    externalLink: '',
    tags: ['Networks', 'TCP/IP', 'Slides', 'Subnetting', 'Security'],
    uploadedBy: '65f1a1111111111111111102',
    uploaderName: 'Dr. Sarah Mitchell',
    status: 'approved',
    downloads: 195,
    views: 650,
    rating: 4.6,
    totalRatings: 18,
    createdAt: new Date('2025-02-05T16:00:00Z'),
  },
  {
    _id: '65f2b1111111111111111105',
    title: 'MERN Stack Quick-Start Reference & REST API Architecture',
    description: 'Handy cheat-sheet and architecture guide for building production REST APIs using Express.js, MongoDB Mongoose ODM, JWT Authentication, and React frontend hooks.',
    department: 'Information Technology',
    semester: 5,
    subject: 'Web Technologies & Full Stack Dev',
    subjectCode: 'CS302',
    category: 'Tutorials & Code',
    fileUrl: '/uploads/sample_mern_guide.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    originalFileName: 'FullStack_MERN_CheatSheet.pdf',
    externalLink: 'https://github.com/studyhub/mern-quickstart',
    tags: ['WebDev', 'React', 'NodeJS', 'Express', 'MERN'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 410,
    views: 1530,
    rating: 4.9,
    totalRatings: 32,
    createdAt: new Date('2025-02-12T13:30:00Z'),
  },
  {
    _id: '65f2b1111111111111111106',
    title: 'Machine Learning Formulas, Proofs & Model Cheatsheet',
    description: 'A 20-page condensed formula reference covering cost functions, gradient descent variants, backpropagation matrix derivations, SVM kernels, and evaluation metrics (ROC-AUC, F1).',
    department: 'Artificial Intelligence & Data Science',
    semester: 6,
    subject: 'Artificial Intelligence & Machine Learning',
    subjectCode: 'CS401',
    category: 'Syllabus & Reference',
    fileUrl: '/uploads/sample_ml_cheatsheet.pdf',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    originalFileName: 'ML_Math_Formulas_Cheatsheet.pdf',
    externalLink: '',
    tags: ['MachineLearning', 'AI', 'Formulas', 'Math', 'DataScience'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 620,
    views: 2400,
    rating: 5.0,
    totalRatings: 56,
    createdAt: new Date('2025-01-25T17:10:00Z'),
  },
  {
    _id: '65f2b1111111111111111107',
    title: 'Digital Electronics Karnaugh Map & Sequential Circuit Guide',
    description: 'Concise lecture notes with 50+ worked examples of 4-variable and 5-variable K-maps, race-around conditions, master-slave flip-flops, and counter design.',
    department: 'Electronics & Communication',
    semester: 3,
    subject: 'Digital Electronics & Logic Design',
    subjectCode: 'EC201',
    category: 'Handwritten Notes',
    fileUrl: '/uploads/sample_digital_electronics.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    originalFileName: 'Digital_Circuits_KMap_Guide.pdf',
    externalLink: '',
    tags: ['Electronics', 'KMap', 'Circuits', 'LogicGates'],
    uploadedBy: '65f1a1111111111111111101',
    uploaderName: 'Alex Johnson',
    status: 'approved',
    downloads: 145,
    views: 480,
    rating: 4.5,
    totalRatings: 12,
    createdAt: new Date('2025-02-01T10:05:00Z'),
  },
  {
    _id: '65f2b1111111111111111108',
    title: 'Agile & Scrum Software Development Cycle Case Study',
    description: 'Detailed industrial case study following a sprint cycle, user story estimation using Fibonacci points, burn-down charts, and sprint retrospective templates.',
    department: 'Computer Science & Engineering',
    semester: 6,
    subject: 'Software Engineering & Project Management',
    subjectCode: 'CS304',
    category: 'PPT Slides',
    fileUrl: '/uploads/sample_agile_case_study.pdf',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    originalFileName: 'Software_Engineering_Agile_CaseStudy.pdf',
    externalLink: '',
    tags: ['Agile', 'Scrum', 'SDLC', 'ProjectManagement'],
    uploadedBy: '65f1a1111111111111111102',
    uploaderName: 'Dr. Sarah Mitchell',
    status: 'pending', // Pending submission to demonstrate admin approval!
    downloads: 18,
    views: 85,
    rating: 4.8,
    totalRatings: 4,
    createdAt: new Date('2025-02-26T09:40:00Z'),
  },
];

export const initialReviews = [
  {
    _id: '65f4d1111111111111111101',
    resource: '65f2b1111111111111111101',
    user: '65f1a1111111111111111101',
    userName: 'Alex Johnson',
    rating: 5,
    comment: 'The AVL tree rotations diagrams are crystal clear. Helped me secure an A in my midterms!',
    createdAt: new Date('2025-02-16T12:00:00Z'),
  },
  {
    _id: '65f4d1111111111111111102',
    resource: '65f2b1111111111111111102',
    user: '65f1a1111111111111111101',
    userName: 'Alex Johnson',
    rating: 5,
    comment: 'Having the 5-year university paper solutions in one organized place saved at least 15 hours of study time.',
    createdAt: new Date('2025-02-21T18:20:00Z'),
  },
];

export const initialComments = [
  {
    _id: '65f5e1111111111111111101',
    resource: '65f2b1111111111111111101',
    user: '65f1a1111111111111111102',
    userName: 'Dr. Sarah Mitchell',
    content: 'Excellent handwritten notes! Page 14 has a very intuitive illustration of Dijkstra shortest path.',
    createdAt: new Date('2025-02-17T09:30:00Z'),
  },
];

export const initialReports = [
  {
    _id: '65f6f1111111111111111101',
    resource: '65f2b1111111111111111107',
    resourceTitle: 'Digital Electronics Karnaugh Map & Sequential Circuit Guide',
    reportedBy: '65f1a1111111111111111101',
    reporterName: 'Alex Johnson',
    reason: 'Incorrect Subject or Content',
    details: 'Small typo in truth table on slide 8 for JK flip-flop.',
    status: 'pending',
    createdAt: new Date('2025-02-24T15:00:00Z'),
  },
];

// Fallback in-memory database store
let usersStore = [...initialUsers];
let resourcesStore = [...initialResources];
let subjectsStore = [...initialSubjects];
let reviewsStore = [...initialReviews];
let commentsStore = [...initialComments];
let reportsStore = [...initialReports];

export const getRawFallbackUserById = (id) => {
  return usersStore.find((u) => u._id.toString() === id.toString());
};

export const getFallbackUserById = (id) => {
  const user = usersStore.find((u) => u._id.toString() === id.toString());
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const getFallbackUserByEmail = (email) => {
  return usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const createFallbackUser = (userData) => {
  const newUser = {
    _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 7),
    ...userData,
    bookmarks: [],
    createdAt: new Date(),
  };
  usersStore.push(newUser);
  const { password, ...safeUser } = newUser;
  return safeUser;
};

export const getFallbackResources = () => resourcesStore;
export const setFallbackResources = (list) => { resourcesStore = list; };
export const getFallbackSubjects = () => subjectsStore;
export const getFallbackReviews = () => reviewsStore;
export const getFallbackComments = () => commentsStore;
export const getFallbackReports = () => reportsStore;
export const getFallbackUsers = () => usersStore;
