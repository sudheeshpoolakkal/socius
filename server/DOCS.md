# Server API Documentation

This document provides detailed information about the server's API, including controllers, models, and routes.

---

## `controllers/adminController.js`

This controller handles all administrative functionalities, including managing doctors, appointments, feedbacks, and hospitals.

---

### Functions

#### `addDoctor(req, res)`
Adds a new doctor to the system.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body containing the doctor's details.
- **`@param {string} req.body.name`** - The name of the doctor.
- **`@param {string} req.body.email`** - The email of the doctor.
- **`@param {string} req.body.password`** - The password for the doctor's account.
- **`@param {string} req.body.speciality`** - The doctor's specialization.
- **`@param {string} req.body.degree`** - The doctor's degree.
- **`@param {string} req.body.experience`** - The doctor's years of experience.
- **`@param {string} req.body.about`** - A brief description of the doctor.
- **`@param {number} req.body.fees`** - The consultation fees.
- **`@param {string} req.body.address`** - The doctor's address (JSON string).
- **`@param {boolean} [req.body.available=false]`** - The doctor's availability status.
- **`@param {object}` req.file`** - The uploaded image file for the doctor's profile.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `loginAdmin(req, res)`
Logs in the administrator.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.email`** - The admin's email.
- **`@param {string} req.body.password`** - The admin's password.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a token on success or an error message on failure.

---

#### `allDoctors(req, res)`
Retrieves a list of all doctors.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of doctors.

---

#### `appointmentsAdmin(req, res)`
Retrieves a list of all appointments.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of appointments.

---

#### `appointmentCancel(req, res)`
Cancels an appointment and releases the doctor's slot.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to cancel.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `adminDashboard(req, res)`
Retrieves dashboard data for the admin panel.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with dashboard data (doctors, appointments, patients, earnings, etc.).

---

#### `getAllFeedbacks(req, res)`
Retrieves all feedback messages.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a list of all feedbacks.

---

#### `markFeedbackAsRead(req, res)`
Marks a specific feedback message as read.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.feedbackId`** - The ID of the feedback to mark as read.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `deleteFeedback(req, res)`
Deletes a specific feedback message.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.feedbackId`** - The ID of the feedback to delete.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `getAllHospitals(req, res)`
Retrieves a list of all hospitals.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of hospitals.

---

#### `getAllDoctorRegistrations(req, res)`
Retrieves a list of all doctor registrations.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of doctor registrations.

---

#### `markHospitalAsReviewed(req, res)`
Marks a hospital as reviewed.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.hospitalId`** - The ID of the hospital to mark as reviewed.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `markDoctorRegistrationAsReviewed(req, res)`
Marks a doctor registration as reviewed.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.doctorId`** - The ID of the doctor registration to mark as reviewed.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `deleteHospital(req, res)`
Deletes a hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.hospitalId`** - The ID of the hospital to delete.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `deleteDoctorRegistration(req, res)`
Deletes a doctor registration.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body.
- **`@param {string} req.body.doctorId`** - The ID of the doctor registration to delete.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `addHospital(req, res)`
Adds a new hospital to the system.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body containing the hospital's details.
- **`@param {object}` req.files`** - The uploaded files (logo and license).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `assignDoctorToHospital(req, res)`
Assigns a doctor to a hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.hospitalId`** - The ID of the hospital.
- **`@param {string} req.body.doctorId`** - The ID of the doctor to assign.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

## `controllers/cabBookingController.js`

This controller manages all operations related to cab bookings, including creating, viewing, updating, and canceling bookings. It includes fallback logic for a simulated booking experience when a database connection is unavailable.

---

### Functions

#### `bookCab(req, res)`
Creates a new cab booking. It attempts to find an available driver and assign them to the booking. If no driver is available or the database is down, it returns a simulated booking for demonstration purposes.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body containing booking details.
- **`@param {object} req.body.pickup`** - The pickup location.
- **`@param {object} req.body.destination`** - The destination location.
- **`@param {object} req.body.ride`** - Details of the selected ride type.
- **`@param {string} [req.body.scheduledTime]`** - The scheduled time for the booking (optional).
- **`@param {boolean} [req.body.isScheduled=false]`** - Flag indicating if the booking is scheduled for a later time.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the booking details or a simulated response.

---

#### `getBookingDetails(req, res)`
Retrieves the details of a specific cab booking by its ID. It can handle both real and simulated booking IDs.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.bookingId`** - The unique ID of the booking to retrieve.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the booking details or a simulated booking object.

---

#### `cancelBooking(req, res)`
Cancels a pending or confirmed cab booking. If the booking had an assigned driver, the driver's status is updated to available.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.bookingId`** - The ID of the booking to cancel.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating the outcome of the cancellation.

---

#### `updateBookingStatus(req, res)`
Updates the status of a cab booking. This is typically used by the driver's application to reflect the booking's progress (e.g., "driver-arrived", "in-progress", "completed").

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.bookingId`** - The ID of the booking to update.
- **`@param {string} req.body.status`** - The new status for the booking.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated booking details.

---

#### `getUserBookings(req, res)`
Retrieves all cab bookings associated with a specific user.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.userId`** - The ID of the user whose bookings are to be retrieved.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing a list of the user's bookings.

---

### Helper Functions

#### `findAvailableDriver(pickupLocation, rideType)`
Finds an available driver near the pickup location that matches the required vehicle type.

- **`@param {object}` pickupLocation`** - The location for pickup.
- **`@param {object}` rideType`** - The type of ride requested.
- **`@returns {object|null}`** - The closest available driver object or `null` if no driver is found.

---

#### `calculateFare(pickup, destination, ride)`
Calculates an estimated fare for the ride based on distance and the selected ride type.

