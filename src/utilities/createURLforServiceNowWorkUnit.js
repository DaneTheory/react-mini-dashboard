export function createURLforServiceNowWorkUnit(sn_instance, sys_id) {
    // # Construct URL for Work Unit (parent), example of link that we need to create
    // https://jnjprod.service-now.com/nav_to.do?uri=rm_enhancement.do?sys_id=85abbe8adb7c7b48d1cbdb41ca9619ca&sysparm_view=sdlc
    let rootURL = `https://${sn_instance}`;
    rootURL = rootURL.replace("jnjprodworker", "jnjprod");
    let restURL = `/nav_to.do?uri=rm_enhancement.do?sys_id=${sys_id}&sysparm_view=sdlc`;
    return rootURL + restURL;
}
