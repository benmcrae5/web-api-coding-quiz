

let mainSection = document.querySelector("#main-content");
let timerEl = document.getElementById("timer");
let gameMessage = mainSection.querySelector(".game-msg");

let questions = [
    {q:"The condition of an if statement is enclosed with what?", a1:"[]", a2:"{}", a3:"()", a4:"''", correct: 3,},
    {q:"Arrays in Javascript can be used to store which of the following:", a1:"strings", a2:"numbers", a3:"objects", a4:"all of the above", correct: 4},
    {q:"'DOM' stands for what?", a1:"Dimming Object Mode", a2:"Document Object Model", a3:"Damaged Object Marker", a4:"Document Object Modification", correct: 2},
    {q:"What is an appropriate way to access an HTML element with the class 'primary'?", a1:"getElementsByClassName('primary')", a2:"querySelector('.primary')", a3:"closest('.primary')", a4:"All of the Above", correct: 4},
    {q:"Strings must be enclosed in _______ when being assigned to variables", a1:"Quotations", a2:"Parenthesis", a3:"Curly Brackets", a4:"None of the Above", correct: 1},
    {q:"How would you access the 5th element in an array named 'dogs'?", a1:"dog[5]", a2:"dogs[5]", a3:"dog[4]", a4:"dogs[4]", correct: 4},
    {q:"What is the best method for cycling through an array?", a1:"While Loop", a2:"For Loop", a3:"Pop() method", a4:"Any method that gets the job done", correct: 4},
];


let loading = function() {
    scoreChart = localStorage.getItem("scoreChart");
    if (scoreChart) {
        scoreChart = scoreChart.split(",");
        for (let i = 0; i < scoreChart.length; i++) {
            scoreChart[i] = scoreChart[i].split("^");
            scoreArray[i] = parseInt(scoreChart[i][1]);
        }
        scoreChart.pop();
        scoreArray.pop();
        console.log(scoreChart);
        console.log(scoreArray);
    } else {
        scoreChart = "";
    }
}

let saving = function(newEntry) {
    for (let i = 0; i < scoreChart.length; i++) {
        scoreChart[i] = scoreChart[i].join("^");
    }
    scoreChart.join();
    if(newEntry) {
        scoreChart += ","+ newEntry;
    }
    console.log(scoreChart);
    localStorage.setItem("scoreChart", scoreChart);
}

let score = 0;
let scoreChart="BBM^10,BGM^7,BEM^4,";
let scoreArray = [];
loading();

let timerValue = 60;
let timerTick;

let removeContent = function(contentSelector) {
    let pageContent = document.querySelector(contentSelector);
    if(pageContent) {
        pageContent.remove();
    }
}

//good
let createQuestion = function(questionNumber) {
    let questionDiv = document.createElement("div");
    questionDiv.className = "quelement removable";
    questionDiv.setAttribute("data-q-num", questionNumber);
    let questionContent = document.createElement("h3");
    questionContent.textContent = questions[questionNumber].q;
    questionDiv.appendChild(questionContent);
    for (let i = 0; i < 4; i++) {
        let answerButton = document.createElement("button");
        let answerID = ("a" + (i + 1));
        answerButton.id = answerID;
        if (answerID === ("a" + questions[questionNumber].correct)) {
            answerButton.setAttribute("correct", true);
        } else {
            answerButton.setAttribute("correct", false);
        }
        answerButton.className = "answer-btn";
        answerButton.textContent = questions[questionNumber][answerID];
        questionDiv.appendChild(answerButton);
    }
    mainSection.appendChild(questionDiv);

    mainSection.addEventListener("click", checkAnswer);
}

//Needs work, needs to connect to things
let startTimer = function() {
    timerEl.textContent = timerValue;
    timeLeft = parseInt(timerValue);

    timerTick = setInterval( function () {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerTick);
            timerEl.textContent = "Out of TIME!!";
            removeContent(".removable");
            endQuiz();
        }
    }, 1000);
}

