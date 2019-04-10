/**
 * Generate html templates for email notifications
 * @class Templates
 */
class Templates {
  /**
   * A method for creating a template for notifying users of request for resetting password
   * @param { string } link - The link to be sent to user email
   * @param { string } user - The name of the user
   * @returns { string } HTML template
   * @memberof Templates
   */
  static forgotPassword(link, user) {
    return `
    <head>
      <style>
      body {
        color: black;
        width: 100%;
      }
      .email {
        background: #F2F2F2;
        width: 100%;
        font-family: sans-serif;
        height: 100%;
      }
      .brand-name {
        width: 100%;
      }
      .brand-name h1{
        text-align: center;
        margin: 0;
        padding: 20px;
        font-size: 1.5em;
      }
      
      .message {
        background: white;
        width: 50%;
        margin: 0 auto;
        padding: 50px;
        border-top: 5px solid #0645F0;
      }
      
      .message-title {
        text-align: center;
      }
      
      .message-body p{
        font-size: 18px;
        color: black;
      }
      
      .message-body a {
        color: #89CFF0;
      }
      
      .cta {
        width: 100%;
        text-align: center;
        margin: 50px 0 50px 0;
      }
      
      .message .btn {
        padding: 1rem;
        background: #0645F0;
        display: inline-block;
        min-width: 100px;
        color: #FFF;
        outline: none;
        border: none;
        font-size: 18px;
        text-decoration: none;
      }
      </style>
    </head>
    
    <div class="email">
      <div class="brand-name">
        <h1>Authors' Haven</h1>
      </div>
      <div class="message">
        <div class="message-title">
          <h1>Reset Your Password</h1>
        </div>
        <div class="message-body">
          <p>Hello ${user},</p>
          <p>Click the button below to reset your password.</p>
          <p>If you did not request for a new password, you can safely delete this email.</p>
        <div class="cta">
          <a class="btn" href=${link}>Reset Password</a>
        </div>
        <p>If the button does not work, copy and paste the link below into your browser.</p>
        <a href=${link}>${link}</a>
        <p>Authors' Haven Team.</p>
          </div>
      </div>
    </div>
    `;
  }

  /**
   * A method for creating a template for notifying users after resetting password
   * @param { string } link - The link of the application
   * @param { string } user - The name of the user
   * @returns { string } HTML template
   * @memberof Templates
   */
  static resetPassword(link, user) {
    return `
    <head>
    <style>
    body {
      color: black;
    }
    .email {
      width: 100%;
      font-family: sans-serif;
      height: 100%;
    }
    .brand-name {
      width: 100%;
    }
    .brand-name h1{
      text-align: center;
      margin: 0;
      padding: 20px;
    }
    .message {
      background: white;
      width: 80%;
      margin: 20px auto;
      padding: 50px 80px;
      border-top: 5px solid #0645F0;
    }
    .message-body p{
      font-size: 18px;
      color: black;
    }
    
    .message-body a {
      color: #89CFF0;
    }
    </style>
  </head>
    
  <div class="email">
  <div class="brand-name">
    <h1>Authors' Haven</h1>
   </div>
  <div class="message">
    <div class="message-body">
      <p>Hello ${user},</p>
      <p>Your password reset was successful. Click this <a href=${link}>link</a> to login to your account.</p>
    
    <p>Authors' Haven Team.</p>
      </div>
  </div>
  </div>
    `;
  }

