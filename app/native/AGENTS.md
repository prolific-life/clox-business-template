# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

This app is pinned to **Expo SDK 54** — the SDK the iOS App Store Expo Go ships, so previews open on a stock phone (the newest SDK is TestFlight-only). Do NOT bump to a newer SDK just because it exists; match whatever https://expo.dev/go shows for the App Store. After any dependency change run `npx expo install --fix` to align versions to the SDK.

## Design tokens — never hardcode colors/sizes

This app's visual system lives in `constants/branding/` (`colors`,
`typography`, `radius`, `spacing`). EVERY screen reads from it — never
write a hex value or raw size into a `StyleSheet`. This is the **mirror**
of `app/web/constants/branding/`: the `brand` and `semantic` color groups
are kept IDENTICAL across the two apps so one brand decision drives both.
When the brand/visual-identity changes, update these tokens (and the web
mirror) — every screen then re-themes for free. The only allowed literal
colors are third-party brand marks that aren't ours (e.g. Google's blue
on the "Continue with Google" button).
