<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>RieckerRep-Quiz</title>
  <!-- Supabase JavaScript Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  <style>
    /***********************************
     *   Gesamt-Container mit Rand     *
     ***********************************/
    #quiz-container {
      border: 3px solid black;  
      margin: 20px auto;        
      max-width: 1200px;        
      min-height: 600px;        
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      box-sizing: border-box;
      font-family: Cambria, sans-serif;
    }
    /********************************************
     *  Frageauswahl (oben, horizontal, LINKS)  *
     ********************************************/
    .question-selection-row {
      display: flex;
      align-items: center;
      justify-content: flex-start;  
      background-color: transparent; 
      padding: 10px;
      border-bottom: 2px solid black; 
      gap: 5px; 
    }
    .question-selection {
      display: flex;
      gap: 5px;
    }
    .question-select-item {
      background-color: #000; 
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
      border: none;
    }
    .question-select-item:hover {
      background-color: #333;
    }
    /***********************************************
     *  2 Spalten: links (1), rechts (3)
     ***********************************************/
    .content-row {
      display: flex;
      flex: 1;
      flex-direction: row;
    }
    /*************************
     *   Linke Spalte (1)
     *************************/
    .question-panel {
      width: 50%;
      background-color: #000; 
      color: #fff;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .question-number {
      font-weight: bold;
    }
    .progress-bar-container {
      background-color: #333; 
      width: 50%;
      height: 8px;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }
    .progress-bar {
      background-color: #FFD700; 
      height: 100%;
      width: 0%;
      transition: width 0.3s;
    }
    #questionText {
      font-size: 1.2rem;
      font-weight: bold;
      margin: 0;
      color: #fff;
    }
    #explanationContainer {
      background-color: #111;
      border-radius: 5px;
      padding: 15px;
      margin-top: 20px;
      display: none;
      text-align: left;
    }
    #explanationText {
      margin-top: 2em; 
      margin-bottom: 10px;
      white-space: pre-line;
    }
    /***************************
     *   Rechte Spalte (3)
     ***************************/
    .answer-panel {
      width: 50%;
      background-color: #fff; 
      color: #000;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      position: relative;
    }
    .answer-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .xp-box {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 10px;
      font-weight: bold;
      color: #fff;  
      background: linear-gradient(135deg, #1e90ff 0%, #5dade2 100%);
      position: relative;
    }
    .xp-icon {
      width: 16px;
      height: 16px;
    }
    .xp-change {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
      color: green;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      animation: xp-float-up 2s ease-out forwards;
    }
    @keyframes xp-float-up {
      0% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -40px); }
    }
    .coin-row {
      display: flex;
      gap: 10px;
    }
    .coin-box {
      background: gold;
      padding: 5px 10px;
      border-radius: 10px;
      color: #000;
      position: relative;
      font-weight: bold;
    }
    .coin-change {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
      top: 0;
      right: 30%;
      transform: translateX(50%);
    }
    .coin-change.positive {
      color: green;
      animation: float-up 2s ease-out forwards;
    }
    .coin-change.negative {
      color: red;
      animation: float-down 2s ease-out forwards;
    }
    @keyframes float-up {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-50px); }
    }
    @keyframes float-down {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(50px); }
    }
    #options {
      background-color: #fff;
      border-radius: 5px;
      min-height: 60px;
      margin-bottom: 20px;
      text-align: left;
      padding: 10px;
      box-sizing: border-box;
      flex: 1;
    }
    /* Buttons */
    button {
      background: #fff;
      color: #000;
      border: 2px solid #000;
      border-radius: 5px;
      padding: 10px;
      margin: 5px 0;
      width: 100%;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
      font-family: Cambria, sans-serif;
    }
    button:hover {
      background-color: #333;
      color: #fff;
    }
    #approveBtn,
    #rejectBtn,
    #nextBtn {
      display: none;
    }
    /* "Weiter" Button => grün mit weißer Schrift */
    #nextBtn {
      margin-top: 10px;
      border-color: green;
      background-color: green;
      color: #fff;
    }
    #nextBtn:hover {
      background-color: #006600;
      color: #fff;
    }
    #repeatBtn {
      display: none;
    }
    /* Spezielle Buttons für Open Questions */
    .open-approve {
      background-color: green !important;
      color: #fff !important;
      border-color: green !important;
    }
    .open-approve:hover {
      background-color: #006600 !important;
      color: #fff !important;
    }
    .open-reject {
      background-color: red !important;
      color: #fff !important;
      border-color: red !important;
    }
    .open-reject:hover {
      background-color: #990000 !important;
      color: #fff !important;
    }
    /* Drag & Drop */
    .assignment-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .assignment-pair {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .draggable-item {
      display: inline-block;
      background: #333;
      color: #fff;
      padding: 8px 10px;
      border-radius: 5px;
      margin: 5px;
      cursor: move;
    }
    .draggable-item:active {
      opacity: 0.7;
    }
    .target-zone {
      border: 2px dashed #888;
      padding: 15px;
      border-radius: 5px;
      background-color: #fff;
      text-align: center;
      position: relative;
      min-height: 40px;
      width: 45%;
    }
    .target-zone.hover {
      background-color: #eee;
    }
    /********************************************
     *  Halbkreis am Ende
     ********************************************/
    #endScreen {
      display: none;
      text-align: center;
      margin-top: 20px;
    }
    .justice-icon {
      width: 300px;
      height: 300px;
      fill: #000;
      margin-bottom: -30px;
    }
    .circular-progress {
      width: 300px;
      height: 150px;
      margin: 10px auto;
      position: relative;
      overflow: visible;
    }
    .circular-progress svg {
      width: 100%;
      height: 100%;
    }
    .circle-bg {
      fill: none;
      stroke: #444;
      stroke-width: 2.8;
    }
    .circle {
      fill: none;
      stroke: #ffd700;
      stroke-width: 2.8;
      stroke-linecap: round;
      transition: stroke-dasharray 1s ease;
    }
    .percentage {
      font-size: 0.25em; 
      fill: #000;
    }
    #endTitle {
      margin: 0;
      font-size: 1.5rem;
    }
    #endMessage {
      margin: 10px 0 10px 0;
    }
    #coinBalance {
      margin-bottom: 10px;
      font-weight: bold;
    }
    #continueBtn {
      background: #000; 
      color: #fff;
      border: 2px solid #000;
      border-radius: 5px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      font-family: Cambria, sans-serif;
      transition: background-color 0.3s, color 0.3s;
      display: inline-block;
      width: auto;
    }
    #continueBtn:hover {
      background-color: #333;
      color: #fff;
    }
    #medalInfo {
      margin-top: 10px;
      font-weight: bold;
    }
    /***********************************************
     *   Mobile Ansicht (XP/Münzen "über" dem Konstrukt)
     ***********************************************/
    @media (max-width: 768px) {
      .content-row {
        flex-direction: column; 
      }
      .answer-top-row {
        order: -1; 
        width: 100%;
        margin-top: 10px;
      }
      .question-panel {
        width: 100%;
        order: 1;
      }
      .answer-panel {
        width: 100%;
        order: 2;
      }
      #explanationContainer {
        order: 3;
        margin-top: 10px;
      }
    }
    /***********************************************
     *   Darkmode
     ***********************************************/
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #222;
        color: #fff;
      }
      #quiz-container {
        border: 2px solid #999;
        background-color: #333;
      }
      .question-panel {
        background-color: #111;
      }
      .answer-panel {
        background-color: transparent;
        color: #fff;
      }
      button {
        border: 1px solid #999;
      }
      button:hover {
        background-color: rgba(255,255,255,0.8);
        color: #000;
      }
      .question-select-item {
        background-color: rgba(255,255,255,1);
        color: #000;
      }
      .question-select-item:hover {
        background-color: rgba(255,255,255,0.8);
      }
      .coin-box {
        color: #000;
        background: gold;
      }
      .circle-bg {
        stroke: #bbb; 
      }
      .percentage {
        fill: #fff;
      }
    }
    /***********************************************
     *   R/F-Buttons nebeneinander
     ***********************************************/
    .horizontal-buttons {
      display: flex;
      gap: 10px;
    }
    .subquestions {
      margin-bottom: 10px;
      font-weight: bold;
    }
    .open-question-textarea {
      background: #f9f9f9;
      border: 2px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      font-family: inherit;
      resize: vertical;
      min-height: 80px; 
      width: 100%;
      box-sizing: border-box;
    }
    .case-subquestion-container {
      margin-bottom: 10px;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
      background-color: #f1f1f1;
    }
    .case-subquestion-text {
      margin-bottom: 5px;
      font-weight: bold;
    }
    .case-subquestion-buttons {
      display: flex;
      gap: 10px;
    }
  </style>
