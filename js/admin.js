const API_URL = "https://127.0.0.1:5000/api"

$(function() {
    var userbtn = $("#userbtn")
    var logoutbtn = $("#logoutbtn")
    var welcome = $("#welcome")
    var adminpanel = $("#adminpanel")
    checkLoginStatus()
    
    userbtn.on("click", function() {
        location.href = "spa-homework"
    })

    logoutbtn.on("click", function() {
        localStorage.removeItem("uid")
        location.href = "spa-homework"
    })
    
    function checkLoginStatus() {
        var token = localStorage.getItem("uid");
    
        if (!token) {
            console.log("沒有token");
            Swal.fire({
                icon: "warning",
                title: "你沒有登入",
                text    : "請先登入",
                confirmButtonText: "好ㄅ"
            })
            .then((result) => {
                location.href = "spa-homework"
            }).catch((err) => {
                
            });
        }
    
        axios
        .get("http://127.0.0.1:5000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            console.log(response);
            setLogin(response.data.username)
            if(response.data.level == "admin") {
                adminpanel.removeClass("d-none")
            }
            else {
                Swal.fire({
                    icon: "warning",
                    title: "滾開",
                    text: "你沒有權限",
                    confirmButtonText: "對不起"
                })
                .then((result) => {
                    location.href = "spa-homework"
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    function setLogin(username) {
        welcome.removeClass("d-none");
        welcome.find("span").append(username);
        userbtn.removeClass("d-none");
        logoutbtn.removeClass("d-none")
    }
})