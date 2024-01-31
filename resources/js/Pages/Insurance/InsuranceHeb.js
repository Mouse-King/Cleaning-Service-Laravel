import React,{ useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import logo from "../../Assets/image/logo.png";
import insurancelogo from "../../Assets/image/insurance-logo.png";

export default function InsuranceHeb() {
    const sigRef2 = useRef();
    const sigRef3 = useRef();
    const sigRef4 = useRef();
    const sigRef5 = useRef();
    const sigRef6 = useRef();

    const handleSignatureEnd2 = () => {
        setSignature2(sigRef2.current.toDataURL());
    }
    const clearSignature2 = () => {
        sigRef2.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd3 = () => {
        setSignature2(sigRef3.current.toDataURL());
    }
    const clearSignature3 = () => {
        sigRef3.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd4 = () => {
        setSignature2(sigRef4.current.toDataURL());
    }
    const clearSignature4 = () => {
        sigRef4.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd5 = () => {
        setSignature2(sigRef5.current.toDataURL());
    }
    const clearSignature5 = () => {
        sigRef5.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd6 = () => {
        setSignature2(sigRef6.current.toDataURL());
    }
    const clearSignature6 = () => {
        sigRef6.current.clear();
        setSignature2(null);
    }
  return (
    <div>
        <div className='container'>
        <div className='send-offer insurance-eng insurance-heb'>
            <div className='maxWidthControl dashBox mb-4'>
            <div className='row'>
            <div className='col-sm-6'>
                    <img src={logo} className='img-fluid' alt='Broom Service' />
                </div>
                <div className='col-sm-6'>
                    <img src={insurancelogo} className='img-fluid' alt='Insurance Logo' />
                </div>

            </div>
                <h1>הצעה לביטוח עובדים זרים</h1>
                <p>יש לענות על כל השאלות באופן ברור ומלא. אין להשתמש בקוים<br/>או בסימנים במקום מילים.<br/>הטופס מיועד לנשים ולגברים כאחד.</p>
                <p>עליך להשיב תשובה מלאה וכנה לשאלות בעניין מהותי. ככל שלא<br/>תעשה כן יכול ותהיה לכך השפעה על תשלום תגמולי הביטוח.</p>

                <div className='please-select'>
                <h4>חובה לבחור אחת מבין האפשרויות הבאות</h4>
                <ul className='list-unstyled'>
                    <li><span> מצטרף חדש</span></li>
                    <li><span>חידוש ברצף/ הארכת תקופת ביטוח</span></li>
                </ul>
                </div>
                <div className='insuranceform'>
                    <p>(במקרה זה אין צורך למלא הצהרת בריאות)</p>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">שם הסוכן</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מספר  הסוכן</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">שם החברה/קולקטיב</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">.פ.ח מס׳</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מספר הסכם בפוליסה </label>
                                    <input type="text" className="form-control" placeholder='פרמיה ליום' />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>א. פרטי בעל הפוליסה/המעסיק הנוכחי</th>
                            </thead>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">.ז.ת מס׳</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם פרטי </label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם משפחה</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">מיקוד</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">עיר</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ בית</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">רחוב / כתובת:</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">דוא"ל לצורך קבלת הודעות, מידע ודיוורים</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ טלפון נייד</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ טלפון </label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>ב. פרטי המועמד לביטוח</th>
                            </thead>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">שם פרטי</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם משפחה</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ דרכון</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">מוצא ארץ</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך לידה</label>
                                    <input type="date" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך  ראשון  שבוטחת</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מין</label>
                                    <div className='gender'>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                        <label className="form-check-label" for="inlineRadio1">זכר</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                        <label className="form-check-label" for="inlineRadio2">נקבה </label>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">מיקוד</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">עיר</label>
                                    <input type="date" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ בית</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">רחוב / כתובת:</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">דוא״ל להודעות אישיות ודיוורים</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ טלפון נייד </label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ טלפון</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>* ידוע לי ואני מסכים לכך שככל שלא אמלא כתובת - כתובת המעסיק</p>
                                    <p>תשמש את החברה במשלוח הודעות ו/או מסמכים.</p>
                                </td>

                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={2}>ג. תקופת ביטוח מבוקשת</th>
                            </thead>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">עד לתאריך</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מתאריך</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <p>* לתשומת ליבך: תאריך מבוקש זה אינו מחייב את החברה, מועד תחילת<br/>הביטוח הקובע הינו כמצוין בדף פרטי הביטוח.</p>
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>ד. בחר את העיסוק של המועמד לביטוח</th>
                            </thead>
                            <tr>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">אחר</label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">בניין </label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">חקלאות </label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="option5" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">סיעוד </label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="option6" />
                                </div>
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>ה. פרטי ביטוח קודמים </th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                    האם היית מבוטח בחברת מנורה מבטחים או בחברת ביטוח אחרת?
                                        <div className="form-check form-check-inline ml-2">
                                            <input className="form-check-input ml-1" type="radio" name="inlineRadioOptions" id="inlineRadio7" value="option7" />
                                            <label className="form-check-label" for="inlineRadio1">לא</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input ml-1" type="radio" name="inlineRadioOptions" id="inlineRadio8" value="option8" />
                                            <label className="form-check-label" for="inlineRadio1">כן</label>
                                        </div>
                                    </p>
                                    <p>אם כן, ציין באיזו חברה ומספר הפוליסה/חבר אצל ספק שירותי בריאות:</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0' }}>
                                    <label for="label" className="form-label" style={{ paddingRight: '10px', paddingTop: '10px' }}>תקופת ביטוח</label>
                                    <tr>
                                        <td>
                                            {/* <label for="label" className="form-label">To</label> */}
                                            <input type="text" className="form-control" placeholder='עד לתאריך' />
                                        </td>
                                        <td>
                                            {/* <label for="label" className="form-label">From</label> */}
                                            <input type="text" className="form-control" placeholder='מתאריך' />
                                        </td>
                                    </tr>
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם החברה</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ פוליסה</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">חבר מס׳</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>ו. תשלום באמצעות כרטיס אשראי  </th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                    ניתן לשלם בתשלומים בהתאם לתקופת הביטוח המבוקשת, אם לא צויין מס' תשלומים, ייגבה בתשלום אחד.
                                    </p>
                                    <p>○ 6 חודשים - עד 4 תשלומים.      מס׳ תשלומים____________________________</p>
                                    <p>○ 12 חודשים - עד 10 תשלומים.  מס׳ תשלומים____________________________</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p><b>פרטי המועמד לביטוח</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">שם פרטי</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם משפחה</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ דרכון</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p><b>פרטי המשלם</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">מס׳ ת.ז.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם פרטי</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם משפחה</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">מיקוד</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">עיר</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ בית</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">כתובת: / רחוב</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">בתוקף עד (חודש ושנה)</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td colSpan={3}>
                                    <label for="label" className="form-label">מספר כרטיס אשראי</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <label for="label" className="form-label">דוא״ל</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ טלפון נייד </label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                    לידיעתך, אמצעי התשלום ישמש לתשלום דמי הביטוח עבור כל המבוטחים בפוליסה.
ככל שיבוצע החזר של דמי ביטוח, ההחזר יבוצע לאמצעי תשלום זה, אלא אם הוחלט על ידי החברה לבצע את ההחזר לאמצעי תשלום אחר.
היה ופוליסת/ות הביטוח תחודש/נה, יחויב כרטיס האשראי בגין החיובים הנובעים מהפוליסה/ות שתחודש/נה.
הרשאה זו תהיה בתוקף גם לחיוב כרטיס שיונפק ויישא מספר אחר, כחלופה לכרטיס שמספרו מצוין בטופס זה.

                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                <label for="label" className="form-label">חתימת בעל הכרטיס אשראי</label>

                                <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef2}
                                    onEnd={handleSignatureEnd2}
                                />
                                <button className='btn btn-warning' onClick={clearSignature2}>ברור</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>חתימת המעסיק</th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                    טופס הצעה זה נחתם בידי המועמד לביטוח לאחר שהוסבר לו תוכנו בשפה
                                    </p>
                                    <p>המובנת לו.</p>

                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">חותמת וחתימת המעסיק</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef3}
                                    onEnd={handleSignatureEnd3}
                                />
                                <button className='btn btn-warning' onClick={clearSignature3}>ברור</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם המעסיק </label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={3}>ז. הצהרת בריאות </th>
                            </thead>
                            <tr>
                                <td colSpan={3}>
                                    <p>
                                    למען הפשטות מנוסחת הצהרה זו בלשון זכר, אך היא מכוונת לבני שני המינים.<br/>
                                    נא לענות על כל השאלות שלהלן. לכל שאלה יש לסמן "<br/>
                                    בתשובה "כן" או "לא" ואם הממצא חיובי, רשום<br/>
                                    בשורת "פירוט הממצאים החיוביים" או מספר השאלה ואת הפירוט.
                                    </p>

                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">שם פרטי </label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם משפחה </label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳ דרכון </label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p><b>שאלות כלליות על מצב רפואי</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>1. גובה____________________מ׳ משקל_______________ק״ג</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>2. האם חל שינוי במשקלך 5( ק"ג ומעלה) במהלך 12- החודשים האחרונים (שלא כתוצאה מדיאטה?)</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>3. האם אתה צורך אלכוהול כעת או בעבר - יותר מכוס אחת ביום של בירה /יין או משקה אלכוהולי אחר?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>4. האם אתה מעשן או עישנת בעבר ? ○ כיום ○ בעבר<br/>מתי הופסק?_______________כמות ותדירות</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>5. האם צרכת סמים בהווה או בעבר?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>6. האם עברת ב 10- השנים האחרונות ניתוח או הומלץ לך לעבור ניתוח?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>7. האם אושפזת ב 10- השנים האחרונות בבית חולים או במוסד רפואי?<br/>איזה, מתי, סיבה__________________________________<br/><span>צרף סיכומי מחלה ומידע עדכני</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>8. האם אתה נוטל תרופות באופן קבוע בשל מחלה כרונית?<br/><span>פרט את שם התרופה והסיבה לנטילתה.</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>9. <span>בדיקות אבחנתיות:</span></p>
                                    <p>האם עברת ב10- השנים האחרונות או הומלץ לך לבצע את אחת או<br/>יותר מהבדיקות: צינטור, מיפוי לב, אקו לב,MRI, CT אנדסקופיה,<br/>בדיקות לגילוי גידול ממאיר, ביופסיה ודם סמוי?</p>
                                    <p><span>אם כן, פרט את סוג הבדיקה, מועד, תוצאות הבדיקה והסיבה לביצוע</span><br/>______________________________________________________________</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p><b>מחלות על שאלות</b> <br/>האם אובחנת במהלך חייך במחלות ו/או הפרעות ו/או בעיות רפואיות הרשומות מטה? </p></td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>10. <span>מערכת לב ודם </span> מחלת לב, תעוקת חזה (אנגינה פקטוריס,) אוטם שריר הלב, הפרעות בקצב, בעיה בשסתום הלב, <br/>מחלת לב מולדת, מחלת שריר הלב או קרום הלב. יתר לחץ דם, כלי דם, קרישי דם, דליות<br/>בוורידים, הפרעות במחזור הדם, היצרות עורקים.</p></td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>11. <span>מערכת עצבים והמח</span> טרשת נפוצה, ניוון שרירים, שיתוק, התכווצויות<br/>אפילפסיה, T.I.A , אירועי מוחי, שטף דם במוח C.V.A( ,) רעד, <br/>הפרעות בשיווי משקל, פרקינסון.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>12. הפרעות נפשיות מאובחנות וניסיון התאבדות</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>13. <span>דרכי נשימה</span> אסטמה, ברונכיטיס כרונית, אמפיזיה, שחפת, גניחת דם, זיהומים חוזרים בדרכי הנשימה.
</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>14. <span>דרכי העיכול והכבד </span> אולקוס (כיב קיבה או תרסריון,) צרבת, מחלת<br/>מעיים דלקתית כרונית, דימום במערכת העיכול, טחורים, בעיות<br/>בפי הטבעת, מחלת כבד כרונית, צהבת, אבני מרה, דלקת בלבלב,<br/>הפטיטיס (ויראלית או אחרת)</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>15. <span>כליות ודרכי השתן </span> אבני כליות, דלקות בכליה, מומים בדרכי השתן,<br/>דם או חלבון בשתן, ציסטות בכליה, פגיעה בתפקוד כלייתי, בלוטת<br/>הערמונית</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>16. <span>מחלות אנדוקריניות חילוף חומרים</span> סכרת, הפרעה בבלוטות המגן,<br/>יותרת הכליה, ציסטות בכליה, יותרת המוח ובלוטות אחרות, שומנים<br/>גבוהים בדם (כולסטרול, טריליצרגידים.)</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>17. <span>עור ומין </span> עגבת, הרפס,גידולי עור, שומות, יבלות ו/או בעיות עקרות ו/
או בעיות פריון</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>18. מחלות ממאירות, גידול/ים ממאיר/ים או טרום ממאירים, פוליפים פרט <br/><span>סוג ואופן הטיפול_______________________________________יש לצרף דוחות ופתולוגיה</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>19. מחלות זיהומיות, מחלות אוטואמוניות, פוליו, מחלות מין <br/>ואיידס/נשא HIV <span>. יש לצרף מסמכים רפואיים</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>20. <span>פרקים ועצמות-</span> דלקת פרקים (ארטריטיס,) שגרון (גאלט,) כאבי גב או
צוואר, פריצת דיסק, כתף, ברך, מחלת עצם.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>21. <span>עיניים-</span> קטרט, גלאוקומה, פזילה, עיוורון, מחלת רשתית, מחלת
קרנית, הפרעות ראייה, מס' דיופטר.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>22. <span>אף אוזן גרון- </span> דלקות גרון או אוזניים חוזרות, סינוסיטיס, הפרעות
בשמיעה, תסמונת דום נשימה בשינה.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>23. הבטן, במפשעה, בצלקות ניתוחים, בטבור ובסרעפת. <span>יש לצרף מסמכים רפואיים</span> </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>24. <span>לנשים בלבד:</span> האם את סובלת או סבלת ממחלות נשים: <br/>אי סדירות בווסת, בעיות פוריות,דימומים וגושים בשדיים, בעיות ברחם<br/>ובשחלות, ממצאים לא תקינים בבדיקה גניקולוגית (כגון )PAP<br/>האם את בהריון? מה מספר העוברים?_______________________________<br/>האם סבלת מבעיות בהריונות או בהריון הנוכחי?<br/>האם ילדת בניתוח קיסרי?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p><b>פירוט ממצאים חיוביים</b></p></td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">חתימה</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef4}
                                    onEnd={handleSignatureEnd4}
                                />
                                <button className='btn btn-warning' onClick={clearSignature4}>ברור</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם המועמד לביטוח</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך </label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>ח. אישור המועמד לביטוח לפעילות סוכן</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    מאשר לסוכן הביטוח שלי בפוליסה, מר/גב׳ ____________________לטפל בשמי ועבורי לטפל בשמי ועבורי בכל הקשור לתביעה <br/>זו ובכלל זאת להגיש ל"מנורה" ולקבל מ"מנורה" בשמי ועבורי את כל התכתובות ו/או המסמכים<br/>הקשורים לתביעה, ולשמש כשלוחי לכל דבר ועניין הנוגע לתביעה זו.
                                    </p>
                                    <p>
                                    <label for="label" className="form-label">חתימת המועמד לביטוח</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef5}
                                    onEnd={handleSignatureEnd5}
                                />
                                <button className='btn btn-warning' onClick={clearSignature5}>ברור</button>
                                    </p>

                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>ט. הצהרת המבקש/ המועמד לביטוח</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    אני החתום מטה, המועמד לביטוח, מבקש בזה לבטח את המועמד לביטוח לפי<br/>רישום בטופס זה (להלן: "ההצעה)"
                                    </p>
                                    <p>
                                    <span>אני מצהיר מסכים ומתחייב בזה כי:</span>
                                    </p>
                                    <p>1.   כל התשובות המפורטות בהצעה ו/או בהצהרת הבריאות הן נכונות ומלאות, ולא העלמתי מן המבטח דבר העלול להשפיע על החלטתו לקבל את ההצעה
לביטוח.</p>
                                    <p>2.	התשובות המפורטות בהצעה וכן כל מידע אחר בכתב שימסר למבטח על-ידי וכן התנאים המקובלים אצל המבטח לעניין זה ישמשו תנאי לחוזה
הביטוח ביני לבין המבטח ויהוו חלק בלתי נפרד ממנו. </p>
                                    <p>3.	אני מאשר ומסכים בזה כי קיבולה או דחייתה של הצעתי זו נתון לשיקול דעתו הבלעדי של המבטח והוא ראשי להחליט על קבלת ההצעה או דחייתה
בכפוף להוראות הדין.
</p>
                                    <p>4.	אני מסכים כי פוליסת הביטוח של תכניות הביטוח המבוקשות בהצעה זו
תימסר לי באמצעות הסוכן שפרטיו מופיעים בתחילת הצעה זו. </p>
                                    <p>5.	 מידה וברצונך לקבל את הפוליסה ו/או את המידע במסגרת הליך החיתום והליך ההצטרפות לפוליסה זו גם ישירות אליך, ביכולתך לפנות למנורה בכל
עת בטלפון מס' 03-7107460.</p>

                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>י. ויתור כל סודיות רפואית</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    אני החתום מטה נותן בזה רשות למוסד הרפואי ו/או לעובדיכם ו/או לכל מי
שפועל מטעמכם או בשליחותכם למסור ל"מנורה מבטחים ביטוח בע"מ" (להלן: "המבקש)" את כל הפרטים, ללא יוצא מן הכלל, על מצב בריאותי ו/או על כל מחלה שחליתי בה בעבר ו/או שהנני חולה בה כעת, לרבות מידע על טיפולים פסיכיאטריים או נפשיים אחרים שקיבלתי ובאופן שידרש על ידי המבקש והנני משחרר  אתכם  ו/או  את  עובדיכם  ו/או  כל  מי  שפועל  מטעמכם  או  בשליחותכם מחובת שמירה על סודיות רפואית בכל הנוגע למצב בריאותי ו/או מחלותיי כן"ל ומוותר על סודיות זו כלפי המבקש ולא תהיינה לי אליכם כל טענה או תביעה מסוג כלשהוא בקשר לנ"ל, לרבות טענות מכוח
<br/>חוק הגנת הפרטיות ו/או חוק זכויות<br/>החולה לעניין סודיות רפואית ו/או כל דין אחר.
                                    </p>
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>יא. מידע למועמד לביטוח</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                        1.  בהתאם לתנאי הפוליסה, במהלך 90 ימים ממועד סיום תקופת הביטוח ניתן להאריך את תקופת הביטוח ברצף, בכפוף לתשלום דמי ביטוח בגין התקופה שבין סיום תקופת הביטוח לבין הארכת הביטוח וכל עוד הינך ממשיך לעבוד כעובד זר. לאחר חלוף 90 ימים ממועד סיום תקופת הביטוח, הצטרפות
לפוליסה חדשה תהיה כרוכה בהליך חיתום.

                                    </p>
                                    <p>
                                        2.	ככל  שהינך  אדם  עם  מוגבלות,  כהגדרתו  בחוק  שוויון  זכויות  לאנשים  עם מוגבלות, תשנ"ח– ,1998 קרי "אדם עם לקות פיסית, נפשית או שכלית לרבות קוגניטיבית, קבועה או זמנית, אשר בשלה מוגבל תפקודו באופן
מהותי בתחום אחד או יותר מתחומי החיים העיקריים," אנא עדכן אותנו על
כך באמצעות סוכן הביטוח שלך, שפרטיו מופיעים בתחילת הצעה זו.

                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><span>אני מאשר כי קראתי והבנתי את האמור בהצעה זו, לרבות ההצהרות
המופיעות בה.</span></p>
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>חתימת המועמד לביטוח</th>
                            </thead>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">חתימה</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef6}
                                    onEnd={handleSignatureEnd6}
                                />
                                <button className='btn btn-warning' onClick={clearSignature6}>ברור</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">מס׳  דרכון</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">שם המועמד לביטוח</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">תאריך </label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='button mt-4 text-center'>
                        <input class="btn btn-pink" value="שלח" />
                    </div>
                </div>
            </div>
            </div>
            </div>
    </div>
  )
}
