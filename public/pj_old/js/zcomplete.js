/*! zComplete */
(function($){
	$.fn.zComplete = function(params){
		'use strict';
		var settings = $.extend({
			dataUrl:'',
			onSelect:function(item){}
		}, params);
		
		var KEY = {
			UP: 38,
			DOWN: 40,
			DEL: 46,
			TAB: 9,
			RETURN: 13,
			ESC: 27,
			COMMA: 188,
			PAGEUP: 33,
			PAGEDOWN: 34,
			BACKSPACE: 8
		};

		var $suggestive = $('<div class="suggestive"></div>');
		
		$suggestive.on({
			'close':function(ev){ $suggestive.hide(); },
			'show':function(ev){ $suggestive.show(); },
			'click':function(ev){ ev.stopPropagation(); }
		});

		$(document).on({
			'click':function(){
				$suggestive.trigger('close');
			},
			'keyup':function(el){
				if( el.keyCode===KEY.ESC || el.keyCode===KEY.RETURN ){
					$suggestive.trigger('close');
				}
			}
		});

		function showData($input, data){
			$suggestive.empty().insertAfter($input);
			var onSelect = $.proxy(settings.onSelect, $input);
			var $list = $('<ul></ul>').appendTo($suggestive);
			$.each(data, function (index, item){
				var text = item.value;
				var $li = $('<li>'+text+'</li>').appendTo($list);
				$li.on('click', function(ev){		
					ev.stopPropagation();
					onSelect(item);
					$suggestive.trigger('close');
				});	
			});
			$list.find('li').first().addClass('__selected');
			$suggestive.trigger('show');
		};

		function init($input){
			$input.on({
				'keyup':function(ev){
					if(ev.keyCode == KEY.UP || ev.keyCode == KEY.DOWN || ev.keyCode == KEY.RETURN){
						return false;
					}
					var val = $input.val();
					if(val.length < 2){ return true; }
					$.getJSON(settings.dataUrl, {query : val}, function(data, textStatus, jqXHR){
						showData($input, data);
					});
				},
				'click':function(ev){
					$input.select();
				},
				'blur':function(ev){
				},
				'keydown':function(ev){
					if(ev.keyCode == KEY.RETURN){
						ev.preventDefault();
						$suggestive.find('.__selected').trigger('click');
					}
					if(ev.keyCode == KEY.DOWN){
						ev.preventDefault();
						var curent = $suggestive.find('.__selected');
						var next = curent.next();
						if(next.size()){
							curent.removeClass('__selected');
							next.addClass('__selected');
						}
					}
					if(ev.keyCode == KEY.UP){
						ev.preventDefault();
						var curent = $suggestive.find('.__selected');
						var prev = curent.prev();
						if(prev.size()){
							curent.removeClass('__selected');
							prev.addClass('__selected');
						}
					}
				}
			});
			$input.data('zComplete', true).attr('autocomplete', 'off');
		}

		return this.each(function(){
			var $input = $(this);
			if($input.data('zComplete')){
				return;
			}
			init($input);
		});
	}
})(jQuery);

