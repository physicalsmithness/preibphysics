# Topic 5 Quiz (Firebase) — Google login + teacher dashboard

This is a small Firebase Hosting web app:
- pupils sign in with Google
- quiz results are saved to Firestore
- teachers can view class progress (if granted teacher access)

## 1) Create Firebase project
1. Go to Firebase console → Add project.
2. Add a Web app to the project (Project settings → Your apps → Web).
3. Copy the config snippet.

## 2) Enable Google login
Firebase console → Authentication → Sign-in method → Google → Enable.

## 3) Create Firestore + rules
1. Firebase console → Firestore Database → Create database.
2. Choose a location (keep it consistent).
3. Go to Rules tab and paste the contents of `firestore.rules`.

## 4) Paste config
Open `config.js` and paste your Firebase config object, setting:
export const firebaseConfig = { ... };

## 5) Make a teacher
Teacher access is controlled by a Firestore doc:
`teachers/<uid>`

Steps:
1) Deploy the site (step 6) or run locally.
2) Teacher signs in once.
3) The app shows the teacher's UID in the top right.
4) In Firestore console, create a document:
   Collection: teachers
   Document ID: <teacher uid>
   Fields (optional): email (string), name (string), createdAt (timestamp)

After that, the Teacher button appears for that account.

## 6) Deploy with Firebase Hosting
Install Firebase CLI:
  npm i -g firebase-tools

Login:
  firebase login

Init hosting (run inside this folder):
  firebase init hosting

Suggested answers:
- Use existing project: select your project
- Public directory: . (dot)
- Configure as single-page app: No
- GitHub deploys: No (optional)

Deploy:
  firebase deploy

## 7) Progress saved
Each attempt writes:
- users/<uid>/attempts/<autoId>
and updates:
- users/<uid> (stats counters)

Teacher dashboard reads the users collection and shows summary.

## Notes on marking
Long-answer items are marked by checking for keyword/phrase presence only.
The app flags this and pupils should self-check quality.
