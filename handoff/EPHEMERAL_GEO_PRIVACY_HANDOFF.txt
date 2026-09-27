# Ephemeral Geo Privacy Policy — source-code verification handoff

## Task for the GPT instance with access to the iOS source code

Review the complete Ephemeral Geo source code against the privacy policy below before it is treated as final for App Store submission.

Do not silently broaden the policy or App Store privacy disclosure. If the source contradicts any statement below, report the contradiction first with the relevant file, framework, SDK, permission, entitlement, storage path, or data flow. Then propose the smallest accurate wording and App Store Connect disclosure changes.

The current intended App Store privacy disclosure is:

- Data type: Precise Location
- Collected: Yes
- Purpose: App Functionality
- Linked to the user: Yes
- Used for tracking: No

“Linked to the user” is intentional because quest and route history may be stored in CloudKit/iCloud-backed app data so the same user can retrieve previous routes. It does not mean advertising tracking.

## What to verify in the source

1. **Location access**
   - Which Core Location APIs and authorisation levels are used.
   - Whether precise location is required or approximate location is supported.
   - Whether location is accessed only while using the app or also in the background.
   - Whether route/path samples are persisted, transmitted, exported, or shared.
   - Whether the location permission descriptions accurately explain the use.

2. **CloudKit and iCloud**
   - Which CloudKit containers, databases, record types, and fields are used.
   - Whether records are stored in private, public, or shared databases.
   - Exactly which quest, destination, route, achievement, setting, or app-state records are synchronised.
   - Whether any conventional developer-operated account or backend exists.
   - Whether the developer can query or associate records with an identifiable person beyond what the policy says.

3. **Other collection or transmission**
   - Search all first-party code, dependencies, SDKs, package manifests, privacy manifests, entitlements, network calls, and embedded web content.
   - Check for analytics, diagnostics, crash reporting, advertising, attribution, telemetry, logging, push notification services, support services, or remote configuration.
   - Check whether the app collects or transmits identifiers, contact information, user content, photos, audio, contacts, search history, usage data, diagnostics, or any other App Store privacy category.
   - Verify that no data is linked with third-party data for advertising or measurement and nothing is shared with a data broker.

4. **Retention and deletion**
   - Verify any in-app deletion, reset, history-clearing, CloudKit deletion, or account-data management controls.
   - Do not claim a deletion control or automatic retention period unless it actually exists.
   - Determine what remains after uninstalling the app, disabling iCloud, signing out of iCloud, clearing local history, or revoking location access.

5. **Policy accuracy**
   - Confirm every present-tense feature and data practice below.
   - Flag any planned feature that is not actually part of the release build.
   - Confirm that the contact address and support route are appropriate for privacy/deletion requests.
   - Confirm the App Store Connect privacy answers match the final release binary and all included third-party code.

## Current live URLs

- Central privacy directory: https://remymoscovitz.com/privacy/
- App-specific App Store URL: https://remymoscovitz.com/privacy/ephemeral-geo/
- Privacy contact: mail@remymoscovitz.com
- Support form: https://remymoscovitz.com/support/

## Exact current policy wording

# Ephemeral Geo Privacy Policy

**Effective:** 24 August 2026  
**Developer:** Remy Moscovitz

Ephemeral Geo turns an unknown destination into an adventure. Location is used to make that experience work—not to advertise to you or track you across apps and websites.

### Privacy summary

- **Data:** Precise location — used during location-based adventures and for saved route history.
- **Purpose:** App functionality — needed to generate, manage, record and revisit adventures.
- **Tracking:** Not used for tracking — no advertising profiles, cross-app tracking or data-broker sharing.

## About this policy

This Privacy Policy explains how Ephemeral Geo handles information when you use the app. Ephemeral Geo is independently developed by Remy Moscovitz.

The app generates coordinates for you to explore, supports quests to those destinations and lets you keep a history of your adventures. It does not use a conventional username-and-password account system, and you do not create a separate Remy Moscovitz account.

## Data the app uses

