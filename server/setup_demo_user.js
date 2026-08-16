
const SERVER_URL = 'http://localhost:4000';

async function run() {
    try {
        console.log('Setting up Demo User for UI Verification...');

        const email = 'demo_member@socius.com';
        const password = 'Password@123';
        const name = 'Demo Member';

        // 1. Register (ignore if exists)
        try {
            await fetch(`${SERVER_URL}/api/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
        } catch (e) { }

        // 2. Login
        const loginRes = await fetch(`${SERVER_URL}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (!loginData.success) throw new Error('Login failed');
        const token = loginData.token;

        // 3. Add Funds (ensure enough balance)
        await fetch(`${SERVER_URL}/api/user/add-funds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 1000 })
        });

        // 4. Purchase Membership (ensure is member)
        const purchaseRes = await fetch(`${SERVER_URL}/api/user/purchase-membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        console.log('Demo User Ready:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Membership Purchased:', (await purchaseRes.json()).success);

    } catch (error) {
        console.error('Setup Failed:', error);
    }
}

run();
