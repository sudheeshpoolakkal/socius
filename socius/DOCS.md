# Spiritus Frontend Documentation

This document provides detailed information about the components, pages, and utility functions that make up the Spiritus frontend application.

---

## Pages

This section describes the main pages of the application, which are located in the `src/pages/` directory.

---

### `pages/About.jsx`

**Component:** `AboutUs`

This page provides comprehensive information about the Spiritus platform, its mission, and the services it offers. It serves as an introduction for new users and potential clients.

#### Purpose

The `AboutUs` page is designed to build trust and convey the brand's values. It includes sections that detail the company's story, its impact through statistics, information about its therapists, and a strong call to action to encourage users to sign up.

#### Structure

The component is composed of several distinct sections:

-   **Hero Section**: A large, visually appealing banner with a background image and a welcoming message.
-   **Our Story Section**: A text-based section that narrates the history and mission of Spiritus.
-   **Impact Stats Section**: Displays key metrics like the number of therapists, sessions conducted, and countries served to showcase the platform's reach and effectiveness.
-   **Our Therapists Section**: Features a gallery of therapist images and a description of their qualifications and experience, inspired by platforms like BetterHelp.
-   **Call to Action Section**: A final, prominent section that encourages users to get started with the service.

#### Navigation

-   The "Get started" and "Begin Your Transformation" buttons navigate the user to the `/login` route, prompting them to either sign in or register.

#### Dependencies

-   `react-router-dom`: Used for programmatic navigation via the `useNavigate` hook.
-   `@/assets/assets_frontend/assets`: Imports local image assets for the page.
-   `@/assets/assets_frontend/angel.jpg`: A specific background image for the hero section.

#### State and Props

-   The component is stateless and does not accept any props. It relies on the `useNavigate` hook for its interactive elements.
-   It contains a hardcoded array `therapistImages` with URLs to placeholder images for the therapist gallery.

---

### `pages/Application.jsx`

**Component:** `Application`

This page serves as a comprehensive application portal for mental health professionals wishing to join the Spiritus platform. It is a feature-rich, single-page experience that combines marketing information with a detailed, multi-step application form.

#### Purpose

The primary goal of this page is to attract and onboard new therapists. It does this by:
1.  Showcasing the benefits of the platform (flexible hours, client referrals, etc.).
2.  Providing an interactive earnings calculator to estimate potential income.
3.  Displaying social proof through video and text testimonials.
4.  Clearly listing the application requirements.
5.  Guiding the applicant through a step-by-step application process.

#### Structure and Features

The component is broken down into several major sections:

-   **Hero Section**: An engaging header designed to capture the attention of potential applicants.
-   **Multi-Step Application Form**: The core interactive element of the page. It guides the user through the following steps:
    1.  License type selection.
    2.  Questions about their current work situation and time allocation.
    3.  Final collection of personal details (name, email, state of license).
    4.  A final submission confirmation message.
-   **Benefits Section**: A visually organized list of the advantages of joining the platform.
-   **Earnings Calculator**: An interactive tool where applicants can select their desired work type (full-time/part-time) and use a slider to set their hours per week to see an estimated annual income.
-   **Comparison Section**: A table that contrasts working with Spiritus versus a traditional private practice.
-   **Testimonials**: Includes both a video testimonial and several written testimonials from existing therapists on the platform.
-   **Requirements Section**: A clear list of the qualifications and prerequisites needed to apply.

#### State Management

The component uses several `useState` hooks to manage its internal state:

-   **`selectedOption`**: Stores the license type selected by the user at the start of the form.
-   **`workType`**: Manages the "full-time" or "part-time" selection in the earnings calculator.
-   **`hoursPerWeek`**: Tracks the value from the hours-per-week slider in the calculator.
-   **`step`**: Controls which step of the multi-step form is currently displayed.
-   **`formData`**: An object that aggregates all the information entered by the applicant across the various form steps.

#### Helper Functions

-   **`calculateEarnings()`**: Computes the estimated annual earnings based on the `hoursPerWeek` state.
-   **`isStepValid(currentStep)`**: A validation function that checks if the required fields for the current form step are filled out, used to enable or disable the "Next" button.
-   **`renderStep(currentStep)`**: A function that conditionally renders the appropriate JSX for the current form step based on the `step` state.

#### Dependencies

-   `react`: Core library, specifically the `useState` hook.
-   `lucide-react`: For icons used throughout the page.
-   `@/assets/video/`: Imports local video files for the testimonials.

---

### `pages/Appointment.jsx`

**Component:** `Appointment`

This is a detailed page for viewing a specific doctor's profile and managing the appointment process. It serves as the central hub for users to book, review, and rate their experiences with a doctor.

#### Purpose

The `Appointment` page allows users to:
1.  View comprehensive details about a doctor.
2.  Select an available date and time slot for a consultation.
3.  Choose between 'online' and 'offline' consultation modes.
4.  Book the appointment by providing a text or audio description of their issue.
5.  View past reviews from other patients.
6.  Submit a rating and review for a previously completed appointment with that doctor.
7.  View related doctors with the same specialty.

#### Structure and Features

-   **Doctor Profile Card**: A detailed card at the top displaying the doctor's image, name, specialty, experience, average rating, and a short biography.
-   **Tabbed Interface**: The main content is organized into three tabs:
    -   **Book Appointment**: This is the default view, containing:
        -   A date selector for the next 7 days.
        -   A time slot selector that dynamically displays available times for the chosen date.
        -   A consultation mode selector (Online/Offline).
        -   A text area for the patient to describe their problem.
        -   An `AudioRecorder` component to allow users to record a voice message instead of typing.
        -   A "Book Appointment" button that becomes active once a time slot is selected.
    -   **Patient Reviews**: Displays a list of all historical ratings and reviews submitted by other patients for this doctor.
    -   **Rate Doctor**: This tab only appears if the user has a completed (but not yet rated) appointment with this doctor. It provides a form to submit a star rating and an optional text review.
-   **Offline Mode Enhancements**: When 'offline' mode is selected, the component attempts to:
    -   Get the user's current location using the browser's Geolocation API.
    -   Calculate the distance and estimated travel time to the doctor's clinic.
    -   Display an error if location services are disabled or unavailable.
-   **Map Modal**: A modal window that displays the doctor's location on an embedded Google Map, which can be opened from the offline mode section.
-   **Related Doctors**: A section at the bottom that shows other doctors with the same specialty.

#### State and Context

-   **`docId` (`useParams`)**: Retrieves the doctor's ID from the URL.
-   **`AppContext` (`useContext`)**: Accesses global state and functions, including `doctors`, `appointments`, `token`, `backendUrl`, and `getDoctorsData`.
-   **`useState` Hooks**:
    -   `docInfo`: Stores the detailed profile of the doctor being viewed.
    -   `docSlots`: An array of available appointment slots for the next 7 days, processed from the doctor's `custom_slots`.
    -   `slotIndex`, `slotTime`: Manage the user's selection of the date and time.
    -   `patientDescription`, `recordedAudio`: Store the user's problem description, either as text or an audio blob.
    -   `consultationMode`: Toggles between 'online' and 'offline'.
    -   `activeTab`: Manages which of the three main tabs is currently visible.
    -   `completedAppointments`: An array of appointments that the user can rate.
    -   `doctorReviews`: An array of all reviews for the current doctor.
    -   `rating`, `review`: Manage the state of the rating submission form.
    -   `distance`, `travelTime`, `locationError`: Manage the data and errors for the offline mode distance calculation.
    -   `showMapModal`: Controls the visibility of the Google Map modal.

#### Helper Functions and API Calls

