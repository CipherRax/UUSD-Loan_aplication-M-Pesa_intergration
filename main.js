require('dotenv').config({
    path: __dirname + '/.env',
})
const express = require('express');
const {createClient} = require("@supabase/supabase-js");
// const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Initialize Supabase
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_ANON_KEY
)


app.get('/api/test', (req, res) => {
    res.send('test this endpoint!! Nice it works');
})

app.post('/ussd', async (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';
    let testArray = text.split('*');
//==========MAIN MENU===================
    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON Welcome to Fintech
        1. Login
        2. Create an account`;
        //===========LOGIC FLOW OPTION 1===============
    } else if (text == '1') {
        response = `CON Enter ID number to Login`;

    } else if (testArray[0] === '1' && testArray.length === 2) {
        response = `CON Enter Password`;
    } else if (testArray[0] === '1' && testArray.length === 3) {
        //verification from db
        const password = testArray[2];
        const idNumber = testArray[1]
        //fetch users
        const {data, error} = await supabase
            .from("users")
            .select('*')
            .eq('id_number', idNumber)
            .eq('password', password)
            .single()
        if (error || !data) {
            response = `END ERROR: Invalid credentials`;
        } else {
            response = `CON How can we Help today?
            1. Request For Loan
            2. Pay Loan Balance
            3. Get Loan Balance`
        }
        //==option 1==> request for loan

    } else if (testArray[0] === '1' && testArray.length === 4) {
        const choice = testArray[3]
        if (choice === '1') {
            response = `CON Enter amount 1-100,000`
        } else if (choice === '2') {
            response = 'CON Enter payment type?\n1. Full \n2. Partial'
        } else if (choice === '3') {
            const idNumber = testArray[1]
            const {balance, error} = await supabase
                .from("users_loan_data")
                .select("loaned_amount")
                .eq('id_number', idNumber)
            const total = balance.reduce((sum, item) => sum + item.loaned_amount, 0)
            response = error ? `END ERROR: ${error.message}` : `END Your balance is ${total}`
        }
        else {
            response = `END Invalid options !`
        }
    } else if (testArray[0] === '1' && testArray.length === 5) {
        const choice = testArray[3]

        //=======
        //==Request for loan choice
        //=======
        if (choice === '1') {
            if (testArray.length === 5) {

                const amount = parseInt(testArray[4]);
                if (isNaN(amount) || amount > 100000 || amount < 1) {
                    response = `END Invalid amount should be 1-100,000`;
                } else {
                    response = `CON Confirm Loan of KES ${amount} ?\n1. Yes\n2. No`;
                }

            } else if (testArray.length === 6) {
                if (testArray[5] === '1') {
                    response = `CON Enter Phone number to get the loan to`
                } else {
                    response = `END You have canceled the request`
                }
            } else if (testArray.length === 7) {
                const phoneNumber = parseInt(testArray[6]);
                const amount = parseInt(testArray[4]);
                const user_id = parseInt(testArray[1]);
                const { error } = await supabase
                    .from("users_loan_data")
                    .insert([{
                        phone_no: phoneNumber,
                        id_number: user_id,
                        loaned_amount: amount,
                    }])

                response = error ? `END ERROR: ${error.message}` : `END Application Successful! You will receive a verification for M-Pesa`;
            }
        }
        //==============
        //OPTION 2: PAY LOAN
        //====================
        else if (choice === '2') {
            if (testArray.length === 5) {
                const payType = testArray[4];
                if (payType === '1') {
                    response = `CON Confirm full payment\n1. Yes\n2. No`;
                } else if (payType === '2') {
                    response = `CON Enter amount to pay`;
                } else {
                    response = `END Invalid options !`
                }
            } else if (testArray.length === 6) {
                const  payType = testArray[4];
                const choice = testArray[5];
                if (payType === '1' && choice === '1') {
                    response = `CON Enter phone number`;
                } else if (payType === '2') {
                    response = `CON Enter phone number`;
                } else {
                    response = `END You have canceled the request`
                }
            } else if (testArray.length === 7) {
                const phoneNumber = parseInt(testArray[6]);

                response = `END You will receive a verification for M-Pesa for ${phoneNumber}`;
            }
        }
    }
    //===========LOGIC FLOW OPTION 2===============
    else if (text == '2') {

        response = `CON Enter ID number for registration`;
    } else if (testArray[0] === '2' && testArray.length === 2) {
        //save to db
        response = `CON Create password`;
    } else if (testArray[0] === '2' && testArray.length === 3) {
        // const password = ;

        //save to supabase
        const  { error } = await supabase
            .from("users")
            .insert([{
                id_number: testArray[1],
                password: testArray[2]
            }])

        response = error ? `END Error: ${error.message}` : `END Your account has been registered successfully`;
    } else {
        response = `END Invalid Input`
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});

app.listen(3000, ()=> console.log("Server started on port 3000 "));