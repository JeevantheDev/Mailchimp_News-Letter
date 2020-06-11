require('dotenv');
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
               }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    
    var option = {
        url: "https://us19.api.mailchimp.com/3.0/lists/<Audience Id>",
        method: "POST",
        headers: {
            "Authorization": 'auth <API_KEY>'
        },
        body: jsonData
    };
    request(option, function(error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/faliure.html");
        }else {
            if (response.statusCode ===200) {
                res.sendFile(__dirname + "/success.html");
            }else {
                res.sendFile(__dirname + "/faliure.html");
            }
        }
    });

});

app.post("/faliure", function(req,res) {
    res.redirect("/");
});


app.listen(3000, function() {
    console.log("server started");
});
