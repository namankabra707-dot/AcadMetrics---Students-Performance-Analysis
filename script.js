/* ============================================================
   AcadMetrics — script.js
   Comparative Students Performance Analysis
   ============================================================ */

"use strict";

/* ── 1. CONSTANTS & DATA ────────────────────────────────────── */

/**
 * Degree → Semester count mapping
 */
const DEGREE_SEMESTERS = {
  btech_cse:  8,
  btech_ece:  8,
  btech_me:   8,
  btech_civil:8,
  bca:        6,
  bsc_cs:     6,
  bba:        6,
  mba:        4,
  mca:        6,
};

/**
 * Degree labels for display
 */
const DEGREE_LABELS = {
  btech_cse:  "B.Tech CSE",
  btech_ece:  "B.Tech ECE",
  btech_me:   "B.Tech ME",
  btech_civil:"B.Tech Civil",
  bca:        "BCA",
  bsc_cs:     "B.Sc. CS",
  bba:        "BBA",
  mba:        "MBA",
  mca:        "MCA",
};

/**
 * Subject pool: degree → semester → [subjects]
 */
const SUBJECT_POOL = {
  btech_cse: {
    1: ["Engineering Mathematics I","Physics","Engineering Chemistry","Programming in C","Engineering Graphics","Communication Skills"],
    2: ["Engineering Mathematics II","Basic Electronics","Data Structures","Object Oriented Programming","Digital Logic","Technical Writing"],
    3: ["Discrete Mathematics","Database Management","Computer Architecture","Operating Systems","Python Programming","Probability & Statistics"],
    4: ["Design & Analysis of Algorithms","Computer Networks","Software Engineering","Theory of Computation","Web Technologies","Mini Project"],
    5: ["Machine Learning","Compiler Design","Cloud Computing","Information Security","Mobile App Development","Open Elective I"],
    6: ["Artificial Intelligence","Distributed Systems","Big Data Analytics","Deep Learning","Program Elective I","Project Work I"],
    7: ["Internet of Things","Blockchain Technology","Natural Language Processing","Program Elective II","Open Elective II","Project Work II"],
    8: ["Capstone Project","Seminar","Industrial Training","Program Elective III","Internship"],
  },
  btech_ece: {
    1: ["Engineering Mathematics I","Physics","Chemistry","Basic Electronics","Engineering Drawing","Communication Skills"],
    2: ["Engineering Mathematics II","Signals & Systems","Circuit Theory","Electronic Devices","Digital Systems","Workshops"],
    3: ["Electromagnetic Theory","Analog Circuits","Digital Communication","Microprocessors","Control Systems","Probability Theory"],
    4: ["VLSI Design","Antenna Theory","Digital Signal Processing","Embedded Systems","Communication Networks","Mini Project"],
    5: ["Wireless Communication","Satellite Communication","Microwave Engineering","Image Processing","Optical Fiber","Open Elective I"],
    6: ["Advanced DSP","Radar Systems","RF Design","Power Electronics","Program Elective I","Project Work I"],
    7: ["5G Networks","IoT Systems","Robotics","Program Elective II","Open Elective II","Project Work II"],
    8: ["Capstone Project","Seminar","Industrial Training","Program Elective III"],
  },
  btech_me: {
    1: ["Engineering Mathematics I","Physics","Chemistry","Engineering Drawing","Workshop Practice","Communication Skills"],
    2: ["Engineering Mathematics II","Thermodynamics","Materials Science","Manufacturing Processes","Fluid Mechanics","Technical Writing"],
    3: ["Strength of Materials","Machine Design","Heat Transfer","Kinematics","Metrology","Industrial Training I"],
    4: ["Dynamics of Machinery","IC Engines","CNC Technology","CAD/CAM","Refrigeration","Mini Project"],
    5: ["Finite Element Analysis","Robotics","Quality Engineering","Operations Research","Elective I","Open Elective I"],
    6: ["Product Design","Industrial Management","Tribology","Automation","Elective II","Project Work I"],
    7: ["Advanced Manufacturing","Energy Systems","Computational Fluid Dynamics","Elective III","Open Elective II","Project Work II"],
    8: ["Capstone Project","Seminar","Industrial Training","Elective IV"],
  },
  bca: {
    1: ["Programming in C","Mathematics I","Digital Fundamentals","Communication Skills","IT Essentials","Computer Lab"],
    2: ["Data Structures","Mathematics II","Web Design","OOP with Java","DBMS","Computer Graphics"],
    3: ["Advanced Java","Operating Systems","Computer Networks","Software Engineering","Python","RDBMS Lab"],
    4: ["Android Development","Cloud Computing","Artificial Intelligence","Big Data","Cyber Security","Project I"],
    5: ["Machine Learning","Full Stack Development","DevOps","Elective I","Open Elective","Project II"],
    6: ["Capstone Project","Internship","Seminar","Elective II"],
  },
  bsc_cs: {
    1: ["Mathematics I","Computer Fundamentals","Programming in C","Physics","Communication Skills","Practical I"],
    2: ["Mathematics II","Data Structures","OOP Concepts","Statistics","Digital Logic","Practical II"],
    3: ["Database Systems","Operating Systems","Computer Networks","Algorithms","Web Technologies","Practical III"],
    4: ["Software Engineering","Java Programming","Computer Graphics","Theory of Computation","Open Elective I","Project I"],
    5: ["Machine Learning","Cloud Computing","Cyber Security","Elective I","Open Elective II","Project II"],
    6: ["Capstone Project","Internship","Elective II","Seminar"],
  },
  bba: {
    1: ["Principles of Management","Business Mathematics","Financial Accounting","Business Communication","Economics","Computer Basics"],
    2: ["Marketing Management","Business Statistics","Cost Accounting","Organizational Behavior","Business Law","Business Environment"],
    3: ["Human Resource Management","Financial Management","Operations Management","Research Methods","Elective I","Project I"],
    4: ["Strategic Management","Entrepreneurship","Supply Chain Management","International Business","Elective II","Project II"],
    5: ["Corporate Governance","Investment Management","Elective III","Open Elective","Industrial Training","Project III"],
    6: ["Capstone Project","Internship","Seminar","Elective IV"],
  },
  mba: {
    1: ["Managerial Economics","Accounting for Managers","Organizational Behavior","Statistics for Business","Marketing Management","Business Communication"],
    2: ["Financial Management","Human Resource Management","Operations Management","Research Methodology","Strategic Management","Business Ethics"],
    3: ["Elective I","Elective II","Elective III","Open Elective","Summer Internship Report","Project Work"],
    4: ["Strategic Management Capstone","Business Policy","Elective IV","Elective V","Dissertation","Viva Voce"],
  },
  mca: {
    1: ["Discrete Mathematics","Programming in C++","Database Management","Data Structures","Computer Organization","Communication Skills"],
    2: ["Advanced Java","Operating Systems","Computer Networks","Software Engineering","Python","DBMS Lab"],
    3: ["Machine Learning","Cloud Computing","Mobile Development","Algorithms","Web Services","Project I"],
    4: ["Artificial Intelligence","Big Data Analytics","Cyber Security","Elective I","Open Elective","Project II"],
    5: ["Deep Learning","DevOps","Elective II","Open Elective II","Industrial Training","Project III"],
    6: ["Capstone Project","Seminar","Internship","Elective III"],
  },
  btech_civil: {
    1: ["Engineering Mathematics I","Physics","Chemistry","Engineering Drawing","Workshop","Communication Skills"],
    2: ["Engineering Mathematics II","Surveying","Building Materials","Strength of Materials","Fluid Mechanics","Technical Writing"],
    3: ["Structural Analysis","Geotechnical Engineering","Concrete Technology","Transportation Engineering","Hydrology","Lab I"],
    4: ["Design of Steel Structures","Design of RCC","Environmental Engineering","Foundation Engineering","Mini Project","Elective I"],
    5: ["Advanced Structural Analysis","Construction Management","Urban Planning","Elective II","Open Elective","Project I"],
    6: ["Earthquake Engineering","Water Resources","Elective III","Open Elective II","Industrial Training","Project II"],
    7: ["Capstone Project","Advanced Topics","Elective IV","Seminar"],
    8: ["Thesis","Internship","Elective V","Viva Voce"],
  },
};

