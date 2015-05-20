var validateIntInput = function (event) { // check input is valid or not
		var inputValue = $(this).val(); 
		var failed = false;
		
		try{
			var intValue = toInt(inputValue);
			if(inputValue != (""+intValue)){
				failed = true;
			}
		}
		catch (event){
			failed = true;	
		}
		
		if(failed){
			$(this).addClass("failedValidation");
		} else {
			$(this).removeClass("failedValidation");
		}
	};
$(".intValue").keyup(validateIntInput);
	
var validateUniqueName = function(){ // check if the name doesn't exist
		var unique = true;
		for (var i = 0; i < tilemap.animations.length; i++){
			if(tilemap.animations[i].name === $(this).val()){
				unique = false;
				break;
			}
		}
		
		if(unique){
			$(this).removeClass("failedValidation");
		} else {
			$(this).addClass("failedValidation");
		}
		return true;
	};
$("#addAnimationForm_input_name").keyup(validateUniqueName); 