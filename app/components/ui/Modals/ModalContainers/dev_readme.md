## Problem

When you open any modal it render ModalContainer.tsx for all modals
And that's why performance not so as it could

## Solution

Create container for each Modal and render only that modal that returns true on condition query params
for example `{searchParams.get("modal") === 'AuthModal' && children}` if search params ?modal=AuthModal
only in this case AuthModal.tsx will rendered

You can check re-render for ModalContainer.tsx by adding in ModalContainer.tsx

```tsx
console.log("ModalContainer re-render")
```
