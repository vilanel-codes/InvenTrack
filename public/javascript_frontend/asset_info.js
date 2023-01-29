var company_a=sessionStorage.getItem("Company");
const assetContainer =  document.querySelector("#asset_info")
const file_links = document.querySelector("#file_links")
const image_links = document.querySelector("#image_links")


function showAssetInfo(doc){
 
  let file_links_container = document.createElement("div")
  let image_links_container = document.createElement("div")
  file_links_container.setAttribute("id","file");
  image_links_container.setAttribute("id","img");
    document.getElementById("assetsOn").style.display="block";
    document.getElementById("asset_name").innerHTML=doc.data().name;
    // document.getElementById("company_name").innerHTML=company_a;
    document.getElementById("recurring_date").innerHTML="Recurses "+doc.data().recurring_date;
    document.getElementById("installation_date").innerHTML= doc.data().installation_date.toDate();
    document.getElementById("info").innerHTML= doc.data().info;
    
    var fileArray = doc.data().file_link;
    var arrayLength = fileArray.length;
    if(arrayLength===0){
      document.getElementById("file_links").innerHTML="";
    }
    for (var i = 0; i < arrayLength; i++) {
      let a = document.createElement('a');
      // document.getElementById("file_links").innerHTML="<a class='file_links' target='blank' href='"+doc.data().file_link[i]+"'>"+doc.data().manual_name[i]+"</a>";
      a.setAttribute("class","file_links")
      a.setAttribute("target","blank")
      a.href=doc.data().file_link[i];
      a.innerHTML=doc.data().manual_name[i];
      file_links_container.appendChild(a);
      
    //Do something
    }

    var imageArray = doc.data().image_links;
    var arrayLength = imageArray.length;
    for (var i = 0; i < arrayLength; i++) {
      let img = document.createElement('img');
      let a = document.createElement('a');
      img.setAttribute("class","image_thumbnail");
      a.setAttribute("target","blank")
      img.src=doc.data().image_links[i]
      a.href=doc.data().image_links[i];
      a.appendChild(img)
      // a.innerHTML=doc.data().image_name[i];
      image_links_container.appendChild(a);
    //Do something
    }
    file_links.appendChild(file_links_container);
    image_links.appendChild(image_links_container);

}

 async function asset_info(id){
    var docid= id.toString();
    console.log(id,docid)
    var ref = db.collection('companies').doc(company_a).collection('asset');
    var assett = await ref.where("doc_id", '==', docid).get();
    
    if (assett.empty) {
        console.log('No matching documents.',docid);
        return;
      }  
    
      
      assett.forEach(doc => {
       
        showAssetInfo(doc);
      });
      
    // alert(id)
    
    
}