- **`@param {object}` pickup`** - The pickup location.
- **`@param {object}` destination`** - The destination location.
- **`@param {object}` ride`** - The selected ride type.
- **`@returns {number}`** - The estimated fare.

---

## `controllers/doctorController.js`

This controller handles all functionalities related to doctors, including managing their availability, appointments, profiles, and ratings.

---

### Functions

#### `changeAvailablity(req, res)`
Toggles the availability status of a doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor whose availability is to be changed.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the change.

---

#### `doctorList(req, res)`
Retrieves a list of all doctors, excluding their passwords and emails.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing the list of doctors.

---

#### `loginDoctor(req, res)`
Logs in a doctor and returns a JWT token.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.email`** - The doctor's email.
- **`@param {string} req.body.password`** - The doctor's password.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a token and doctor ID on success.

---

#### `appointmentsDoctor(req, res)`
Retrieves all appointments for a specific doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of appointments.

---

#### `appointmentComplete(req, res)`
Marks an appointment as completed.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to mark as complete.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the action.

---

#### `appointmentCancel(req, res)`
Cancels an appointment from the doctor's panel.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to cancel.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `doctorDashboard(req, res)`
Retrieves dashboard data for the doctor's panel, including earnings, appointment counts, and patient counts.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with dashboard data.

---

#### `doctorProfile(req, res)`
Retrieves the profile data for a specific doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the doctor's profile data.

---

#### `updateDoctorProfile(req, res)`
Updates a doctor's profile information.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {number} [req.body.fees]`** - The doctor's new consultation fees.
- **`@param {object} [req.body.address]`** - The doctor's new address.
- **`@param {boolean} [req.body.available]`** - The doctor's new availability status.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the update.

---

#### `setVideoCallLink(req, res)`
Sets the video call link for a specific appointment.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment.
- **`@param {string} req.body.videoCallLink`** - The video call link.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated appointment details.

---

#### `submitRating(req, res)`
Submits a rating and an optional review for a doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor being rated.
- **`@param {number} req.body.rating`** - The rating value (1-5).
- **`@param {string} [req.body.review]`** - The review text (optional).
- **`@param {string} req.body.userId`** - The ID of the user submitting the rating.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the submission.

---

#### `getReviews(req, res)`
Retrieves all reviews for a specific doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.docId`** - The ID of the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of reviews.

---

#### `getDoctorSlots(req, res)`
Retrieves the custom appointment slots for a doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the doctor's custom slots.

---

#### `updateDoctorSlots(req, res)`
Updates or sets the custom appointment slots for a doctor on a specific date.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {string} req.body.date`** - The date for which to update slots (e.g., "YYYY-MM-DD").
- **`@param {Array<string>} req.body.timeSlots`** - An array of time slots (e.g., ["10:00", "11:00"]).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the update.

---

#### `deleteDoctorSlots(req, res)`
Deletes the custom appointment slots for a doctor on a specific date.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {string} req.body.date`** - The date for which to delete slots.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the deletion.

---

#### `getDoctorById(req, res)`
Retrieves a single doctor's details by their ID.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.docId`** - The ID of the doctor to retrieve.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the doctor's details.

---

## `controllers/driverController.js`

This controller manages driver-related operations, such as creating new drivers, fetching available drivers, and updating their availability status.

---

### Functions

#### `createDriver(req, res)`
Creates a new driver profile in the system. It checks for existing drivers with the same email, license number, or vehicle plate to prevent duplicates.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The request body containing driver details.
- **`@param {string} req.body.name`** - The driver's full name.
- **`@param {string} req.body.email`** - The driver's email address.
- **`@param {string} req.body.phone`** - The driver's phone number.
- **`@param {string} req.body.licenseNumber`** - The driver's license number.
- **`@param {object} req.body.vehicle`** - An object containing vehicle details (e.g., make, model, licensePlate).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created driver's data.

---

#### `getAvailableDrivers(req, res)`
Retrieves a list of all drivers who are currently marked as available.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing an array of available driver objects.

---

#### `updateDriverAvailability(req, res)`
Updates the availability status of a specific driver.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.driverId`** - The ID of the driver to update.
- **`@param {boolean} req.body.isAvailable`** - The new availability status for the driver.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated driver data.

---

## `controllers/forumController.js`

This controller manages the community forum, including creating and viewing posts and comments, as well as handling user interactions like upvotes and bookmarks.

---

### Functions

#### `createPost(req, res)`
Creates a new forum post. The author is identified via `req.userId` from an authentication middleware.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.title`** - The title of the post.
- **`@param {string} req.body.content`** - The main content of the post.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created post.

---

#### `getAllPosts(req, res)`
Retrieves all forum posts, sorted by creation date. It populates author details, upvotes, and bookmarks.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing an array of all posts.

---

#### `getPostById(req, res)`
Retrieves a single post by its ID, along with all its associated comments.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.postId`** - The ID of the post to retrieve.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the post and an array of its comments.

---

#### `createComment(req, res)`
Creates a new comment on a specific post.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.postId`** - The ID of the post to comment on.
- **`@param {string} req.body.content`** - The content of the comment.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created comment.

---

#### `toggleUpvote(req, res)`
Toggles an upvote for a user on a specific post. If the user has already upvoted, the upvote is removed.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.postId`** - The ID of the post to upvote/un-upvote.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated post and a boolean indicating the new upvoted status.

---

#### `toggleBookmark(req, res)`
Toggles a bookmark for a user on a specific post. If the user has already bookmarked it, the bookmark is removed.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.postId`** - The ID of the post to bookmark/un-bookmark.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated post and a boolean indicating the new bookmarked status.

---

## `controllers/geminiController.js`

This controller interfaces with Google's Gemini AI to provide content generation and specialized chat functionalities.

---

### Functions