/**
 * Grading scale: marks → { grade, points, color }
 */
const GRADE_SCALE = [
  { min: 90, grade: "O",  points: 10, cls: "o"  },
  { min: 80, grade: "A+", points: 9,  cls: "ap" },
  { min: 70, grade: "A",  points: 8,  cls: "a"  },
  { min: 60, grade: "B+", points: 7,  cls: "bp" },
  { min: 50, grade: "B",  points: 6,  cls: "b"  },
  { min: 40, grade: "C",  points: 5,  cls: "c"  },
  { min: 0,  grade: "F",  points: 0,  cls: "f"  },
];

/**
 * Chart colors palette
 */
const CHART_COLORS = [
  "#f0b429", "#30d5a0", "#4d9fff", "#a78bfa",
  "#ff5c6a", "#ffa94d", "#22d3ee", "#f472b6",
];

/* ── 2. STATE ────────────────────────────────────────────────── */

let students = []; // array of student objects
let activeStudentIndex = 0;

// Chart instances (to destroy before re-render)
let charts = {
  subjectBar:    null,
  gradeDonut:    null,
  radar:         null,
  cgpaCompare:   null,
  subjectOverlay:null,
};

/* ── 3. INIT ─────────────────────────────────────────────────── */

/**
 * Runs on page load
 */
function init() {
  loadFromLocalStorage();
  if (students.length === 0) {
    addStudent();
  } else {
    renderStudentTabs();
    loadStudentIntoForm(activeStudentIndex);
  }
}

/* ── 4. STUDENT MANAGEMENT ───────────────────────────────────── */

/**
 * Create a blank student object
 */
function createStudent(id) {
  return {
    id,
    name: "",
    degree: "",
    semester: "",
    numSubjects: 0,
    subjects: [],   // [{ name, marks }]
    cgpa: null,
  };
}

/**
 * Add a new student and switch to their tab
 */
function addStudent() {
  const id = Date.now();
  students.push(createStudent(id));
  activeStudentIndex = students.length - 1;
  renderStudentTabs();
  loadStudentIntoForm(activeStudentIndex);
}

/**
 * Remove a student by index
 */
function removeStudent(index) {
  if (students.length === 1) {
    // Reset instead of remove if only 1 left
    students[0] = createStudent(Date.now());
    loadStudentIntoForm(0);
    renderStudentTabs();
    return;
  }
  students.splice(index, 1);
  if (activeStudentIndex >= students.length) {
    activeStudentIndex = students.length - 1;
  }
  renderStudentTabs();
  loadStudentIntoForm(activeStudentIndex);
}

/**
 * Switch active student tab
 */
function switchStudent(index) {
  saveCurrentStudentData();
  activeStudentIndex = index;
  renderStudentTabs();
  loadStudentIntoForm(activeStudentIndex);
}

/**
 * Render the student tab strip
 */
