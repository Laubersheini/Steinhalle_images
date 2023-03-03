autoDownloadEnabled = true

/*
*/




function downloadCanvas(canvas) {

  //download, this is seperate for image_renderer
  if (autoDownloadEnabled) {
    canvas.toBlob((file) => {
      var filename = "museum-jupitersäule.jpg"
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }, "image/jpeg", 1)
  }
}