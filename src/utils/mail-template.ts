const HTML_TEMPLATE = (text: string) => {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
          }
          .email {
            width: 100%;
            margin: 0 auto;
            padding: 20px;
          }
          .email-header {
              border-bottom: 2px solid #87E6BD;
            color: #6BB695;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>Account verification</h1>
            </div>
            <div class="email-body">
              <div>${text}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
};

export default HTML_TEMPLATE;
