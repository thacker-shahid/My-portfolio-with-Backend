//   function myFunc(){
//   let value = document.querySelector('.loader_bg');
//   value.style.display = 'none';
// }


// =========== Progress bar






// ============ To top Button =============

  let toTop = document.querySelector('.to-top');
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  });