-   **`fetchDocInfo()`, `fetchDoctorReviews()`**: Asynchronous functions to fetch the latest doctor data and reviews from the backend.
-   **`getAvailableSlot()`**: The core logic for determining appointment availability. It processes the `docInfo.custom_slots` map, checks against already booked appointments from the context, and filters out past slots.
-   **`bookAppointment()`**: Constructs a `FormData` object (to handle potential audio file upload) and sends a `POST` request to `/api/user/book-appointment`.
-   **`submitRatingAndReview()`**: Sends a `POST` request to `/api/user/rate-doctor` with the user's rating and review.
-   **`calculateDistance()`, `extractCoordinatesFromMapUrl()`, `estimateTravelTime()`**: Utility functions to support the offline mode distance and travel time feature.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-router-dom` (hooks: `useNavigate`, `useParams`).
-   `axios` for making API requests.
-   `react-toastify` for displaying notifications.
-   `@/components/AudioRecorder`: A child component for recording audio.
-   `@/components/RelatedDoctors`: A child component to display similar doctors.

---

### `pages/CabBooking.jsx`

**Component:** `CabBooking`

This component provides a complete interface for booking a cab. It handles location input, ride selection, real-time status updates, and can be pre-configured for scheduled rides linked to medical appointments.

#### Purpose

The `CabBooking` page allows users to:
1.  Enter pickup and destination locations, with the pickup location auto-filled using the browser's Geolocation API.
2.  Swap pickup and destination addresses.
3.  Select from a variety of ride options with different prices and features.
4.  Book a ride for immediate pickup or schedule one for a future time (e.g., before an appointment).
5.  Receive real-time feedback on the booking status, from searching for a driver to ride completion.
6.  View driver details once a ride is confirmed.
7.  Cancel a booking if it's still in a pending or confirmed state.

#### Structure and Features

-   **Location Inputs**: Two `LocationInput` components for "Pickup" and "Destination". Includes a button to swap the values.
-   **Ride Options**: A grid of `RideOptionCard` components, allowing the user to select their preferred vehicle type.
-   **Booking Button**: A primary call-to-action button that shows different states (e.g., "Book Ride", "Finding driver...", "Ride in Progress").
-   **Status Display**: A dedicated `BookingStatus` component appears after a booking is initiated, showing the current state (e.g., 'pending', 'confirmed', 'cancelled').
-   **Driver Information**: Once a driver is assigned, their name, vehicle, license plate, and phone number are displayed.
-   **Scheduled Rides**: If the user navigates to this page from an appointment, the component automatically sets the destination to the doctor's address and schedules the cab to arrive 15 minutes before the appointment time.

#### State and Context

-   **`location` (`useLocation`)**: Used to receive appointment data passed through router state.
-   **`useState` Hooks**:
    -   `pickup`, `destination`: Manages the text in the location input fields.
    -   `selectedRide`: Stores the ID of the currently selected ride option.
    -   `isSearching`: A boolean to manage the loading state during the driver search process.
    -   `bookingStatus`, `bookingDetails`, `bookingId`, `driver`: Store all relevant information about an active booking returned from the backend.
    -   `polling`: Holds the `setInterval` ID for the status update polling mechanism.
    -   `isScheduled`, `scheduledTime`, `appointmentData`: Manage the state for rides that are pre-scheduled based on an appointment.

#### Helper Functions and API Calls

-   **`useEffect` Hooks**:
    1.  On mount, it uses `navigator.geolocation` to get the user's current position and reverse-geocodes it to an address for the pickup field.
    2.  It checks `location.state` to see if appointment data was passed, and if so, configures the component for a scheduled ride.
    3.  It sets up and tears down a `setInterval` to poll the booking status from the backend every 5 seconds when a booking is active.
-   **`handleBookRide()`**: An async function that sends a `POST` request to `/api/cab/book` with the ride details.
-   **`handleCancelBooking()`**: An async function that sends a `PUT` request to `/api/cab/booking/:bookingId/cancel`.
-   **`parseAppointmentTime()`**: A utility function to correctly parse date and time strings from the appointment data to create a valid `Date` object.

#### Child Components

-   **`LocationInput`**: A reusable input field for pickup and destination.
-   **`RideOptionCard`**: A button-like card to display each available ride type.
-   **`BookingStatus`**: A component that displays a message and icon corresponding to the current booking status.

---

### `pages/Checkout.jsx`

**Component:** `Checkout`

This component serves as the payment page for confirming a medical appointment. It calculates the final amount, provides options for different payment methods, and handles the (mock) payment processing.

#### Purpose

The primary function of the `Checkout` page is to allow a user to pay for a previously booked but unconfirmed appointment. It finalizes the booking process.

#### Data Flow and State Management

-   **`location` (`useLocation`)**: The component critically relies on the `appointment` object being passed to it via the router's `location.state`. If this data is missing, the component will render an error message.
-   **`AppContext` (`useContext`)**: It pulls the `backendUrl`, `token`, and `currencySymbol` from the global context to construct API requests and display currency correctly.
-   **`useState` Hooks**:
    -   `loading`: Manages the UI state during the API call to prevent multiple submissions.
    -   `paymentMethod`: A string ('card' or 'upi') that controls which payment form is displayed.
    -   The component also holds state for all the input fields in the card (`cardName`, `cardNumber`, etc.) and UPI (`upiId`) forms.

#### Structure and Features

-   **Amount Calculation**: It takes the base `appointment.amount` and adds a 16% surcharge to calculate the `totalAmount` to be paid.
-   **Payment Method Tabs**: A simple tabbed interface allows the user to switch between "Card" and "UPI" payment forms.
-   **Input Validation**:
    -   The component includes client-side validation functions (`validateCardDetails`, `validateUpiDetails`) that check the format of the card number, expiry date, CVV, and UPI ID using regular expressions before allowing the form to be submitted.
    -   User feedback for validation errors is provided via `react-toastify`.
-   **Payment Submission**:
    -   The `handlePayment` function is triggered on form submission.
    -   It calls the appropriate validation function based on the selected `paymentMethod`.
    -   If valid, it sends a `POST` request to the `/api/user/process-payment` endpoint with the `appointmentId`.
    -   On a successful API response, it displays a success message and navigates the user back to the `/my-appointments` page after a 1.5-second delay, allowing the user to see the updated "Paid" status.

#### Dependencies

-   `react` (hooks: `useContext`, `useState`).
-   `react-router-dom` (hooks: `useLocation`, `useNavigate`).
-   `axios` for API communication.
-   `react-toastify` for user notifications.
-   `@/context/AppContext`.

---

### `pages/Plans.jsx`

**Component:** `Plans`

This is a visually rich, animated marketing page designed to showcase the subscription plans offered by Spiritus to organizational clients, specifically corporations and universities.

#### Purpose

The `Plans` page aims to attract and inform potential B2B clients by:
1.  Clearly outlining the mental health challenges faced by students and employees.
2.  Presenting distinct, tiered subscription plans tailored for both corporate and university needs.
3.  Allowing users to toggle between monthly and annual billing to see pricing differences and savings.
4.  Using strong visual design and animations to create an engaging user experience.

#### Structure and Features

-   **Hero Section**: A large, animated header section that highlights the importance of mental health support and addresses the specific pain points of students and employees.
-   **Billing Toggle**: A prominent UI control that allows users to switch between "Monthly" and "Annual" pricing for all displayed plans. The annual option highlights a percentage saving.
-   **Plan Sections**: The page is divided into two main sections:
    -   **Corporate Wellness Programs**: Displays plans named "Starter," "Professional," and "Enterprise."
    -   **University Partnerships**: Displays plans named "Campus Basic," "Campus Premium," and "University Wide."
-   **`PlanCard` Component**: A reusable component (defined within the `Plans.jsx` file) that renders the details for each plan.
    -   Each card shows the plan's name, price (which updates based on the billing cycle), number of sessions, and employee/student capacity.
    -   It lists the features included in the plan with checkmark icons.
    -   One plan in each section is marked as "Most Popular" with distinct styling.
    -   Cards have unique color schemes and hover effects for visual appeal.
-   **Animations**: The page makes extensive use of CSS keyframe animations (defined in a `<style jsx>` block) for effects like `fade-in-up`, `pulse`, and `bounce` to make the content more dynamic.

#### State and Data Management

-   **`useState` Hooks**:
    -   `billingCycle`: A string ('monthly' or 'annual') that controls the pricing displayed on all plan cards.
    -   `isVisible`: A boolean flag set on component mount to trigger the initial `fade-in-up` animation for the page content.
-   **Hardcoded Data**: All plan details, including names, prices, features, and styling information, are stored locally in two constant arrays: `corporatePlans` and `universityPlans`. The component does not fetch any data from an external API.

#### Helper Functions

-   **`formatPrice(price)`**: A utility function that uses `Intl.NumberFormat` to format a number into the Indian Rupee currency string (e.g., `₹5,000`).

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`).

---

### `pages/SpiritusAwards.jsx`

**Component:** `SpiritusAwards`

This is a static, visually-driven marketing page designed to showcase a fictional "Spiritus Awards" program, honoring top-performing hospitals and healthcare institutions.

#### Purpose

The page aims to build brand authority and credibility by creating the appearance of a prestigious awards program. It highlights top-rated institutions (using mock data) and outlines the criteria for the awards, thereby reinforcing the platform's commitment to quality.

#### Structure and Features

-   **Hero Section**: A large, stylized header introducing the "Spiritus Awards".
-   **Animated Stats Section**: Displays key impact metrics (e.g., "Participating Hospitals", "Patients Served"). The numbers animate on component mount, counting up to their target values.
-   **Award Categories**: A section that describes the different categories in which awards are given, such as "Best Overall Mental Health Care" and "Best Addiction Recovery Program".
-   **Winners Showcase**: The centerpiece of the page, displaying a grid of "award-winning" hospitals. Each hospital is presented on a card that includes:
    -   A rank icon (Crown, Medal, Trophy).
    -   The hospital's image, name, and award category.
    -   A star rating and the total number of reviews.
    -   A brief description and a list of its specialties.
-   **Evaluation Criteria**: A section explaining the methodology behind the awards, covering patient satisfaction, clinical outcomes, and service excellence.
-   **Call to Action**: A final section prompting users to "Nominate a Hospital".

#### State and Data Management

-   **`useState` Hooks**:
    -   `currentYear`: Stores the current year to be displayed on the page.
    -   `animatedStats`: An object that holds the numeric values for the stats section. These values are animated from 0 to their final target on component mount.
-   **Hardcoded Data**: All content on this page, including the list of `awardedHospitals` and `categories`, is hardcoded directly into the component. It does not perform any API calls.

#### Helper Functions and Effects

-   **`useEffect` Hook**: This hook is used to trigger the animation of the numbers in the "Program Impact" section when the component first renders. It uses `setInterval` to incrementally update the `animatedStats` state.
-   **`renderStars(rating)`**: A helper function that generates a set of star icons based on a given rating number.
-   **`getRankIcon(rank)`**: A helper function that returns a specific icon (`Crown`, `Medal`, `Trophy`) based on the hospital's rank.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`).
-   `lucide-react` for icons.

---

## Components

This section describes the reusable components located in the `src/components/` directory.

---

### `components/AudioRecorder.jsx`

**Component:** `AudioRecorder`

A self-contained component that allows users to record audio directly in the browser using their microphone.

#### Purpose

This component provides a simple user interface for recording a voice message. It's designed to be embedded within other components (like the `Appointment` page) to offer an alternative to typing, for example, when a user is describing their symptoms.

#### Structure and Features

-   **Record/Stop Button**: A single button toggles the recording state.
    -   When not recording, it displays a sound wave icon.
    -   When recording, it displays a red square "stop" icon and has a pulsing red halo effect created with CSS animations.
-   **Audio Playback**: Once a recording is stopped, an `<audio>` player automatically appears below the button, allowing the user to listen to their recording before submitting it.
-   **Microphone Access**: It uses the standard `navigator.mediaDevices.getUserMedia` API to request permission and access the user's microphone.

#### State and Props

-   **Props**:
    -   **`onAudioRecorded`**: A crucial callback function. When the user stops a recording, this function is called with the resulting audio `Blob` as its argument. The parent component can then take this blob and, for example, upload it to a server.
-   **`useState` Hooks**:
    -   `recording`: A boolean that tracks whether the audio is currently being recorded. This controls the button's appearance and behavior.
    -   `audioURL`: A string that stores the local blob URL created by `URL.createObjectURL()`. This URL is used as the `src` for the `<audio>` player element.
-   **`useRef` Hooks**:
    -   `mediaRecorderRef`: Holds the instance of the `MediaRecorder` object to control the recording process (start, stop).
    -   `audioChunksRef`: An array that accumulates the chunks of audio data as they are being recorded.

