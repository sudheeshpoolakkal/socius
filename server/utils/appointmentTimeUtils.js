import moment from 'moment-timezone';

/**
 * Parses appointment date and time with timezone
 * @param {string} slotDate - Date string in format YYYY-MM-DD
 * @param {string} slotTime - Time string in format HH:mm or hh:mm A
 * @param {string} timeZone - Timezone string (e.g. 'Asia/Kolkata')
 * @returns {moment} Moment object representing the appointment time
 */
export const parseAppointmentDateTime = (slotDate, slotTime, timeZone = 'UTC') => {
    // Combine date and time into a single string
    const appointmentString = `${slotDate} ${slotTime}`;

    // Parse the appointment time using moment-timezone; support multiple formats
    const supportedFormats = [
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD hh:mm A',
        'DD/MM/YYYY HH:mm',
        'DD/MM/YYYY hh:mm A',
        'MM/DD/YYYY HH:mm',
        'MM/DD/YYYY hh:mm A'
    ];
    
    const appointmentTime = moment.tz(appointmentString, supportedFormats, true, timeZone);
    return appointmentTime;
};

/**
 * Gets the time 15 minutes before the appointment
 * @param {moment} appointmentTime - Moment object representing appointment time
 * @returns {moment} Moment object representing 15 minutes before appointment
 */
export const getTimeBeforeAppointment = (appointmentTime, minutes = 15) => {
    return appointmentTime.clone().subtract(minutes, 'minutes');
};

/**
 * Gets the time 30 minutes after the appointment starts (for code expiration)
 * @param {moment} appointmentTime - Moment object representing appointment time
 * @returns {moment} Moment object representing 30 minutes after appointment
 */
export const getExpirationTime = (appointmentTime) => {
    return appointmentTime.clone().add(30, 'minutes');
};

/**
 * Checks if the current time is within the valid verification window
 * (between 15 mins before appointment and 30 mins after appointment)
 * @param {moment} appointmentTime - Moment object representing appointment time
 * @param {moment} [currentTime] - Current time (defaults to now)
 * @returns {Object} { isValid: boolean, timeToCodeGeneration: number, hasExpired: boolean }
 */
export const checkVerificationWindow = (appointmentTime, currentTime = moment()) => {
    const codeGenerationTime = getTimeBeforeAppointment(appointmentTime, 15);
    const expirationTime = getExpirationTime(appointmentTime);
    
    const timeToCodeGeneration = codeGenerationTime.diff(currentTime);
    const hasExpired = currentTime.isAfter(expirationTime);
    const isWithinWindow = currentTime.isBetween(codeGenerationTime, expirationTime);
    
    return {
        isValid: isWithinWindow,
        timeToCodeGeneration,
        hasExpired,
        codeGenerationTime: codeGenerationTime.toDate(),
        expirationTime: expirationTime.toDate()
    };
};