let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
let asset_id;
let showAlert = true
let cameraZoom = 1
let MAX_ZOOM = 5
let MIN_ZOOM = 0.1
let SCROLL_SENSITIVITY = 0.0005
var tag_coordinates={};
var tagids;
var numberoftags;
var img=new Image();
var showingbot=false;
var showingmaterial=false;
var showingpeople=false;
var showingcart=false;
var showingpath=false;
var showingstation=true;
var path_json,station_json;
var recordingstation=false;
var botstation=false;
var station_x,station_y,station_name,record_x,record_y;
var company_a=sessionStorage.getItem("Company");
var image_opacity=0.5;
var windowinnerWidth,windowinnerHeight;
var botid,botname;
var botname_coordinates_x=[];
var botname_coordinates_y=[];
var recording_dist=20;
var timetorecord;


//ASSET FORM
const tagList = document.querySelector("#tag-data");

function renderTag(doc) {

    // CREATING ELEMENTS OF THE TABLE
    let row = document.createElement('tr');
    let recur = document.createElement('td');
    let name = document.createElement('td');
    let date = document.createElement('td');
    
    let remov = document.createElement('td');

    //Timestamp to date and time

    var timestamp = doc.data().installation_date;
    // console.log(doc.data().installation_date)
    var doi = new Date(timestamp);

    let dat = doc.data().installation_date.toDate();
	let mm = dat.getMonth();
	let dd = dat.getDate();
	let yyyy = dat.getFullYear();

	// dat = mm + '/' + dd + '/' + yyyy;
	// console.log(dat)

// console.log("Date: "+doi.getDate()+
//           "/"+(doi.getMonth()+1)+
//           "/"+doi.getFullYear()+
//           " "+doi.getHours()+
//           ":"+doi.getMinutes()+
//           ":"+doi.getSeconds());

    //ASSIGNING DATA TO ELEMENT FROM FIRESTORE
    row.setAttribute('data-id', doc.id);
    recur.textContent = doc.data().recurring_date
    name.textContent = doc.data().name;
    date.textContent = dat;
    

    let dustbin = document.createElement('i');
    dustbin.setAttribute("class", "fa-solid fa-trash-can ");
    // dustbin.setAttribute("onclick","delete()");
    dustbin.setAttribute("id", "delete" + doc.id);
    remov.setAttribute("class", "can");
    remov.appendChild(dustbin);
    // role.textContent = doc.data().role;
    // ADDING ELEMENTS TO ROW
    
    row.appendChild(name);
    row.appendChild(recur);
    row.appendChild(date);
    // row.appendChild(x_cord);
    // row.appendChild(y_cord);
    row.appendChild(remov);

    //ADDING ROW TO TABLE
    tagList.appendChild(row);
   


 

    document.getElementById("delete" + doc.id).addEventListener('click', (e) => {

        e.preventDefault();
        var assetArray = db.collection('companies').doc(company_a).collection('bot').doc('Array');
        assetArray.update({
         assetArray: firebase.firestore.FieldValue.arrayRemove(doc.data().name)
         });
         db.collection('companies').doc(company_a).collection("asset").doc(doc.id).delete().then(function() {
            console.log("profile updated");

            location.reload();
        }).catch(error => {
            console.log(error);
            throw new Error("something happened, see detail log");
        });
        console.log("deleted the asset");



    })




}


// document.getElementById("image"+doc.id).addEventListener('click',(e)=>{
//   alert("hi");
// })

const formAdd = document.querySelector('#newDoc');


