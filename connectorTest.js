login = function(){
    let uname = document.getElementById("username");
    let pwd = document.getElementById("password");

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

register = function(){
    let fname = document.getElementById("firstname");
    let lname = document.getElementById("lastname");
    let uname = document.getElementById("username");
    let pwd = document.getElementById("password");

    if(fname != null && lname != null && uname != null && pwd != null){
        fetch("/register",
            {
                method: "POST",
                body: JSON.stringify({
                    firstname: fname,
                    lastname: lname,
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