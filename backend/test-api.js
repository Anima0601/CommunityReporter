import fs from 'fs';
import path from 'path';

async function testApi() {
  const BASE_URL = 'http://localhost:5000/api';
  let cookie = '';
  
  console.log("--- 1. Register User ---");
  const randomEmail = `admin_${Date.now()}@test.com`;
  let res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Admin Test", email: randomEmail, password: "password" })
  });
  
  let data = await res.json();
  console.log("Register Response:", res.status, data);
  if (res.status === 201) {
    // Extract cookie
    cookie = res.headers.get('set-cookie')?.split(';')[0];
  } else {
    return console.log("Aborting due to register failure");
  }

  // Update user to be admin manually via DB just for testing
  import('./config/db.js').then(async ({ default: sequelize }) => {
    try {
      const { User } = await import('./models/index.js');
      await User.update({ role: 'admin' }, { where: { email: randomEmail } });
      console.log("User updated to admin.");
    } catch(err) {
      console.log("Error updating to admin", err);
    }
  });

  // Give DB update a second
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n--- 2. Create Report (without image for now) ---");
  // Multer upload.single("image") might fail if we don't send form-data properly, but we can send a FormData object.
  // We'll skip image upload and just send basic JSON if possible. Wait, we setup multer, let's see if it works without an image.
  const formData = new FormData();
  formData.append("title", "Test Pothole");
  formData.append("description", "A very bad pothole");
  formData.append("category", "Roads");
  formData.append("latitude", "10.0");
  formData.append("longitude", "20.0");
  
  res = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Cookie': cookie },
    body: formData
  });
  data = await res.json();
  console.log("Create Report Response:", res.status, data);
  const reportId = data.id;

  console.log("\n--- 3. Get All Reports ---");
  res = await fetch(`${BASE_URL}/reports`);
  data = await res.json();
  console.log("Get All Reports Response:", res.status, Array.isArray(data) ? `Count: ${data.length}` : data);

  if (!reportId) return;

  console.log("\n--- 4. Upvote Report ---");
  res = await fetch(`${BASE_URL}/reports/${reportId}/upvote`, {
    method: 'POST',
    headers: { 'Cookie': cookie }
  });
  data = await res.json();
  console.log("Upvote Response:", res.status, data);

  console.log("\n--- 5. Add Comment ---");
  res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ reportId: reportId, text: "I agree, this is bad." })
  });
  data = await res.json();
  console.log("Add Comment Response:", res.status, data);

  console.log("\n--- 6. Admin Get All Users ---");
  res = await fetch(`${BASE_URL}/admin/users`, {
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  data = await res.json();
  console.log("Admin Users Response:", res.status, Array.isArray(data) ? `Count: ${data.length}` : data);

  console.log("\n--- 7. Admin Update Report Status ---");
  res = await fetch(`${BASE_URL}/admin/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: "active" })
  });
  data = await res.json();
  console.log("Admin Update Status Response:", res.status, data);
  
  process.exit(0);
}

testApi();