function addNewTag() {
    var assetArray = db.collection('companies').doc(company_a).collection('bot').doc('Array');
    assetArray.update({
     assetArray: firebase.firestore.FieldValue.arrayUnion(formAdd.name.value)
     });
     asset_id= formAdd.asset_id.value;
     let date_time= new Date(formAdd.date.value);
     db.collection('companies').doc(company_a).collection("asset").doc(asset_id).set({
      doc_id:formAdd.asset_id.value,
      height: formAdd.height.value,
      info: formAdd.asset_info.value,  
      installation_date:date_time,
      name: formAdd.name.value,
      recurring_date: formAdd.recurring_date.value      

    }).then(function() {
      document.getElementById("overlayAdd").style.display = "none";
      console.log("added the asset");
      // location.href="/visualiser";
      document.getElementById("canvas_div").style.cursor="url('img/shade-logo-cursor.png'),auto";
      
    }).catch(error => {
        console.log(error);
        throw new Error("something happened, see detail log");
    });

}
function CancelTag() {

 
  db.collection('companies').doc(company_a).collection("asset").doc(asset_id).delete().then(function() {
    console.log("profile updated");

    location.reload();
}).catch(error => {
    console.log(error);
    throw new Error("something happened, see detail log");
});
    location.reload();
}

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              console.log(inp.value);
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              var input, filter, table, tr, td, i, txtValue;
              input = inp;
              filter = input.value.toUpperCase();
              table = document.getElementById("myTable");
              tr = table.getElementsByTagName("tr");

              // Loop through all table rows, and hide those who don't match the search query
              for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                  txtValue = td.textContent || td.innerText;
                  if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                  } else {
                    tr[i].style.display = "none";
                  }
                }
              }
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
    
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      
  });
}

let search_array = [];
db.collection('companies').doc(company_a).collection("asset").get().then((snapshots) => {
  snapshots.docs.forEach(docc => {
      search_array.push(docc.data().name);
  })
})

 db.collection('companies').doc(company_a).collection("bot").get().then((snapshots) => {
    snapshots.docs.forEach(doc => {
      
     
    // console.log(search_array);
    db.collection('companies').doc(company_a).collection("bot").doc('Array').update({assetArray: search_array});
        
        // console.log(doc.data().assetArray)
        autocomplete(document.getElementById("myInput"), doc.data().assetArray);
    })
})


db.collection('companies').doc(company_a).collection("asset").get().then((snapshots) => {
    snapshots.docs.forEach(doc => {
        renderTag(doc);
    })
})
//END OF ASSET FORM


if ( navigator.platform != "iPad" && navigator.platform != "iPhone" && navigator.platform != "iPod" ) {
      // windowinnerWidth=window.innerWidth/2.05;
      // windowinnerHeight=window.innerHeight/1.05; 
      windowinnerWidth=window.innerWidth;
      windowinnerHeight=window.innerHeight; 
            //I'll use windowinnerWidth in production
	    } else {
        windowinnerWidth=1000;
        windowinnerHeight=1000; 
	    }

      

let cameraOffset = { x: windowinnerWidth/2, y: windowinnerHeight/2 }

var xflipped=1;
var yflipped=-1;
var scale_factor=sessionStorage.getItem("scale_factor"),origin_x=(sessionStorage.getItem("originx")),origin_y=yflipped*(sessionStorage.getItem("originy"));





