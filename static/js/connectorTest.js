login = function(){
    let uname = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;

    if(uname != null && pwd != null){
        fetch("/login",
            {
                method: "POST",
                body: JSON.stringify({
                    username: uname,
                    password: pwd
                }),
                headers: {"Content-Type": "application/json; charset = UTF-8"}
            }
        )
        .then((Response) => Response.json())
        .then((json) => console.log(json));
    }
    else{
        console.log("WOMP WOMP");
    }
}

logout = function(){
    fetch("/login",
        {
            method: "DELETE",
            body: "",
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.json()){
            console.log(json);
        }
    });
}

register = function(){
    let fname = document.getElementById("firstname").value;
    let lname = document.getElementById("lastname").value;
    let mail = document.getElementById("email").value;
    let uname = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;

    if(fname != null && lname != null && mail != null && uname != null && pwd != null){
        fetch("/register",
            {
                method: "POST",
                body: JSON.stringify({
                    firstname: fname,
                    lastname: lname,
                    email: mail,
                    username: uname,
                    password: pwd
                }),
                headers: {"Content-Type": "application/json; charset = UTF-8"}
            }
        )
        .then((Response) => Response.json())
        .then((json) => console.log(json));
    }
    else{
        console.log("WOMP WOMP");
    }
}
