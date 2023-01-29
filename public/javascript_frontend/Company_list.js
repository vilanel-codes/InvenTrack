var to_add_div=document.getElementById("to_add")
var docRef = db.collection("companies")
var clientID = sessionStorage.getItem("user");
var email = sessionStorage.getItem("email");
var password = sessionStorage.getItem("password");

if (clientID)
{
    db.collection("companies")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // var button=document.createElement("INPUT")?
            
                var x = document.createElement("INPUT");
            x.setAttribute("type", "button");
            // x.setAttribute("class","company_button");
            x.classList.add("company_button")
            x.value=(doc.data().map_info.setup_name)
           
            // x.onclick="redirection_function(this.id)"
            x.onclick=function() {
                redirection_function(doc.id);
            };
            to_add_div.appendChild(x);
            console.log(doc.id, " => ", doc.data());
            
            
            
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);


    });

}


else
{
    sessionStorage.setItem("authenticated","false")
    sessionStorage.setItem("authenticated","false")
    document.cookie="authenticated=false";
    window.location.href=window.location.href;
}

    function redirection_function(company_id)
    {
        sessionStorage.setItem("Company",company_id)
        db.collection("companies")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.id==company_id)
                {
                    console.log(doc.data());
                    sessionStorage.setItem("location",doc.data().map_info.location)
                    sessionStorage.setItem("setup",doc.data().map_info.setup_name)
                    // sessionStorage.setItem("UserName",doc.data().UserName)
                    // sessionStorage.setItem("Password",doc.data().Password)
                    // sessionStorage.setItem("Port",doc.data().Port)
                    // sessionStorage.setItem("xflipped",doc.data()["setup details"].xflipped)
                    sessionStorage.setItem("map_url",doc.data().map_info.map_url)
                    sessionStorage.setItem("scale_factor",doc.data().map_info.scale)
                    sessionStorage.setItem("originx",-1*doc.data().map_info.origin_x)
                    sessionStorage.setItem("originy",-1*doc.data().map_info.origin_y)
                    window.location="/visualiser"
                }

            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
    

        });

    }

    function add_company_redirect()
    {
        window.location="/form"
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