import React from 'react';

interface SaveGuidanceActionProps {
  isSaved: boolean;
  onSave: () => void;
  saveConfirmed: boolean;
  isUserSignedIn: boolean;
}

export default function SaveGuidanceAction({
  isSaved,
  onSave,
  saveConfirmed,
  isUserSignedIn,
}: SaveGuidanceActionProps) {
  return (
    <>
      <div className="response-actions">
        {!isSaved ? (
          <button
            onClick={onSave}
            className="save-response-btn"
            aria-label={isUserSignedIn ? "Save response to your account" : "Save response locally"}
          >
            🔖 {isUserSignedIn ? 'Save to Cloud' : 'Save'}
          </button>
        ) : (
          <span role="status" className="saved-confirmation">
            ✓ Saved {isUserSignedIn ? 'to Cloud' : 'locally'}
          </span>
        )}
      </div>

      {/* Save confirmation toast */}
      {saveConfirmed && (
        <div className="save-toast" role="status" aria-live="polite">
          <span>✓</span> Response saved to your {isUserSignedIn ? 'account' : 'device'}. View it in the Saved tab.
        </div>
      )}
    </>
  );
}
