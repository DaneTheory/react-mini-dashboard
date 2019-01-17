import $ from "jquery";

//  ----------------------------------------------------------------------------
export function scrollToTop(uniqueCssSelector) {
    $(uniqueCssSelector)
        .parent()
        .scrollTop(0);
}
//  ----------------------------------------------------------------------------
export function setTableSizeViaJquery(scrollingTableID) {
    let gridItem = $(scrollingTableID)
        .parent()
        .parent()
        .parent();
    let headerTable = gridItem.find(".headerTable");
    let bodyTableContainerDiv = gridItem.find(".bodyTableContainerDiv");
    let desiredTbodyHeight = gridItem.height() - headerTable.height() - 5;
    // console.log("New desired height for widget: ", desiredTbodyHeight);
    bodyTableContainerDiv.height(desiredTbodyHeight);
}
//  ----------------------------------------------------------------------------
export function initScroll(uniqueCssSelector, scrollLengthInSecs) {
    let scrollLengthInMS = scrollLengthInSecs * 1000;

    // Compute how much we should scroll.  There's a div that contains all the content, and a div that defines the (smaller) view
    // Compute the difference between those two (in pixels)
    let scrollDistancePixels =
        $(uniqueCssSelector).height() -
        $(uniqueCssSelector)
            .parent()
            .height();

    // via jQuery, grab the element, and animate it
    $(uniqueCssSelector)
        .parent()
        // Start scroll animation
        // arg1: object os properties to animate
        // arg2: duration (millseconds ?)
        // arg3: easing function (e.g. linear, swing)
        // arg4: callback when complete
        .animate(
            {
                scrollTop: scrollDistancePixels
            },
            scrollLengthInMS,
            "linear",
            function() {
                // This is the callback for when the animation finishes
                console.log("Down Scroll Done");

                $(uniqueCssSelector)
                    .parent()
                    .stop()
                    .animate({ scrollTop: 0 }, scrollLengthInMS, "linear", function() {
                        console.log("Back at the top");
                    });
            }
        );
}
//  ----------------------------------------------------------------------------
//  ----------------------------------------------------------------------------
//  ----------------------------------------------------------------------------
