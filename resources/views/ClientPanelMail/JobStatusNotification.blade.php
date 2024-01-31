<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
	<title>Job Status</title>
</head>
<body style="font-family: 'Open Sans', sans-serif;color: #212529;background: #fcfcfc;">
	<div style="max-width: 650px;margin: 0 auto;margin-top: 30px;margin-bottom: 20px;background: #fff;border: 1px solid #e6e8eb;border-radius: 6px;padding: 20px;">
		<table cellpadding="0" cellspacing="0" width="100%" >
			<tr>
				<td width="100%">
					<img src='{{url("/images/sample.png")}}' style="margin: 0 auto;display: block">
				</td>
			</tr>
		</table>
		<h1 style="text-align: center;">{{__('mail.client_job_status.hi')}}, {{($by == 'client') ? $admin['name'] : $job['client']['firstname']." ".$job['client']['lastname'] }} </h1>
		
		@if($by == 'client')
		<p style="text-align: center;line-height: 30px"> {{__('mail.client_job_status.content')}} {{ ucfirst($job['status']) }}. 
		@if(  $job['rate'] != '' ) 
		{{__('mail.client_job_status.cancellation_fee')}} {{  $job['rate'] }} ILS.
		@endif

		@else
		<p style="text-align: center;line-height: 30px"> Job is marked as  {{ ucfirst($job['status']) }} by admin/team. 

		@endif
	   </p>
		
         <table cellpadding="0" cellspacing="0" width="100%">
			 <thead>
				<tr>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Date</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Worker</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Client</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Service</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Shift</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Status</th>
					<th width="" style="text-align:left;border: 1px solid #dee2e6;font-size: 14px;padding: 8px">Action</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ \Carbon\Carbon::parse($job['start_date'])->format('M d Y') }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ $job['worker']['firstname'] }} {{ $job['worker']['lastname'] }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ $job['client']['firstname'] }} {{ $job['client']['lastname'] }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ $job['jobservice'][0]['name'] }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ $job['start_time'] }} to {{ $job['end_time'] }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px">{{ ucfirst($job['status']) }}</td>
					<td style="border: 1px solid #dee2e6;font-size: 14px;padding: 8px;display:flex;height: 38px">
						<a href='{{ url("client/login") }}' style="font-size: 13px;color: #007bff;min-width: 51px">View Job</a>
					</td>
				</tr>
			</tbody>
			</table>      

		<p style="margin-top: 3px;font-size: 14px;margin-bottom: 3px;">{{__('mail.client_job_status.thanks_text')}}</p>
		</p>
	</div>
</body>
</html>