
// let's read out cookie to determine what question we are
let currentQuestion = parseInt( cookieRead('app-game-question') );
let currentScore = parseInt( cookieRead('app-game-score') );
let currentAnswer = "";
let currentValue = 0;
let inPlay = false;

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
countDownTime.setTime(currentTime.getTime() + 9000);

let globalTimer;

function countDown()
{
        let currentIntTime = new Date().getTime();
        let delta = currentIntTime - countDownTime;
        let secondsRemain = Math.floor(delta / 1000);

        if (secondsRemain < 0)
        {
            // valid time
            document.getElementById("app_countdown").innerHTML = Math.abs(secondsRemain) + " seconds remaining.";
        }
        else
        {
            // we submit the answer for them
            submitQuestion();
        }

}


function startGame(name,gameNumber)
{

}

function playQuestion(questionNo)
{
    ///
    //window.location = "game_do.html";

    if (inPlay)
    {
        alert("You need to answer the question before choosing a new question.");
    }
    else
    {
        // reset time variables

        currentTime = new Date();
        countDownTime = new Date();
        countDownTime.setTime(currentTime.getTime() + 9000);

        // update current question
        currentQuestion = questionNo;

        // startTheGame
        doQuestion(currentQuestion);

    }
}



function doQuestion(questionNo)
{
    // we need to check cookie to see if question has been completed
    let questionDone = cookieRead("app-question-"+questionNo+"done");

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

        // update current answer - we convert to lower case to make it non case sensitive
        currentAnswer = questionData[0]['answer'];
        currentAnswer.toLowerCase();

        // update value of answer
        currentValue = questionData[0]['value'];

        // update interface
        document.getElementById("score-total").innerHTML = "Total: £" + currentScore;
        document.getElementById("score-total").innerHTML = "Total: £" + currentScore;
        document.getElementById("app_question_no").innerHTML = "Question "+currentQuestion;
        document.getElementById("app_question_cat").innerHTML = "Category is "+titleCase(questionData[0]['category']['title']) + " for £" + questionData[0]['value'];
        document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#F1F9FF";
        document.getElementById("app_question").innerHTML = questionData[0]['question'] + ":";

    }



}

function submitQuestion () {

    // stop the timer and display
    clearInterval(globalTimer);
    document.getElementById("app_countdown").innerHTML = "&nbsp;";

    // let's update our answer
    let theAnswer = document.getElementsByName('playerResponse')[0].value;
    cookieSet("app-question-"+currentQuestion+"value",theAnswer);
    theAnswer.toLowerCase();

    if (theAnswer === currentAnswer)
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

    }

    inPlay = false;


}

function playWin()
{
    // update elements
    document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#f1fff8";


    alert("you win");

    // after

}

function playLoser()
{
    ///

    document.getElementById("question"+currentQuestion+"_link").style.backgroundColor = "#fff1f1";


}

