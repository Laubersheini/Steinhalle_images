
var selectedElement;
var säulenaufbau = []//für generierung eines Qrcodes
const downloadUrl = "http://museum.laubersheimer.duckdns.org/";
var placedItemsCount = 0;
var images = {}

warnBeforeHome = true;

var animationInProgress = false; //used to block multiple items beeing moved to the center at the same time

var currentZoomLevel = 19

var currentVisibleTopElement;
function animateToCenter(säuleSidebar) {
  animationInProgress = true; //block multiple animations

  let säulenteil = generateSäuleContent(parts[säuleSidebar.getAttribute("partsIndex")])
  let dragContainer = document.getElementById("dragContainer")
  säulenaufbau.push({
    id: säulenteil.getAttribute("partsIndex"),
    zones: []
  })

  placedItemsCount++
  document.getElementById("placedItemsCount").innerText = placedItemsCount;
  if (dragContainer.firstChild != null) {

    document.getElementById("dragContainer").insertBefore(säulenteil, dragContainer.firstChild)
  } else {
    dragContainer.append(säulenteil)
    currentVisibleTopElement = säulenteil
  }
  currentVisibleTopElement.style.marginTop = "";
  moveElementToOtherElememnt(säuleSidebar, säulenteil, true, () => {

    currentVisibleTopElement.style.marginTop = "";
    currentVisibleTopElement = dragContainer.firstChild;
    currentVisibleTopElement.style.marginTop = "auto";
    animationInProgress = false;
  })
  currentVisibleTopElement.style.marginTop = "auto";
}

function removePreviewImages() {

  let previewImages = document.getElementsByClassName("preview-item")

  for (let i = previewImages.length - 1; i >= 0; i--) { //loop backward because of deletions
    previewImages[i].remove()
  }
}

function addElement() {

  let newElement = generateSäuleContent(parts[selectedElement.getAttribute("partsIndex")])
  document.getElementById("dragContainer").append(newElement)
}


function showDescription(element) {
  if (element.attributes.alt.nodeValue != "") {
    document.getElementById("descriptionContainer-name").innerHTML = element.attributes.alt.nodeValue
    document.getElementById("descriptionContainer-description").innerHTML = element.attributes.longdesc.nodeValue //document.getElementById(element.attributes.longdesc.nodeValue).innerHTML
    document.getElementById("positionImage").src = parts[element.getAttribute("partsIndex")].positionImageSrc
  }
}



//generate the sidebar from simple rules as stated by the json

var idCounter = 0;

function generateSäule({ //retuns an image as a dom node that has the specified properties 
  src,
  alt,
  longdesc = "",
  name = "default",
  partsIndex
}) {
  let image = document.createElement("img");
  image.setAttribute("src", src)
  image.setAttribute("alt", alt)
  image.setAttribute("longdesc", longdesc)
  image.setAttribute("partsIndex", partsIndex) //index in the parts array of this image
  image.classList.add("säulenteil-" + name);

  image.id = "säulenteil" + idCounter
  idCounter++
  return image;
}

var stageCheckTimeout;
function generateSäuleSidebar(params) { //generates an image that will get placed in the sidebar based on the specified parameters as well as an onclick event
  let image = generateSäule(params)
  image.classList.add("list-item")


  image.addEventListener("click", (e) => {
    if (selectedElement != undefined) {
      deselectItem(selectedElement)
      //    removePreviewImages()

    }
    // selectedElement = e.target
    //  selectItem(e.target)
    showDescription(e.target)

    if (!animationInProgress) {
      animateToCenter(e.target)
      clearTimeout(stageCheckTimeout)//clear any previous timeouts so we dont skip stages by invoking check stage twice 
      stageCheckTimeout = setTimeout(
        checkForNextStage, 3000
      )
    }

  })


  return image

}





