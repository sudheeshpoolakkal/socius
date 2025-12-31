# Admin Panel Documentation

This document provides detailed information about the components and pages that make up the administration panel for the Spiritus platform.

---

## Admin Pages

This section describes the pages located in the `src/pages/Admin/` directory, which are the core views of the admin panel.

---

### `pages/Admin/AddDoctor.jsx`

**Component:** `AddDoctor`

This component provides a comprehensive form for administrators to add a new doctor to the platform's database.

#### Purpose

The primary function of this page is to enable the creation of new doctor profiles. It includes fields for all essential doctor information, from personal details and credentials to a profile picture.

#### State and Context

-   **`AdminContext` (`useContext`)**: It retrieves the `backendUrl` for the API endpoint and the `aToken` (admin authentication token) to authorize the request.
-   **`useState` Hooks**:
    -   `docFile`: Holds the `File` object for the doctor's profile picture.
    -   `previewUrl`: Stores a local object URL for displaying an immediate preview of the selected image.
    -   The component maintains individual state for each form field (`name`, `email`, `password`, `experience`, `fees`, etc.).

#### Form Handling and API Call

-   **`handleFileChange(e)`**: This function is triggered when an admin selects an image file. It updates the `docFile` state and creates a local preview URL using `URL.createObjectURL()`.
-   **`onSubmitHandler(event)`**: This is the core submission function.
    1.  It prevents the default form submission behavior.
    2.  It constructs a `FormData` object, which is necessary for sending multipart/form-data that includes the image file.
    3.  It appends all the form field values (name, email, image, etc.) to the `FormData` object. The address fields are combined into a single JSON string before being appended.
    4.  It sends a `POST` request to the `/api/admin/add-doctor` endpoint with the `FormData` as the payload and the admin token in the headers.
    5.  It uses `react-toastify` to display success or error messages based on the API response.

#### Dependencies

-   `react` (hooks: `useContext`, `useState`).
-   `axios` for making the API request.
-   `react-toastify` for notifications.
-   `../../context/AdminContext`.

---

### `pages/Admin/AdminPrescription.jsx`

**Component:** `AdminPrescription`

A view for administrators to see the detailed prescription and report associated with a specific appointment.

#### Purpose

This component provides a read-only view of a prescription, allowing an admin to review the doctor's report and see or download the attached prescription file (either an image or a PDF).

#### Data Flow

-   **`location` (`useLocation`)**: The component is entirely driven by data passed through the router's state. It expects an `appointment` object (which should contain a nested `prescription` object) to be available in `location.state`.
-   If the required `appointment` or `appointment.prescription` data is missing, it displays a "No prescription details found" message.

#### Structure and Features

-   **Patient and Doctor Info**: Displays a summary of the appointment, including the patient's name, doctor's name, and the appointment date/time.
-   **Doctor's Report**: Shows the full text of the doctor's report in a formatted block.
-   **Conditional File Handling**:
    -   It checks if the `prescriptionFile` URL ends with `.pdf`.
    -   If it is a PDF, it renders "View PDF" and "Download PDF" buttons.
    -   If it is not a PDF, it assumes the file is an image and renders it directly using an `<img>` tag, along with a "Download Image" button.
-   **Download Functionality**: The `handleDownload` function fetches the file from its URL as a blob and creates a temporary object URL to initiate a download, which is a robust way to handle file downloads from external URLs.
-   **Navigation**: A "Back" button allows the admin to easily return to the previous page (presumably the appointments list).

#### State and Props

-   The component is stateless and relies entirely on the `appointment` object passed via `location.state`.

#### Dependencies

-   `react-router-dom` (hooks: `useLocation`, `useNavigate`).
-   `lucide-react` for icons.
-   `react-toastify` for download notifications.

---

### `pages/Admin/AllAppointments.jsx`

**Component:** `AllAppointments`

This page provides a comprehensive table view of all appointments across the entire platform for administrative purposes.

#### Purpose

