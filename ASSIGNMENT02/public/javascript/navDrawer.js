// public/javascript/navDrawer.js
document.addEventListener("DOMContentLoaded", function () {
  var navIcon = document.querySelector(".nav-icon");
  var navDrawer = document.getElementById("navDrawer");

  navIcon.addEventListener("click", function () {
    if (navDrawer.style.display === "block") {
      // close drawer slowly
      navDrawer.style.transition = "transform 1s ease";
      navDrawer.style.transform = "translateX(100%)";
      setTimeout(function () {
        navDrawer.style.display = "none";
      }, 1000); // close after 1 sec
    } else {
      // open the drawer
      navDrawer.style.transition = "transform 1s ease";
      navDrawer.style.display = "block";
      navDrawer.style.transform = "translateX(0)";
      // automatically close after 5 secs
      setTimeout(function () {
        navDrawer.style.transition = "transform 1s ease";
        navDrawer.style.transform = "translateX(100%)";
        setTimeout(function () {
          navDrawer.style.display = "none";
        }, 1000); // close after 1 sec
      }, 5000); // close after 5 secs
    }
  });
});