function generateSäuleContent({ //returns a canvas dom node that gets placed in the center. Canvas has class content-item which i later used to add onclick events needed for drawing.
  src,
  alt,
  longdesc = "",
  name = "default",
  partsIndex,
  callback = ()=>{}
}) {
  //  let image = generateSäule(params)
  let canvas = document.createElement("canvas")

  canvas.setAttribute("alt", alt)
  canvas.setAttribute("longdesc", longdesc)
  canvas.setAttribute("partsIndex", partsIndex) //index in the parts array of this image
  canvas.classList.add("säulenteil-" + name);

  canvas.id = "säulenteil" + idCounter
  idCounter++

  let image = new Image();
  image.src = src;
  image.onload = () => {
    console.log(canvas)
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0)
    callback()
  }


  canvas.classList.add("content-item")

  if (parts[partsIndex].scaleFactor != undefined) {
    canvas.style.maxWidth = ("calc(" + parts[partsIndex].scaleFactor + "* var(--default-part-width)")
  }

  //let image = generateSäule(params)
  //image.classList.add("content-item")

  canvas.onclick = contentCanvasClickHandler
  return canvas
}

function contentCanvasClickHandler(e) {

  if (selectedElement != undefined) {
    deselectItem(selectedElement)
    //    removePreviewImages()
    //when clicking on the same element do nothing and instead return
    if (e.target.id == selectedElement.id) {
      selectedElement = undefined
      document.getElementById("removeElement").style.display = "none"
      return;
    }
  }

  selectedElement = e.target
  selectItem(e.target)
  showDescription(e.target)
  let partsIndex = e.target.getAttribute("partsIndex")
  if (stages[currentStage].stageTypes.includes(parts[partsIndex].type)) {

    document.getElementById("removeElement").style.display = "block"
  } else {
    document.getElementById("removeElement").style.display = "none"
  }
}
/*
function removeContentCanvas() {
  var index = Array.prototype.indexOf.call(document.getElementById("dragContainer").children, selectedElement);
  selectedElement.parentNode.removeChild(selectedElement)
  säulenaufbau.splice(säulenaufbau.length - index - 1, 1)
  selectedElement == undefined;
  document.getElementById("removeElement").style.display = "none"
}*/

function displayNextStage() {
  currentStage++
  stages[currentStage].stageDisplayActions()
}


/**
 * Displays a normal stage, that isn't automatic
 */
function stageDisplayHelper(stageNumber) {
  let sidebar = document.getElementById("partsDisplay")
  //let removeElement = document.getElementById("removeElement");
  sidebar.innerHTML = "";

  //add all the relevant parts to the selection menu
  for (let i = 0; i < parts.length; i++) {
    if (stages[stageNumber].stageTypes.includes(parts[i].type)) {
      sidebar.append(generateSäuleSidebar(parts[i]))
    }
  }

  //readd the contol elements we deleted
  //sidebar.append(removeElement)

  document.getElementById("placedItemsCount").innerText = 0;
  placedItemsCount = 0;
}





var currentStage = 0;
var placedItems = 0;
function checkForNextStage() {
  if (stages[currentStage].itemCount == undefined) {
    stages[currentStage].stageChangeActions()
    placedItems = 0;
  } else if (placedItems == stages[currentStage].itemCount) {
    placedItems = 0
    stages[currentStage].stageChangeActions()
  } else {
    placedItems++
  }
}


function openDynamicModal(text) {
  document.getElementById("dynamicModalContent").innerHTML = text
  openModal(0)
}


//use the array to generate the parts

let sidebar = document.getElementById("partsDisplay")
for (let i = 0; i < parts.length; i++) {
  parts[i].partsIndex = i //add the parts index so i dont have to do it manually

  //while were at it cache the images for later drawing
  /*
  images[i] = new Image();
  images[i].src = parts[i].src;
*/
}
/*
window.onload = () => {

  //displayStage(0)
  stages[0].stageDisplayActions()
}
*/

/**Removes top part and changes stages back*/
function undoPart() {
  let dragContainer = document.getElementById("dragContainer")
  säulenaufbau.pop()

  if (placedItemsCount <= 1) {
    placedItemsCount = 0
    if (currentStage > 0) {

      currentStage--
      stageDisplayHelper(currentStage)
    }
  } else {
    placedItemsCount--
  }

  dragContainer.firstChild.remove()
  currentVisibleTopElement = dragContainer.firstChild;


}



function zoom(amount) {
  const root = document.querySelector(":root")

  currentZoomLevel += amount
  root.style.setProperty("--default-part-width", currentZoomLevel + "vw")
}
zoom(0)



function showManual(){
  openModal(1)
}