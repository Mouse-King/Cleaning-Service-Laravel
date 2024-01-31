<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\TextResponse;
use App\Models\WebhookResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function chats()
    {

        $data = WebhookResponse::distinct()->where('number', '!=', null)->get(['number']);

        $clients = [];

        if (count($data) > 0) {


            foreach ($data as $k => $_no) {
                $no = $_no->number;
                $_unreads = WebhookResponse::where(['number' => $no,'read' => 0])->pluck('read');

                $data[$k]['unread'] = count($_unreads);

                if (strlen($no) > 10)
                    $cl  = Client::where('phone', 'like', '%' . substr($no, 2) . '%')->get()->first();
                else
                    $cl  = Client::where('phone', 'like', '%' . $no . '%')->get()->first();

                if (!is_null($cl)) {
                    $clients[] = [
                        'name' => $cl->firstname . " " . $cl->lastname,
                        'id'   => $cl->id,
                        'num'  => $no,
                        'client' => ($cl->status == 0) ? 0 : 1
                    ];
                }
            }
        }


        return response()->json([
            'data' => $data,
            'clients' => $clients,
        ]);
    }

    public function chatsMessages($no)
    {

        $chat = WebhookResponse::where('number', $no)->get();

        WebhookResponse::where(['number' => $no, 'read' => 0 ])->update([
            'read' => 1
        ]);

        $lastMsg = WebhookResponse::where('number', $no)->get()->last();

        ($lastMsg->created_at < Carbon::now()->subHours(24)->toDateTimeString())
            ?
            $expired = 1
            : $expired = 0;


        return response()->json([
            'chat' => $chat,
            'expired' => $expired
        ]);
    }

    public function chatReply(Request $request)
    {

        $result = Helper::sendWhatsappMessage($request->number, '', array('message' => $request->message));

        $response = WebhookResponse::create([
            'status'        => 1,
            'name'          => 'whatsapp',
            'message'       => $request->message,
            'number'        => $request->number,
            'read'          => !is_null(Auth::guard('admin')) ? 1 : 0,
            'flex'          => !is_null(Auth::guard('admin')) ? 'A' : 'C',
        ]);

        return response()->json([
            'msg' => 'message send successfully'
        ]);
    }

    public function saveResponse(Request $request)
    {

        TextResponse::truncate();
        $responses = $request->data;

        if (count($responses) > 0) {
            foreach ($responses as $k => $res) {

                TextResponse::create(
                    [
                        'keyword' => $res['keyword'],
                        'heb'     => $res['heb'],
                        'eng'     => $res['eng'],
                        'status'  => $res['status']
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Responses saved successfully'
        ]);
    }

    public function chatResponses()
    {

        $responses = TextResponse::all();

        return response()->json([
            'responses' => $responses
        ]);
    }

    public function chatRestart(Request $request)
    {


        Helper::sendWhatsappMessage($request->number, $request->template, array('name' => ''));
        $client = Client::where('phone', 'like', '%' . $request->number . '%')->get()->first();
        $_msg = TextResponse::where('status', '1')->where('keyword', 'main_menu')->get()->first();

        WebhookResponse::create([
            'status'        => 1,
            'name'          => 'whatsapp',
            'entry_id'      => '',
            'message'       => ($client && $client->lng == 'en') ? $_msg->eng : $_msg->heb,
            'number'        => $request->number,
            'flex'          => 'A',
            'read'          => 1,
            'data'          => '',
        ]);

        return response()->json([
            'message' => 'chat restarted'
        ]);
    }

    public function chatSearch($s, $type)
    {
        if ($type == 'number')
            $data = WebhookResponse::distinct()->where('number', 'like', '%' . $s . '%')->get(['number']);
        else
            $data = WebhookResponse::distinct()
                ->Where(function ($query) use ($s) {
                    for ($i = 0; $i < count($s); $i++) {
                        $r = str_replace('+', '', $s[$i]);
                        $query->orwhere('number', 'like',  '%' . $r . '%');
                    }
                })->get(['number']);

        $clients = [];

        if (count($data) > 0) {

            
            foreach ($data as $k => $_no) {
                $no = $_no->number;
                $_unreads = WebhookResponse::where(['number' => $no,'read' => 0])->pluck('read');

                $data[$k]['unread'] = count($_unreads);
                
                if (strlen($no) > 10)
                    $cl  = Client::where('phone', 'like', '%' . substr($no, 2) . '%')->get()->first();
                else
                    $cl  = Client::where('phone', 'like', '%' . $no . '%')->get()->first();

                if (!is_null($cl)) {
                    $clients[] = [
                        'name' => $cl->firstname . " " . $cl->lastname,
                        'id'   => $cl->id,
                        'num'  => $no,
                        'client' => ($cl->status == 0) ? 0 : 1
                    ];
                }
            }

            return response()->json([
                'data' => $data,
                'clients' => $clients
            ]);
        }
    }

    public function search(Request $request)
    {
        $s = $request->s;

        if (is_null($s)) {
            return $this->chats();
        }

        if (is_numeric($s)) {

            return $this->chatSearch($s, 'number');
        } else {

            $cx = explode(' ', $s);
            $fn  = $cx[0];
            $ln  = isset($cx[1]) ? $cx[1] : $cx[0];
            $clients = Client::where('firstname', 'like', '%' . $fn . '%')->orwhere('lastname', 'like', '%' . $ln . '%')->get('phone');


            if (count($clients) > 0) {
                $nos = [];
                foreach ($clients as $client) {
                    $nos[] = $client->phone;
                }

                return $this->chatSearch($nos, 'name');
            }
        }
    }

    public function responseImport()
    {

        TextResponse::truncate();

        TextResponse::create(
            [
                'keyword' => '1',
                'heb'     => "אז מי אנחנו?\nברוום סרוויס הינה חברת ניקיון פרימיום הפועלת משנת 2015 ומספקת מענה לאנשים המחפשים שירותי ניקיון ברמה גבוהה לבית או הדירה וללא כל התעסקות מיותרת.\n\nבשונה מהאלטרנטיבות שאתם מכירים, כמו עוזרת בית או חברות שיתווכו בינכם לבין עוזרת לפי שעה או כח אדם לפי שעה,\nאצלנו המחיר הוא מחיר קבוע לביקור ומתומחר לפי 5 חבילות ברמות שונות המותאמות לכם ולצרכים שלכם.\n\nאנו מציעים גם שירותי ניקיון כללי ויסודי וגם שירותי סידור וארגון ארונות עב קבוע או חד פעמי.
                ככל שעולים ברמת החבילה, אתם מקבלים יותר שירותים (בהתאם לצרכים שלכם) והמחיר נקבע בהתאם לעבודה ולאחר פגישה אצלכם בבית.\n\nכדי לקבל הצעת מחיר על השירות, יש לתאם פגישה להצעת מחיר בנכס שתרצו שננקה.
                הפגישה ללא עלות או כל התחייבות מצדכם ולוקחת באיזור 10-15דק.
                לאחר הפגישה, אנו שולחים הצעת מחיר מסודרת ומפורטת, בהתאם לשירות או החבילה המתאימה לכם,\n \nכשהמחיר הוא לביקור ומגלם בתוכו את הכל, תנאים סוציאליים, נסיעות, עובדים קבועים, בימים קבועים (למי שלוקח פעם בשבוע או יותר- אחרת אין התחייבות)  המגיעים עם כל החומרים והציוד לעבודה (למעט שואב דלי ומגב שאת זה הלקוח מספק) ומפוקחים עי מנהל עבודה מטעמנו, שיוודא כי העבודה תמיד לשביעות רצונכם ובסטנדרטים שלנו.
                התשלום מתבצע בסוף החודש או לאחר הביקור- במידה ומדובר בביקור חד פעמי.\n\nכשהמחיר הוא לביקור ומגלם בתוכו את הכל, תנאים סוציאליים, נסיעות, עובדים קבועים, בימים קבועים (למי שלוקח פעם בשבוע או יותר- אחרת אין התחייבות)  המגיעים עם כל החומרים והציוד לעבודה (למעט שואב דלי ומגב שאת זה הלקוח מספק) ומפוקחים עי מנהל עבודה מטעמנו, שיוודא כי העבודה תמיד לשביעות רצונכם ובסטנדרטים שלנו.
                התשלום מתבצע בסוף החודש או לאחר הביקור- במידה ומדובר בביקור חד פעמי.\nהתשלום בכרטיס אשראי, כנגד חשבונית- מחיר לביקור כפול מספר הביקורים (בתוספת שירותים נוספים שאולי הזמנתם  באותו חודש כמו שירותי אירוח, חלונות, פוליש, סידור ארונות וכו)
                ברום סרוויס היא אחת מחברות הניקיון היחידות שקיבלו רישיון ממשרד הכלכלה. כל עובדי החברה מקבלים תשלום גבוה מהיום הראשון בעבודה, ימי חופש ומחלה, מקבלים הפרשות לפנסיה ולקרן השתלמות כחוק. ",
                'eng'     => "So who we are?\nBroom Service is a premium cleaning company that has been operating since 2015 and provides a response for people who looking for high-level cleaning services for their home or apartment without any unnecessary hassle.\n\nUnlike the alternatives you know, such as a housekeeper or companies that will mediate between you and an hourly maid.\nWith us you will get a fixed price per visit and is priced according to 5 packages at different levels tailored to you and your needs.\n\nWe offer both general clean and cleaning services as well as permanent or one-time wardrobe arrangement and organization services.\nAs you go up in the package level, you get more services (according to your needs).\n\nTo get a quote for the service, you must arrange a meeting for a quote at the property you want us to clean. The meeting is free of charge or any obligation on your part and takes around 10-15 minutes.\n \nAfter the meeting, we will send an orderly and detailed quote, according to the service or package that suits you.\nThe price is for a visit and includes worker’s social terms such as travels.\n\nYou will get a permanent worker, on fixed days (for those who take once a week or more - otherwise there is no obligation) who arrive with all the materials and equipment for work (except for a bucket , vacuum cleaner and a mop which the customer provides) and are supervised by our supervisor to make sure that the work is always to your satisfaction and to our standards.\nPayment is made at the end of the month or after the visit - if it is a one-time visit.Payment by credit card, against an invoice - price per visit twice the number of visits (in addition to other services you may have ordered that month such as hosting services, windows, polishing, arranging cabinets, etc).\nBroom Service is one of the only cleaning companies that received a license from the Ministry of Economy.\nAll company employees receive a high payment from the first day of work, days off and sick days, receive provisions for a pension and a training fund according to the law.",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '2',
                'heb'     => "אנחנו מספקים שירות בתל אביב, רמת גן, גבעתיים, קריית אונו, רמת השרון, כפר שמריהו והרצליה. \n\nהאם תרצו לתאם פישה להצאת מחיר?",
                'eng'     => "We provide service in Tel Aviv, Ramat Gan, Givatayim, Kiryat Ono, Ramat Hasharon, Kfar Shmariahu and Herzliya.\n\nWould you like to arrange a price quote?",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '3',
                'heb'     => "איך מתחילים?\nלפני השירות מגיע אחד המפקחים של החברה, לנכס שלכם, לפגישה ללא עלות וללא התחייבות.\nהמפקח, בוחן מהם הצרכים שלכם, בודק אילו משטחים יש לנקות בנכס ומאיזה חומר הם עשויים על מנת להתאים להם את חומר הניקוי הטוב ביותר,
                רואה את גודל הנכס, מספר חדרי שירותים וחדרי שינה ובהתאם לכך מתאים לכם את החבילה והעובד המתאים.\nלאחר הפגישה תשלח אליכם הצעת מחיר אותה תוכלו לאשר ולהזמין את השירות- כשבוע מראש, או ע\"ב מקום פנוי באותו השבוע.\nנציג אנושי יצור איתך קשר בהקדם\nלקבוע פגישה",
                'eng'     => "How do we start?\nBefore the service, one of the company's inspectors will come to your house for a free and no-obligation meeting.\nThe inspector examines what your needs are, checks which surfaces must be cleaned in the property and what material they are made of in order to match them with the best cleaning fluid Sees the size of the property, number of bathrooms and bedrooms and accordingly adjusts the package and the appropriate employee to you.\n After the meeting, you will be sent a price quote which you can confirm and book the service - about a week in advance, or if there is an available space that week.\nA human representative will contact you shortly",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '4',
                'heb'     => "היי, כיף לראות אותך שוב \n\n1. יצירת קשר עם מנהל עבודה \n2. הנהלת חשבונות \n3. ביטול שירות\n4.מעבר לנציג אנושי (בשעות הפעילות)",
                'eng'     => "Hi, nice to see you again\n\n1. Contacting a supervisor\n2. accountancy\n3. Cancellation of service\n4.Switching to a human representative (during business hours)",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '4_1',
                'heb'     => "תודה רבה על תגובתך, מנהל העבודה יצור איתך קשר בהקדם",
                'eng'     => "Thank you very much for your response, the foreman will contact you soon.",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '4_2',
                'heb'     => "תודה רבה על תגובתך, נציג מהנהלת חשבונות יצור איתך קשר בהקדם",
                'eng'     => "Thank you very much for your response, a representative from accounting will contact you shortly.",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '4_3',
                'heb'     => "תודה רבה על תגובתך, נציג אנושי יצור איתך קשר בהקדם",
                'eng'     => "Thank you very much for your response, a human representative will contact you shortly.",
                'status'  => '1'
            ]
        );

        TextResponse::create(
            [
                'keyword' => '4_4',
                'heb'     => "אנא הישאר זמין, נציג אנושי יצור איתך קשר בהקדם",
                'eng'     => "Please remain available, a human representative will contact you shortly.",
                'status'  => '1'
            ]
        );


        TextResponse::create(
            [
                'keyword' => '5',
                'heb'     => "אנא הישאר זמין, נציג אנושי יצור איתך קשר בהקדם",
                'eng'     => "Please remain available, a human representative will contact you shortly",
                'status'  => '1'
            ]
        );

        return response()->json(['message' => 'chat responses added']);
    }


    public function Participants()
    {

        $url = 'https://graph.facebook.com/v18.0/' . env("FB_ACCOUNT_ID") . '/conversations?fields=participants&limit=100000000000000000000000000000000000000000000000000000&access_token=' . env("FB_ACCESS_TOKEN");

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        curl_close($ch);
        $_p = json_decode($result);

        return response()->json([
            'data' => $_p,
            'page_id' => env("FB_ACCOUNT_ID")
        ]);
    }

    public function messengerMessage($id)
    {

        $url = 'https://graph.facebook.com/v17.0/' . $id . '/?fields=participants,messages{id,message,created_time,from}&access_token=' . env('FB_ACCESS_TOKEN');
     
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        curl_close($ch);
        $_p = json_decode($result);

        return response()->json([
            'chat' => $_p,
        ]);
    }

    public function messengerReply(Request $request)
    {
      
        /*$ch = curl_init();
        
        $url = 'https://graph.facebook.com/v18.0/'.env("FB_ACCOUNT_ID").'/messages?recipient={id:'.intval($request->pid).'}&message={text:"i am string"}&messaging_type=RESPONSE&access_token='.env("FB_USER_ACCESS_TOKEN");

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        curl_close($ch);
        dd($result);
        $resp = json_decode($result);
        */

        $accessToken = env("FB_ACCESS_TOKEN");

        $url = "https://graph.facebook.com/v18.0/". env("FB_ACCOUNT_ID")."/messages";
        $messageText = strtolower($request->message);
        $senderId = env("FB_ACCOUNT_ID");
        $recipientId = $request->pid;
        $response = null;
      
        $response = ['recipient' => ['id' => $recipientId], 'sender' => ['id' => $senderId], 'message' => ['text' => $messageText], 'access_token' => $accessToken];

        $ch = curl_init($url);                            
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($response));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        $result = curl_exec($ch);
        curl_close($ch);
      
        $resp = json_decode($result);
        return response()->json([
            'data' => $resp
        ]);
    }
}
