import logo from "../../Assets/image/sample.svg";
import star from "../../Assets/image/icons/blue-star.png";
import footer from "../../Assets/image/bg-bottom-footer.png";
import Moment from 'moment';

export default function TemplateWindowCleaning() {

    return (
        <>
            <div className='container'>
                <div className='send-offer'>
                    <div className='maxWidthControl dashBox mb-4'>
                    <div className='row mb-3'>
                            <div className='col-sm-6'>
                                <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                                    <image xlinkHref={logo} width="250" height="94"></image>
                                </svg>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <h1>Price Offer No. <span style={{ color: "#16a6ef" }}>#12</span></h1>
                            </div>
                            <div className='col-sm-6'>
                                <p className='date'>Date: <span style={{ color: "#16a6ef" }}>{Moment().format('Y-MM-DD')}</span></p>
                            </div>
                        </div>

                        <div className='grey-bd'>
                            <p>In Honor Of: <span style={{ color: "#3da7ef", fontWeight: "700" }}>{"John Doe"}</span> </p>
                            <p>Company Name: <span>Broom Service</span> </p>
                            <p>Address: <span>Saurabh Vihar, Jaitpur, New Delhi, Delhi, India , 2nd , 12, New Delhi</span></p>
                        </div>
                        <div className='abt'>
                            <h2>About us</h2>
                            <p>Broom Service was founder by Lidor Mamou on 2013 The company employs a team of professionals in a wide variety of house cleaning and maintenance jobs. Our staff are regular and experienced employees Our staff are regular and experienced employees who receive a fair and proper reward and all the beneﬁts they receive according to the law Our clients are accustomed and well acquainted with the high standard of service used in the best luxury and boutique hotels in Israel and worldwide and we strive to meet this high quality standard. Our customer satisfaction, high level of service, attention to detail and personal attitude are the foundations on which we base our services.
                                The company is registered as a legal cleaning company in the Ministry of Industry. License number: 4569 </p>
                        </div>
                        <div className='we-have'>
                            <h3>What Do We Have To Offer?</h3>
                            <div className='shift-20'>
                                
                                <h4 className='mt-4'>1. Cleaning Inside And Outside Windows At Any Height:</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Professional cleaning of windows, blinds, rails, frames on a regular basis or on demand.</li>
                                    <li><img src={star} /> Cleaning all types of windows at all heights. </li>
                                    <li><img src={star} /> Nano coating option after cleaning the windows for clean windows over time.</li>
                                    <li><img src={star} /> Use of advanced cleaning materials and equipment at our expense.</li>
                                    <li><img src={star} /> Cleaning in rappelling by a professional team.</li>
                                </ul>
                                <h4 className='mt-4'>2. Laundry Services, Fabric Cleaning And Upholstery:</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Pick up on order day and return up to 48 hours</li>
                                    <li><img src={star} /> Laundry services </li>
                                    <li><img src={star} /> Dry Cleaning</li>
                                    <li><img src={star} /> Ironing services</li>
                                    <li><img src={star} /> Cleaning of sofas, carpets and curtains</li>
                                </ul>
                            </div>
                            <div className='services'>
                                <h3 class="card-title">Price Summary</h3>
                                <div className="table-responsive">
                                    <table class="table table-sm table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}>Service Name</th>
                                                <th style={{ width: "20%" }}>Type</th>
                                                <th style={{ width: "22%" }}>Frequency of Services</th>
                                                <th style={{ width: "16%" }}>Job Hours</th>
                                                <th>Hourly Rate</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Window Cleaning</td>
                                                <td>Hourly</td>
                                                <td>Once Time week</td>
                                                <td>2 hours</td>
                                                <td>20 ILS</td>
                                                <td>40 ILS</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <h3 className='mt-4'>Our Services Here, And On Our Website: <a href='https://www.broomservice.co.il' target='_blank'>www.broomservice.co.il</a></h3>
                            <div className='shift-20'>
                                <h4 className='mt-4'>1. Polishing & Renovating Floors & Surfaces:</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Floor polishing services of all kinds</li>
                                    <li><img src={star} /> Polishing and crystal polishing </li>
                                    <li><img src={star} /> Renew and renovation of old and damaged tiles </li>
                                    <li><img src={star} /> Riﬂe, opening slots, ﬁlling holes</li>
                                    <li><img src={star} /> Remove stains </li>
                                    <li><img src={star} /> Renovation of stairwells </li>
                                    <li><img src={star} /> Fine polishing and lubrication and wood surfaces</li>
                                    <li><img src={star} /> Renovation of wooden furniture, of all kinds </li>
                                </ul>
                                <h4 className='mt-4'>2. Professional Cabinet Organization / Packing & Unpacking Services.</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Creating maximum order and organization.</li>
                                    <li><img src={star} /> Sorting your items in a professional way to maximize your storage space </li>
                                    <li><img src={star} /> Re-storage using creative storage solutions that preserve order over time. </li>
                                    <li><img src={star} /> Professional and agile arrangement, sorting clothes by seasons etc.</li>
                                    <li><img src={star} /> Professional packing before moving</li>
                                    <li><img src={star} /> Unpacking the contents and arranging cabinets after passage </li>
                                </ul>
                                <h4 className='mt-4'>3. Home Accommodation Services:</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Basic or deep cleaning before - after or while hosting at your home</li>
                                    <li><img src={star} /> Waiters to serve your guests</li>
                                    <li><img src={star} /> Chef for small and large events</li>
                                    <li><img src={star} /> Help with cutting and preparing groceries</li>
                                </ul>
                                <h4 className='mt-4'>4. One-time Cleaning Service Afer Renovation / Pre-occupation / Passover Cleaning And Holidays</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> One-time general cleaning services - moving to a new apartment? Planning a renovation? Passover in the doorway? we are here!</li>
                                    <li><img src={star} /> Cleaning services at various levels tailored to you and your needs </li>
                                    <li><img src={star} /> Service by legally insured professional workers </li>
                                    <li><img src={star} /> Detergents and the most advanced equipment at our expense - without acids and dangerous </li>
                                    <li><img src={star} /> A supervisor who will make sure that the work is to your satisfaction and up to our standards</li>
                                </ul>
                                <h4 className='mt-4'>5. Full Moving Services From The Packaging Stage To The Coffee With The New Neighbors</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> Deep general cleaning services before moving</li>
                                    <li><img src={star} /> Cleaning windows at any height (even in rappelling)</li>
                                    <li><img src={star} /> Polishing and renovating all types of ﬂoors and wood (including renovation of parquet, deck and furniture renewal of all types)</li>
                                    <li><img src={star} /> Packaging and sorting services from the old house (including crates and packaging products) </li>
                                    <li><img src={star} /> Freight services including dismantling assembly and warranty from the cutting plant (possibility of crane service at any height) Polishing and polishing</li>
                                    <li><img src={star} /> Storage services for crates and furniture until the move</li>
                                    <li><img src={star} /> Professional unpacking and arranging services in your home cabinets</li>
                                    <li><img src={star} /> Handyman services: installations, hangings, electrical work of the highest and most professional level</li>
                                    <li><img src={star} /> Pest control services: license by the Ministry of Health</li>
                                </ul>
                                <h4 className='mt-4'>6. Short-term Service Asset Management Quietly:</h4>
                                <ul className='list-unstyled'>
                                    <li><img src={star} /> we offer short term airbnb services through Bell boy app for more details and registration:</li>
                                    <li><img src={star} /> <a href='https://www.bell-boy.com/' target='_blank'>https://www.bell-boy.com/</a> </li>
                                </ul>
                            </div>
                        </div>
                        <footer className='mt-4'>
                            <img src={footer} className='img-fluid' alt='Footer' />
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}