This component allows administrators to monitor and manage all scheduled appointments. They can see key details at a glance, cancel active appointments, and view prescriptions for completed ones.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `aToken`: The admin authentication token, used to authorize API calls.
    -   `appointments`: The array of all appointment data for the platform.
    -   `getAllAppointments`: A function to fetch or refresh the list of all appointments.
    -   `cancelAppointment`: A function that takes an `appointmentId` to cancel a specific appointment.
-   **`AppContext` (`useContext`)**:
    -   `calculateAge`, `slotDateFormat`, `currency`: Helper functions and constants for formatting data consistently with the rest of the application.

#### Data Fetching and Display

-   **`useEffect` Hook**: Calls the `getAllAppointments` function from the context as soon as the admin token is available, ensuring the data is loaded on component mount.
-   **Responsive Table**: The appointments are displayed in a responsive grid that adapts to a table-like layout on larger screens.
-   **Data Columns**: The table shows the patient's details, doctor's details, appointment time, and fees.
-   **Conditional Actions**:
    -   **Status/Action**: For each appointment, this column either displays a "Cancelled" or "Completed" status, or it shows a clickable cancel icon if the appointment is still active.
    -   **Prescription**: A "View" button appears only for appointments that are completed and have an associated prescription file. Clicking this button navigates the admin to the `/admin-prescription` page, passing the full appointment object in the route's state.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`).
-   `react-router-dom` (hook: `useNavigate`).
-   `../../context/AdminContext`.
-   `../../context/AppContext`.
-   `../../assets/assets_admin/assets` for the cancel icon.

---

### `pages/Admin/AssignDoctor.jsx`

**Component:** `AssignDoctor`

This page provides a simple form for administrators to create an association between an existing doctor and an existing hospital.

#### Purpose

The primary function of this component is to link a doctor to a hospital, which is a key relationship in the platform's data model. This might be used, for example, to show which doctors work at a specific hospital on the hospital's profile page.

#### State and Context

-   **`AdminContext` (`useContext`)**: Retrieves the `backendUrl` and `aToken` to authorize and make API requests.
-   **`useState` Hooks**:
    -   `hospitals`: An array to store the list of all hospitals fetched from the backend, used to populate the hospital dropdown.
    -   `doctors`: An array to store the list of all doctors, used to populate the doctor dropdown.
    -   `selectedHospital`: A string holding the `_id` of the hospital selected from the dropdown.
    -   `selectedDoctor`: A string holding the `_id` of the doctor selected from the dropdown.

#### Data Fetching and Submission

-   **`useEffect` Hook**: On component mount (and when the `aToken` is available), it triggers two functions:
    -   `fetchHospitals()`: Sends a `GET` request to `/api/admin/hospitals` to get all hospital data.
    -   `fetchDoctors()`: Sends a `POST` request to `/api/admin/all-doctors` to get all doctor data.
-   **`onSubmitHandler(event)`**:
    1.  Prevents the default form submission.
    2.  Validates that both a hospital and a doctor have been selected.
    3.  Sends a `POST` request to the `/api/admin/hospitals/:hospitalId/assign-doctor` endpoint. The `hospitalId` is taken from the URL, and the `doctorId` is sent in the request body.
    4.  Displays a success or error toast based on the API response.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `../../context/AdminContext`.

---

### `pages/Admin/DoctorRegistrations.jsx`

**Component:** `DoctorRegistrations`

This component provides an interface for administrators to manage and review new doctor registration submissions.

#### Purpose

The primary goal of this page is to create a workflow for processing new doctor applications. Admins can view all pending and reviewed submissions, approve them, or delete them.

#### Structure and Features

-   **Two-Panel Layout**:
    -   **Left Panel (List View)**: Displays a list of all doctor registration submissions. Each list item shows the doctor's full name and the submission date. Unreviewed submissions are highlighted with a distinct style (a blue border) to draw attention.
    -   **Right Panel (Detail View)**: When a registration is clicked in the list, this panel displays all of its detailed information, including contact info, credentials, specializations, and links to view their uploaded profile photo and license certificate.
