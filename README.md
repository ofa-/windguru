OFA's Windguru
==============

OFA's windguru is a rewrap of windguru.cz weather forecast web-site
as an offline webapp for iPhone.

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
``<website>/spot.html?<spot id>|<spot name>``


The menu screen buttons bring up individual spots forecast screens.  Clicking 
elsewhere on the background of the menu screen cycles through menu layers.
Clicking at the bottom of the menu screen brings up the settings screen,
allowing to set language preferences.

Spots forecasts are shown by default using a modified version of the fabulous
svg graph that is provided by windguru.cz.  The classic windguru tabular view
is available as well, with or without legend, by clicking the middle of the
screen to cicle through views.

The spot forecast screen has two other active zones.  Clicking at the top of
the screen sets the default view and spot to the current view.  Clicking at the
left of the screen takes back to the menu screen.


Browers compat
--------------

The webapp works on most modern browsers, provided svg and local storage
are soported.

Android mobile-device users, please use a browser that has svg support;
that is, use a non-default browser.


How and when forecasts are fetched
----------------------------------

Given a windguru.cz spot, referenced by its spot id, the webapp fetches
weather forecast info direcly from windguru.cz through data.php, builds views
and tweaks the display to a simpler and enhanced form, and finally presents the
spot forecast in a compact, touch-screen friendly view.  Forecast data is
cached using local storage, allowing for server bandwidth saving, faster
re-load, and offline viewing.  Forecast is refreshed if cached data is older
than six hours - that is, windguru.cz update frequency.