Ephemeral Geo collects precise location for app functionality. The app may also create and store app records needed to preserve your experience, such as:

- generated and completed destinations;
- quest or adventure history;
- the geographical path travelled during a quest;
- achievements; and
- relevant app state and settings.

The app does not require you to provide a name, email address, phone number or physical address to create an account.

## How location data is used

Location is fundamental to Ephemeral Geo. With your permission, the app uses Apple’s Location Services to access your device’s precise location. This may be used to:

- determine your current location;
- generate and manage location-based adventures;
- determine your progress during a quest;
- record the path you travel during a quest;
- create a historical record of an adventure; and
- show previous destinations and routes to you later.

**Linked does not mean tracked for advertising.** Precise location is declared as linked to you because quest and path history may be saved with your iCloud-backed app data so that the same user can retrieve previous routes. It is not used to follow you across third-party apps or websites.

## CloudKit and iCloud

Ephemeral Geo uses Apple’s CloudKit and iCloud services to store and synchronise certain app data. This can include quest history, destinations, route information, achievements and app state required to restore or synchronise your experience across compatible devices.

Remy Moscovitz does not operate the underlying CloudKit or iCloud infrastructure. Your use of those services is also subject to Apple’s applicable terms and privacy practices. You can review Apple’s Privacy Policy at https://www.apple.com/legal/privacy/ and the iCloud Terms of Service at https://www.apple.com/legal/internet-services/icloud/en/terms.html.

Ephemeral Geo does not operate a conventional account database. Where CloudKit requires it, the app relies on your Apple and iCloud environment.

## Advertising, analytics and tracking

Ephemeral Geo does not use precise location or saved adventure data for:

- third-party advertising or targeted advertising;
- developer advertising or marketing;
- analytics or advertising measurement;
- building advertising profiles;
- cross-app or cross-website tracking;
- sale or sharing with data brokers.

Apple uses “tracking” to describe linking app data with third-party data for targeted advertising or advertising measurement, or sharing app data with a data broker. Ephemeral Geo does not use precise location for those purposes.

## Your location choices

iOS controls access to your location. You can grant, limit or revoke Ephemeral Geo’s access in **Settings → Privacy & Security → Location Services → Ephemeral Geo**. Apple provides more detail in its guide to controlling location information on iPhone: https://support.apple.com/guide/iphone/control-the-location-information-you-share-iph3dd5f9be/ios.

If you disable location access or precise location, features that depend on knowing your position—including generating or completing adventures and recording routes—may be unavailable or substantially limited. Changing this permission stops future access under the setting you choose; it does not by itself delete app data already stored.

## Data retention and deletion

App data used for persistent features, such as quest and route history, may remain available while needed to provide those features and synchronise your experience. No fixed retention period is promised.

You can revoke future location access at any time through iOS Settings. For questions about app data or a deletion request, contact Remy using the details below. The ability to access or delete particular CloudKit-backed data may depend on how Apple’s iCloud services store and make that data available.

## Children’s privacy

Ephemeral Geo is not specifically designed or marketed as a children’s app. If you are a parent or guardian and have a privacy concern about a child’s use of Ephemeral Geo, please contact Remy so the concern can be reviewed.

## Changes to this policy

This policy may be updated when Ephemeral Geo’s functionality or data practices change, or when clarification is needed. The effective date at the top of this page will be updated when a revised policy is published. New data practices will be described when they apply; this policy does not pre-authorise future collection.

## Contact Remy

For privacy questions or data deletion enquiries relating to Ephemeral Geo, email mail@remymoscovitz.com or use the support form at https://remymoscovitz.com/support/.

Developer: Remy Moscovitz  
Website: https://remymoscovitz.com

## Website implementation included with this handoff

The accompanying archive contains:

- this verification handoff;
- the exact HTML for the central privacy directory;
- the exact HTML for the Ephemeral Geo Privacy Policy page; and
- the website stylesheet containing the privacy-page and footer-link styles.

The live portfolio also has a subtle `/privacy/` footer link on its main, project, support, and generated project-detail pages.
