//this array defines which stage offers which objects
let stages = [
    {
        stageTypes: [
            "sockel"
        ],
        name: "Sockel",
        stageDisplayActions: () => {

            stageDisplayHelper(0)
            document.getElementById("totalItems").innerText = 1;
            openDynamicModal(`<p>Sie fallen auf und aus der Reihe:
             die Säulen, die Jupiter, der oberste Gott im römischen Reich krönt. 
             Man sieht Jupiter obenauf in luftiger Höhe – aufrecht stehend oder sitzend auf einem Thron.
             Vor allem aber zeigt sich Jupiter in unserer Gegend als „Gigantenreiter“. Hoch zu Pferd reitet er über einen Giganten
             hinweg, den er bezwungen hat. Die Denkmäler werden dementsprechend als Jupiter
              - bzw. Jupitergigantensäulen bezeichnet.<p/>
            <p>
            In Alzey sind die Reste von insgesamt neun Jupitersäulen erhalten.
            <b>Nach ihren Vorbildern kannst Du Dir Deine Jupitersäule gestalten. Der
            Steinmetz wartet auf Deinen Auftrag.</b> Und auch der Maler hält schon
            seine Farben bereit.
            </p>
              `);

        },
        stageChangeActions: displayNextStage,


    },

    {
        stageTypes: [
            "Viergötterstein"
        ],
        name: "Viergötterstein",
        stageChangeActions: displayNextStage,
        stageDisplayActions: () => {
            openDynamicModal(`<p>Form und Aufbau einer Jupitersäule folgen einem festen Schema:
            ein oder zwei Sockelsteine, ein(e) Säule(nschaft) mit aufgesetztem
            Kapitell und einer abschließenden Jupiterfigur. Auf den Jupitersäulen
            finden sich fast immer dieselben Götter und Göttinnen dargestellt.
            Dennoch gab es Spielraum für eine individuelle Ausgestaltung. Je nach
            persönlichen Wünschen, der Größe des Geldbeutels, den besonderen
            Vorlieben der Stifter und ihren Beziehungen zu einzelnen Göttern und
            Göttinnen und dem Anlass variierte das Erscheinungsbild dann doch im
            Detail.<p/>
            <p>
            Platziere jetzt einen Viergötterstein.
            </p>
              `);

            stageDisplayHelper(1)
            document.getElementById("totalItems").innerText = 1;
        },
    },

    {
        stageTypes: [
            "zwischenelement1"
        ],
        name: "Zwischensockel-1",
        stageDisplayActions: () => {

            stageDisplayHelper(2)
            document.getElementById("totalItems").innerText = 1;
            document.getElementsByClassName("säulenteil-zwischenelement")[0].click()
        },
        stageChangeActions: displayNextStage,

    },

    {
        stageTypes: [
            "Viergötterstein2",
            "Weihinschrift"
        ],
        name: "Zwischenelemente",
        stageChangeActions: () => {

            displayNextStage()
        },
        stageDisplayActions: () => {

            openDynamicModal(`<p>Es gab keine eindeutigen Vorschriften, welche Gottheiten auf den
            Sockelsteinen abzubilden waren. Dennoch zeigt der untere Sockelstein
            meistens Juno, Minerva, Herkules und Merkur. Diese Zusammenstellung
            lässt sich mit der Verehrung der drei bedeutendsten Gottheiten der
            Römer erklären: Jupiter, seine Gemahlin Juno und Minerva (=
            Kapitolinische Trias). Sie wurden oft begleitet von Göttern, die sich
            besonders für das Wohlergehen der Menschen einsetzten. Das waren
            Herkules und Merkur, in Alzey mit seinen heilkräftigen Schwefelquellen
            nicht zuletzt auch Apollo Grannus und Sirona.
            </p>
            <p>
            Der zweite Viergötterstein ließ Platz für die Darstellung weiterer
            Gottheiten, aber auch für eine Weiheinschrift. Um Platz zu sparen, wurde
            mit bekannten Abkürzungen gearbeitet wie heute bei der SMS.
            </p>
            <p>
            Nun zum Zwischensockel oder dem "Viergötterstein mit Weiheinschrift“.
            </p>
            `)
            stageDisplayHelper(3)
            document.getElementById("totalItems").innerText = 1;
        },
    },

    {
        stageTypes: [
            "zwischenelement2"
        ],
        name: "Zwischensockel-2",
        stageDisplayActions: () => {

            stageDisplayHelper(4)
            document.getElementById("totalItems").innerText = 1;
            document.getElementsByClassName("säulenteil-zwischenelement2")[0].click()
        },
        stageChangeActions: displayNextStage,

    },
    {
        stageTypes: [
            "trommel"
        ],
        name: "Säulentrommeln",
        stageChangeActions: displayNextStage,
        itemCount:2,
        stageDisplayActions: () => {

            openDynamicModal(`<p>
            Für die Ausführung des Säulenschafts bzw. der Säulentrommel gibt
            es mehrere Möglichkeiten von schlicht bis sehr aufwendig. Entscheide
            Dich für ein Motiv.
            </p>
            `)
            stageDisplayHelper(5)
            document.getElementById("totalItems").innerText = 1;
        },
    },
    {
        stageTypes: [
            "Kapitell"
        ],
        name: "kapitell",
        stageChangeActions: displayNextStage,
        stageDisplayActions: () => {

            openDynamicModal(`<p>
            Das Kapitell, der Abschluss des Säulenschaftes, bildet die
            Standfläche für die Jupiterfigur. Es bietet ebenfalls Platz für
            schmückende Ornamente. Aus der südlichen Pflanzenwelt Italiens und
            Griechenlands leitet sich das Pflanzenblattmotiv des Akanthus ab. Eine
            andere Variante bietet die Kombination aus Akanthus und
            weiblichen/männlichen Kopfporträts. Die Gesichter an den vier Seiten
            werden mitunter als die vier Jahreszeiten gedeutet. Entscheide Dich für
            ein Motiv.
            </p>
            `)
            stageDisplayHelper(6)
            document.getElementById("totalItems").innerText = 1;
        },
    },
    {
        stageTypes: [
            "Jupiter"
        ],
        name: "Statur",
        stageChangeActions: () => {

            //hide the old elements
            document.getElementById("partsDisplay").style.display = "none"

            //add color selectors
            document.getElementById("sidebar-color").style.display = "grid"
            document.getElementById("sidebar").style.display = "none"
            document.getElementsByClassName("colorSelector")[0].id = "selectedColor";

            document.getElementById("qrContainer").style.display = "grid"
            qrcode.makeCode(generateDownloadURL());


            openDynamicModal(`
                Male nun deine Jupitersäule farbig an. Beachte dabei, dass die unbekleideten Körperteile immer fleischfarben angelegt waren.
            `)

            //force first color to be selected
            changeColor(document.getElementsByClassName("colorSelector")[0], 0)

            let elements = document.getElementsByClassName("content-item")
            for (let i = 0; i < elements.length; i++) {
                elements[i].removeEventListener("click", contentCanvasClickHandler)
                elements[i].onclick = drawingClickHandler

            }
            //currentStage = stageNumber;
            document.getElementById("removeElement").style.display = "none"
            document.getElementById("descriptionContainer-name").style.display = "none"
            document.getElementById("descriptionContainer-description").style.display = "none"
            document.getElementById("positionImage").style.display = "none"

            //openModal(4)
        },
        stageDisplayActions: () => {

            openDynamicModal(`Der höchste Platz im Götterhimmel gebührt Jupiter, dem römischen
            Himmels- und Staatsgott. Dementsprechend krönt er die Jupitersäule
            entweder als thronender Herrscher oder als Gigantenreiter. Entscheide
            Dich für ein Motiv.`)
            stageDisplayHelper(7)
            document.getElementById("totalItems").innerText = 1;
        },
    }

]