#### `generateContent(req, res)`
Generates text content based on a given prompt and an optional system-level instruction. It uses the `gemini-1.5-flash` model.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.prompt`** - The main input text or question for the AI.
- **`@param {string} [req.body.systemPrompt]`** - An optional instruction to guide the AI's behavior and response style.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing the generated text.

---

#### `chatWithNeha(req, res)`
Engages in a conversation with a specialized AI persona named "Neha." Neha is designed to act as a friendly, philosophical companion, embodying the teachings of Kapil Gupta, MD. The function maintains conversation history for context.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.prompt`** - The user's message in the conversation.
- **`@param {Array<object>} [req.body.history]`** - An array representing the conversation history to maintain context.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing Neha's reply.

---

## `controllers/hospitalController.js`

This controller manages all operations related to hospitals, including authentication, profile management, and viewing associated doctors and appointments.

---

### Functions

#### `loginHospital(req, res)`
Authenticates a hospital based on email and password. It checks if the hospital's registration has been reviewed and approved before granting access.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.email`** - The hospital's email address.
- **`@param {string} req.body.password`** - The hospital's password.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a JWT token and hospital data on successful login.

---

#### `getHospitalProfile(req, res)`
Retrieves the profile of the currently authenticated hospital. The hospital data is sourced from the `req.hospital` object, which is populated by an authentication middleware.

- **`@param {object}` req** - The Express request object, containing `req.hospital`.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the hospital's profile data.

---

#### `updateHospitalProfile(req, res)`
Updates the profile information for the authenticated hospital. Only a specific set of fields are allowed to be updated.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - An object containing the fields to update.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the updated hospital profile.

---

#### `getHospitalAppointments(req, res)`
Retrieves all appointments associated with the doctors registered under the authenticated hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing a list of appointments.

---

#### `listHospitals(req, res)`
Retrieves a list of all hospitals that have been reviewed and approved.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing an array of hospital objects.

---

#### `addDoctorToHospital(req, res)`
Adds a new doctor to the authenticated hospital's roster. It handles image uploads to Cloudinary and hashes the doctor's password.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The new doctor's details.
- **`@param {object}` req.file`** - The uploaded profile image for the doctor.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created doctor's data.

---

#### `getHospitalDoctors(req, res)`
Retrieves a list of all doctors associated with the authenticated hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing an array of doctor objects.

---

#### `getDashboardData(req, res)`
Retrieves aggregated data for the hospital's dashboard, including total doctors, appointments, patients, earnings, and recent appointments.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the dashboard data.

---

## `controllers/prescriptionController.js`

This controller handles the creation and retrieval of medical prescriptions and reports associated with appointments.

---

### Functions

#### `addPrescription(req, res)`
Adds a new prescription and a detailed report to a specific appointment. It validates the report length and uploads the prescription file to Cloudinary if provided.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to which the prescription is being added.
- **`@param {string} req.body.report`** - A textual report, required to be at least 30 words long.
- **`@param {object} [req.file]`** - An optional file upload (e.g., a PDF or image of the prescription).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created prescription data.

---

#### `getPrescription(req, res)`
Retrieves the prescription and report for a specific appointment by its ID.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.appointmentId`** - The ID of the appointment for which to retrieve the prescription.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing the prescription data.

---

## `controllers/testimonialController.js`

This controller manages testimonials, allowing for their creation and retrieval.

---

### Functions

#### `getTestimonials(req, res)`
Retrieves all testimonials from the database.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response containing an array of all testimonial objects.

---

#### `addTestimonial(req, res)`
Adds a new testimonial to the database.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.quote`** - The text of the testimonial.
- **`@param {string} req.body.name`** - The name of the person giving the testimonial.
- **`@param {string} req.body.image`** - The URL of the person's image.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the newly created testimonial data.

---

## `controllers/userController.js`

This controller manages all user-centric operations, including authentication, profile management, appointments, payments, and various submissions like feedback and registrations.

---

### Functions

#### `registerUser(req, res)`
Registers a new user, hashes their password, and sends a welcome email.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.name`** - The user's name.
- **`@param {string} req.body.email`** - The user's email.
- **`@param {string} req.body.password`** - The user's password (min 8 characters).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a JWT token on success.

---

#### `loginUser(req, res)`
Logs in an existing user and sends a login notification email.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.email`** - The user's email.
- **`@param {string} req.body.password`** - The user's password.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a JWT token on success.

---

#### `getProfile(req, res)`
Retrieves the profile of the authenticated user.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the user's data.

---

#### `updateProfile(req, res)`
Updates the profile of the authenticated user, with optional image upload.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The user's updated profile data.
- **`@param {object} [req.file]`** - Optional new profile image.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the update.

---

#### `uploadProfileImage(req, res)`
Uploads or updates a user's profile image.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.file`** - The image file to upload.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response indicating success or failure.

---

#### `bookAppointment(req, res)`
Books a new appointment with a doctor, reserves the slot, and sends a reservation email.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.docId`** - The ID of the doctor.
- **`@param {string} req.body.slotDate`** - The date of the appointment.
- **`@param {string} req.body.slotTime`** - The time of the appointment.
- **`@param {string} [req.body.patientDescription]`** - Text description of the patient's issue.
- **`@param {string} req.body.consultationMode`** - The mode of consultation (e.g., "video").
- **`@param {object} [req.file]`** - Optional audio message describing the issue.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response prompting for payment to confirm.

---

#### `listAppointment(req, res)`
Lists all appointments for the authenticated user.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a list of appointments.

---

#### `cancelAppointment(req, res)`
Cancels an appointment, releases the doctor's slot, and sends a cancellation email.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to cancel.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the cancellation.

---

#### `getVideoCallLink(req, res)`
Retrieves the video call link for a specific appointment.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.appointmentId`** - The ID of the appointment.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the video call link.

---

#### `processPayment(req, res)`
Processes a mock payment to confirm an appointment and sends a confirmation email.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the appointment to confirm.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the payment.

---

