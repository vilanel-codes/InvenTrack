var showbot_conter=0,showpath_conter=0,showstation_conter=0,showcart_conter=0,showmaterial_conter=0,showpeople_conter=0,recordstation_conter=0;
var botrecordstatus=false;
var stationnamecounter;


function recordStation()
{
    recordingstation=!recordingstation;
    
    console.log("hi")
}

function assetsOn(){
    document.getElementById("assetsOn").style.display = "block";
}

function assetsOff(){
    document.getElementById("assetsOn").style.display = "none";
}

function showStation()
{
    // showingstation=!showingstation;
    // console.log("showing", showingbot)
    var showbot_button=document.getElementById("showStation");
    if(showstation_conter%2==0)
    showbot_button.style.color="#2cacbc";
    else
    showbot_button.style.removeProperty("color");

    showstation_conter+=1;
    // console.log("hi")
}

