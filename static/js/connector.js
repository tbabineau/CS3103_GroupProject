
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
            else if(Response.status == 400){
                document.getElementById("response").innerHTML = "Incorrect Credentials"
            }
            else{
                document.getElementById("response").innerHTML = "Issue loggin in, please try again later"
            }
        })
    }
    else{
        document.getElementById("response").innerHTML = "All fields must be filled out"
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
            window.location.replace("/");
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
            else if(Response.status == 409){
                document.getElementById("response").innerHTML = "Email already in use"
            }
            else if(Response.status == 400){
                document.getElementById("response").innerHTML = "All credential fields must be filled out"
            }
            else{
                document.getElementById("response").innerHTML = "Issue registering, please try again later"
            }
        })
        .then((json) => {
            if(json != null){
                console.log(json);
            }
        });
    }
    else{
        document.getElementById("response").innerHTML = "All credential fields must be filled out"
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
            document.getElementById("quantityFeedback").innerHTML = Response.json().status;
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
        userData: null,
        reviewData: null,
        editModal: false,
        addModal: false,
        cartModal: false,
        accountModal: false,
        reviewModal: false,
        addReviewModal: false,
        editReviewModal: false,
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
        this.fetchUserInfo();
    },
    methods: {
        //no jank
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
                .then(()=>{
                    this.fetchItems();
                });
            }
            reader.readAsDataURL(photo);
        },
        //no jank
        updateItem(itemId){
            put = function(pic, func){
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
                .then((Response)=>{
                    if(Response.status == 200){
                        func();
                        document.getElementById("editItemResponse").innerHTML = "Item edited successfully";
                    }
                    else if(Response.status == 400){
                        document.getElementById("editItemResponse").innerHTML = "Please fill out all fields and attach an image";
                    }
                    else{
                        document.getElementById("editItemResponse").innerHTML = "Issue editing item, please try again later";
                    }
                });
            }

            let name = document.getElementById("itemName").value;
            let desc = document.getElementById("itemDescript").value;
            let cost = document.getElementById("price").value;
            let stock = document.getElementById("itemStock").value;
            const photo = document.querySelector('#photo').files[0];
            const reader = new FileReader();
            reader.onload = ()=>{
                put(reader.result, this.fetchItems);
            }

            if(photo == null){
                put("", this.fetchItems);
            }
            else{
                reader.readAsDataURL(photo);
            }
        },
        //no jank
        deleteItem(itemId){
            
            fetch("/items/" + itemId,
                {
                    method: "DELETE",
                    body: "",
                    headers: {"Content-Type": "application/json; charset = UTF-8"}
                }
            )
            .then(()=>{
                this.fetchItems();
            });
        },

        fetchItems() {
            axios
            .get("/items")
            .then(response => {
                this.ItemsData = response.data.Items;
            })
            .catch(e => {
              console.log(e);
            });
        },
        //no jank
        addToCart(itemId){
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
                if(Response.status == 201){
                    document.getElementById("addCartResponse").innerHTML = "Item added to cart";
                }
                else if(Response.status == 400){
                    document.getElementById("addCartResponse").innerHTML = "Please fill out all fields";
                }
                else if(Response.status == 406){
                    document.getElementById("addCartResponse").innerHTML = "Larger quantity than current item stock";
                }
                else if(Response.status == 409){
                    document.getElementById("addCartResponse").innerHTML = "Item already in cart";
                }
                else{
                    document.getElementById("addCartResponse").innerHTML = "Issue adding item to cart, please try again later";
                }
            });
        },
        //no jank
        clearCart(){
            fetch("/cart",
                {
                    method: "DELETE",
                    body: "",
                    headers: {"Content-Type": "application/json; charset = UTF-8"}
                }
            )
            .then(()=>{
                this.fetchCart();
            });
        },
        //no jank
        updateCartQuantity(itemId){
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
            .then((Response)=>{
                if(Response.status == 200){
                    document.getElementById("quantityResponse").innerHTML = "Quantity updated successfully";
                }
                else if(Response.status == 400){
                    document.getElementById("quantityResponse").innerHTML = "Please fill out all fields";
                }
                else{
                    document.getElementById("quantityResponse").innerHTML = "Issue updating cart quantity, please try again later";
                }
                this.fetchCart();
                return Response.json()
            });
        },
        //no jank
        removeFromCart(itemId){
            fetch("/cart/" + itemId,
                {
                    method: "DELETE",
                    body: "",
                    headers: {"Content-Type": "application/json; charset = UTF-8"}
                }
            )
            .then(()=>{
                this.fetchCart();
            });
        },
        
        fetchCart() {
            axios
            .get("/cart")
            .then(response => {
                this.cartData = response.data.cart;
            })
            .catch(e => {
                console.log(e);
            });
        },

        selectCartItem(itemId){
            this.showCartModal();
            for(i in this.cartData){
                if(this.cartData[i].itemId == itemId){
                    this.selectedCart = this.cartData[i];
                }
            }
        },
        //or? should work now
        fetchReviews(itemId){
            this.showReviewModal();
            axios
            .get("/reviews?itemId="+itemId)
            .then(response => {
                this.reviewData = response.data.Reviews;
            })
            .catch(e =>{
                console.log(e);
            });
        },
        //no jank
        addReview(itemId){
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
        },
        //buggy
        updateReview(reviewId, itemId){ 
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
            .then(()=>{
                this.fetchReviews(itemId);
                this.showReviewModal();
            });
        },
        //buggy
        deleteReview(reviewId, itemId){ 
            fetch("/reviews/" + reviewId, 
                {
                    method: "DELETE", 
                    body: "", 
                    headers: {"Content-Type": "application/json; charset=UTF-8"}
                }
            )
            .then(()=>{
                this.fetchReviews(itemId);
                this.showReviewModal();
            });
        },

        createItem(){
            this.showAddModal();
        },

        createReview(){
            this.showAddReviewModal();
        },

        selectItem(itemId){
            this.showEditModal();
            for(i in this.ItemsData){
                if(this.ItemsData[i].itemId == itemId){
                    this.selectedItem = this.ItemsData[i];
                }
            }
        },
        selectCart(itemId){
            this.showCartModal();
            for(i in this.ItemsData){
                if(this.ItemsData[i].itemId == itemId){
                    this.selectedItem = this.ItemsData[i];
                }
            }
        },

        fetchUserInfo(){
            axios
            .get("/account/info")
            .then((response) => {
                this.userData = response.data;
            })
            .catch(e => {
                console.log(e);
            });
        },

        updateUser(){
            let email = document.getElementById("email").value;
            let pwd = document.getElementById("password").value;
            let fname = document.getElementById("fname").value;
            let lname = document.getElementById("lname").value;
            fetch("/account/info",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        email: email,
                        password: pwd,
                        fname: fname,
                        lname: lname
                    }),
                    headers: {"Content-Type": "application/json; charset = UTF-8"}
                }
            ).then(()=>{
                this.fetchUserInfo();
                this.hideAccountModal();
            });
        },

        selectReview(reviewId){
            this.showEditReviewModal();
            for(i in this.reviewData){
                if(this.reviewData[i].reviewId == reviewId){
                    this.selectedReview = this.reviewData[i];
                }
            }
        },

        selectReviewItem(itemId){
            this.showAddReviewModal();
            for(i in this.ItemsData){
                if(this.ItemsData[i].itemId == itemId){
                    this.selectedItem = this.ItemsData[i];
                }
            }
        },
        /* show/hide methods */
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
        },

        showCartModal(){
            this.cartModal = true;
        },

        hideCartModal(){
            this.cartModal = false;
        },

        showAccountModal(){
            this.accountModal = true;
        },

        hideAccountModal(){
            this.accountModal = false;
        },

        showReviewModal(){
            this.reviewModal = true;
        },

        hideReviewModal(){
            this.reviewModal = false;
        },

        showAddReviewModal(){
            this.addReviewModal = true;
        },

        hideAddReviewModal(){
            this.addReviewModal = false;
        },

        showEditReviewModal(){
            this.editReviewModal = true;
        },

        hideEditReviewModal(){
            this.editReviewModal = false;
        },

        reloadPage(){
            window.location.reload();
        },

        fetchUserInfo(){
            axios
            .get("/account/info")
            .then((response) => {
                this.userData = response.data;
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
});