</head>
<body>

<!-- Quiz-Container -->
<div id="quiz-container">
  <!-- Dein HTML-Inhalt, z. B. Frageauswahl, Fragen, Antworten usw. -->
  <div class="question-selection-row">
    <div class="question-selection" id="questionSelection"></div>
  </div>
  <div class="content-row">
    <div class="question-panel">
      <div class="question-header">
        <span class="question-number" id="progressInfo">Frage 1 von ?</span>
        <div class="progress-bar-container">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
      </div>
      <h2 id="questionText">Quiz wird geladen...</h2>
      <div id="explanationContainer">
        <p id="explanationText"></p>
        <button id="approveBtn" class="open-approve">Als richtig werten</button>
        <button id="rejectBtn" class="open-reject">Als falsch werten</button>
        <button id="nextBtn">Weiter →</button>
      </div>
    </div>
    <div class="answer-panel">
      <div class="answer-top-row">
        <div class="xp-box" id="xpBox">
          <span id="xpValue">0</span>
          <svg class="xp-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.92 5.92L21 9.24l-4.58 4.47L17.84 21 12 17.77 6.16 21l1.42-7.29L3 9.24l6.08-1.32L12 2z"/>
          </svg>
        </div>
        <div class="coin-row">
          <div class="coin-box">Gesamt: <span id="totalCoins">100</span> 🪙</div>
          <div class="coin-box">Runde: <span id="roundCoins">0</span> 🪙</div>
        </div>
      </div>
      <div id="options"></div>
      <button id="repeatBtn">🔄 Wiederholen</button>
      <div id="endScreen">
        <img src="https://lqoulygftdjbnfxkrihy.supabase.co/storage/v1/object/public/quiz-assets/waage.svg" alt="justice" class="justice-icon">
        <div class="circular-progress">
          <svg viewBox="0 0 36 36">
            <path class="circle-bg" d="M2 18 a 16 16 0 0 1 32 0"/>
            <path id="circleBar" class="circle" stroke-dasharray="0, 50.265" d="M2 18 a 16 16 0 0 1 32 0"/>
            <text x="18" y="18" id="xpText" class="percentage" text-anchor="middle">0 / 0 XP</text>
          </svg>
        </div>
        <h2 id="endTitle">Quiz beendet!</h2>
        <p id="endMessage">Ein Schritt näher an deinem Erfolg im Jurastudium!</p>
        <p id="coinBalance"></p>
        <p id="medalInfo"></p>
        <button id="continueBtn">🔄 Wiederholen</button>
      </div>
    </div>
  </div>
