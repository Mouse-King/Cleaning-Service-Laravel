@php
\App::setLocale($client['lng']);
@endphp
<html>
   <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
   </head>
   <body>
      <div class="container" style="margin-top:5%;">
      <center>
      <img src="{{asset('images/sample.svg')}}" style="margin-top:-60px;margin-bottom:5%;"/>
      </center>

         <div class="row">
            <div class="jumbotron" style="box-shadow: 2px 2px 4px #000000;">
               <h2 class="text-center text-success font-weight-bolder">{{__('invoice.thanks.head_txt')}}</h2>
               <h3 class="text-center">{{__('invoice.thanks.sub_txt')}}</h3><br>
            </div>
         </div>
      </div>
      <body>
</html>