function renderStudentTabs() {
  const container = document.getElementById("studentTabsScroll");
  container.innerHTML = "";
  students.forEach((s, i) => {
    const tab = document.createElement("button");
    tab.className = "student-tab" + (i === activeStudentIndex ? " active" : "");
    tab.innerHTML = `
      <span>${s.name || "Student " + (i + 1)}</span>
      <span class="student-tab-remove" onclick="event.stopPropagation(); removeStudent(${i})" title="Remove student">✕</span>
    `;
    tab.onclick = () => switchStudent(i);
    container.appendChild(tab);
  });

  // Update badge
  const badge = document.getElementById("activeStudentBadge");
  if (badge) {
    badge.textContent = students[activeStudentIndex]?.name || `Student ${activeStudentIndex + 1}`;
  }
}

/* ── 5. FORM LOAD / SAVE ─────────────────────────────────────── */

/**
 * Load a student's saved data into the form
 */
function loadStudentIntoForm(index) {
  const s = students[index];
  if (!s) return;

  // Name
  document.getElementById("studentName").value = s.name || "";

  // Degree
  const degreeEl = document.getElementById("degreeSelect");
  degreeEl.value = s.degree || "";

  // Semester (populate options first)
  if (s.degree) {
    populateSemesters(s.degree);
    document.getElementById("semesterSelect").value = s.semester || "";
    document.getElementById("semesterSelect").disabled = false;
  } else {
    document.getElementById("semesterSelect").innerHTML = "<option value=''>— Select —</option>";
    document.getElementById("semesterSelect").disabled = true;
  }

  // Number of subjects
  document.getElementById("numSubjects").value = s.numSubjects || "";

  // Subject fields
  if (s.subjects && s.subjects.length > 0) {
    generateSubjectFields(true);
  } else {
    document.getElementById("subjectFields").innerHTML = `
      <div class="subjects-placeholder">
        <div class="placeholder-icon">◫</div>
        <p>Select degree, semester, and number of subjects above to generate input fields.</p>
      </div>`;
    document.getElementById("cgpaPreview").style.display = "none";
    document.getElementById("subjectCountBadge").textContent = "0 subjects";
  }

  renderStudentTabs();
}

/**
 * Save current form values into the active student object
 */
function saveCurrentStudentData() {
  const s = students[activeStudentIndex];
  if (!s) return;

  s.name     = document.getElementById("studentName").value.trim();
  s.degree   = document.getElementById("degreeSelect").value;
  s.semester = document.getElementById("semesterSelect").value;
  s.numSubjects = parseInt(document.getElementById("numSubjects").value) || 0;

  // Save subject rows
  const rows = document.querySelectorAll(".subject-row");
  s.subjects = [];
  rows.forEach((row) => {
    const sel    = row.querySelector("select.subject-select");
    const input  = row.querySelector("input.marks-input");
    if (sel && input) {
      s.subjects.push({
        name:  sel.value,
        marks: parseFloat(input.value) || "",
      });
    }
  });

  // Recalculate CGPA
  s.cgpa = calculateCGPA(s.subjects);
}

/**
 * Shorthand called by oninput on name field
 */
function updateCurrentStudent() {
  students[activeStudentIndex].name = document.getElementById("studentName").value.trim();
  renderStudentTabs();
}

/* ── 6. DEGREE / SEMESTER CHANGE ─────────────────────────────── */

function onDegreeChange() {
  const degree = document.getElementById("degreeSelect").value;
  const semEl  = document.getElementById("semesterSelect");

  clearError("degreeError");

  if (!degree) {
    semEl.innerHTML = "<option value=''>— Select —</option>";
    semEl.disabled = true;
    return;
  }

  populateSemesters(degree);
  semEl.disabled = false;

  // Reset subjects
  document.getElementById("subjectFields").innerHTML = `
    <div class="subjects-placeholder">
      <div class="placeholder-icon">◫</div>
      <p>Now select a semester and specify the number of subjects.</p>
    </div>`;
  document.getElementById("cgpaPreview").style.display = "none";
  document.getElementById("subjectCountBadge").textContent = "0 subjects";
}

