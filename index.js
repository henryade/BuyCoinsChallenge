const hamburger = document.getElementsByClassName("hamburger");
const userId = document.getElementById("userId");
const headerDropdown = document.getElementsByClassName("header-dropdown");

window.onload = () => {
  window.addEventListener("scroll", toggleTopPane);
  window.addEventListener("resize", toggleTopPane);

  getData();
}

// Event Listeners
hamburger[0].addEventListener("click", toggleMobileField(headerDropdown[0]));
TabFields.forEach((element, i) => {
  element.addEventListener("click", toggleTabField(element, i));
})

userId.addEventListener("keyup", getUser);
