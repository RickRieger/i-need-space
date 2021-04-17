// Grab the input fields and search button
const apiKey = document.querySelector('#api-key');
const address = document.querySelector('#address');
const noradSatellite = document.querySelector('#norad');
const searchButton = document.querySelector('#search');
const newSearchButton = document.querySelector('#new-search');

let UTC_Rise = '';
let timeZone = '';

// Functions to handle the duration of visibility
function strToSeconds(time) {
    let timeArray = time.split(":");
    return Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2]);
}

function toHoursMinutesSeconds(sec) {
    let hrs = Math.floor(sec / 3600);
    let min = Math.floor((sec - (hrs * 3600)) / 60);
    let seconds = sec - (hrs * 3600) - (min * 60);
    seconds = Math.round(seconds * 100) / 100
    
    let result = (hrs < 10 ? "0" + hrs : hrs);
    result += ":" + (min < 10 ? "0" + min : min);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
}

newSearchButton.addEventListener('click',()=>{

    document.querySelector('#results').style.display = 'none';
    const querySelection = document.querySelectorAll('.query-section')
    for(const element of querySelection){
        element.style.display = 'block';
    }
    apiKey.value = '';
    address.value = '';
    noradSatellite.value = '';
});



// Add event listener to search button with a call back function
searchButton.addEventListener('click',()=>{
    
    const querySelection = document.querySelectorAll('.query-section')
    for(const element of querySelection){
        element.style.display = 'none';
    }
    
   
    
    // Display the NORAD# to DOM
    document.querySelector('#norad-num').innerText = noradSatellite.value;
    
    // Display the city to the DOM
    document.querySelector('#place').innerText = address.value;
    
    
    
    // Encode the address from input field
    const encodedAddress = encodeURI(address.value);
    
    // Set the url address in the variable using a template string(template literal)
    const mapBoxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey.value}`;
    
    // Fetch the API
    fetch(mapBoxURL)
    
    .then((result) => result.json())
    
    .then((data) => {
           
        const longitude1 = data.features[0].center[0];
        const latitude1 = data.features[0].center[1];
        
        const longitude2 = data.features[1].center[0];
        const latitude2 = data.features[1].center[1];
        
        const longitude3 = data.features[2].center[0];
        const latitude3 = data.features[2].center[1];
        
        
        
        // Set the url address in the variable using a template string(template literal)
        let satelliteURL = `https://satellites.fly.dev/passes/${noradSatellite.value}?lat=${latitude1}&lon=${longitude1}&limit=1&days=15&visible_only=true`
        
        // Fetch the API
        fetch(satelliteURL)
        
        .then((result) => result.json())
        
        .then((data) => {
            
            console.log(data);
            // Assign variables to the UTC timeStamps
            const UTC_Rise = data[0].rise.utc_datetime;
            const UTC_Apex = data[0].culmination.utc_datetime;
            const UTC_Set = data[0].set.utc_datetime;
            
            // Extract the date and time from the UTC_Rise
            const rise = UTC_Rise.toString();
            const timeArrayRise = rise.split(' ');
            const timeArrayRise2 = timeArrayRise[1].split('.');
            const riseDate = timeArrayRise[0];
            const riseTime = timeArrayRise2[0];
            console.log(riseTime);
            console.log(riseDate);
            
            // Extract the date and time from the UTC_Apex
            const apex = UTC_Apex.toString();
            const timeArrayApex = apex.split(' ');
            const timeArrayApex2 = timeArrayApex[1].split('.');
            const apexDate = timeArrayRise[0];
            const apexTime = timeArrayApex2[0];
            
            // Extract the date and time from the UTC_Set
            const set = UTC_Set.toString();
            const timeArraySet = set.split(' ');
            const timeArraySet2 = timeArraySet[1].split('.');
            const setDate = timeArraySet[0];
            const setTime = timeArraySet2[0];
            console.log(setTime);
            console.log(setDate);

            // Set direction of hemisphere into variables
            const cardinalDirectionRise = data[0].rise.az_octant;
            const cardinalDirectionCulmination = data[0].culmination.az_octant;
            const cardinalDirectionSet = data[0].set.az_octant;
            
            // Handle altitude in degrees 
            const altitudeRise = data[0].rise.alt;
            const altitudeCulmination = data[0].culmination.alt;
            const altitudeSet = data[0].set.alt;
            
            // Display date, time, direction of hemisphere, and elevation in degrees of the satellite
            // to the DOM in all three stages of visibility for three different locations.
            document.querySelector('#date-0').innerText = riseDate;
            document.querySelector('#time-rise-0').innerText = riseTime;
            document.querySelector('#location-rise-0').innerText = cardinalDirectionRise;
            document.querySelector('#elevation-rise-0').innerText = altitudeRise;
            document.querySelector('#location-apex-0').innerText = cardinalDirectionCulmination;
            document.querySelector('#elevation-apex-0').innerText = altitudeCulmination;
            document.querySelector('#location-set-0').innerText = cardinalDirectionSet;
            document.querySelector('#elevation-set-0').innerText = altitudeSet;
            
            
            
            
            // duration formula
            // convert the rise, apex, and set times to local(based on machine location)
            const localRiseTime = new Date(data[0].rise.utc_datetime);
            const localCulminationTime = new Date(data[0].culmination.utc_datetime);
            const localSetTime = new Date(data[0].set.utc_datetime);

            
            // // extract the time as Hours:Minutes:Seconds
            const riseTime2 = localRiseTime.toString();
            const timeArray = riseTime2.split(' ');

            const firstTime = timeArray[4];
            
            // // extract the time as Hours:Minutes:Seconds
            const setTime2 = localSetTime.toString();
            const timeArray2 = setTime2.split(' ');
            const secondTime = timeArray2[4];
            
            // // handle the duration the satellite is visible
            const durationOfVisibility = toHoursMinutesSeconds( strToSeconds(secondTime) - strToSeconds(firstTime));
            console.log(durationOfVisibility);
            document.querySelector('#duration-0').innerText = durationOfVisibility;

            
        })
        
        // Change satelliteURL value
        satelliteURL = `https://satellites.fly.dev/passes/${noradSatellite.value}?lat=${latitude2}&lon=${longitude2}&limit=1&days=15&visible_only=true`
        
        // Fetch the API
        fetch(satelliteURL)
        
        .then((result) => result.json())
        
        .then((data) => {
            
            // Assign variables to the UTC timeStamps
            const UTC_Rise = data[0].rise.utc_datetime;
            const UTC_Apex = data[0].culmination.utc_datetime;
            const UTC_Set = data[0].set.utc_datetime;
            
            // Extract the date and time from the UTC_Rise
            const rise = UTC_Rise.toString();
            const timeArrayRise = rise.split(' ');
            const timeArrayRise2 = timeArrayRise[1].split('.');
            const riseDate = timeArrayRise[0];
            const riseTime = timeArrayRise2[0];
            
            // Extract the date and time from the UTC_Apex
            const apex = UTC_Apex.toString();
            const timeArrayApex = apex.split(' ');
            const timeArrayApex2 = timeArrayApex[1].split('.');
            const apexDate = timeArrayRise[0];
            const apexTime = timeArrayRise2[0];
            
            // Extract the date and time from the UTC_Set
            const set = UTC_Set.toString();
            const timeArraySet = set.split(' ');
            const timeArraySet2 = timeArraySet[1].split('.');
            const setDate = timeArrayRise[0];
            const setTime = timeArrayRise2[0];
            
            // Set direction of hemisphere into variables
            const cardinalDirectionRise = data[0].rise.az_octant;
            const cardinalDirectionCulmination = data[0].culmination.az_octant;
            const cardinalDirectionSet = data[0].set.az_octant;
            
            // Handle altitude in degrees 
            const altitudeRise = data[0].rise.alt;
            const altitudeCulmination = data[0].culmination.alt;
            const altitudeSet = data[0].set.alt;
            
            
            
            
            document.querySelector('#date-1').innerText = riseDate;
            document.querySelector('#time-rise-1').innerText = riseTime;
            document.querySelector('#location-rise-1').innerText = cardinalDirectionRise;
            document.querySelector('#elevation-rise-1').innerText = altitudeRise;
            document.querySelector('#location-apex-1').innerText = cardinalDirectionCulmination;
            document.querySelector('#elevation-apex-1').innerText = altitudeCulmination;
            document.querySelector('#location-set-1').innerText = cardinalDirectionSet;
            document.querySelector('#elevation-set-1').innerText = altitudeSet;
            
            
            
            // duration formula
            // convert the rise, apex, and set times to local(based on machine location)
            const localRiseTime = new Date(data[0].rise.utc_datetime);
            const localCulminationTime = new Date(data[0].culmination.utc_datetime);
            const localSetTime = new Date(data[0].set.utc_datetime);
            
            // // extract the time as Hours:Minutes:Seconds
            const riseTime2 = localRiseTime.toString();
            const timeArray = riseTime2.split(' ');
            const firstTime = timeArray[4];
            
            // // extract the time as Hours:Minutes:Seconds
            const setTime2 = localSetTime.toString();
            const timeArray2 = setTime2.split(' ');
            const secondTime = timeArray2[4];
            
            // // handle the duration the satellite is visible
            const durationOfVisibility = toHoursMinutesSeconds( strToSeconds(secondTime) - strToSeconds(firstTime));
            console.log(durationOfVisibility);
            document.querySelector('#duration-1').innerText = durationOfVisibility;

            
        })
        
        // Change satelliteURL value
        satelliteURL = `https://satellites.fly.dev/passes/${noradSatellite.value}?lat=${latitude3}&lon=${longitude3}&limit=1&days=15&visible_only=true`
        
        // Fetch the API
        fetch(satelliteURL)
        
        .then((result) => result.json())
        
        .then((data) => {
            
            // Assign variables to the UTC timeStamps
            const UTC_Rise = data[0].rise.utc_datetime;
            const UTC_Apex = data[0].culmination.utc_datetime;
            const UTC_Set = data[0].set.utc_datetime;
            
            // Extract the date and time from the UTC_Rise
            const rise = UTC_Rise.toString();
            const timeArrayRise = rise.split(' ');
            const timeArrayRise2 = timeArrayRise[1].split('.');
            const riseDate = timeArrayRise[0];
            const riseTime = timeArrayRise2[0];
            
            // Extract the date and time from the UTC_Apex
            const apex = UTC_Apex.toString();
            const timeArrayApex = apex.split(' ');
            const timeArrayApex2 = timeArrayApex[1].split('.');
            const apexDate = timeArrayRise[0];
            const apexTime = timeArrayRise2[0];
            
            // Extract the date and time from the UTC_Set
            const set = UTC_Set.toString();
            const timeArraySet = set.split(' ');
            const timeArraySet2 = timeArraySet[1].split('.');
            const setDate = timeArrayRise[0];
            const setTime = timeArrayRise2[0];
            
            // Set direction of hemisphere into variables
            const cardinalDirectionRise = data[0].rise.az_octant;
            const cardinalDirectionCulmination = data[0].culmination.az_octant;
            const cardinalDirectionSet = data[0].set.az_octant;
            
            // Handle altitude in degrees 
            const altitudeRise = data[0].rise.alt;
            const altitudeCulmination = data[0].culmination.alt;
            const altitudeSet = data[0].set.alt;
            
            // Display date, time, direction of hemisphere, and elevation in degrees of the satellite
            // to the DOM in all three stages of visibility for three different locations.
            
            
            
            document.querySelector('#date-2').innerText = riseDate;
            document.querySelector('#time-rise-2').innerText = riseTime;
            document.querySelector('#location-rise-2').innerText = cardinalDirectionRise;
            document.querySelector('#elevation-rise-2').innerText = altitudeRise;
            document.querySelector('#location-apex-2').innerText = cardinalDirectionCulmination;
            document.querySelector('#elevation-apex-2').innerText = altitudeCulmination;
            document.querySelector('#location-set-2').innerText = cardinalDirectionSet;
            document.querySelector('#elevation-set-2').innerText = altitudeSet;
            
            
            // duration formula
            // convert the rise, apex, and set times to local(based on machine location)
            const localRiseTime = new Date(data[0].rise.utc_datetime);
            const localCulminationTime = new Date(data[0].culmination.utc_datetime);
            const localSetTime = new Date(data[0].set.utc_datetime);

            
            // // extract the time as Hours:Minutes:Seconds
            const riseTime2 = localRiseTime.toString();
            const timeArray = riseTime2.split(' ');
            const firstTime = timeArray[4];
            console.log(firstTime)
            // // extract the time as Hours:Minutes:Seconds
            const setTime2 = localSetTime.toString();
            const timeArray2 = setTime2.split(' ');
            const secondTime = timeArray2[4];
            console.log(secondTime)

            
            // // handle the duration the satellite is visible
            const durationOfVisibility = toHoursMinutesSeconds( strToSeconds(secondTime) - strToSeconds(firstTime));
            console.log(durationOfVisibility);
            document.querySelector('#duration-2').innerText = durationOfVisibility;

            
        });
    });
    document.querySelector('#results').style.display = 'block';
});