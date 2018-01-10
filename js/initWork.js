var wMode		= "";
var wEvent	= "";
var isDebug	= true;

Date.prototype.format30 = function(f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;

	if (d.getHours() == "") {
		d.setTime(d.getTime() + (8*60*60*1000));
	}
	if (d.getMinutes() != 0) {
		var p = 60 - d.getMinutes();
		if (p > 30) p = p - 30;
		d.setMinutes(d.getMinutes() + p);
	}

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

function init_UI() {
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
		dateFormat:"yy-mm-dd",
		defaultDate: "+1w",
		showButtonPanel:true,
		onSelect: function(selectedDate) {
			var option = this.id == "sd" ? "minDate" : "maxDate",

			instance = $(this).data("datepicker");
			date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings );
			dates.not(this).datepicker("option", option, date);
		}
	});

	// Dialog Initialize
	dialog = $("#dialog-form" ).dialog({
		autoOpen: false,
		height: 320,
		width: 450,
		modal: true,
		buttons: [
			{
				id : "act_button",
				text :"등록",
				click : do_addEvent
			},
			{
				id : "edt_button",
				text :"수정",
				click : function(){
						$('#addTbl').toggle();
						$('#viewTbl').toggle();
						$('#edt_button').toggle();
						$('#save_button').toggle();
					}
			},
			{
				id : "save_button",
				text :"저장",
				click : do_editEvent
			},
			{
				id : "del_button",
				text :"삭제",
				click : do_eraseEvent
			},
			{
				text :"닫기",
				click : closeDialog
			}
		],
		open: function() {
			if (wMode == "Add") {
				$('#act_button').show();
				$('#save_button').hide();
				$('#edt_button').hide();
				$('#del_button').hide();
				$('#addTbl').show();
				$('#viewTbl').hide();
				$("span.ui-dialog-title").text('새 일정');
			} else {
				$('#act_button').hide();
				$('#save_button').hide();
				$('#addTbl').hide();
				$('#viewTbl').show();
				$("span.ui-dialog-title").text('일정 정보');

				if (fn_calEditable()) {
					$('#edt_button').show();
					$('#del_button').show();
				} else {
					$('#edt_button').hide();
					$('#del_button').hide();
				}
			}
		}
	});

	// option Dialog Initialize
	dialogOption = $("#dialog-option" ).dialog({
		autoOpen: false,
 		position: { my: "right top", at: "right bottom", of :'.fc-optionButton-button' },
		height: 400,
		width: 350,
		modal: true,
    show: {
      effect: "blind",
      duration: 100
    },
    buttons: {
      "저장": do_saveOption,
      "닫기": function() {
        dialogOption.dialog( "close" );
      }
    },
    open: function() {
    	$('#chk1').switchButton({checked: fn_calEditable()});
    	$('#chk2').switchButton({checked: fn_calWeekend()});
    	$('#chk3').switchButton({checked: fn_calSelectable()})
    	$('#chk4').switchButton({checked: fn_calShowAllEvent()})
			$('#chk5').switchButton({checked: fn_calWeekNum()})
    }
	});
	
	// Switch Box
	$("#chk1").switchButton({width:100,height:20,button_width:55,on_label:'수정',off_label:'잠김'});
	$("#chk2").switchButton({width:100,height:20,button_width:55,on_label:'표시',off_label:'숨김'});
	$("#chk3").switchButton({width:100,height:20,button_width:55,on_label:'선택',off_label:'안함'});
	$("#chk4").switchButton({width:100,height:20,button_width:55,on_label:'표시',off_label:'숨김'});
	$("#chk5").switchButton({width:100,height:20,button_width:55,on_label:'표시',off_label:'숨김'});

	// 등록버튼 Disable
	if (! fn_calEditable)	$('.fc-addButton-button').addClass('fc-state-disabled');

	$('#repeat').change(function(){
		// 반복 여부에 따라 주기 SelectBox Enable/Disable 설정
		$('#repeatVal').attr("disabled", $(this).val() == "Y" ? false : true);
	});

	$('#allDay').change(function(){
		$('#ed').attr("disabled", $(this).val() == "N" ? false : true);
		$('#edt').attr("disabled", $(this).val() == "N" ? false : true);
		$('#sdt').attr("disabled", $(this).val() == "N" ? false : true);
	});

	// URL Click event
	$('#tdUrl').click(function(e){
		var url = e.target.innerText;
		if (url) {
			if (url.indexOf("http") < 0) url = "http://" + url;

			window.open(url);
		}
		return false;
	}).hover(
		function() {
			$(this).css('color', 'red').css('cursor', 'pointer');
		},
		function() {
			$(this).css('color', '#212121');
		}
	);
}

