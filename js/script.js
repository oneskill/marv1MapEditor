var ANIMATION_NS = "animation";
var TILE_NS = "tile";
var GRID_NS = "grid";

var tilemap = {   // Create Tilemap Object (Init object)
	width: undefined,
	height: undefined,
	tileWidth: undefined,
	tileHeight: undefined,
	animations: []
}

var animations = (function() { // Create Tile 
	var SINGLE = 0;

	var fragment = $("<div class='animation'><a class='close' href='#'>x</a><span class='name'></span></div>");
	var counter  = 1;
	var type = SINGLE;

	return {
		SINGLE: SINGLE,
		setType: function (newType) {
			type = newType;
		},
        add: function(){ //init function add of object animations
        	
        	var animation = {
        		name:         $("#addAnimationForm_input_name").val(),
        		url:          $("#addAnimationForm_input_url").val(),
        		nbframes:     1,
        		rate:         0,
        		offsetx:      parseInt($("#addAnimationForm_input_offsetx").val()),
        		offsety:      parseInt($("#addAnimationForm_input_offsety").val()),
        		delta:        0,
        		nbanimations: parseInt($("#addAnimationForm_input_nbanimations").val()),
        		distance:     parseInt($("#addAnimationForm_input_distance").val()),
        		type:         $("#addAnimationForm_input_type").val(),
        		multiple:     false
        	};

        	
        	switch (type){ // check if 
        		case SINGLE:
        		fragment.css({left: 8+120*tilemap.animations.length, top: 5});

        		$("#animations").append(fragment.clone().attr("id","animation_"+counter));
        		var dom = $("#animation_"+counter);
        		$("#animation_"+counter+" .name").html(animation.name);
        		dom.data(ANIMATION_NS, animation);
        		dom.append("<div class='animationthumb' style=\"height: "+minMax(0,tilemap.tileHeight,70)+"px; width: "+minMax(0,tilemap.tileWidth,70)+"px; background: "+generateBackground(animation)+";\"></div>");
        		tilemap.animations.push(animation);
        		counter++;
        		break;
        		$("#addAnimationButton").addClass("disabled");

        		break;
        	}
        	return true;
        }
    }
})();