#### Dependencies

-   `react` (hooks: `useState`, `useRef`).

---

### `components/Footer.jsx`

**Component:** `Footer`

A data-driven, reusable footer component for the application.

#### Purpose

This component renders the site's footer, providing organized navigation links to key sections like services, support, and legal pages, along with a copyright notice.

#### Structure and Features

-   **Data-Driven Links**: The footer's structure is generated from a `footerSections` array of objects. This makes it easy to add, remove, or modify footer links without changing the JSX structure.
-   **Organized Sections**: The links are grouped into logical sections (e.g., "Services", "Support", "Legal").
-   **Highlighted Links**: The data structure supports a `isHighlighted` flag, which applies a distinct gradient style to certain links (like "Intelligence Module" and "Vespera") to make them stand out.
-   **Dynamic Copyright Year**: The copyright year is automatically updated to the current year using `new Date().getFullYear()`.

#### State and Props

-   The component is stateless and does not receive any props.

#### Dependencies

-   `react`.

---

### `components/TopDoctors.jsx`

**Component:** `TopDoctors`

A component that displays a curated list of the top-rated doctors on the platform.

#### Purpose

This component is used on the homepage to feature the highest-rated doctors, providing users with a quick way to find well-regarded practitioners. It is similar to `PopularDoctors` but uses a different metric for sorting.

#### Logic and Features

-   **Data Source**: It consumes the global `doctors` array from the `AppContext`.
-   **Ranking Metric**: The component determines the "top" doctors by sorting the full list in descending order based on their `rating` property.
-   **Curated List**: After sorting, it uses `.slice(0, 10)` to display only the top 10 highest-rated doctors.
-   **Doctor Cards**: It renders the doctors in a responsive grid. Each card is styled to show the doctor's image, availability status, name, specialty, and their numerical star rating.
-   **Navigation**:
    -   Clicking on a doctor's card navigates the user to that doctor's detailed appointment page (`/appointment/:id`).
    -   A "More Doctors" button at the bottom navigates the user to the main `/doctors` page.

#### State and Props

-   The component is stateless and does not accept any props, deriving all its data from the `AppContext`.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `@/context/AppContext`.
-   `react-icons/fa` for the star icon.

---

## `context/AppContext.jsx`

**Component:** `AppContextProvider`

This is the central state management provider for the entire `spiritus` application. It uses the React Context API to hold and distribute global state and functions to all components wrapped within it.

#### Purpose

The `AppContextProvider` serves as a single source of truth for application-wide data, eliminating the need for prop drilling. It manages user authentication, profile data, and master lists of doctors and hospitals.

#### State and Data

-   **`backendUrl`, `currencySymbol`**: Hardcoded configuration values.
-   **`doctors`, `hospitals`**: Arrays that store the master lists of all doctors and hospitals, fetched once when the application loads.
-   **`token`**: The user's authentication token. It's initialized from `localStorage` to persist the user's session across page reloads.
-   **`userData`**: An object containing the profile information of the currently logged-in user.
-   **`appointments`**: An array holding all appointments for the logged-in user.

#### Key Functions

-   **`getDoctorsData()`**, **`getHospitalsData()`**: These functions are called once when the application mounts to fetch and store the master lists of doctors and hospitals.
-   **`loadUserProfileData()`**: Fetches the profile data for the authenticated user and stores it in the `userData` state.
-   **`loadAppointments()`**: Fetches all appointments for the authenticated user.
-   **`getPrescription(appointmentId)`**: A function that can be called by child components to fetch the prescription details for a specific appointment.
-   **`getDoctorById(docId)`**: A function to fetch the latest details for a single doctor, including their custom appointment slots.
-   **`logout()`**: Clears the authentication token from `localStorage` and the component's state, resets `userData`, and navigates the user to the login page.

#### Effects (`useEffect`)

-   A `useEffect` hook runs once on initial mount to call `getDoctorsData()` and `getHospitalsData()`.
-   A second `useEffect` hook is dependent on the `token`. When a user logs in (and a token becomes present), it automatically triggers `loadUserProfileData()` and `loadAppointments()` to fetch the user-specific data. When the user logs out (token becomes `false`), it clears the `userData`.

#### Provided Context Value

The `value` object passed to the `AppContext.Provider` includes all the state variables and functions, making them accessible to any child component that uses the `useContext(AppContext)` hook.

---

### `components/TopHospitals.jsx`

**Component:** `TopHospitals`

A component that displays a curated list of the top-rated hospitals and facilities on the platform.

#### Purpose

This component is used on the homepage to feature the highest-rated facilities, helping users find trusted institutions for care. It mirrors the functionality of `TopDoctors` but for hospitals.

#### Logic and Features

-   **Data Source**: It consumes the global `hospitals` array from the `AppContext`.
-   **Ranking Metric**: It determines the "top" hospitals by sorting the full list in descending order based on their `rating` property.
-   **Curated List**: After sorting, it uses `.slice(0, 10)` to display only the top 10 highest-rated hospitals.
-   **Hospital Cards**: It renders the facilities in a responsive grid. Each card is styled to show the hospital's logo, emergency support status, name, type, and numerical star rating.
-   **Navigation**:
    -   Clicking on a hospital's card navigates the user to that hospital's detailed profile page (`/hospital/:id`).
    -   A "More Hospitals" button at the bottom navigates the user to the main `/hospitals` page.

#### State and Props

-   The component is stateless and does not accept any props, deriving all its data from the `AppContext`.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `@/context/AppContext`.
-   `react-icons/fa` for the star icon.
-   `react-router-dom` (for the `Link` component).

---

### `components/Header.jsx`

**Component:** `Header`

This component is the main hero section for the homepage, featuring a dynamic background image slideshow and prominent calls to action.

#### Purpose

The `Header` component is designed to be the first thing a user sees. Its goal is to capture attention with a visually engaging, rotating background and provide clear, immediate actions for the user: booking an appointment or taking a therapy assessment.

#### Structure and Features

-   **Dynamic Background**: The component's most notable feature is a background image that transitions every 3 seconds. It cycles through a predefined array of imported images.
-   **Content Overlay**: A semi-transparent black overlay is placed over the background to ensure the white text remains readable regardless of the current background image.
-   **Layout**: It uses a two-column layout on larger screens.
    -   **Left Side**: Contains all the textual content and buttons, including the main heading, a descriptive paragraph, and an image of user profile icons.
    -   **Right Side**: This section is currently empty but is reserved in the layout.
-   **Call-to-Action Buttons**:
    -   **Book Appointment**: This is a standard anchor (`<a>`) link that directs the user to the `#speciality` section on the same page, allowing for smooth scrolling to the specialty menu.
    -   **Therapy Assessment**: This is a `Link` component from `react-router-dom` that navigates the user to the `/mind-reader` page.

#### State and Effects

