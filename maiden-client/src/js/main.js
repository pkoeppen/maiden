;(function () {
  
  "use strict";

  var isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome) {

    // CSS fix for Chrome rendering font weird

    $("body").addClass("is-chrome");
  }

  $(document).ready(function() { 
    $("body").css({"display": "block"});

    // Initialize after DOM elements receive height value.

    initScrollMagic();
  });

  // Bodymovin.

  var bmLogoAnimation = bodymovin.loadAnimation({
    container: document.getElementById("bm-logo"),
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "js/bodymovin/data.json"
  });

  bmLogoAnimation.addEventListener("data_ready", function() { 
    setTimeout(function() {$("#overlay").toggleClass("hidden")}, 1000); 
  });

  // Menu overlay.

  var toggleMenuOverlay = function() {
    $("#menu-overlay").toggleClass("hidden");
    $("#bm-logo").toggleClass("white");
    $("body").toggleClass("menu-open");
  }

  $("#menu-toggle, #menu-overlay").on("click", function(e) {
    if (!$(e.target).is("a")) {
      toggleMenuOverlay();
    }
  });

  $(".menu-items a").each(function(index, element) {
    $(element).on("click", function(e) {
      e.preventDefault();
      toggleMenuOverlay();
      if ($(this).attr("target") === "_blank")
        return window.open($(this).attr("href"), "_blank");
      location.replace($(this).attr("href"));
    });
  });

  // Hero typer.

  var words = [
    "iconoclast.",
    "maverick.",
    "enigma.",
    "cryptographer.",
    "visionary."
  ];

  var wordsProcessed = $.map(words, function(value, index) {
    return $.map(value.split(""), function(v, i) {
     var style = "animation-delay: " + (Math.random() * 300) + "ms;" +
     "top: " + (Math.random() * 90 + 90) + "px;";
     return "<span style='"+ style +"'>"+ v +"</span>";
   }).join("");
  });

  var x = 0;
  setInterval(function() {
    if (x === words.length) x = 0;
    $("section#hero .hero-typer").html(wordsProcessed[x]);
    x++;
  }, 6000);

  // ScrollMagic.

  function initScrollMagic() {
    var controller = new ScrollMagic.Controller();

    var crumb = function(section) {
      return (function() {
        $("#sidecrumb li").removeClass("active");
        $("#sidecrumb li[data-crumb-name='"+section+"']").addClass("active");
      });
    }

    // Petals parallax.

    new ScrollMagic.Scene({triggerElement: "#process", triggerHook: "onEnter", duration: 2200})
    .setTween("#petals-overlay", {y: "-75%", ease: Linear.easeNone})
            //.addIndicators()
            .addTo(controller);

    // Process section cards.

    new ScrollMagic.Scene({triggerElement: ".process-items", triggerHook: "onEnter", offset: 200})
    .setClassToggle(".process-item", "animate")
            //.addIndicators()
            .addTo(controller);

    // Services section frame things.

    new ScrollMagic.Scene({triggerElement: ".line-frame", triggerHook: "onEnter", offset: 100})
    .setClassToggle(".line-frame", "animate")
            //.addIndicators()
            .addTo(controller);

    // Toggle sidecrumb transparency.

    new ScrollMagic.Scene({triggerElement: "#hero", duration: $("#hero").outerHeight()})
    .on("enter leave", function() { $("#sidecrumb").toggleClass("transparent"); })
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#contact", offset: -100})
    .on("enter leave", function() { $("#sidecrumb").toggleClass("transparent"); })
    //.addIndicators()
    .addTo(controller);

    // Toggle sidecrumb sections.

    new ScrollMagic.Scene({triggerElement: "#video", duration: $("#video").outerHeight()})
    .on("enter", crumb("video"))
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#about", duration: $("#about").outerHeight()})
    .on("enter", crumb("about"))
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#process", duration: $("#process").outerHeight()})
    .on("enter", crumb("process"))
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#services", duration: $("#services").outerHeight()})
    .on("enter", crumb("services"))
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#rules", duration: $("#rules").outerHeight()})
    .on("enter", crumb("rules"))
    //.addIndicators()
    .addTo(controller);

    new ScrollMagic.Scene({triggerElement: "#links", triggerHook: "onEnter"})
    .on("enter leave", function() {
      if ($(window).width() > 799) {

        // Spare mobile users the CPU drag.

        $("#links .blog-shaded").toggleClass("animate");
      }
    })
    //.addIndicators()
    .addTo(controller);
 }
}());