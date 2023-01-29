var tag_label_id_data,bot_label_id_data,cart_label_id_data,material_label_id_data,people_label_id_data;
var x_data,y_data;
// var tag_ids, tag_labels;
var tag_status={};
var pathcount=0;
var windowinnerWidth, windowinnerHeight;
var company_a=sessionStorage.getItem("Company");


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

 cameraOffset = { x: windowinnerWidth / 2, y: windowinnerHeight / 2 };

var xflipped = 1;
var yflipped = -1;
var scale_factor = sessionStorage.getItem("scale_factor"),
  origin_x = sessionStorage.getItem("originx"),
  origin_y = yflipped * sessionStorage.getItem("originy");
// var path_list_dict={};
// var path_json,station_json;
let rect = [];
// const canvas = document.getElementById('canvas');
db.collection("companies").doc(company_a).collection("asset").get().then((snapshots) => {
  snapshots.docs.forEach(doc => {
      imagePlot(doc);
  })
})

  db.collection("companies").doc(company_a).collection("asset").get().then((querySnapshot) => {
    station_json=querySnapshot;
});



 function imagePlot(doc){
  x_data=doc.data().x;
  y_data=doc.data().y;
  let asset = new Object();
   asset = {
    x: (x_data-img.naturalWidth/2),
    y: (y_data-img.naturalHeight/2),
    radius: 40,
    id: doc.id
  };
 
  rect.push({
    x: (x_data-img.naturalWidth/2),
    y: (y_data-img.naturalHeight/2),
    radius: 40,
    id: doc.id
  });
}

function stationPlot(doc,index)
{
  // console.log("rahul's", doc.data())
  
  x_data=doc.data().x;
  y_data=doc.data().y;
  var c = document.getElementById("canvas");
  var ctxx = c.getContext("2d");
  var img_shade = document.createElement('img');
  
  
  img_shade.src = "img/shade-logo.png";
  img_shade.setAttribute("id","image"+doc.id);
  // console.log("image"+doc.id)
  // drawCirc((x_data-img.naturalWidth/2), (y_data-img.naturalHeight/2))
  ctxx.drawImage(img_shade,(x_data-img.naturalWidth/2)-20,(y_data-img.naturalHeight/2)-40,40,40)
  
  
  // console.log(x_data-img.naturalWidth/2,y_data-img.naturalHeight/2)
  // drawCirc((x_data-img.naturalWidth/2), (y_data-img.naturalHeight/2))
  drawText(doc.data().name, (x_data-img.naturalWidth/2)-20, (y_data-img.naturalHeight/2)+10, 15, "courier")
  
}

function isIntersect(point, circle) {
  // console.log(circle.radius-Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2), circle.radius,(point.x-circle.x) ,(point.y - circle.y),circle.id,point.x,circle.x,img.naturalWidth/2)
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}
canvas.addEventListener('click', (e) => {
  console.log("canvas active");
  let rectangle = canvas.getBoundingClientRect();
  record_x = e.clientX - rectangle.left;
  record_y = e.clientY - rectangle.top;

  record_x=(record_x-windowinnerWidth/2)/cameraZoom;
  record_y=(record_y-windowinnerHeight/2)/cameraZoom;
  record_x=record_x+windowinnerWidth/2-cameraOffset.x;
  record_y=record_y+windowinnerHeight/2-cameraOffset.y;
  // console.log("Coordinate x: " + event.clientX,rect.left, 
  // "Coordinate y: " + event.clientY);
  // console.log(event.type)
  station_x=record_x;
  station_y=record_y;
  const pos = {
    x: record_x,
    y: record_y
  };
  // console.log(rect);
  rect.forEach(circle => {
    if (isIntersect(pos, circle)) {
      const file = document.getElementById("file");
      file.remove();
      const img = document.getElementById("img");
      img.remove();
     asset_info(circle.id);
     console.log("asset clicked");
    }
    else{
      // console.log("asset was not clicked");
    }
   
  })
});


function increase_opacity()
{
  // console.log("rahul's", doc.data())
  if(image_opacity<1)
  image_opacity=image_opacity+0.1;
  else
  image_opacity=1
  console.log(image_opacity)


}

function decrease_opacity()
{
  // console.log("rahul's", doc.data())
  if(image_opacity>0.1)
  image_opacity=image_opacity-0.1;
  else
  image_opacity=0;
  console.log(image_opacity)


}

function logout()

{
    sessionStorage.setItem("authenticated","false")
    document.cookie="authenticated=false";
    firebase.auth().signOut().then(() => {

        window.location.href=window.location.host
        console.log("yes");
        // Sign-out successful.
      }).catch((error) => {
        console.log(error.message)// An error happened.
      });

}

