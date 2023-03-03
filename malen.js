/*var qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 220,
  height: 220,
  correctLevel: QRCode.CorrectLevel.Q
});
*/


//var ctx = canvas.getContext("2d");
//ctx.globalAlpha = 0.4;



//load an image that can be used to determine on what part the user clicked
var collisionMaps = [];
/*
for (let i = 0; i < parts.length; i++) {

  setTimeout(() => {
    if (parts[i].collisionMapSrc != undefined) {
      let collisionMapImage = new Image();
      collisionMapImage.src = parts[i].collisionMapSrc

      collisionMaps[i] = document.createElement('canvas');

      collisionMapImage.onload = () => {
        collisionMaps[i].width = collisionMapImage.width;
        collisionMaps[i].height = collisionMapImage.height;
        collisionMaps[i].getContext('2d').drawImage(collisionMapImage, 0, 0, collisionMapImage.width, collisionMapImage.height);


      }
    }
  }, 1000 + i * 100)
}
*/


var currentColor = "#00ff00"
var currentColorId = 0;

/** callback for individual parts for drawing on that part */
function drawingClickHandler(e) {
  //  console.log("sdfgjkgkh");

  var collisionMapCtx = collisionMaps[e.target.getAttribute("partsindex")].getContext('2d');

  let coords = getClickCoords(e)

  var pixelData = collisionMapCtx.getImageData(coords.x, coords.y, 1, 1).data;
  console.log(pixelData[0])
  var area = pixelData[0] / 10; //from the greyscale image get which image to draw
  console.log(area);
  //let id = e.target.getAttribute("partsindex") + "-" + area
  let allElements = document.getElementById("dragContainer").children;
  let index = säulenaufbau.length - 1 - Array.prototype.indexOf.call(allElements, e.target); //the säulenaufbau array is reversed from the dom order
  säulenaufbau[index].zones[area] = currentColorId;

  console.log(currentColor);

  drawTexture({
    color: currentColor,
    canvas: e.target,
    partsIndex: e.target.getAttribute("partsindex"),
    areaId: area
  })

  const url = generateDownloadURL()
  console.log(url);
  qrcode.makeCode(url);

}


/** draws a texture on the canvas */
function drawTexture({ color = "magenta", canvas, partsIndex, areaId }) {

  const id = partsIndex + "-" + areaId
  if (images[id] != undefined) {
    drawTextureInternal({
      id: id,
      color: color,
      canvas: canvas
    })

    drawCount--
  } else {
    images[id] = new Image()
    images[id].src = parts[partsIndex].drawingZones + areaId + ".png"

    images[id].onload = () => {
      // TODO: dynamically change the css to always preserve the aspect ratio

      drawTextureInternal({
        id: id,
        color: color,
        canvas: canvas
      })

      drawCount--

    }

    images[id].onerror = () => {
      drawCount--
    }

  }


  /** draws a texture on the canvas */
  function drawTextureInternal({ id, color = "magenta", canvas }) {


    var textureCanvas = document.createElement('canvas');
    var textureCanvasCtx = textureCanvas.getContext("2d")
    let ctx = canvas.getContext("2d")
    let image = images[id];

    //write to säulenaufbau for download

    if (color == "eraser") {
      //ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(image, 0, 0)
      ctx.globalCompositeOperation = "source-over";
    } else {
      textureCanvas.width = canvas.width
      textureCanvas.height = canvas.height
      textureCanvasCtx.fillStyle = color;
      textureCanvasCtx.fillRect(0, 0, textureCanvas.width, textureCanvas.height)
      textureCanvasCtx.globalCompositeOperation = "destination-in"
      textureCanvasCtx.drawImage(image, 0, 0, textureCanvas.width, textureCanvas.height)

      //document.getElementById("content").append(textureCanvas)
      ctx.drawImage(textureCanvas, 0, 0, canvas.width, canvas.height)
    }
  }

}

var colors = [
  {
    name: "Radiergummi",
    value: "eraser",
    description: ""
  },
  {
    name: "Lichtblau",
    value: "#3B83BD",
    description: ""
  },
  {
    name: "Enzianblau",
    value: "#0E294B",
    description: ""
  },
  {
    name: "Rubinrot",
    value: "#ac480a",
    description: ""
  },
  {
    name: "Korallenrot",
    value: "#B32821",
    description: ""
  },
  {
    name: "Blassgrün",
    value: "#89AC76",
    description: ""
  },
  {
    name: "Platingrün",
    value: "#316650",
    description: ""
  },
  {
    name: "Goldgelb",
    value: "#ffbb3c",
    description: ""
  },
  {
    name: "Cremeweiß",
    value: "#FAF4E3",
    description: ""
  },
  {
    name: "Schwarz",
    value: "#000000",
    description: ""
  },
  {
    name: "Inkarnat",
    value: "#ffba95",
    description: ""
  }


]
/*
const colorButtonContainer = document.getElementById("colorButtonContainer")
for (let i = 1; i < colors.length; i++) {
  const template = `<button style="background-color: ${colors[i].value}" onclick="changeColor(this,'${i}')" class="colorSelector"></button>`

  colorButtonContainer.innerHTML += template

}
*/

/** callback for color selection elements */
function changeColor(e, colorId) {
  document.getElementById("selectedColor").id = "";
  e.id = "selectedColor"
  currentColor = colors[colorId].value;
  currentColorId = colorId
  //document.getElementById("descriptionContainer-name").innerText = colors[color].name
  //document.getElementById("descriptionContainer-description").innerText = colors[color].description
}


//is this still needed
var drawHistory = [];
var redoHistory = []
function undo() {
  let tmp = drawHistory.pop()
  if (tmp != undefined) {
    redoHistory.push(tmp);
  }

  redraw(drawHistory);
}

//is this still needed
function redo() {
  let tmp = redoHistory.pop()
  if (tmp != undefined) {
    drawHistory.push(tmp);
  }
  redraw(drawHistory);
}

//is this still needed
function redraw(history) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(outline, 0, 0, canvas.width, canvas.height)

  for (var i = 0; i < history.length; i++) {
    drawTexture(history[i])
  }

}
