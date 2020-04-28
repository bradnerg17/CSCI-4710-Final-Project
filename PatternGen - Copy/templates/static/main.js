
	var seed = '';
	var CSS_CODE;
	var RGB; 
	var bgColor
	var baseCircleSize;
	var backGroundHori;
	var backGroundVert;
	var symmetry;
	var variation;
	var totalCircles = 0;
	var numCircles;

	function seedGen(sect) {

		var newSeed = Math.random().toString().substr(2,18);
		console.log(newSeed);

		while(newSeed.length < 16) {
			newSeed = Math.random().toString().substr(2,18);
			console.log(newSeed);
		}

		if (sect == 'color') {
			newSeed = newSeed.substr(0,6) + seed.substr(6);
		}

		if (sect == 'pattern') {
			newSeed = seed.substr(0,6) + newSeed.substr(6);
		}

		seed = newSeed.substr(0,16);

	}

	function newGrad(sect) {
		
		seedGen(sect);

		initGradValues();
		outputCSS();
	}

	function outputCSS() {

		CSS_CODE = blobGrad();
		console.log(CSS_CODE);
		document.getElementById('CSS_CODE').value = CSS_CODE;
		console.log($('body').attr('style', CSS_CODE + '; '));
	}

	$(document).ready(function() {
        $(".newbg").click(function() {
            newGrad('all');
        });
        $(".newcolor").click(function() {
            newGrad('color');
        });
        $(".newpattern").click(function() {
            newGrad('pattern');
        });
    });

	$('body').on('keyup', function (e) {
		if (e.keyCode == 32) newGrad('all'); //spacebar
		if (e.keyCode == 67) newGrad('color'); //C
		if (e.keyCode == 80) newGrad('pattern'); //P
	});

	function initGradValues() {

		var red, green, blue, invertR, invertG, invertB;
		red = parseInt(getInts(0,2)*255/100);
		green = parseInt(getInts(2,2)*255/100);
		blue = parseInt(getInts(4,2)*255/100);

		invertR = 255-red;
		invertG = 255-green;
		invertB = 255-blue;
	
		RGB = red + ',' + green + ',' + blue + ',' + '1';
		bgColor = invertR + ',' + invertG + ',' + invertB + ',' + '.5';

		variation = (getInts(6,2));

		numCircles = getInts(8,2);

		baseCircleSize = (getInts(10,1)+10);

		symmetry = getInts(15,1);
	}

	initGradValues();
	newGrad();
	outputCSS();

	function getInts(i, j) {
		return parseInt(seed.toString().substr(i, j));
	}

	function bgSize() {

		backGroundHori = getInts(11,2)+200;
		backGroundVert = getInts(13,2)+200;
		var unitV = 'px';
		var unitH = 'px';

		return backGroundHori + unitV + ' ' + backGroundVert + unitH;
	}

	// blobGrad is the generating function for the pattern. If this looks really chaotic, that's because it's supposed to be. The more chaotic this is the
	// more interesting and varried the patterns it generates will be.
	function blobGrad() {

		var blob = 'background: ';
		
		var backGroundSize = bgSize();
		var circleSize = baseCircleSize;
		var vert = 0;
		var hori = 0;

		numCircles = Math.floor(numCircles/2);
		console.log('number of circles = ' + numCircles);

		//Initial circle
		blob = blob + ' radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + hori + 'px ' + vert + 'px, ';

		//Cirlces are created in pairs, the second circle is diagonal copy of the first to create a checker like pattern and make the pattern look more varried
		blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + ((backGroundHori/2) + hori) + 'px ' + ((backGroundVert/2)+(vert)) + 'px';

		//the main generating loop of the pattern
		for (var i = numCircles; i >= 0; i--) {
			
			if(circleSize*2 >= backGroundHori || circleSize*2 >= backGroundVert) {
				circleSize = circleSize/2;
			}

			blob = addBlob(blob, circleSize, hori, vert);
			blob = addBlob(blob, circleSize, ((backGroundHori/2) + hori), ((backGroundVert/2) + vert));

			// Creates Symmetry in the pattern
			if(symmetry >= 2 ) {

				//Horizontal symmetry
				if(symmetry >= 3 && symmetry <= 4) {

					blob = addBlob(blob, circleSize, (hori*-1), vert);
					blob = addBlob(blob, circleSize, (((backGroundHori/2) + hori)*-1), ((backGroundVert/2) + vert));

					//adds variation in the pattern
					if (hori%2 == 0) {
						
						hori = changePosition((hori + i), circleSize, variation);
					}
					else {
						
						hori = changePosition((hori + i), (circleSize*-1), variation);
					}
				} 
				//Horiical symmetry
				else if(symmetry >= 5 && symmetry <= 6) {

					blob = addBlob(blob, circleSize, hori, (vert*-1));
					blob = addBlob(blob, circleSize, ((backGroundHori/2) + hori), (((backGroundVert/2) + vert)*-1));

					//adds variation in the pattern
					if (vert%2 == 0) {

						vert = changePosition((vert + i), circleSize, variation);
					}
					else {
			
						vert = changePosition((hori + i), (circleSize*-1), variation);
					}
				}

				//Diagonal symmetry
				else {
					
					blob = addBlob(blob, circleSize, hori, (vert*-1));
					blob = addBlob(blob, circleSize, ((backGroundHori/2) + hori), (((backGroundVert/2) + vert)*-1));

					//adds variation in the pattern
					if (hori%2 == 0) {
						
						hori = changePosition((hori + i), circleSize, variation);
					}
					if (vert%2 == 0) {
						
						vert = changePosition((vert + i), circleSize, variation);
				
					}
					if (vert%2 != 0) {
						
						vert = changePosition((vert + i), (circleSize*-1), variation);
					} 

					if(hori%2 != 0) {

						hori = changePosition((hori + i), (circleSize*-1), variation);
					}
				}
			}
			//No symmetry. This is meant to be very chaotic for more randomness.
			else {
				var absVar = Math.abs(variation);
				var direction = absVar % i;
				if(i % 2 == 0) {
					
					if (direction <= absVar*.75) {
						hori = changePosition((hori + i), circleSize, variation);
					}
					else if (direction <= absVar*.5) {
						hori = changePosition((hori + i), (circleSize*-1), variation);
					}
					else {
						hori = changePosition((hori + i), circleSize, variation);
						vert = changePosition((vert + i), (circleSize*-1), variation);
					}
				}
				else {

					if (direction <= absVar*.75) {
						vert = changePosition((vert + i), circleSize, variation);
					}
					else if (direction <= absVar*.5) {
						vert = changePosition((vert + i), (circleSize*-1), variation);
					}
					else {
						vert = changePosition((vert + i), circleSize, variation);
						hori = changePosition((hori + i), (circleSize*-1), variation);
					}
				}
			}

			//create variation in the circle sizes
			if(circleSize-i <= 0) {
				circleSize += baseCircleSize;
			}
			else {
				circleSize -= variation;

				if(circleSize < 0) {
					circleSize = Math.abs(circleSize);
				}
			}

			// this is to keep the circles with in the bounds of the tile
			if(Math.abs(hori) > backGroundHori) {
				hori = hori/backGroundHori;
			}

			if(Math.abs(vert) > backGroundVert) {
				vert = vert/backGroundVert;
			}

			variation*-1;

			blob = blob + '\n'

		}

		blob = blob + ';\n background-size: ' + backGroundSize + '; background-color: rgba(' + bgColor + ')';

		console.log(totalCircles);
		return blob;
	}

	function addBlob(blob, circleSize, hori, vert) {
		
		totalCircles++;

		return blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + hori + 'px ' + vert + 'px ';
	}

	function changePosition(pos, circleSize, variation) {

		return (pos + (circleSize-1)) * variation;
	}

