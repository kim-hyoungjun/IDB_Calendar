Date.prototype.format30 = function(f) {
	if (!this.valueOf()) return " ";
 
	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;
//	var d = new Date();
	var p = 60 - d.getMinutes();
	if (p > 30) p = p - 30;
	d.setMinutes(d.getMinutes() + p);
     
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.add = function(val) {
	var tmpVal = parseInt(this, 10);
	if (tmpVal < 23) tmpVal ++;
		
	return tmpVal.toString().zf(2);
}
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

function init_variable() {
	var mm1	= "00";
	var mm2	= "30";

	// 시간범위 체크
	for (var i = 8; i < 23; i++) {
		var hh	= (i >= 10) ? i : "0" + i;

		$("#sdt").append("<option value=\"" + hh + ":" + mm1 + "\">" + hh + ":" + mm1 + "</option>");
		$("#sdt").append("<option value=\"" + hh + ":" + mm2 + "\">" + hh + ":" + mm2 + "</option>");
		$("#edt").append("<option value=\"" + hh + ":" + mm1 + "\">" + hh + ":" + mm1 + "</option>");
		$("#edt").append("<option value=\"" + hh + ":" + mm2 + "\">" + hh + ":" + mm2 + "</option>");
	}
	
	$("#allDay").append("<option value='N'>아니요</option>");
	$("#allDay").append("<option value='Y'>예</option>");
	$("#repeat").append("<option value='N'>아니요</option>");
	$("#repeat").append("<option value='Y'>예</option>");

	$("#repeatVal").append("<option value='1'>매일</option>");
	$("#repeatVal").append("<option value='2'>매주</option>");
	$("#repeatVal").append("<option value='3'>매월</option>");
	$("#repeatVal").append("<option value='4'>매년</option>");


	var dates = $("#sd, #ed").datepicker({
		showAnim: "slideDown",
		defaultDate: "+1w",
		showButtonPanel:true,
		dateFormat:"yy-mm-dd",
		onSelect: function(selectedDate) {
			var option = this.id == "sd" ? "minDate" : "maxDate",
				instance = $(this).data("datepicker");
				date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings );
				dates.not(this).datepicker("option", option, date);
		}
	});	
}

function fn_getToDay() {
	var _date		= new Date().format30("yyyy-MM-dd");
	var _time1	= new Date().format30("HH:mm");
	var _cTime	= new Date().format30("HH");
	var _time2	= new Date().format30("HH").add(1) + _time1.substring(2,5);
	
	$("#sd").val(_date);
	$("#ed").val(_date);
	$("#sdt").val(_time1);
	$("#edt").val(_time2);
}