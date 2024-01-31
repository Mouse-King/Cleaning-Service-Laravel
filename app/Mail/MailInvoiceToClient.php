<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailInvoiceToClient extends Mailable
{
    use Queueable, SerializesModels;
    public $data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        \App::setLocale($this->data['job']['client']['lng']);
        $sub = __('invoice.pdf.mailsubject')." #".$this->data['docnum'];
        return $this->view('Mails.MailInvoiceToClient')->with(['data', $this->data])->subject($sub);
    }
}
