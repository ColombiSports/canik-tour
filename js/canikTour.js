// Avise des cookies
function checkRGPD() {
	// Si pas enregistré...
	const storage = window.localStorage;
	if (!storage.getItem("checked")) {
		//... on affiche la fenêtre...
		const modal = document.getElementById("RGPD-Modal");
		modal.style.display = "flex";

		// ... on configure le click...
		const btn = document.getElementById("RGPD-Button");
		btn.addEventListener("click", () => {
			// ...enregistrement cookie et suppression fenêtre
			storage.setItem("checked", "true");
			modal.remove();
		});
	}
}

// Ouvre/ferme les mentions légales
function toogleMentions() {
	document.querySelector(".mentions").classList.toggle("open");
	window.scrollTo(0, document.body.scrollHeight);
}

$(window).ready(function () {
	"use strict";

	// Cookies
	checkRGPD();

	// Effet de parallax
	$("#home").parallax("80%", -0.6);
	$("#canik").parallax("50%", -0.4);
	/*$("#goodies").parallax("80%", -1);*/

	// Création des variables
	var window_width = $(window).width(),
		window_height = window.innerHeight,
		header_height = $(".default-header").height(),
		header_height_static = $(".site-header.static").outerHeight(),
		fitscreen = window_height - header_height;
	$(".fullscreen").css("height", window_height);
	$(".fitscreen").css("height", fitscreen);

	// ????
	if (document.getElementById("default-select")) {
		$("select").niceSelect();
	}

	// Initiate superfish on nav menu
	$(".nav-menu").superfish({
		animation: {
			opacity: "show",
		},
		speed: 400,
	});

	// MOBILE /////////////////////////////////////////////////////////////

	// Open or close the main menu for the mobile
	function mobileNavToggle() {
		$("body").toggleClass("mobile-nav-active");
		$("#mobile-nav-toggle i").toggleClass("lnr-cross lnr-menu");
	}

	// Mobile Navigation
	if ($("#nav-menu-container").length) {
		var $mobile_nav = $("#nav-menu-container").clone().prop({
			id: "mobile-nav",
		});
		$mobile_nav.find("> ul").attr({
			class: "",
			id: "",
		});

		$("body").append($mobile_nav);
		$("body").append('<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu"><span>MENU</span></i></button>');
		$(document).on("click", "#mobile-nav-toggle", mobileNavToggle);
	} else if ($("#mobile-nav, #mobile-nav-toggle").length) {
		$("#mobile-nav, #mobile-nav-toggle").hide();
	}

	// Smooth scroll for the menu and links with .scrollto classes
	$(".nav-menu a, #mobile-nav a, .scrollto").on("click", function () {
		if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
			var target = $(this.hash);
			if (target.length) {
				var top_space = 0;

				if ($("#header").length) {
					top_space = $("#header").outerHeight();

					if (!$("#header").hasClass("header-fixed")) {
						top_space = top_space;
					}
				}

				$("html, body").animate(
					{
						scrollTop: target.offset().top - top_space,
					},
					1500,
					"easeInOutExpo"
				);

				if ($(this).parents(".nav-menu").length) {
					$(".nav-menu .menu-active").removeClass("menu-active");
					$(this).closest("li").addClass("menu-active");
				}

				if ($("body").hasClass("mobile-nav-active")) {
					mobileNavToggle();
				}
				return false;
			}
		}
	});

	if (window.location.hash) {
		setTimeout(function () {
			$("html, body").scrollTop(0).show();

			var scrollTop = $(window.location.hash).offset().top - 62;
			$("html, body").animate(
				{
					scrollTop: scrollTop,
				},
				1000
			);
		}, 0);
	} else {
		$("html, body").show();
	}

	// Header scroll class
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$("#header").addClass("header-scrolled");
		} else {
			if (window.innerWidth > 768) {
				$("#header").removeClass("header-scrolled");
			}
		}
		console.log("init");
	});

	// OWL Carousel
	$(".owl-carousel").owlCarousel({
		items: 3,
		dots: false,
		loop: true,
		autoplay: true,
		autoWidth: false,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		mouseDrag: true,
		lazyLoadEager: 1,
		margin: 30,
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 2,
			},
			1200: {
				items: 3,
			},
			1800: {
				items: 4,
			},
			2400: {
				items: 5,
			},
		},
	});

	// DISPARU ???

	// The Canik to win !
	$(".serieSpecial").magnificPopup({
		type: "image",
		closeOnContentClick: true,
		closeBtnInside: false,
		gallery: {
			enabled: false,
		},
	});

	// Creer un Popup Video
	function initVideoPopup($selector, $videoID) {
		$($selector).magnificPopup({
			items: {
				src: "https://www.youtube.com/watch?v=" + $videoID,
			},
			type: "iframe",
			iframe: {
				markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + "</div>",
				patterns: {
					youtube: {
						index: "youtube.com/",
						id: "v=",
						src: "//www.youtube.com/embed/" + $videoID + "?autoplay=1",
					},
				},
				srcAction: "iframe_src",
			},
		});
	}
	initVideoPopup("#tp9VideoCanik", "v8uNX7D9wjQ");
	initVideoPopup("#tp9VideoArmexpress", "Z3s-2PyNaTg");
	initVideoPopup("#tp9MeteVideoCanik", "bFqQ7qqzNV8");

	//  Social sharing
	$(".icons .fab").each(function (index, item) {
		var button = $(item);

		button.click(function () {
			var url = button.attr("data-url");
			var width = button.attr("data-width");
			var height = button.attr("data-height");
			openPopup(url, width, height);
		});
	});

	// Create popup for share
	function openPopup(url, width, height) {
		var canikURL = encodeURIComponent("https://caniktour.com");
		var text = encodeURIComponent("Venez vous inscrire aux Canik Tour 2018-19");
		url = url.replace("{canikURL}", canikURL);
		url = url.replace("{text}", text);

		var config = "width = 400, height = 300, toolbar = false, personalbar=false, directories = false, dialog = false, titlebar = false, menubar = false, location = false, resizable = yes, scrollbars = true";

		var windowLeft = window.screenLeft || window.screenX;
		var windowTop = window.screenTop || window.screenY;
		var windowWidth = window.innerWidth || document.documentElement.clientWidth;
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;
		var popupLeft = windowLeft + windowWidth / 2 - width / 2;
		var popupTop = windowTop + windowHeight / 2 - height / 2;
		var config = "width = " + width + ", height = " + height + ", top=" + popupTop + ", left=" + popupLeft + ",toolbar = false, personalbar=false, directories = false, dialog = false, titlebar = false, menubar = false, location = false, resizable = yes, scrollbars = true";

		window.open(url, "Canik Tour 2018-19", config).focus();
		return true;
	}

	/** Retourne une array d'objet pour la gallery */
	function getItemList(template, length, start = 0, mask = "##") {
		const a = [];
		let n = start - 1;
		while (a.length < length) a.push({ src: template.replace(mask, String(++n).padStart(mask.length, "0")) });
		return a;
	}

	$("#CPF").magnificPopup({
		items: getItemList("img/2020/CT2020-CPF_###.jpg", 9, 0, "###"),
		gallery: {
			enabled: true,
		},
		type: "image", // this is default type
	});

	$("#ArmexpressGallery").magnificPopup({
		items: getItemList("img/2020/CT2020-Armexpress-##.jpg", 20, 1, "##"),
		gallery: {
			enabled: true,
		},
		type: "image", // this is default type
	});

	$("#example").magnificPopup({
		items: [
			{
				src: "img/CT2018_ProvenceTir-008.jpg",
				title: '<a href="https://www.provencetir.com/" target="blank">https://www.provencetir.com/</a>',
			},
			{
				src: "https://www.youtube.com/watch?v=NW4YCbWNUcw",
				type: "iframe",
				iframe: {
					markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + "</div>",
					patterns: {
						youtube: {
							index: "youtube.com/",
							id: "v=",
							src: "//www.youtube.com/embed/%id%?autoplay=1",
						},
					},
					srcAction: "iframe_src",
				},
			},
		],
		gallery: {
			enabled: true,
		},
		type: "image", // this is default type
	});

	// Gallery Canik
	var galleryCanik = {};
	$(".galleryCanik").each(function () {
		var id = parseInt($(this).attr("data-group"), 10);
		if (!galleryCanik[id]) {
			galleryCanik[id] = [];
		}
		galleryCanik[id].push(this);
	});
	// Items of the gallery
	$.each(galleryCanik, function () {
		$(this).magnificPopup({
			type: "image",
			closeOnContentClick: true,
			closeBtnInside: false,
			gallery: {
				enabled: true,
			},
		});
	});

	// Pas utilisé je pense
	$(document).ready(function () {
		$("#mc_embed_signup").find("form").ajaxChimp();
	});

	// 1 zéro à gauche
	function fixLength(number) {
		return ("0" + number).slice(-2);
	}

	// 1 zéro à gauche
	function fixLength(number) {
		return ("0" + number).slice(-2);
	}

	// Aujourd'hui
	let now = new Date();

	// Liste des dates par conversion des data attributes HTML
	let dates = [];
	let nodes = document.querySelectorAll("[data-date]");
	nodes.forEach((node) => {
		let date = new Date(node.dataset.date);
		let diff = getDiff(now, date);
		//
		// Ajoute la classe "fini" aux évènements passés.
		if (diff.days < 0) node.classList.add("eventDone");
		dates.push(date);
	});

	// On alimente le compte à rebours
	let date = getNextDate(now, dates);
	createTimer(now, date);

	// Renvoie la première date supérieure à la date référence
	function getNextDate(now, dates) {
		let diff, i;
		for (i = 0; i < dates.length; i++) {
			diff = getDiff(now, dates[i]);
			if (diff.days >= 0) return dates[i];
		}
		return null;
	}

	// Retourne un objet du temps entre 2 dates {days,hours,mins,secs}
	function getDiff(from, to) {
		if (!from || !to) return;

		let diff = {}; // Initialisation du retour
		let tmp = to.getTime() - from.getTime();

		tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
		diff.secs = tmp % 60; // Extraction du nombre de secondes

		tmp = Math.floor((tmp - diff.secs) / 60); // Nombre de minutes (partie entière)
		diff.mins = tmp % 60; // Extraction du nombre de minutes

		tmp = Math.floor((tmp - diff.mins) / 60); // Nombre d'heures (entières)
		diff.hours = tmp % 24; // Extraction du nombre d'heures

		tmp = Math.floor((tmp - diff.hours) / 24); // Nombre de jours restants
		diff.days = tmp;

		return diff;
	}

	// Create a timer and update the countdown every second
	function createTimer(now, date) {
		let diff = getDiff(now, date);
		let prefix = document.getElementById("countdown_prefix");
		let countdown = document.getElementById("countdown");

		// Pas de date tout est passé
		if (diff == null) {
			prefix.innerHTML = "Revenez bientôt";
			countdown.innerHTML = "DATE A VENIR";
			return;
		}
		// Est la date
		if (diff.days == 0) {
			prefix.innerHTML = "Etape en cours";
			countdown.innerHTML = "VENEZ NOUS VOIR";
			return;

			// Show count down in french
		} else {
			// Stock interval ID
			prefix.innerHTML = "Prochaine étape dans :";

			let id = setInterval(function () {
				// Output the result in a html element
				countdown.innerHTML = "<div>" + diff.days + " jours " + fixLength(diff.hours) + " heures et " + fixLength(diff.mins) + " minutes</div>";
				diff = getDiff(new Date(), date);
			}, 1000);
		}
	}
});
