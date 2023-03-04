// TODO: WHY THE FUCK IS THIS NOT A LINK?
/*
document.getElementById("footer-homeButton").addEventListener("click",()=>{
  window.location.href = '/';


})
*/

//as this is included in almost every file some generic functions are also defined here:

/** plays audiofiles
 * @param src link to the file
 * @param {String} overlapBehavior string representing how to handle multiple audio files playing at once
 * for this function to work the user must allow autoplay(in electron this doesnt matter)
 */
var playing_audio_files = {} // src : [audio elements]
function playAudio(src, overlapBehavior) {

	//overlap behaviors: overlap(default) terminateAll, terminateSelf , skip

	var audio = new Audio(src)
	audio.volume = 0.3

	if (!globalOptions.sound) {
		audio.muted = true;
	}

	console.log(audio);
	audio.addEventListener("ended", (e) => {

	})
	audio.play()
	if (typeof playing_audio_files[src] == "undefined") {
		playing_audio_files[src] = [];

	}
	switch (overlapBehavior) {
		case "overlap":
			playing_audio_files[src].push(audio);
			break;
		case "terminateSelf":
			stopAndRemoveSounds(playing_audio_files[src]);
			playing_audio_files[src].push(audio);
			break;
		case "terminateAll":
			for (let i in playing_audio_files) {
				stopAndRemoveSounds(playing_audio_files[i]);
			}
			playing_audio_files[src].push(audio);
			break;
		default:
			playing_audio_files[src].push(audio);
	}


	function stopAndRemoveSounds(soundArray) {
		for (let i = soundArray.length - 1; i >= 0; i--) {
			let audio = soundArray.pop()
			audio.pause()
		}
	}

}

/**Callback for turning on sound button*/
function soundOn() {

	for (i in playing_audio_files) {
		let soundArray = playing_audio_files[i]
		for (let i = 0; i < soundArray.length; i++) {
			soundArray[i].muted = false;
		}
	}
	globalOptions.sound = true;
	document.getElementById("sound-icon").style.display = "block"
	document.getElementById("no-sound-icon").style.display = "none";
	addOptionsToLinks()

	globalOptions.onSoundOn()
}

/** Callback for turn off sound button */
function soundOff() {

	for (i in playing_audio_files) {
		let soundArray = playing_audio_files[i]
		for (let i = 0; i < soundArray.length; i++) {
			soundArray[i].muted = true;
		}
	}

	globalOptions.sound = false;
	document.getElementById("no-sound-icon").style.display = "block"
	document.getElementById("sound-icon").style.display = "none"
	addOptionsToLinks()

	globalOptions.onSoundOff()
}
var warnBeforeHome;
/**callback for the home button */
function clickHome() {
	if (warnBeforeHome) {
		openModal(modals.length - 2)
	} else {
		goHome()
	}


}
/**navigates to the homepage */
function goHome() {
	window.location = "../index.html"
}

function clickLanguage() {

	if (warnBeforeHome) {
		openModal(modals.length - 1)
	} else {
		changeLanguage()
	}
}
/**callback for the language buttons */
function changeLanguage() { //this function need to be modified for the english version
	let location = window.location + ""
	console.log(location);
	let parts = location.split("www/") //this can break easily, e.g. if our user is named www
	window.location = parts[0] + "www/en/" + parts[1]
}

//read the get parameters and set defaults if they are not available

var globalOptions;
var defaultGlobalOptions = {
	sound: true,
	onSoundOn: () =>{},
	onSoundOff: () =>{}
}

//read the parameters and write the globalOptions accordingly

let tmp = localStorage.getItem("steinhalle-globalOptions")
if (tmp != undefined) {

	globalOptions = JSON.parse(tmp)
} else {
	globalOptions = {}
}
for (let i in defaultGlobalOptions) {
	console.log(i)
	if (globalOptions[i] == undefined) {
		globalOptions[i] = defaultGlobalOptions[i]
	}

}

//apply stuff we get from the global options
if (!globalOptions.sound) {
	soundOff();
}

