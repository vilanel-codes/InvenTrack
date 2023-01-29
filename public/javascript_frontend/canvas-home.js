let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let asset_id;
let showAlert = true;
let cameraZoom = 1;
let MAX_ZOOM = 5;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;
var tag_coordinates = {};
var tagids;
var numberoftags;
var img = new Image();
var showingbot = false;
var showingmaterial = false;
var showingpeople = false;
var showingcart = false;
var showingpath = false;
var showingstation = true;
var path_json, station_json;
var recordingstation = false;
var botstation = false;
var station_x, station_y, station_name, record_x, record_y;
var company_a = sessionStorage.getItem("Company");
var image_opacity = 0.5;
var windowinnerWidth, windowinnerHeight;
var botid, botname;
var botname_coordinates_x = [];
var botname_coordinates_y = [];
var recording_dist = 20;
var timetorecord;

const formAdd = document.querySelector("#newDoc");
var img_link = [];
var file_link = [];
function addNewTag() {
  asset_id = formAdd.asset_id.value;

  let date_time = new Date(formAdd.date.value);
  db.collection("companies")
    .doc(company_a)
    .collection("asset")
    .doc(asset_id)
    .set({
      doc_id: formAdd.asset_id.value,
      height: formAdd.height.value,
      info: formAdd.asset_info.value,
      installation_date: date_time,
      name: formAdd.name.value,
      recurring_date: formAdd.recurring_date.value,
      image_links: img_link,
      file_link: file_link
    })
    .then(function () {
      document.getElementById("overlayAdd").style.display = "none";
      console.log("added the asset");
      // location.href="/visualiser";
      document.getElementById("canvas_div").style.cursor =
        "url('img/shade-logo-cursor.png'),auto";
    })
    .catch((error) => {
      console.log(error);
      throw new Error("something happened, see detail log");
    });
}

function CancelTag() {
  db.collection("companies")
    .doc(company_a)
    .collection("asset")
    .doc(asset_id)
    .delete()
    .then(function () {
      console.log("profile updated");

      location.reload();
    })
    .catch((error) => {
      console.log(error);
      throw new Error("something happened, see detail log");
    });
  location.reload();
}

// CANVAS-PART

if (
  navigator.platform != "iPad" &&
  navigator.platform != "iPhone" &&
  navigator.platform != "iPod"
) {
  // windowinnerWidth=window.innerWidth/2.05;
  // windowinnerHeight=window.innerHeight/1.05;
  windowinnerWidth = window.innerWidth;
  windowinnerHeight = window.innerHeight;
  //I'll use windowinnerWidth in production
} else {
  windowinnerWidth = 1000;
  windowinnerHeight = 1000;
}

let cameraOffset = { x: windowinnerWidth / 2, y: windowinnerHeight / 2 };

var xflipped = 1;
var yflipped = -1;
var scale_factor = sessionStorage.getItem("scale_factor"),
  origin_x = sessionStorage.getItem("originx"),
  origin_y = yflipped * sessionStorage.getItem("originy");

function draw() {
  canvas.width = windowinnerWidth;
  canvas.height = windowinnerHeight;

  // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
  ctx.translate(windowinnerWidth / 2, windowinnerHeight / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(
    -windowinnerWidth / 2 + cameraOffset.x,
    -windowinnerHeight / 2 + cameraOffset.y
  );
  ctx.clearRect(0, 0, windowinnerWidth, windowinnerHeight);

  img.src = "img/"+company_a+".png";
  // while(img.naturalHeight===0){
  //   // location.href="/visualiser";
  //   img.src = sessionStorage.getItem("map_url");
  // }
  ctx.globalAlpha = image_opacity;
  ctx.drawImage(
    img,
    -img.naturalWidth / 2,
    -img.naturalHeight / 2,
    img.naturalWidth,
    img.naturalHeight
  );
  // ctx.drawImage(img,-1183/2,-635/2,1183,635)
  ctx.globalAlpha = 1;
  tagids = Object.keys(tag_coordinates);
  numberoftags = Object.keys(tag_coordinates).length;
  // console.log(tagids)

  if (recordingstation == true && showAlert == true) {
    document.getElementById("overlayAdd").style.display = "block";
    // alert("Click on the canvas to note the location of asset")
    showAlert = false;

    // drawCirc(station_x,station_y)
  }
  if (station_json != undefined) {
    if (showingstation == true) {
      station_json.forEach(stationPlot);
    }
  }

  requestAnimationFrame(draw);
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
  if (e.touches && e.touches.length == 1) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.clientX && e.clientY) {
    return { x: e.clientX, y: e.clientY };
  }
}

