
// global variables and default data for the game session
let currentGameName = cookieRead('game_name');
let currentGameNo = cookieRead('game_number') + '_';
let currentQuestion = 0;
let currentScore = 0;
let currentAnswer = "";
let currentSeconds = 0;
let currentValue = 0;
let questionsExhausted = false;
let inPlay = false;
let questionsComplete = [false,false,false,false,false,false,false,false,false,false,false];
let questionsTime = [0,0,0,0,0,0,0,0,0,0,0];
let globalScoreboard = [
    // final score, questions answered, name, date/time, time taken
    [0,0,'Name','Date/Time',0],
    [0,0,'Name','Date/Time',0],
    [50,0,'Name','Date/Time',0],
    [0,0,'Name','Date/Time',0],
    [70,0,'Name','Date/Time',0],
    [0,0,'Name','Date/Time',0],
    [30,0,'Name','Date/Time',0],
    [0,0,'Name','Date/Time',0],
    [10,0,'Name','Date/Time',0],
    [0,0,'Name','Date/Time',0],
];

// end of variables

if (isNaN(currentQuestion))
{
    currentQuestion = 1;
}

if (isNaN(currentScore))
{
    currentScore = 0;
}

// global function
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

// set timer
let currentTime = new Date();
let countDownTime = new Date();
//countDownTime.setTime(currentTime.getTime() + 800000);

let globalTimer;

function countDown()
{
        let currentIntTime = new Date().getTime();
        let delta = currentIntTime - countDownTime;
        let secondsRemain = Math.floor(delta / 1000);
        let absSecondsRemain = Math.abs(secondsRemain);

        if (absSecondsRemain < 15)
        {
                document.getElementById("app_msg").style.color = "red";
        }

        if (absSecondsRemain > 0)
        {
            // valid time
            currentSeconds = 30 - absSecondsRemain;
            document.getElementById("app_msg").innerText = absSecondsRemain + " seconds remain";
        }
        else
        {
            // we submit the answer for them
            currentSeconds = 30;
            submitQuestion();
        }

}


function startGame(name,gameNumber) {

    playQuestion(1);

}

function playQuestion(questionNo)
{
    let activeQuestionNo = -2;

    if (isNaN(questionNo))
    {
        // let's determine the next free question to select
        let qLen = questionsComplete.length;

        for (let i = 1; i < qLen; i++) {
            if (questionsComplete[i] === false)
            {
                //alert('i = '+i);
                activeQuestionNo = i;
                break;
            }
        }

    }
    else
    {
        // let's confirm if the question has been completed already
        activeQuestionNo = questionNo;

        if (questionsComplete[activeQuestionNo] === true)
        {
            activeQuestionNo = -1;
        }
        else
        {
            //alert('moving to requested question ('+activeQuestionNo+')');

        }
    }

    switch (activeQuestionNo)
    {
        case -2:
            // the game is over
            finishGame();
            break;
        case -1:
            // they've already answered the question
            alert("This question has already been answered. Please select another question.");
            break;
        default:
            // show the question

            if (inPlay)
            {
                alert("You need to answer the question before choosing a new question.");
            }
            else
            {
                // reset time variables
                currentTime = new Date();
                countDownTime = new Date();
                countDownTime.setTime(currentTime.getTime() + 30000);

                // update current question
                currentQuestion = activeQuestionNo;

                // startTheGame
                doQuestion(currentQuestion);
                cookieSet(currentGameNo + "app-game-question",currentQuestion);

            }

            break;
    }
}

function finishGame()
{
    // let's sum our values up
    let qCLen = questionsComplete.length;
    let qTLen = questionsTime.length;
    let sBLen = globalScoreboard.length;

    let sumQuestions = 0;
    let sumScore = currentScore;
    let sumTime = 0;

    // how many questions answered?
    for (let i = 1; i < qCLen; i++) {
        if (questionsComplete[i] === true)
        {
            sumQuestions = sumQuestions +1;
        }
    }

    // total seconds
    for (let i = 1; i < qTLen; i++) {
        sumTime = sumTime + questionsTime[i];
    }

    // let's read our master cookies, put them in an array and sort
    for (let i = 0; i < sBLen; i++) {
        // final score, questions answered, name, date/time, time taken
       /* globalScoreboard[i][0] = parseInt(cookieRead('scoreboard_'+i+'_score'));
        globalScoreboard[i][1] = parseInt(cookieRead('scoreboard_'+i+'_questions'));
        globalScoreboard[i][2] = cookieRead('scoreboard_'+i+'_name');
        globalScoreboard[i][3] = cookieRead('scoreboard_'+i+'_date');
        globalScoreboard[i][4] = parseInt(cookieRead('scoreboard_'+i+'_time')); */
    }

    // sort results
    globalScoreboard.sort(function(a,b) {return b[0]-a[0]});

    // let's add our latest result if the lowest value is higher
    let tempLowestScore = globalScoreboard[9][0];

    if (isNaN(tempLowestScore)) { tempLowestScore = 0; }

    if (sumScore > tempLowestScore)
    {
        let winDate = new Date();
        globalScoreboard[9][0] = sumScore;
        globalScoreboard[9][1] = sumQuestions;
        globalScoreboard[9][2] = currentGameName;
        globalScoreboard[9][3] = winDate.toUTCString();
        globalScoreboard[9][4] = sumTime;
    }

    // let's write our scoreboard to... cookies
    for (let i = 0; i < sBLen; i++) {
        // final score, questions answered, name, date/time, time taken
        cookieSet(currentGameNo+'scoreboard_'+i+'_score',globalScoreboard[i][0]);
        cookieSet(currentGameNo+'scoreboard_'+i+'_questions',globalScoreboard[i][1]);
        cookieSet(currentGameNo+'scoreboard_'+i+'_name',globalScoreboard[i][2]);
        cookieSet(currentGameNo+'scoreboard_'+i+'_date',globalScoreboard[i][3]);
        cookieSet(currentGameNo+'scoreboard_'+i+'_time',globalScoreboard[i][4]);
    }


    console.table(globalScoreboard);

    globalScoreboard.sort(function(a,b) {return b[0]-a[0]});

    console.table(globalScoreboard);

    alert('game over');

    //window.location = "game_finish.html";
}

