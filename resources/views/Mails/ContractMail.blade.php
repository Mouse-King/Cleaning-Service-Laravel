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
	<title>Work Contract</title>
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
		<h1 style="text-align: center;">{{__('mail.contract.hi')}}, {{$client['firstname']}} {{$client['lastname']}}</h1>
		
		@if($client['lng'] == 'heb')
		<p style="text-align: center;line-height: 30px">{{__('mail.contract.greetings')}} {{__('mail.contract.from')}}{{__('mail.contract.company')}}. {{__('mail.contract.content')}}</p>
		@else
        <p style="text-align: center;line-height: 30px">{{__('mail.contract.greetings')}} {{__('mail.contract.from')}} {{__('mail.contract.company')}}. {{__('mail.contract.content')}}</p>
		@endif

		<p style="text-align: center;">{{__('mail.contract.below_txt')}}</p>
		<div style="text-align: center;">
			<a href='{{ url("work-contract/".$contract_id)}}' style="background: #ef6c6b;color: #fff;border: 1px solid #ef6c6b;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;margin-top: 25px;margin-bottom: 25px">{{__('mail.contract.btn_txt')}}</a> 
		</div>
		<p style="margin-top: 40px">{{__('mail.contract.reply_txt')}}</p>
		<p style="font-weight: 700;margin-bottom: 0;">{{__('mail.contract.regards')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px;">{{__('mail.contract.company')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px">{{__('mail.contract.tel')}}: 03-525-70-60</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px"><a href="mailto:office@broomservice.co.il">office@broomservice.co.il</a></p>
	</div>
</body>
</html>