#### `rateDoctor(req, res)`
Allows a user to submit a rating and review for a completed appointment.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.body.appointmentId`** - The ID of the completed appointment.
- **`@param {number} req.body.rating`** - The rating (1-5).
- **`@param {string} [req.body.review]`** - An optional text review.
- **`@param {string} req.body.docId`** - The ID of the doctor being rated.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming the submission.

---

#### `submitFeedback(req, res)`
Submits general platform feedback.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The feedback details (name, email, message).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming submission.

---

#### `submitHospitalRegistration(req, res)`
Submits a registration application for a new hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The hospital's registration data.
- **`@param {object}` req.files`** - Uploaded files (logo, license).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming submission.

---

#### `submitDoctorRegistration(req, res)`
Submits a registration application for a new doctor.

- **`@param {object}` req** - The Express request object.
- **`@param {object}` req.body`** - The doctor's registration data.
- **`@param {object}` req.files`** - Uploaded files (photo, certificate).
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming submission.

---

#### `submitQuestionnaire(req, res)`
Submits the user's answers to a therapy questionnaire.

- **`@param {object}` req** - The Express request object.
- **`@param {object} req.body.answers`** - An object containing the answers.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response confirming submission.

---

#### `getHospitalDetails(req, res)`
Retrieves public details for a specific hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.hospitalId`** - The ID of the hospital.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with hospital details.

---

#### `getHospitalDoctors(req, res)`
Retrieves the list of doctors associated with a specific hospital.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.hospitalId`** - The ID of the hospital.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with the list of doctors.

---

#### `therapyQuestionnaire(req, res)`
Analyzes questionnaire answers to provide a simple therapy recommendation.

- **`@param {object}` req** - The Express request object.
- **`@param {object} req.body.answers`** - The user's answers.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with a recommendation.

---

#### `getAppointmentStatus(req, res)`
Checks the status of an appointment, including payment status and expiration.

