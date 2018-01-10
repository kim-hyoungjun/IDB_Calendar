var calOption = {
	header: {
		left: 'prev,next today',
		center: 'title',
		right: 'month,agendaWeek,agendaDay,listWeek'
	},

	navLinks: true,					// 주/일을 클릭했을 때 이동
	editable: true,					// 이벤트 변경
	eventLimit: true,				// 이벤트가 많은 경우 +(more) 처리
	businessHours: [ 				// 업무시간 표시
	    {
	        dow: [ 1, 2, 3, 4, 5 ], // 1(월)
	        start: '09:00',					// 8am
	        end: '18:00'					// 6pm
	    },
	    {
	        dow: [ 6 ], 					// 토(6)
	        start: '09:00',					// 8am
	        end: '13:00'					// 12pm
	    }
	],
	weekNumbers: true,						// 주 표시
	weekNumbersWithinDays: true,
	selectable: true,
	timeFormat: 'HH:mm',
	slotLabelFormat: 'HH:mm',
	height: $(window).height()-20,
	minTime:"04:00:00",
	allDayText:'종일',

	// 이벤트 등록
	dayClick: function(date, jsEvent, view) {
		addEvent(date._d);
	},
	
	// 이벤트 선택
	eventClick:
		function(calEvent, jsEvent, view) {
			editEvent(calEvent, jsEvent, view);
		},

	// 이벤트 이동		
	eventDrop: function(calEvent, delta, revertFunc) {
		if (!confirm("Are you sure about this change?")) {
			revertFunc();
		} else {
			console.dir(calEvent);
		}
	},
	
	// 이벤트 일정 조정
	eventResize: function(event, delta, revertFunc) {
		alert(event.title + " end is now " + event.end.format());
		if (!confirm("is this okay?")) {
			revertFunc();
		}
	},
	
	events: function(start, end, timezone, callback) {
		fn_getEvent(start, end, timezone, callback);
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