const admin = require("firebase-admin");
const serviceAccount = require("./Service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "MY-STORAGE-BUCKET" 
});

const bucket = admin.storage().bucket();

async function manageFiles() {
  const fileName = "icon.png";
  const file = bucket.file(fileName);

  // Define expiration (max 7 days for signed URLs)
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

  // GENERATE DOWNLOAD URL
  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: expiresAt
  }).then(urls => urls[0]).catch(err=>{
    console.log("Failed to get signed URLs",err?.message || "unknown error")

  });

  // GENERATE UPLOAD URL
  const [uploadUrl] = await file.getSignedUrl({
    action: 'write',
    expires: expiresAt,
    contentType: 'image/png' // Frontend must send this exact type
  });

  console.log("Read Link:", downloadUrl);
  console.log("Write Link:", uploadUrl);
}

manageFiles().catch(console.error);
