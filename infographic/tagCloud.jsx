// Changes size of the first character of each word in the// current document by changing the size attribute of each character// future reference: http://www.scriptingmaster.com/scripts/asp/count-words-in-a-string.asp// http://www.mojavelinux.com/articles/javascript_hashes.html// http://stevethomas.com.au/php/how-to-make-a-tag-cloud-in-php-mysql-and-css.htmlvar compareClouds = false;var randomColors = false;var scaleMethod = "frequency";			// height is directly proportional to frequency//var scaleMethod = "inkArea";						// area is to frequency//var scaleMethod = "boundingBox";					//var scaleMethod = "equalArea";var tagsToLowerCase = true;dontLowercase = new Array();dontLowercase.push("Bill");var removeLineBreaks = true;var allowHyphenation = false;var splitTags2pointType = false;//var orderMethod = "randomize";var orderMethod = "sortLargest";//var orderMethod = "sortSmallest";//var orderMethod = "original";//var orderMethod = "alphabetical_AZ";//var orderMethod = "alphabetical_ZA";var gc_minValue = 0.0; 		// data valuevar gc_minSize = 2.0;			// point size, used to create scaler (2)var gc_maxValue = 0.0;		// data valuevar gc_maxSize = 30.0;		// point size, used to create scaler (50)var gc_minArea = 0.0;var gc_maxArea = 0.0;var gc_minBounding = 0.0;var gc_maxBounding = 0.0;var gc_minWidth = 0.0;var gc_maxWidth = 0.0;var gc_rangeValue=0.0;		// need to calculate using functionvar gc_rangeSize=0.0;			// need to calculate using functionvar gc_rangeArea=0.0;var gc_rangeWidth=0.0;var gc_proportion=0.0;var frequencyScaleFactor = 0.4;	// should normally be 1.0tagsWordFreqCollection = new Array();function tag( word, frequency, area, bounding, width, unique ) {	this.word = String(word);	this.frequency = Number(frequency);	this.area = Number(area);	this.bounding = Number(bounding);	this.width = Number(width);	this.unique = Boolean(unique);}function compareRandom(a,b) { return (Math.random() - 0.5); }function compareWordAZ(a,b) { x = 0; if (a.word < b.word) x=-1; else x=1; return x;}function compareWordZA(a,b) { x = 0; if (a.word < b.word) x=1; else x=-1; return x;}function compareFrequencySmallUp(a,b) { return a.frequency - b.frequency; }function compareFrequencyBigUp(a,b) { return b.frequency - a.frequency; }function compareArea(a,b) { return a.area - b.area; }function compareBounding(a,b) { return a.bounding - b.bounding; }setGraduatedCircleRanges = function() {	// Do the value ranges	if( gc_maxValue > gc_minValue ) {		gc_rangeValue = gc_maxValue - gc_minValue;	} else {		gc_rangeValue = gc_minValue - gc_maxValue;			}		// Do the Size ranges	if( gc_maxSize > gc_minSize ) {		gc_rangeSize = gc_maxSize - gc_minSize;	} else {		gc_rangeSize = gc_minSize - gc_maxSize;			}		// calculate the areas	// done inline with each object evaluation in main function	// Do the Area ranges	if( gc_maxArea > gc_minArea ) {		gc_rangeArea = gc_maxArea - gc_minArea;	} else {		gc_rangeArea = gc_minArea - gc_maxArea;			}		// Do the Width ranges	if( gc_maxWidth > gc_minWidth ) {		gc_rangeWidth = gc_maxWidth - gc_minWidth;	} else {		gc_rangeWidth = gc_minWidth - gc_maxWidth;			}		gc_proportion = gc_minSize / gc_minValue; }// TODO: make biaos on AREA and not DIAMETER// Problem: by preferencing diamter the larger circle sizes are bigger than they should be// Need to use pi * radius * radiuscalculateGraduation = function( dataValue, dataArea, dataWidth ) {	var temp=0.0;	//temp = ((dataValue - gc_minValue) / (gc_maxValue - gc_minValue)) * gc_rangeSize + gc_minSize;	// equal everything out	temp = ( gc_maxArea / dataArea );	// then size for the different character widths (should be percentages)	temp *= Math.sqrt( Math.sqrt( dataWidth / Math.sqrt(gc_maxWidth)) );	// then exagerate up	temp *= Math.sqrt( dataValue );	// now scale that into the acceptable range	temp = ( (dataValue - gc_minValue) / (gc_maxValue - gc_minValue)) * gc_rangeSize + gc_minSize;	//temp = temp * Number( (gc_maxArea - dataArea) / gc_rangeArea );		if( temp <= gc_maxSize ) {		// catch if the graduation is too big		return temp;	} else {		return gc_maxSize;			// else return the gradation (the temp made sure of minSize)	}}// TODO: make biaos on AREA and not DIAMETER// Problem: by preferencing diamter the larger circle sizes are bigger than they should be// Need to use pi * radius * radiuscalculateProportion = function( dataValue ) {	var temp=0.0;	temp = dataValue * gc_proportion;	return temp;} if ( app.documents.length > 0 ) {	doc = activeDocument;	mySelection = activeDocument.selection;		// If there are enough to process	if (mySelection instanceof Array) {				for(i=0; i<mySelection.length; i++) {						var textWord;			var outlineObject;			var copy1;						// That are textFrames			if (mySelection[i].typename == "TextFrame" && (mySelection[i].kind == TextType.AREATEXT) ) {				// create new array for each TextFrame object so we can store				// the words and frequency of each seperately				tagsWordFreqCollection[i] = new Array;				thisCloud = tagsWordFreqCollection[i];					// if need to remove line returns (from http://javascript.about.com/library/blcount.htm)				if( tagsToLowerCase ) {					mySelection[i].contents = mySelection[i].contents.toLowerCase();				}								if( allowHyphenation == false ) {					// create a new paragraph style 	 					/*var paraStyle = docRef.paragraphStyles.add("tagCloud"); 	 					// add some paragraph attributes 	 					var paraAttr = paraStyle.paragraphAttributes; 	 					paraAttr.justification = Justification.CENTER; 	 					paraAttr.hyphenation = false;					*/									for ( j = 0 ; j < mySelection[i].paragraphs.length; j++ ) {						//each word is a textRange object						textParagraph = mySelection[i].textRange.paragraphs[j];																var paraAttr0 = textParagraph.paragraphAttributes;						paraAttr0.justification = Justification.CENTER;						//paraAttr0.justification = Justification.FULLJUSTIFYLASTLINECENTER; 						paraAttr0.hyphenation = false;						//paraStyle.applyTo(textRef.paragraphs[j], true); 	 					}				}												text = mySelection[i];								//COLLECTING				// the frequency and words into cloud objects				for ( j = 0 ; j < mySelection[i].paragraphs.length; j++ ) {									// create new storage object for each text frame's word and frequency pairs					thisCloud[j] = new tag("",0,0,0, true, 0, 0);					// last 2 zeros after true are for X and Y position of pointType final tag cloud arrangement					thisTag = thisCloud[j];													//each tag - frequency pair is a paragraph object					textWord = text.paragraphs[j];															wordFrequencyTemp = textWord.contents;					// if you want the dividing char between the frequency count and the contents to be something other than # pound sign change here					theFreq=wordFrequencyTemp.split('#');					if( theFreq.length == 2 ) {						// store the frequency count						// wordFrequency[j] = theFreq[0];						// remove the frequency count from the original text object						// now the area will be based on the real contents, not the freq count number, plus divider char, plus contents						// this will be overwriten so not nec. to have here						textWord.contents = theFreq[1];						// wordContent[j] = theFreq[1];						// Store the words and frequency in the collection object						thisTag.word = theFreq[1];						thisTag.frequency = theFreq[0];						thisTag.length = String( theFreq[1] ).length;												// if the tag has spaces in it						if( thisTag.word.lastIndexOf(" ") > -1 ) {							var theEnd =  thisTag.word.lastIndexOf(" ");							var theContents = new String( thisTag.word );							var numSpaces = 0;							for( z=0; z<=theEnd; z++ ) {								theIndex = thisTag.word.indexOf( " ", z );								if(  theIndex > -1 ) {									z=theIndex;									numSpaces++;								}							}							// decrease the tag length down by that amount of spaces							thisTag.length -= numSpaces;						}					}								//}													// SCALING					//for ( j = 0 ; j < thisCloud.length; j++ ) {										// Make the new point type object and locate it					copy1 = mySelection[i].parent.textFrames.add();					// Make sure the new object is in the same Z stacking order as the original					copy1.move(mySelection[i], ElementPlacement.PLACEBEFORE);										textWord.duplicate( copy1 );										// convert the word to outlines to count its area					outlineObject = copy1.createOutline();										// what is the area of this one?					outlineObjectArea = 0.0;					outlineObjectBounding = 0.0;					howManyLoops = outlineObject.compoundPathItems.length;					//activeDocument.selection[0].compoundPathItems[0].pathItems[0].area					for( k = 0; k < howManyLoops; k++ ){						// what is the bounding box of the entire word						// This is different than the actual ink area calculated by examinging each char						outlineObjectBounding = outlineObject.width * outlineObject.height;						howManyCharParts = outlineObject.compoundPathItems[k].pathItems.length;						// some char parts will be negative (like insides of A and E lowercase characters)						// but by calcuting all and adding up it should be possitive						for( l = 0; l < howManyCharParts; l++ ){							outlineObjectArea += outlineObject.compoundPathItems[k].pathItems[l].area;						}					}										thisTag.bounding = Number( outlineObjectBounding );					thisTag.width = Number( outlineObject.width );										// should be possitive but just make sure since SQRT function deosn't like negative numbers					if( outlineObjectArea >= 0 ) {						outlineObjectArea = Math.sqrt( outlineObjectArea );					} else {						outlineObjectArea = 0;					}					thisTag.area = Number( outlineObjectArea );										// track the maxArea of the collective word objects					if( outlineObjectArea > gc_maxArea ) {						gc_maxArea = Number( outlineObjectArea );					}					if( outlineObjectArea < gc_minArea ) {						gc_minArea = Number( outlineObjectArea );					}										// track the maxArea of the collective word objects					if( outlineObject.width > gc_maxWidth ) {						gc_maxWidth = Number( outlineObjectArea );					}					if( outlineObject.width < gc_minArea ) {						gc_maxWidth = Number( outlineObjectArea );					}										// track the maxFreq and minFreq of the collective word objects					if( thisTag.frequency > gc_maxValue ) {						gc_maxValue = thisTag.frequency;					}					if( thisTag.frequency < gc_minValue ) {						gc_minValue = thisTag.frequency;					}									// Always delete these intermediate objects					outlineObject.remove();					//textWord.remove();					//copy1.remove();				}								// SORTING				// should we keep the original order, or other methods				// http://www.javascriptkit.com/javatutors/arraysort.shtml				switch( orderMethod ) {					case "randomize":						thisCloud.sort( compareRandom );						break;					case "alphabetical_AZ":						thisCloud.sort( compareWordAZ );						break;					case "alphabetical_ZA":						thisCloud.sort( compareWordZA );						break;					case "sortLargest":						thisCloud.sort(compareFrequencyBigUp);						break;					case "sortSmallest":						thisCloud.sort(compareFrequencySmallUp);						break;					case "original":						// this is the same as the default					default:						// leave however it came in						break;				}								//alert( "selLength: " + mySelection.length + " and clouds: " + tagsWordFreqCollection.length + " tags: " + tagsWordFreqCollection[0].length );			}		}					// TODO: Make comparative for ALL clouds in document		setGraduatedCircleRanges();				// are there different words		if( compareClouds ) {			for ( j = 0 ; j < tagsWordFreqCollection.length; j++ ) {				thisUniqueCloud = tagsWordFreqCollection[j];				for ( k = 0 ; k < thisUniqueCloud.length; k++ ) {					for ( m = 0 ; m < tagsWordFreqCollection.length; m++ ) {						if( thisUniqueCloud[k].unique == false ) {							break;						}						otherUniqueCloud = tagsWordFreqCollection[m];						for ( n = 0 ; n < otherUniqueCloud.length; n++ ) {							if(thisUniqueCloud[k].word == otherUniqueCloud[n].word ) {								thisUniqueCloud[k].unique = false;							}						}					}				}			}		}				//alert( "selLength: " + mySelection.length + " and clouds: " + tagsWordFreqCollection.length );				for(i=0; i<mySelection.length; i++) {						// That are textFrames			if( (mySelection[i].typename == "TextFrame") && (mySelection[i].kind == TextType.AREATEXT) ) {				// create new array for each TextFrame object so we can store				// the words and frequency of each seperately				thisCloud = tagsWordFreqCollection[i];													text = mySelection[i];															// now scale them according to what method				// clear out all the text				//text.contents = "";				text.textRange.words.removeAll();				//newWordStart = 0;				//newWordStop = 1;				for ( j = 0 ; j < thisCloud.length; j++ ) {					//newWordStart = text.textRange.characters.length;					//each word is a textRange object					thisTag = thisCloud[j];					// make sure the text for the word is right!					// make sure we didn't lowercase something we shouldn't have					for ( k = 0 ; k < dontLowercase.length; k++ ) {						if( thisTag.word == dontLowercase[k].toLowerCase() ) {							//text.contents = text.contents + dontLowercase[k] + "\u0020";							thisPlacedTag = text.textRange.words.add( dontLowercase[k] + "\u0020" );						} else {							if( j < thisCloud.length - 1 ) {								//text.contents = text.contents + thisTag.word + "\u0020";								thisPlacedTag = text.textRange.words.add( thisTag.word + "\u0020" );							} else {								//text.contents = text.contents + thisTag.word;								thisPlacedTag = text.textRange.words.add( thisTag.word );							}						}					}					// keep track of new End					//newWordStop = text.textRange.characters.length;										//alert( newWordStart + " : " + newWordStop );					//alert( thisPlacedTag.words.length );																																								for( k=0; k < thisPlacedTag.words.length; k++ ) {						//textChar = text.textRange.characters[k];																							if( scaleMethod == "frequency" ) {							theNewSize = gc_minSize;							if( thisTag.frequency > 0 ) {								//text.words[j].size = wordFrequency[j] * frequencyScaleFactor;								theNewSize = gc_minSize + thisTag.frequency * frequencyScaleFactor;							}							//alert( theNewSize );							thisPlacedTag.words[k].size = theNewSize;						}						if( scaleMethod == "inkArea" ) {							theNewSize = gc_minSize;							if( thisTag.frequency > 0 && thisTag.area > 0) {								if( thisTag.area > 0 ) {									theNewSize =  Number(calculateGraduation( thisTag.frequency, thisTag.area, thisTag.width ) );									thisPlacedTag.words[k].size = Number( theNewSize );								}							} else {								thisPlacedTag.words[k].size = Number( gc_minSize );							}							// equal everything out							//thisPlacedTag.words[k].size *= ( gc_maxArea / thisTag.area );							// then size for the different character widths (should be percentages)							//thisPlacedTag.words[k].size *= Math.sqrt( ( Math.sqrt( thisTag.width ) / Math.sqrt( gc_maxWidth ) ) );							// then exagerate up							//thisPlacedTag.words[k].size *= Math.sqrt( thisTag.frequency );							// but still way too big so							//thisPlacedTag.words[k].size *= 0.07;													}						if( scaleMethod == "boundingBox" ) {													}						if( scaleMethod == "equalArea" ) {							thisPlacedTag.words[k].size *= ( gc_maxArea / thisTag.area );						}												if( randomColors ) {							thisPlacedTag.words[k].fillColor.typename = "CMYKColor";							thisPlacedTag.words[k].fillColor.black = 0; 							thisPlacedTag.words[k].fillColor.cyan = Math.random() * 100; 							thisPlacedTag.words[k].fillColor.magenta = Math.random() * 100;							thisPlacedTag.words[k].fillColor.yellow = Math.random() * 100;  						}												if( compareClouds ) {							if( thisTag.unique == true ) {								thisPlacedTag.words[k].fillColor.typename = "CMYKColor";								thisPlacedTag.words[k].fillColor.black = 0; 								thisPlacedTag.words[k].fillColor.cyan = 100; 								thisPlacedTag.words[k].fillColor.magenta = 0;								thisPlacedTag.words[k].fillColor.yellow = 0;  							} else {								thisPlacedTag.words[k].fillColor.typename = "CMYKColor";								thisPlacedTag.words[k].fillColor.black = 100; 								thisPlacedTag.words[k].fillColor.cyan = 0; 								thisPlacedTag.words[k].fillColor.magenta = 0;								thisPlacedTag.words[k].fillColor.yellow = 0; 							}						}					}										if( splitTags2pointType ) {						copy1 = mySelection[i].parent.textFrames.add();						// Make sure the new object is in the same Z stacking order as the original						copy1.move(mySelection[i], ElementPlacement.PLACEBEFORE);												mySelection[i].duplicate( copy1 );												// convert the word to outlines to count its area						outlineObject = copy1.createOutline();												howManyCharsOutlines = outlineObject.compoundPathItems.length;						var totalCloudLength = 0;												for ( j = 0 ; j < thisCloud.length; j++ ) {							//newWordStart = text.textRange.characters.length;							//each word is a textRange object							thisTag = thisCloud[j];							thisTagLength = thisTag.length; 														totalCloudLength += thisTagLength;													if( totalCloudLength <= howManyCharsOutlines );								// This is different than the actual ink area calculated by examinging each char								thisTag.x = outlineObject.compoundPathItems[k].pathItems[l].left;								thisTag.y = outlineObject.compoundPathItems[k].pathItems[l].top - outlineObject.compoundPathItems[k].pathItems[l].height;							}						}					}				}			}		}	}}