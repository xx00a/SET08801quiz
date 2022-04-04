

//// set Cookie value

function cookieSet(name, value)
{
    // create a date +30 days
    const theDate = new Date();
    theDate.setTime(theDate.getTime() + 2592000000)

    //set the cookie
    document.cookie = name + "=" + value + "; expires=" + theDate.toUTCString() + "; path=/";

    //alert(name + "=" + value + "; expires=" + theDate.toUTCString() + "; path=/");

}

function cookieRead(name)
{
    const cookieName = name + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(cookieName) === 0) res = val.substring(cookieName.length);
    })
    return res;

}

function gameSet(name)
{

    cookieSet("game_number",Math.random()*10000000);
    cookieSet("game_name",name);

    alert(cookieRead("game_number"));

    window.location = "game_do.html";
}