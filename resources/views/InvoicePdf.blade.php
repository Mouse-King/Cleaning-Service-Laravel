<!DOCTYPE html>
@php
      $client = $invoice->client;
      $services = json_decode($invoice->services);
      \App::setLocale($client->lng);
@endphp
<html lang="en" >
   <head>
      <meta charset="UTF-8">
      <title>Invoice- 000{{ $invoice->id }}</title>
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/css/bootstrap.min.css'>
      <link rel="stylesheet" href="./style.css">
      <style>
         body {
         font-family:firefly, DejaVu Sans, Times;
         }
      </style>
   </head>
   <body @if($client->lng == '')  style='direction:rtl' @endif>
     
      <!-- partial:index.partial.html -->
      <div class="container">
         <div class="row">
         
            <div class="span4">
               <img src="./images/sample.png" class="img-rounded logo" style="width:70%">
               <address>
                  <strong>Brom Service L.M. Ltd.</strong><br>
                  H.P. 515184208<br>
                  <strong>{{__('invoice.pdf.phone')}}: </strong>+91-124-111111<br>
                  <strong>{{__('invoice.pdf.email')}}: </strong> <a href="office@broomservice.co.il">office@broomservice.co.il</a><br>
                 
                  <strong>
                     @if($invoice->status == 'paid') 
                      <span class='form-control btn btn-success' style="line-height:18px;margin-top:15px;width:200px">{{ __('invoice.pdf.paid') }}</span>
                     @elseif( $invoice->status == 'partially paid' )
                     <span class='form-control btn btn-warning' style="line-height:18px;margin-top:15px;width:200px">{{ __('invoice.pdf.partial') }}</span>
                     @else
                     <span class='form-control btn btn-danger' style="line-height:18px;margin-top:15px;width:200px">{{ __('invoice.pdf.pending') }}</span>
                     @endif 
                  </strong>
                  
                  @if($invoice->status != 'paid') 
                  <strong>
                     <a href="{{ url('/generate-payment').'/'.base64_encode($invoice->id) }}" target="_blank" class='form-control btn btn-primary' style="line-height:18px;margin-top:15px;width:200px;cursor:pointer;">{{ __('invoice.pdf.paynow') }}</a>
                  </strong>
                  @endif

               </address>
            </div>
            <div class="span4 well">
               <table class="invoice-head">
                  <tbody>
                     <tr>
                        <td class="pull-right"><strong>{{ __('invoice.pdf.customer') }} : </strong></td>
                        <td>{{ $client->firstname ." ".$client->lastname}}</td>
                     </tr>
                     <tr>
                        <td class="pull-right"><strong>{{ __('invoice.pdf.address') }}: </strong></td>
                        <td>{{ $client->geo_address }}</td>
                     </tr>
                     <tr>
                        <td class="pull-right"><strong>{{ __('invoice.pdf.email') }}: </strong></td>
                        <td>{{ $client->email }}</td>
                     </tr>
                     <tr>
                        <td class="pull-right"><strong>{{ __('invoice.pdf.contact') }}: </strong></td>
                        <td>{{ $client->phone }}</td>
                     </tr>
                     <tr>
                        <td class="pull-right"><strong>{{ __('invoice.pdf.bill_date') }}</strong></td>
                        <td>{{ Carbon\Carbon::parse($invoice->created_at)->format('d, M Y h:i:s') }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
         <div class="row">
            <div class="span8">
               <h4>{{ __('invoice.pdf.invoice') }} #000{{ $invoice->id }}</h4>
               @if($invoice->due_date != null) 
               <h6 class="text-right">{{ __('invoice.pdf.due_date') }} : {{  Carbon\Carbon::parse($invoice->due_date)->format('d, M Y h:i:s') }}</h6>
               @endif
            </div>
         </div>
         <div class="row">
            <div class="span8 well invoice-body">
               <table class="table table-bordered" >
                  <thead>
                     <tr>
                        <th>{{ __('invoice.pdf.service') }}</th>
                        @if( $services[0]->description != null)
                        <th>{{ __('invoice.pdf.description') }}</th>
                        @endif
                        <th @if($services[0]->description == null) colspan="2" @endif>{{ __('invoice.pdf.hours') }}</th>
                        <th>{{ __('invoice.pdf.amount') }}</th>
                     </tr>
                  </thead>
                  <tbody>
                     @foreach($services as $s)
                     <tr>
                        <td>{{ $s->service }}</td>
                        @if( $services[0]->description != null)
                        <td>{{ $s->description }}</td>
                        @endif
                        <td @if( $services[0]->description == null) colspan="2" @endif>{{ $s->job_hour }}</td>
                        <td>{{ $s->price }} ILS</td>
                     </tr>
                     @endforeach
                     <tr>
                        <td colspan="4"></td>
                     </tr>
                     <tr>
                        <td colspan="2">&nbsp;</td>
                        <td><strong>{{ __('invoice.pdf.subtotal') }}</strong></td>
                        <td><strong>{{ $invoice->subtotal}} ILS</strong></td>
                     </tr>
                     <tr>
                        <td colspan="2">&nbsp;</td>
                        <td><strong>{{ __('invoice.pdf.tax') }}</strong></td>
                        <td><strong>{{ $invoice->taxper}} %</strong></td>
                     </tr>
                     <tr>
                        <td colspan="2">&nbsp;</td>
                        <td><strong>{{ __('invoice.pdf.total') }}</strong></td>
                        <td><strong>{{ $invoice->amount }} ILS</strong></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
         <!-- <div class="row">
            <div class="span8 well invoice-thank">
               <h5 style="text-align:center;">Thank You!</h5>
            </div>
            </div>-->
         <div class="row">
            <p><b>{{ __('invoice.pdf.offline_payment') }}:</b></p>
            <p>Bank</p>
            <p>A/C Detail:</p>
            <p>Name- N2R TECHNOLOGIES LLP</p>
            <p>A/C-50200019322608</p>
            <p>Bank : Hdfc Bank Ltd</p>
            <p>State : Delhi</p>
            <p>Branch :Priyadarshini Vihar</p>
            <p>IFSC Code :HDFC0002076</p>
            <p>SWIFT Code / BIC: HDFCINBBDEL</p>
            <p>City :New Delhi</p>
            <p>Country: India</p>
            <br>
            <br>
            <p><b>Note:</b></p>
            <p>GSTIN Invoices will be separately emailed after final payment. This is the Pro Forma Invoice not used for Tax Deduction.</p>
            <p>Please request on account@n2rtechnologies.com for GST invoices.</p>
            <br>
            <p><b>Terms & Conditions:</b></p>
            <p>1. Payment to be made in favour of N2R TECHNOLOGIES LLP payable at Delhi/New Delhi</p>
            <p>2. All payments will be Non Refundable unless product/service not provided.</p>
            <p>3. Free Support will be provided upto 3 Months on All Product & Services.</p>
            <p>4. All disputes are subject to Delhi/New Delhi Jurisdiction.</p>
            <p>5. Service charges of Rs.500/- shall be charged for any cheque returned unpaid.</p>
            <p>6. Declaration pursuant to Notification (Income Tax) No. 21/2012/F.No.142/10/2012-SO(TPL)dated 13.6.</p>
            <p>2012 : ?We are providing Software and Services, and tax has been deducted under Sec. 194J.Our PAN is"AAMFN8512C"</p>
         </div>
      </div>
      <!-- partial -->
      <script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
      <script src='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/js/bootstrap.min.js'></script>
   </body>
</html>