- **`@param {object}` req** - The Express request object.
- **`@param {string} req.params.appointmentId`** - The ID of the appointment.
- **`@param {object}` res`** - The Express response object.
- **`@returns {object}`** - A JSON response with appointment status details.

---

## Models

This section provides an overview of the Mongoose data models used in the application.

---

### `models/CabBooking.js`

Defines the schema for cab bookings.

- **`userId`**: `ObjectId` - A reference to the user who made the booking.
- **`pickup`**: `String` - The pickup location address.
- **`destination`**: `String` - The destination address.
- **`ride`**: `Object` - Contains details of the selected ride (name, price, etc.).
- **`driver`**: `Object` - Contains details of the assigned driver.
- **`bookingId`**: `String` - A unique identifier for the booking.
- **`status`**: `String` - The current status of the booking (e.g., 'pending', 'confirmed', 'completed').
- **`scheduledTime`**: `Date` - The time for a scheduled pickup.
- **`estimatedFare`**: `Number` - The estimated cost of the ride.
- **`actualFare`**: `Number` - The final cost of the ride.
- **`pickupTime`**: `Date` - The time the passenger was picked up.
- **`arrivalTime`**: `Date` - The time the driver arrived at the pickup location.
- **`completionTime`**:`Date` - The time the ride was completed.
- **`distance`**: `Number` - The total distance of the ride in kilometers.
- **`duration`**: `Number` - The total duration of the ride in minutes.
- **`paymentStatus`**: `String` - The status of the payment (e.g., 'pending', 'completed').
- **`paymentMethod`**: `String` - The method used for payment.
- **`rating`**: `Number` - A rating for the ride (1-5).
- **`feedback`**: `String` - User feedback for the ride.

---

### `models/Driver.js`

Defines the schema for drivers.

- **`name`**: `String` - The full name of the driver.
- **`email`**: `String` - The driver's email address (unique).
- **`phone`**: `String` - The driver's phone number.
- **`licenseNumber`**: `String` - The driver's license number (unique).
- **`vehicle`**: `Object` - Contains details about the driver's vehicle, including make, model, color, and a unique license plate.
- **`rating`**: `Number` - The driver's average rating (0-5).
- **`totalRides`**: `Number` - The total number of rides completed by the driver.
- **`isAvailable`**: `Boolean` - The driver's current availability status.
- **`location`**: `Object` - A GeoJSON Point object representing the driver's current location.
- **`currentBookingId`**: `ObjectId` - A reference to the `CabBooking` the driver is currently assigned to.

---

### `models/Prescription.js`

Defines the schema for medical prescriptions.

- **`appointmentId`**: `ObjectId` - A reference to the `Appointment` this prescription belongs to.
- **`report`**: `String` - A detailed textual report from the doctor.
- **`prescriptionFile`**: `String` - The URL to the uploaded prescription file on Cloudinary.
- **`uploadedAt`**: `Date` - The timestamp when the prescription was uploaded.

---

### `models/appointmentModel.js`

Defines the schema for appointments.

- **`userId`**: `String` - The ID of the user who booked the appointment.
- **`docId`**: `String` - The ID of the doctor for the appointment.
- **`consultationMode`**: `String` - The mode of consultation ('online' or 'offline').
- **`hospitalId`**: `String` - The ID of the hospital where the appointment is, if applicable.
- **`slotDate`**: `String` - The date of the appointment slot.
- **`slotTime`**: `String` - The time of the appointment slot.
- **`userData`**: `Object` - A snapshot of the user's data at the time of booking.
- **`docData`**: `Object` - A snapshot of the doctor's data at the time of booking.
- **`amount`**: `Number` - The fee for the appointment.
- **`date`**: `Number` - The timestamp of when the appointment was created.
- **`cancelled`**: `Boolean` - A flag indicating if the appointment was cancelled.
- **`payment`**: `Boolean` - A flag indicating if the payment has been completed.
- **`isCompleted`**: `Boolean` - A flag indicating if the appointment has been marked as completed by the doctor.
- **`videoCallLink`**: `String` - The URL for the video consultation.
- **`rating`**: `Number` - The user's rating for the appointment (1-5).
- **`review`**: `String` - The user's text review for the appointment.
- **`patientDescription`**: `String` - The patient's description of their issue.
- **`meetingCompleted`**: `Boolean` - A flag indicating if the meeting was completed.
- **`audioMessage`**: `String` - A URL to an audio message from the patient.
- **`expiresAt`**: `Date` - The timestamp when the unpaid appointment reservation expires.

---

### `models/doctorModel.js`

Defines the schema for doctors.

- **`name`**: `String` - The doctor's full name.
- **`email`**: `String` - The doctor's email address (unique).
- **`password`**: `String` - The doctor's hashed password.
- **`image`**: `String` - The URL of the doctor's profile image.
- **`speciality`**: `String` - The doctor's medical specialization.
- **`experience`**: `String` - The doctor's years of experience.
- **`about`**: `String` - A brief biography of the doctor.
- **`available`**: `Boolean` - The doctor's current availability status.
- **`fees`**: `Number` - The consultation fee.
- **`mapSrc`**: `String` - A URL for an embedded map location.
- **`address`**: `Object` - A detailed address object, including coordinates and Google Place ID.
- **`languages`**: `[String]` - An array of languages spoken by the doctor.
- **`degree`**: `String` - The doctor's medical degree.
- **`date`**: `Number` - The timestamp of when the doctor was added.
- **`slots_booked`**: `Object` - An object storing the doctor's booked appointment slots.
- **`custom_slots`**: `Map` - A map of dates to arrays of available custom time slots.
- **`rating`**: `Number` - The doctor's average rating.
- **`ratingCount`**: `Number` - The total number of ratings received.
- **`reviews`**: `[Object]` - An array of review objects, each containing a user ID, rating, and review text.
- **`hospitalId`**: `ObjectId` - A reference to the `Hospital` the doctor is associated with.

---

### `models/doctorRegistrationModel.js`

Defines the schema for doctor registration applications, pending admin review.

- **`fullName`**: `String` - The full name of the applying doctor.
- **`designation`**: `String` - The doctor's professional designation (e.g., 'psychiatrist').
- **`qualification`**: `String` - The doctor's academic qualifications.
- **`experience`**: `Number` - Years of professional experience.
- **`licenseNumber`**: `String` - The doctor's medical license number.
- **`address`**: `String` - The doctor's practice address.
- **`country`**: `String` - The country of practice.
- **`state`**: `String` - The state of practice.
- **`district`**: `String` - The district of practice.
- **`pinCode`**: `String` - The postal code.
- **`contactNumber`**: `String` - The doctor's contact phone number.
- **`emailAddress`**: `String` - The doctor's email address.
- **`website`**: `String` - The doctor's professional website (optional).
- **`specializations`**: `[String]` - An array of the doctor's specializations.
- **`consultationFees`**: `String` - The range or amount of consultation fees.
- **`teletherapy`**: `String` - Indicates if teletherapy is offered ('yes' or 'no').
- **`availableHours`**: `String` - The doctor's typical available hours.
- **`languagesSpoken`**: `[String]` - An array of languages spoken.
- **`emergencyConsultation`**: `String` - Indicates if emergency consultations are available.
- **`averagePatientsPerDay`**: `Number` - The average number of patients seen per day.
- **`acceptedInsurance`**: `String` - Information about accepted insurance providers.
- **`certifications`**: `String` - A summary of the doctor's certifications.
- **`profilePhoto`**: `String` - URL to the uploaded profile photo on Cloudinary.
- **`licenseCertificate`**: `String` - URL to the uploaded license certificate on Cloudinary.
- **`acknowledgement`**: `Boolean` - A flag indicating the user's acknowledgement of terms.
- **`isReviewed`**: `Boolean` - A flag indicating if the registration has been reviewed by an admin.
- **`createdAt`**: `Date` - The timestamp of the registration submission.

---

### `models/feedbackModel.js`

Defines the schema for user feedback submissions.

- **`name`**: `String` - The name of the person submitting feedback.
- **`email`**: `String` - The email of the person submitting feedback.
- **`message`**: `String` - The content of the feedback message.
- **`isRead`**: `Boolean` - A flag indicating if an admin has read the feedback.
- **`createdAt`**: `Date` - The timestamp of when the feedback was submitted.

---

### `models/forumCommentModel.js`

Defines the schema for comments on forum posts.

- **`content`**: `String` - The text content of the comment.
- **`author`**: `ObjectId` - A reference to the `User` who wrote the comment.
- **`post`**: `ObjectId` - A reference to the `ForumPost` this comment belongs to.
- **`createdAt`**: `Date` - The timestamp of when the comment was created.

---

### `models/forumPostModel.js`

Defines the schema for forum posts.

- **`title`**: `String` - The title of the forum post.
- **`content`**: `String` - The main content of the post.
- **`author`**: `ObjectId` - A reference to the `User` who created the post.
- **`comments`**: `[ObjectId]` - An array of references to `ForumComment`s on this post.
- **`upvotes`**: `[ObjectId]` - An array of `User` IDs who have upvoted the post.
- **`bookmarks`**: `[ObjectId]` - An array of `User` IDs who have bookmarked the post.
- **`createdAt`**: `Date` - The timestamp of when the post was created.

---

### `models/hospitalModel.js`

Defines the schema for hospitals, including their registration data, profile information, and associated doctors. It also includes methods for password hashing and comparison.

- **`hospitalName`**: `String` - The official name of the hospital.
- **`name`**: `String` - A general name field for the hospital.
- **`type`**: `String` - The type of facility (e.g., 'hospital', 'clinic').
- **`yearEstablished`**: `Number` - The year the hospital was established.
- **`email`**: `String` - The hospital's login email (unique, lowercase).
- **`emailAddress`**: `String` - The hospital's contact email address.
- **`password`**: `String` - The hospital's hashed password for login.
- **`address`**: `String` - The full address of the hospital.
- **`country`, `state`, `district`, `pinCode`**: `String` - Detailed location fields.
- **`contactNumber`**: `String` - The primary contact phone number.
- **`website`**: `String` - The hospital's official website (optional).
- **`keyContact`**: `String` - The name of a key contact person (optional).
- **`mentalHealthProfessionals`**: `Number` - The number of mental health professionals on staff.
- **`specializations`**: `[String]` - An array of medical specializations offered.
- **`currentFees`**: `String` - Information on current consultation fees.
- **`teletherapy`**: `String` - Indicates if teletherapy is available ('yes' or 'no').
- **`operatingHours`**: `String` - The hospital's operating hours.
- **`emergencySupport`**: `String` - Indicates if emergency support is available.
- **`averagePatientLoad`**: `Number` - The average number of patients seen.
- **`insuranceTies`**: `String` - Information on tied insurance providers.
- **`accreditations`**: `String` - The hospital's accreditations.
- **`hospitalLicense`**: `String` - URL to the uploaded hospital license on Cloudinary.
- **`hospitalLogo`**: `String` - URL to the uploaded hospital logo on Cloudinary.
- **`acknowledgement`**: `Boolean` - A flag for acknowledging terms during registration.
- **`isReviewed`**: `Boolean` - A flag indicating if the registration has been reviewed by an admin.
- **`doctors`**: `[ObjectId]` - An array of `Doctor` IDs associated with the hospital.
- **`createdAt`**: `Date` - The timestamp of when the record was created.

#### Methods

- **`pre('save', ...)`**: A pre-save hook that automatically hashes the password before saving a new or modified hospital document.
- **`comparePassword(candidatePassword)`**: A method to compare a given password with the stored hash to validate a login attempt.

---

### `models/testimonialModel.js`

Defines the schema for testimonials.

- **`quote`**: `String` - The text content of the testimonial.
- **`name`**: `String` - The name of the person who gave the testimonial.
- **`image`**: `String` - A URL to the image of the person.

---

### `models/userModel.js`

Defines the schema for users.

- **`name`**: `String` - The user's full name.
- **`email`**: `String` - The user's email address (unique).
- **`password`**: `String` - The user's hashed password.
- **`image`**: `String` - The URL of the user's profile image (optional).
- **`address`**: `Object` - The user's address information (optional).
- **`gender`**: `String` - The user's gender (optional).
- **`dob`**: `String` - The user's date of birth (optional).
- **`phone`**: `String` - The user's phone number (optional).
- **`questionnaire`**: `Object` - Stores the user's answers to the therapy questionnaire (optional).

---

## Routes

This section outlines the API routes, the corresponding controller functions, and any middleware used.

---

### `routes/adminRoute.js`

Mount Path: `/api/admin`

This router handles all administrative endpoints. All routes except `/login` are protected by the `authAdmin` middleware.

- **POST `/add-doctor`**:
  - **Controller**: `addDoctor`
  - **Middleware**: `authAdmin`, `upload.single('image')`
  - **Description**: Adds a new doctor to the system. Requires an image upload.

- **POST `/add-hospital`**:
  - **Controller**: `addHospital`
  - **Middleware**: `authAdmin`, `upload.fields(...)`
  - **Description**: Adds a new hospital. Requires logo and license file uploads.

- **POST `/login`**:
  - **Controller**: `loginAdmin`
  - **Description**: Logs in an administrator.

- **POST `/all-doctors`**:
  - **Controller**: `allDoctors`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves a list of all doctors.

- **POST `/change-availability`**:
  - **Controller**: `changeAvailablity`
  - **Middleware**: `authAdmin`
  - **Description**: Toggles a doctor's availability status.

- **GET `/appointments`**:
  - **Controller**: `appointmentsAdmin`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves all appointments.

- **POST `/cancel-appointment`**:
  - **Controller**: `appointmentCancel`
  - **Middleware**: `authAdmin`
  - **Description**: Cancels an appointment.

- **GET `/dashboard`**:
  - **Controller**: `adminDashboard`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves data for the admin dashboard.

- **GET `/feedbacks`**:
  - **Controller**: `getAllFeedbacks`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves all user feedback.

- **POST `/mark-feedback-read`**:
  - **Controller**: `markFeedbackAsRead`
  - **Middleware**: `authAdmin`
  - **Description**: Marks a feedback message as read.

- **POST `/delete-feedback`**:
  - **Controller**: `deleteFeedback`
  - **Middleware**: `authAdmin`
  - **Description**: Deletes a feedback message.

- **GET `/hospitals`**:
  - **Controller**: `getAllHospitals`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves all hospital registrations.

- **GET `/doctor-registrations`**:
  - **Controller**: `getAllDoctorRegistrations`
  - **Middleware**: `authAdmin`
  - **Description**: Retrieves all doctor registration applications.

- **POST `/mark-hospital-reviewed`**:
  - **Controller**: `markHospitalAsReviewed`
  - **Middleware**: `authAdmin`
  - **Description**: Marks a hospital registration as reviewed.

- **POST `/mark-doctor-registration-reviewed`**:
  - **Controller**: `markDoctorRegistrationAsReviewed`
  - **Middleware**: `authAdmin`
  - **Description**: Marks a doctor registration as reviewed.

- **POST `/delete-hospital`**:
  - **Controller**: `deleteHospital`
  - **Middleware**: `authAdmin`
  - **Description**: Deletes a hospital registration.

- **POST `/delete-doctor-registration`**:
  - **Controller**: `deleteDoctorRegistration`
  - **Middleware**: `authAdmin`
  - **Description**: Deletes a doctor registration application.

- **POST `/hospitals/:hospitalId/assign-doctor`**:
  - **Controller**: `assignDoctorToHospital`
  - **Middleware**: `authAdmin`
  - **Description**: Assigns an existing doctor to a hospital.

---

### `routes/cabBookingRoute.js`

Mount Path: `/api/cab`

This router handles all endpoints related to booking and managing cab rides.

- **POST `/book`**:
  - **Controller**: `bookCab`
  - **Description**: Creates a new cab booking.

- **GET `/booking/:bookingId`**:
  - **Controller**: `getBookingDetails`
  - **Description**: Retrieves details for a specific booking.

- **PUT `/booking/:bookingId/cancel`**:
  - **Controller**: `cancelBooking`
  - **Description**: Cancels an existing booking.

- **PUT `/booking/:bookingId/status`**:
  - **Controller**: `updateBookingStatus`
  - **Description**: Updates the status of a booking (e.g., 'in-progress', 'completed').

- **GET `/user/:userId`**:
  - **Controller**: `getUserBookings`
  - **Description**: Retrieves all bookings for a specific user.

---

### `routes/doctorRoute.js`

Mount Path: `/api/doctor`

This router handles all endpoints related to doctor-specific functionalities. Most routes are protected by the `authDoctor` middleware.

- **GET `/list`**:
  - **Controller**: `doctorList`
  - **Description**: Retrieves a public list of all doctors.

- **POST `/login`**:
  - **Controller**: `loginDoctor`
  - **Description**: Logs in a doctor.

- **GET `/appointments`**:
  - **Controller**: `appointmentsDoctor`
  - **Middleware**: `authDoctor`
  - **Description**: Retrieves all appointments for the authenticated doctor.

- **POST `/complete-appointment`**:
  - **Controller**: `appointmentComplete`
  - **Middleware**: `authDoctor`
  - **Description**: Marks an appointment as complete.

- **POST `/cancel-appointment`**:
  - **Controller**: `appointmentCancel`
  - **Middleware**: `authDoctor`
  - **Description**: Cancels an appointment from the doctor's panel.

- **POST `/dashboard`**:
  - **Controller**: `doctorDashboard`
  - **Middleware**: `authDoctor`
  - **Description**: Retrieves dashboard data for the authenticated doctor.

- **GET `/profile`**:
  - **Controller**: `doctorProfile`
  - **Middleware**: `authDoctor`
  - **Description**: Retrieves the profile of the authenticated doctor.

- **POST `/update-profile`**:
  - **Controller**: `updateDoctorProfile`
  - **Middleware**: `authDoctor`
  - **Description**: Updates the profile of the authenticated doctor.

- **POST `/set-video-call`**:
  - **Controller**: `setVideoCallLink`
  - **Middleware**: `authDoctor`
  - **Description**: Sets the video call link for an appointment.

- **POST `/submit-rating`**:
  - **Controller**: `submitRating`
  - **Description**: Submits a rating for a doctor.

- **GET `/reviews/:docId`**:
  - **Controller**: `getReviews`
  - **Description**: Retrieves all reviews for a specific doctor.

- **POST `/slots`**:
  - **Controller**: `getDoctorSlots`
  - **Middleware**: `authDoctor`
  - **Description**: Retrieves the custom appointment slots for the authenticated doctor.

- **POST `/update-slots`**:
  - **Controller**: `updateDoctorSlots`
  - **Middleware**: `authDoctor`
  - **Description**: Updates the custom appointment slots for the authenticated doctor.

- **POST `/delete-slots`**:
  - **Controller**: `deleteDoctorSlots`
  - **Middleware**: `authDoctor`
  - **Description**: Deletes custom appointment slots for a specific date.

- **GET `/:docId`**:
  - **Controller**: `getDoctorById`
  - **Description**: Retrieves the public profile of a single doctor by their ID.

---

### `routes/driverRoute.js`

Mount Path: `/api/driver`

This router handles endpoints for managing drivers.

- **POST `/create`**:
  - **Controller**: `createDriver`
  - **Description**: Creates a new driver profile.

- **GET `/available`**:
  - **Controller**: `getAvailableDrivers`
  - **Description**: Retrieves a list of all currently available drivers.

- **PUT `/:driverId/availability`**:
  - **Controller**: `updateDriverAvailability`
  - **Description**: Updates the availability status of a specific driver.

---

### `routes/forumRoute.js`

Mount Path: `/api/forum`

This router handles all endpoints for the community forum. Most actions are protected by the `authUser` middleware.

- **POST `/`**:
  - **Controller**: `createPost`
  - **Middleware**: `authUser`
  - **Description**: Creates a new forum post.

- **GET `/`**:
  - **Controller**: `getAllPosts`
  - **Description**: Retrieves all forum posts.

- **GET `/:postId`**:
  - **Controller**: `getPostById`
  - **Description**: Retrieves a single post and its comments.

- **POST `/:postId/comments`**:
  - **Controller**: `createComment`
  - **Middleware**: `authUser`
  - **Description**: Adds a new comment to a post.

- **PUT `/:postId/upvote`**:
  - **Controller**: `toggleUpvote`
  - **Middleware**: `authUser`
  - **Description**: Toggles an upvote on a post.

- **PUT `/:postId/bookmark`**:
  - **Controller**: `toggleBookmark`
  - **Middleware**: `authUser`
  - **Description**: Toggles a bookmark on a post.

---

### `routes/geminiRoute.js`

Mount Path: `/api/gemini`

This router provides access to Google's Gemini AI models.

- **POST `/generate`**:
  - **Controller**: `generateContent`
  - **Description**: Generates text content based on a prompt.

- **POST `/chat`**:
  - **Controller**: `chatWithNeha`
  - **Description**: Engages in a conversation with the "Neha" AI persona.

---

### `routes/hospitalRoute.js`

Mount Path: `/api/hospital`

This router handles all endpoints for hospital management. Most routes are protected by the `authHospital` middleware.

- **POST `/login`**:
  - **Controller**: `loginHospital`
  - **Description**: Logs in a hospital.

- **GET `/profile`**:
  - **Controller**: `getHospitalProfile`
  - **Middleware**: `authHospital`
  - **Description**: Retrieves the profile of the authenticated hospital.

- **PUT `/profile`**:
  - **Controller**: `updateHospitalProfile`
  - **Middleware**: `authHospital`
  - **Description**: Updates the hospital's profile.

- **GET `/dashboard`**:
  - **Controller**: `getDashboardData`
  - **Middleware**: `authHospital`
  - **Description**: Retrieves dashboard data for the hospital.

- **GET `/appointments`**:
  - **Controller**: `getHospitalAppointments`
  - **Middleware**: `authHospital`
  - **Description**: Retrieves all appointments for the hospital's doctors.

- **GET `/list`**:
  - **Controller**: `listHospitals`
  - **Description**: Retrieves a public list of all reviewed hospitals.

- **POST `/add-doctor`**:
  - **Controller**: `addDoctorToHospital`
  - **Middleware**: `authHospital`, `upload.single('image')`
  - **Description**: Adds a new doctor to the hospital. Requires an image upload.

- **GET `/doctors`**:
  - **Controller**: `getHospitalDoctors`
  - **Middleware**: `authHospital`
  - **Description**: Retrieves all doctors associated with the hospital.

---

### `routes/prescriptionRoutes.js`

Mount Path: `/api/prescription`

This router manages access to medical prescriptions. Access is restricted based on user roles (doctor, admin, user).

- **POST `/add`**:
  - **Controller**: `addPrescription`
  - **Middleware**: `authDoctor`, `upload.single('prescriptionFile')`
  - **Description**: Allows a doctor to add a prescription to an appointment. Requires a file upload.

- **GET `/admin/:appointmentId`**:
  - **Controller**: `getPrescription`
  - **Middleware**: `authAdmin`
  - **Description**: Allows an admin to retrieve a prescription for a specific appointment.

- **GET `/user/:appointmentId`**:
  - **Controller**: `getPrescription`
  - **Middleware**: `authUser`
  - **Description**: Allows a user to retrieve their own prescription for a specific appointment.

- **GET `/doctor/:appointmentId`**:
  - **Controller**: `getPrescription`
  - **Middleware**: `authDoctor`
  - **Description**: Allows a doctor to retrieve a prescription they created.

---

### `routes/testimonialRoute.js`

Mount Path: `/api/testimonials`

This router handles the creation and retrieval of testimonials.

- **GET `/testimonials`**:
  - **Controller**: `getTestimonials`
  - **Description**: Retrieves all testimonials.

- **POST `/testimonials`**:
  - **Controller**: `addTestimonial`
  - **Description**: Adds a new testimonial.

---

### `routes/userRoute.js`

Mount Path: `/api/user`

This router handles all general user-facing endpoints. Most routes are protected by the `authUser` middleware.

- **POST `/register`**:
  - **Controller**: `registerUser`
  - **Description**: Registers a new user.

- **POST `/login`**:
  - **Controller**: `loginUser`
  - **Description**: Logs in a user.

- **POST `/book-appointment`**:
  - **Controller**: `bookAppointment`
  - **Middleware**: `upload.single('audioMessage')`, `authUser`
  - **Description**: Books an appointment with a doctor. Allows an optional audio message upload.

- **GET `/get-profile`**:
  - **Controller**: `getProfile`
  - **Middleware**: `authUser`
  - **Description**: Retrieves the authenticated user's profile.

- **PUT `/update-profile`**:
  - **Controller**: `updateProfile`
  - **Middleware**: `upload.single('image')`, `authUser`
  - **Description**: Updates the user's profile. Allows an optional image upload.

- **GET `/appointments`**:
  - **Controller**: `listAppointment`
  - **Middleware**: `authUser`
  - **Description**: Retrieves all appointments for the authenticated user.

- **POST `/cancel-appointment`**:
  - **Controller**: `cancelAppointment`
  - **Middleware**: `authUser`
  - **Description**: Cancels a user's appointment.

- **GET `/video-call/:appointmentId`**:
  - **Controller**: `getVideoCallLink`
  - **Description**: Retrieves the video call link for an appointment.

- **POST `/process-payment`**:
  - **Controller**: `processPayment`
  - **Middleware**: `authUser`
  - **Description**: Processes a mock payment to confirm an appointment.

- **POST `/upload-profile-image`**:
  - **Controller**: `uploadProfileImage`
  - **Middleware**: `upload.single('image')`, `authUser`
  - **Description**: Uploads a profile image for the user.

- **POST `/rate-doctor`**:
  - **Controller**: `rateDoctor`
  - **Middleware**: `authUser`
  - **Description**: Submits a rating for a doctor after a completed appointment.

- **POST `/submit-feedback`**:
  - **Controller**: `submitFeedback`
  - **Description**: Submits general feedback about the platform.

- **POST `/submit-hospital-registration`**:
  - **Controller**: `submitHospitalRegistration`
  - **Middleware**: `upload.fields(...)`
  - **Description**: Submits a registration application for a new hospital. Requires file uploads for license and logo.

- **POST `/submit-doctor-registration`**:
  - **Controller**: `submitDoctorRegistration`
  - **Middleware**: `upload.fields(...)`
  - **Description**: Submits a registration application for a new doctor. Requires file uploads for photo and license.

- **POST `/submit-questionnaire`**:
  - **Controller**: `submitQuestionnaire`
  - **Middleware**: `authUser`
  - **Description**: Submits the user's answers to the therapy questionnaire.

- **POST `/therapy-qns`**:
  - **Controller**: `therapyQuestionnaire`
  - **Description**: Provides a simple therapy recommendation based on questionnaire answers.

- **GET `/hospital/:hospitalId`**:
  - **Controller**: `getHospitalDetails`
  - **Description**: Retrieves public details for a specific hospital.

- **GET `/hospital/:hospitalId/doctors`**:
  - **Controller**: `getHospitalDoctors`
  - **Description**: Retrieves the list of doctors for a specific hospital.

- **GET `/appointment/:appointmentId/status`**:
  - **Controller**: `getAppointmentStatus`
  - **Middleware**: `authUser`
  - **Description**: Checks the status of a user's appointment, including expiration.