function drawCirc(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function drawstrokeCirc(x, y) {
  ctx.beginPath();
  ctx.globalAlpha = 0.3;
  ctx.arc(x, y, 14, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;
  // ctx.stroke();
  ctx.closePath();
}

function drawRect(x, y, width, height) {
  ctx.fillRect(x, y, width, height);
}

function drawText(text, x, y, size, font) {
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, x, y);
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
  dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;
  if (recordingstation == true) {
    console.log("lol");
    getMousePosition(canvas, e);
    isDragging = false;
  }
}

function getMousePosition(canvasElem, event) {
  let rect = canvasElem.getBoundingClientRect();
  record_x = event.clientX - rect.left + 20;
  record_y = event.clientY - rect.top + 40;

  record_x = (record_x - windowinnerWidth / 2) / cameraZoom;
  record_y = (record_y - windowinnerHeight / 2) / cameraZoom;
  record_x = record_x + windowinnerWidth / 2 - cameraOffset.x;
  record_y = record_y + windowinnerHeight / 2 - cameraOffset.y;
  // console.log("Coordinate x: " + event.clientX,rect.left,
  // "Coordinate y: " + event.clientY);
  // console.log(event.type)
  station_x = record_x;
  station_y = record_y;
  // console.log(station_x,station_y);
  // console.log((station_x+img.naturalWidth/2),(station_y+img.naturalHeight/2))

  drawCirc(station_x, station_y);

  //   console.log((station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10 ,(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10);
  // console.log(origin_x,origin_y,scale_factor,xflipped,yflipped);

  console.log(
    station_x + img.naturalWidth / 2 - origin_x,
    station_y + img.naturalHeight / 2 - origin_y
  );

  db.collection("companies")
    .doc(company_a)
    .collection("asset")
    .doc(asset_id)
    .update({
      // pose:{x:(station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10 ,
      // y:(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10}
      x: station_x + img.naturalWidth / 2,
      y: station_y + img.naturalHeight / 2,
    })
    .then((docRef) => {
      location.href = "/visualiser";

      //  console.log("lol",(station_x+img.naturalWidth/2-origin_x)*scale_factor*xflipped/10,(station_y+img.naturalHeight/2-origin_y)*scale_factor*yflipped/10)
      // console.log("Document written with ID: ", docRef.id);
      // console.log("asset location")
    })
    .catch((error) => {
      console.log(error);
      throw new Error("something happened, see detail log");
    });
}

function onPointerUp(e) {
  isDragging = false;
  initialPinchDistance = null;
  lastZoom = cameraZoom;
}

function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
  }
}

function handleTouch(e, singleTouchHandler) {
  if (e.touches.length == 1) {
    singleTouchHandler(e.touches[0]);
    console.log(e);
    console.log(e.touches[0]);
  } else if (e.type == "touchmove" && e.touches.length == 2) {
    isDragging = false;
    handlePinch(e);
  }
}

let initialPinchDistance = null;
let lastZoom = cameraZoom;

function handlePinch(e) {
  e.preventDefault();

  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

  // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
  let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

  if (initialPinchDistance == null) {
    initialPinchDistance = currentDistance;
  } else {
    adjustZoom(null, currentDistance / initialPinchDistance);
  }
}

function adjustZoom(zoomAmount, zoomFactor) {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom += zoomAmount;
    } else if (zoomFactor) {
      console.log(zoomFactor);
      cameraZoom = zoomFactor * lastZoom;
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM);

    console.log(zoomAmount);
  }
}

canvas.addEventListener("mousedown", onPointerDown, false);
canvas.addEventListener(
  "touchstart",
  (e) => handleTouch(e, onPointerDown),
  false
);
canvas.addEventListener("mouseup", onPointerUp, false);
canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp), false);
canvas.addEventListener("mousemove", onPointerMove, false);
canvas.addEventListener(
  "touchmove",
  (e) => handleTouch(e, onPointerMove),
  false
);
canvas.addEventListener(
  "wheel",
  (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY),
  false
);

// Ready, set, go

draw();

let a = 1;

document.onreadystatechange = setTimeout(function () {
  if (document.readyState !== "complete") {
    // document.querySelector("body").style.visibility = "hidden";
    document.querySelector("#overlay_loader").style.visibility = "visible";
  } else {
    document.querySelector("#overlay_loader").style.display = "none";
    // document.querySelector("body").style.visibility = "visible";
  }
},3000);
