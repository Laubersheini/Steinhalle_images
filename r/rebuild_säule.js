/**gets the makup of a säule from all the parts */
function parseParameters() {
    let säulenaufbau = []
    let string = window.location.search.substr(1)
    let split = string.split("=")

    for (let i = 0; i < split.length; i++) {
        säulenaufbau[i] = {}
        säulenaufbau[i].id = parseInt(split[i][0], 36);
        säulenaufbau[i].zones = []
        for (let j = 1; j < split[i].length; j++) {
            säulenaufbau[i].zones[j - 1] = split[i][j]
        }
    }
    return säulenaufbau;
}


const aufbau = parseParameters()

let drawCount = 0
aufbau.forEach(e => {


    part = parts[e.id]

    const säulenteil = generateSäuleContent({
        src: part.src,
        alt: "",
        partsIndex: e.id,
        callback: () => {
            for (let i = 0; i < e.zones.length; i++) {
                const colorId = e.zones[i]
                if (colorId != 0) {

                    console.log(e.id, i);
                    drawTexture({
                        id: e.id + "-" + i,
                        color: colors[colorId].value,
                        canvas: säulenteil,
                        partsIndex: e.id,
                        areaId: i
                    })
                }else{
                    drawCount--
                }
            }
        }
    })

    drawCount += e.zones.length

    if (dragContainer.firstChild != null) {

        document.getElementById("dragContainer").insertBefore(säulenteil, document.getElementById("dragContainer").firstChild)
    } else {
        document.getElementById("dragContainer").append(säulenteil)
        currentVisibleTopElement = säulenteil
    }





})


function checkDrawCount() {
    if (drawCount <= 0) {

        html2canvas(document.getElementById("dragContainer"), { backgroundColor: "#2E2E2E" }).then(function (canvas) {
            downloadCanvas(canvas);
        });


    } else {

        setTimeout(checkDrawCount, 100);
    }

}

checkDrawCount()
