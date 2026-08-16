
const SERVER_URL = 'http://localhost:4000';

async function run() {
    try {
        console.log('Starting Membership Verification Flow...');

        const timestamp = Date.now();
        const email = `verify_mb_${timestamp}@example.com`;
        const password = 'Password@123';
        const name = `Verifier ${timestamp}`;

        // 1. Register
        console.log(`\n1. Registering user: ${email}...`);
        const regRes = await fetch(`${SERVER_URL}/api/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const regData = await regRes.json();
        console.log('Register Response:', regData);
        // Response might be { success: true, token: ... } or just message based on controller
        // userController registerUser returns { success: true, token }
        if (regRes.status !== 201 && !regData.success) throw new Error('Registration failed: ' + (regData.message || regRes.statusText));

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await fetch(`${SERVER_URL}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);
        if (!loginData.success || !loginData.token) throw new Error('Login failed');

        const token = loginData.token;

        // 3. Add Funds
        console.log('\n3. Adding Funds (500)...');
        const fundsRes = await fetch(`${SERVER_URL}/api/user/add-funds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 500 })
        });
        const fundsData = await fundsRes.json();
        console.log('Add Funds Response:', fundsData);
        if (!fundsData.success) throw new Error('Add Funds failed');

        // 4. Purchase Membership
        console.log('\n4. Purchasing Membership (Cost 199)...');
        const purchaseRes = await fetch(`${SERVER_URL}/api/user/purchase-membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        const purchaseData = await purchaseRes.json();
        console.log('Purchase Response:', purchaseData);
        if (!purchaseData.success) throw new Error('Purchase failed');

        // 5. Verify Profile
        console.log('\n5. Verifying Profile...');
        const profileRes = await fetch(`${SERVER_URL}/api/user/get-profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const profileData = await profileRes.json();
        const user = profileData.userData;

        console.log('User Membership Status:', {
            isMember: user.isMember,
            membershipType: user.membershipType,
            membershipExpiry: user.membershipExpiry,
            walletBalance: user.walletBalance
        });

        if (!user.isMember) throw new Error('User is NOT marked as member');
        if (user.membershipType !== 'Neighbourhood') throw new Error('Incorrect membership type');

        // Check balance (500 - 199 = 301)
        if (user.walletBalance !== 301) console.warn('WARNING: Wallet balance check failed. Expected 301, got ' + user.walletBalance);
        else console.log('Wallet balance correct: 301');

        console.log('\nSUCCESS: Membership Verification Flow Passed!');

    } catch (error) {
        console.error('\nFAILED:', error.message);
        if (error.cause) console.error(error.cause);
    }
}

run();
