# i-need-space

This project was one of the first for interacting with third party API's using JS fetch api and .then. 
Below is an example of the project in action.   

<img src="satellite-finder.gif"/>


In this assignment you'll be using two APIs to create an application that allows you to find out the next time any satellite will be viewable over any address on earth!

The user of your application will enter some address and some satellite's ID (known as a NORAD), press 'search', then voila! They'll receive information on when that satellite can next be seen!

Check out the starter code for this project here: https://ci-wdi-900.github.io/i-need-space/

## Requirements

- Users can type in an address and a NORAD to receive information on the next time that satellite will be visible

- Your final website is responsive (looks good on mobile and desktop)

- Your project is hosted on GitHub pages

## Overview

We'll use two APIs for this project.

The first API, Mapbox, accepts an address and gives us back the longitude / latitude of that address.

The second API, Satellite Passes API, accepts a longitude / latitude and a satellite's ID (known as a NORAD) and gives us back information about when the satellite will next be visible over those coordinates.

**Mapbox Geocoding API: https://docs.mapbox.com/api/search/geocoding/**

**Satellite Passes API: https://satellites.fly.dev/**

## Steps

#### 1. Get a Mapbox API Key

> :warning: **Never add a private API key to GitHub! Bots will find these and steal them (potentially costing you $$)!**

To prevent people from abusing their API, Mapbox requires its users to make each API request with an API key.

They track how much this API key is being used and limit its usage to 600 requests per minute and 100,000 requests per month.

So the first step in using this API is to generate an API key.

1. Create an account at https://www.mapbox.com/
2. Verify your email address
3. Go to your account page: https://account.mapbox.com/
4. Under 'Access Tokens', locate the 'Default public token' which should start with `pk.`
5. This is your access token. Don't add it to your GitHub! Bots will probably steal it. Instead, we'll have the user enter the API key manually into a text input when they use the application.

#### 2. Make an API Request to Mapbox in the Browser

Great, now that you have a Mapbox API key you're all set to make an API request. Mapbox provides loads of features. We'll only be using the 'Geocoding' feature which takes an address and produces the longitude / latitude of that address.

At this point, read through the Mapbox Geocoding API documentation here: https://docs.mapbox.com/api/search/geocoding/ starting at the `Forward Geocoding` section. The `Example request: Forward geocoding` section is particularly useful. In the example section, note that `curl` is simply a command-line program to make API requests.

Look at the example request in the documentation that makes a request to geocode Los Angeles. If you're logged in, the documentation will even auto-populate the example API request with your personal API key. Try copying that whole example URL and pasting it into the address bar of your browser. If you get a reasonable JSON response containing information about the geocoded address, then you've succeeded! It should look something like this:

```json
{
    "type": "FeatureCollection",
    "query": [
        "los",
        "angeles"
    ],
    "features": [
        {
            "id": "place.6694790146427640",
            "type": "Feature",
            "place_type": [
                "place"
            ],
            "relevance": 1,
            "properties": {
                "wikidata": "Q65"
            },
            "text": "Los Angeles",
            "place_name": "Los Angeles, California, United States",
            "bbox": [
                -118.521476933898,
                33.9018943961945,
                -118.126644633049,
                34.1614409628202
            ],
            "center": [
                -118.2439,
                34.0544
            ],
            "..."
```

#### 3. Make an API Request to Mapbox in the Javascript

Great, now that we've successfully made an API request in the browser, lets try doing the same thing but with `fetch()` in our Javascript file.

Lets make it so that when the user clicks 'Search', we make an API request to Mapbox using the data in the 'API key' and 'Address' text inputs.

When you make the request, customize the URL so that the the address reflects the value in the address text input and the API key comes from the API key text input.

**Important note:** Mapbox expects the address in the API request to be "URL encoded". This means that special characters in the address like spaces should be replaced with valid characters than can go in a URL. To URL encode any string in Javascript, simply use the built in [`encodeURI()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) function.

Upon receiving a response from the Mapbox API, extract the longitude and latitude from the response JSON (hint: look in `.features[0].center[0]` and `.features[0].center[1]`) and console.log them both out.

#### 4. Make an API Request to the Satellite Passes API

Ok so our previous request responded with the longitude and latitude of the address entered in the text input.

Now, we need take that longitude and latitude along with the satellite ID (a.k.a. NORAD) entered into the text input and make a request to the Satellite Passes API. This will tell us when the satellite will next be visible.

As with before, I recommend first reading the API's documentation [here](https://satellites.fly.dev/) and making a test request in the browser before diving into the Javascript. Additionally, the documentation for this API is pretty sparse so here's an aditional example:

```
The following endpoint will make a request for the next visible satellite pass at
longitude=-57.93 and latitude=-34.91 within the next 15 days.

== REQUEST ==
https://satellites.fly.dev/passes/25544?lat=-34.91&lon=-57.93&limit=1&days=15&visible_only=true

The response below is an array of satellite passes (containing one value).
Each satellite pass object contains four properties:
* rise        - contains information on when the satellite rises over the horizon into view
* culmination - contains information on when the satellite peaks in its arc on the horizon
* set         - contains information on when the satellite sets below the horizon
* visible     - true or false whether or not the satellite will be visible

== RESPONSE ==
[
    {
        "rise": {
            "alt": "10.05",
            "az": "347.86",
            "az_octant": "N",
            "utc_datetime": "2021-04-17 22:17:25.681676+00:00",
            "utc_timestamp": 1618697845,
            "is_sunlit": true,
            "visible": true
        },
        "culmination": {
            "alt": "28.48",
            "az": "49.32",
            "az_octant": "NE",
            "utc_datetime": "2021-04-17 22:20:23.214247+00:00",
            "utc_timestamp": 1618698023,
            "is_sunlit": true,
            "visible": true
        },
        "set": {
            "alt": "9.99",
            "az": "110.55",
            "az_octant": "E",
            "utc_datetime": "2021-04-17 22:23:22.899452+00:00",
            "utc_timestamp": 1618698202,
            "is_sunlit": false,
            "visible": false
        },
        "visible": true
    }
]
```

After trying this in the browser, move into the code. After receiving the response from the previous API with longitude / latitude. Make a request to the satellite API customizing the `lat`, `lon`, and `norad` portions of the URL.

After receiving a response from the API, console.log out the UTC date/time at which the satellite will rise, culminate, and set.

#### 5. Displaying Information to the User

Finally, add Javascript to display on the DOM the UTC date/time at which the target satellite will rise, culminate, and set on the horizon. You can display this information wherever you like on the page! You may want to edit the HTML to create a designated "output" area.

#### 6. CSS, Responsiveness

Now that all the API functionality works, customize your web application! Edit the CSS rules to make it look how you want. This can be as in-depth as you want it to be.

Additionally, make sure that your site is responsive, meaning that it looks good on both desktop and mobile devices.

## Stretch goals

#### Provide additional satellite viewing information

Provide additional information to the user to better view the satellite:

- Which cardinal direction they should look in to see the satellite
- The duration of the satellite's visibility
- What angle in the sky the satellite will be located at

#### Provide Additional Mapbox Information

When you search for an address with Mapbox, the API does not return a single location that matches the search, it provides an array of matches!

Make it so that anytime a user searches for a place, the application makes a request to the Satellite API for EACH of the first three matched locations in the array provided by Mapbox. Your application should display all three of these locations on the DOM along with the relevant information that tells the user when the satellite next will be visible.
