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
    </head>
    <body>
        Test Invoice Mail ! CONTENT SOON
        <div style="text:center;margin:3%;display:flex;">
        <a href="{{ $data['docurl'] }}" target="_blank" style="margin:3%;background: #004b80;color: #fff;border: 1px solid #4385f5;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;min-width:135px;text-align: center"> View invoice</a><br>
        <a href="{{ url('/generate-payment/'.base64_encode($data['inv_id'])) }}" target="_blank" style="margin:3%;background: green;color: #fff;border: 1px solid green;font-size: 16px;padding: 10px 24px;border-radius: 4px;cursor: pointer;text-decoration: none;min-width:135px;text-align: center">Pay Invoice</a>
        </div>
    </body>
</html>