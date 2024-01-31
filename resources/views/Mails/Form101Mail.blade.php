<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
	<title>Form 101</title>
</head>
@if($lng == 'heb')
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
		<h1 style="text-align: center;">{{__('mail.form_101.hi')}}, {{$firstname}} {{$lastname }}</h1>
		
		@if($lng == 'heb')
		<p style="text-align: center;line-height: 30px">{{__('mail.form_101.greetings')}} {{__('mail.form_101.from')}}{{__('mail.form_101.company')}}. {{__('mail.form_101.content')}}</p>
		@else
        <p style="text-align: center;line-height: 30px">{{__('mail.form_101.greetings')}} {{__('mail.form_101.from')}} {{__('mail.form_101.company')}}. {{__('mail.form_101.content')}}</p>
		@endif

		<p style="text-align: center;">{{__('mail.form_101.below_txt')}}</p>
		<div style="text-align: center;">
			<a href='{{ url("form101/".base64_encode($id))}}' style="background: #ef6c6b;color: #fff;border: 1px solid #ef6c6b;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;margin-top: 25px;margin-bottom: 25px">{{__('mail.form_101.btn_txt')}}</a> 
		</div>
		<p style="margin-top: 40px">{{__('mail.form_101.reply_txt')}}</p>
		<p style="font-weight: 700;margin-bottom: 0;">{{__('mail.form_101.regards')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px;">{{__('mail.form_101.company')}}</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px">{{__('mail.form_101.tel')}}: 03-525-70-60</p>
		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px"><a href="mailto:office@broomservice.co.il">office@broomservice.co.il</a></p>
	</div>
</body>
</html>