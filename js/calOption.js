var calOption = {
	navLinks: true,									// 주/일을 클릭했을 때 이동
	editable: false,								// 이벤트 변경
	selectable: false,							// 여러날짜 선택
	eventLimit: true,								// 이벤트가 많은 경우 +(more) 처리
	weekNumbers: true,							// 주 표시
	weekNumbersWithinDays: true,
	timeFormat: 'HH:mm',
	slotLabelFormat: 'HH:mm',
	height: $(window).height()-20,
	minTime:"04:00:00",
	allDayText:'종일',
		
	customButtons: {
		addButton: {
			text: '등록',
			click: function() {				
				var _start	= new Date();
				var _end		= new Date();
						_end.setTime(_start.getTime() + (1*60*60*1000));

				fn_addEvent(_start.format30('yyyy-MM-dd HH:mm'), _end.format30('yyyy-MM-dd HH:mm'));
			}
		},
		ListButton: {
			text: '목록',
			click: function() {
				fn_listEvent();
			}
		},
		optionButton: {
			text: '옵션',
			click: function() {
				fn_option();
			}
		}
	},
	header: {
		left: 'prev,next,today addButton,ListButton',
		center: 'title',
		right: 'month,agendaWeek,agendaDay optionButton'
	},
	businessHours: [ 								// 업무시간 표시
	    {
	        dow: [ 1, 2, 3, 4, 5 ], // 1(월)
	        start: '09:00',					// 8am
	        end: '18:00'						// 6pm
	    },
	    {
	        dow: [ 6 ], 						// 토(6)
	        start: '09:00',					// 8am
	        end: '13:00'						// 12pm
	    }
	],
	
	// Event Add
	dayClick: function(date, jsEvent, view) {
		if (fn_calSelectable() || ! fn_calEditable()) return false;

		var _start	= new Date(date);		
		var _end		= new Date(date);
				_end.setTime(_start.getTime() + (1*60*60*1000));
		
		fn_addEvent(_start.format30('yyyy-MM-dd HH:mm'), _end.format30('yyyy-MM-dd HH:mm'));
	},

	// Select
	select: function(start, end, jsEvent, view) {
		if (! fn_calSelectable()) return false;
		
		var sDay, eDay;

		if ($('#calendar').fullCalendar( 'getView' ).type == "month") {
			var _start	= new Date(start);
			var _end		= new Date(end);
					_end.setTime(_end.getTime() - (15*60*60*1000));

			sDay = _start.format30('yyyy-MM-dd HH:mm');
			if (_start.format30('yyyy-MM-dd') == _end.format30('yyyy-MM-dd')) {
				_end.setTime(_start.getTime() + (1*60*60*1000));
				eDay = _end.format30('yyyy-MM-dd HH:mm');
			} else {
				eDay = _end.format30('yyyy-MM-dd HH:mm');
			}

		} else {
			sDay = start.format('YYYY-MM-DD HH:mm');
			eDay = end.format('YYYY-MM-DD HH:mm');
		}
		
		fn_addEvent(sDay, eDay);
	},

	// Event Click
	eventClick:
		function(calEvent, jsEvent, view) {
			fn_editEvent(calEvent, jsEvent, view);
		},

	// Event Move
	eventDrop: function(calEvent, delta, revertFunc) {
		do_moveEvent(calEvent, delta, revertFunc);
	},

	// Event ReSize
	eventResize: function(calEvent, delta, revertFunc) {
		do_moveEvent(calEvent, delta, revertFunc);
	},

	// Event Get
	events: function(start, end, timezone, callback) {
		do_getEvent(start, end, timezone, callback);
	},

	// Event Draw
	eventRender : function(calEvent, element) {
		fn_eventRender(calEvent, element);
	}

//	events: [

		// red areas where no events can be dropped
//		{
//			title: '추석',
//			start: '2017-11-24',
//			end: '2017-11-28',
//			overlap: false,
//			rendering: 'background',
//			color: '#ff9f89'
//		},
//		{
//			start: '2017-11-06',
//			end: '2017-11-08',
//			overlap: false,
//			rendering: 'background',
//			color: '#ff9f89'
//		}
//	]
};