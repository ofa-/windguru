OFA's Windguru
==============

OFA's windguru is a webapp that wraps windguru.cz weather forecast web-site
as an offline webapp for iPhone and other mobile devices.  Individual spots
forecasts are shown in a synthetic graph view, or as tabular data.  Layered 
menus provide quick access to a selection of favorite spots.

This project provides two flavours of the same feat:

* a "dynamic" webapp, suitable for websites with PHP remote file fetch enabled
* a "static" site uploader - deamon uploads - for those with restricted PHP

The "dynamic" and "static" flavours are located in directories ``webapp/``
and ``uploader/`` respectively.  They unfortunately do not share code,
but are essentially the same, and offer similar user experience.


Using the webapp
----------------

The webapp homepage shows a menu of pre-configured spots.  The menu supports
several layers - or screens - allowing to group spots by categories.  Specific
individual spots can be accessed directly using the following url:
``<website>/spot.html?<spot id>:<spot name>``


The menu screen buttons bring up individual spots forecast screens.  Clicking 
elsewhere on the background of the menu screen cycles through menu layers.
Clicking at the bottom of the menu screen brings up the settings screen,
allowing to set language preferences.

Spots forecasts are shown as graphs by default.  The classic windguru tabular
view is available as well, with or without legend, by clicking the middle of
the screen.  Clicking again cicles through the three views.

The graph view is a simplified and slightly enhanced version of that of
windguru.cz: freeze-level information is shown in blue along with temperatures,
relative humidity and pressure information no longer appear.

The spot forecast screen has another active zone: clicking at the
left of the screen takes back to the menu screen.


Browers compat
--------------

The webapp works on most modern browsers, provided svg and local storage
are supported.

Android mobile-device users, please use a browser that has svg support,
for example opera-mobile; the default browser does not like svg.


How and when forecasts are fetched
----------------------------------

Given a windguru.cz spot, referenced by its spot id, the webapp fetches
weather forecast info direcly from windguru.cz through data.php, builds views
and tweaks the display to a simpler and enhanced form, and finally presents the
spot forecast in a compact, touch-screen friendly view.  Forecast data is
cached using local storage, allowing for server bandwidth saving, faster
re-load, and offline viewing.  Forecast is refreshed if cached data is older
than six hours - that is, windguru.cz update frequency.

