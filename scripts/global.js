

//// set Cookie value

function cookieSet(name, value)
{
    // create a date +30 days
    const theDate = new Date();
    theDate.setTime(theDate.getTime() + 2592000000)

    //set the cookie
    document.cookie = name + "=" + value + "; expires=" + theDate.toUTCString() + "; path=/";

    alert(name + "=" + value + "; expires=" + theDate.toUTCString() + "; path=/");

}

function cookieRead(name)
{
    alert(document.cookie.split(";"));

    document.cookie = "username=Debra White; path=/";

    let cookies = document.cookie;
    console.log(cookies);

   // const cookieValue = document.cookie.split(";").find(row => row.startsWith(name + "=")).split("=")[1];

    //return cookieValue;

}