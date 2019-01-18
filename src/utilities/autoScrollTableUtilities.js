import $ from "jquery";

// This is a set of small functions to help construct and start a auto-scrolling table
// Here's the structure that I expect to encounter.
// The auto-scrolling table is inside a CSS3 Grid element, so starting from the top
// <div grid-element>                            (allows item to span multiple grid items)
//    <div class="dataCard item">                ()
//       <div class="fullCardContainer">         (added this to help with React single-div rule, doesn't do much.  Must have 100% width!)
//          <table class="headerTable"           (separate table just for column headers, so they can stay on screen)
//          <div class="bodyTableContainerDiv"   (auto-scroll applied to div, not table !)
//             <table id="uniqueTableID"         (I *could* auto-scroll this table, but then need to be display:block)
//
// Tricky part is that jquery autoscroll only works on div, not table element. And if I convert the table element
//   to display:block, then the width:40% trick to set column width doesn't work.   So, allow the table to be a table,
//   and then simply auto-scroll the surrounding div

//  ----------------------------------------------------------------------------
//  React seems pretty sharp about remembering the mid-scroll position of an element. So if you re-load a page,
//  the element might be mid-way through a scroll.  This function simply scrolls the table back to the top
//  You call it with the id attached to the table, but it actually scrolls the parent div
export function scrollToTop(uniqueCssSelector) {
    $(uniqueCssSelector)
        .parent()
        .scrollTop(0);
}
//  ----------------------------------------------------------------------------
// It's very difficult (impossible ?) to set the height of the div that defines the view into our scrolling
// So, committing a little sin here by reaching into the DOM, measuring a few surrounding elments, and then
// explicitly setting the height of the scrollable div
// This gets called once when the React component mounts, and again whenever the browser window resizes
export function setTableSizeViaJquery(scrollingTableID) {
    // Find the CSS3 grid Item for ourselves (see the expected structure described above)
    let gridItem = $(scrollingTableID)
        .parent()
        .parent()
        .parent();
    // Find the separate table which contains the columns headers (so we can subtract from the overall height)
    let headerTable = gridItem.find(".headerTable");
    // Find the div containing the table for the data (this is the item on which we'll set the height)
    let bodyTableContainerDiv = gridItem.find(".bodyTableContainerDiv");
    // Compute the desired height by tagking the gridItem height, and subtracting what's occupied by the header table
    let desiredTbodyHeight = gridItem.height() - headerTable.height() - 5;
    // console.log("New desired height for widget: ", desiredTbodyHeight);
    // Now set the height for the div (which scrolls) which contains the table of data
    bodyTableContainerDiv.height(desiredTbodyHeight);
}
//  ----------------------------------------------------------------------------
// Start the scrolling action on the div which contains the table full of data
export function initScroll(uniqueCssSelector, scrollLengthInSecs) {
    // conver seconds to milliseconds
    let scrollLengthInMS = scrollLengthInSecs * 1000;

    // Compute how much we should scroll.  There's a div that contains all the content, and a div that defines the (smaller) view
    // Compute the difference between those two (in pixels)
    let scrollDistancePixels =
        $(uniqueCssSelector).height() -
        $(uniqueCssSelector)
            .parent()
            .height();

    // via jQuery, grab the div which contains the table (see description at top)
    let scrollableDiv = $(uniqueCssSelector).parent();

    // Define a callback function to be used when auto-scroll hits the bottom
    let callbackForWhenScrollHitsBottom = function() {
        // This is the callback for when the animation finishes
        console.log("Down Scroll Done, so scrolling back to top");

        // The scrollable div (which we want to now scroll up) is the parent of the table containing the data
        let scrollableDiv = $(uniqueCssSelector).parent();
        // Now stop that scroll (isn't it already stopped ?), and then scroll back to top
        scrollableDiv.stop().animate({ scrollTop: 0 }, scrollLengthInMS, "swing", function() {
            console.log("Back at the top, so restarting scroll");
            initScroll(uniqueCssSelector, scrollLengthInSecs);
        });
    };

    // Start scroll animation on that div, here are the expected args
    // arg1: object os properties to animate  (scrollTop scrolls vertically, scrollLeft scrolls horizontally)
    // arg2: duration (millseconds ?)
    // arg3: easing function (i.e. linear or swing)
    // arg4: callback when complete
    scrollableDiv.animate(
        {
            scrollTop: scrollDistancePixels
        },
        scrollLengthInMS,
        "swing",
        callbackForWhenScrollHitsBottom
    );
}
//  ----------------------------------------------------------------------------
//  ----------------------------------------------------------------------------
//  ----------------------------------------------------------------------------
