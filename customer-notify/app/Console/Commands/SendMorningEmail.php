<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer;
use Illuminate\Support\Facades\Mail;
class SendMorningEmail extends Command
{
    protected $signature = 'email:morning';
    protected $description = 'Send Good Morning email to selected customers';
    
    public function handle()
    {
        $customers = Customer::whereJsonContains('address->post_code', '1216')
            ->whereJsonContains('address->country', 'Bangladesh')
            ->get();
    
        foreach ($customers as $customer) {
            Mail::raw("Good Morning, {$customer->name}!", function ($message) use ($customer) {
                $message->to($customer->email)->subject('Good Morning');
            });
        }
    
        $this->info('Morning emails sent.');
    }
}
