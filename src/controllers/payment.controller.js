import axios from 'axios';
import {PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET, HOST} from '../config.js';

export const createOrder = async (req, res) => {
    try{
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: '105.70'
                    },
                    description: 'Teclado de computadora',
                },
            ],
            application_context: {
                brand_name: "myCMSebastian",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `${HOST}/capture-order`,
                cancel_url: `${HOST}/cancel-order`,
            }
        };
    
        const params = new URLSearchParams()
        params.append("grant_type", "client_credentials")
    
        const {data: { access_token }} = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            }
        });
    
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
    
        res.json(response.data)

    }catch(error){
        return res.status(500).send('Something goes wrong');
    }
}

export const captureOrder = async (req, res) => {

    const {token} = req.query;

    await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET,
        }
    });
    return res.redirect('/payed.html');
}

export const cancelOrder = (req, res) => {
    res.send('creating-order');
}