function populateSemesters(degree) {
  const semEl  = document.getElementById("semesterSelect");
  const count  = DEGREE_SEMESTERS[degree] || 8;
  semEl.innerHTML = "<option value=''>— Select —</option>";
  for (let i = 1; i <= count; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Semester ${i}`;
    semEl.appendChild(opt);
  }
}

function onSemesterChange() {
  clearError("semError");
  // Reset subject fields so user regenerates
  document.getElementById("subjectFields").innerHTML = `
    <div class="subjects-placeholder">
      <div class="placeholder-icon">◫</div>
      <p>Click "Generate Fields" to create subject input rows.</p>
    </div>`;
  document.getElementById("cgpaPreview").style.display = "none";
  document.getElementById("subjectCountBadge").textContent = "0 subjects";
}

function onNumSubjectsChange() {
  clearError("numSubjectsError");
}

/* ── 7. SUBJECT FIELD GENERATION ─────────────────────────────── */

/**
 * Generate subject input rows.
 * @param {boolean} restoring - if true, pre-fill from saved data
 */
function generateSubjectFields(restoring = false) {
  const degree  = document.getElementById("degreeSelect").value;
  const sem     = document.getElementById("semesterSelect").value;
  const numStr  = document.getElementById("numSubjects").value;
  const num     = parseInt(numStr);

  // Validate
  let hasError = false;
  if (!degree)         { showError("degreeError", "Please select a degree.");          hasError = true; }
  if (!sem)            { showError("semError",    "Please select a semester.");        hasError = true; }
  if (!num || num < 1) { showError("numSubjectsError", "Enter a number between 1–10."); hasError = true; }
  if (num > 10)        { showError("numSubjectsError", "Maximum 10 subjects allowed."); hasError = true; }
  if (hasError) return;

  const savedSubjects = students[activeStudentIndex]?.subjects || [];
  const subjectPool = (SUBJECT_POOL[degree]?.[parseInt(sem)] || []).slice();

  const container = document.getElementById("subjectFields");
  container.innerHTML = "";

  for (let i = 0; i < num; i++) {
    const row = document.createElement("div");
    row.className = "subject-row";

    // Subject select
    const subjectGroup = document.createElement("div");
    subjectGroup.innerHTML = `<div class="subject-row-label">Subject ${i + 1}</div>`;
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "select-wrapper";
    const sel = document.createElement("select");
    sel.className = "form-select subject-select";
    sel.innerHTML = `<option value="">— Choose Subject —</option>`;

    // Deduplicate: remove already picked subjects except current
    subjectPool.forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      sel.appendChild(opt);
    });

    // Custom subject option
    const customOpt = document.createElement("option");
    customOpt.value = "__custom__";
    customOpt.textContent = "✎ Other (type below)";
    sel.appendChild(customOpt);

    if (restoring && savedSubjects[i]) {
      sel.value = savedSubjects[i].name;
      // If not in list, add it
      if (!sel.value) {
        const opt = document.createElement("option");
        opt.value = savedSubjects[i].name;
        opt.textContent = savedSubjects[i].name;
        sel.insertBefore(opt, sel.lastChild);
        sel.value = savedSubjects[i].name;
      }
    }

    // Handle custom subject
    const customInput = document.createElement("input");
    customInput.type = "text";
    customInput.className = "form-input";
    customInput.placeholder = "Type custom subject name";
    customInput.style.display = "none";
    customInput.style.marginTop = "6px";

    sel.addEventListener("change", () => {
      customInput.style.display = sel.value === "__custom__" ? "block" : "none";
      recalcCGPA();
    });

    selectWrapper.appendChild(sel);
    subjectGroup.appendChild(selectWrapper);
    subjectGroup.appendChild(customInput);

    // Marks input
    const marksGroup = document.createElement("div");
    const savedMarks = restoring && savedSubjects[i] ? savedSubjects[i].marks : "";
    marksGroup.innerHTML = `<div class="subject-row-label">Marks (0–100)</div>`;
    const marksInput = document.createElement("input");
    marksInput.type = "number";
    marksInput.min  = "0";
    marksInput.max  = "100";
    marksInput.className = "form-input marks-input";
    marksInput.placeholder = "e.g. 85";
    marksInput.value = savedMarks;
    marksInput.addEventListener("input", () => {
      validateMarksInput(marksInput);
      recalcCGPA();
    });
    marksGroup.appendChild(marksInput);

    // Grade display
    const gradeGroup = document.createElement("div");
    const gradeSpan = document.createElement("span");
    gradeSpan.className = "grade-chip";
    gradeSpan.id = `gradeChip_${i}`;
    gradeGroup.innerHTML = `<div class="subject-row-label">Grade</div>`;
    gradeGroup.appendChild(gradeSpan);

    row.appendChild(subjectGroup);
    row.appendChild(marksGroup);
    row.appendChild(gradeGroup);
    container.appendChild(row);

    // If restoring, update grade chip
    if (restoring && savedMarks !== "") {
      updateGradeChip(gradeSpan, marksInput, savedMarks);
    }
  }

  document.getElementById("subjectCountBadge").textContent = `${num} subject${num > 1 ? "s" : ""}`;

  if (restoring) {
    recalcCGPA();
  } else {
    document.getElementById("cgpaPreview").style.display = "none";
  }
}

/**
 * Validate a marks input field
 */
function validateMarksInput(input) {
  const val = parseFloat(input.value);
  if (input.value === "") {
    input.classList.remove("error");
    return true;
  }
  if (isNaN(val) || val < 0 || val > 100) {
    input.classList.add("error");
    return false;
  }
  input.classList.remove("error");
  return true;
}

/* ── 8. GRADING & CGPA ───────────────────────────────────────── */

/**
 * Get grade info for a marks value
 */
function getGradeInfo(marks) {
  for (const g of GRADE_SCALE) {
    if (marks >= g.min) return g;
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

/**
 * Update a grade chip element
 */
function updateGradeChip(chip, input, marks) {
  const val = parseFloat(marks);
  if (isNaN(val) || marks === "") {
    chip.textContent = "";
    chip.className = "grade-chip";
    input.className = input.className.replace(/marks-input-\w+/g, "").trim() + " marks-input";
    return;
  }
  const g = getGradeInfo(val);
  chip.textContent = `${g.grade} · ${g.points}`;
  chip.className = `grade-chip grade-chip-${g.cls}`;
  // Color-coded input border
  input.className = input.className.replace(/marks-input-\w+/g, "").trim() + ` marks-input marks-input-${g.cls}`;
}

/**
 * Re-calculate CGPA from current form state
 */
function recalcCGPA() {
  const rows    = document.querySelectorAll(".subject-row");
  const entries = [];

  rows.forEach((row, i) => {
    const marksInput = row.querySelector("input.marks-input");
    const gradeChip  = row.querySelector(".grade-chip");
    const marks = parseFloat(marksInput?.value);

    if (!isNaN(marks) && marks >= 0 && marks <= 100) {
      entries.push({ name: "", marks });
      updateGradeChip(gradeChip, marksInput, marks);
    } else if (gradeChip) {
      updateGradeChip(gradeChip, marksInput, marksInput?.value || "");
    }
  });

  const cgpa = calculateCGPA(entries);
  displayCGPAPreview(cgpa);
  students[activeStudentIndex].cgpa = cgpa;
}

/**
 * Calculate CGPA from array of {marks}
 */
function calculateCGPA(subjects) {
  const valid = subjects.filter(s => s.marks !== "" && !isNaN(parseFloat(s.marks)));
  if (valid.length === 0) return null;
  const totalPoints = valid.reduce((sum, s) => sum + getGradeInfo(parseFloat(s.marks)).points, 0);
  return parseFloat((totalPoints / valid.length).toFixed(2));
}

/**
 * Display the CGPA preview card
 */
function displayCGPAPreview(cgpa) {
  const preview = document.getElementById("cgpaPreview");
  if (cgpa === null) {
    preview.style.display = "none";
    return;
  }
  preview.style.display = "block";
  document.getElementById("cgpaValue").textContent = cgpa.toFixed(2);

  // Derive letter grade from CGPA
  let gradeLabel = "";
  if (cgpa >= 9.5)       gradeLabel = "Outstanding — O";
  else if (cgpa >= 8.5)  gradeLabel = "Excellent — A+";
  else if (cgpa >= 7.5)  gradeLabel = "Very Good — A";
  else if (cgpa >= 6.5)  gradeLabel = "Good — B+";
  else if (cgpa >= 5.5)  gradeLabel = "Above Average — B";
  else if (cgpa >= 4.5)  gradeLabel = "Average — C";
  else                   gradeLabel = "Needs Improvement — F";
  document.getElementById("cgpaGrade").textContent = gradeLabel;

  // Bar width %
  const pct = Math.min((cgpa / 10) * 100, 100);
  document.getElementById("cgpaBar").style.width = pct + "%";
}

/* ── 9. FORM VALIDATION ──────────────────────────────────────── */

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = "";
}
function clearAllErrors() {
  ["nameError","degreeError","semError","numSubjectsError"].forEach(clearError);
}

/**
 * Validate the full form before dashboard generation
 */
function validateForm() {
  clearAllErrors();
  let ok = true;
  const s = students[activeStudentIndex];

  if (!document.getElementById("studentName").value.trim()) {
    showError("nameError", "Student name is required.");
    ok = false;
  }
  if (!document.getElementById("degreeSelect").value) {
    showError("degreeError", "Please select a degree.");
    ok = false;
  }
  if (!document.getElementById("semesterSelect").value) {
    showError("semError", "Please select a semester.");
    ok = false;
  }
  const rows = document.querySelectorAll(".subject-row");
  if (rows.length === 0) {
    showError("numSubjectsError", "Please generate subject fields first.");
    ok = false;
  }

  // Check marks are valid
  let marksOk = true;
  rows.forEach((row) => {
    const inp = row.querySelector("input.marks-input");
    if (!validateMarksInput(inp)) marksOk = false;
  });
  if (!marksOk) {
    showError("numSubjectsError", "Fix invalid marks (must be 0–100).");
    ok = false;
  }

  return ok;
}

/* ── 10. TAB SWITCHING ───────────────────────────────────────── */

function switchTab(name) {
  document.querySelectorAll(".tab-section").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
  document.getElementById(`tab-${name}`)?.classList.remove("hidden");
  document.querySelector(`.nav-btn[data-tab="${name}"]`)?.classList.add("active");
}

/* ── 11. DASHBOARD GENERATION ───────────────────────────────── */

/**
 * Main function to validate, save, render charts, and switch to dashboard
 */
function generateDashboard() {
  if (!validateForm()) return;

  saveCurrentStudentData();
  saveToLocalStorage();

  showLoader();
  setTimeout(() => {
    try {
      renderSummaryCards();
      renderSubjectBarChart();
      renderGradeDonutChart();
      renderRadarChart();
      renderInsights();
      renderCompareTab();
      switchTab("dashboard");
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      hideLoader();
    }
  }, 600);
}

/* ── 12. SUMMARY CARDS ───────────────────────────────────────── */

function renderSummaryCards() {
  const s = students[activeStudentIndex];
  const grid = document.getElementById("summaryGrid");

  // Compute stats
  const validSubjects = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
  const marksArr = validSubjects.map(sub => parseFloat(sub.marks));
  const avg = marksArr.length ? (marksArr.reduce((a,b)=>a+b,0)/marksArr.length).toFixed(1) : "—";
  const highest = marksArr.length ? Math.max(...marksArr) : "—";
  const lowest  = marksArr.length ? Math.min(...marksArr) : "—";
  const passed  = marksArr.filter(m => m >= 40).length;
  const failed  = marksArr.filter(m => m < 40).length;

  document.getElementById("dashboardSubtitle").textContent =
    `${s.name || "Student"} · ${DEGREE_LABELS[s.degree] || s.degree} · Semester ${s.semester}`;

  grid.innerHTML = `
    <div class="summary-card gold">
      <div class="summary-label">CGPA</div>
      <div class="summary-value" style="color:var(--accent)">${s.cgpa !== null ? s.cgpa.toFixed(2) : "—"}</div>
      <div class="summary-sub">out of 10.00</div>
    </div>
    <div class="summary-card green">
      <div class="summary-label">Average Marks</div>
      <div class="summary-value" style="color:var(--green)">${avg}</div>
      <div class="summary-sub">out of 100</div>
    </div>
    <div class="summary-card blue">
      <div class="summary-label">Highest Score</div>
      <div class="summary-value" style="color:var(--blue)">${highest}</div>
      <div class="summary-sub">${highest !== "—" ? getGradeInfo(highest).grade + " Grade" : ""}</div>
    </div>
    <div class="summary-card purple">
      <div class="summary-label">Subjects</div>
      <div class="summary-value" style="color:var(--purple)">${validSubjects.length}</div>
      <div class="summary-sub">${passed} passed · ${failed} failed</div>
    </div>
    <div class="summary-card ${failed > 0 ? "red" : "green"}">
      <div class="summary-label">Lowest Score</div>
      <div class="summary-value" style="color:${failed > 0 ? "var(--red)" : "var(--green)"}">${lowest}</div>
      <div class="summary-sub">${lowest !== "—" ? getGradeInfo(lowest).grade + " Grade" : ""}</div>
    </div>
  `;
}

/* ── 13. CHARTS ──────────────────────────────────────────────── */

/**
 * Shared Chart.js defaults for consistent styling
 */
function chartDefaults() {
  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  return {
    gridColor:   isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    textColor:   isDark ? "#8a92a9" : "#4e5672",
    tooltipBg:   isDark ? "#181c27" : "#ffffff",
    tooltipText: isDark ? "#f0f2f8" : "#111320",
  };
}

function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); charts[key] = null; }
}

/**
 * Subject-wise bar chart
 */
function renderSubjectBarChart() {
  destroyChart("subjectBar");
  const s = students[activeStudentIndex];
  const valid = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
  if (!valid.length) return;

  const d = chartDefaults();
  const labels = valid.map(sub => sub.name || "Subject");
  const data   = valid.map(sub => parseFloat(sub.marks));
  const bgColors = data.map(m => {
    const g = getGradeInfo(m);
    return `${gradeColor(g.cls)}CC`;
  });

  // Update legend
  const legend = document.getElementById("subjectChartLegend");
  legend.innerHTML = `
    <div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div>O/A+/A</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--accent)"></div>B+/B</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--red)"></div>C/F</div>
  `;

  charts.subjectBar = new Chart(document.getElementById("subjectBarChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data,
        backgroundColor: bgColors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.tooltipText,
          borderColor: "rgba(240,180,41,0.3)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            afterLabel: (ctx) => {
              const g = getGradeInfo(ctx.raw);
              return `Grade: ${g.grade} · ${g.points} pts`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor,
            font: { family: "'DM Sans', sans-serif", size: 11 },
            maxRotation: 30,
          }
        },
        y: {
          min: 0, max: 100,
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor,
            font: { family: "'JetBrains Mono', monospace", size: 11 },
          }
        }
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      }
    }
  });
}

/**
 * Grade distribution donut chart
 */
function renderGradeDonutChart() {
  destroyChart("gradeDonut");
  const s = students[activeStudentIndex];
  const valid = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
  if (!valid.length) return;

  // Count grades
  const gradeCounts = {};
  valid.forEach(sub => {
    const g = getGradeInfo(parseFloat(sub.marks)).grade;
    gradeCounts[g] = (gradeCounts[g] || 0) + 1;
  });

  const labels = Object.keys(gradeCounts);
  const data   = Object.values(gradeCounts);
  const gradeColorMap = { O:"#30d5a0", "A+":"#4d9fff", A:"#a78bfa", "B+":"#f0b429", B:"#ffa94d", C:"#ff9f9f", F:"#ff5c6a" };
  const colors = labels.map(l => gradeColorMap[l] || "#888");

  const d = chartDefaults();

  charts.gradeDonut = new Chart(document.getElementById("gradeDonutChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: d.textColor,
            font: { family: "'DM Sans', sans-serif", size: 11 },
            padding: 12,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.tooltipText,
          borderColor: "rgba(240,180,41,0.3)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.raw} subject${ctx.raw > 1 ? "s" : ""}`
          }
        }
      },
      animation: { animateRotate: true, duration: 900 }
    }
  });
}

