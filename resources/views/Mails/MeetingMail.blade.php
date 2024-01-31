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
		<h1 style="text-align: center;">{{__('mail.meeting.hi')}}, {{$client['firstname']}} {{$client['lastname']}}</h1>
       
		@if($client['lng'] == 'heb')
		<p style="text-align: center;">{{__('mail.meeting.greetings')}} {{__('mail.meeting.from')}}{{__('mail.meeting.company')}}. {{__('mail.meeting.appointment')}}
		@else 
		<p style="text-align: center;">{{__('mail.meeting.greetings')}} {{__('mail.meeting.from')}} {{__('mail.meeting.company')}}. {{__('mail.meeting.appointment')}}
		@endif

		@if(!empty($team['name'])) 
		{{__('mail.meeting.with')}}      <span style="color:#0130c6;font-weight:700;">{{ $client['lng'] == 'heb' ? $team['heb_name'] : $team['name']}}</span>
		 @endif

		 {{__('mail.meeting.on')}}       <span style="color:#0130c6;font-weight:700;">{{ \Carbon\Carbon::parse($start_date)->format('d-m-Y')}}</span>
		 {{__('mail.meeting.between')}}  <span style="color:#0130c6;font-weight:700;">{{date("H:i", strtotime($start_time))}}</span>
		 {{__('mail.meeting.to')}}       <span style="color:#0130c6;font-weight:700;">{{date("H:i", strtotime($end_time))}}</span>
		 <!--<span style="color:#0130c6;font-weight:700;">{{$service_names}}&nbsp;</span>{{__('mail.meeting.service')}}</p>-->
		
		 @if($purpose != '') 
         {{__('mail.meeting.for')}}  

		 @if($purpose == 'Price offer')   
		 <span style="color:#0130c6;font-weight:700;">{{ __('mail.meeting.price_offer') }}&nbsp;</span></p>
		 @elseif($purpose == "Quality check")
		 <span style="color:#0130c6;font-weight:700;">{{ __('mail.meeting.quality_check') }}&nbsp;</span></p>
		 @else
		 <span style="color:#0130c6;font-weight:700;">{{ $purpose }}&nbsp;</span></p>
		 @endif

		 @endif


		@if(!empty($meet_link))
		<p style="text-align: center;">{{$meet_link}}</p>
		@endif

		<div style="display:flex;justify-content: center">
			<a href='{{ url("thankyou/".base64_encode($id)."/accept")}}' target='_blank' style="background: green;color: #fff;border: 1px solid green;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;min-width:135px;text-align: center">{{__('mail.meeting.accept')}}</a>
			<a href='{{ url("thankyou/".base64_encode($id)."/reject")}}' style="background: red;color: #fff;border: 1px solid red;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;min-width:135px;margin: 0 15px;text-align: center">{{__('mail.meeting.reject')}}</a>
			<a href='{{ url("meeting-status/".base64_encode($id)."/re")}}' target='_blank' style="background: #4385f5;color: #fff;border: 1px solid #4385f5;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;text-align: center">{{__('mail.meeting.reschedule')}}</a>
		</div>
		<p style="margin-top: 20px">{{__('mail.meeting.below_line')}}</p>
		<p style="font-weight: 700;margin-bottom: 0;">{{__('mail.meeting.best_regards')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px;">{{__('mail.meeting.company')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px">{{__('mail.meeting.tel')}}: 03-525-70-60</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px"><a href="mailto:office@broomservice.co.il">office@broomservice.co.il</a></p>
	</div>
</body>
</html>