</div>

<script>
  // Supabase-Konfiguration (dein API-Key wird hier verwendet)
  const SUPABASE_URL = 'https://lqoulygftdjbnfxkrihy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxb3VseWdmdGRqYm5meGtyaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzUzMDAsImV4cCI6MjA1NTA1MTMwMH0.VInK_7i6zY_f5zjHSR0U93Ut0L7ku_Q0C9xS-u4Lols';
  // Verwende einen anderen Namen für den Client
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  (function() {
    // Variablen
    let questions = [];
    let currentIndex = 0;
    let totalCoins = 100;
    let roundCoins = 0;
    let xp = 0;
    let xpGoal = 0;
    let streak = 0;
    let answeredCorrectly = [];
    let alreadyAnsweredQuestionIds = [];
    const halfCircleCircumference = 50.265;

    // Supabase-Funktionen
    async function fetchSupabaseData(table) {
      const { data, error } = await supabaseClient
        .from(table)
        .select('*');
      if (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return [];
      }
      return data;
    }

    async function ensureUserInSupabase(userId) {
      const { data, error } = await supabaseClient
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabaseClient
          .from('user_stats')
          .insert([{ user_id: userId, total_xp: 0, total_coins: 100, streak: 0, level: 1 }]);
        if (insertError) {
          console.error('Fehler beim Anlegen des Benutzers:', insertError);
        } else {
          console.log('Benutzer angelegt:', insertData);
        }
      } else if (error) {
        console.error('Fehler bei der Benutzerprüfung:', error);
      }
    }

    async function updateUserStatsInSupabase(userId, newXP, newCoins, newStreak) {
      const { data, error } = await supabaseClient
        .from('user_stats')
        .update({ total_xp: newXP, total_coins: newCoins, streak: newStreak })
        .eq('user_id', userId);
      if (error) {
        console.error('Fehler beim Update der Stats:', error);
      } else {
        console.log('Stats aktualisiert:', data);
      }
    }

    async function markQuestionAsAnsweredInSupabase(userId, questionId) {
      const { data, error } = await supabaseClient
        .from('answered_questions')
        .insert([{ user_id: userId, question_id: questionId, is_correct: true }]);
      if (error) {
        console.error('Fehler beim Eintragen der beantworteten Frage:', error);
      } else {
        console.log('Frage als beantwortet markiert:', data);
      }
    }

    async function fetchAlreadyAnsweredQuestions(userId) {
      const { data, error } = await supabaseClient
        .from('answered_questions')
        .select('question_id')
        .eq('user_id', userId);
      if (error) {
        console.error('Fehler beim Abrufen der beantworteten Fragen:', error);
        return [];
      }
      return data.map(d => d.question_id);
    }

    async function handleStreak(userId, totalCorrect) {
      if (totalCorrect > 0) {
        streak++;
        console.log("Streak erhöht auf", streak);
        await updateUserStatsInSupabase(userId, xp, totalCoins, streak);
      }
    }

    function getWixUserId() {
      return "dummyWixUser123";
    }

    document.addEventListener("DOMContentLoaded", async () => {
      await initQuiz();
    });

    async function loadQuiz() {
      try {
        const response = await fetch("https://lqoulygftdjbnfxkrihy.supabase.co/rest/v1/questions", {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
          }
        });
        if (!response.ok) {
          throw new Error("Fehler: " + response.status);
        }
        let data = await response.json();
        data = data.filter(q => q.Frage && q.Frage.trim() !== "");
        if (Array.isArray(data) && data.length > 0) {
          questions = data;
          answeredCorrectly = new Array(questions.length).fill(false);
          xpGoal = questions.length * 10;
          createQuestionSelection();
          showQuestion();
        } else {
          document.getElementById("questionText").innerText = "Keine gültigen Fragen!";
        }
      } catch (err) {
        document.getElementById("questionText").innerText = "Fehler beim Laden!";
        console.error(err);
      }
    }

    async function initQuiz() {
      const wixUserId = getWixUserId();
      if (!wixUserId) {
        alert("Bitte melde dich an, um das Quiz zu spielen.");
        return;
      }
      await ensureUserInSupabase(wixUserId);
      const userStats = await fetchSupabaseData("user_stats");
      if (userStats.length > 0) {
        const user = userStats[0];
        xp = user.total_xp || 0;
        totalCoins = user.total_coins || 0;
        streak = user.streak || 0;
      }
      alreadyAnsweredQuestionIds = await fetchAlreadyAnsweredQuestions(wixUserId);
      document.getElementById("xpValue").innerText = xp;
      document.getElementById("totalCoins").innerText = totalCoins;
      loadQuiz();
    }

    function createQuestionSelection() {
      const selectionDiv = document.getElementById("questionSelection");
      selectionDiv.innerHTML = "";
      for (let i = 0; i < questions.length; i++) {
        const item = document.createElement("div");
        item.className = "question-select-item";
        item.innerText = (i + 1);
        item.onclick = () => {
          currentIndex = i;
          showQuestion();
        };
        selectionDiv.appendChild(item);
      }
    }

    function showQuestion() {
      const questionText = document.getElementById("questionText");
      const options = document.getElementById("options");
      const explanationContainer = document.getElementById("explanationContainer");
      const endScreen = document.getElementById("endScreen");
      const repeatBtn = document.getElementById("repeatBtn");

      if (currentIndex >= questions.length) {
        questionText.innerText = "Fertig!";
        options.style.display = "none";
        explanationContainer.style.display = "none";
        repeatBtn.style.display = "none";
        endScreen.style.display = "block";
        updateEndScreen();
        return;
      }

      options.style.display = "block";
      endScreen.style.display = "none";
      explanationContainer.style.display = "none";
      document.getElementById("explanationText").innerText = "";
      repeatBtn.style.display = "none";
      document.getElementById("nextBtn").style.display = "none";
      document.getElementById("approveBtn").style.display = "none";
      document.getElementById("rejectBtn").style.display = "none";

      const q = questions[currentIndex];
      if (q.type === "lueckentext") {
        questionText.innerText = "Fülle den Lückentext aus.";
      } else if (q.type === "drag_drop") {
        questionText.innerText = "Ordne die Begriffe richtig zu.";
      } else {
        questionText.innerText = q.Frage || "Frage fehlt";
      }

      options.innerHTML = "";
      updateProgressBar();

      const type = q.type || "multiple_choice";
      switch (type) {
        case "multiple_choice":
        case "drag_drop":
          createStandardQuestion(q, type);
          break;
        case "lueckentext":
          createLueckentext(q);
          break;
        case "true_false":
          createTrueFalse(q);
          break;
        case "case":
          createCase(q);
          break;
        case "open_question":
          createOpenQuestion(q);
          break;
        default:
          createStandardQuestion(q, "multiple_choice");
          break;
      }
    }

    function createTrueFalse(q) {
      const options = document.getElementById("options");
      const row = document.createElement("div");
      row.className = "horizontal-buttons";

      const btnR = document.createElement("button");
      btnR.innerText = "Richtig";
      btnR.onclick = () => { checkAnswer("Richtig", q, false, "true_false"); };
      const btnF = document.createElement("button");
      btnF.innerText = "Falsch";
      btnF.onclick = () => { checkAnswer("Falsch", q, false, "true_false"); };

      row.appendChild(btnR);
      row.appendChild(btnF);
      options.appendChild(row);
    }

    function createCase(q) {
      const options = document.getElementById("options");
      let subQuestions = q.subQuestions || [];

      if (!Array.isArray(subQuestions) || subQuestions.length === 0) {
        const row = document.createElement("div");
        row.className = "horizontal-buttons";

        const btnR = document.createElement("button");
        btnR.innerText = "Richtig";
        btnR.onclick = () => { checkAnswer("Richtig", q, false, "case"); };
        const btnF = document.createElement("button");
        btnF.innerText = "Falsch";
        btnF.onclick = () => { checkAnswer("Falsch", q, false, "case"); };

        row.appendChild(btnR);
        row.appendChild(btnF);
        options.appendChild(row);
        return;
      }

async function createDragDropQuestion(q) {
  const options = document.getElementById("options");
  options.innerHTML = ""; // reset

  // 1. Lade die Items aus deiner Tabelle, z. B. "dragdrop_pairs"
  //    Wir gehen davon aus, dass es eine Spalte "question_id" gibt.
  let { data, error } = await supabaseClient
    .from('dragdrop_pairs')
    .select('*')
    .eq('group_id', q.id);

  if (error) {
    console.error("Fehler beim Laden der Drag & Drop Daten:", error);
    options.innerHTML = "<p>Fehler beim Laden der Drag-&-Drop-Daten!</p>";
    return;
  }
  if (!data || data.length === 0) {
    options.innerHTML = "<p>Keine Drag & Drop-Daten vorhanden!</p>";
    return;
  }

  // 2. "assignment-container" anlegen
  const assignment = document.createElement("div");
  assignment.className = "assignment-container";

  // data = [{ id: 1, question_id: ..., drag_text: '...', correct_match: '...' }, ...]
  // Baue daraus Draggable-Items und Zielzonen
  data.forEach((itemObj, index) => {
    const pair = document.createElement("div");
    pair.className = "assignment-pair";

    // Linkes "Draggable"
    const item = document.createElement("div");
    item.className = "draggable-item";
    item.innerText = itemObj.drag_text;
    item.id = `draggable-${itemObj.id}`;
    item.draggable = true;
    item.addEventListener("dragstart", ev => {
      ev.dataTransfer.setData("text", item.id);
      ev.dataTransfer.effectAllowed = "move";
    });

    // Rechtes "Target"
    const target = document.createElement("div");
    target.className = "target-zone";
    target.dataset.correct = itemObj.correct_match; // z. B. "BGB", "Strafrecht" etc.

    target.addEventListener("dragover", ev => {
      ev.preventDefault();
      target.classList.add("hover");
      ev.dataTransfer.dropEffect = "move";
    });
    target.addEventListener("dragleave", () => {
      target.classList.remove("hover");
    });
    target.addEventListener("drop", ev => {
      ev.preventDefault();
      target.classList.remove("hover");
      const sourceId = ev.dataTransfer.getData("text");
      const source = document.getElementById(sourceId);
      if (source) {
        target.innerText = source.innerText;
        // optische Markierung
        if (source.innerText === target.dataset.correct) {
          target.style.backgroundColor = "#a4f9a4";
        } else {
          target.style.backgroundColor = "#f9a4a4";
        }
        source.style.visibility = "hidden";
      }
    });

    pair.appendChild(item);
    pair.appendChild(target);
    assignment.appendChild(pair);
  });

  options.appendChild(assignment);

  // 3. "Antwort prüfen" Button
  const checkBtn = document.createElement("button");
  checkBtn.innerText = "Antwort prüfen";
  checkBtn.onclick = () => {
    const targetZones = Array.from(assignment.querySelectorAll(".target-zone"));
    let correctCount = 0;
    targetZones.forEach(tz => {
      if (tz.innerText === tz.dataset.correct) {
        correctCount++;
      }
    });
    const isCorrect = (correctCount === targetZones.length);
    checkAnswer(isCorrect ? "Richtig" : "Falsch", q, false, "drag_drop");
  };
  options.appendChild(checkBtn);
}


      const userAnswers = new Array(subQuestions.length).fill(null);
      subQuestions.forEach((sq, index) => {
        const container = document.createElement("div");
        container.className = "case-subquestion-container";

        const sqText = document.createElement("div");
        sqText.className = "case-subquestion-text";
        sqText.innerText = sq.text || `Teilfrage ${index + 1}`;
        container.appendChild(sqText);

        const btnRow = document.createElement("div");
        btnRow.className = "case-subquestion-buttons";

        const rBtn = document.createElement("button");
        rBtn.innerText = "Richtig";
        rBtn.onclick = () => { userAnswers[index] = "Richtig"; };

        const fBtn = document.createElement("button");
        fBtn.innerText = "Falsch";
        fBtn.onclick = () => { userAnswers[index] = "Falsch"; };

        btnRow.appendChild(rBtn);
        btnRow.appendChild(fBtn);
        container.appendChild(btnRow);
        options.appendChild(container);
      });

      const checkBtn = document.createElement("button");
      checkBtn.innerText = "Antwort prüfen";
      checkBtn.onclick = () => {
        const allAnswered = userAnswers.every(a => a !== null);
        if (!allAnswered) {
          alert("Bitte alle Teilfragen beantworten!");
          return;
        }
        let isAllCorrect = true;
        for (let i = 0; i < subQuestions.length; i++) {
          if (subQuestions[i].correctAnswer && userAnswers[i] !== subQuestions[i].correctAnswer) {
            isAllCorrect = false;
            break;
          }
        }
        checkAnswer(isAllCorrect ? "Richtig" : "Falsch", q, false, "case");
      };
      options.appendChild(checkBtn);
    }

    function createStandardQuestion(q, type) {
      const options = document.getElementById("options");
      switch (type) {
        case "multiple_choice":
          ["Antwort A", "Antwort B", "Antwort C", "Antwort D"].forEach(key => {
            if (q[key] && q[key].trim() !== "") {
              const btn = document.createElement("button");
              btn.innerText = q[key];
              btn.onclick = () => { checkAnswer(q[key], q, false, "multiple_choice"); };
              options.appendChild(btn);
            }
          });
          break;
        case "drag_drop": {
          const assignment = document.createElement("div");
          assignment.className = "assignment-container";

          const items = ["Antwort A", "Antwort B", "Antwort C", "Antwort D"]
            .filter(key => q[key] && q[key].trim() !== "");
          if (items.length === 0) {
            const noDataMsg = document.createElement("p");
            noDataMsg.innerText = "Keine Drag & Drop-Daten vorhanden!";
            options.appendChild(noDataMsg);
            return;
          }
          const targets = [...items];
          shuffleArray(targets);

          items.forEach((key, index) => {
            const pair = document.createElement("div");
            pair.className = "assignment-pair";

            const item = document.createElement("div");
            item.className = "draggable-item";
            item.innerText = q[key];
            item.id = `item-${index}`;
            item.draggable = true;
            item.addEventListener("dragstart", ev => {
              ev.dataTransfer.setData("text", item.id);
              ev.dataTransfer.effectAllowed = "move";
            });

            const target = document.createElement("div");
            target.className = "target-zone";
            target.dataset.correct = q[targets[index]];
            target.addEventListener("dragover", ev => {
              ev.preventDefault();
              target.classList.add("hover");
              ev.dataTransfer.dropEffect = "move";
            });
            target.addEventListener("dragleave", () => {
              target.classList.remove("hover");
            });
            target.addEventListener("drop", ev => {
              ev.preventDefault();
              target.classList.remove("hover");
              const text = ev.dataTransfer.getData("text");
              const source = document.getElementById(text);
              if (source) {
                target.innerText = source.innerText;
                if (source.innerText === target.dataset.correct) {
                  target.style.backgroundColor = "#a4f9a4";
                } else {
                  target.style.backgroundColor = "#f9a4a4";
                }
                source.style.visibility = "hidden";
              }
            });

            pair.appendChild(item);
            pair.appendChild(target);
            assignment.appendChild(pair);
          });
          options.appendChild(assignment);

          const checkBtn = document.createElement("button");
          checkBtn.innerText = "Antwort prüfen";
          checkBtn.onclick = () => {
            const targetZones = Array.from(assignment.querySelectorAll(".target-zone"));
            let correctCount = 0;
            targetZones.forEach(tz => {
              if (tz.innerText === tz.dataset.correct) {
                correctCount++;
              }
            });
            const isCorrect = (correctCount === targetZones.length);
            checkAnswer(isCorrect ? "Richtig" : "Falsch", q, false, "drag_drop");
          };
          options.appendChild(checkBtn);
          break;
        }
      }
    }

    function createLueckentext(q) {
      const options = document.getElementById("options");
      const questionLabel = document.createElement("div");
      questionLabel.style.fontWeight = "bold";
      questionLabel.style.marginBottom = "5px";
      questionLabel.innerText = q.Frage || "Lückentext-Frage?";
      options.appendChild(questionLabel);

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Fehlendes Wort...";
      options.appendChild(input);

      const btnL = document.createElement("button");
      btnL.innerText = "Antwort prüfen";
      btnL.onclick = () => { checkAnswer(input.value.trim(), q, false, "lueckentext"); };
      options.appendChild(btnL);
    }

    function createOpenQuestion(q) {
      const options = document.getElementById("options");
      const txt = document.createElement("textarea");
      txt.classList.add("open-question-textarea");
      txt.placeholder = "Gebe hier deine Antwort ein...";
      options.appendChild(txt);

      const checkBtn = document.createElement("button");
      checkBtn.innerText = "Antwort überprüfen";
      checkBtn.onclick = () => { checkAnswer(txt.value.trim(), q, true, "open_question"); };
      options.appendChild(checkBtn);

      txt.addEventListener("keydown", (ev) => {
        if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
          ev.preventDefault();
          checkBtn.click();
        }
      });
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // checkAnswer-Funktion
    function checkAnswer(userAnswer, question, userCanSelfAccept, type) {
      const explanationContainer = document.getElementById("explanationContainer");
      const explanationText = document.getElementById("explanationText");
      const approveBtn = document.getElementById("approveBtn");
      const rejectBtn = document.getElementById("rejectBtn");
      const nextBtn = document.getElementById("nextBtn");

      if (explanationContainer.style.display === "block") {
        return;
      }

      explanationContainer.style.display = "block";
      explanationText.innerHTML = "";

      if (type === "open_question") {
        nextBtn.style.display = "none";
        approveBtn.style.display = "inline-block";
        rejectBtn.style.display = "inline-block";

        const correctAnswer = question["Richtige Antwort"] || "";
        let msg = `
          <strong>Eingegebene Antwort:</strong><br>${userAnswer || "(leer)"}<br><br>
          <strong>Richtige Antwort:</strong><br>${correctAnswer}<br><br>
        `;
        let erk = "";
        if (question["Begründung"]) {
          erk = question["Begründung"];
        } else if (question["Erklärtext"]) {
          erk = question["Erklärtext"];
        }
        if (erk.trim() !== "") {
          msg += `<strong>Erklärung:</strong><br>${erk}`;
        }
        explanationText.innerHTML = msg;
      } else {
        nextBtn.style.display = "block";
        approveBtn.style.display = "none";
        rejectBtn.style.display = "none";

        let msg = "";
        const correctAnswer = question["Richtige Antwort"] || "";
        let isCorrect = false;

        if (correctAnswer) {
          isCorrect = (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim());
        }

        if (type === "multiple_choice") {
          msg = isCorrect ? `✅ <strong>Richtig!</strong><br><br>` : `❌ <strong>Falsch!</strong><br><br>`;
        } else {
          msg = isCorrect ? `✅ <strong>Richtig!</strong><br>` : `❌ <strong>Falsch!</strong><br>`;
        }

        if (!isCorrect && type === "lueckentext") {
          msg += `Eingegebene Antwort:<br>${userAnswer}<br><br>`;
          msg += `Richtige Antwort:<br>${correctAnswer}<br><br>`;
        }

        let erk = "";
        if (question["Begründung"]) {
          erk = question["Begründung"];
        } else if (question["Erklärtext"]) {
          erk = question["Erklärtext"];
        }
        if (erk.trim() !== "") {
          msg += (type === "multiple_choice") 
            ? `<strong>Erklärung:</strong><br>${erk}`
            : `Erklärung:<br>${erk}`;
        }
        explanationText.innerHTML = msg;

        const qId = question.id != null ? question.id : currentIndex;
        const wasAlreadyAnswered = alreadyAnsweredQuestionIds.includes(qId);

        if (!wasAlreadyAnswered) {
          if (isCorrect) {
            roundCoins++;
            totalCoins++;
            showCoinChange(+1, document.getElementById("totalCoins").parentElement);
            showCoinChange(+1, document.getElementById("roundCoins").parentElement);

            xp += 10;
            answeredCorrectly[currentIndex] = true;
            document.getElementById("xpValue").innerText = xp;
            showXPChange(10);
          } else {
            if (roundCoins > 0) {
              roundCoins--;
              showCoinChange(-1, document.getElementById("roundCoins").parentElement);
            }
            if (totalCoins > 0) {
              totalCoins--;
              showCoinChange(-1, document.getElementById("totalCoins").parentElement);
            }
          }
          alreadyAnsweredQuestionIds.push(qId);
          markQuestionAsAnsweredInSupabase(getWixUserId(), qId);
          updateUserStatsInSupabase(getWixUserId(), xp, totalCoins, streak);
        }
        document.getElementById("roundCoins").innerText = roundCoins;
        document.getElementById("totalCoins").innerText = totalCoins;
      }
    }

    // Approve/Reject für offene Frage
    document.getElementById("approveBtn").onclick = () => {
      handleOpenQuestionResult(true);
    };
    document.getElementById("rejectBtn").onclick = () => {
      handleOpenQuestionResult(false);
    };
    function handleOpenQuestionResult(isApproved) {
      const q = questions[currentIndex];
      const qId = q.id != null ? q.id : currentIndex;
      const wasAlreadyAnswered = alreadyAnsweredQuestionIds.includes(qId);

      if (!wasAlreadyAnswered) {
        if (isApproved) {
          xp += 10;
          answeredCorrectly[currentIndex] = true;
          document.getElementById("xpValue").innerText = xp;
          showXPChange(10);

          roundCoins++;
          totalCoins++;
          document.getElementById("roundCoins").innerText = roundCoins;
          document.getElementById("totalCoins").innerText = totalCoins;
          showCoinChange(+1, document.getElementById("totalCoins").parentElement);
          showCoinChange(+1, document.getElementById("roundCoins").parentElement);
        } else {
          if (roundCoins > 0) {
            roundCoins--;
            showCoinChange(-1, document.getElementById("roundCoins").parentElement);
          }
          if (totalCoins > 0) {
            totalCoins--;
            showCoinChange(-1, document.getElementById("totalCoins").parentElement);
          }
          document.getElementById("roundCoins").innerText = roundCoins;
          document.getElementById("totalCoins").innerText = totalCoins;
        }
        alreadyAnsweredQuestionIds.push(qId);
        markQuestionAsAnsweredInSupabase(getWixUserId(), qId);
        updateUserStatsInSupabase(getWixUserId(), xp, totalCoins, streak);
      }
      setTimeout(() => {
        nextQuestion();
      }, 800);
    }

    document.getElementById("nextBtn").onclick = () => {
      nextQuestion();
    };
    function nextQuestion() {
      currentIndex++;
      showQuestion();
    }

    document.getElementById("repeatBtn").onclick = () => {
      resetQuiz();
    };
    document.getElementById("continueBtn").onclick = () => {
      resetQuiz();
    };

    function resetQuiz() {
      currentIndex = 0;
      roundCoins = 0;
      totalCoins = 100;
      xp = 0;
      answeredCorrectly = new Array(questions.length).fill(false);
      alreadyAnsweredQuestionIds = [];
      document.getElementById("roundCoins").innerText = roundCoins;
      document.getElementById("totalCoins").innerText = totalCoins;
      document.getElementById("xpValue").innerText = xp;
      document.getElementById("repeatBtn").style.display = "none";
      document.getElementById("endScreen").style.display = "none";
      showQuestion();
    }

    function updateProgressBar() {
      const total = questions.length;
      const pb = document.getElementById("progress-bar");
      const progressInfo = document.getElementById("progressInfo");
      if (total === 0) {
        pb.style.width = "0%";
        progressInfo.innerText = "Frage 0 von 0";
        return;
      }
      const percent = ((currentIndex + 1) / total) * 100;
      pb.style.width = percent + "%";
      progressInfo.innerText = `Frage ${currentIndex + 1} von ${total}`;
    }

    function showCoinChange(amount, element) {
      const coinChange = document.createElement("div");
      coinChange.classList.add("coin-change");
      if (amount < 0) {
        coinChange.classList.add("negative");
        coinChange.innerText = amount;
      } else {
        coinChange.classList.add("positive");
        coinChange.innerText = `+${amount}`;
      }
      element.appendChild(coinChange);
      setTimeout(() => {
        element.removeChild(coinChange);
      }, 2000);
    }

    function showXPChange(amount) {
      const xpBox = document.getElementById("xpBox");
      const xpChange = document.createElement("div");
      xpChange.classList.add("xp-change");
      xpChange.textContent = `+${amount}`;
      xpBox.appendChild(xpChange);
      setTimeout(() => {
        xpBox.removeChild(xpChange);
      }, 2000);
    }

    function updateEndScreen() {
      const endScreen = document.getElementById("endScreen");
      const circleBar = document.getElementById("circleBar");
      const xpText = document.getElementById("xpText");
      const coinBalance = document.getElementById("coinBalance");
      const medalInfo = document.getElementById("medalInfo");

      let netCoins = totalCoins - 100;
      let coinMsg = "";
      if (netCoins > 0) {
        coinMsg = `Münzen-Bilanz: +${netCoins} 🪙`;
      } else if (netCoins < 0) {
        coinMsg = `Münzen-Bilanz: ${netCoins} 🪙`;
      } else {
        coinMsg = `Münzen-Bilanz: 0 🪙`;
      }
      coinBalance.textContent = coinMsg;

      xpText.textContent = `${xp} / ${xpGoal} XP`;

      circleBar.setAttribute("stroke-dasharray", `0, ${halfCircleCircumference}`);
      const finalProgress = (xp / xpGoal) * halfCircleCircumference;
      let current = 0;
      const steps = 50;
      const stepValue = finalProgress / steps;
      let stepCount = 0;

      const animate = setInterval(() => {
        stepCount++;
        current += stepValue;
        if (stepCount >= steps) {
          current = finalProgress;
          clearInterval(animate);
        }
        circleBar.setAttribute("stroke-dasharray", `${current}, ${halfCircleCircumference}`);
      }, 20);

      document.getElementById("repeatBtn").style.display = "none";
      document.getElementById("continueBtn").style.display = "inline-block";

      let correctCount = answeredCorrectly.filter(Boolean).length;
      let totalCount = questions.length;
      let percent = (correctCount / totalCount) * 100;
      let medal = "";
      if (percent === 100) {
        medal = "Gold";
      } else if (percent >= 75) {
        medal = "Silber";
      } else if (percent >= 50) {
        medal = "Bronze";
      } else {
        medal = "Keine Medaille";
      }
      if (medal !== "Keine Medaille") {
        medalInfo.textContent = `Herzlichen Glückwunsch! Du hast eine ${medal}-Medaille verdient (${Math.round(percent)}%).`;
      } else {
        medalInfo.textContent = `Du hast ${Math.round(percent)}% richtig – keine Medaille diesmal.`;
      }
      handleStreak(getWixUserId(), correctCount);
    }

  })();
</script>
</body>
</html>