/**
 * Radar chart of subject performance
 */
function renderRadarChart() {
  destroyChart("radar");
  const s = students[activeStudentIndex];
  const valid = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
  if (valid.length < 3) return; // Radar needs ≥3 points

  const d = chartDefaults();
  const labels = valid.map(sub => sub.name || "Subject");
  const data   = valid.map(sub => parseFloat(sub.marks));

  charts.radar = new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: {
      labels,
      datasets: [{
        label: s.name || "Student",
        data,
        backgroundColor: "rgba(240,180,41,0.12)",
        borderColor: "#f0b429",
        pointBackgroundColor: "#f0b429",
        pointBorderColor: "transparent",
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: d.gridColor },
          angleLines: { color: d.gridColor },
          pointLabels: {
            color: d.textColor,
            font: { family: "'DM Sans', sans-serif", size: 10 }
          },
          ticks: {
            display: false,
            stepSize: 20,
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.tooltipText,
          borderColor: "rgba(240,180,41,0.3)",
          borderWidth: 1,
          padding: 10,
        }
      },
      animation: { duration: 900 }
    }
  });
}

/**
 * Map grade class to hex color
 */
function gradeColor(cls) {
  const map = { o:"#30d5a0", ap:"#4d9fff", a:"#a78bfa", bp:"#f0b429", b:"#ffa94d", c:"#ff9f9f", f:"#ff5c6a" };
  return map[cls] || "#888";
}

