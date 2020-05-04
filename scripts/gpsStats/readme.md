# Cities classification
This script classifies the switzerland cities based on their closest switzerland main city, listed in `mainCities.json`. The result is then saved in `core/api/gpsStats/server/classifiedCities.json`. 

This script must be run every time the main cities list is updated !


## Config files
- `citiesCoordinates.json`: this file contains the raw data of all switzerland cities and their GPS coordinates.
- `mainCities.json`: the list of the main cities to use for classification. 
  
## Usage
Every time you update the main cities list. Run from `root`:
```
meteor npm run classify-cities
```
  
Be aware that some zip codes in `citiesCoordinates.json` are duplicated, with different city names (e.g "1000 Lausanne" and "1000 Lausanne 1"). If you add a main city which zip code is duplicated in `citiesCoordinates.json`, you should then remove the unwanted occurencies in this file.

## Output
The classified cities list is saved in `core/api/gpsStats/server/classifiedCities.json`.

### Sample result
```json
[
  ...
  {
    "zipCode":9658,
    "city":"Wildhaus",
    "lat":47.2058,
    "long":9.354,
    "closestMainCity":
    {
      "zipCode":9000,
      "city":"St. Gall",
      "lat":47.4239,
      "long":9.3748
    }
  },
  ...
]
```