function draw()
{
    canvas.width = windowinnerWidth
    canvas.height = windowinnerHeight

    
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    ctx.translate( windowinnerWidth / 2, windowinnerHeight / 2 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate( -windowinnerWidth / 2 + cameraOffset.x, -windowinnerHeight / 2 + cameraOffset.y )
    ctx.clearRect(0,0, windowinnerWidth, windowinnerHeight)

    
    img.src=sessionStorage.getItem("map_url");
    ctx.globalAlpha=image_opacity;
    ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2,img.naturalWidth,img.naturalHeight)
    // ctx.drawImage(img,-1183/2,-635/2,1183,635)
    ctx.globalAlpha=1;
    tagids=Object.keys(tag_coordinates)
    numberoftags= Object.keys(tag_coordinates).length
    // console.log(tagids)
    while(numberoftags!=0)
    {
    
      numberoftags=numberoftags-1
      var xxxx = (xflipped*tag_coordinates[tagids[numberoftags]].x/scale_factor-img.naturalWidth/2+origin_x);
      var yyyy = (yflipped*tag_coordinates[tagids[numberoftags]].y/scale_factor-img.naturalHeight/2+origin_y);
    if(tag_status && bot_label_id_data && cart_label_id_data && material_label_id_data && people_label_id_data)
    {
      
      // console.log("status",tag_status)
      if(showingbot==true)
      {
        var status=tag_status[bot_label_id_data[tagids[numberoftags]]]
        if(bot_label_id_data[tagids[numberoftags]]!=undefined)
        {
            // drawCirc(xxxx,yyyy)
            // drawstrokeCirc(xxxx,yyyy)
            // console.log("status",status)
            if(status=="available")
            {
                ctx.fillStyle="green"
            }
            else if(status=="engaged")
            {
                ctx.fillStyle="red"
            }
            drawCirc(xxxx,yyyy)
            drawstrokeCirc(xxxx,yyyy)
            ctx.fillStyle="black"
            drawText(bot_label_id_data[tagids[numberoftags]], xxxx-20, yyyy+22, 12, "courier")
        //   console.log(path_list_dict)
        }
      }

      if(showingcart==true)
      {
        var status=tag_status[cart_label_id_data[tagids[numberoftags]]]
        if(cart_label_id_data[tagids[numberoftags]]!=undefined)
        {
            // drawCirc(xxxx,yyyy)
            // drawstrokeCirc(xxxx,yyyy)
            console.log("status",status)
            if(status=="available")
            {
                ctx.fillStyle="green"
            }
            else if(status=="engaged")
            {
                ctx.fillStyle="red"
            }
            drawCirc(xxxx,yyyy)
            drawstrokeCirc(xxxx,yyyy)
            ctx.fillStyle="black"
            drawText(cart_label_id_data[tagids[numberoftags]], xxxx-20, yyyy+22, 12, "courier")
        //   console.log(path_list_dict)
        }
      }


      if(showingmaterial==true)
      {
        var status=tag_status[material_label_id_data[tagids[numberoftags]]]
        if(material_label_id_data[tagids[numberoftags]]!=undefined)
        {
            // drawCirc(xxxx,yyyy)
            // drawstrokeCirc(xxxx,yyyy)
            console.log("status",status)
            if(status=="available")
            {
                ctx.fillStyle="green"
            }
            else if(status=="engaged")
            {
                ctx.fillStyle="red"
            }
            drawCirc(xxxx,yyyy)
            drawstrokeCirc(xxxx,yyyy)
            ctx.fillStyle="black"
            drawText(material_label_id_data[tagids[numberoftags]], xxxx-20, yyyy+22, 12, "courier")
        //   console.log(path_list_dict)
        }
      }


      if(showingpeople==true)
      {
        var status=tag_status[people_label_id_data[tagids[numberoftags]]]
        if(people_label_id_data[tagids[numberoftags]]!=undefined)
        {
            // drawCirc(xxxx,yyyy)
            // drawstrokeCirc(xxxx,yyyy)
            console.log("status",status)
            if(status=="available")
            {
                ctx.fillStyle="green"
            }
            else if(status=="engaged")
            {
                ctx.fillStyle="red"
            }
            drawCirc(xxxx,yyyy)
            drawstrokeCirc(xxxx,yyyy)
            ctx.fillStyle="black"
            drawText(people_label_id_data[tagids[numberoftags]], xxxx-20, yyyy+22, 12, "courier")
        //   console.log(path_list_dict)
        }
      }

    }

     
    //   console.log(xxxx)
    //   console.log(yyyy)
    //   console.log(numberoftags)
    }
    if(recordingstation==true&&showAlert==true)
    {
      document.getElementById("overlayAdd").style.display = "block";
      // alert("Click on the canvas to note the location of asset")
        showAlert= false;
      
      // drawCirc(station_x,station_y)
    }
    if(station_json!=undefined)
    {
      if(showingstation==true)
      {
        
        station_json.forEach(stationPlot);
        
      }
      
    }

    if(path_json!=undefined)
    {
      if(showingpath==true)
      path_json.forEach(pathPlot);
    }


    // drawRect(i+10,0,70,20)
    // i+=10;
    // drawRect()
    // console.log(img.width)
    requestAnimationFrame( draw )
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}