  /**
   * this method returns email confirmation
   * template
   * @static
   * @param {string} link
   * @param {srting} email
   * @returns {string} HTML template
   * @memberof Templates
   */
  static confirmEmail(link, email) {
    const user = email.split('@')[0];
    return `
    <head>
      <style>
      body {
        color: black;
        width: 100%;
      }
      .email {
        background: #F2F2F2;
        width: 100%;
        font-family: sans-serif;
        height: 100%;
      }
      .brand-name {
        width: 100%;
      }
      .brand-name h1{
        text-align: center;
        margin: 0;
        padding: 20px;
        font-size: 1.5em;
      }
      
      .message {
        background: white;
        width: 50%;
        margin: 0 auto;
        padding: 50px;
        border-top: 5px solid #0645F0;
      }
      
      .message-title {
        text-align: center;
      }
      
      .message-body p{
        font-size: 18px;
        color: black;
      }
      
      .message-body a {
        color: #89CFF0;
      }
      
      .cta {
        width: 100%;
        text-align: center;
        margin: 50px 0 50px 0;
      }
      
      .message .btn {
        padding: 1rem;
        background: #0645F0;
        display: inline-block;
        min-width: 100px;
        color: #FFF;
        outline: none;
        border: none;
        font-size: 18px;
        text-decoration: none;
      }
      </style>
    </head>
    
    <div class="email">
      <div class="brand-name">
        <h1>Authors' Haven</h1>
      </div>
      <div class="message">
        <div class="message-title">
          <h1>Please confirm your email</h1>
        </div>
        <div class="message-body">
          <p>Hello ${user},</p>
          <p>Please click the button bellow to confirm your email</p>
        <div class="cta">
          <a class="btn" href=${link}>Confirm Email</a>
        </div>
        <p>If the button does not work, please copy and paste the link below into your browser.</p>
        <a href=${link}>${link}</a>
        <p>Authors' Haven Team.</p>
          </div>
      </div>
    </div>
    `;
  }

  /**
   * This method returns template for confirmed email
 * @static
 * @param {string} link
 * @param {string} email
 * @returns {string} html template
 * @memberof Templates
 */
  static emailConfirmed(link, email) {
    const user = email.split('@')[0];
    return `
    <head>
    <style>
    body {
      color: black;
    }
    .email {
      width: 100%;
      font-family: sans-serif;
      height: 100%;
    }
    .brand-name {
      width: 100%;
    }
    .brand-name h1{
      text-align: center;
      margin: 0;
      padding: 20px;
    }
    .message {
      background: white;
      width: 80%;
      margin: 20px auto;
      padding: 50px 80px;
      border-top: 5px solid #0645F0;
    }
    .message-body p{
      font-size: 18px;
      color: black;
    }
    
    .message-body a {
      color: #89CFF0;
    }
    </style>
  </head>
    
  <div class="email">
  <div class="brand-name">
    <h1>Authors' Haven</h1>
   </div>
  <div class="message">
    <div class="message-body">
      <p>Hello ${user},</p>
      <p>You have confirmed your email.Please click on this <a href=${link}>link</a> to login to your account.</p>
    
    <p>Authors' Haven Team.</p>
      </div>
  </div>
  </div>`;
  }

  /**
   * A method for creating a template for notifying users after resetting password
   * @param { object } article - The article object to be sent
   * @param { string } url - The url of the created article
   * @param { string } authorName - The name of the author
   * @returns { string } HTML template
   * @memberof Templates
   */
  static articleNotify(article, url, authorName) {
    const {
      title, description, bannerImage
    } = article;
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <style type="text/css">
          .email {
        background: #F2F2F2;
        width: 100%;
        font-family: 'Roboto', sans-serif;
        color: #000000;
        height: 100%;
        border : solid
        }
      
        .brand-name h1{
          text-align: center;
          margin: 0;
          padding: 20px;
        }
      
        .message {
          background: white;
          width: 50%;
          margin: 0 auto;
          padding: 50px;
          border-top: 5px solid #0645F0;
        }
      
        .message-title {
          text-align: center;
        }
        
        .message-body p{
          font-size: 18px;
        }
        
        .message-body a {
          color: #89CFF0;
        }
        
        .unsubscribe p{
          font-size: 12px;
        }
        
        .article-snippet {
          margin-bottom: 10px;
        }
        
        .article-title {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email">
    <div class="brand-name">
      <h1>Authors' Haven</h1>
     </div>
    <div class="message">
      <div class="message-title">
        <h1>New Article Alert</h1>
      </div>
      <div class="message-body">
        <p>Hello,</p>
        <p>New Post! ${authorName === null ? 'One of your favorite authors' : authorName} has just published a new article.</p>
        <div class="article">
          <img height="200" width="200" src=${bannerImage} alt="article image"/>
          <div class="article-title"><p>${title}</p></div>
          <div class="article-snippet"><p>${description}</p></div>
          <p>You can view the article by clicking <a href="${url}">${url}</a>.</p>
          <div class="unsubscribe">
            <p>If you are no longer interested in receiving notifications for new articles, kindly change the settings on your dashboard</p>
          </div>
        </div>
      
        </div>
      <p>Authors' Haven Team</p>
    </div>
    </div>
    </body>
    </html>    
    `;
  }
}

export default Templates;