$(function(){
	var resize = function() { // function for resize each elements of the page
		$("#tilemap").height(
			$(window).height()
			-$("#toolbarTile").height()
			-$("#toolbarAnimation").height()
			-$("#animations").height()-20);
	};
	resize();
	$(window).resize(resize);

	$("#animations").delegate(".animation", "click", function(event){ 
		if($(this)[0] === $(".animation.selected")[0]) {
			$(".animation.selected").removeClass("selected");
		} else {
			$(".animation.selected").removeClass("selected");
			$(this).toggleClass("selected");
		}
	}); 

	var updateSelectionBoxes = function(){
		var offsetx, offsety, delta, frameNb, animationType;
		try {
			$(".selelectionBoxes").remove();
			
			offsetx = toInt($("#addAnimationForm_input_offsetx").val());
			offsety = toInt($("#addAnimationForm_input_offsety").val());
			
			$("#addAnimationSelectionBox").css("left",offsetx);
			$("#addAnimationSelectionBox").css("top",offsety);

			delta = toInt($("#addAnimationForm_input_delta").val());
			frameNb = toInt($("#addAnimationForm_input_nbframes").val());
			animationType = $("#addAnimationForm_input_type").val();
			
			for(var i = 1; i < frameNb; i++) {
				var left, top;
				var removedBorder = "";
				switch(animationType){
					case "ANIMATION_VERTICAL" :
					left = offsetx;
					top  = offsety + (i)*delta;
					break;
					case "ANIMATION_HORIZONTAL":
					left = offsetx + (i)*delta;
					top  = offsety;
					break;
				}
				$("#addAnimationImage").append("<div class='selelectionBoxes' style='width: "+(tilemap.tileWidth - 6)+"; height: "+(tilemap.tileHeight - 6)+"; left: "+left+"; top: "+top+removedBorder+"'></div>");
			}
			
		} catch (exception) {};
		return true;
	};
	$("#addAnimationForm_input_offsetx").keyup(updateSelectionBoxes);
	$("#addAnimationForm_input_offsety").keyup(updateSelectionBoxes);
	$("#addAnimationForm_input_delta, #addAnimationForm_input_nbframes, #addAnimationForm_input_type").change(updateSelectionBoxes);
	
	$("#grid").delegate(".grid", "click", function(event){ 
		$(".grid.selected").removeClass("selected");
		$(this).toggleClass("selected");

		var animation = $(".animation.selected").data(ANIMATION_NS);
		if(animation) {
			var coordinate = $(this).data(GRID_NS);
			var tile = $(".tile.col_"+coordinate.x+".row_"+coordinate.y);
			if(tile.size() > 0){
				tile.css("background", generateBackground(animation));
				tile.data(TILE_NS, animation.name);
			} else {
				tile = $("<div class='tile' />")
				.css({
					width: tilemap.tileWidth, 
					height: tilemap.tileHeight, 
					left: (tilemap.tileWidth)*coordinate.x, 
					top: (tilemap.tileHeight)*coordinate.y, 
					background: generateBackground(animation)})
				.data(TILE_NS, animation.name)
				.addClass("row_"+coordinate.y+" col_"+coordinate.x);
				$("#tiles").append(tile);
			}
		}
	});
	
	$("#animations").delegate("a.close", "click", function(event){
		var animationDom = $(this).parent();
		var animation = animationDom.data(ANIMATION_NS);

		$(".tile").each(function(){
			if($(this).data(TILE_NS) === animation.name){
				$(this).remove();
			}
		});
		var animationIndex = tilemap.animations.indexOf(animation);
		tilemap.animations.splice(animationIndex, 1);
		animationDom.remove();

		for (var i = animationIndex + 1 ; i < tilemap.animations.length + 1; i++){
			$("#animation_"+(i+1)).css("left",8+120*(i-1));
		}
	});
	
	$(document).keydown(function(event){
		if(event.keyCode == '8' && event.srcElement.tagName !== "input") {
			var coordinate = $(".grid.selected").data(GRID_NS);
			if(coordinate !== undefined){
				var tile = $(".tile.col_"+coordinate.x+".row_"+coordinate.y);
				if(tile.size() > 0){
					tile.removeData(TILE_NS);
					tile.remove();
				}
				event.preventDefault();
			}
		}
	});


	modalDialog.register("addAnimationOverlay", "addAnimationButton", function(){
		$("#addAnimationForm").find(".intValue").each(validateIntInput);
		$("#addAnimationForm_input_name").each(validateUniqueName);

		return animations.add();
	});
	
	modalDialog.register("exportOverlay","saveButton");
	$("#saveButton").click(function(){
		var exportText = "";
		var reverseAnimationMap = [];
		
		for (i = 0; i < tilemap.animations.length; i++){
			reverseAnimationMap[tilemap.animations[i].name] = i+1;
			var animation = tilemap.animations[i];
		}	
		
		exportText += "// the tilemap array\n"; // creation of the export TileMap
		exportText += "var map = [";
		var firstLine = true;
		for(i = 0; i < tilemap.height; i++) {
			var firstColumn = true;
			if(!firstLine) {
				exportText += ",\n           ";
			} else {
				firstLine = false;
			}
			exportText += "[";
			for(j = 0; j < tilemap.width; j++){
				if(!firstColumn){
					exportText += ", ";
				} else {
					firstColumn = false;
				}
				var tileDom = $(".tile.col_"+j+".row_"+i);
				if(tileDom.size() > 0) {
					var name = tileDom.data(TILE_NS);
					if(name !== undefined){
						exportText += reverseAnimationMap[name];
					}
				} else {
					exportText += "0";
				}
			}
			exportText += "]";
		}
		exportText += "]\n\n";
		exportText += ".addTilemap('tilemap', map,  animations, {width: "+tilemap.tileWidth+", height: "+tilemap.tileHeight+", sizex: "+tilemap.width+", sizey: "+tilemap.height+"});";
		
		$("#exportArea").val(exportText);
	});

modalDialog.register("newOverlay", "newButton", function(){ // creation of the window for create the map
	$("#newForm").find(".intValue").each(validateIntInput);
	if($("#newForm").find(".failedValidation").size() > 0) return false;

	var tileWidth  = parseInt($("#newForm_input_tile_width").val()); 
	var tileHeight = parseInt($("#newForm_input_tile_height").val());
	var mapWidth   = parseInt($("#newForm_input_map_width").val());
	var mapHeight  = parseInt($("#newForm_input_map_height").val());
	var animationType = "simple animations"

	tilemap.width = mapWidth;
	tilemap.height = mapHeight;
	tilemap.tileWidth = tileWidth;
	tilemap.tileHeight = tileHeight;

	var fragment = $("<div class='grid'/>").css({width: tileWidth-1, height: tileHeight-1});
	for(var i=0; i < mapHeight; i++) {
		for(var j=0; j < mapWidth; j++){
			var grid = fragment.clone().css({left: (tileWidth)*j, top: (tileHeight)*i}).addClass("row_"+i+" col_"+j);
			$("#grid").append(grid);
			grid.data(GRID_NS,{x:j, y: i});
		}
	}

	switch(animationType){
		case "simple animations" :
		animations.setType(animations.SINGLE);
		break;
	}
	$("#addAnimationButton").removeClass("disabled");
	$("#gridButton").removeClass("disabled");
	$("#saveButton").removeClass("disabled");
	$("#newButton").addClass("disabled");
	return true;
});
});
