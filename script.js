async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let I = 0; I < includeElements.length; I++) {
        const element = includeElements[I];
        file = element.getAttribute('w3-include-html');   // „includes/header.html“*
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


let questions = [
    {
        "question": "Wie viel Zeit ihres Lebens verbringen Katzen mit Schlafen und Dösen?",
        "answer_1": "Zwei Drittel",
        "answer_2": "Ein Drittel",
        "answer_3": "90 Prozent",
        "right_answer": 1
    },
    {
        "question": "Katzen können sehr weit und auch hoch springen. Wie hoch können sie maximal springen?",
        "answer_1": "3-fache Körperhöhe",
        "answer_2": "Doppelte Körperhöhe",
        "answer_3": "5-fache Körperhöhe",
        "right_answer": 3
    },
    {
        "question": "Katzen sind in Nullkommanix auf dem Baum. Beim Abstieg tun sie sich oft etwas schwer, kopfüber geht es gar nicht. Wissen Sie woran das liegt?",
        "answer_1": "Kopfüber wird Katzen schwindelig",
        "answer_2": "Form der Krallen funktioniert nur beim Aufstieg",
        "answer_3": "Niemand steigt mit dem Kopf zuerst irgendwo herunter",
        "right_answer": 2
    },
    {
        "question": "Katzen werden locker 15 Jahre alt. Wie alt war Creme Puff aus Texas, die Katze mit den bislang meisten Jahren auf dem Katzenbuckel?",
        "answer_1": "38 Jahre",  
        "answer_2": "56 Jahre",  
        "answer_3": "25 Jahre",  
        "right_answer": 1
    }
];


let rightQuestions = 0;
let currentQuestion = 0;
let AUDIO_SUCCESS = new Audio('audio/correct.mp3');
let AUDIO_FAIL = new Audio('audio/wrong.mp3');
let AUDIO_FINISHED = new Audio('audio/finished.mp3');


function init() {
    document.getElementById('all-questions').innerHTML = questions.length;

    showQuestion();
}


function showQuestion() {

    if (gameIsOver()) {                                                        
        showEndScreen();  
    } else { 
        updateProgressbar();  
        updateToNextQuestion();
    }
}


function gameIsOver() {
    return currentQuestion >= questions.length;
}


function showEndScreen() {
    AUDIO_FINISHED.play();
    document.getElementById('end-screen').style = '';  // die div mit der id=end-screen im html wird eigeblendet
    document.getElementById('question-body').style = 'display: none';  // und diese div mit der id=question-body wird ausgeblendet

    document.getElementById('amount-of-questions').innerHTML = questions.length;
    document.getElementById('aomunt-of-right-questions').innerHTML = rightQuestions;
    document.getElementById('header-image').src = 'img/done.jpg';
}


function updateProgressbar() {
    let percent = (currentQuestion + 1) / questions.length;  //  aktuelle Frage bei der wir gerade sind geteilt durch Gesamtzahl der Fragen =>  1:4, 2:4, 3:4, 4:4
    percent = percent * 100;       // 1:4=0,25 alos müssen wir das noch mal 100 nehmen => 0,25*100=25    falls es nach der Kommastelle mehr als 3 Zahlen gibt dann kann man das abrunden indem man percent = Math.round(percent * 100); schreibt
        
    document.getElementById('progress-bar').innerHTML = `${percent}%`;   
    document.getElementById('progress-bar').style = `width: ${percent}%;`;  
}


function updateToNextQuestion() {
     let question = questions[currentQuestion];

    document.getElementById('question-number').innerHTML = currentQuestion + 1;  // hier wird die Nummer der aktuellen Frage angezeigt, z. B. 1 von 4
    document.getElementById('questiontext').innerHTML = question['question'];
    document.getElementById('answer-1').innerHTML = question['answer_1'];
    document.getElementById('answer-2').innerHTML = question['answer_2'];
    document.getElementById('answer-3').innerHTML = question['answer_3'];
}


function answer(selection) {
    let question = questions[currentQuestion];
    let selectedQuestionNumber = selection.slice(-1);
    let idOfRightAnswer = `answer-${question['right_answer']}`;
    

    if (selectedQuestionNumber == question['right_answer']) {   // richtige Frage beantwortet
        document.getElementById(selection).parentNode.classList.add('bg-success');
        AUDIO_SUCCESS.play();
        rightQuestions++;
    } else {
        document.getElementById(selection).parentNode.classList.add('bg-danger');
        document.getElementById(idOfRightAnswer).parentNode.classList.add('bg-success');
        AUDIO_FAIL.play();
    }
    document.getElementById('next-button').disabled = false; // wenn man eine Antwort ausgewählt hat somit ist der Button nicht deaktiviert und man kann zur nächsten Frage gelangen
}


function nextQuestion() {
    currentQuestion++;    // Variable wird erhöht z. B. von 0 auf 1 
    document.getElementById('next-button').disabled = true;  // damit ist der Button wieder deaktiviert
    resetAnswerButton();
    showQuestion();    // diese Funktion wird erneut ausgeführt und somit die nächste Frage angezeigt
}


function resetAnswerButton() {
    document.getElementById('answer-1').parentNode.classList.remove('bg-danger');
    document.getElementById('answer-1').parentNode.classList.remove('bg-success');
    document.getElementById('answer-2').parentNode.classList.remove('bg-danger');
    document.getElementById('answer-2').parentNode.classList.remove('bg-success');
    document.getElementById('answer-3').parentNode.classList.remove('bg-danger');
    document.getElementById('answer-3').parentNode.classList.remove('bg-success');
}


function restartGame() {
    document.getElementById('header-image').src = 'img/quiz.jpg';  // Annfangsbild wird wieder angezeigt
    document.getElementById('question-body').style = '';  // question-body wieder anzeigen
    document.getElementById('end-screen').style = 'display: none';  // end-screen ausblenden

    rightQuestions = 0;
    currentQuestion = 0;
    init();
}