/*!
 * zPopup, v1.0, MIT License
 * https://github.com/Zx12/zselect
 * bryzgalovd@gmail.com
 */
(function($){
	var init = function(zwrap, select){
		var zselect_text = $('.zselect_text', zwrap);
		if(zselect_text.size()==0){
			zwrap.append(
				'<div class="zselect_select">'+
					'<div class="zselect_text"></div>'+
				'</div>'
			);
			zselect_text = $('.zselect_text', zwrap);
		}
		zselect_text.text( $('option:selected', select).text() );
		
		select.on({
			'change':function(){
				zselect_text.text( $('option:selected', select).text() );
			},
			'reload':function(){
				zselect_text.text( $('option:selected', select).text() );
			},
			'focus':function(){
				zwrap.addClass('__focused');
			},
			'blur':function(){
				zwrap.removeClass('__focused');
			}
		});
	};

	$.fn.zselect = function(){
		return this.each(function(){
			var zwrap = $(this);
			var select = $('select', zwrap);
			if(!select.is('select')){
				return;
			}
			if(select.data('zxselect')){
				return;
			}			
			init(zwrap, select);
			select.data('zxselect', 1);
		});
	};
})(jQuery);