/* ── 14. INSIGHTS ────────────────────────────────────────────── */

function renderInsights() {
  const s = students[activeStudentIndex];
  const valid = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
  if (!valid.length) return;

  const marksArr  = valid.map(sub => parseFloat(sub.marks));
  const avg       = marksArr.reduce((a,b)=>a+b,0)/marksArr.length;
  const highest   = Math.max(...marksArr);
  const lowest    = Math.min(...marksArr);
  const bestSub   = valid[marksArr.indexOf(highest)].name || "Unknown";
  const worstSub  = valid[marksArr.indexOf(lowest)].name || "Unknown";
  const failed    = valid.filter(s => parseFloat(s.marks) < 40);
  const passRate  = ((valid.filter(s => parseFloat(s.marks) >= 40).length / valid.length) * 100).toFixed(0);

  const insights = [];

  // CGPA insight
  if (s.cgpa >= 8.5) {
    insights.push({ type:"positive", title:"🏆 Excellent Academic Performance", body:`CGPA of ${s.cgpa} indicates outstanding performance. Keep it up!` });
  } else if (s.cgpa >= 7) {
    insights.push({ type:"positive", title:"✅ Good Standing", body:`CGPA of ${s.cgpa} reflects consistent performance. Aim higher for distinction.` });
  } else if (s.cgpa >= 5) {
    insights.push({ type:"warning", title:"⚠ Average Performance", body:`CGPA of ${s.cgpa} is passing but there's significant room for improvement.` });
  } else {
    insights.push({ type:"negative", title:"🚨 Needs Immediate Attention", body:`CGPA of ${s.cgpa} is critically low. Seek academic counselling.` });
  }

  // Best subject
  insights.push({ type:"info", title:`📈 Strongest Subject: ${bestSub}`, body:`Scored ${highest}/100 — ${getGradeInfo(highest).grade} grade. This is your area of strength.` });

  // Weakest subject
  if (lowest < 70) {
    insights.push({ type: lowest < 40 ? "negative" : "warning",
      title: `📉 Focus Area: ${worstSub}`,
      body: `Scored ${lowest}/100. ${lowest < 40 ? "This subject was not cleared." : "Dedicate more time here."}` });
  }

  // Pass rate
  if (parseInt(passRate) === 100) {
    insights.push({ type:"positive", title:"✔ All Subjects Cleared", body:"Congratulations! No backlogs this semester." });
  } else {
    insights.push({ type:"negative", title:`⚡ ${failed.length} Subject(s) Not Cleared`, body:`${failed.map(f=>f.name).join(", ")} scored below 40.` });
  }

  // Consistency
  const variance = marksArr.reduce((a,b) => a + Math.pow(b-avg,2), 0) / marksArr.length;
  const stdDev = Math.sqrt(variance).toFixed(1);
  if (stdDev < 10) {
    insights.push({ type:"positive", title:"📊 Consistent Performer", body:`Standard deviation of ${stdDev} marks shows consistent performance across subjects.` });
  } else {
    insights.push({ type:"warning", title:"📊 Inconsistent Performance", body:`Standard deviation of ${stdDev} marks shows high variation. Focus on weaker areas.` });
  }

  const grid = document.getElementById("insightsGrid");
  grid.innerHTML = insights.map(ins => `
    <div class="insight-item ${ins.type}">
      <div class="insight-title">${ins.title}</div>
      <div class="insight-body">${ins.body}</div>
    </div>
  `).join("");
}

