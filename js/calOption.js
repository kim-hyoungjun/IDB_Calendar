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
//	select: function(start, end, jsEvent, resource) {
//		console.log ("start : " + start.format('mm'));
//		console.log ("end : " + end);
//		console.dir (jsEvent.target.classList);
////        if (jsEvent.target.classList.contains('fc-highlight') || jsEvent.target.classList.contains('fc-bgevent')) {
////            alert('Click Background Event Area');
////        }
////				var title = prompt('Event Title:');
////				var eventData;
////				if (title) {
////					eventData = {
////						title: title,
////						start: start,
////						end: end
////					};
////					$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
////				}
////				$('#calendar').fullCalendar('unselect');
//	},
	dayClick: function(date, jsEvent, view) {
		$('#sd').val(date.format('YYYY-MM-DD'))
		$('#ed').val(date.format('YYYY-MM-DD'))

		// 시간 계산
		var d = new Date();
		var p = 60 - d.getMinutes();
		if (p > 30) p = p - 30;
		d.setMinutes(d.getMinutes() + p);

		var cHour = d.getHours() - 1;
		if (cHour < 10) cHour = "0" + cHour;
		var cMin = d.getMinutes();
		if (cMin == 0) cMin = "0" + cMin;

		var cTime = cHour + ":" + cMin;

		$("#sdt").val(cTime);
		$("#edt").val(cTime);

		addEvent();
	},

	events: [
//		{
//			title: 'All Day Event',
//			start: '2017-11-01',
//		},
//		{
//			title: 'Long Event',
//			start: '2017-11-08',
//			end: '2017-11-10'
//		},
//		{
//			title: 'Meeting',
//			start: '2017-11-13T11:00:00',
//			constraint: 'availableForMeeting', // defined below
//			color: '#257e4a'
//		},
//		{
//			id: 999,
//			title: 'Repeating Event',
//			//constraint: 'availa', // defined below
//			start: '2017-11-09T16:00:00',
//			color: '#357e12'
//		},
//		{
//			id: 999,
//			title: 'Repeating Event',
//			start: '2017-11-16T16:00:00'
//		},
//		{
//			title: 'Conference',
//			start: '2017-11-11',
//			end: '2017-11-13'
//		},
//		{
//			title: 'Meeting',
//			start: '2017-11-12T10:30:00',
//			end: '2017-11-12T12:30:00'
//		},
//		{
//			title: 'Lunch',
//			start: '2017-11-12T12:00:00'
//		},
//		{
//			title: 'Meeting',
//			start: '2017-11-12T14:30:00'
//		},
//		{
//			title: 'Happy Hour',
//			start: '2017-11-12T17:30:00'
//		},
//		{
//			title: 'Dinner',
//			start: '2017-11-12T20:00:00'
//		},
//		{
//			title: 'Birthday Party',
//			start: '2017-11-13T07:00:00'
//		},
//		{
//			title: 'Click for Google',
//			url: 'http://google.com/',
//			start: '2017-11-28'
//		},

		// red areas where no events can be dropped
		{
			title: '추석',
			start: '2017-11-24',
			end: '2017-11-28',
			overlap: false,
			rendering: 'background',
			color: '#ff9f89'
		},
		{
			start: '2017-11-06',
			end: '2017-11-08',
			overlap: false,
			rendering: 'background',
			color: '#ff9f89'
		}
	]
};