const counterUp = window.counterUp.default;

const callback = (entries) => {
	entries.forEach((entry) => {
		const el = entry.target;
		if (entry.isIntersecting && !el.classList.contains("is-visible")) {
			counterUp(el, {
				duration: 2000,
				delay: 16,
			});
			el.classList.add("is-visible");
		}
	});
};

const IO = new IntersectionObserver(callback, { threshold: 1 });

const el01 = document.querySelector(".counter01");
const el02 = document.querySelector(".counter02");
const el03 = document.querySelector(".counter03");
const el04 = document.querySelector(".counter04");
IO.observe(el01);
IO.observe(el02);
IO.observe(el03);
IO.observe(el04);

$("#navbar")
	.find("a")
	.on("click", function (e) {
		e.preventDefault();

		const target = $(this).data("target");
		$("html, body").animate(
			{
				scrollTop: $(target).offset().top,
			},
			50
		);
	});

$(function () {
	var username = $("#username");
	var password = $("#password");
	var confirm_pwd = $("#confirm_pwd");
	var register = $("#register");
	var name = $("#name");
	var pwd = $("#pwd");
	var login = $("#login");
	var agree = $("#agree");
	var loginbtn = $("#loginbtn");
	var registerbtn = $("#registerbtn");
	var welcome = $("#welcome");
	var adminbtn = $("#adminbtn");
	var logoutbtn = $("#logoutbtn");
	var timer = null;

	checkLoginStatus();

	username.on("input", function () {
		var isexist = $("#isexist");
		clearTimeout(timer);

		timer = setTimeout(() => {
			if (username.val().length > 0 && username.val().length < 11) {
				checked_is_valid(username)
				// axios
				// 	.post("http://127.0.0.1:5000/api/checkuni", {
				// 		username: username.val(),
				// 	})
				// 	.then((response) => {
				// 		console.log(response);
				// 		if (response.data.status) {
				// 			checked_is_valid(username)
				// 		} else {
				// 			checked_is_invalid(username)
				// 			isexist.text(response.data.error);
				// 		}
				// 	})
				// 	.catch((error) => {
				// 		console.log(error);
				// 	});
			} else {
				checked_is_invalid(username)
				isexist.text("請輸入長度10以內的英數字");
			}
		}, 500);
	});

	password.on("input", function () {
		confirm_pwd.val("");

		if (password.val().length > 0 && password.val().length < 17) {
			checked_is_valid(password)
		} else {
			checked_is_invalid(password)
		}
	});

	confirm_pwd.on("input", function () {
		if (confirm_pwd.val() == password.val()) {
			checked_is_valid(confirm_pwd)
		} else {
			checked_is_invalid(confirm_pwd)
		}
	});

	agree.on("change", function () {
		if (agree.is(":checked")) {
			agree.next().text("同意(喜)");
		} else {
			agree.next().text("不同意(悲)");
		}
	});

	register.on("click", function () {
		if (
			username.hasClass("is-valid") &&
			password.hasClass("is-valid") &&
			confirm_pwd.hasClass("is-valid")
		) {
			let jsonData = {
				username: username.val(),
				password: password.val(),
			};

			axios
				.post("http://127.0.0.1:5000/api/register", jsonData)
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						Swal.fire({
							icon: "success",
							title: "註冊成功",
							confirmButtonText: "好耶",
						}).then((reuslt) => {
							bootstrap.Modal.getOrCreateInstance("#registerModal").hide();
						});
					} else {
						Swal.fire({
							icon: "warning",
							title: "註冊失敗",
							confirmButtonText: "喔不",
						}).then((reuslt) => {
							return;
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {});
		} else {
			Swal.fire({
				icon: "error",
				title: "欄位有誤",
				text: "請依規定輸入",
			});
		}
	});

	name.on("input", function () {
		if (name.val().length > 0 && name.val().length < 11) {
			checked_is_valid(name)
		} else {
			checked_is_invalid(name)
		}
	});

	pwd.on("input", function () {
		if (pwd.val().length > 0 && pwd.val().length < 13) {
			checked_is_valid(pwd)
		} else {
			checked_is_invalid(pwd)
		}
	});

	login.on("click", function () {
		if (name.hasClass("is-valid") && pwd.hasClass("is-valid")) {
			let jsonData = {
				username: name.val(),
				password: pwd.val(),
			};

			axios
			.post("http://127.0.0.1:5000/api/login", jsonData)
			.then(function (response) {
				console.log(response);
				if (response.data.status) {
					Swal.fire({
						icon: "success",
						title: response.data.message,
						confirmButtonText: "好耶",
					})
					.then((reuslt) => {
						bootstrap.Modal.getOrCreateInstance("#loginModal").hide();
						setLogin(response.data.username)
						localStorage.setItem("uid", response.data.token);
					});
				} else {
					Swal.fire({
						icon: "warning",
						title: response.data.message,
						confirmButtonText: "喔不",
					})
					.then((reuslt) => {
						bootstrap.Modal.getOrCreateInstance("#loginModal").hide();
						return;
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.finally(function () {
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "欄位有誤",
				text: "請依規定輸入",
			});
		}
	});

	adminbtn.on("click", function() {
		location.href = "admin"
	})

	logoutbtn.on("click", function() {
		SetLogout()
		localStorage.removeItem("uid")
	})

	function checkLoginStatus() {
		var token = localStorage.getItem("uid");

		if (!token) {
			console.log("沒有token");
		}

		axios
		.get("http://127.0.0.1:5000/api/me", {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((response) => {
			console.log(response);
			setLogin(response.data.username)
		})
		.catch((error) => {
			console.log(error);
		});
	}

	function checked_is_valid(item) {
		item.addClass("is-valid")
		item.removeClass("is-invalid")
	}

	function checked_is_invalid(item) {
		item.addClass("is-invalid")
		item.removeClass("is-valid")
	}

	function setLogin(username) {
		loginbtn.addClass("d-none");
		registerbtn.addClass("d-none");
		welcome.removeClass("d-none");
		welcome.find("span").append(username);
		adminbtn.removeClass("d-none");
		logoutbtn.removeClass("d-none");
	}

	function SetLogout() {
		welcome.addClass("d-none")
		adminbtn.addClass("d-none")
		logoutbtn.addClass("d-none")
		loginbtn.removeClass("d-none")
		registerbtn.removeClass("d-none")
	}

	/* function setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	} */

	/* function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	} */
});
