/**********************************************************ADOBE SYSTEMS INCORPORATED Copyright 2007 Adobe Systems Incorporated All Rights Reserved NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the termsof the Adobe license agreement accompanying it.  If you have received this file from a source other than Adobe, then your use, modification,or distribution of it requires the prior written permission of Adobe. *********************************************************//********************************************************** FlashPanel.jsxDESCRIPTIONCreates a ScriptUI window which allows a set of swf files to be chosen and played in a FlashPlayer control. **********************************************************/#target illustrator// The following directive names the global javascript engine that the script is// to be executed in. This is necessary when instantiating a floating Script UI// palette.#targetengine com.adobe.illustrator.demo.flashplayertry {	if(BridgeTalk.appName != "illustrator")  { 		throw new Error("Cannot run FlashPanel sample, need to be running in context of Illustrator\n");	}	if (flashPanel != undefined) {		throw new Error("FlashPanel is already running\n");	}		// get the folder containing the .swf files	// var swfFolder = Folder.selectDialog("Select the folder containing the swf files (FlashPanel/swf):"); // Use for release        	// Which OS are we on?	if( File.fs == "Windows" ){		var buttonSWF = "/Program Files/Adobe/Adobe Illustrator CS3/Presets/Scripts/registration.swf";	} else if( File.fs == "Macintosh" ){		// var buttonSWF = "/Users/nvkelso/Desktop/Downloads/FlashPanel/registration.swf";		// var buttonSWF = "/Applications/Adobe Illustrator CS3/Psresets.localized/Scripts.localized/registration.swf";		var buttonSWF = "/Applications/Adobe%20Illustrator%20CS3/Presets.localized/Scripts.localized/registration.swf";	} else {		alert("either Unix of Outerspace!!!");	}			//var swfFolder = new Folder("C:/Documents and Settings/sashby/Desktop/FlashPanel/swf"); // For debug under Illustrator (edit path to where sample is installed)	//var swfFolder = Folder(Folder($.fileName).path + "/swf"); // Use for debug in ESTK.	// if ( swfFolder != null )  {	if ( buttonSWF != null )  {	// Create a resource to describe the ScriptUI window.		var res =		"palette {																			\			text:'ButtonScripts',															\			properties:{ closeOnKey:'OSCmnd+W', resizeable:false},	\			fp: FlashPlayer {																\				preferredSize: [70, 18],												\				alignment: ['fill', 'fill']													\			},																					\		}";		//swfFiles: Group {orientation: 'row',									\				//label: StaticText {text: 'Flash files:'},							\				//list: DropDownList { },													\		//},																					\		// Create new FlashPanel Window object		var flashPanel = new Window (res);		flashPanel.margins = [2,2,2,2];		// Populate dropdown with list of swf files from the given folder		// var allFiles = swfFolder.getFiles ("*.swf");		// for (var i = 0; i < allFiles.length; i++) {			// var item = flashPanel.swfFiles.list.add ('item', allFiles[i].name);		// }		//var item = flashPanel.swfFiles.list.add ('item', buttonSWF );		// Call loadFlashFile() when onChange event occurs		//flashPanel.swfFiles.list.onChange = loadFlashFile;		// Set the initial selection to the first file in the drop-down list		// flashPanel.swfFiles.list.selection = flashPanel.swfFiles.list.items[0];		loadFlashFile( buttonSWF );		flashPanel.onClose = function(){if (flashPanel.animatorFlashPanelW != undefined) flashPanel.animatorFlashPanelW.close(); flashPanel = undefined;}				// ExtendScript functions called back from ActionScript		flashPanel.fp.registerText= registerText;				// Display window		flashPanel.show();	} // end if(swfFolder != null)}catch (ex) {	alert(ex);}/** Generic handler for errors returned by BridgeTalk	@param Object btObj the object containing the error details*/function flashPanelBridgeTalkErrorHandler (btObj) {	alert( btObj.body + " (" + btObj.headers ["Error-Code"] + ")" ); }/** Loads the Flash file selected in the swfFiles list in the FlashPanel window.*/function loadFlashFile( fileName ) {	//if (this.selection == null) {		//return;	//}	//var swfFileName = this.selection.toString();	var swfFileName = fileName;		// Load the SWF file into the player.//	var flashFile = new File(swfFolder.absoluteURI + "/" + swfFileName);	var flashFile = new File( fileName );	if (flashFile.exists) {		try  {			flashPanel.fp.loadMovie (flashFile);		}		catch (e) {			alert ("Exception caught in loadFlashFile():" +  e);		}	}	else {		alert("SWF file is missing: " + flashFile);	}}	function registerText( thisJust ) {	/////////////////////////////////////////////////////////////////	//Align Ungrouped Textfields to Center (Without Shifting Text) v.1 -- CS 	//>=--------------------------------------	// When a user clicks the "Align" buttons on the Paragraph tab, 	// Illustrator shifts the text visually from it's original position.	//	// I wanted to be able to quickly change the paragraph alignment to center	// without having to reposition the text.	//	// Here's the script to do it.	//	// At the top of the code is a list of acceptable variables to substitute if you	// want to adapt the script to always justify to some other alignment than center.	//>=--------------------------------------	// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com	//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt	////////////////////////////////////////////////////////////////// 	try{		var bt = new BridgeTalk();		bt.target = "illustrator";		bt.body = "{\n" +				//"alert( 'now in register text' );\n" +		//"alert(" +thisJust+ ");\n" +				"myJust = Justification." + thisJust +";\n" +		"// or set to whatever you want:\n" +		"// Justification.CENTER\n" +		"// Justification.FULLJUSTIFY\n" +		"// Justification.FULLJUSTIFYLASTLINECENTER\n" +		"// Justification.FULLJUSTIFYLASTLINELEFT\n" +		"// Justification.FULLJUSTIFYLASTLINERIGHT\n" +		"// Justification.LEFT\n" +		"// Justification.RIGHT\n" +		"myTextType = TextType.POINTTEXT;\n" +		"// or se to whatever you want:\n" +		"// TextType.AREATEXT\n" +		"// TextType.PATHTEXT\n" +		"// TextType.POINTTEXT\n" +				"//Array for storing text x,y coordinates.\n" +		"locArr = new Array();\n" +		 		"try\n" +		"{\n" +			"// Check current document for textFrames.\n" +			"if ( app.documents.length < 1 ) {\n" +				"alert ( 'open a document with paragraphs that contain TabStops.' );\n" +			"}\n" +			"else {\n" +				"docRef = app.activeDocument;\n" +				"if ( docRef.textFrames.length < 1 ) {\n" +					"alert ( 'open a document with paragraphs that contain TabStops.' );\n" +				"}\n" +				"else { \n" +					"sel = docRef.selection;\n" +					"var slen = sel.length;\n" +					"for (var x=0;x<slen ;x++)\n" +					"{\n" +						"if(sel[x].typename == 'TextFrame'){\n" +							"addtoList(sel[x]);\n" +						"}\n" +					"}\n" +										"for (all in locArr)\n" +					"{\n" +					  "locArr[all][0].story.textRange.justification = myJust;\n" +		"//			  locArr[all][0].story.textFrame.typename = myTextType;\n" +		"//			  locArr[all][0].story.textFrames.\n" +					  "locArr[all][0].top = locArr[all][1];\n" +					 "locArr[all][0].left = locArr[all][2];\n" +					"}\n" +				"}\n" +			"}	\n" +		"}\n" +		"catch (e)\n" +		"{\n" +			"//alert('Script Failed! Here's why: '+e);\n" +		"}\n" +		"//creates a mini-object to add to the locArr array.\n" +		 "function addtoList(obj){\n" +			"var temp  = new Array();\n" +			"temp[0] = obj;\n" +			"temp[1] = obj.top;\n" +			"temp[2] = obj.left;\n" +			"locArr.push(temp);\n" +		 "}\n" +		 "}\n";		bt.onError = flashPanelBridgeTalkErrorHandler;		bt.send();		} 	catch(e) {		alert ("Exception caught in registerText():" + e);	}	 }	// End FlashPanel.jsx