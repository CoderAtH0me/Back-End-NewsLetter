const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { log } = require("console");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userEmail = req.body.userEmail;

  const data = {
    members: [
      {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "bill:22150672e7e9f59b31c3046a5cfe1b09-us8",
  };

  const url = "https://us8.api.mailchimp.com/3.0/lists/1d2dcb5aee";

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on("data", (data) => {
      JSON.parse(data);
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//22150672e7e9f59b31c3046a5cfe1b09-us8

//1d2dcb5aee
