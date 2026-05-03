# Firestore Security Rules: Saved Guidance

To protect user data in the `savedGuidance` collection, apply the following security rules in the Firebase Console.

## Rule Definition

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Saved Guidance Rules
    // Users can only read/write their own saved guidance items.
    match /savedGuidance/{guidanceId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId && request.auth.uid == request.resource.data.userId;
    }

    // Default: Deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explanation
- **Read/Delete**: Only the user who owns the guidance (matched by `userId` field) can read or delete it.
- **Create**: A user can create a new guidance item only if they are authenticated and the `userId` field matches their UID.
- **Update**: Updates are allowed only if the authenticated user is the owner of both the existing and incoming document data.
- **Default Deny**: All other access is blocked by default for security.
