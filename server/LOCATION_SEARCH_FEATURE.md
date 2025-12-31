# Location-Based Doctor Search Feature

This document describes the new location-based doctor search feature that allows users to find doctors within specific radius distances for offline consultation.

## Backend Implementation

### New API Endpoints

#### 1. Search Doctors by Location and Radius
```
GET /api/doctor/search/location
```

**Query Parameters:**
- `lat` (required): User's latitude coordinate
- `lng` (required): User's longitude coordinate  
- `radius` (required): Search radius in kilometers (1-100km)
- `speciality` (optional): Filter by doctor specialty
- `language` (optional): Filter by doctor language
- `available` (optional): Filter by availability (true/false)
- `limit` (optional): Maximum number of results (default: 50)

**Example Request:**
```
GET /api/doctor/search/location?lat=28.6139&lng=77.2090&radius=5&speciality=Psychologist&available=true
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "doctor_id",
      "name": "Dr. John Doe",
      "speciality": "Psychologist",
      "distance": 2.3,
      "available": true,
      "fees": 500,
      "address": {
        "coordinates": {
          "lat": 28.6200,
          "lng": 77.2100
        },
        "formatted": "New Delhi, India"
      }
    }
  ],
  "total": 15,
  "searchParams": {
    "location": { "lat": 28.6139, "lng": 77.2090 },
    "radius": 5,
    "speciality": "Psychologist"
  }
}
```

#### 2. Get Doctors with Multiple Radius Options
```
GET /api/doctor/search/nearby
```

**Query Parameters:**
- `lat` (required): User's latitude
- `lng` (required): User's longitude

**Response:**
```json
{
  "success": true,
  "location": { "lat": 28.6139, "lng": 77.2090 },
  "results": {
    "1km": { "count": 3, "doctors": [...] },
    "2km": { "count": 8, "doctors": [...] },
    "5km": { "count": 15, "doctors": [...] },
    "10km": { "count": 32, "doctors": [...] },
    "20km": { "count": 75, "doctors": [...] },
    "50km": { "count": 150, "doctors": [...] }
  }
}
```

### Geographic Utilities

#### Distance Calculation (Haversine Formula)
The system uses the Haversine formula to calculate accurate distances between two geographic points on Earth's surface.

```javascript
// Calculate distance between two coordinates
const distance = calculateDistance(userLat, userLng, doctorLat, doctorLng);
// Returns distance in kilometers
```

#### Location Filtering
Doctors are filtered based on:
1. Valid coordinates in their address field
2. Distance within specified radius
3. Additional filters (specialty, language, availability)
4. Results sorted by distance (nearest first)

## Frontend Implementation

### New Components

#### 1. LocationSearch Component
- **Auto Location**: Uses browser geolocation API to get user's current position
- **Manual Location**: Allows users to enter address/city for geocoding
- **Radius Selection**: Buttons for 1km, 2km, 5km, 10km, 20km, 50km options
- **Real-time Search**: Triggers search as user changes radius or location

#### 2. LocationBasedDoctors Component
- **Distance Display**: Shows exact distance from user's location
- **Color-coded Distance**: Green for <1km, Blue for <5km, Orange for <10km, Red for >10km
- **Enhanced Doctor Cards**: Includes distance information and location details
- **Search Results Summary**: Shows total doctors found within radius

### Updated Doctors Page
- **Search Mode Toggle**: Switch between "All Doctors" and "Search by Location"
- **Integrated Filtering**: Location search respects specialty and language filters
- **Seamless UX**: Maintains existing functionality while adding location features

## Database Schema

The existing doctor model already includes location information:

```javascript
address: { 
  type: Object, 
  required: true,
  default: {
    line1: { type: String },
    line2: { type: String },
    plusCode: { type: String },
    coordinates: {           // Used for distance calculations
      lat: { type: Number },
      lng: { type: Number }
    },
    formatted: { type: String },
    placeId: { type: String }
  }
}
```

## Usage Examples

### Frontend Usage

1. **User grants location permission**:
   - System automatically detects location
   - Shows doctors within default 5km radius
   - User can adjust radius using buttons

2. **Manual location entry**:
   - User types "Mumbai, India" 
   - System geocodes to coordinates
   - Shows nearby doctors with distances

3. **Combined filtering**:
   - Search for "Psychologists" within "10km" of location
   - Results show distance-sorted psychologists
   - Each doctor card shows exact distance

### API Usage

```javascript
// Search for doctors within 5km of user location
const response = await fetch(`/api/doctor/search/location?lat=19.0760&lng=72.8777&radius=5&available=true`);
const data = await response.json();

// Get doctors across multiple radius options
const nearbyResponse = await fetch(`/api/doctor/search/nearby?lat=19.0760&lng=72.8777`);
const nearbyData = await nearbyResponse.json();
```

## Benefits

1. **Offline Consultation Focus**: Only shows available doctors for in-person visits
2. **Distance-based Sorting**: Nearest doctors appear first
3. **Multiple Radius Options**: Flexible search from 1km to 50km
4. **Real-time Location**: Uses device GPS for accurate positioning
5. **Address Geocoding**: Supports manual location entry
6. **Combined Filtering**: Works with specialty and language filters
7. **Performance Optimized**: Efficient distance calculations and result limiting

## Technical Notes

- **Distance Accuracy**: Uses Haversine formula for precise geographic calculations
- **Performance**: Results limited to 50 doctors by default to ensure fast responses
- **Error Handling**: Graceful fallbacks for location permissions and geocoding failures
- **Mobile Friendly**: Responsive design works well on mobile devices
- **Browser Compatibility**: Geolocation API works in all modern browsers

## Future Enhancements

1. **Map Integration**: Show doctors on an interactive map
2. **Route Planning**: Integration with maps for navigation
3. **Location History**: Remember frequently searched locations
4. **Push Notifications**: Alerts when new doctors become available in area
5. **Advanced Filters**: Hospital affiliation, rating-based proximity search