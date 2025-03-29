login = function(){
    let username = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;

    if(username != null && pwd != null && username != "" && pwd != ""){
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

    if(fname != null && lname != null && mail != null && uname != null && pwd != null &&
        fname != "" && lname != "" && mail != "" && uname != "" && pwd != ""){
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
    let cost = document.getElementById("price").value;
    let stock = document.getElementById("itemStock").value;
    const photo = document.querySelector('#photo').files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
        let picData = reader.result;
        fetch("/items",
            {
                method: "POST",
                body: JSON.stringify({
                    itemName: name,
                    itemDescript: desc,
                    price: cost,
                    itemStock: stock,
                    itemPhoto: picData
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
    reader.readAsDataURL(photo);
}

updateItem = function(){
    let itemId = document.getElementById("itemId").value; //This is just for testing, will be fetched from the endpoint
    let name = document.getElementById("itemName").value;
    let desc = document.getElementById("itemDescript").value;
    let pic = document.getElementById("itemPhoto").value;
    console.log(pic.src);
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

 Vue.component("modal", {
    template: "#modal-template"
 });

var app = new Vue({
    el: "#app",

    data: {
        ItemsData: null,
        cartData: null,
        editModal: false,
        addModal: false,
        selectedItem: {
            itemId: "",
            itemDescription: "",
            itemName: "",
            itemPhoto: "",
            itemPrice: "",
            itemStock: ""
        }
    },
    mounted(){
        this.fetchItems();
        this.fetchCart();
    },
    methods: {
        addItem(){
            let name = document.getElementById("itemName").value;
            let desc = document.getElementById("itemDescript").value;
            let cost = document.getElementById("price").value;
            let stock = document.getElementById("itemStock").value;
            const photo = document.querySelector('#photo').files[0];
            const reader = new FileReader();
            reader.onload = ()=>{
                let picData = reader.result;
                fetch("/items",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            itemName: name,
                            itemDescript: desc,
                            price: cost,
                            itemStock: stock,
                            itemPhoto: picData
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
            reader.readAsDataURL(photo);
        },

        deleteItem(itemId){
            
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
        },
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
            .then(response => {
                this.cartData = response.data.cart;
            })
            .catch(e => {
                alert("Unable to load cart data");
                console.log(e);
            });
        },

        createItem(){
            this.showAddModal();
        },

        selectItem(itemId){
            this.showEditModal();
            for(i in this.ItemsData){
                if(this.ItemsData[i].itemId == itemId){
                    this.selectedItem = this.ItemsData[i];
                }
            }
        },

        showEditModal(){
            this.editModal = true;
        },

        hideEditModal(){
            this.editModal = false;
        },

        showAddModal(){
            this.addModal = true;
        },

        hideAddModal(){
            this.addModal = false;
        }
    }
});