-   **Actions**:
    -   **Mark as Reviewed**: A checkmark icon on each list item (and in the detail view) allows an admin to approve the application. This action calls the `markDoctorRegistrationAsReviewed` function from the context.
    -   **Delete**: A trash icon allows an admin to delete a registration. This action is protected by a `window.confirm` dialog to prevent accidental deletions.
-   **State-Dependent UI**:
    -   A loading spinner is shown while the initial data is being fetched.
    -   If no registrations exist, a message is displayed in the list panel.
    -   If no registration is selected, the detail panel shows a placeholder prompting the admin to select one.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `doctorRegistrations`: The array of registration data.
    -   `getAllDoctorRegistrations`: The function to fetch the registration data.
    -   `markDoctorRegistrationAsReviewed`: The function to approve a registration.
    -   `deleteDoctorRegistration`: The function to delete a registration.
-   **`useState` Hooks**:
    -   `loading`: A boolean to control the visibility of the loading spinner.
    -   `selectedRegistration`: An object that holds the data of the registration currently being viewed in the detail panel.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-icons/fi` for icons.
-   `../../context/AdminContext`.

---

## Context Providers

This section describes the React Context providers used to manage state across the admin application.

---

### `context/AdminContext.jsx`

**Component:** `AdminContextProvider`

This is the central state management provider for the entire administrator-facing part of the application.

#### Purpose

The `AdminContext` centralizes all data and functions related to administrative tasks. It handles fetching platform-wide data (like all doctors, appointments, and registrations), managing the admin's authentication state, and providing functions to act on that data (e.g., deleting feedback, approving registrations).

#### State and Data

-   **`aToken`**: The admin's authentication token, persisted in `localStorage`.
-   **`doctors`**: An array of all doctor objects on the platform.
-   **`appointments`**: An array of all appointment objects.
-   **`dashData`**: An object containing aggregated data for the main dashboard view.
-   **`feedbacks`**: An array of all user feedback submissions.
-   **`hospitals`**: An array of all hospital registration submissions.
-   **`doctorRegistrations`**: An array of all doctor registration submissions.

#### Key Functions

The context provides a suite of asynchronous functions that wrap API calls. Each function handles sending the authenticated request and displaying success or error notifications.

-   **Data Fetching**: `getAllDoctors()`, `getAllAppointments()`, `getDashData()`, `getAllFeedbacks()`, `getAllHospitals()`, `getAllDoctorRegistrations()`.
-   **Data Modification**:
    -   `changeAvailability(docId)`: Toggles a doctor's status.
    -   `cancelAppointment(appointmentId)`: Cancels a booking.
    -   `markFeedbackAsRead(id)`, `deleteFeedback(id)`: Manage feedback messages.
    -   `markHospitalAsReviewed(id)`, `deleteHospital(id)`: Manage hospital registrations.
    -   `markDoctorRegistrationAsReviewed(id)`, `deleteDoctorRegistration(id)`: Manage doctor registrations.

#### Dependencies

-   `react` (hooks: `createContext`, `useState`).
-   `axios` for API requests.
-   `react-toastify` for notifications.

---

### `context/AppContext.jsx`

**Component:** `AppContextProvider`

This is a simple context provider that supplies shared, static utility functions and constants to different parts of the application.

#### Purpose

The `AppContext` is designed to be a lightweight provider for helper functions and values that are needed across different components but are not tied to a specific user role's state. This avoids code duplication.

#### Provided Context Value

-   **`currency`**: A string constant for the currency symbol (`'₹'`).
-   **`calculateAge(dob)`**: A function that takes a date-of-birth string and returns the calculated age.
-   **`slotDateFormat(slotDate)`**: A function that converts a date string from the backend's `DD_MM_YYYY` format into a more user-friendly format (e.g., "10 Jan 2024").

#### Dependencies

-   `react` (hook: `createContext`).

---

### `context/DoctorContext.jsx`

**Component:** `DoctorContextProvider`

This is the central state management provider for the doctor-facing parts of the application.

#### Purpose

The `DoctorContext` centralizes all data and functions related to a logged-in doctor's workflow. It manages the doctor's authentication state, fetches their specific data (like appointments and profile), and provides functions to interact with that data (e.g., completing an appointment, setting a video call link).

#### State and Data

-   **`dToken`**: The doctor's authentication token, persisted in `localStorage`.
-   **`appointments`**: An array holding all appointments specific to the logged-in doctor.
-   **`dashData`**: An object containing aggregated data for the doctor's dashboard.
-   **`profileData`**: An object containing the detailed profile information for the logged-in doctor.
-   **`doctorSlots`**: An object storing the doctor's custom appointment slots.

#### Key Functions

The context provides a suite of asynchronous functions that wrap API calls for doctor-specific actions.

-   **Data Fetching**: `getAppointments()`, `getDashData()`, `getProfileData()`, `getDoctorSlots()`, `getDoctorPrescription()`.
-   **Data Modification**:
    -   `completeAppointment(id)`: Marks an appointment as complete.
    -   `cancelAppointment(id)`: Cancels an appointment.
    -   `setVideoCallLink(id, link)`: Saves a video call URL for an appointment.
    -   `addPrescription(formData)`: Submits a new prescription.
    -   `updateDoctorSlots(date, slots)`: Updates the available slots for a given date.
    -   `deleteDoctorSlots(date)`: Deletes all slots for a given date.

#### Dependencies

-   `react` (hooks: `createContext`, `useState`).
-   `axios` for API requests.
-   `react-toastify` for notifications.

---

## Components

This section describes the reusable components located in the `src/components/` directory.

---

### `components/Navbar.jsx`

**Component:** `Navbar`

The top navigation bar for the admin and doctor dashboards.

#### Purpose

This component provides a consistent header across all authenticated admin and doctor pages, displaying the application logo, the current user's role, and a logout button.

#### State and Context

-   **`AdminContext` (`useContext`)**: Retrieves `aToken` and `setAToken` to manage the admin's session.
-   **`DoctorContext` (`useContext`)**: Retrieves `dToken` and `setDToken` to manage the doctor's session.

#### Logic and Features

-   **Role Display**: It checks for the presence of `aToken` to determine the current user's role and displays either "Admin" or "Doctor" in a badge.
-   **Logout Functionality**: The `logout` function is comprehensive, handling the logout process for either user type. When clicked, it:
    1.  Navigates the user back to the root login page (`/`).
    2.  Clears the `aToken` from both context and `localStorage` if it exists.
    3.  Clears the `dToken` from both context and `localStorage` if it exists.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (hook: `useNavigate`).
-   `../context/AdminContext`.
-   `../context/DoctorContext`.
-   `../assets/assets_admin/assets` for the logo.

---

### `components/Sidebar.jsx`

**Component:** `Sidebar`

A responsive, role-based sidebar for navigation within the admin and doctor dashboards.

#### Purpose

This component provides the main navigation structure for authenticated users. It dynamically displays a different set of links depending on whether the logged-in user is an administrator or a doctor.

#### Structure and Features

-   **Role-Based Navigation**:
    -   The component defines two separate arrays of navigation items: `adminNavItems` and `doctorNavItems`.
    -   It checks for the presence of `aToken` or `dToken` in the respective contexts to determine which set of navigation links to render.
-   **Responsive Design**:
    -   The sidebar is designed to be compact on mobile screens (`w-16`), showing only icons for navigation.
    -   On medium screens and larger (`md:w-72`), it expands to its full width, displaying both the icons and their corresponding text labels.
-   **Active Link Highlighting**: It uses the `NavLink` component from `react-router-dom`. This allows it to apply specific active styles (a green background, text color, and a right border) to the link that corresponds to the current route, providing clear visual feedback to the user about their location within the app.
-   **Reusable Item Rendering**: A `renderNavItem` function is used to reduce code duplication, rendering each link with consistent styling and structure.

#### State and Context

-   **`AdminContext` (`useContext`)**: Retrieves the `aToken` to determine if the admin navigation should be displayed.
-   **`DoctorContext` (`useContext`)**: Retrieves the `dToken` to determine if the doctor navigation should be displayed.
-   The component is otherwise stateless.

#### Dependencies

-   `react` (hook: `useContext`).
-   `react-router-dom` (component: `NavLink`).
-   `lucide-react` for navigation icons.
-   `../context/AdminContext`.
-   `../context/DoctorContext`.

---

### `pages/Admin/ImageCropper.jsx`

**Component:** `ImageCropper`

A component that provides a UI for cropping images, built as a wrapper around the `react-image-crop` library. *Note: This appears to be a reusable component placed within the `pages` directory.*

#### Purpose

This component allows an administrator to upload an image and select a specific area to be used, for example, as a doctor's profile picture. It is configured to enforce a square (1:1) aspect ratio.

#### State and Props

-   **Props**:
    -   `src`: The source URL or data URL of the image to be cropped.
    -   `onCropComplete`: A callback function that is triggered when the user finishes cropping. It passes the final cropped image as a Base64-encoded data URL to the parent component.
-   **`useState` Hooks**:
    -   `crop`: An object that holds the state of the crop selection (aspect ratio, position, size).
    -   `imageRef`: Stores a reference to the loaded `<img>` element, which is necessary for the cropping logic.

#### Logic and Features

-   **`onImageLoaded`**: A callback that saves a reference to the image element once it has loaded.
-   **`onCropChange`**: Updates the `crop` state in real-time as the user adjusts the selection.
-   **`onCropCompleteInternal`**: This function performs the actual cropping. It creates an off-screen `<canvas>`, draws the selected portion of the original image onto it (accounting for scaling), and then converts the canvas content into a Base64 JPEG data URL, which is then passed up to the parent via the `onCropComplete` prop.

#### Dependencies

-   `react` (hooks: `useState`, `useCallback`).
-   `react-image-crop`: The external library providing the core cropping functionality.

---

### `pages/Login.jsx`

**Component:** `Login`

A dual-purpose login page that handles authentication for both "Admin" and "Doctor" user roles.

#### Purpose

This component provides a single entry point for different types of privileged users to access their respective dashboards. It uses a simple state toggle to switch between the two login flows.

#### State and Context

-   **`AdminContext` (`useContext`)**: Retrieves `setAToken` to set the admin token in the global state upon successful admin login.
-   **`DoctorContext` (`useContext`)**: Retrieves `setDToken` to set the doctor token in the global state upon successful doctor login.
-   **`useState` Hooks**:
    -   `state`: A string (`"Admin"` or `"Doctor"`) that controls which login flow is active. It determines the form's title and which API endpoint is called.
    -   `email`, `password`: Standard state variables for the login form inputs.

#### Form Handling and API Calls

-   **`onSubmitHandler(event)`**: This function handles the form submission.
    -   It checks the `state` variable to determine which API call to make.
    -   If `state` is `"Admin"`, it sends a `POST` request to `/api/admin/login`.
    -   If `state` is `"Doctor"`, it sends a `POST` request to `/api/doctor/login`.
-   **Token Management**: Upon a successful API response for either role:
    -   It saves the received token (`aToken` or `dToken`) to `localStorage`.
    -   It updates the corresponding global context with the new token using `setAToken` or `setDToken`.
    -   It navigates the user to the appropriate dashboard (`/admin-dashboard` or `/doctor-dashboard`).

#### Dependencies

-   `react` (hooks: `useContext`, `useState`).
-   `react-router-dom` (hook: `useNavigate`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `../context/AdminContext`.
-   `../context/DoctorContext`.

---

### `pages/Admin/HospitalRegistrations.jsx`

**Component:** `HospitalRegistrations`

This component provides an interface for administrators to manage and review new hospital and facility registration submissions. Its structure is very similar to the `DoctorRegistrations` and `FeedBack` components.

#### Purpose

The primary goal of this page is to create a workflow for processing new facility applications. Admins can view all pending and reviewed submissions, approve them by marking them as reviewed, or delete them.

#### Structure and Features

-   **Two-Panel Layout**:
    -   **Left Panel (List View)**: Displays a list of all hospital registration submissions. Unreviewed submissions are highlighted with a blue border.
    -   **Right Panel (Detail View)**: Shows the complete details of the selected registration, including contact info, facility type, and links to the uploaded logo and license documents.
-   **Actions**:
    -   **Mark as Reviewed**: Allows an admin to approve a facility's registration.
    -   **Delete**: Allows an admin to delete a registration, with a confirmation prompt.
-   **State-Dependent UI**: Shows loading spinners and empty-state placeholders as needed.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `hospitals`: The array of hospital registration data.
    -   `getAllHospitals`: The function to fetch the data.
    -   `markHospitalAsReviewed`: The function to approve a registration.
    -   `deleteHospital`: The function to delete a registration.
-   **`useState` Hooks**:
    -   `loading`: Manages the loading state.
    -   `selectedRegistration`: Holds the object for the currently selected registration to display in the detail view.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-icons/fi` for icons.
