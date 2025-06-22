<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomerCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The customer instance.
     *
     * @var \App\Models\Customer
     */
    public $customer;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Customer  $customer
     * @return void
     */
    public function __construct($customer)
    {
        $this->customer = $customer;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('New Customer Registered')
                    ->view('emails.customer_created', ['customer' => $this->customer]);
    }
}
