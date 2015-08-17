$(function(){
	
	// селектбоксы
	$('.js_zselect').zselect();
	
	// аплоадер
	$('.js_upload').ajaxUpload();

	// попап login registration
	$('#login, #registration').on('click', function(ev){
		ev.preventDefault();

		var popup = zPopup( $('#tpl_login').html(), {
			modal: false,
			close: false,
			modifier: 'zpopup__login'
		});
		
		var jlogin_link = $('.jlogin_link', popup);
		var jlogin_tab = $('.jlogin_tab', popup);

		var role = $(this).data('role');

		if(role=='login'){
			jlogin_link.eq(0).addClass('__nav_select');
			jlogin_tab.eq(0).addClass('__tab_show');
			jlogin_link.eq(1).hide();
			jlogin_tab.eq(1).hide();
		}
		if(role=='registration'){
			jlogin_link.eq(1).addClass('__nav_select');
			jlogin_tab.eq(1).addClass('__tab_show');
		}
		
		jlogin_link.each(function(indx){
			var link = $(this);
			if(link.hasClass('__nav_select')){
				jlogin_tab.eq(indx).show();
			}
			link.on('click', function(ev){
				ev.preventDefault();
				jlogin_link.removeClass('__nav_select');
				link.addClass('__nav_select');
				jlogin_tab.hide().eq(indx).show();
			});
		});
		
		var form_registration = $('.js_form_registration', popup);
		
		$('.js_registration', popup).on({
			'click':function(ev){
				ev.preventDefault();
				$('.js_err', form_registration).hide();
				
				$.ajax({
					dataType:'json',
					url:form_registration.attr('action'),
					type:'POST',
					data:form_registration.serialize(),
					success:function(response){
						console.dir(response);
						if(!response.success){
							for(var key in response.error){
								console.log('.js_'+key+'_err = ' + response.error[key]);
								$('.js_'+key+'_err', form_registration).text(response.error[key]).show();
							}
						}else{
							if(response.locate=='reload'){
								location.reload(); 
							}else{
								location.href = response.locate; 
							}
						}
					},
					error:function(){
						console.log('error');
					}
				});
			}
		});

		var form_login = $('.js_form_login', popup);
		
		$('.js_login', popup).on({
			'click':function(ev){
				ev.preventDefault();
				$('.js_err', form_login).hide();
				
				$.ajax({
					dataType:'json',
					url:form_login.attr('action'),
					type:'POST',
					data:form_login.serialize(),
					success:function(response){
						console.dir(response);
						if(!response.success){
							for(var key in response.error){
								console.log('.js_'+key+'_err = ' + response.error[key]);
								$('.js_'+key+'_err', form_login).text(response.error[key]).show();
							}
						}else{
							if(response.locate=='reload'){
								location.reload(); 
							}else{
								location.href = response.locate; 
							}
						}
					},
					error:function(){
						console.log('error');
					}
				});
			}
		});
	});

	// subnav
	var js_sublink = $('.js_sublink');
	var js_subtab = $('.js_subtab');
	
	js_sublink.each(function(indx){
		var link = $(this);
		if(link.hasClass('__selected')){
			js_subtab.removeClass('__selected');
			js_subtab.eq(indx).addClass('__selected');
		}
		link.on('click', function(ev){
			ev.preventDefault();
			js_sublink.removeClass('__selected');
			link.addClass('__selected');
			js_subtab.removeClass('__selected');
			js_subtab.eq(indx).addClass('__selected');
		});
	});
	// subnav end
	
	// footer
	var footer_wrap = $('.js_footer_wrap');
	var footer_visibility;
	footer_wrap.on({
		'mouseover':function(ev){
			footer_wrap.addClass('__visibility');
			clearTimeout(footer_visibility);
		},
		'mouseout':function(ev){
			footer_visibility = setTimeout(function(){
				footer_wrap.removeClass('__visibility');
			}, 500);
		}
	});
	// footer end

	// fieldset in resume
	$('.js_fieldsetlink').each(function(indx){
		var link = $(this);
		var fieldset = $(link.attr('href'));
		fieldset.toggleClass('__selected', link.hasClass('__selected'));
		link.on('click', function(ev){
			ev.preventDefault();
			link.toggleClass('__selected');
			fieldset.toggleClass('__selected');
		});
	});
	// fieldset in resume end
	
//	zPopup('<div>text</div>');
//	zPopup('<div>text</div>', {modal:true,close:true});
//	var popup = zPopup('<div>text</div>', {modal:true,close:true});
// popup.trigger('close'); // close method

	// клонирование полей в резюме
	$('.js_rowadd').each(function(indx){
		
		var link = $(this);
		var btn = $('.js_rowadd_link', link);
		var rowadd = $(btn.attr('href'));
		
		// label
		var label = $('.js_label', rowadd);
		var text = label.html();
		var counter = 1;
		// label end
	
		btn.on('click', function(ev){
			ev.preventDefault();

			var clone = rowadd.clone(false).removeAttr('id');
			link.before(clone);
			$('.js_zselect').zselect();
			$('.type_text', clone).val('');
			counter++;
			$('.js_label', clone).html(text+counter);
		});
	});
	// клонирование полей в резюме end
	
	// левая колонка фильтров
	$('#js_page_sidebar').each(function(indx){
		var body = $('.body');
		var sidebar = $(this);
		sidebar.height(body.height()-45);
		$(window).resize(function(){
			sidebar.height(body.height()-45);
		});
	});
	$('#js_filter').perfectScrollbar({suppressScrollX: true});
	// левая колонка фильтров end
	
	// скроллинг внутри
	$('.js_filterfow').each(function(indx){
		var row = $(this);
		row.on('click', function(ev){
			ev.preventDefault();
			row.toggleClass('__selected');
			row.find('.js_scrollbar').perfectScrollbar({suppressScrollX: true});
		});
	});

	$('.js_rangeslider').each(function(indx){
		var rangeslider = $(this);
		var min = rangeslider.data('min');
		var max = rangeslider.data('max');
		var start = rangeslider.data('start');
		var inputstart = $(rangeslider.data('inputstart'));
		var end = rangeslider.data('end');
		var inputend = $(rangeslider.data('inputend'));

		rangeslider.noUiSlider({
			start: [
				start, end
			],
			connect: true,
			range: { 'min': min, 'max': max },
			serialization: {
				lower: [
					$.Link({ target: inputstart,method: 'text' }),
				],
				upper: [
					$.Link({ target: inputend, method: 'text' })
				],
				format: { decimals:0 }
			}
		});
	});
	// левая колонка фильтров утв
	
	// js_ajaxform у любой формы с таким класом будет аякс отправка js_submit кпока сабмита 
	$('.js_ajaxform').each(function(indx){
		var form = $(this);
		var body = $('.body');
		var loader = $('<div class="loader"></div>');
		var submit = $('.js_submit', form);
		submit.on('click', function(ev){
			ev.preventDefault();
			body.append(loader);
			$.ajax({
				dataType:'json',
				url:form.attr('action'),
				type:'POST',
				data:form.serialize(),
				success:function(response){
					console.dir(response);
					loader.remove();
				},
				error:function(){
					console.log('error');
					loader.remove();
				}
			});
		});	
	});
	// js_ajaxform end
	
	// даты 
	$('.js_zdate').each(function(){
		var row = $(this);
		var now = $(this).data('now');
                var years = new Array(); 
                for (var i = 1960; i < 2015; i++) {
                    years[i] = i+'';
                }
		zDate({
			day: $('.js_day', row),
			month: $('.js_month', row),
			year: $('.js_year', row),
			now: now,
			years:years//['2012', '2001', '2002', '2003', '2014', ]
		});
	});
	// даты end
	
	// suggestive такой класс ставим у инпута, снизу появляется саджестив список
	$('.js_suggestive').zComplete({
		dataUrl: 'data.json',
		onSelect: function (item){ // событие при выборе элемента
			$(this).val(item.value);
			alert('Selected: ' + item.value + ', ' + item.data);
		}
	});
        
        $('body').on('click', function(){$('.js_suggestive_institution').zComplete({
		dataUrl: "getinstitutions",
		onSelect: function (item){
			$(this).val(item.value);
                        $(this).nextAll('input:hidden').first().val(item.data);
                        var specialization = $(this).parent().parent().parent().next().find('.js-institution-parent select');
                        specialization.empty();
                        specialization.append('<option value="">Выберите Вашу специальность</option>');
                        $.post('/applicant/resume/getspecs',{id: item.data}, function(data){
                            for (var i = 0; i <= data.length - 1; i++) {
                                specialization.append('<option value="'+ data[i]['data'] +'">'+ data[i]['value'] +'</option>');
                            }
                        }, 'json');
                }
	})});
        
        $('body').on('click', function(){$('.js_suggestive_skills').zComplete({
		dataUrl: "getskills",
		onSelect: function (item){
			$(this).val(item.value);
		}
	})});
	// suggestive end
        
        //это нужно будет вынести отсюда
        
        $(document).on('change', '.js-get-position', function(){
            var id = $(this).val();
            var profarea = $(this).parent().parent().parent().next().find('.js-profarea-parent select');
            profarea.empty();
            //$('.js-profarea-parent select').empty();
            //$('.js-profarea-parent select').append('<option value="">Выберите должность</option>');
            profarea.append('<option value="">Выберите должность</option>');
            $.post('/applicant/resume/getpositions',{id: id}, function(data){
                for (var i = 0; i <= data.length - 1; i++) {
                    //$('.js-profarea-parent select').append('<option value="'+ data[i]['data'] +'">'+ data[i]['value'] +'</option>');
                    profarea.append('<option value="'+ data[i]['data'] +'">'+ data[i]['value'] +'</option>');
                }
            }, 'json');
        });
	
});









































