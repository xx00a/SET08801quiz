
// let's read out cookie to determine what question we are
let currentQuestion = parseInt( cookieRead('app-game-question') );
let currentScore = parseInt( cookieRead('app-game-score') );
let currentAnswer = "";
let currentValue = 0;
let questionsExhausted = false;
let inPlay = false;

// question completion tracker
const questionsComplete = [false,false,false,false,false,false,false,false,false,false,false];


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
            document.getElementById("app_msg").innerText = absSecondsRemain + " seconds remain";
        }
        else
        {
            // we submit the answer for them
            submitQuestion();
        }

}


function startGame(name,gameNumber)
{

    // draw menus
    // read cookie to highlight status

    // draw opening page
    // playIntro();
    cookieSet("intro-played","true");

    // start first availible question (go in a loop to find first quesiton to select)
    // call playQuestion when ready to go
}

function playQuestion(questionNo)
{
    let activeQuestionNo = 1;

    // let's determine the next free question to select
    if (isNaN(questionNo))
    {
        let qLen = questionsComplete.length;


        for (let i = 0; i < qLen; i++) {
            if (questionsComplete[qLen] === true)
            {
                activeQuestionNo = i + 1;
                break;
            }
        }
    }

    alert(activeQuestionNo);




    if (questionNo < 11)
    {
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
            currentQuestion = questionNo;

            // startTheGame
            doQuestion(currentQuestion);
            cookieSet("app-game-question",currentQuestion);

        }

    }
    else
    {
        // let's exit the game
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


    // convert answer for comparison
    let theAnswer = document.getElementsByName('playerResponse')[0].value;
    let currentAnswerTmp = currentAnswer.toLowerCase();

    cookieSet("app-question-"+currentQuestion+"value",theAnswer);
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
    questionsComplete[currentQuestion-1] = true;

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
