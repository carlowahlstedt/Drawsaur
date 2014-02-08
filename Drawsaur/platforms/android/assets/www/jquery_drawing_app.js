/*********************************************************
*	Drawsaur
*	Created 9/2/2012 by Carlo Wahlstedt
*
* 	9/3/2012 - Added a color picker
*
**********************************************************/
/* ToDo List:
*	- Add Pop out menu for drawing tools
*	- Add bucket drawing tool
*	- Add undo
*	- Add content to be "colored" for $
*/
$(function(){
	// Wait for Cordova to load
	document.addEventListener("deviceready", onDeviceReady, false);
	// Cordova is ready
	function onDeviceReady() { 
		//this is to stop the screen from scrolling
        document.addEventListener('touchstart', touch, false);
        document.addEventListener('touchmove', touch, false);
		//this is what starts the drawing
		var drawing = new DrawingApp(); 
	}
	function touch(event) {
        $.each(event.touches, function(i, touch) {
        });
		//prevent scrolling
        event.preventDefault();
    }
});
//here is where all of the work is done
var DrawingApp = function(options) {
    // grab canvas element
    var canvas = document.getElementById("canvas"),
        ctxt = canvas.getContext("2d"),
    	hasAds = document.getElementById("ads"),
    	divColors = document.getElementById("colors"),
    	canvasColor = document.getElementById("colorCanvas"),
        ctxtColor = colorCanvas.getContext("2d"),
        curColor = "black",
		curSize = 2,
		lines = [,,],
    	offset = $(canvas).offset(),
    	colorsShowing = false,
    	selColor = curColor,
    	adWidth = 50;
    	//undoCount = 0,
    	//undoLines = [],
    	//currentUndo = [[]];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasColor.width = canvas.width - 25;
    canvasColor.height = canvas.height - 170;

    //if the ads aren't there then don't fix the layout
    if (hasAds == null) { adWidth=0; }

    //setup the canvas context
    ctxt.lineWidth = 5;
    ctxt.lineCap = "round";
    ctxt.pX = undefined;
    ctxt.pY = undefined;
	
	//setup the drawing area
	var drawingAreaX = 0,
		drawingAreaY = 0,
		drawingAreaWidth = canvas.width - 20,
		drawingAreaHeight = canvas.height - (60 + adWidth);

	//list of pen sizes
	var cursor = [];
	cursor.push({ size:2, radius:2, location:canvas.width-30 });
	cursor.push({ size:5, radius:5, location:canvas.width-55 });
	cursor.push({ size:7, radius:10, location:canvas.width-90 });
	cursor.push({ size:10, radius:20, location:canvas.width-135 });

	//draw the trashcan
    var trashX = cursor[cursor.length-1].location-70,
    	trashY = canvas.height-50;
	var trash = new Image(); 
	trash.src = "trashcan.png"; 
 	trash.onload = function() { ctxt.drawImage(trash, trashX, trashY-adWidth); }

	//draw the save icon
    var saveX = trashX-60,
    	saveY = trashY+2;
	var save = new Image(); 
	save.src = "save.png"; 
 	save.onload = function() { ctxt.drawImage(save, saveX, saveY-adWidth); }

	//draw the share icon
    var shareX = saveX-45,
    	shareY = saveY;
	var share = new Image(); 
	share.src = "share.png"; 
 	share.onload = function() { ctxt.drawImage(share, shareX, shareY-adWidth); }

    var colorX = 5,
    	colorY = canvas.height-48;
	var iconColors = new Image();
	iconColors.src = "colors.png"; 
 	iconColors.onload = function() { ctxt.drawImage(iconColors, colorX, colorY-adWidth); }

	//where the magic happens
    var self = {
        //bind click events
        init: function() {
            canvas.addEventListener('touchstart', self.preDraw, false);
            canvas.addEventListener('touchmove', self.draw, false);
        },
        //draws the rectangle
       	drawRect: function() {
        	ctxt.beginPath();
			ctxt.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
			ctxt.closePath();
			ctxt.lineWidth = "1";
			ctxt.strokeStyle = "black";
			ctxt.fillStyle = "white";
			ctxt.fill();
			ctxt.strokeRect(drawingAreaX, drawingAreaY, drawingAreaWidth+7, drawingAreaHeight+7);
		},
        //updates the UI to tell the user which pen size is now selected
       	drawCursors: function() {
			var locY = canvas.height - (35 + adWidth);
			for (i = 0; i < cursor.length; i++) {
	 			ctxt.lineWidth = 4;
				ctxt.beginPath();
				ctxt.arc(cursor[i].location, locY, cursor[i].size, 0*Math.PI, 2*Math.PI);
				ctxt.closePath();
				ctxt.strokeStyle = "grey"
				ctxt.stroke();
				if (curSize == cursor[i].radius) {
					ctxt.fillStyle = 'black';
				} else {
					ctxt.fillStyle = 'white';
				}
				ctxt.fill();
			}
		},
		//updates the UI to show the color picker
       	showColors: function() {
			divColors.style.visibility = "visible";
			divColors.style.display = "inline-block";
			canvas.style.visible = "hidden";
			canvas.style.display = "none";
			colorsShowing = true;
		},
		//updates the UI to hide the color picker
       	hideColors: function() {
			divColors.style.visibility = "hidden";
			divColors.style.display = "none";
			canvas.style.visible = "visible";
			canvas.style.display = "inline";
			colorsShowing = false;
		},
		//this is the single press event
        preDraw: function(event) {
            $.each(event.touches, function(i, touch) {
            	var x = this.pageX - offset.left,
	            	y = this.pageY - offset.top,
                	id = touch.identifier;

                //if it's in the drawing area then record the draw
            	if (y < drawingAreaHeight && x < drawingAreaWidth) {
	                lines[id] = { x     : x, 
	                              y     : y, 
	                              color : curColor,
	                              size 	: curSize
	                           };
	                //force a dot to be drawn
                   	self.move(id, 1, 0);
                   	////store undo data
                   	//undoLines[undoCount] = currentUndo;
                   	//currentUndo=[[]];
                   	//currentUndo.push(lines[id]);
                   	//undoCount++;
            	} else {
            		//this checks if the cusor size needs to be changed
            		var redraw = false;
					for (i = 0; i < cursor.length; i++) {
	            		if (x > cursor[i].location-25 && x < cursor[i].location+15) {
	            			curSize = cursor[i].radius;
	            			redraw = true;
						}
					}
	            	if (redraw) self.drawCursors();
					//if the color wheel is pressed
					if (x > colorX-20 && x < colorX+40) {
						self.showColors();
					}
					//check to see if the trashcan was clicked
					if (x > trashX && x < trashX+40) {
						var ck = confirm("Are you sure you want to clear your drawing?");
						if (ck == true) {
							lines = [];
							ctxt.clearRect(drawingAreaX, drawingAreaY, drawingAreaWidth+10, drawingAreaHeight+10);
							self.drawRect();
						}
					}
					//check to see if the save button was clicked
					if (x > saveX && x < saveX+40){
						var ck = confirm("Save your drawing?");
						if (ck == true) {
							self.saveImg(true, false);
						}
					}
					////check to see if the undo button was clicked
					//if (x > undoX && x < undoX+40) {
					//	alert("undo it " + undoCount + " : " + undoLines.length + " : " + currentUndo.length);
					//	while (undoLines.length)
					//	{
		            //       	undoCount--;
					//    	var doUndo = undoLines[undoCount];
		            //       	while(doUndo.length) {
		            //       		var line = doUndo.pop();
					//			alert(line + " : " + doUndo.length + " : " + undoLines.length + " : " + undoCount);
		            //       	}
	                //   	}
					//}

					//share the drawing
					if (x > shareX && x < shareX+40) {
						var fileName = self.saveImg(false, true);
						//here is where the file is sent to be shared
			          	window.plugins.shareImage.share("image", { fileName:fileName }, 
				       		function(result) {
				          		//alert(result);
					       	}, function(error) {
					          	alert('Error: ' + error);
					       	}
				       	);

					}
            	}
            });
			//prevent scrolling
            event.preventDefault();
        },
        //when the screen is touched this where the drawing happens
        draw: function(event) {
            $.each(event.touches, function(i, touch) {
                var	x = this.pageX - offset.left,
                	y = this.pageY - offset.top;
                //only store the keystrokes if they are in the drawing area
            	if (y < drawingAreaHeight && x < drawingAreaWidth) {
                	var id = touch.identifier,
                    	moveX = x - lines[id].x,
                    	moveY = y - lines[id].y;
                    if (x != moveX || y != moveY) {                	
		                var ret = self.move(id, moveX, moveY);
		                lines[id].x = ret.x;
		                lines[id].y = ret.y;
		                //while moving add every id so we know what to undo
	                   	//currentUndo.push(ret.x);
	                   	//alert(x + ":" + moveX + ":" + y+ ":"+  moveY)
                    }
               	}
            });
			//prevents scrolling
            event.preventDefault();
        },
        saveImg: function(showResult, returnFileName) {
			// Retrieve the area of canvas drawn on.
			var imageData = ctxt.getImageData(1, 1, drawingAreaWidth, drawingAreaHeight);

			// Create a new canvas and put the retrieve image data on it
			var newCanvas = document.createElement("canvas");
			newCanvas.width = drawingAreaWidth;
			newCanvas.height = drawingAreaHeight;
			newCanvas.getContext("2d").putImageData(imageData, 0, 0);

		    var img64 = newCanvas.toDataURL("image/png").replace(/data:image\/png;base64,/, '');
		    var resultText = null;
		    window.plugins.base64ToPNG.saveImage(img64, { returnFileName:returnFileName}, 
		       function(result) {
		          if (showResult) {
		          	alert(result);
		          }
		          resultText = result;
		       }, function(error) {
		          alert('Error: ' + error);
		       });
		    return resultText;
    	},
        //this is where the actual drawing on the screen happens
        move: function(i, changeX, changeY) {
            ctxt.strokeStyle = lines[i].color;
			ctxt.lineWidth = lines[i].size;
            ctxt.beginPath();
            ctxt.moveTo(lines[i].x, lines[i].y);

            ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
            ctxt.stroke();
            ctxt.closePath();

            return { x: lines[i].x + changeX, y: lines[i].y + changeY };
        }
    };
	//create the box to draw in
	self.drawRect();
	//now draw the cursors on screen and select the one in use
	self.drawCursors();

	//all the logic for the color picker
 	var colorWindow = {
		init: function(imageObj) {
		    ctxtColor.strokeStyle = "#444";
		    ctxtColor.lineWidth = 2;
		    //draw the color picker image
		    ctxtColor.drawImage(imageObj, 0, 0);
		    colorWindow.drawColorSquare(curColor, imageObj);
		 
		 	//create the accept button
		    ctxtColor.beginPath();
		    ctxtColor.fillStyle = "grey";
		    var x = 15,
		    	y = 340,
		    	xS = 100,
		    	yS = 40;
		    ctxtColor.fillRect(x, y, xS, yS);
		    ctxtColor.strokeRect(x, y, xS, yS);
		    ctxtColor.fillStyle = "black";
		    ctxtColor.font="20px Arial";
		    ctxtColor.fillText("Accept", x+20, 365);

		 	//create the cancel button
		    ctxtColor.beginPath();
		    ctxtColor.fillStyle = "grey";
		    x += 125;
		    y += 0;
		    xS += 0;
		    yS += 0;
		    ctxtColor.fillRect(x, y, xS, yS);
		    ctxtColor.strokeRect(x, y, xS, yS);
		    ctxtColor.fillStyle = "black";
		    ctxtColor.font="20px Arial";
		    ctxtColor.fillText("Cancel", x+20, 365);

		    //set the fill style back so that when we try to color it's correct
		    ctxtColor.fillStyle = curColor;

		    canvasColor.addEventListener("touchstart", colorWindow.getColor, false);
		    canvasColor.addEventListener("touchmove", colorWindow.getColor, false);
		},
		//touch events
		getColor: function(evt){
	        $.each(event.touches, function(i, touch) {
	        	var x = this.pageX - offset.left,
	            	y = this.pageY - offset.top,
	            	padding = 20,
					color = undefined;
		 		//only get a color if it's over the color picker
		        if (x < imageObj.width+padding && x > padding &&
			        y < imageObj.height+padding && y > padding) {
		            //color picker image is 256x256 and is offset by 10px from top and bottom
		            var imageData = ctxtColor.getImageData(0, 0, imageObj.width, imageObj.width);
		            var data = imageData.data;
		            x -= padding;
		            y -= padding;
		            var red = data[((imageObj.width * y) + x) * 4];
		            var green = data[((imageObj.width * y) + x) * 4 + 1];
		            var blue = data[((imageObj.width * y) + x) * 4 + 2];
		            x += padding;
		            y += padding;
		            
		            color = "rgb(" + red + "," + green + "," + blue + ")";
		        }
		 		//if a color was selected then update the square
		        if (color) {
		            colorWindow.drawColorSquare(color, imageObj);
		            selColor = color;
		        }
		        //for pressing the buttons
		        if (evt.type == "touchstart" && 
		        	x > 15 && x < 125 &&
		        	y > 360 && y < 410)
		        {
		        	curColor = selColor;
		        	self.hideColors();
		        } else if (evt.type == "touchstart" && 
		        	x > 150 && x < 275 &&
		        	y > 360 && y < 410)
		        {
		            colorWindow.drawColorSquare(curColor, imageObj);
		        	self.hideColors();
		        }
	        });
			//prevent scrolling
            event.preventDefault();
	    },
	    //draws/updates the square that shows the color selected from the picker
		drawColorSquare: function(color, imageObj){
		    var colorRectX = 200,
		    	colorRectY = 50,
				squareX = 25,
		    	squareY = 275;
		    ctxtColor.beginPath();
		    ctxtColor.fillStyle = color;
		    ctxtColor.fillRect(squareX, squareY, colorRectX, colorRectY);
		    ctxtColor.strokeRect(squareX, squareY, colorRectX, colorRectY);
		}
    };
    //the color picker image
 	var imageObj = new Image();
    imageObj.src = "color_picker.png";
    imageObj.onload = function(){ colorWindow.init(this); };
	
	//starts the drawing app
    return self.init();
};