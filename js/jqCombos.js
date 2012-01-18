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

(function(window, document, undefined) {

/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 */

  var prefixes = ['webkit', 'Moz', 'ms', 'O'], /* Vendor prefixes */
      animations = {}, /* Animation rules keyed by their name */
      useCssAnimations;

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div'),
        n;

    for(n in prop) {
      el[n] = prop[n];
    }
    return el;
  }

  /**
   * Inserts child1 before child2. If child2 is not specified,
   * child1 is appended. If child2 has no parentNode, child2 is
   * appended first.
   */
  function ins(parent, child1, child2) {
    if(child2 && !child2.parentNode) ins(parent, child2);
    parent.insertBefore(child1, child2||null);
    return parent;
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style');
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  })();

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-'),
        start = 0.01 + i/lines*100,
        z = Math.max(1-(1-alpha)/trail*(100-start) , alpha),
        prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
        pre = prefix && '-'+prefix+'-' || '';

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:'+z+'}' +
        start + '%{opacity:'+ alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail)%100 + '%{opacity:'+ alpha + '}' +
        '100%{opacity:'+ z + '}' +
        '}', 0);
      animations[name] = 1;
    }
    return name;
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   **/
  function vendor(el, prop) {
    var s = el.style,
        pp,
        i;

    if(s[prop] !== undefined) return prop;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined) return pp;
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop) {
      el.style[vendor(el, n)||n] = prop[n];
    }
    return el;
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def) {
        if (obj[n] === undefined) obj[n] = def[n];
      }
    }
    return obj;
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = {x:el.offsetLeft, y:el.offsetTop};
    while((el = el.offsetParent)) {
      o.x+=el.offsetLeft;
      o.y+=el.offsetTop;
    }
    return o;
  }

  /** The constructor */
  var Spinner = function Spinner(o) {
    if (!this.spin) return new Spinner(o);
    this.opts = merge(o || {}, Spinner.defaults, defaults);
  },
  defaults = Spinner.defaults = {
    lines: 12, // The number of lines to draw
    length: 7, // The length of each line
    width: 5, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 100, // Afterglow percentage
    opacity: 1/4,
    fps: 20
  },
  proto = Spinner.prototype = {
    spin: function(targetSpin) {
      this.stop();
      var self = this,
          el = self.el = css(createEl(), {position: 'relative'}),
          ep, // element position
          tp; // targetSpin position

      if (targetSpin) {
        tp = pos(ins(targetSpin, el, targetSpin.firstChild));
        ep = pos(el);
        css(el, {
          left: (targetSpin.offsetWidth >> 1) - ep.x+tp.x + 130 +'px',
          top: (targetSpin.offsetHeight >> 1) - ep.y+tp.y + 'px'
        });
      }
      el.setAttribute('aria-role', 'progressbar');
      self.lines(el, self.opts);
      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var o = self.opts,
            i = 0,
            fps = o.fps,
            f = fps/o.speed,
            ostep = (1-o.opacity)/(f*o.trail / 100),
            astep = f/o.lines;

        (function anim() {
          i++;
          for (var s=o.lines; s; s--) {
            var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
            self.opacity(el, o.lines-s, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
        })();
      }
      return self;
    },
    stop: function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode) el.parentNode.removeChild(el);
        this.el = undefined;
      }
      return this;
    }
  };
  proto.lines = function(el, o) {
    var i = 0,
        seg;

    function fill(color, shadow) {
      return css(createEl(), {
        position: 'absolute',
        width: (o.length+o.width) + 'px',
        height: o.width + 'px',
        background: color,
        boxShadow: shadow,
        transformOrigin: 'left',
        transform: 'rotate(' + ~~(360/o.lines*i) + 'deg) translate(' + o.radius+'px' +',0)',
        borderRadius: (o.width>>1) + 'px'
      });
    }
    for (; i < o.lines; i++) {
      seg = css(createEl(), {
        position: 'absolute',
        top: 1+~(o.width/2) + 'px',
        transform: 'translate3d(0,0,0)',
        opacity: o.opacity,
        animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
      });
      if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));
      ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
    }
    return el;
  };
  proto.opacity = function(el, i, val) {
    if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
  };

  /////////////////////////////////////////////////////////////////////////
  // VML rendering for IE
  /////////////////////////////////////////////////////////////////////////

  /** 
   * Check and init VML support
   */
  (function() {
    var s = css(createEl('group'), {behavior: 'url(#default#VML)'}),
        i;

    if (!vendor(s, 'transform') && s.adj) {

      // VML support detected. Insert CSS rules ...
      for (i=4; i--;) sheet.addRule(['group', 'roundrect', 'fill', 'stroke'][i], 'behavior:url(#default#VML)');

      proto.lines = function(el, o) {
        var r = o.length+o.width,
            s = 2*r;

        function grp() {
          return css(createEl('group', {coordsize: s +' '+s, coordorigin: -r +' '+-r}), {width: s, height: s});
        }

        var g = grp(),
            margin = ~(o.length+o.radius+o.width)+'px',
            i;

        function seg(i, dx, filter) {
          ins(g,
            ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
              ins(css(createEl('roundrect', {arcsize: 1}), {
                  width: r,
                  height: o.width,
                  left: o.radius,
                  top: -o.width>>1,
                  filter: filter
                }),
                createEl('fill', {color: o.color, opacity: o.opacity}),
                createEl('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
              )
            )
          );
        }

        if (o.shadow) {
          for (i = 1; i <= o.lines; i++) {
            seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
          }
        }
        for (i = 1; i <= o.lines; i++) {
          seg(i);
        }
        return ins(css(el, {
          margin: margin + ' 0 0 ' + margin,
          zoom: 1
        }), g);
      };
      proto.opacity = function(el, i, val, o) {
        var c = el.firstChild;
        o = o.shadow && o.lines || 0;
        if (c && i+o < c.childNodes.length) {
          c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
          if (c) c.opacity = val;
        }
      };
    }
    else {
      useCssAnimations = vendor(s, 'animation');
    }
  })();

  window.Spinner = Spinner;

})(window, document);

/*SEPARADOR*/


(function($) {
$.fn.spin = function(opts, color) {
var presets = {
"tiny": { lines: 8, length: 2, width: 2, radius: 3 },
"small": { lines: 8, length: 4, width: 3, radius: 5 },
"large": { lines: 10, length: 8, width: 4, radius: 8 }
};
if (Spinner) {
return this.each(function() {
var $this = $(this),
data = $this.data();

if (data.spinner) {
data.spinner.stop();
delete data.spinner;
}
if (opts !== false) {
if (typeof opts === "string") {
if (opts in presets) {
opts = presets[opts];
} else {
opts = {};
}
if (color) {
opts.color = color;
}
}
data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
}
});
} else {
throw "Spinner class not available.";
}
};
})(jQuery);

/*SPin*/

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
	/*inicio loader*/
		i = 0;
		i = $(o.target).find('select[id^="'+o.prefixElement+'"]').length;
		//alert(o.prefixElement+(i-1));
		$('#'+o.prefixElement+(i-1)).parent().spin("small");
		$.post(o.file,{ data : send },function(reply){
	/*fin loader*/
	$('#'+o.prefixElement+(i-1)).parent().spin(false);
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
			else {
				/*fin loader*/
				$('#'+o.prefixElement+(i-1)).parent().spin(false);
			}		
		
		
		},"json");
		
	}
	
}
})(jQuery);	