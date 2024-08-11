const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json')



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // The database URL depends on the location of the database
    databaseURL: "" // firebase realtime url 

});



// Get a reference to the database service
const db = admin.database();

export { db };