/* ── 15. COMPARE TAB ─────────────────────────────────────────── */

function renderCompareTab() {
  const note       = document.getElementById("compareNote");
  const tableCard  = document.getElementById("compareTableCard");

  // Only use students with valid CGPA
  const validStudents = students.filter(s => s.cgpa !== null && s.subjects.length > 0);

  if (validStudents.length < 2) {
    note.style.display = "flex";
    tableCard.style.display = "none";
    destroyChart("cgpaCompare");
    destroyChart("subjectOverlay");
    return;
  }

  note.style.display = "none";
  tableCard.style.display = "block";

  // Sort by CGPA descending for ranks
  const ranked = [...validStudents].sort((a,b) => b.cgpa - a.cgpa);

  // Table
  const tbody = document.getElementById("compareTableBody");
  tbody.innerHTML = ranked.map((s, i) => {
    const validSubs = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
    const marksArr  = validSubs.map(sub => parseFloat(sub.marks));
    const highest   = marksArr.length ? Math.max(...marksArr) : 0;
    const bestSub   = marksArr.length ? (validSubs[marksArr.indexOf(highest)].name || "—") : "—";
    const failed    = marksArr.filter(m => m < 40).length;
    const cgInfo    = getGradeInfo((s.cgpa / 10) * 100);

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="rank-badge rank-${Math.min(i+1,3)}">${i+1}</span>
            <strong>${s.name || "Student " + (students.indexOf(s)+1)}</strong>
          </div>
        </td>
        <td>${DEGREE_LABELS[s.degree] || s.degree || "—"}</td>
        <td>Sem ${s.semester || "—"}</td>
        <td>
          <strong style="font-family:var(--font-mono);color:${cgpaColor(s.cgpa)}">${s.cgpa.toFixed(2)}</strong>
        </td>
        <td><span style="color:${cgpaColor(s.cgpa)}">${cgpaGradeLetter(s.cgpa)}</span></td>
        <td>${failed === 0 ? '<span class="status-pass">✓ Pass</span>' : `<span class="status-fail">✗ ${failed} fail</span>`}</td>
        <td style="font-size:0.8rem;color:var(--text-secondary)">${bestSub}</td>
      </tr>
    `;
  }).join("");

  renderCGPACompareChart(ranked);
  renderSubjectOverlayChart(ranked);
}

function cgpaColor(cgpa) {
  if (cgpa >= 8.5) return "var(--green)";
  if (cgpa >= 7)   return "var(--blue)";
  if (cgpa >= 5)   return "var(--accent)";
  return "var(--red)";
}

function cgpaGradeLetter(cgpa) {
  if (cgpa >= 9.5) return "O";
  if (cgpa >= 8.5) return "A+";
  if (cgpa >= 7.5) return "A";
  if (cgpa >= 6.5) return "B+";
  if (cgpa >= 5.5) return "B";
  if (cgpa >= 4.5) return "C";
  return "F";
}

/**
 * CGPA horizontal bar compare chart
 */
function renderCGPACompareChart(ranked) {
  destroyChart("cgpaCompare");
  const d = chartDefaults();

  charts.cgpaCompare = new Chart(document.getElementById("cgpaCompareChart"), {
    type: "bar",
    data: {
      labels: ranked.map(s => s.name || "Student"),
      datasets: [{
        label: "CGPA",
        data: ranked.map(s => s.cgpa),
        backgroundColor: ranked.map(s => cgpaColor(s.cgpa) + "CC"),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.tooltipText,
          borderColor: "rgba(240,180,41,0.3)",
          borderWidth: 1,
          padding: 10,
          callbacks: { label: ctx => ` CGPA: ${ctx.raw.toFixed(2)} (${cgpaGradeLetter(ctx.raw)})` }
        }
      },
      scales: {
        x: {
          min: 0, max: 10,
          grid: { color: d.gridColor },
          ticks: { color: d.textColor, font: { family: "'JetBrains Mono', monospace", size: 11 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: d.textColor, font: { family: "'DM Sans', sans-serif", size: 12 } }
        }
      },
      animation: { duration: 800 }
    }
  });
}

/**
 * Subject overlay line chart for all students
 */
function renderSubjectOverlayChart(ranked) {
  destroyChart("subjectOverlay");
  const d = chartDefaults();

  // Find common or max-length subject list for labels
  const maxSubs = ranked.reduce((max, s) => {
    const v = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
    return v.length > max.length ? v : max;
  }, []);

  const labels = maxSubs.map((sub, i) => sub.name || `Sub ${i+1}`);

  const datasets = ranked.map((s, i) => {
    const validSubs = s.subjects.filter(sub => sub.marks !== "" && !isNaN(parseFloat(sub.marks)));
    const data = labels.map((_, j) => validSubs[j] ? parseFloat(validSubs[j].marks) : null);
    const color = CHART_COLORS[i % CHART_COLORS.length];
    return {
      label: s.name || `Student ${i+1}`,
      data,
      borderColor: color,
      backgroundColor: color + "22",
      pointBackgroundColor: color,
      pointRadius: 5,
      tension: 0.35,
      fill: false,
      spanGaps: true,
    };
  });

  charts.subjectOverlay = new Chart(document.getElementById("subjectOverlayChart"), {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: d.textColor,
            font: { family: "'DM Sans', sans-serif", size: 11 },
            usePointStyle: true,
            padding: 16,
          }
        },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.tooltipText,
          borderColor: "rgba(240,180,41,0.3)",
          borderWidth: 1,
          padding: 10,
        }
      },
      scales: {
        x: {
          grid: { color: d.gridColor },
          ticks: { color: d.textColor, font: { family: "'DM Sans', sans-serif", size: 11 }, maxRotation: 30 }
        },
        y: {
          min: 0, max: 100,
          grid: { color: d.gridColor },
          ticks: { color: d.textColor, font: { family: "'JetBrains Mono', monospace", size: 11 } }
        }
      },
      animation: { duration: 900 }
    }
  });
}

/* ── 16. THEME TOGGLE ────────────────────────────────────────── */

function toggleTheme() {
  const html    = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  document.getElementById("themeIcon").textContent = next === "dark" ? "☀" : "☾";
  localStorage.setItem("acadmetrics_theme", next);

  // Re-render charts if on dashboard/compare (theme changes colors)
  const activeTab = document.querySelector(".tab-section:not(.hidden)")?.id;
  if (activeTab === "tab-dashboard") {
    renderSubjectBarChart();
    renderGradeDonutChart();
    renderRadarChart();
  } else if (activeTab === "tab-compare") {
    const validStudents = students.filter(s => s.cgpa !== null && s.subjects.length > 0);
    if (validStudents.length >= 2) {
      const ranked = [...validStudents].sort((a,b) => b.cgpa - a.cgpa);
      renderCGPACompareChart(ranked);
      renderSubjectOverlayChart(ranked);
    }
  }
}

/* ── 17. HELP PANEL ──────────────────────────────────────────── */

function toggleHelp() {
  document.getElementById("helpPanel").classList.toggle("active");
  document.getElementById("helpOverlay").classList.toggle("active");
}

/* ── 18. LOADER ──────────────────────────────────────────────── */

function showLoader() {
  document.getElementById("loaderOverlay").classList.add("active");
}
function hideLoader() {
  document.getElementById("loaderOverlay").classList.remove("active");
}

/* ── 19. CLEAR / RESET ───────────────────────────────────────── */

function clearCurrentStudent() {
  if (!confirm("Clear all data for the current student?")) return;
  students[activeStudentIndex] = createStudent(students[activeStudentIndex].id);
  loadStudentIntoForm(activeStudentIndex);
  document.getElementById("cgpaPreview").style.display = "none";
}

/* ── 20. LOCAL STORAGE ───────────────────────────────────────── */

function saveToLocalStorage() {
  saveCurrentStudentData();
  try {
    localStorage.setItem("acadmetrics_students", JSON.stringify(students));
    localStorage.setItem("acadmetrics_active", activeStudentIndex);
    // Brief toast-like visual feedback on the save button
    const btn = document.querySelector('.btn-outline:nth-child(2)');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = "<span>✓</span> Saved!";
      btn.style.borderColor = "var(--green)";
      btn.style.color = "var(--green)";
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 1500);
    }
  } catch (e) {
    console.warn("LocalStorage write failed:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved  = localStorage.getItem("acadmetrics_students");
    const active = localStorage.getItem("acadmetrics_active");
    const theme  = localStorage.getItem("acadmetrics_theme");

    if (saved) {
      students = JSON.parse(saved);
      activeStudentIndex = parseInt(active) || 0;
      if (activeStudentIndex >= students.length) activeStudentIndex = 0;
    }
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      document.getElementById("themeIcon").textContent = theme === "dark" ? "☀" : "☾";
    }
  } catch (e) {
    console.warn("LocalStorage read failed:", e);
  }
}

/* ── 21. ENTRY POINT ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", init);