let scoreTheRound = function() {
    let playerName = prompt("Please enter your name: \n(If left blank, your score will not be saved!)");
    if (playerName) {
        let thisEntry = playerName + "^" + score + ",";
        console.log(thisEntry);
        loading();
        if (scoreArray.length < 10) {
            saving(thisEntry);
        } else if (score > Math.min.apply(null, scoreArray)) {
            for (let i = 0; i < scoreArray.length;i++){
                console.log("i="+i+"\nscoreChart[i][1]="+scoreChart[i][1]+"\nMath.min.apply(null, scoreArray)="+Math.min.apply(null, scoreArray))
                if (parseInt(scoreChart[i][1]) === Math.min.apply(null, scoreArray)) {
                    scoreChart.splice(i, 1);
                    break;
                } 
            }
            saving(thisEntry);
        } else {
            window.alert("Sorry, your score is not in the top 10 =(");
        }
    }
}

let endQuiz = function() {
    scoreTheRound();
    
    let finalScreen = document.createElement("div");
    finalScreen.className = "final-screen removable";

    let finalTitle = document.createElement("h3");
    finalTitle.textContent = "Your Score is :";
    finalScreen.appendChild(finalTitle);

    let finalScore = document.createElement("h4");
    finalScore.textContent = score;
    finalScreen.appendChild(finalScore);

    let scoreButton = document.createElement("button");
    scoreButton.className = "score-btn";
    scoreButton.innerHTML = "High Scores";
    finalScreen.appendChild(scoreButton);

    let restartButton = document.createElement("button");
    restartButton.className = "restart-btn";
    restartButton.textContent = "Restart Quiz";
    finalScreen.appendChild(restartButton);

    mainSection.appendChild(finalScreen);

    finalScreen.querySelector(".score-btn").addEventListener("click", seeScores);
    finalScreen.querySelector(".restart-btn").addEventListener("click", startQuiz);
}

//Working
let checkAnswer = function(event) {
    let chosenAnswer = event.target;

    if(chosenAnswer.matches(".answer-btn")) {
        let questionNum = chosenAnswer.closest(".quelement").getAttribute("data-q-num");
        //console.log("Q-Num: " + questionNum);
        let correctAns = chosenAnswer.getAttribute("correct");
        //console.log(correctAns);
        if (correctAns === "true") {
            gameMessage.textContent = "Good Job!";
            score++;    
        } else {
            gameMessage.textContent = "Incorrect";
            timeLeft -= 5;
            if (timeLeft <= 0) {
                clearInterval(timerTick);
                timerEl.textContent = "Out of time!!!";
                removeContent(".removable");
                endQuiz();
            }
        }

        questionNum++;

        removeContent(".removable");

        if (questionNum < questions.length) {
            createQuestion(questionNum);
        } else {
            clearInterval(timerTick);
            timerEl.textContent = "You've Finished!";
            endQuiz();
        };
    }
}

//on clicking the start button, starts timer, removes opening page, begins quiz cycle
let startQuiz = function() {
    score = 0;
    startTimer();
    removeContent(".removable");
    createQuestion(0);  
}

let seeScores = function(event) {
    event.preventDefault();

    removeContent(".removable");

    let scoreScreen = document.createElement("div");
    scoreScreen.className = "scores removable";

    let scoreTitle = document.createElement("h2");
    scoreTitle.textContent = "High Scores";
    scoreScreen.appendChild(scoreTitle);

    //add up to 10 elements from storage for score board
    loading();
    for (let i = 0; i < scoreChart.length; i++) {
        let topScores = document.createElement("h3");
        topScores.className = "top-score";
        topScores.textContent = scoreChart[i][0] + " ---> " + scoreChart[i][1];

        scoreScreen.appendChild(topScores);
    }
    saving();

    let scoreButton = document.createElement("button");
    scoreButton.className = "score-btn";
    scoreButton.innerHTML = "High Scores";
    scoreScreen.appendChild(scoreButton);

    let restartButton = document.createElement("button");
    restartButton.className = "restart-btn";
    restartButton.textContent = "Restart Quiz";
    scoreScreen.appendChild(restartButton);

    mainSection.appendChild(scoreScreen);

    scoreScreen.querySelector(".score-btn").addEventListener("click", seeScores);
    scoreScreen.querySelector(".restart-btn").addEventListener("click", startQuiz);
}

document.querySelector("#start-btn").addEventListener("click", startQuiz);
document.querySelector(".score").addEventListener("click", seeScores);

