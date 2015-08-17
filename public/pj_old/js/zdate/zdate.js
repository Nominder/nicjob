/*!
 * zDate
 * dep: moment.min.js
 */
/*
zDate({
	day: '#day',
	month: '#month',
	year: '#year',
	now:'23_12_2012',
	years:['2012', '2001', '2002', '2003']
});
*/

(function(global, $){

	global.zDate = function(options){
		
		var settings = $.extend({
			year: '#year',
			month: '#month',
			day: '#day',
			years:[],
			now: moment().format('D_M_YYYY')
		}, options);
		
		var day = $(settings.day);
		var month = $(settings.month);
		var year = $(settings.year);

		function setYear(current_year){
			year.empty();
			year.append('<option value="0">Год</option>');
			for(var index in settings.years){
				var item = settings.years[index];
				var option = $('<option value="'+item+'">'+item+'</option>');
				if(item==current_year){
					option.prop('selected', 'selected');
				}
				year.append(option);
			}
			year.trigger('reload');
		}
		
		function setMonth(current_month){
			month.empty();
			month.append('<option value="0">Месяц</option>');
			for(index=1;index<=12;index++){
				var option = $('<option value="'+index+'">'+moment().month(index-1).format('MMMM')+'</option>');
				if(index==current_month){
					option.prop('selected', 'selected');
				}
				month.append(option);
			}
			month.trigger('reload');
		}
		function setDay(current_day, current_month, current_year){
			day.empty();
			day.append('<option value="0">День</option>');
			var days = moment(current_month+'_'+current_year, 'M_YYYY').daysInMonth();
			for(index=1;index<=days;index++){	
				var option = $('<option value="'+index+'">'+index+'</option>');
				if(index==current_day){
					option.prop('selected', 'selected');
				}
				day.append(option);
			}
			day.trigger('reload');
		}

		year.on('change', function(){
			var current_day = day.val();
			var current_month = month.val();
			var current_year = year.val();
			setDay(current_day, current_month, current_year);
		});
		
		month.on('change', function(){
			var current_day = day.val();
			var current_month = month.val();
			var current_year = year.val();
			setDay(current_day, current_month, current_year);
		});
		
		function init(){
			var now = (settings.now==0) ? moment() : moment(settings.now, 'D_M_YYYY');
			var current_day = now.format('D');
			var current_month = now.format('M');
			var current_year = now.format('YYYY');
			setYear(current_year);
			setMonth(current_month);
			setDay(current_day, current_month, current_year);
		}
		
		init();
	}
})(this, jQuery);




