function addOptionsToLinks() {
	localStorage.setItem("steinhalle-globalOptions", JSON.stringify(globalOptions))
}
function getOptionString() {
	console.warn("You dont need this crazy hack anymore")
	return "";

}

/** Takes a clickevent on a canvas and turns it into canvas coordinats
 * the x and y coords of the event are not the same as pixels on the canvas that are needed for drawing
 * @param {*} e event from an onclick
 * @returns object with .x and .y in canvas pixels
 */
function getClickCoords(e) { // this function gives back the click in coords that are pixles on the canvas and not pixels on the screen (this function is only needed if the canvas is scaled using css and not the width and height properties)
	let rect = e.target.getBoundingClientRect()
	let width = rect.right - rect.left
	let height = rect.bottom - rect.top

	return {
		x: ((e.pageX - rect.left) / width) * e.target.width,
		y: ((e.pageY - rect.top) / height) * e.target.height,
	}

}

/** Takes an element and animates it to move_to_element, showes move_to_elemnt when animation is done
 * 
 * @param {*} element Element to move
 * @param {*} move_to_element Target element
 * @param {*} keep_original_element false if element should get deleted, true if it should get reset
 * @param {Function} callback function to call after the animation
 */
function moveElementToOtherElememnt(element, move_to_element, keep_original_element, callback,animationTime) {

	if(animationTime == undefined){
		animationTime = 3000
	}

	
	

	normalToAbsolute(element);


	move_to_element.style.display = "block"; //set display block so the rect can be calculated

	normalToAbsolute(move_to_element)

	let style = getComputedStyle(move_to_element)
	//console.log(style);
	let offsetX = style["padding-left"]
	offsetX = parseFloat(offsetX.substring(0, offsetX.length - 2))
	let offsetY = style["padding-top"]
	offsetY = parseFloat(offsetY.substring(0, offsetY.length - 2))


	element.style["z-index"] = 4
	setPostionFromOtherElement(element, move_to_element, offsetX, offsetY)


	move_to_element.style.display = "none"; //hide it until its time to actually show it
	move_to_element.style.position = ""

	setTimeout(() => {
		if (keep_original_element) {
			element.style.position = "";
			element.style.top = "";
			element.style.left = "";
		} else {

			element.style.display = "none";
		}
		move_to_element.style.display = "block";
		if(typeof callback =="function"){
			callback()
		} 
	}, animationTime)

	/** Set the position of domObject to the posion of setFrom
	 * 
	 * @param {domObject} domObject object to change the position of 
	 * @param {domObject} setFrom object to set the position to
	 * @param {*} offsetX xoffset
	 * @param {*} offsetY yoffset
	 */
	function setPostionFromOtherElement(domObject, setFrom, offsetX, offsetY) {//this takes two objects and sets the top and left of the first to the top/left of the seccond element
		let domObjectRect = setFrom.getBoundingClientRect()
		domObject.style.left = (domObjectRect.left + offsetX) + "px"
		domObject.style.top = (domObjectRect.top + offsetY) + "px"
	}
	/** Take an object that is currently not absolute and make it absolute for the purpose of animations
	 * 
	 * @param {*} domObject object to change the type of postioning on
	 */
	function normalToAbsolute(domObject) {//
		let domObjectRect = domObject.getBoundingClientRect();
		domObject.style.position = "absolute";
		domObject.style.left = domObjectRect.left + "px"
		domObject.style.top = domObjectRect.top + "px"
	}
}

var resetEnabled = true;
var resetTimeoutReference;

/** callback to call every the user clicks an element to prevent automatic move to startscreen */
function resetTimeout() {
	clearTimeout(resetTimeoutReference)
	if (resetEnabled) {

		resetTimeoutReference = setTimeout(() => {
			window.location.href = "/www" //TODO: this does not work in electron, use an absolute path or fully relative paths
		}, 600000)
		//	}, 5000)
	}
}

resetTimeout()
document.onclick = resetTimeout; //every time the user clicks someting reset the timeout