-   **`useState` (`bgImage`)**: This state holds the currently displayed background image.
-   **`useEffect`**: This hook sets up a `setInterval` function when the component mounts. The interval cycles through an array of imported background images and updates the `bgImage` state every 3000 milliseconds, creating the slideshow effect. The hook also returns a cleanup function to clear the interval when the component unmounts, preventing memory leaks.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`).
-   `react-router-dom` (component: `Link`).
-   It imports a significant number of local image files from `../assets/assets_frontend/` to be used in the background slideshow.

---

### `components/ImageCropper.jsx`

**Component:** `ImageCropper`

A component that provides an interface for cropping images, acting as a wrapper for the `react-image-crop` library.

#### Purpose

To allow users to upload an image and select a specific area to be used, for example, as a profile picture. It is configured to enforce a square (1:1) aspect ratio for the crop selection.

#### State and Props

-   **Props**:
    -   `src`: The source URL or data URL of the image to be cropped.
    -   `onCropComplete`: A callback function that is triggered when the user finishes the crop selection. It receives the final cropped image as a Base64-encoded data URL.
-   **`useState` Hooks**:
    -   `crop`: An object that holds the state of the crop selection, including its aspect ratio, position, and size. It is initialized to maintain a 1:1 aspect ratio.
    -   `imageRef`: Stores a reference to the underlying `<img>` element once it has loaded, which is necessary for the cropping logic.

#### Logic and Features

-   **`onImageLoaded`**: A callback that runs when the source image has successfully loaded into the component. It saves a reference to the image element in the `imageRef` state.
-   **`onCropChange`**: This function is called continuously as the user drags and resizes the crop selection area, updating the `crop` state in real-time.
-   **`onCropCompleteInternal`**: This is the core function that performs the actual cropping when the user releases the mouse.
    1.  It creates a temporary, off-screen `<canvas>` element.
    2.  It calculates the scaling factor between the displayed image size and its natural (original) dimensions to ensure the crop is accurate.
    3.  It uses the canvas's 2D context (`ctx.drawImage`) to draw only the selected portion of the original, full-resolution image onto the canvas.
    4.  Finally, it converts the content of the canvas into a Base64-encoded JPEG data URL and passes this string to the parent component via the `onCropComplete` prop.

#### Dependencies

-   `react` (hooks: `useState`, `useCallback`).
-   `react-image-crop`: The external library that provides the cropping UI and core logic.

---

### `components/SpecialityMenu.jsx`

**Component:** `SpecialityMenu`

A presentational component that displays a grid of clickable medical specialty categories.

#### Purpose

This component is designed to be used on the homepage to help users quickly navigate to a list of doctors based on a specific area of expertise. It provides a high-level overview of the types of care available on the platform.

#### Structure and Features

-   **Data-Driven**: The component's content is generated from two hardcoded data structures:
    -   `specialityData`: An array of objects, each defining a specialty name.
    -   `iconMapping`: An object that maps each specialty name to a corresponding icon component from `react-icons`.
-   **Grid Layout**: The specialties are displayed in a responsive grid that adjusts the number of columns based on the screen size (2 on mobile, 3 on tablet, 6 on desktop).
-   **Interactive Links**: Each specialty is rendered as a `Link` component from `react-router-dom`. Although the navigation logic is currently commented out in the source code, it is intended to navigate the user to a filtered doctor list (e.g., `/doctors/Clinical%20Psychology`).
-   **Visuals**: Each category features a distinct icon and has hover effects to improve user experience.

#### State and Props

-   The component is stateless and does not accept any props.

#### Dependencies

-   `react`.
-   `react-router-dom` (component: `Link`).
-   `react-icons`: Uses icons from `fa`, `hi`, and `md` libraries.

---

### `components/Testimonials.jsx`

**Component:** `Testimonials`

A simple, presentational component that displays a collection of user testimonials.

#### Purpose

This component is used to build trust and social proof by showcasing positive feedback from users of the platform.

#### Structure and Features

-   **Data-Driven**: The content is generated by mapping over a hardcoded `testimonials` array of objects. Each object contains a `quote`, `name`, and an `image` URL.
-   **Grid Layout**: The testimonials are displayed in a responsive grid that adjusts to different screen sizes.
-   **Testimonial Card**: Each testimonial is rendered as a card containing the user's quote, their profile picture, and their name.
-   **Image Fallback**: An `onError` handler is attached to the `<img>` tag to replace any broken image links with a generic placeholder, preventing visual errors.

#### State and Props

-   The component is stateless and does not accept any props.

#### Dependencies

-   `react`.

---

### `components/Navbar.jsx`

**Component:** `Navbar`

This is the primary, responsive navigation bar for the application, fixed at the top of the viewport.

#### Purpose

The `Navbar` provides consistent navigation across the site. It adapts its layout for desktop and mobile screens and changes its appearance based on the user's authentication status.

#### Structure and Features

-   **Desktop View**:
    -   **Logo & Brand**: On the left, displays the Spiritus logo and name.
    -   **Navigation Links**: A centered list of main navigation links (`Home`, `Doctors`, `Awards`, etc.) rendered using `NavLink` to highlight the active page.
    -   **User Section**: On the right:
        -   If a user is logged in (a `token` exists), it displays their profile picture. Hovering over the picture reveals a dropdown menu with links to "My Profile," "My Appointments," and a "Logout" button.
        -   If the user is not logged in, it displays a "Create Account" button.
-   **Mobile View**:
    -   The centered navigation links are hidden.
    -   A hamburger menu icon is displayed on the right.
    -   **Slide-Out Menu**: Clicking the hamburger icon toggles a full-height menu that slides in from the right. This menu contains all the navigation links and the appropriate user section (profile links or a "Create Account" button), formatted for a mobile screen.
    -   An overlay is displayed behind the mobile menu, which closes the menu when clicked.

#### State and Context

-   **`AppContext` (`useContext`)**:
    -   `token`, `userData`: Used to conditionally render the user profile dropdown versus the "Create Account" button.
    -   `setToken`: Called during the logout process to update the global authentication state.
-   **`useState` Hooks**:
    -   `showMenu`: A boolean that controls the visibility of the slide-out mobile menu.

#### Logic and Functions

-   **`logout()`**: This function is called when the user clicks the "Logout" button. It removes the token from `localStorage`, sets the global `token` state to `false`, and navigates the user to the `/login` page.
-   **Responsive Design**: The component uses Tailwind CSS utility classes (e.g., `hidden md:flex`) to control the visibility of elements based on screen size, creating a fully responsive experience.

#### Dependencies

-   `react` (hooks: `useContext`, `useState`).
-   `react-router-dom` (components: `NavLink`, hook: `useNavigate`).
-   `../context/AppContext`.
-   `../assets/assets_frontend/assets`.

---

### `components/PopularDoctors.jsx`

**Component:** `PopularDoctors`

A component that displays a curated list of the most popular doctors on the platform, determined by the number of ratings they have received.

#### Purpose

This component is typically used on the homepage to highlight a selection of top-rated or frequently reviewed doctors, helping new users quickly discover reputable practitioners.

#### Logic and Features

-   **Data Source**: It consumes the global `doctors` array from the `AppContext`.
-   **Popularity Metric**: The component determines popularity by sorting the full list of doctors in descending order based on their number of ratings. It checks for a `ratingsCount` property or falls back to the length of a `ratings` array for this calculation.
-   **Curated List**: After sorting, it uses `.slice(0, 10)` to take only the top 10 most popular doctors to display.
-   **Doctor Cards**: It renders the doctors in a responsive grid. Each doctor is displayed on a card with:
    -   Their profile image.
    -   An availability indicator (a green or red dot and text).
    -   Their name and specialty.
    -   Their average star rating.
-   **Navigation**:
    -   Clicking on any doctor's card navigates the user to that doctor's detailed appointment page (`/appointment/:id`).
    -   A "More" button at the bottom of the section navigates the user to the main `/doctors` page to view all practitioners.

#### State and Props

-   The component is stateless and does not accept any props. It derives all its data from the `AppContext`.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `@/context/AppContext`.
-   `react-icons/fa` for the star icon.

---

### `components/ProfileCompletionGuard.jsx`

**Component:** `ProfileCompletionGuard`

This is a higher-order component that acts as a route guard, enforcing a mandatory, multi-step profile completion flow for newly registered users.

#### Purpose

The primary function of this guard is to ensure that users fill out all required profile information before they can access the main application. It checks for the completeness of the user's profile in a specific sequence and redirects them to the appropriate page if any step is missing.

#### Logic and Features

This component wraps around the main application's routes. For any authenticated user, it performs a series of checks on the `userData` object:

1.  **Image Check**: It first verifies if `userData.image` exists. If not, it redirects the user to the `/upload-profile-image` page.
2.  **Profile Details Check**: If the image exists but essential details (`phone`, `address`, `dob`, `gender`) are missing, it redirects the user to the `/complete-profile` page.
3.  **Questionnaire Check**: If the profile details are complete but the `questionnaire` data is missing, it redirects the user to the `/questionnaire` page.
4.  **Path Validation**: The guard includes logic to prevent redirect loops. It checks if the user is already on the correct page for their current completion step and does not redirect them in that case.
5.  **Pass-Through**: If all checks pass, it means the user's profile is complete, and the component simply renders its `children`, allowing the user to access the requested route.

#### State and Context

-   **`AppContext` (`useContext`)**: It relies heavily on the `token` and `userData` from the global context to determine the user's authentication and profile completion status.
-   **`location` (`useLocation`)**: It uses the `useLocation` hook to get the current URL path, which is essential for its redirect logic to avoid infinite loops.

#### Props

-   **`children`**: This component is designed to wrap other components (typically the main `Routes` setup). The `children` prop represents the component(s) that will be rendered if all the profile completion checks pass.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (component: `Navigate`, hook: `useLocation`).
-   `../context/AppContext`.

---

### `components/PromoVideo.jsx`

**Component:** `PromoVideo`

A simple, presentational component that displays a promotional video.

#### Purpose

This component is designed to embed a marketing or informational video within a page. It is configured to autoplay silently in a loop.

#### Structure and Features

-   The component consists of a single HTML5 `<video>` element.
-   The video source is imported locally from the project's assets.
-   The video is set to `autoPlay`, `muted`, and `loop` to ensure it plays continuously and unobtrusively.
-   The `controls` attribute is also present, allowing the user to interact with the video (play, pause, adjust volume).

#### State and Props

-   The component is stateless and does not accept any props.

#### Dependencies

-   `react`.
-   It imports a local video file from `../assets/video/mental.mp4`.

---

### `components/RelatedDoctors.jsx`

**Component:** `RelatedDoctors`

This component displays a list of doctors who are "related" to a currently viewed doctor, based on sharing the same specialty.

#### Purpose

Typically used on a doctor's detailed appointment page, this component helps with user discovery by suggesting other practitioners in the same field, excluding the one the user is already looking at.

#### Logic and Features

-   **Data Source**: It consumes the global `doctors` array from the `AppContext`.
-   **Filtering Logic**: An `useEffect` hook is triggered whenever the `doctors` list or the `speciality` and `docId` props change. It filters the main `doctors` list to create a new array (`relDoc`) containing only doctors who:
    1.  Match the `speciality` prop.
    2.  Do NOT match the `docId` prop (to avoid showing the same doctor).
-   **Curated Display**: It uses `.slice(0, 5)` to display only the first 5 related doctors found.
-   **Doctor Cards**: It renders the filtered doctors in a responsive grid, with each card showing the doctor's image, availability, rating, name, and specialty.
-   **Navigation**:
    -   Clicking on any related doctor's card navigates the user to that doctor's specific appointment page.
    -   A "More" button at the bottom navigates the user to the main `/doctors` directory page.

#### State and Props

-   **Props**:
    -   `speciality`: A string representing the specialty to filter by.
    -   `docId`: A string representing the ID of the currently viewed doctor, to exclude them from the list.
-   **`AppContext` (`useContext`)**: Provides the global `doctors` array.
-   **`useState` Hooks**:
    -   `relDoc`: An array that holds the filtered list of related doctors.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-router-dom` (hook: `useNavigate`).
-   `@/context/AppContext`.
-   `react-icons/fa` for the star icon.

---

### `components/BackgroundMusic.jsx`

**Component:** `BackgroundMusic`

This component plays continuous background music for authenticated users, providing a toggle button to mute or unmute the audio.

#### Purpose

The component enhances the user experience by adding ambient background music, which only plays when a user is logged in. It is designed to handle modern browser autoplay policies gracefully.

#### Structure and Features

-   **Conditional Rendering**: The entire component returns `null` and does not render if no `token` is found in the `AppContext`, ensuring music only plays for logged-in users.
-   **Audio Player**: It uses a standard HTML `<audio>` element with the `loop` attribute to play a music file from a Cloudinary URL.
-   **Mute/Unmute Toggle**: A floating button in the bottom-right corner of the screen allows the user to toggle the audio. The icon changes between `FaVolumeUp` and `FaVolumeMute` to reflect the current state.
-   **Autoplay Policy Handling**:
    -   On initial load, it attempts to autoplay the audio in a `muted` state to comply with browser restrictions.
    -   It uses a `hasInteracted` state flag to detect the user's first click on the toggle button. This first interaction is used to explicitly call `audioRef.current.play()` to ensure the audio context is unlocked, allowing unmuted playback.
    -   Subsequent clicks simply toggle the `muted` property of the audio element.

#### State and Context