-   `../../context/AdminContext`.

---

### `pages/Admin/DoctorsList.jsx`

**Component:** `DoctorsList`

This component displays a grid of all doctors registered on the platform, allowing administrators to view their details and manage their availability.

#### Purpose

The main function of this page is to provide a comprehensive list of all doctors for administrative review. The key interactive feature is the ability for an admin to toggle a doctor's "Available" status on or off directly from the list.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `doctors`: The array of all doctor data.
    -   `aToken`: The admin authentication token, used to trigger the initial data fetch.
    -   `getAllDoctors`: A function from the context used to fetch the complete list of doctors.
    -   `changeAvailability`: A function from the context that takes a `doctorId` and toggles that doctor's availability status on the backend.

#### Data Fetching and Display

-   **`useEffect` Hook**: Calls the `getAllDoctors` function from the context when the component mounts and the `aToken` is present, ensuring the list is populated.
-   **Doctor Cards**:
    -   The doctors are rendered in a responsive grid.
    -   Each card displays the doctor's image, name, and specialty.
    -   A custom-styled checkbox is used to represent the `available` status. Clicking this checkbox directly calls the `changeAvailability` function, providing a quick and easy way for admins to manage doctor availability.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`).
-   `../../context/AdminContext`.

---

### `pages/Admin/FeedBack.jsx`

**Component:** `FeedBack`

This component provides an interface for administrators to manage user feedback submissions.

#### Purpose

The primary goal of this page is to create a workflow for processing user feedback. Admins can view all submitted messages, mark them as read, or delete them.

#### Structure and Features

-   **Two-Panel Layout**:
    -   **Left Panel (List View)**: Displays a list of all feedback submissions. Each item shows the sender's name, submission date, and a truncated preview of the message. Unread messages are highlighted with a blue border to stand out.
    -   **Right Panel (Detail View)**: When a feedback item is clicked, this panel displays the full message content, along with the sender's name and email.
-   **Actions**:
    -   **Mark as Read**: A checkmark icon allows an admin to mark a feedback item as read, which removes its "unread" styling. This action calls the `markFeedbackAsRead` function from the context.
    -   **Delete**: A trash icon allows an admin to delete a feedback submission. This action is protected by a `window.confirm` dialog.
-   **State-Dependent UI**:
    -   A loading spinner is shown while the initial data is fetched.
    -   If no feedback exists, a message is displayed.
    -   If no feedback item is selected, the detail panel shows a placeholder.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `feedbacks`: The array of feedback data.
    -   `getAllFeedbacks`: The function to fetch the feedback data.
    -   `markFeedbackAsRead`: The function to mark a feedback item as read.
    -   `deleteFeedback`: The function to delete a feedback item.
-   **`useState` Hooks**:
    -   `loading`: A boolean to control the visibility of the loading spinner.
    -   `selectedFeedback`: An object that holds the data of the feedback item currently being viewed in the detail panel.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`, `useState`).
