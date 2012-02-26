OFA's Windguru
==============

OFA's windguru is a rewrap of windguru.cz weather forecast web-site
as an offline webapp for iPhone.

This project provides two flavours of the same feat:

* a "dynamic" webapp, suitable for websites with PHP remote file fetch enabled
* a "static" site uploader - deamon uploads - for those with restricted PHP

The "dynamic" and "static" flavours are located in directories ``webapp``
and ``uploader`` respectively.  They unfortunately do not share code,
but are essentially the same, and offer similar user experience.


The default view for a spot forecast is a modified version of the
beautiful svg graph provided by windguru.cz.  The classic tabular view
is available as well, just click on the graph to cicle through views.

Android mobile-device users, please use a browser that has support for
for svg; that is, use a non-default browser.

The webapp homepage shows a menu of pre-configured spots.  The menu supports
several layers - or screens - allowing to group spots by categories.  Specific
individual spots can be accessed directly using the following url:
spot.html?<spot id>|<spot name>

For a given windguru.cz spot, referenced by its spot id, the webapp fetches
weather forecast info through data.php, tweaks the display, and presents
the spot forecast in a compact, touch-screen friendly view.  Forecast data
are cached using local storage, for server bandwidth saving, faster re-load,
and offline viewing.  Forecast is refreshed if cached data is older than
six hours - this is windguru.cz update frequency.

