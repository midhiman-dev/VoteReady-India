// seed-firestore.js
import admin from 'firebase-admin';

// Initialize using the project ID from your .env
admin.initializeApp({
    projectId: 'voteready-india-run'
});

const db = admin.firestore();

async function seed() {
    console.log('Connecting to Firestore...');
    try {
        const docRef = db.collection('sourceRegistry').doc('test-firestore-source');
        await docRef.set({
            id: "test-firestore-source",
            title: "Firestore Canary Source",
            sourceType: "eci_official",
            jurisdictionLevel: "national",
            publisher: "Firestore Test",
            url: "https://example.com/firestore",
            freshnessStatus: "verified",
            summary: "If you see this, Firestore is working!"
        });
        console.log('✅ Success! Test source added to Firestore.');
    } catch (error) {
        console.error('❌ Error seeding Firestore:', error);
        console.log('\nTip: Make sure you ran "gcloud auth application-default login"');
    }
}

seed();
