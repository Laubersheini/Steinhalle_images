// TODO: this is in antcipation for multiple modals but doesnt work jet with them

// Get the modal
var modals = document.getElementsByClassName("modal");
var modalOpen = false;
// Get the <span> element that closes the modal
{

  let spans = document.getElementsByClassName("modal-close");
  for (let i = 0; i < spans.length; i++) {
    spans[i].onclick = closeModals;
  }
}

// When the user clicks on the button, open the modal
function openModal(modalNumber) {
  //set a timeout so calling the function from an onclick doesent instantly remove it again
  //absouter bullshit fix aber was besseres hab ich auch nicht
  setTimeout(() => {
    modals[modalNumber].style.display = "block";
  }, 0);
  setTimeout(() => {

    modalOpen = true;
  }, 500)
}

// When the user clicks on <span> (x), close the modal
function closeModals(closeMatchingModal) {
  modalOpen = false;
  for (let i = 0; i < modals.length; i++) {
    if (closeMatchingModal || !modals[i].classList.contains("matching-modal")) {
      modals[i].style.display = "none";
    }
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (modalOpen) {
    closeModals()
  }
}
