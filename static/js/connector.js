login = function(){
    let username = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;

    if(username != null && pwd != null){
        fetch("/login",
            {
                method: "POST",
                body: JSON.stringify({
                    username: username,
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
        if(Response.status == 204){
            window.location.replace("");
        }
        else{
            console.log(Response.json());
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
                window.location.replace("/store");
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
    let image = document.getElementById("itemImage").value;
    fetch("/items",
        {
            method: "POST",
            body: JSON.stringify({
                itemName: name,
                itemDescript: desc,
                itemPhoto: pic,
                price: cost,
                itemStock: stock,
                itemPhoto: photo
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
    let itemId = document.getElementById("itemId").value; //This is just for testing, will be fetched from the endpoint
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

deleteItem = function(){//ItemId will be at the endpoint, will just fetch from current url
    let itemId = document.getElementById("itemId").value; //This is just for testing, will be fetched from the endpoint
    fetch("/items/" + itemId,
        {
            method: "DELETE",
            body: "",
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

addToCart = function(){//don't need userId, held in session
    let itemId = document.getElementById("itemId").value;
    let quantity = document.getElementById("quantity").value;
    if(quantity == null || quantity < 1){
        quantity = 1;
    }
    fetch("/cart",
        {
            method: "POST",
            body: JSON.stringify({
                itemId: itemId,
                quantity: quantity
            }),
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

clearCart = function(){
    fetch("/cart",
        {
            method: "DELETE",
            body: "",
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 204){
            console.log("Cart cleared");
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

addReview = function(){
    let itemId = document.getElementById("itemId").value;
    let review = document.getElementById("review").value;
    let rating = document.getElementById("rating").value;
    fetch("/reviews",
        {
            method: "POST", 
            body: JSON.stringify({
                itemId: itemId, 
                review: review, 
                rating: rating
            }),
            headers: {"Content-Type": "application/json; charset=UTF-8"}
        }
    )
    .then((Response)=>{
        if(Response.status == 201){
            console.log("Review Created");
        }else{
            return Response.json();
        }
    })
    .then((json)=>{
        if(json!=null){
            console.log(json);
        }
    });
}

updateReview = function(){
    let reviewId = document.getElementById("reviewId").value; //test case 
    let review = document.getElementById("review").value;
    let rating = document.getElementById("rating").value;
    fetch("/reviews/" + reviewId,
        {
            method: "PUT", 
            body: JSON.stringify({
                review: review, 
                rating: rating
            }), 
            headers: {"Content-Type": "application/json; charset=UTF-8"}
        }
    )
    .then((Response)=>{
        if(Response.status==200){
            console.log("Review Updated");
        }else{
            return Response.json();
        }
    })
    .then((Response)=>{
        if(json!=null){
            console.log(json);
        }
    });
}

deleteReview = function(){
    let reviewId = document.getElementById("reviewId").value; //test case 
    fetch("/reviews/" + reviewId, 
        {
            method: "DELETE", 
            body: "", 
            headers: {"Content-Type": "application/json; charset=UTF-8"}
        }
    )
    .then((Response)=>{
        if(Response.status==204){
            console.log("Review Deleted");
        }else{
            return Response.json();
        }
    })
    .then((json)=>{
        if(json!=null){
            console.log(json);
        }
    });
}

updateCartQuantity = function(){
    let itemId = document.getElementById("itemId").value; //for testing, will be taken from endpoint
    let quantity = document.getElementById("quantity").value;
    fetch("/cart/" + itemId,
        {
            method: "PUT",
            body: JSON.stringify({
                quantity: quantity
            }),
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 200){
            console.log("Item Updated");
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

removeFromCart = function(){
    let itemId = document.getElementById("itemId").value; //for testing, will be taken from endpoint
    fetch("/cart/" + itemId,
        {
            method: "DELETE",
            body: "",
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
    .then((Response) => {
        if(Response.status == 204){
            console.log("Item removed");
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

verifyUser = function(){
    fetch("",
        {
            method: "POST",
            body: "",
            headers: {"Content-Type": "application/json; charset = UTF-8"}
        }
    )
}

const jsonData = [
    {"itemDescription": "yo", "itemId": 2}
]

var app = new Vue({
    el: "#app",

    data: {
        ItemsData: null,
        cartData: null,
        ItemData: null
    },
    mounted(){
        this.fetchItems();
        this.fetchCart();
    },
    methods: {
        //images have to be sent from connector
        fetchItems() {
            axios
            .get("/items")
            .then(response => {
                this.ItemsData = response.data.Items;
            })
            .catch(e => {
              alert("Unable to load the item data");
              console.log(e);
            });
        },

        fetchCart() {
            axios
            .get("/cart")
            //call separate function here to get items for cart
            .then(response => {
                this.cartData = response.data.cart;
                //html is not calling a list of items
                //this calls get for items *could be in random order depending on request*
                //need html to update upon single get then update with next item until done?
                /*
                for(let i=0; i<this.cartData.length; i++){
                    setTimeout(() => {
                    axios
                    .get("/items/"+this.cartData[i].itemId)
                    .then(response=>{
                        //returns last get
                        this.ItemData = response.data.Item;
                        console.log(this.ItemData);
                    })
                    .catch(e=>{
                        console.log(e);
                    });
                    }, 2000);
                }
                */
            })
            .catch(e => {
                alert("Unable to load cart data");
                console.log(e);
            });
        }
    }
});