// function plotPath(x, y)
// {
//     ctx.arc(x, y, 5, 0, 2 * Math.PI);
//     ctx.fill();
// }







function drawCirc(x, y)
{
    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawstrokeCirc(x, y)
{
    ctx.beginPath();
    ctx.globalAlpha=0.3;
    ctx.arc(x, y, 14, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha=1;
    // ctx.stroke();
    ctx.closePath();
}

function drawRect(x, y, width, height)
{
    ctx.fillRect( x, y, width, height )
}

function drawText(text, x, y, size, font)
{
    ctx.font = `${size}px ${font}`
    ctx.fillText(text, x, y)
}

let isDragging = false
let dragStart = { x: 0, y: 0 }

function onPointerDown(e)
{
    isDragging = true
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y
    if(recordingstation==true)
    {
        console.log("lol")
      getMousePosition(canvas,e);
      isDragging=false;
    }
}



function getMousePosition(canvasElem, event) {
  let rect = canvasElem.getBoundingClientRect();
  record_x = event.clientX - rect.left;
  record_y = event.clientY - rect.top;

  record_x=(record_x-windowinnerWidth/2)/cameraZoom;
  record_y=(record_y-windowinnerHeight/2)/cameraZoom;
  record_x=record_x+windowinnerWidth/2-cameraOffset.x;
  record_y=record_y+windowinnerHeight/2-cameraOffset.y;
  // console.log("Coordinate x: " + event.clientX,rect.left, 
  // "Coordinate y: " + event.clientY);
  // console.log(event.type)
  station_x=record_x;
  station_y=record_y;
  // console.log(station_x,station_y);
  // console.log((station_x+img.naturalWidth/2),(station_y+img.naturalHeight/2))

  drawCirc(station_x,station_y);

//   console.log((station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10 ,(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10);
  // console.log(origin_x,origin_y,scale_factor,xflipped,yflipped);
  
   console.log((station_x+img.naturalWidth/2-origin_x),(station_y+img.naturalHeight/2-origin_y))
  

db.collection('companies').doc(company_a).collection("asset").doc(asset_id).update({
      // pose:{x:(station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10 ,
      // y:(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10}
      x:(station_x+img.naturalWidth/2+20),
      y:(station_y+img.naturalHeight/2+40)
    
    })
    .then((docRef) => {
      location.href="/visualiser";
      
    //  console.log("lol",(station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10,(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10)
      // console.log("Document written with ID: ", docRef.id);
      // console.log("asset location")
      
  
      
    }).catch(error => {
      console.log(error);
      throw new Error("something happened, see detail log");
  });

    



  }
  







function onPointerUp(e)
{
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

function onPointerMove(e)
{
    if (isDragging)
    {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
    }
}

function handleTouch(e, singleTouchHandler)
{
    if ( e.touches.length == 1 )
    {
        singleTouchHandler(e.touches[0])
        console.log(e)
        console.log(e.touches[0])
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

function handlePinch(e)
{
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (initialPinchDistance == null)
    {
        initialPinchDistance = currentDistance
    }
    else
    {
        adjustZoom( null, currentDistance/initialPinchDistance )
    }
}

function adjustZoom(zoomAmount, zoomFactor)
{
    if (!isDragging)
    {
        if (zoomAmount)
        {
            cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
        console.log(zoomAmount)
    }
}



canvas.addEventListener('mousedown', onPointerDown,false)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown),false)
canvas.addEventListener('mouseup', onPointerUp,false)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp),false)
canvas.addEventListener('mousemove', onPointerMove,false)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove),false)
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY),false)

// Ready, set, go

draw()