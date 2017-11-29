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
	
}