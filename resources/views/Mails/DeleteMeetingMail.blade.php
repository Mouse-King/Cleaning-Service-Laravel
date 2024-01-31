<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;500;600;700&display=swap" rel="stylesheet">
	<title>Schedule meeting</title>
</head>

@if($client['lng'] == 'heb')
<body style="font-family: 'Noto Sans Hebrew', sans-serif;color: #212529;background: #fcfcfc; direction:rtl">
@else 
<body style="font-family: 'Open Sans', sans-serif;color: #212529;background: #fcfcfc;">
@endif


	<div style="max-width: 650px;margin: 0 auto;margin-top: 30px;margin-bottom: 20px;background: #fff;border: 1px solid #e6e8eb;border-radius: 6px;padding: 20px;">
		<table cellpadding="0" cellspacing="0" width="100%" >
			<tr>
				<td width="100%">
					<img src="http://broom-service.n2rtech.com/images/sample.png" style="margin: 0 auto;display: block">
				</td>
			</tr>
		</table>
		<h1 style="text-align: center;">{{__('mail.cancel_meeting.hi')}}, {{$client['firstname']}} {{$client['lastname']}}</h1>
        
		@if($client['lng'] == 'heb')
		<p style="text-align: center;">{{__('mail.cancel_meeting.greetings')}} {{__('mail.cancel_meeting.from')}}{{__('mail.cancel_meeting.company')}}. {{__('mail.cancel_meeting.appointment')}}
		@else
		<p style="text-align: center;">{{__('mail.cancel_meeting.greetings')}} {{__('mail.cancel_meeting.from')}} {{__('mail.cancel_meeting.company')}}. {{__('mail.cancel_meeting.appointment')}}
		@endif

		@if(!empty($team['name'])) 
		{{__('mail.cancel_meeting.with')}}      <span style="color:#0130c6;font-weight:700;">{{$team['name']}}</span>
		 @endif
		 {{__('mail.cancel_meeting.on')}}       <span style="color:#0130c6;font-weight:700;">{{ \Carbon\Carbon::parse($start_date)->format('d-m-Y')}}</span>
		 {{__('mail.cancel_meeting.between')}}  <span style="color:#0130c6;font-weight:700;">{{date("H:i", strtotime($start_time))}}</span>
		 {{__('mail.cancel_meeting.to')}}       <span style="color:#0130c6;font-weight:700;">{{date("H:i", strtotime($end_time))}}</span>
		
         <b>{{__('mail.cancel_meeting.cancel_text')}}</b>
	
		<p style="margin-top: 20px">{{__('mail.cancel_meeting.below_line')}}</p>
		<p style="font-weight: 700;margin-bottom: 0;">{{__('mail.cancel_meeting.best_regards')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px;">{{__('mail.cancel_meeting.company')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px">{{__('mail.cancel_meeting.tel')}}: 03-525-70-60</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px"><a href="mailto:office@broomservice.co.il">office@broomservice.co.il</a></p>
	</div>
</body>
</html>