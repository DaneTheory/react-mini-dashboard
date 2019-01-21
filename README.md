### Tasks Completed

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

### Tasks To Do

1. In test deployment on AWS host, cannot reload non-home pages
1. In API, api.boldchat.com is hard-coded, yikes !
1. Understand inheritance vs specificity. Inherited property (color) is getting overridden by \* universal selector
1. Convert Leankit API from Leankit NodeJS agent to actual API calls via network ?
1. Periodically update data
1. Create a chart with real data
1. Get rid of PropTypes because that doesn't exist in Built website
1. Recreate all the important charts
1. Create auto-scrolling widget for boldchat
1. Test in Edge, Safari, and Firefox

### What I'm learning

1. Even though my initial design in React is less DRY than AngularJS, feels a lot easier to understand
1. Replaced Python API with a simple proxy using NodeJS Express. Moved all logic from backend to frontend
    1. That means backend is a simple proxy which only adds authentication on the way through
1. For View, AngularJS wasnt great at looping through an Object. Since React is just javascript, it can do it

## Stock creat-react-app README.md below this line

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