function fn_getEventDay() {
	$("#title").val(wEvent.title);
	$("#url").val(wEvent.surl);
	$("#sd").val(wEvent.start.format('YYYY-MM-DD'));
	$("#sdt").val(wEvent.start.format('HH:mm'));

	if(wEvent.allDay) {
		$("#allDay").val("Y");
		$("#sdt").val("08:00").attr("disabled", true);
		$("#edt").val("22:30").attr("disabled", true);
		$("#ed").val($("#sd").val()).attr("disabled", true);

		$("#tdDate").html(wEvent.start.format('YYYY-MM-DD'));
	} else {
		$("#ed").val(wEvent.end.format('YYYY-MM-DD'));
		$("#edt").val(wEvent.end.format('HH:mm'));

		$("#tdDate").html(wEvent.start.format('MM월 DD일 a HH:mm') + " ~ " + wEvent.end.format('MM월 DD일 a HH:mm'));
	}

	$("#tdTitle").html(wEvent.title);
	$("#tdUrl").html(wEvent.surl);
}

// Calendar Editable
function fn_calEditable() {
	return $('#calendar').fullCalendar('option', 'editable');
}

function fn_calSelectable() {
	return $('#calendar').fullCalendar('option', 'selectable');
}

// Show All Event
function fn_calShowAllEvent() {
	return ! $('#calendar').fullCalendar('option', 'eventLimit');
}

// Show Weekend
function fn_calWeekend() {
	var obj = $('#calendar').fullCalendar('option', 'hiddenDays');

	if (typeof obj == "object") {
		if (obj.length == 0)
			return true;
		else
			return false;
	} else {
		return true;
	}

//	return ! (typeof $('#calendar').fullCalendar('option', 'hiddenDays') == "object");
}

// Show WeekNumber
function fn_calWeekNum() {
	return $('#calendar').fullCalendar('option', 'weekNumbers');
}

// Console Print All Events
function fn_listEvent() {
	console.dir($('#calendar').fullCalendar('clientEvents'));
	console.log (IDB.isSupport);
	//console.dir ($('#calendar').fullCalendar('option', 'hiddenDays').length);
}

// Open Add Dialog Box
function fn_addEvent(sdate, edate) {
	if (! fn_calSelectable() && ! fn_calEditable()) return false;

	wMode = "Add";

	$("#sd").val(sdate.split(" ")[0]);
	$("#ed").val(edate.split(" ")[0]);
	$("#sdt").val(sdate.split(" ")[1]);
	$("#edt").val(edate.split(" ")[1]);

	$("#title").val("");
	$("#url").val("");

	dialog.dialog( "open" );
}

// Open Option Dialog Box
function fn_option() {
	dialogOption.dialog( "open" );
}

// Open Edit Dialog Box
function fn_editEvent(calEvent) {
	// 이벤트 수정
	wMode		= "Edit"
	wEvent	= calEvent;

	fn_getEventDay();
	dialog.dialog( "open" );
}

// Close Dialog Box
function closeDialog() {
	dialog.dialog( "close" );
}

function fn_validator(options) {
	var is					= true;
	var urlRegex		= "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
	var emailRegex	= "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

	$(options).each(function() {
		var item = this;
		var objVal = $(item.target).val();

		switch(item.filter) {
			case 'empty' :
				// String 처리
				if (objVal == '' || objVal == null || objVal.length == 0) {
					$(item.target)
						.focus()
						.addClass('ui-state-error ui-corner-all')
						.attr('placeholder', item.title + '을(를) 입력하세요')
						.keyup(function () {
							if($(item.target).val().length > 0) {
								$(item.target)
									.removeClass('ui-state-error ui-corner-all')
									.removeAttr('placeholder');
							}
						});
					is = false;
				}
				break;

			case 'number' :
				// Number 처리
				var objMsg = "";
				if (objVal == '' || objVal == null || objVal.length == 0) {
					objMsg = item.title + '은 숫자를 입력하세요';
					is = false;
				}

				if (is) {
					var num_regx = /^[+-]?[\d,]*(\.?\d*)$/;
					if (! num_regx.test(objVal)) {
						objMsg = '숫자 형식이 잘못 되었습니다.';
						is = false;
					}
				}

				if (!is) {
					$(item.target)
						.val('')
						.focus()
						.addClass('ui-state-error ui-corner-all')
						.attr('placeholder', objMsg)
						.keyup(function () {
							if($(item.target).val().length > 0) {
								$(item.target)
									.removeClass('ui-state-error ui-corner-all')
									.removeAttr('placeholder');
							}
						});
				}
				break;

			case 'select' :
				// SelectBox 처리
				if (objVal == '' || objVal == null || objVal.length == 0) {
					$(item.target)
						.css('background-color', '#FED3D1')
						.change(function () {
							$(this).css('background-color', '#FFFFFF');
						});
					is = false;
				}
				break;

			case 'url' :
				// URL
    		var url = new RegExp(urlRegex, "i");
    		if (! url.test(objVal) && objVal.length > 0) {
					$(item.target)
						.val('')
						.focus()
						.addClass('ui-state-error ui-corner-all')
						.attr('placeholder', item.title + '형식이 잘못 되었습니다.')
						.keyup(function () {
							if($(item.target).val().length > 0) {
								$(item.target)
									.removeClass('ui-state-error ui-corner-all')
									.removeAttr('placeholder');
							}
						});
					is = false;
    		}
				break;
		}
	});

	return is;
}

