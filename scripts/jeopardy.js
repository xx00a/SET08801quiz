
// set timer
let currentTime = new Date();
let countDownTime = new Date();
countDownTime.setTime(currentTime.getTime() + 90000);


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