-   **`AppContext` (`useContext`)**: Uses the `token` to determine if the component should render.
-   **`useState` Hooks**:
    -   `isMuted`: A boolean that tracks the muted state to display the correct volume icon.
    -   `hasInteracted`: A boolean to manage the initial user interaction required to enable unmuted audio playback.
-   **`useRef` Hook**:
    -   `audioRef`: Holds a reference to the `<audio>` element, allowing for programmatic control (e.g., `audioRef.current.play()`, `audioRef.current.muted`).

#### Dependencies

-   `react` (hooks: `useRef`, `useContext`, `useState`, `useEffect`).
-   `@/context/AppContext`.
-   `react-icons/fa` for the volume icons.

---

### `components/Banner.jsx`

**Component:** `Banner`

A presentational component that displays a large, visually appealing promotional banner.

#### Purpose

This component serves as a strong call to action, encouraging users to sign up and book an appointment. It combines a background image, engaging text, and a clear button to guide user behavior.

#### Structure and Features

-   **Inspirational Quote**: A centered text block displays the quote: "Cleanse your mind and spirit with us, an Abyss is no place to Be."
-   **Main Banner**:
    -   A container with a background image (`bg9`).
    -   A text section on the left with the primary call to action: "Book Appointment With 100+ Trusted Doctors".
    -   A "Create Account" button which, when clicked, navigates the user to the `/login` page and scrolls the window to the top.
    -   An image of a doctor (`assets.appointment_img`) is displayed on the right side on medium and larger screens, but is hidden on mobile to save space.

#### State and Props

-   The component is stateless and does not accept any props. It uses the `useNavigate` hook from `react-router-dom` for navigation.

#### Dependencies

-   `react`.
-   `react-router-dom` (for `useNavigate` and `Link`).
-   `@/assets/assets_frontend/assets`.
-   `@/assets/assets_frontend/bg9.jpg`.

---

### `pages/UserPrescription.jsx`

**Component:** `UserPrescription`

This page is responsible for displaying the details of a medical prescription associated with a completed appointment.

#### Purpose

The primary function of this component is to allow users to view and download their prescription. It shows both the textual report written by the doctor and an image of the formal prescription.

#### Data Flow and Context

-   **`location` (`useLocation`)**: The component expects an `appointment` object to be passed via the router's `location.state`. This is crucial for identifying which prescription to fetch.
-   **`AppContext` (`useContext`)**: It uses the `getPrescription` function from the global context to fetch the prescription data for the given appointment ID.

#### State Management

-   **`useState` Hooks**:
    -   `prescriptionData`: An object that stores the fetched prescription details, including the `report` text and the `prescriptionFile` URL.

#### Structure and Features

-   **Data Fetching**: A `useEffect` hook triggers the `getPrescription` function when the component mounts, using the `appointment._id` from the location state.
-   **Report Display**: The doctor's textual report is displayed in a formatted block.
-   **Prescription Image**: The image of the prescription (hosted on Cloudinary) is displayed.
-   **Download Functionality**:
    -   A "Download" button is provided.
    -   The `handleDownload` function fetches the image file from its URL as a blob.
    -   It then creates a temporary object URL for the blob and programmatically clicks an `<a>` tag to trigger a browser download, a common technique to handle cross-origin file downloads.
-   **Navigation**: A "Back to Appointments" button allows the user to easily return to the previous page.
-   **Empty State**: If no appointment data is passed or if no prescription is found, the component renders a "No prescription or report available" message.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`, `useContext`).
-   `react-router-dom` (hooks: `useLocation`, `useNavigate`).
-   `lucide-react` for icons.
-   `../context/AppContext`.

---

### `pages/UploadProfileImage.jsx`

**Component:** `UploadProfileImage`

This page is a dedicated step in the user onboarding process, focused solely on uploading a profile picture immediately after registration.

#### Purpose

The main goal of this component is to provide a simple, user-friendly interface for new users to add their first profile picture. Upon successful upload, it directs them to the next step in the onboarding flow.

#### Structure and Features

-   **Image Preview**: A large, circular image preview area is the central element. It initially shows a placeholder icon or the user's existing image if they have one.
-   **File Input**: The entire preview area acts as a `label` for a hidden file input, making it intuitive for users to click and select an image.
-   **Live Preview**: When a user selects a file, `URL.createObjectURL()` is used to generate an immediate local preview of the image without waiting for an upload.
-   **Upload Button**: A button to trigger the upload process. It displays a "Uploading..." message and is disabled during the API call to prevent multiple submissions.

#### State and Context

-   **`AppContext` (`useContext`)**: It relies on the global context for `backendUrl` and `token` to make the authenticated API request, and `loadUserProfileData` to refresh the user's data after the upload is complete.
-   **`useState` Hooks**:
    -   `profileFile`: Holds the `File` object of the image selected by the user.
    -   `previewUrl`: Stores the temporary local URL generated for the image preview.
    -   `isUploading`: A boolean flag to manage the loading state of the upload button.

#### API Call and Logic

-   **`handleFileChange(e)`**: This function is triggered when the user selects a file. It updates the `profileFile` state with the file itself and the `previewUrl` state with the local blob URL for the preview.
-   **`uploadUserImage()`**: This async function is called when the user clicks the "Save Profile Image" button.
    1.  It first checks if a file has been selected.
    2.  It creates a `FormData` object to properly package the image file for the request.
    3.  It sends a `POST` request to the `/api/user/upload-profile-image` endpoint.
    4.  On success, it shows a success toast, refreshes the user data in the context, and navigates the user to the `/complete-profile` page to continue onboarding.

#### Dependencies

-   `react` (hooks: `useState`, `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `@/context/AppContext`.

---

### `pages/TherapyQuestionnaire.jsx`

**Component:** `TherapyQuestionnaire`

This component is nearly identical in structure to the `Questionnaire` component but serves a different purpose. It guides a user through a series of questions and then provides an immediate, simple recommendation based on their answers.

#### Purpose

The goal of this questionnaire is to give users instant feedback on whether therapy might be a beneficial next step for them. Unlike the other questionnaire which just stores data, this one processes the answers to generate a result.

#### Structure and Features

-   **Multi-Step Interface**: Presents one question at a time with "Next" and "Previous" navigation.
-   **Progress Bar**: Shows the user their progress through the questions.
-   **Input Validation**: The "Next" button is disabled until the current question is answered.
-   **Result Screen**: After the final question is answered and submitted, the component's view changes to display the recommendation received from the backend. An "OK" button then navigates the user back to the homepage.

#### State and Context

-   **`AppContext` (`useContext`)**: Uses `backendUrl` and `token` for the API call.
-   **`useState` Hooks**:
    -   `currentStep`: An integer to track the current question index.
    -   `answers`: An object to store the user's answers.
    -   `result`: An object that stores the response from the API (`{ needsTherapy: boolean, recommendations: string }`). Its presence triggers the display of the result screen.

#### API Call and Logic

-   **`handleSubmit()`**: This is the key function.
    -   It sends a `POST` request to the `/api/user/therapy-qns` endpoint with the collected `answers`.
    -   The backend processes these answers and returns a JSON object with a `needsTherapy` flag and a `recommendations` string.
    -   The component then sets this response object into its `result` state, which causes the UI to re-render and show the recommendation to the user.

#### Dependencies

