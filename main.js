(function () {

	var seed = '';
	var CSS_CODE;
	var RGB; 
	var bgColor
	var baseCircleSize;
	var backGroundVert;
	var backGroundHorz;
	var symmetry;
	var variation;
	var totalCircles = 0;
	
	
	if (typeof window.location.hash.split('#')[1] !== "undefined") {
		seed = window.location.hash.split('#')[1].replace(/\D/g,'');
		console.log('initial seed =' + seed);
	}

	if (seed.toString().length > 16) {
		seed = seed.substr(0,16);
		console.log('seed too big');
	}
	else if (seed.length < 16) {
		console.log('seed was yucky');
		seedGen();
	}

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

		location.hash = '#' + seed;
	}

	function newGrad(sect) {
		
		seedGen(sect);

		initGradValues();
		outputCSS();
	}

	function outputCSS() {

		CSS_CODE = blobGrad();
		console.log(CSS_CODE);
		console.log($('body').attr('style', CSS_CODE + '; '));
		//$('#pattern-css').html('body {' + CSS_CODE + ';\n}');
	}

	/*
	$('p[role="toolbar"]').prepend('Generate: <input type="button" value="All" id="all" title="Generate a new gradient"/>');

	$('input').on('click', function (e) {
		createGradient(this.id);
	});

	$('p[role="toolbar"]').prepend('Generate: <input type="button" value="Color" id="color" title="Regenerate colors"/>');

	$('input').on('click', function (e) {
		createGradient(this.id);
	});

	$('p[role="toolbar"]').prepend('Generate: <input type="button" value="Pattern" id="pattern" title=""/>');

	$('input').on('click', function (e) {
		createGradient(this.id);
	});
	*/

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

		variation = (getInts(7,1));

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

		backGroundVert = getInts(11,2)+200;
		backGroundHorz = getInts(13,2)+200;
		var unitV = 'px';
		var unitH = 'px';

		return backGroundVert + unitV + ' ' + backGroundHorz + unitH;
	}

	// blobGrad is the generating function for the pattern. If this looks really chaotic, that's because it's supposed to be. The more chaotic this is the
	// more interesting and varried the patterns it generates will be.
	function blobGrad() {

		var blob = 'background: ';
		var numCircles = getInts(8,2);
		var backGroundSize = bgSize();
		var circleSize = baseCircleSize;
		var horz = 0;
		var vert = 0;
		//var prevVerts = [];
		//var prevHorzs = []; 
		

		numCircles = Math.floor(numCircles/2);
		console.log('number of circles = ' + numCircles);

		blob = blob + ' radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + vert + 'px ' + horz + 'px, ';
		blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + ((backGroundVert/2) + vert) + 'px ' + ((backGroundHorz/2)+(horz)) + 'px';

		for (var i = numCircles; i >= 0; i--) {
			
			if(circleSize*2 >= backGroundVert || circleSize*2 >= backGroundHorz) {
				circleSize = circleSize/2;
			}

			//blob = blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + vert + 'px ' + horz + 'px, ';
			//blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + ((backGroundVert/2) + vert) + 'px ' + ((backGroundHorz/2)+(horz)) + 'px';

			blob = addBlob(blob, circleSize, vert, horz);
			blob = addBlob(blob, circleSize, ((backGroundVert/2) + vert), ((backGroundHorz/2) + horz));

			if(symmetry >= 2 ) {

				if(symmetry >= 3 && symmetry <= 4) {
					//blob = blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + (vert*-1) + 'px ' + horz + 'px, ';
					//blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + (((backGroundVert/2) + vert)*-1) + 'px ' + ((backGroundHorz/2)+(horz)) + 'px';

					blob = addBlob(blob, circleSize, (vert*-1), horz);
					blob = addBlob(blob, circleSize, (((backGroundVert/2) + vert)*-1), ((backGroundHorz/2) + horz));

					if (vert%2 == 0) {
						vert = ((vert + i) + (circleSize-1)) * variation;
						//changePosition((vert + i), circleSize, variation);
					}
					else {
						vert = ((vert + i) - (circleSize-1)) * variation;
						//changePosition((vert + i), (circleSize*-1), variation);
					}
				} 
				else if(symmetry >= 5 && symmetry <= 6) {
					//blob = blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + vert + 'px ' + (horz*-1) + 'px, ';
					//blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + ((backGroundVert/2) + vert) + 'px ' + ((backGroundHorz/2)+(horz)*-1) + 'px';
					blob = addBlob(blob, circleSize, vert, (horz*-1));
					blob = addBlob(blob, circleSize, ((backGroundVert/2) + vert), (((backGroundHorz/2) + horz)*-1));


					if (horz%2 == 0) {
						//horz = ((horz + i) + (circleSize-1)) * variation;
						horz = changePosition((horz + i), circleSize, variation);
					}
					else {
						//horz = ((horz + i) - (circleSize-1)) * variation;
						horz = changePosition((vert + i), (circleSize*-1), variation);
					}
				}
				else {
					//blob = blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + (vert*-1) + 'px ' + (horz*-1) + 'px, ';
					//blob = blob + ' radial-gradient(rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + (((backGroundVert/2) + vert)*-1) + 'px ' + ((backGroundHorz/2)+(horz)*-1) + 'px';
					blob = addBlob(blob, circleSize, vert, (vert*-1));
					blob = addBlob(blob, circleSize, (((backGroundVert/2) + vert)*-1), (((backGroundHorz/2) + horz)*-1));

					if (vert%2 == 0) {
						//vert = ((vert) + (circleSize-1)) * variation;
						vert = changePosition((vert + i), circleSize, variation);
					}
					if (horz%2 == 0) {
						//horz = ((horz) + (circleSize-1)) * variation;
						horz = changePosition((horz + i), circleSize, variation);
				
					}
					if (horz%2 != 0) {
						
						//horz = ((horz) - (circleSize-1)) * variation;
						
						horz = changePosition((horz + i), (circleSize*-1), variation);
					} 
					if(vert%2 != 0) {
						//vert = ((vert) - (circleSize-1)) * variation;
						vert = changePosition((vert + i), (circleSize*-1), variation);
					}
				}
			}
			else {
				if(i % 2 == 0) {
					var absVar = Math.abs(variation);
					var direction = absVar % i;

					if (direction <= absVar*.75) {
						vert = changePosition((vert + i), circleSize, variation);
					}
					else if (direction <= absVar*.5) {
						vert = changePosition((vert + i), (circleSize*-1), variation);
					}
					else {
						vert = changePosition((vert + i), circleSize, variation);
						horz = changePosition((horz + i), (circleSize*-1), variation);
					}
				}
				else {
					if (direction <= absVar*.75) {
						horz = changePosition((horz + i), circleSize, variation);
					}
					else if (direction <= absVar*.5) {
						horz = changePosition((horz + i), (circleSize*-1), variation);
					}
					else {
						horz = changePosition((horz + i), circleSize, variation);
						vert = changePosition((vert + i), (circleSize*-1), variation);
					}
				}
			}


			if(circleSize-i <= 0) {
				circleSize += baseCircleSize;
			}
			else {
				circleSize -= variation;

				if(circleSize < 0) {
					circleSize = Math.abs(circleSize);
				}
			}

			if(Math.abs(vert) > backGroundVert) {
				vert = vert/backGroundVert;
			}

			if(Math.abs(horz) > backGroundHorz) {
				horz = horz/backGroundHorz;
			}

			variation*-1;

			blob = blob + '\n'

		}

		blob = blob + ';\n background-size: ' + backGroundSize + '; background-color: rgba(' + bgColor + ')';
		return blob;
	}

	function addBlob(blob, circleSize, vert, horz) {
		
		totalCircles++;

		return blob + ', radial-gradient( rgba(' + RGB + ') ' + circleSize + 'px, rgba(0,0,0,0) 0) ' + vert + 'px ' + horz + 'px ';
	}

	function changePosition(pos, circleSize, variation) {

		return (pos + (circleSize-1)) * variation;
	}

/*
	$('.toggle-link').click(function (e) {
        // Has the href been used correctly?
        if ($(this).attr('href').substring(0, 1) == "#") {
            target = $(this).attr('href');
            openTxt = $(this).attr('data-open');
            closeTxt = $(this).attr('data-close');
            // Does the target exist, and is it currently hidden?
            if ($(target).length && $(target).is(':hidden')) {
                $(target).slideDown();
                if (closeTxt != '') $(this).html(closeTxt);
                $(this).addClass('open');
                if(target == '#grad-css-p') $(this).parent().parent().parent().addClass('wide');
                if(target == '#deets') $(this).parent().parent().parent().addClass('tall');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            else if ($(target).length) {
                $(target).slideUp();
                if (openTxt != '') $(this).html(openTxt);
                $(this).removeClass('open');
                if(target == '#grad-css-p') $(this).parent().parent().parent().removeClass('wide');
				if(target == '#deets') $(this).parent().parent().parent().removeClass('tall');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });
    $('.js-hide').hide();
	*/
}());