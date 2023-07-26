// ... (previous code)

#target photoshop
if (app.documents.length > 0) {
    var myDocument = app.activeDocument;
    var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
    var thePath = myDocument.path;
    var theLayer = myDocument.activeLayer;
    // PNG Options;
    pngSaveOptions = new PNGSaveOptions();  
    pngSaveOptions.compression = 0; // 0-9. 0 = no compression, 9 = max compression
    // Check if layer is SmartObject;
    if (theLayer.kind != "LayerKind.SMARTOBJECT") {
        alert("selected layer is not a smart object")
    } else {
        // Select Files;
        if ($.os.search(/windows/i) != -1) {
            var theFiles = File.openDialog("please select files", "*.png;*.psd;*.tif;*.jpg", true)
        } else {
            var theFiles = File.openDialog("please select files", getFiles, true)
        };
        if (theFiles) {
            for (var m = 0; m < theFiles.length; m++) {
                // Replace SmartObject
                theLayer = replaceContents(theFiles[m], theLayer);
                var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                // Save JPG
                var theFolder = thePath + "/" + theNewName + ".png"
                myDocument.saveAs(new File(theFolder), pngSaveOptions, true, Extension.LOWERCASE);
            }
        }
    }
};
// Get PSDs, TIFs and PNGs from files
function getFiles(theFile) {
    if (theFile.name.match(/\.(png|psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
        return true
    };
};
// Replace SmartObject Contents
function replaceContents(newFile, theSO) {
    app.activeDocument.activeLayer = theSO;
    // =======================================================
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc3.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID("PgNm");
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
    return app.activeDocument.activeLayer
};

//Alert Letting the User Know the Script Has Finished
alert("Finished!\nThe script has finished saving the PNG thumbnails in the folder with the original mockup");
