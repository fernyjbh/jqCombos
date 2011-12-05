/***
** JQ DEPENDENT COMBOS **
- author: Ibeccaz
- contact: darknebo[at]gmail.com
- created: 03/12/2011

** CUSTOM VARS **

- target : The Html to be used as a container for the generated selects

- file : The PHP file that returns the results from DB in json format. It contains the "id" array() used for the value of the options and the "name" array() used for the label of the options. Both arrays wrapped in an associative array encoded in json.
Example: json_encode(array("id"=>array("8","9"),"name" => array("bicentenario","wikileaks")));

- prefixElement : If you want to give it a prefix to the ID of the generated selects to avoid two elements with the same ID.

- wrapper : If you need to wrap each generated select in certain Html element with a class (can't be an ID, nop it can't).

***/

(function($){

$.fn.jqCombos = function(arguments){
	var args = {
		target		  : $(this).parent('div'),
		file		  :	'ajax.php',
		prefixElement : 'jqCombo_',
		wrapper		  :	''
	}
	
	var o = $.extend(args,arguments);
	var element = $(this);
	var i = $(o.target).find('select[id^="'+o.prefixElement+'"]').length;
	
	return this.each(function(){
		$(this).change(function(){
			clear(element);
			clearNext();
			if($(element).val() > 0){
				ajax($(element).val());
			}else{
				clear(element);
			}
		});
	});
	
	function clear(el){
		if(o.wrapper !== ''){
			$(el).nextAll($(o.wrapper).is('select[id^="'+o.prefixElement+'"]')).remove();
		}else{
			$(el).nextAll('select[id^="'+o.prefixElement+'"]').remove();
		}
	}
	
	function clearNext(){
		if(o.wrapper !== ''){
			$(o.target).find('select[id="'+o.prefixElement+i+'"]').parent().remove();
		}			
		$(o.target).find('select[id="'+o.prefixElement+i+'"]').remove();
	}
	
	function ajax(send){
		
		$.post(o.file,{ data : send },function(reply){
			if(reply){
				var combo = '<select name="'+o.prefixElement+i+'" id="'+o.prefixElement+i+'"><option value="">--</option></select>';
				$(o.target).append(combo);
				if(o.wrapper !== ''){
					$('#'+o.prefixElement+i).wrap(o.wrapper);
				}
				
				$.each(reply.id,function(n){
					$('#'+o.prefixElement+i).append('<option value="'+reply.id[n]+'">'+reply.name[n]+'</option>');
				});				
				
				$('#'+o.prefixElement+i).jqCombos({
					target		  : o.target,
					file		  :	o.file,
					prefixElement : o.prefixElement,
					wrapper		  :	o.wrapper
				});
			}
		},"json");
		
	}
	
}
})(jQuery);