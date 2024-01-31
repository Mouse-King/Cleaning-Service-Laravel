<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'entry_id',
        'message',
        'number',
        'flex',
        'read',
        'data'
    ];


    public static function getWhatsappMessage($message_no,$lang_type,$client){

       
        if( !is_null($client) ){

        $id   = base64_encode($client->id);
        $link = url('/schedule-meet/'.$id);

        } else {
          $link = '';
        } 
       
        $message =[
        'en' =>[
            "message_0"=>"Hi, this is Bar, the digital representative of Broom Service how can I help you?\n\n1. About Brom Service and details about the service\n2. Service areas\n3. Scheduling an appointment \n4. Service for existing customers \n5.human representative (during business hours)",
            'message_1'=>"So who we are?\nBroom Service is a premium cleaning company that has been operating since 2015 and provides a response for people who looking for high-level cleaning services for their home or apartment without any unnecessary hassle.\n\nUnlike the alternatives you know, such as a housekeeper or companies that will mediate between you and an hourly maid.\nWith us you will get a fixed price per visit and is priced according to 5 packages at different levels tailored to you and your needs.\n\nWe offer both general clean and cleaning services as well as permanent or one-time wardrobe arrangement and organization services.\nAs you go up in the package level, you get more services (according to your needs).\n\nTo get a quote for the service, you must arrange a meeting for a quote at the property you want us to clean. The meeting is free of charge or any obligation on your part and takes around 10-15 minutes.\n \nAfter the meeting, we will send an orderly and detailed quote, according to the service or package that suits you.\nThe price is for a visit and includes worker’s social terms such as travels.\n\nYou will get a permanent worker, on fixed days (for those who take once a week or more - otherwise there is no obligation) who arrive with all the materials and equipment for work (except for a bucket , vacuum cleaner and a mop which the customer provides) and are supervised by our supervisor to make sure that the work is always to your satisfaction and to our standards.\nPayment is made at the end of the month or after the visit - if it is a one-time visit.Payment by credit card, against an invoice - price per visit twice the number of visits (in addition to other services you may have ordered that month such as hosting services, windows, polishing, arranging cabinets, etc).\nBroom Service is one of the only cleaning companies that received a license from the Ministry of Economy.\nAll company employees receive a high payment from the first day of work, days off and sick days, receive provisions for a pension and a training fund according to the law.",
        'message_2'=>"We provide service in Tel Aviv, Ramat Gan, Givatayim, Kiryat Ono, Ramat Hasharon, Kfar Shmariahu and Herzliya.\n\nWould you like to arrange a price quote?",
        'message_3'=>"How do we start?\nBefore the service, one of the company's inspectors will come to your house for a free and no-obligation meeting.\nThe inspector examines what your needs are, checks which surfaces must be cleaned in the property and what material they are made of in order to match them with the best cleaning fluid Sees the size of the property, number of bathrooms and bedrooms and accordingly adjusts the package and the appropriate employee to you.\n After the meeting, you will be sent a price quote which you can confirm and book the service - about a week in advance, or if there is an available space that week.\nA human representative will contact you shortly",
        "message_4"=>"Hi, nice to see you again\n\n1. Contacting a supervisor\n2. accountancy\n3. Cancellation of service\n4.Switching to a human representative (during business hours)",
        "message_5"=>"Please remain available, a human representative will contact you shortly",
        "message_2_no"=>"We will be happy to keep in touch and provide you with service when we arrive in your area.",
        "message_4_1"=>"Thank you very much for your response, the foreman will contact you soon.",
        "message_4_2"=>"Thank you very much for your response, a representative from accounting will contact you shortly.",
        "message_4_3"=>"Thank you very much for your response, a human representative will contact you shortly.",
        "message_4_4"=>"Please remain available, a human representative will contact you shortly.",

        ],

        'heb' =>[
            "message_0"=>"היי כאן בר, הנציגה הדיגיטלית של ברום סרוויס איך אוכל לעזור לך?\n\n1. אודות ברום סרוויס ופרטים על השירות\n2. איזורי שירות \n3. קביעת פגישה לקבלת הצעת מחיר \n4. שירות ללקוחות קיימים \n5.מעבר לנציג אנושי (בשעות הפעילות)",
            'message_1'=>"אז מי אנחנו?\nברוום סרוויס הינה חברת ניקיון פרימיום הפועלת משנת 2015 ומספקת מענה לאנשים המחפשים שירותי ניקיון ברמה גבוהה לבית או הדירה וללא כל התעסקות מיותרת.\n\nבשונה מהאלטרנטיבות שאתם מכירים, כמו עוזרת בית או חברות שיתווכו בינכם לבין עוזרת לפי שעה או כח אדם לפי שעה,\nאצלנו המחיר הוא מחיר קבוע לביקור ומתומחר לפי 5 חבילות ברמות שונות המותאמות לכם ולצרכים שלכם.\n\nאנו מציעים גם שירותי ניקיון כללי ויסודי וגם שירותי סידור וארגון ארונות עב קבוע או חד פעמי.
            ככל שעולים ברמת החבילה, אתם מקבלים יותר שירותים (בהתאם לצרכים שלכם) והמחיר נקבע בהתאם לעבודה ולאחר פגישה אצלכם בבית.\n\nכדי לקבל הצעת מחיר על השירות, יש לתאם פגישה להצעת מחיר בנכס שתרצו שננקה.
            הפגישה ללא עלות או כל התחייבות מצדכם ולוקחת באיזור 10-15דק.
            לאחר הפגישה, אנו שולחים הצעת מחיר מסודרת ומפורטת, בהתאם לשירות או החבילה המתאימה לכם,\n \nכשהמחיר הוא לביקור ומגלם בתוכו את הכל, תנאים סוציאליים, נסיעות, עובדים קבועים, בימים קבועים (למי שלוקח פעם בשבוע או יותר- אחרת אין התחייבות)  המגיעים עם כל החומרים והציוד לעבודה (למעט שואב דלי ומגב שאת זה הלקוח מספק) ומפוקחים עי מנהל עבודה מטעמנו, שיוודא כי העבודה תמיד לשביעות רצונכם ובסטנדרטים שלנו.
            התשלום מתבצע בסוף החודש או לאחר הביקור- במידה ומדובר בביקור חד פעמי.\n\nכשהמחיר הוא לביקור ומגלם בתוכו את הכל, תנאים סוציאליים, נסיעות, עובדים קבועים, בימים קבועים (למי שלוקח פעם בשבוע או יותר- אחרת אין התחייבות)  המגיעים עם כל החומרים והציוד לעבודה (למעט שואב דלי ומגב שאת זה הלקוח מספק) ומפוקחים עי מנהל עבודה מטעמנו, שיוודא כי העבודה תמיד לשביעות רצונכם ובסטנדרטים שלנו.
            התשלום מתבצע בסוף החודש או לאחר הביקור- במידה ומדובר בביקור חד פעמי.\nהתשלום בכרטיס אשראי, כנגד חשבונית- מחיר לביקור כפול מספר הביקורים (בתוספת שירותים נוספים שאולי הזמנתם  באותו חודש כמו שירותי אירוח, חלונות, פוליש, סידור ארונות וכו)
            ברום סרוויס היא אחת מחברות הניקיון היחידות שקיבלו רישיון ממשרד הכלכלה. כל עובדי החברה מקבלים תשלום גבוה מהיום הראשון בעבודה, ימי חופש ומחלה, מקבלים הפרשות לפנסיה ולקרן השתלמות כחוק. ",
        'message_2'=>"אנחנו מספקים שירות בתל אביב, רמת גן, גבעתיים, קריית אונו, רמת השרון, כפר שמריהו והרצליה. \n\nהאם תרצו לתאם פישה להצאת מחיר?",
        'message_3'=>"איך מתחילים?\nלפני השירות מגיע אחד המפקחים של החברה, לנכס שלכם, לפגישה ללא עלות וללא התחייבות.\nהמפקח, בוחן מהם הצרכים שלכם, בודק אילו משטחים יש לנקות בנכס ומאיזה חומר הם עשויים על מנת להתאים להם את חומר הניקוי הטוב ביותר,
        רואה את גודל הנכס, מספר חדרי שירותים וחדרי שינה ובהתאם לכך מתאים לכם את החבילה והעובד המתאים.\nלאחר הפגישה תשלח אליכם הצעת מחיר אותה תוכלו לאשר ולהזמין את השירות- כשבוע מראש, או ע\"ב מקום פנוי באותו השבוע.\nנציג אנושי יצור איתך קשר בהקדם\nלקבוע פגישה\n $link",
        "message_4"=>"היי, כיף לראות אותך שוב \n\n1. יצירת קשר עם מנהל עבודה \n2. הנהלת חשבונות \n3. ביטול שירות\n4.מעבר לנציג אנושי (בשעות הפעילות)",
        "message_5"=>"אנא הישאר זמין, נציג אנושי יצור איתך קשר בהקדם",
        "message_2_no"=>"נשמח לשמור על קשר ולהעניק לך שירות כשנגיע לאיזורך. ",
        "message_4_1"=>"תודה רבה על תגובתך, מנהל העבודה יצור איתך קשר בהקדם",
        "message_4_2"=>"תודה רבה על תגובתך, נציג מהנהלת חשבונות יצור איתך קשר בהקדם",
        "message_4_3"=>"תודה רבה על תגובתך, נציג אנושי יצור איתך קשר בהקדם",
        "message_4_4"=>"אנא הישאר זמין, נציג אנושי יצור איתך קשר בהקדם",

        ],
    ]; 

   return $message[$lang_type][$message_no];
 }


}