// get Data from Form and Validation Input Data
function fn_getObject() {
	var rtnObj;

	var sTitle	= $("#title").val();
	var sAllDay	= $("#allDay").val() == "Y" ? true : false;
	var ssd			= $("#sd").val();
	var ssdt		= $("#sdt").val();
	var sed			= $("#ed").val();
	var sedt		= $("#edt").val();
	var surl		= $("#url").val();

	var arrVar = [
		{target : '#title', filter : 'empty', title : '이벤트'},
		{target : '#url', filter : 'url', title : 'URL'}
	];
	if (fn_validator(arrVar)) {
		rtnObj = {
			title: sTitle,
			allDay: sAllDay,
			start: ssd + " " + ssdt,
			surl : surl,
			err : true
		};

		if (! sAllDay) {
			rtnObj.end = sed + " " + sedt;
		}
	} else {
		rtnObj = {
			err : false
		};
	}

	return rtnObj;
}

// Set Data Source Object to Destination Object
function fn_copyObj(obj_des, obj_src, wtype) {
	if (wtype == "object") obj_des.id	= obj_src.id;

	obj_des.title		= obj_src.title;
	obj_des.surl		= obj_src.surl;
	obj_des.allDay	= obj_src.allDay;

	if (wtype == "object") {
		obj_des.start	= obj_src.start.format('YYYY-MM-DD HH:mm');
	} else {
		obj_des.start	= obj_src.start;
	}

	if (obj_src.allDay) {
		obj_des.end = null;
	} else {
		if (wtype == "object") {
			obj_des.end	= obj_src.end.format('YYYY-MM-DD HH:mm');
		} else {
			obj_des.end	= obj_src.end;
		}
	}
}

// Event Erase
function do_eraseEvent() {
	if(confirm('[' + wEvent.title + '] 이벤트를 삭제합니다.')) {
		if (IDB.isSupport) {
			IDB.delete(wEvent.id, function(data){
				if(data == 1){
					$('#calendar').fullCalendar( 'removeEvents' , wEvent.id)					
				}
			});
		} else {
			$('#calendar').fullCalendar( 'removeEvents' , wEvent.id)
		}
		closeDialog();
	}
}

// Event Add
function do_addEvent() {
	var obj = fn_getObject();
	if (obj.err) {
		var eventData = {title:'',allDay:'',start:'',end:'',surl:''};
		fn_copyObj(eventData, obj, "form");

		if (IDB.isSupport) {
			IDB.insert(eventData,function(data){
				if(data == 1){
					$('#calendar').fullCalendar('refetchEvents');
					$('#calendar').fullCalendar('unselect');
				}
			});
		} else {
			$('#calendar').fullCalendar('refetchEvents');
			$('#calendar').fullCalendar('unselect');
		}
		closeDialog();
	}
}

// Event Edit
function do_editEvent() {
	var obj = fn_getObject();
	if (obj.err) {
		fn_copyObj(wEvent, obj, "form");

		if (IDB.isSupport) {
			IDB.update(wEvent,function(data){
				if(data == 1){
					$('#calendar').fullCalendar('updateEvent', wEvent);
					$('#calendar').fullCalendar('unselect');
				}
			});
		} else {
			$('#calendar').fullCalendar('updateEvent', wEvent);
			$('#calendar').fullCalendar('unselect');
		}
		closeDialog();
	}
}

// Event Move
function do_moveEvent(calEvent, delta, revertFunc) {
	var wEvent = {title:'',allDay:'',start:'',end:'', id:'',surl:''};
	fn_copyObj(wEvent, calEvent, "object");

	if (IDB.isSupport) {
		IDB.update(wEvent,function(data){
			if(data == 1){}
		});
	}
}

// Save Option
function do_saveOption() {

	if ($("#chk2").is(":checked")) {
		$('#calendar').fullCalendar('option', {hiddenDays: []});
	} else {
		$('#calendar').fullCalendar('option', {hiddenDays: [0, 6]});
	}

	$('#calendar').fullCalendar('option', 'editable', $("#chk1").is(":checked"));
	$('#calendar').fullCalendar('option', 'selectable', $("#chk3").is(":checked"));
	$('#calendar').fullCalendar('option', 'eventLimit', ! $("#chk4").is(":checked"));
	$('#calendar').fullCalendar('option', 'weekNumbers', $("#chk5").is(":checked"));

	dialogOption.dialog( "close" );
}

// Get Events
function do_getEvent(start, end, timezone, callback) {
	if (IDB.isSupport) {
		// IDB.selectAll(function(data){	
		IDB.selectRange(start, end, function(data){			
			callback(data);
		});
	}
}

// Prework Draw Events to Calendar
function fn_eventRender(calEvent, element) {
			calEvent.editable = true;
	if (calEvent.allDay) {
		element.addClass('black-background');
	}

	element.contextmenu(false);

	// 마우스 오른쪽 버튼 클릭시 이벤트 삭제
	/*
	element.bind('mousedown', function (e) {
		if (e.which == 3) {
			$('#calendar').fullCalendar('removeEvents',calEvent.id);
		}
	});
	*/
}