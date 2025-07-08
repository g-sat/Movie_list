Of course. Providing a complete and clear README.md is essential for any good project. I will provide a comprehensive file that includes detailed installation instructions for both Docker and the manual method, followed by the rest of the guide for setting up and running your application.

Here is the complete README.md file.

Node.js & Keycloak Authentication Demo

This project is a practical demonstration of how to secure a Node.js (Express) web application using Keycloak for Identity and Access Management (IAM). It externalizes all user authentication logic to Keycloak, providing a robust, secure, and feature-rich login system.

This guide covers the entire setup process, from running Keycloak to configuring the Node.js application and implementing all the essential authentication flows.

Features

Secure User Login: Authentication is handled entirely by Keycloak.

User Registration: A seamless sign-up flow that redirects new users to the login process.

Session Management: Uses express-session to maintain user sessions securely.

Protected Routes: Demonstrates how to protect specific routes so they are only accessible to authenticated users.

Secure Logout: A two-step process that clears both the local application session and the master Keycloak session.

Forgot Password: A fully functional password reset flow, delegated to Keycloak.

Technology Stack

Keycloak – Identity and Access Management (IAM) server.

Node.js – Backend runtime for the web application.

Express.js – Web framework used for building the server.

Docker & Docker Compose – For running the Keycloak server easily.

express-session – Middleware for managing user sessions.

keycloak-connect – The official middleware to connect Express with Keycloak.

Prerequisites

Before you begin, ensure you have the following installed on your system:

Node.js and npm: (v16.x or later recommended)

Docker and Docker Compose: Install Docker (only required for the Docker installation method).

Java JDK 17+: (only required for the manual installation method).

Part 1: Keycloak Server Installation

Choose one of the following methods to run the Keycloak server. The Docker method is recommended for its simplicity.

Method 1: Installation using Docker (Recommended)

This is the easiest and most reliable way to run Keycloak for development.

1. Create a docker-compose.yml File

In the root directory of your project, create a file named docker-compose.yml and add the following:

Generated yaml
version: '3.8'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: keycloak-demo
    command: start-dev
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
    ports:
      - "8080:8080"
    volumes:
      - keycloak_data:/opt/keycloak/data

volumes:
  keycloak_data:


2. Start the Keycloak Server

Open a terminal in the same directory and run:

Generated bash
docker-compose up -d
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

This will download the Keycloak image and start the server in the background.

3. Access Keycloak

Wait about a minute, then navigate to http://localhost:8080. Log in to the Administration Console with username admin and password admin.

Method 2: Manual Installation (Standalone Server)

Use this method if you prefer not to use Docker.

1. Download Keycloak

Go to the official Keycloak downloads page and download the latest server distribution (.zip or .tar.gz).

2. Unzip the File

Extract the contents to a location of your choice.

3. Start the Server

Open a terminal, navigate into the extracted keycloak-XX.X.X/bin directory, and run the start command for your OS:

macOS / Linux:

Generated bash
./kc.sh start-dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Windows:

Generated bash
kc.bat start-dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

4. Create the Initial Admin User

The first time you run Keycloak manually, you must create an admin user.

Keep the server running and open your browser to http://localhost:8080.

You will be prompted to create an admin user. Enter a username and password (e.g., admin / admin).

Log in to the Administration Console with the credentials you just created.

Part 2: Keycloak Configuration

After installing and logging into Keycloak, you need to configure it to work with our Node.js app.

Create a New Realm:

In the top-left corner, hover over the "master" realm and click Create Realm.

Enter express-app as the Realm name and click Create.

Create a New Client:

Ensure you are in the express-app realm.

Go to Clients > Create client.

Set the Client ID to express-app and click Next.

Turn ON the "Client authentication" switch and click Save.

Configure Client Settings:

On the client's settings page, under Access settings, set the following:

Valid Redirect URIs: http://localhost:3000/*

Valid Post Logout Redirect URIs: http://localhost:3000

Web Origins: http://localhost:3000

Click Save.

Get the Client Secret:

Go to the Credentials tab.

Copy the Client secret. You will need this for the Node.js application.

Enable Realm Features:

Go to Realm Settings > Login.

Turn ON both User registration and Forgot password.

Go to the Email tab and configure your SMTP server settings so Keycloak can send emails. Without this, the "Forgot Password" feature will not work.

Part 3: Node.js Application Setup

Clone the Repository and Install Dependencies:

Generated bash
# git clone <your-repo-url>
# cd <your-project-directory>
npm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Update the Client Secret:

Open your main server file (e.g., app.js).

Find the keycloakConfig object and paste the Client secret you copied from Keycloak into the secret field.

Generated javascript
const keycloakConfig = {
  // ... other settings
  "credentials": {
    "secret": "PASTE_YOUR_CLIENT_SECRET_HERE"
  },
  // ...
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END
Part 4: Running the Application

Start the Node.js server:

Generated bash
node app.js
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Access the application:
Open your web browser and navigate to http://localhost:3000.

You can now test all the features: signing up as a new user, logging in, viewing the protected dashboard, and logging out.

How It Works: The Authentication Flows

Login: When you click "Login", you are sent to /login. The keycloak.protect() middleware intercepts this, redirects you to Keycloak's login page, and upon successful authentication, sends you back. Our code then performs the final redirect to https://familyshare.in/.

Sign Up: The /signup route constructs a URL to Keycloak's registration page. We cleverly set the redirect_uri to point back to our /login flow, creating a seamless experience for new users.

Logout: The /logout route first destroys the local application session cookie. Then, it redirects to Keycloak's logout endpoint to terminate the master Single Sign-On (SSO) session, ensuring a complete logout.

Protected Routes: Any route wrapped with keycloak.protect() (like /dashboard) will automatically trigger the login flow if the user is not authenticated, and will grant access if they are.
