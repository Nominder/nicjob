/*
<div class="upload">
	<div class="upload_status js_status"></div>
	<div class="upload_bar js_bar">
		<div class="upload_progress js_progress">
			<span class="upload_percent js_percent"></span>
		</div>
	</div>
</div>

<div class="upload_result">
	<div class="upload_result_title"></div>
	<div class="upload_result_remove js_result_remove">x</div>
	<input type="hidden" name="tmp[]" value="">
</div>

*/
(function($){

	$.fn.ajaxUpload = function(){

		return this.each(function(){

			var file = $(this);
			var root = file.parent().append('<div class="upload"><div class="upload_status js_status"></div><div class="upload_bar js_bar"><div class="upload_progress js_progress"><span class="upload_percent js_percent"></span></div></div></div>');
			
			var status = $('.js_status', root);
			var bar = $('.js_bar', root);
			var progress = $('.js_progress', root);
			var percent = $('.js_percent', root);
			
			var url = root.data('url') || 'index';
			var submiting = false;
			
			file.on('click', function(ev){
				if(submiting){
					ev.preventDefault();return false;
				}
			});

			file.fileupload({
				dataType:'json',
				url:location.href,
				add:function(e, data) {
					progress.css('width',0);
					bar.show();
					submiting = true;
					data.submit();
				},
				done:function(e, data){
					var result = data.result;
					console.dir(result);
					if(result['error']){
						status.text(result['error_msg']).show();
					}else{
                                                var hasImage = false;
                                                var imgMain = $( "#main_photo" );
                                                var imgDiplom = $("#diplom_photo");
                                                var imgPortfolio = $("#portfolio_photo");
                                                
                                                
                                                if(result['is_diplom'])
                                                {
                                                    result['path'] = result['path'].replace("imgorg", "313_313");
                                                    imgDiplom.html('<img src="'+result['path']+'" alt="img1">');
                                                    hasImage = true;
                                                }
                                                if(result['is_portfolio'])
                                                {
                                                    result['path'] = result['path'].replace("imgorg", "313_313");
                                                    imgPortfolio.html('<img src="'+result['path']+'" alt="img1">');
                                                    hasImage = true;
                                                }
                                                
                                            if(!hasImage)
                                            {
                                                if(imgMain.html() === "" || imgMain.html().indexOf("/img/img1.png")!==-1)
                                                {
                                                    result['path'] = result['path'].replace("imgorg", "313_313");
                                                    imgMain.html('<img src="'+result['path']+'" alt="img1">');
                                                    hasImage = true;
                                                }
              
                                                for(var i=0; i<4; i++)
                                                {
                                                    if(hasImage)break;
                                                    var img = $( "#sub_photo"+i );
                                                    if(img.html() === "" || img.html().indexOf("/img/img1.png")!==-1)
                                                    {
                                                        result['path'] = result['path'].replace("imgorg", "313_313");
                                                        img.html('<img src="'+result['path']+'" alt="img1">');
                                                        hasImage = true;
                                                    }
                                                }
                                            }
                                                
						status.hide();
						var result = $('<div class="upload_result">'/*<div class="upload_result_title">'+result.origin_name+'</div><div class="upload_result_remove js_result_remove">x</div>*/+'<input type="hidden" name="tmp[]" value="'+result.tmp_name+'"></div>');
						$('.js_result_remove', result).on('click', function(){ result.remove(); });
						root.prepend(result);
					}
					submiting = false;
					bar.hide();
				},
				progressall:function(e, data){
					var pr = parseInt(data.loaded / data.total * 100, 10);
					progress.css('width',pr + '%');
					percent.text(pr+'%');
				},
				fail:function(e, data){
					alert('fail');
					console.dir(data);
				}
			});
			
		});
	};
})(jQuery);

















