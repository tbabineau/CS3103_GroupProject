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
        .then((Response) => {
            if(Response.status == 200){
                window.location.replace("/store"); //Sends the user to the store page if properly logged in
            }
            else{
                return Response.json();
            }
        })
        .then((json) => {
            if(json != null){
                console.log(json);
            }
        });
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
        .then((Response) => {
            if(Response.status == 201){
                window.Location.replace("/store");
            }
            else{
                return Response.json();
            }
        })
        .then((json) => {
            if(json != null){
                console.log(json);
            }
        });
    }
    else{
        console.log("WOMP WOMP");
    }
}

addItem = function(){
    let name = document.getElementById("itemName").value;
    let desc = document.getElementById("itemDescript").value;
    let pic = document.getElementById("itemPhoto").value;
    let cost = document.getElementById("price").value;
    let stock = document.getElementById("itemStock").value;
    fetch("/items",
        {
            method: "POST",
            body: JSON.stringify({
                itemName: name,
                itemDescript: desc,
                itemPhoto: pic,
                price: cost,
                itemStock: stock
            }),
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 201){
            console.log("Item Created");
        }
        else{
            return Response.json();
        }
    })
    .then((json) => {
        if(json != null){
            console.log(json);
        }
    });
}

updateItem = function(){
    let itemId = document.getElementById("ItemId").value; //This is just for testing, will be fetched from the endpoint
    let name = document.getElementById("itemName").value;
    let desc = document.getElementById("itemDescript").value;
    let pic = document.getElementById("itemPhoto").value;
    let cost = document.getElementById("price").value;
    let stock = document.getElementById("itemStock").value;
    fetch("/items/" + itemId,
        {
            method: "PUT",
            body: JSON.stringify({
                itemName: name,
                itemDescript: desc,
                itemPhoto: pic,
                price: cost,
                itemStock: stock
            }),
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 200){
            console.log("Item updated");
        }
        else{
            return Response.json();
        }
    })
    .then((json) => {
        if(json != null){
            console.log(json);
        }
    });
}

deleteItem = function(){
    let itemId = document.getElementById("ItemId").value; //This is just for testing, will be fetched from the endpoint
    fetch("/items/" + itemId,
        {
            method: "PUT",
            body: {},
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 204){
            console.log("Item Deleted");
        }
        else{
            return Response.json();
        }
    })
    .then((json) => {
        if(json != null){
            console.log(json);
        }
    });
}