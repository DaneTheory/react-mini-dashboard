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
1. Convert Leankit API from Leankit NodeJS agent to actual API calls via network ?
1. Use Google charts to see if they are responsive
1. Periodically update data

### Tasks To Do

1. Get the Google Graphs to consume the color theme (then merge in addGoogleChart)
1. Look at awesome react components
1. Understand inheritance vs specificity. Inherited property (color) is getting overridden by \* universal selector
1. Create a chart with real data
1. Recreate all the important charts
1. Create auto-scrolling widget for boldchat
1. Test in Edge, Safari, and Firefox
1. In Edge, sidenav (when closed) causes a scrollbar. I temporarily fixed by adding overflow-y:hidden. Likely need to improve this if there's enough content in the sidenav to actually scroll

### What I'm learning

1. Even though my initial design in React is less DRY than AngularJS, feels a lot easier to understand
1. Replaced Python API with a simple proxy using NodeJS Express. Moved all logic from backend to frontend
    1. That means backend is a simple proxy which only adds authentication on the way through
1. For View, AngularJS wasnt great at looping through an Object. Since React is just javascript, it can do it

## Widget Updating Strategies

I've tried three different strategies for period data updates for each widget.

1. Widget has it's own custom-length timer (didn't like this, as it means it would be difficult to look at a screen full of widgets, and understand when each would be updating. Also required using a reactSafe setTimemout, which in turn required each widget to be wrapped in a ReactTimeout)
1. Parent (Card Grid) has a custom-length timer, and uses React Ref to call Widget's Update Function (didn't like this solution as it means the Parent/CardGrid would have to manage alot of refs, once for each widget)
1. Parent (Card Grid) has a custom-length timer, and simply issues a PubSub event, which all widgets will listen for. PubSub is constrained to a single-process application

In all cases, I started with a javascript setTimeout() timer; however, I like displaying the remaining time before the next refresh. In the case of Javascript setTimeout(), you cannot query the remaining time. So, I ended up converting to a series of 1-second timeouts which keep track of remaining time. That gives me a hook to update the remaining timer display

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