-   `react-icons/fi` for icons.
-   `../../context/AdminContext`.

---

### `pages/Admin/Dashboard.jsx`

**Component:** `Dashboard`

This component serves as the main dashboard or homepage for the admin panel, providing a high-level overview of platform activity.

#### Purpose

The Dashboard's primary function is to give administrators a quick snapshot of key performance indicators (KPIs) and recent activity. This includes statistical cards and a list of the latest bookings.

#### State and Context

-   **`AdminContext` (`useContext`)**:
    -   `aToken`: The admin authentication token, used to trigger data fetching.
    -   `getDashData`: A function from the context that fetches all the necessary data for the dashboard from the backend.
    -   `cancelAppointment`: A function to cancel an appointment directly from the "Latest Bookings" list.
    -   `dashData`: The state object from the context that holds all the displayed data (e.g., `dashData.doctors`, `dashData.appointments`, `dashData.latestAppointments`).
-   **`AppContext` (`useContext`)**:
    -   `currencySymbol`, `slotDateFormat`: Helper constants and functions for consistent data formatting.

#### Data Fetching and Display

-   **`useEffect` Hook**: Calls the `getDashData` function from the context as soon as the `aToken` is available, ensuring the dashboard is populated on load.
-   **Stats Grid**: A responsive grid displays several key metrics in individual cards:
    -   Total Doctors
    -   Total Appointments
    -   Total Patients
    -   Admin Earnings
    -   Total Hospitals