function doQuestion(questionNo)
{

    // we need to check cookie to see if question has been completed
    let questionDone = cookieRead(currentGameNo+"app-question-"+questionNo+"done");

    if (questionDone === "True")
    {
        // question has already been played
        inPlay = false;

        // update interface to show question played
    }
    else
    {
   // start timer and game
        globalTimer = setInterval( countDown,1000);
        inPlay = true;

        // call jSon data
        const rawQuestionData ='[{"id":115334,"answer":"a Ring","question":"From Topps, this item that you wear on your finger has a \\"gem\\" made of candy","value":400,"airdate":"2013-07-29T12:00:00.000Z","created_at":"2014-02-14T02:44:56.527Z","updated_at":"2014-02-14T02:44:56.527Z","category_id":15727,"game_id":null,"invalid_count":null,"category":{"id":15727,"title":"candy is dandy","created_at":"2014-02-14T02:44:56.145Z","updated_at":"2014-02-14T02:44:56.145Z","clues_count":10}}]';

        const questionData = JSON.parse(rawQuestionData);

        // update current answer - we convert to lower case to make it non-case-sensitive
        currentAnswer = questionData[0]['answer'];

        // update value of answer
        currentValue = questionData[0]['value'];

        //start audio
        document.getElementById("audio-idle").pause();
        document.getElementById("audio-idle").currentTime = 0;
        document.getElementById("audio-idle").play();

        // update interface
        document.getElementById("app_msg").innerText = "30 seconds remain";
        document.getElementById("app_msg").style.color = "green";
        document.getElementById("gameform").style.visibility = "visible";
        document.getElementById("score-total").innerHTML = "Total: £" + currentScore;
        document.getElementById("app_question_no").innerHTML = "Question "+currentQuestion;
        document.getElementById("app_question_cat").innerHTML = "Category is "+titleCase(questionData[0]['category']['title']) + " for £" + questionData[0]['value'];
        document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#F1F9FF";
        document.getElementById("app_question").innerHTML = questionData[0]['question'] + ":";
        document.getElementById("gamenext").style.visibility = "hidden";


    }

}

function submitQuestion () {

    // stop the timer and display
    clearInterval(globalTimer);

    //stop audio
    document.getElementById("audio-idle").pause();
    document.getElementById("audio-idle").currentTime = 0;

    // update interface
    document.getElementById("gameform").style.visibility = "hidden";
    document.getElementById("app_msg").style.color = "black";
    document.getElementById("app_msg").innerHTML = "<strong>The answer is: </strong>" +currentAnswer+"";

    // let's guide the user to end the game
    if (currentQuestion === 10)
    {
        document.getElementById("nextBtn").style.backgroundColor = "green";
        document.getElementById("nextBtn").value = "Finish Game";
    }


    // convert answer for comparison
    let theAnswer = document.getElementsByName('playerResponse')[0].value;
    let currentAnswerTmp = currentAnswer.toLowerCase();

    theAnswer = theAnswer.toLowerCase();

    if (theAnswer === currentAnswerTmp)
    {
        // do celebration
        playWin();

        // update master variables
        document.getElementById("question"+currentQuestion+"_link").innerText = "Question " + currentQuestion + ": £" + currentValue;
        currentScore = currentScore + currentValue;


    }
    else
    {
        // they lose
        playLoser();

        // update master variables
        document.getElementById("question"+currentQuestion+"_link").innerText = "Question " + currentQuestion + ": £0";
        currentScore = currentScore - currentValue;

        if (currentScore < 0) { currentScore = 0; }

    }

    // update score and clear answer
    document.getElementById("score-total").innerHTML = "Total: £" + currentScore;
    document.getElementsByName('playerResponse')[0].value = "";

    if (questionsExhausted)
    {
        document.getElementById("gameend").style.visibility = "visible";
    }
    else
    {
        document.getElementById("gamenext").style.visibility = "visible";
    }

    // update index table
//    alert(currentQuestion + ' = '+questionsComplete[currentQuestion]);



    // let's record our results so we can digest later
    questionsComplete[currentQuestion] = true;
    questionsTime[currentQuestion] = currentSeconds;

    inPlay = false;


}

function playWin()
{
    // update elements
    document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#f1fff8";
    document.getElementById("app_msg").style.color = "green";

    // play winning layer
    document.getElementById("layer-win").style.visibility = "visible";

    //start video
    document.getElementById("video-win").play();

}

function playLoser()
{
    ///
    document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#fff1f1";
    document.getElementById("app_msg").style.color = "red";

    // play winning layer
    document.getElementById("layer-lose").style.visibility = "visible";

    //start video
    document.getElementById("video-lose").play();

}

function hideVideo()
{
    // reset all videos
    document.getElementById("layer-win").style.visibility = "hidden";
    document.getElementById("video-win").pause();
    document.getElementById("video-win").currentTime = 0;

    // reset all videos
    document.getElementById("layer-lose").style.visibility = "hidden";
    document.getElementById("video-lose").pause();
    document.getElementById("video-lose").currentTime = 0;


}
