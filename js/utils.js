var modalDialog = (function() { // function for create window with buttons

	var availableDialog = [];

	return {
		register: function(dialogName, buttonId, okHandler) {
			if(availableDialog[dialogName] === undefined) {
				var dialog = $("#" + dialogName);

				var button = $("#" + buttonId);

				button.click(function(){
					if(!button.hasClass("disabled")){

						dialog.show();
						$("#overlay").show();

						var buttonOffset = button.offset();
						var leftPos = minMax(2, buttonOffset.left + (button.width() * 0.5) - (dialog.width() * 0.5), $(window).width() - dialog.width() - 2);
						var topPos  = minMax(2, buttonOffset.top + button.height() + 10,  $(window).height() - dialog.height() - 2);
						dialog.css({
							left: leftPos,
							top: topPos
						});


					}
					return false;
				});

				availableDialog.push(dialog);

				dialog.delegate("button", "click", function(event){
					var success = false;
					switch(this.name) {
						case "ok":
						success = (okHandler !== undefined) ? okHandler.call(this) : true;
						break;
						case "cancel":
						success = true;
						break;
					}
					if (success){
						$("#overlay").hide();
						dialog.hide();
					}
					return false;
				});

				return true;
			}
			return false;
		}
	}
})();

var minMax = function (min, val , max){
	return Math.max(min, Math.min(val, max));
}

var toInt = function(value){
	if (value === "" || value === undefined) {
		throw "Put a number!"
	}
	var result = parseInt(value);
	if(result === NaN){
		throw "Put a number!"
	}
	return result;
}

var isAddAnimationOverlayVisible = function (){
	var display = $("#addAnimationOverlay").css("display")
	return display !== "none";
}
$("#addTileForm_input_url").change(function(event){
	if(isAddAnimationOverlayVisible()){
		var url = "url('"+$(this).val()+"')";
		$("#addAnimationImage").css("background", url);
		$("#addAnimationSelectionBox").css("width", tilemap.tileWidth - 6);
		$("#addAnimationSelectionBox").css("height", tilemap.tileHeight - 6);
	}
});

var generateBackground = function(animation) {
	var background = "url('"+animation.url+"') -"+animation.offsetx+"px -"+animation.offsety+"px";
	return background
}