-   `react` (hooks: `useState`, `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `../context/AppContext`.

---

### `pages/Questionnaire.jsx`

**Component:** `Questionnaire`

This component guides the user through a multi-step questionnaire, typically as part of the onboarding process after completing their profile.

#### Purpose

The primary goal of this page is to gather essential information about the user's background, current situation, and primary concerns. This data can be used to tailor the user's experience or provide better matches with therapists.

#### Structure and Features

-   **Multi-Step Interface**: The questionnaire presents one question at a time, preventing the user from being overwhelmed by a long form.
-   **Progress Bar**: A visual progress bar at the top of the page shows the user how close they are to completion.
-   **Question Types**: The component is designed to handle different types of questions, including:
    -   **Radio Buttons**: For single-choice answers.
    -   **Dropdowns**: For questions with a long list of options, like selecting a country.
-   **Navigation**:
    -   "Next" and "Previous" buttons allow the user to navigate back and forth between questions.
    -   The "Next" button is disabled until the user selects an answer for the current question, ensuring all questions are answered.
-   **Submission**: On the final question, the "Next" button's text changes to "Submit". Clicking it triggers the submission of all collected answers to the backend.

#### State and Context

-   **`AppContext` (`useContext`)**: Uses the global context to get the `backendUrl` and `token` for the API request, and the `loadUserProfileData` function to refresh the user's profile data after the questionnaire is successfully submitted.
-   **`useState` Hooks**:
    -   `currentStep`: An integer that keeps track of the index of the current question being displayed.
    -   `answers`: An object that stores the user's answers. The keys are the question IDs, and the values are the selected answers.

#### API Call and Data Handling

-   **`handleSubmit()`**: This asynchronous function is called when the user clicks "Submit" on the last step.
    -   It sends a `POST` request to the `/api/user/submit-questionnaire` endpoint.
    -   The request body contains the `answers` object.
    -   Upon a successful response, it displays a success toast, refreshes the user's profile data in the global state, and navigates the user to the homepage (`/`).

#### Dependencies

-   `react` (hooks: `useState`, `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `../context/AppContext`.

---

### `pages/CompleteProfile.jsx`

**Component:** `CompleteProfile`

This page presents a form for newly registered users to complete their profile with essential personal information. It's a key step in the onboarding process.

#### Purpose

The main goal of this component is to gather additional user data—specifically phone number, date of birth, gender, and address—that was not collected during the initial registration. After a successful submission, it automatically directs the user to the next step in the onboarding flow, the questionnaire.

#### State and Context

-   **`AppContext` (`useContext`)**: Leverages the global context to get `backendUrl` and `token` for the API call, `loadUserProfileData` to refresh the user's data in the context after the update, and `userData` to pre-fill the user's name in the request payload.
-   **`useState` Hooks**:
    -   `formData`: An object that holds the state for all form inputs, including a nested `address` object.
    -   `isSubmitting`: A boolean flag to manage the UI during the API request, providing visual feedback and preventing duplicate submissions by disabling the submit button.

#### Form Handling and API Call

-   **`handleChange`, `handleAddressChange`**: These functions update the `formData` state as the user types into the input fields. `handleAddressChange` specifically manages the nested `address` object.
-   **`handleSubmit`**: This asynchronous function is triggered on form submission. It performs the following actions:
    1.  Sets `isSubmitting` to `true`.
    2.  Constructs the `payload` for the API request, combining the existing `userData.name` with the new form data. Notably, the `address` object is converted to a JSON string using `JSON.stringify()` before being sent.
    3.  Makes a `PUT` request to the `/api/user/update-profile` endpoint.
    4.  On success, it shows a success toast, refreshes the user data in the context by calling `loadUserProfileData`, and navigates the user to the `/questionnaire` page.
    5.  On failure, it displays an error toast.
    6.  Finally, it resets `isSubmitting` to `false`.

#### Dependencies

-   `react` (hooks: `useState`, `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for the API request.
-   `react-toastify` for notifications.
-   `@/context/AppContext`.

---

### `pages/Contact.jsx`

**Component:** `Contact`

This is a multi-functional page that serves as the main contact point for the platform. It includes a general contact form, as well as comprehensive, toggleable registration forms for both individual practitioners and medical facilities.

#### Purpose

The `Contact` page is designed to handle three distinct user interactions:
1.  Allow general users to send a message or feedback to the platform administrators.
2.  Provide a detailed application form for doctors and other mental health practitioners who wish to join the network.
3.  Provide a detailed application form for hospitals, clinics, and other facilities wishing to be listed on the platform.

#### Structure and Features

-   **General Contact Form**: A simple form that collects a name, email, and message, submitting the data to the feedback endpoint.
-   **Registration Toggles**: The page features two primary sections that act as toggles. Clicking "Join as Practitioner" or "Enroll Facility" reveals the corresponding detailed registration form.
-   **Doctor Registration Form**: A comprehensive, multi-step form for individual practitioners. It collects a wide range of data, including:
    -   Personal and contact information.
    -   Professional details (designation, qualifications, experience, license number).
    -   Practice location, specializations, fees, and languages spoken.
    -   File uploads for a profile photo and license certificate.
-   **Facility Registration Form**: An equally detailed form for hospitals and clinics, collecting:
    -   Facility name, type, and establishment year.
    -   Location and contact information.
    -   Details on services, staff size, patient load, and accreditations.
    -   File uploads for the facility's license and logo.
-   **Dynamic Dropdowns**: The registration forms include dropdowns for country, state, and district, where the options for state and district are dynamically populated based on the selected country and state.
-   **Form Submission State**: Each of the three forms manages its own loading and submission status. After a successful submission, the form is replaced with a "Thank You" message and can be reset to allow for another submission.
-   **Location Map**: The page concludes with an embedded Google Map showing the physical location of the organization.

#### State Management

-   **`formData`, `hospitalFormData`, `doctorFormData`**: Three separate state objects, each managing the data for one of the forms on the page.
-   **`loading`, `hospitalFormLoading`, `doctorFormLoading`**: Individual boolean flags to track the submission status of each form and provide visual feedback (e.g., a loading spinner on the submit button).
-   **`formSubmitted`, `hospitalFormSubmitted`, `doctorFormSubmitted`**: Boolean flags used to conditionally render the success/thank you message after a form is submitted.
-   **`showHospitalForm`, `showDoctorForm`**: Boolean flags that control the visibility of the two large registration forms.

#### API Calls

-   **`handleSubmit()`**: Sends a `POST` request to `/api/user/submit-feedback`.
-   **`handleHospitalFormSubmit()`**: Constructs a `FormData` object to handle file uploads and sends a `POST` request to `/api/user/submit-hospital-registration`.
-   **`handleDoctorFormSubmit()`**: Also uses `FormData` and sends a `POST` request to `/api/user/submit-doctor-registration`.

#### Dependencies

-   `react` (hook: `useState`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `lucide-react` for icons.

---

### `pages/MyAppointments.jsx`

**Component:** `MyAppointments`

This page serves as the user's personal dashboard for managing all their past, present, and future medical appointments.

#### Purpose

The component provides a centralized view for users to track their appointment history and take action on upcoming consultations. Key functionalities include:
1.  Viewing a comprehensive list of all appointments.
2.  Filtering appointments by status (e.g., "Active", "Upcoming", "Completed").
3.  Searching for specific appointments by doctor, specialty, or date.
4.  Providing contextual actions for each appointment, such as paying, canceling, or joining a video call.

#### Structure and Features

-   **Dashboard Layout**: The page is organized with a header, a search/filter bar, and a main content area that lists the appointments.
-   **Search and Filter**:
    -   A search bar allows users to find appointments quickly.
    -   A set of filter buttons allows users to toggle between views like "All", "Active", "Upcoming", "Completed", and "Cancelled".
-   **Grouped Appointment List**:
    -   Appointments are programmatically grouped by date for better readability.
    -   Each appointment is displayed on a detailed card showing the doctor's image, name, and specialty.
-   **Contextual Actions**: The actions available on each appointment card are conditionally rendered based on its status:
    -   **Pay Now**: Appears for unpaid appointments and navigates the user to the `/checkout` page.
    -   **Cancel**: Appears for appointments that are not yet completed or cancelled.
    -   **Join Meeting**: Appears for online appointments shortly before (15 mins) and after (60 mins) the scheduled time.
    -   **View Prescription**: Appears for completed appointments.
    -   **Book a Cab**: Appears for paid, offline appointments.
-   **Status and Mode Display**: Each card clearly indicates the appointment's status (e.g., "Upcoming," "Active," "Completed") and consultation mode ("Online" or "Offline").
-   **Map Modal**: For offline appointments, a "View on Map" button is available, which opens a modal displaying the doctor's clinic location on an embedded Google Map.
-   **Loading and Empty States**: The component displays a loading spinner while fetching data and shows a user-friendly message if the user has no appointments or if no appointments match the current filters.

#### State and Context

-   **`AppContext` (`useContext`)**: Fetches `backendUrl`, `token`, and the `getDoctorsData` function from the global context.
-   **`useState` Hooks**:
    -   `appointments`: An array to store the fetched list of the user's appointments.
    -   `isLoading`: A boolean to manage the loading UI state.
    -   `activeFilter`: A string that holds the current status filter (e.g., "upcoming").
    -   `searchQuery`: Stores the current value from the search input.
    -   `showMapModal`, `selectedAddress`: Manage the visibility and data for the map modal.

#### Helper Functions and API Calls

-   **`getUserAppointments()`**: An async function that sends an authenticated `GET` request to `/api/user/appointments` to fetch the user's data.
-   **`cancelAppointment(appointmentId)`**: An async function that sends a `POST` request to `/api/user/cancel-appointment`.
-   **`filterAppointments()` and `groupAppointmentsByDate()`**: Functions that process the raw appointment data for display, first by filtering based on the active filter and search query, and then by grouping the results by date.
-   **Time-Based Logic**: Several helper functions (`isJoinButtonVisible`, `shouldShowScheduledMessage`, `isAppointmentCompleted`, `getAppointmentStatus`) contain the logic to determine what UI elements and statuses to display based on the current time relative to the appointment's scheduled time.
-   **Date/Time Formatting**: `slotDateFormat` and `formatTo12Hour` are used to present dates and times in a user-friendly format.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `axios` for API calls.
-   `react-router-dom` (hook: `useNavigate`).
-   `react-toastify` for notifications.
-   `@/context/AppContext`.

---

### `pages/Home.jsx`

**Component:** `Home`

This component serves as the main landing page of the Spiritus application. It is primarily a structural component that aggregates several other specialized components to build the homepage view.

#### Purpose

The `Home` page is the primary entry point for most users. Its purpose is to provide a comprehensive overview of the platform's offerings, guide users to key sections, and build trust. It achieves this by composing various child components, each responsible for a specific section of the page.

#### Structure

The component renders the following child components in sequence:

-   **`Header`**: The main hero section at the top of the page, likely containing a call to action.
-   **`SpecialityMenu`**: A menu or section that displays different medical specialities, allowing users to navigate directly to filtered doctor lists.
-   **`TopDoctors`**: A component that showcases a list of top-rated or featured doctors.
-   **`TopHospitals`**: A component that showcases a list of top-rated or featured hospitals.
-   **`Banner`**: A promotional banner, likely for a specific campaign or feature.
-   **`Testimonials`**: A section displaying user testimonials to build social proof.
-   **Crisis Warning Section**: A static section at the bottom of the page that provides a prominent link to the "Get Help Now" page for users in crisis.

#### State and Props

-   The `Home` component is stateless and does not accept any props. Its role is purely presentational and structural.

#### Dependencies

-   `react`.
-   `framer-motion`: Used for animations, although not directly in this component, it's likely used in the child components.
-   It imports several child components from the `@/components/` directory, which are responsible for their own logic and data fetching.

---

### `pages/HospitalDetails.jsx`

**Component:** `HospitalDetails`

This page displays detailed information about a specific hospital, including its name, address, and a list of doctors associated with it.

#### Purpose

The main function of this page is to act as a public-facing profile for a hospital listed on the platform. It allows users to see which doctors are available at that location and provides a direct pathway to book an appointment with them.

#### Data Fetching

-   **`hospitalId` (`useParams`)**: Retrieves the hospital's ID from the URL.
-   **`useEffect` Hook**: Triggers the data fetching process when the component mounts or when the `hospitalId` changes.
-   **Parallel API Calls**: Inside `useEffect`, it uses `Promise.all` to fetch both the hospital's details and the list of its doctors simultaneously for better performance.
    -   `GET /api/user/hospital/:hospitalId`: Fetches the main hospital data.
    -   `GET /api/user/hospital/:hospitalId/doctors`: Fetches the array of associated doctors.
-   **Error Handling**: The component gracefully handles errors. If the primary hospital data fails to load, an error message is displayed. If only the doctor list fails, a toast notification is shown, but the page still renders the hospital information.

#### State Management

-   **`useState` Hooks**:
    -   `hospital`: Stores the object containing the fetched hospital details.
    -   `doctors`: An array to store the list of associated doctors.
    -   `loading`: A boolean to manage the loading state, showing a spinner while API calls are in progress.
    -   `error`: A state to hold any critical error messages that occur during data fetching.

#### Structure and Features

-   **Loading and Error States**: The component renders a `LoadingSpinner` while fetching data and an `ErrorDisplay` component if a critical error occurs, preventing the page from crashing and informing the user.
-   **Hospital Header**: A clean header section displays the hospital's name and address.
-   **Doctors Grid**:
    -   Displays the associated doctors in a responsive grid.
    -   Each doctor is shown on a card that includes their image, availability status, average rating, name, and specialty.
    -   Each card is clickable and navigates the user to the respective doctor's appointment page (`/appointment/:id`).
-   **Empty State**: If a hospital has no doctors listed, a message is displayed to inform the user.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-router-dom` (hooks: `useParams`, `useNavigate`).
-   `axios` for API calls.
-   `react-toastify` for non-critical error notifications.
-   `../context/AppContext` for the `backendUrl`.
-   `react-icons/fa` for the star icon.

---

### `pages/Hospitals.jsx`

**Component:** `Hospitals`

This page serves as a directory for users to browse, search, and filter all the healthcare facilities listed on the platform.

#### Purpose

The primary function of this page is to allow users to discover hospitals, clinics, and other mental health facilities. Users can filter the list by facility type or use a search bar to find facilities based on name, location, or specializations.

#### Structure and Features

-   **Search and Filter Panel**:
    -   A main search bar at the top allows for free-text searching.
    -   A sidebar provides a list of facility types (e.g., 'Hospital', 'Clinic', 'Government') that act as filters.
    -   On mobile devices, the sidebar is replaced by a collapsible filter menu to save space.
-   **Dynamic Filtering**:
    -   The component filters the list of hospitals based on the `selectedType` and the `searchTerm`.
    -   The `hospitalType` can also be set via a URL parameter (`/hospitals/:hospitalType`), allowing for direct links to pre-filtered views.
-   **Hospital Grid**:
    -   The filtered results are displayed in a responsive grid.
    -   Each hospital is represented by a card showing its logo, name, average rating, type, emergency support status, location, and a preview of its specializations.
    -   Clicking on a hospital card navigates the user to that hospital's detailed profile page (`/hospital/:id`).
-   **No Results State**: If no hospitals match the current filter or search term, a message is displayed, along with a button to clear the filters and view all hospitals.

#### State and Context

-   **`hospitalType` (`useParams`)**: Retrieves an initial filter value from the URL, if present.
-   **`hospitals` (`useContext(AppContext)`)**: Accesses the global list of all hospital data from the application's context.
-   **`useState` Hooks**:
    -   `filterHospitals`: An array that holds the final list of hospitals to be rendered after filtering.
    -   `showFilter`: A boolean to manage the visibility of the filter menu on mobile.
    -   `searchTerm`: Stores the current text from the search input field.
    -   `selectedType`: Stores the currently active facility type filter (e.g., 'clinic', 'all').

#### Helper Functions and Effects

-   **`applyFilter()`**: This is the core logic function. It takes the global `hospitals` array and filters it based on the `selectedType` and `searchTerm` states to produce the `filterHospitals` list. The search is comprehensive, checking against the hospital's name, type, address, district, and specializations.
-   **`useEffect` Hook**: This hook re-runs the `applyFilter` function whenever the source data or any of the filter criteria change, ensuring the displayed grid is always up-to-date.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`, `useContext`).
-   `react-router-dom` (hooks: `useParams`, `useNavigate`).
-   `../context/AppContext`.
-   `react-icons/fa` for icons.

---

### `pages/MyProfile.jsx`

**Component:** `MyProfile`

This page displays the profile information of the currently authenticated user and provides functionality to edit and update their details.

#### Purpose

The `MyProfile` component serves as the user's personal information hub. It allows them to:
1.  View their current profile data, including name, email, phone number, and address.
2.  Switch to an "edit mode" to update their information.
3.  Upload a new profile picture.
4.  Save the changes to the backend.

#### Structure and Features

-   **View/Edit Toggle**: The entire component's interactivity is controlled by an `isEdit` boolean state.
    -   In **View Mode**, user data is displayed as static text (`<p>` tags). An "Edit Profile" button is visible.
    -   In **Edit Mode**, the static text fields are replaced with input controls (`<input>`, `<select>`). The profile picture becomes a clickable file input, and a "Save" button replaces the "Edit" button.
-   **Profile Picture Handling**: In edit mode, clicking the profile picture opens a file dialog. If a new image is selected, a local preview is immediately generated using `URL.createObjectURL()`.
-   **Inline Editing**: When in edit mode, the component's input fields directly modify the `userData` object stored in the `AppContext`. This provides a seamless editing experience.
-   **Data Submission**:
    -   The `updateUserProfileData` function is called when the "Save" button is clicked.
    -   It constructs a `FormData` object, which is necessary to handle the potential file upload of the new profile image.
    -   It sends a `POST` request to the `/api/user/update-profile` endpoint with all the user data.
    -   Upon a successful update, it refreshes the user data in the global context by calling `loadUserProfileData`, shows a success toast, and switches back to view mode.

#### State and Context

-   **`AppContext` (`useContext`)**: This component is heavily reliant on the global context. It uses:
    -   `userData`: To display the profile information.
    -   `setUserData`: To enable live editing of the profile data directly in the form fields.
    -   `token`: To authorize the update request.
    -   `backendUrl`: For constructing the API endpoint URL.
    -   `loadUserProfileData`: To refresh the context with the latest user data after a successful update.
-   **`useState` Hooks**:
    -   `isEdit`: A boolean that toggles the component between view and edit modes.
    -   `image`: Holds the new image file selected by the user, or `false` if no new image is selected.

#### Dependencies

-   `react` (hooks: `useState`, `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `@/context/AppContext`.

---

### `pages/MindReader.jsx`

**Component:** `MindReader`

This component is a multi-step questionnaire designed to provide users with a preliminary self-assessment of their mental health, based on the standard PHQ-9 depression screening tool.

#### Purpose

The `MindReader` page serves as a guided tool for users who may be questioning whether they need professional help. It aims to:
1.  Present a series of validated questions in a user-friendly, one-at-a-time format.
2.  Calculate a score based on the user's answers.
3.  Provide a clear, categorized result (e.g., "Minimal", "Mild", "Severe depression").
4.  Offer a tailored suggestion for next steps based on the result.
5.  Display a critical safety warning if the user indicates any thoughts of self-harm.

#### Structure and Features

-   **Introduction Screen**: Before the questionnaire begins, an initial screen explains the tool's purpose and includes a prominent disclaimer and crisis warning.
-   **Multi-Step Questionnaire**:
    -   The component renders one question at a time, preventing the user from feeling overwhelmed.
    -   Each question has four standardized answer options.
    -   Navigation is controlled by "Next" and "Back" buttons. The "Next" button is disabled until an answer is selected for the current question.
    -   A progress bar and step indicator (`Step 1 of 9`) provide clear feedback on the user's progress.
-   **Results Screen**:
    -   After the last question, the component calculates and displays the user's total score.
    -   It shows a qualitative result (e.g., "Moderate depression") with corresponding color-coding.
    -   A paragraph provides a non-clinical suggestion for what the user might do next.
    -   If applicable, a high-priority "Crisis Alert" is shown.
    -   The results screen provides clear calls to action: "Return Home" or "Schedule Therapy".
-   **Local Storage Persistence**: The component saves the user's answers to `localStorage` as they progress, allowing them to close the tab and resume the questionnaire later. The data is cleared once the results are shown.

#### State Management

-   **`useState` Hooks**:
    -   `hasStarted`: A boolean to toggle between the introduction screen and the questionnaire itself.
    -   `currentStep`: An integer that tracks which question is currently displayed.
    -   `answers`: An object that stores the user's selected answer (as an index) for each question's ID.
    -   `showResult`: A boolean that controls the transition from the last question to the results screen.
    -   `score`: A number that holds the final calculated score.

#### Helper Functions and Logic

-   **`useEffect` Hooks**: Two `useEffect` hooks manage the saving and loading of answers to and from `localStorage`.
-   **`calculateScore()`**: This function is called after the last question. It iterates through the `answers` object, sums the corresponding point values from the `questions` array, updates the `score` state, and sets `showResult` to `true`.
-   **`getResult()`**: This function interprets the final `score`. Based on the score, it returns an object containing the result `level` (e.g., 'Mild depression'), UI color codes, a `suggestion` string, and a `showCrisisAlert` boolean.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`).
-   `lucide-react` for icons.

---

### `pages/Login.jsx`

**Component:** `Login`

This component provides a unified interface for both user registration ("Sign Up") and authentication ("Login"). It functions as a modal-style page, overlaying a background image.

#### Purpose

The primary goal of this component is to manage user access. It allows new users to create an account and existing users to sign in. Based on its state, it dynamically adjusts the form and the API endpoint it communicates with.

#### State and Context

-   **`AppContext` (`useContext`)**: Interacts with the global context to get the `backendUrl` for API calls and to `setToken` in the application's state upon a successful login or registration.
-   **`useState` Hooks**:
    -   `state`: A string (`"Sign Up"` or `"Login"`) that controls the component's mode. This determines the form's title, the fields displayed (the "Full Name" input is only shown for "Sign Up"), and the API endpoint to be called.
    -   `name`, `email`, `password`: Standard state variables to hold the values from the form inputs.

#### Form Handling and API Calls

-   **`onSubmitHandler(event)`**: This is the core function that handles the form submission.
    -   If `state` is "Sign Up", it sends a `POST` request to `/api/user/register`. Upon success, it saves the received token to `localStorage`, updates the global context, and navigates the user to the `/upload-profile-image` page to continue onboarding.
    -   If `state` is "Login", it sends a `POST` request to `/api/user/login`. Upon success, it saves the token and updates the context. The `useEffect` hook then handles the redirection.
    -   In case of any API errors, it displays a notification to the user using `react-toastify`.
-   **Redirection Logic**:
    -   A `useEffect` hook runs whenever the `token` in the context changes. If a token is present, it immediately navigates the user to the homepage (`/`), preventing authenticated users from accessing the login page.
    -   A close button in the top-right corner allows users to exit the login/signup flow and return to the homepage.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `axios` for API requests.
-   `react-router-dom` (hook: `useNavigate`).
-   `react-toastify` for displaying notifications.
-   `@/context/AppContext`.

---

### `pages/HospitalAppointments.jsx`

**Component:** `HospitalAppointments`

This page is designed for authenticated hospital administrators to view a comprehensive list of all appointments scheduled with doctors associated with their facility.

#### Purpose

The primary goal of this component is to provide an administrative overview of appointment activity within the hospital. It allows staff to track patient bookings across all their affiliated doctors.

#### State and Context

-   **`HospitalContext` (`useContext`)**: This is the key to the component's functionality. It retrieves the `backendUrl` for making API calls and, most importantly, the `hToken` (hospital authentication token) required to authorize the request.
-   **`useState` Hooks**:
    -   `appointments`: An array that stores the list of appointment objects fetched from the backend.
    -   `loading`: A boolean flag that controls the display of a loading spinner while the API request is in progress.

#### Data Fetching

-   **`fetchAppointments()`**: This asynchronous function sends an authenticated `GET` request to the `/api/hospital/appointments` endpoint.
-   **`useEffect` Hook**: This hook triggers the `fetchAppointments` function as soon as the `hToken` becomes available from the context, ensuring that data is fetched only when the user is properly authenticated.

#### Structure and Features

-   **Table View**: The main feature is a detailed, responsive table that lists all appointments. The table includes the following columns:
    -   Patient Name and Email.
    -   Doctor Name and Specialty.
    -   Appointment Date and Time.
    -   Status (e.g., "Scheduled", "Completed", "Cancelled"), displayed with color-coded badges.
    -   Appointment Fee.
    -   Payment Status ("Paid" or "Pending").
-   **Loading State**: While the data is being fetched, a loading spinner is displayed to provide feedback to the user.
-   **Empty State**: If no appointments are found for the hospital, a user-friendly message with an icon is shown instead of an empty table.
-   **Helper Functions**:
    -   `formatDate(slotDate)`: A utility to convert the date format from the backend (e.g., "DD_MM_YYYY") into a more readable string (e.g., "Aug 2, 2024").
    -   `getStatus(appointment)`: A function that determines the correct status text and color-coding based on the appointment's boolean flags (`isCompleted`, `cancelled`).

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `axios` for API communication.
-   `react-toastify` for displaying error notifications.
-   `../context/HospitalContext`: Provides the necessary authentication token and backend URL.

---

### `pages/GetHelpNow.jsx`

**Component:** `GetHelpNowPage`

This is a static but crucial page designed to provide users with quick access to emergency services and mental health crisis helplines for various countries.

#### Purpose

The primary goal of this page is to be a readily available resource for users who may be in a crisis or in immediate need of professional help. It aggregates important contact information and directs users to the appropriate local services.

#### Structure and Features

-   **Country Selector**: The main interactive element is a dropdown menu that allows the user to select their country from a predefined list (`India`, `United States`, `United Kingdom`, etc.).
-   **Dynamic Resource Display**:
    -   Based on the selected country, the page dynamically displays a list of relevant resources.
    -   For each country, it shows the primary **emergency number** (e.g., 911, 112).
    -   It then lists several **helplines**, each with its name, phone number, and a link to its website.
    -   Phone numbers are rendered as clickable `tel:` links, and websites are `<a>` tags that open in a new tab.
-   **Hardcoded Data**: All helpline information is stored locally within the component in a large JavaScript object called `helplineData`. This ensures that the information is available immediately without needing an API call, which is critical for an emergency resource page.
-   **Disclaimer**: The page includes a disclaimer stating that the platform is not responsible for the services provided by the listed entities and asks users to report any inaccuracies.

#### State Management

-   **`useState` Hooks**:
    -   `selectedCountry`: Stores the string of the currently selected country (e.g., "India"). This state determines which set of helpline data is displayed.
    -   `isDropdownOpen`: A boolean that toggles the visibility of the country selection dropdown menu.
    -   `isMobileMenuOpen`: A state for managing a mobile menu, though it appears to be unused in the current implementation of the main content.

#### Dependencies

-   `react` (hook: `useState`).
-   `lucide-react` for icons.

---

### `pages/Doctors.jsx`

**Component:** `Doctors`

This page serves as a directory for users to find, filter, and search for doctors available on the platform.

#### Purpose

The primary function of this page is to provide a user-friendly interface for discovering doctors. Users can narrow down the list based on medical specialty, spoken language, or a text-based search.

#### Structure and Features

-   **Search and Filter Panel**:
    -   A prominent search bar allows users to type in a doctor's name or specialty.
    -   A sidebar contains a list of selectable specialties and a dropdown for filtering by language.
    -   On mobile, the filter sidebar is collapsible and can be toggled with a "Show/Hide Filters" button.
-   **Dynamic Filtering**:
    -   The list of doctors updates in real-time as the user types in the search bar or selects a language.
    -   The page can be loaded with a pre-selected filter by navigating to a URL like `/doctors/:speciality`.
    -   Clicking a specialty button updates the URL and filters the list accordingly.
-   **Doctor Grid**:
    -   The filtered doctors are displayed in a responsive grid.
    -   Each doctor is represented by a card that shows their profile image, availability status (a green or red dot), average rating, name, and specialty.
    -   Clicking on any doctor's card navigates the user to that doctor's detailed appointment page (`/appointment/:id`).
-   **No Results State**: If the current filters or search term yield no results, a message is displayed informing the user, along with a button to reset the view and show all doctors.

#### State and Context

-   **`speciality` (`useParams`)**: Retrieves the specialty from the URL, allowing for direct links to filtered views.
-   **`doctors` (`useContext(AppContext)`)**: Accesses the global list of all doctors from the application's context.
-   **`useState` Hooks**:
    -   `filterDoc`: An array that holds the list of doctors after all filters (specialty, language, search term) have been applied. This is the list that gets rendered.
    -   `showFilter`: A boolean to control the visibility of the filter sidebar on mobile devices.
    -   `searchTerm`: Stores the current value of the search input field.
    -   `selectedLanguage`: Stores the value of the selected language from the dropdown.

#### Helper Functions and Effects

-   **`applyFilter()`**: The core filtering logic resides in this function. It takes the original `doctors` array and sequentially filters it based on the current values of `speciality`, `selectedLanguage`, and `searchTerm`.
-   **`useEffect` Hook**: This hook calls `applyFilter()` whenever any of the filter dependencies (`doctors`, `speciality`, `selectedLanguage`, `searchTerm`) change, ensuring the displayed list of doctors is always current.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`, `useContext`).
-   `react-router-dom` (hooks: `useParams`, `useNavigate`).
-   `../context/AppContext`.
-   `react-icons/fa` for icons.

---

### `pages/Forum.jsx`

**Component:** `Forum`

This component is a comprehensive, feature-rich community forum page. It provides a platform for users to create posts, comment, and interact with content through upvotes, bookmarks, and sharing.

#### Purpose

The `Forum` page is designed to foster a community by allowing users to:
1.  View a feed of all posts.
2.  Create new posts on various topics.
3.  Filter posts by predefined categories (e.g., 'Anxiety', 'Depression').
4.  Search for posts by keywords.
5.  Engage with posts by upvoting, bookmarking, and sharing them.
6.  Participate in discussions by reading and adding comments in a collapsible section under each post.

#### Structure and Features

-   **Main Layout**: A two-column layout with a sidebar for navigation/filtering and a main content area for the post feed.
-   **Sidebar**:
    -   **Search Bar**: Allows users to filter posts by title or content.
    -   **Categories**: A list of clickable categories that filter the main post feed. Each category displays a count of the posts within it.
    -   **Trending Posts**: A section that displays the top 3 most upvoted posts.
-   **Post Creation**:
    -   A "New Post" button toggles the visibility of a creation form.
    -   The form includes fields for a title, content, and category selection.
-   **Post Feed**:
    -   Displays a list of posts, filtered by the selected category and search query.
    -   Each post card shows the author's name, creation date, title, content, and category.
    -   **Interaction Bar**: Each post has buttons to `Upvote`, view `Comments`, `Share`, and `Bookmark`. The state of the upvote and bookmark buttons (e.g., filled icon) reflects the current user's interaction.
-   **Comments Section**:
    -   Clicking the comment icon fetches and displays the comments for that post in a collapsible section.
    -   Includes a form for logged-in users to add new comments.
-   **Sharing**: The share button uses the Web Share API on supported devices (like mobile) and falls back to copying the post's URL to the clipboard on desktop.

#### State and Context

-   **`AppContext` (`useContext`)**: Uses `token` and `userData` to authorize actions like posting, commenting, and voting, and to display user-specific interaction states (e.g., if a user has already upvoted a post).
-   **`useState` Hooks**:
    -   `posts`: The main array holding all post data fetched from the API.
    -   `title`, `content`: Manage the state of the new post form.
    -   `selectedCategory`: Stores the ID of the currently active category filter.
    -   `searchQuery`: Holds the current text from the search input.
    -   `showCreateForm`: Toggles the visibility of the post creation form.
    -   `expandedComments`: An object with post IDs as keys to track which comment sections are open.
    -   `commentTexts`: An object to manage the state of the comment input field for each post individually.
    -   `postComments`: An object that caches the fetched comments for each post to prevent redundant API calls when re-opening a comment section.

#### API Interactions

The component interacts with several endpoints under `/api/forum`:

-   **`fetchPosts()`**: `GET /api/forum` - Fetches all posts on component mount.
-   **`handlePostSubmit()`**: `POST /api/forum` - Creates a new post.
-   **`handleUpvote()`**: `PUT /api/forum/:postId/upvote` - Toggles an upvote for the logged-in user.
-   **`handleBookmark()`**: `PUT /api/forum/:postId/bookmark` - Toggles a bookmark for the logged-in user.
-   **`toggleComments()`**: `GET /api/forum/:postId` - Fetches the details of a single post, including its comments, when the comment section is first expanded.
-   **`handleAddComment()`**: `POST /api/forum/:postId/comments` - Submits a new comment for a post.

#### Dependencies

-   `react` (hooks: `useState`, `useEffect`, `useContext`).
-   `../context/AppContext`.
-   `react-toastify` for notifications.
-   `lucide-react` for icons.