export function determineOSAndBrowserExternal(user_agent) {
  // Default names if we can't figure out the browser and OS
  let browserName = "BrwsUnkn";
  let osName = "OSUnkn";

  // New Data (Jan 2019)
  // Chrome 71.0.3578.98 on Windows 10
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98
  // Edge on Windows 10
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.11
  // Firefox 64.0 on Windows 10
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0

  // My Original Data
  // Safari:
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0
  // Chrome on MacOS X?
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2
  // Edge on Win10:
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79
  // Firefox on Win7:
  // Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0
  // Chrome on Nougat (Android):
  // Mozilla/5.0 (Linux; Android 7.0; SAMSUNG-SM-G935A Build/NRD90M) AppleWebKit/537.36 (KHTML, like Geck

  // Here's what Native Mobile App v 3.0.0 on Samsung Galaxy S7 Edge
  // ServiceNow/3.0.0-45 (Android 24; Samsung SAMSUNG-SM-G935A)

  // Here's what Native Mobile App v 5.0 on iPhone iOS 10.3.2
  // ServiceNow/5.0 (iPhone; iOS 10.3.2; Scale/2.00)

  // Determine browser
  if (user_agent.includes("Macintosh") && !user_agent.includes("Chrome")) {
    browserName = "Safari";
  } else if (user_agent.includes("ServiceNow") && user_agent.includes("Android")) {
    browserName = "NativeMobile (Android)";
  } else if (user_agent.includes("ServiceNow") && user_agent.includes("iPhone iOS")) {
    browserName = "NativeMobile (iOS)";
  } else if (user_agent.includes("Pingdom")) {
    browserName = "Pingdom-bot";
  } else if (user_agent.includes("internal_soap_client")) {
    browserName = "Internal-Soap";
  }
  // Poor test of "Edge", was incorrectly claiming Chrome sessions as Edge.
  // Pretty sure we cant detect Edge anymore, unless we assume older version of Chrome are Edge (<60)
  // else if (user_agent.includes("Windows NT 10.0") && user_agent.includes("AppleWebKit")) {
  //   browserName = "Edge";
  // }
  else if (user_agent.includes("AppleWebKit") && user_agent.includes("Android")) {
    browserName = "Chrome (Android)";
  } else if (user_agent.includes("Trident/7.0")) {
    browserName = "IE11";
  } else if (user_agent.includes("Firefox")) {
    browserName = "Firefox";
  } else if (user_agent.includes("Chrome")) {
    browserName = "Chrome";
  }

  // Try to get Chrome versoin
  let chromeVersion = user_agent.match(" Chrome/[0-9][0-9][.0-9]*");
  let chromeMajorVersion;
  if (chromeVersion) {
    chromeVersion = chromeVersion[0];
    // Looking for substring like this " Chrome/71.0.3578.98", extract "71" from that
    chromeMajorVersion = chromeVersion
      .match(/[0-9]+./)[0]
      .replace(/^\//, "")
      .replace(/\.$/, "");
  }

  // Edge seems to use older chrome versions
  if (browserName === "Chrome") {
    if (chromeVersion && chromeMajorVersion < 60) {
      browserName = "Chrome(Old)/Edge?";
    }
  }

  // Look for well-known OS's in user_agent string
  if (user_agent.includes("Windows NT 6.1")) {
    osName = "Win7";
  } else if (user_agent.includes("Windows NT 6.3")) {
    osName = "Win8";
  } else if (user_agent.includes("Windows NT 10.0")) {
    osName = "Win10";
  } else if (user_agent.includes("Mac OS")) {
    osName = "MacOS";
  } else if (user_agent.includes("Android")) {
    osName = "Android";
  }
  return [browserName, osName];
}