-   **Latest Bookings List**:
    -   Displays the 5 most recent appointments fetched from the backend.
    -   For each appointment, it shows the doctor's image and name, and the appointment date.
    -   It conditionally renders the status: "Cancelled", "Completed", or a clickable cancel icon for active appointments.

#### Dependencies

-   `react` (hooks: `useContext`, `useEffect`).
-   `../../context/AdminContext`.
-   `../../context/AppContext`.
-   `../../assets/assets_admin/assets` for the default upload area image.

---

### `pages/Admin/AddHospital.jsx`

**Component:** `AddHospital`

This page provides a comprehensive form for administrators to add a new hospital or healthcare facility to the platform.

#### Purpose

This component allows an admin to create a complete profile for a new facility, including its name, location, contact details, services offered, and login credentials. It handles text inputs, dropdowns, checkboxes, and file uploads.

#### State and Context

-   **`AdminContext` (`useContext`)**: Retrieves the `backendUrl` and `aToken` (admin authentication token) to authorize the API request.
-   **`useState` Hooks**:
    -   `formData`: A large state object that holds all the values from the form fields, such as `hospitalName`, `type`, `address`, `specializations` (as an array), and the initial `password`.
    -   `hospitalLogo`, `hospitalLicense`: State variables to hold the `File` objects for the uploaded logo and license.
    -   `logoPreview`, `licensePreview`: Store local object URLs for displaying immediate previews of the selected files.
    -   `loading`: A boolean to manage the UI state of the submit button during the API call.
    -   `showPassword`: A boolean to toggle the visibility of the password input field.

#### Form Handling and API Call

-   **Dynamic Dropdowns**: The component includes hardcoded data for countries, states, and districts. The state and district dropdowns are conditionally rendered and populated based on the user's selection in the parent dropdown (e.g., selecting "India" populates the state dropdown with Indian states).
-   **File Handling**: The `handleFileChange` function updates the corresponding file state (`hospitalLogo` or `hospitalLicense`) and creates a local preview URL using `URL.createObjectURL()`.
-   **`onSubmitHandler(event)`**:
    1.  Prevents the default form submission.
    2.  Performs client-side validation to ensure required files are present, a password is set, and at least one specialization is selected.
    3.  Constructs a `FormData` object to handle the file uploads.
    4.  Appends all form fields to the `FormData` object. The `specializations` array is stringified before being appended.
    5.  Sends a `POST` request to the `/api/admin/add-hospital` endpoint.
    6.  On success, it shows a success toast and resets the entire form to its initial state.
    7.  On failure, it displays an error toast.

#### Dependencies

-   `react` (hooks: `useContext`, `useState`).
-   `axios` for API requests.
-   `react-toastify` for notifications.
-   `lucide-react` for icons.
-   `../../context/AdminContext`.
>>>>>>> REPLACE