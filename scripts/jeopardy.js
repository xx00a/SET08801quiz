
// set timer
let currentTime = new Date();
let countDownTime = new Date();
countDownTime.setTime(currentTime.getTime() + 90000);


let timer = setInterval( function () {

        let currentTime = new Date().getTime();
        let delta = currentTime - countDownTime;
        let secondsRemain = Math.floor(delta / 1000);

        if (secondsRemain < 0)
        {
            // valid time
            document.getElementById("app_countdown").innerHTML = Math.abs(secondsRemain) + " seconds remaining.";
        }
        else
        {
            clearInterval();
            document.getElementById("app_countdown").innerHTML = (secondsRemain) + " seconds remaining.";

        }


    }
    ,1000);



function startGame(name,gameNumber)
{
    ///
    window.location = "game_do.html";
}


function countDown()
{
    alert(countDownTime);
    // create a two minute time
    //const theDate = new Date();
    //theDate.setTime(theDate.getTime() + 2592000000)
}