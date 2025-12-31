/**
 * Generates a random 6-digit numeric code
 * @returns {string} 6-digit numeric code as a string
 */
export const generateVerificationCode = () => {
    // Generate a random number between 100000 and 999999 (inclusive)
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
};

/**
 * Validates if a given string is a valid 6-digit numeric code
 * @param {string} code - The code to validate
 * @returns {boolean} true if the code is valid, false otherwise
 */
export const isValidVerificationCode = (code) => {
    return typeof code === 'string' && 
           code.length === 6 && 
           /^\d{6}$/.test(code);
};