

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

function fillResults()
{
    const theArticle = document.querySelector('article');

    const aHeader = document.createElement('h1');
    const aTable = document.createElement('table');



    // fill out information as needed

    aHeader.textContent = "Results";

    theArticle.appendChild(aHeader);

    // let's build our headers
    const aHRow = document.createElement('thead');
    const aHTRow = document.createElement('tr');

    const aHCellR = document.createElement('th');
    const aHCell1 = document.createElement('th');
    const aHCell2 = document.createElement('th');
    const aHCell3 = document.createElement('th');
    const aHCell4 = document.createElement('th');
    const aHCell5 = document.createElement('th');

    aHCellR.textContent = 'Ranking';
    aHCell1.textContent = 'Score';
    aHCell2.textContent = 'Questions';
    aHCell3.textContent = 'Name';
    aHCell4.textContent = 'Date';
    aHCell5.textContent = 'Time';

    aHTRow.appendChild(aHCellR);
    aHTRow.appendChild(aHCell1);
    aHTRow.appendChild(aHCell2);
    aHTRow.appendChild(aHCell3);
    aHTRow.appendChild(aHCell4);
    aHTRow.appendChild(aHCell5);
    aHRow.appendChild(aHTRow);
    aTable.appendChild(aHRow);

    // let's build rows of cookie values
    for (let i = 0; i < 10; i++) {

        const aRow = document.createElement('tr');
        const aCellR = document.createElement('td');
        const aCell1 = document.createElement('td');
        const aCell2 = document.createElement('td');
        const aCell3 = document.createElement('td');
        const aCell4 = document.createElement('td');
        const aCell5 = document.createElement('td');

        if  (typeof cookieRead('scoreboard_'+i+'_score') !== 'undefined') {

            aCellR.textContent = i + 1;
            aCell1.textContent = '£' + cookieRead('scoreboard_' + i + '_score');
            aCell2.textContent = cookieRead('scoreboard_' + i + '_questions') + ' completed';
            aCell3.textContent = cookieRead('scoreboard_' + i + '_name');
            aCell4.textContent = cookieRead('scoreboard_' + i + '_date');
            aCell5.textContent = cookieRead('scoreboard_' + i + '_time') + ' seconds';
        }
        else {
            aCellR.textContent = i + 1;
            aCell1.textContent = '';
            aCell2.textContent = '';
            aCell3.textContent = '';
            aCell4.textContent = '';
            aCell5.textContent = '';

        }

        aRow.appendChild(aCellR);
        aRow.appendChild(aCell1);
        aRow.appendChild(aCell2);
        aRow.appendChild(aCell3);
        aRow.appendChild(aCell4);
        aRow.appendChild(aCell5);

        aTable.appendChild(aRow);

    }


    theArticle.appendChild(aTable);



}

function gameSet(name)
{

    cookieSet("game_number",Math.random()*10000000);
    cookieSet("game_name",name);

    alert(cookieRead("game_number"));

    window.location = "game_do.html";
}