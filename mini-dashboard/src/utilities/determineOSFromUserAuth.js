export function determineOSFromUserAuth(user_agent) {
  // Default names if we can't figure out the browser and OS
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
  return osName;
}
