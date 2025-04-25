const contactUsTemplate = ( firstName, lastName, email, phone, message ) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Us Submission</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 20px;
      }
      h2 {
        color: #2c3e50;
      }
      .details {
        margin-top: 20px;
        padding: 15px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .details p {
        margin: 5px 0;
      }
      .footer {
        margin-top: 20px;
        font-size: 0.9em;
        color: #555;
      }
    </style>
  </head>
  <body>
    <h2>New Contact Us Submission</h2>
    <p>Hello Admin,</p>
    <p>You have received a new message from the <strong>StudyNotion</strong> website.</p>
  
    <div class="details">
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  
    <p class="footer">
      This email was generated automatically by the StudyNotion website. Please do not reply to this email directly.
    </p>
  </body>
  </html>`;
  };
  
module.exports=contactUsTemplate;