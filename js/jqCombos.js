/***
** JQ DEPENDENT COMBOS **
- author: Ibeccaz
- contact: darknebo[at]gmail.com
- created: 03/12/2011

** CUSTOM VARS **

- target : The Html to be used as a container for the generated selects

- file : The PHP file that returns the results from the DB in json format. It contains the "id" [array], used for the value of the options and the "name" [array] used for the labels within the options; "label" is used to generate a label tag and "comboname" is used to assign a custom name to the generated combo.
All the arrays and strings are passed within an associative array encoded in json.
Example: echo json_encode(array("id"=>array("3","4"),"name" => array("futbol","basket"),'label'=>'the label','comboname'=>'mycustomname'));

- comboClass : You can add one o more css classes to the generated comboboxes just like this: 'oneClass anotherClass'.

- prefixElement : If you want to give it a prefix to the ID of the generated selects to avoid two elements with the same ID.

- wrapper : If you need to wrap each generated select in certain Html element with a class (can't be an ID, nop it can't).

***/

(function($){

$.fn.jqCombos = function(arguments){
	var args = {
		target		  : $(this).parent('div'),
		file		  :	'ajax.php',
		comboClass : '',
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
				clearNext();
			}
		});
	});
	
	function clear(el){
		var ele = "";
		if($(el).parent()){
			ele = $(el).parent();
		}else{
			ele = $(el);
		}
		if(o.wrapper !== ''){
			ele.nextAll($(o.wrapper).is('select[id^="'+o.prefixElement+'"]')).remove();
		}else{
			ele.nextAll('select[id^="'+o.prefixElement+'"]').remove();
		}
	}
	
	function clearNext(){
		if(o.wrapper !== ''){
			$(o.target).find('select[id="'+o.prefixElement+i+'"]').parent().remove();
		}else{
			$(o.target).find('select[id="'+o.prefixElement+i+'"]').remove();
		}
	}
	
	function ajax(send){
		i = 0;
		i = $(o.target).find('select[id^="'+o.prefixElement+'"]').length;
		$.post(o.file,{ data : send },function(reply){
			if(reply){
				var combo = '<select name="'+o.prefixElement+i+'" id="'+o.prefixElement+i+'"><option value="">--</option></select>';
				$(o.target).append(combo);
				if(o.comboClass !== ''){
					$('#'+o.prefixElement+i).addClass(o.comboClass);
				}
				if(o.wrapper !== ''){
					$('#'+o.prefixElement+i).wrap(o.wrapper);
				}
				if(reply.label && reply.label !== ''){
					$('#'+o.prefixElement+i).before('<label for="'+o.prefixElement+i+'">'+reply.label+'</label>&nbsp;');
				}
				if(reply.comboname && reply.comboname !== ''){
					$('#'+o.prefixElement+i).attr('name',reply.comboname);
				}
				$.each(reply.id,function(n){
					$('#'+o.prefixElement+i).append('<option value="'+reply.id[n]+'">'+reply.name[n]+'</option>');
				});				
				
				$('#'+o.prefixElement+i).jqCombos({
					target		  : o.target,
					file		  :	o.file,
					comboClass	: o.comboClass,
					prefixElement : o.prefixElement,
					wrapper		  :	o.wrapper
				});
				
			}		
			
		},"json");
		
	}
	
}
})(jQuery);