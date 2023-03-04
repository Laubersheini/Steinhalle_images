
function deselectItemById(id) {
  let item = document.getElementById(id)
  deselectItem(item)
}
function deselectItem(item) {
  item.classList.remove("selected-item");
}


function selectItemById(id) {
  let item = document.getElementById(id)
  selectItem(item)
}

function selectItem(item) {
  item.classList.add("selected-item");
}