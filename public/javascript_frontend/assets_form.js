var company_a=sessionStorage.getItem("Company");
const tagList = document.querySelector("#assetName");

function renderTag(doc) {
  // CREATING ELEMENTS OF THE TABLE
  let row = document.createElement("tr");
  let name = document.createElement("td");

  //ASSIGNING DATA TO ELEMENT FROM FIRESTORE
  row.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  row.onclick= function(){
    const file = document.getElementById("file");
      file.remove();
      const img = document.getElementById("img");
      img.remove();
    showAssetInfo(doc)
  };
  // ADDING ELEMENTS TO ROW
  row.appendChild(name);

  //ADDING ROW TO TABLE
  tagList.appendChild(row);
}
function showSearchTable(){
  document.getElementById("search_table").style.display="block";
}
function closeSearchTable(){
  document.getElementById("search_table").style.display="none";
  var input = document.getElementById("myInput");
  input.value = "";
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
        console.log("possible")
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

db.collection("companies")
  .doc(company_a)
  .collection("asset")
  .get()
  .then((snapshots) => {
    snapshots.docs.forEach((doc) => {
      renderTag(doc);
    });
  });
