## Deployment Instructions

### Create a host

-   Launch a new Redhat (RHEL) Instance (Currently tested on RHEL7 2018 Q2)
    -   Select t2.large
    -   Add tags (Environment and Application)
    -   Select a security group (Default, Web, and Database)
    -   Define IAM Role
    -   Launch (without keys)

### Prep for React Dashboard

-   yum install httpd git vim
-   useradd dashboard-api-proxy
-   useradd dashboard-react
-   curl -sL https://rpm.nodesource.com/setup_10.x | bash -
-   yum install -y nodejs

### Deploy React Dashboard

-   vim /etc/systemd/system/dashboard-react.service

```
[Unit]
Description=Node.js React Dashboard Application

[Service]
ExecStart=/bin/node /var/www/nodejs/dashboard-react/server.js
# Required on some systems
#WorkingDirectory=/opt/nodeserver
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=react-dashboard
User=dashboard-react
#Group=<alternate group>
Environment=NODE_ENV=production PORT=5439

[Install]
WantedBy=multi-user.target
```

-   systemctl enable dashboard-react.service
-   systemctl daemon-reload
-   systemctl restart dashboard-react
-   Deploy the actual app
    -   cd /var/www
    -   mkdir nodejs
    -   cd nodejs
    -   mkdir dashboard-react
    -   cd dashboard-react
    -   git clone https://github.com/cburkins/react-mini-dashboard.git .
    -   Create .env file -
    -   ./deploy.sh

### Deploy API Gateway

1. Log into host
1. sudo su -
1. cd /var/www
1. mkdir dashboard-api-proxy; cd dashboard-api-proxy
1. git clone https://github.com/cburkins/nodejs-express-gateway.git .
1. npm install
1. chown -R dashboard-api-proxy .
1. vim /etc/systemd/system/dashboard-api-proxy.service

```
[Unit]
Description=Node.js Example Server

[Service]
ExecStart=/bin/node /var/www/nodejs/dashboard-api-proxy/server.js
# Required on some systems
# WorkingDirectory=/opt/nodeserver
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodejs-example
User=dashboard-api-proxy
#Group=<alternate group>
Environment=NODE_ENV=production PORT=1521

[Install]
WantedBy=multi-user.target
```

1. systemctl enable dashboard-api-proxy.service
1. systemctl daemon-reload
1. systemctl restart dashboard-api-proxy
1. Create config files
    1. As each API has a slightly different authentication mechanism, each config file is slightly different
    1. Here's an example of the ServiceNow configuration file

```
{
    "jnjsandbox.service-now.com": {
        "Description": "OAuth Credentials for user irs-dashboard, will require extra call to get access_token",
        "Authentication": {
            "client_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "client_secret": "yyyyyyyyyy",
            "username": "service-account-user",
            "password": "zzzzzzzzzzzzz"
        }
    },
    "jnjprodworker.service-now.com": {
        "Description": "OAuth Credentials for user irs-dashboard, will require extra call to get access_token",
        "Authentication": {
            "client_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "client_secret": "yyyyyyyyyy",
            "username": "service-account-user",
            "password": "zzzzzzzzzzzzz"
        }
    }
}
```

### History: Differences between the AngularJS and React Dashboard

1. Installed Semantic UI via CDN (link is specific to version)
1. Create a node.js API proxy with embedded credentials
1. Create a better UI for positioning the card
1. Moved the backend API for BoldChat from Python/Flask to Node/Express
1. Use OAuth to call ServiceNow (in API Proxy)
1. Deployed both react-app and express api to RHEL server (both are served with Express)
1. Cacheed the API requests (using express-cache-on-demand)
1. Create a chart with dummy data
1. Use mixin's within Sass
1. In ChartJS, chart is honoring grid cell size, so it shrinks and expands itself, unsure about !important override
1. Solved !important override. That indeed is one solution, the other is that the div for the canvas need to be a direct child of the grid element/div. Otherwise, the intermediary div won't stretch to be 100% of height
1. Tested in Chrome, Safari, Firefox, and Edge. They all work. IE11 doesnt
1. Convert Leankit API from Leankit NodeJS agent to actual API calls via network ?
1. Use Google charts to see if they are responsive
1. Periodically update data
1. Get the Google Graphs to consume the color theme (then merge in addGoogleChart)

### History: What I'm learning

1. Even though my initial design in React is less DRY than AngularJS, feels a lot easier to understand
1. Replaced Python API with a simple proxy using NodeJS Express. Moved all logic from backend to frontend
    1. That means backend is a simple proxy which only adds authentication on the way through
1. For View, AngularJS wasnt great at looping through an Object. Since React is just javascript, it can do it

### History: Widget Updating Strategies

I've tried three different strategies for period data updates for each widget.

1. Widget has it's own custom-length timer (didn't like this, as it means it would be difficult to look at a screen full of widgets, and understand when each would be updating. Also required using a reactSafe setTimemout, which in turn required each widget to be wrapped in a ReactTimeout)
1. Parent (Card Grid) has a custom-length timer, and uses React Ref to call Widget's Update Function (didn't like this solution as it means the Parent/CardGrid would have to manage alot of refs, once for each widget)
1. Parent (Card Grid) has a custom-length timer, and simply issues a PubSub event, which all widgets will listen for. PubSub is constrained to a single-process application

In all cases, I started with a javascript setTimeout() timer; however, I like displaying the remaining time before the next refresh. In the case of Javascript setTimeout(), you cannot query the remaining time. So, I ended up converting to a series of 1-second timeouts which keep track of remaining time. That gives me a hook to update the remaining timer display
