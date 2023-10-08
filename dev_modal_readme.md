## Problem

Every time I need create modal with performance in next

## Sotution

Do it once here and reuse

## How it work

It works like you click the Button component (if button has href its `<Link/>`)

Then it re-render everything (I mean layout.tsx) (also re-render client component on client side and server components on server side)
(because its default behavior for `<Link/>`) and than modal appears

To create modal in modal just check how it realized with ProfileModal.tsx (in button which client component I pasted logic for modal with useState)

It already optimized and children (e.g AdminModal.tsx is server component) and wrapper for children (with fixed inset-0 bg-black/0.2) its client component
(because framer-motion use useEffect and because document doesn't exist on server side)
https://www.youtube.com/watch?v=c8Q_Kp_lDng

## How to implement

1. Implement basic setup for next (Layout.tsx tailwind.config.ts globals.css .prettierrc.yaml)
2. Implement Button.tsx [here](https://codesandbox.io/p/sandbox/button-as-universal-component-jyfyg4?file=%2Fapp%2Fcomponents%2FButton.tsx)
   or using quick guide - pnpm i class-variance-authority tailwind-merge - ctrl+c ctrl+v Button.tsx tailwind.config.ts globals.css
3. pnpm i framer-motion react-icons react-swipeable
4. ModalContainer.tsx
5. OpenAdminModalButton.tsx
6. AdminModal.tsx
7. ModalContainers/AdminModalContainer.tsx
8. Adjust colors for modals to fit your color palette in globals.css
9. Render OpenAdminModalButton.tsx somewhere (e.g in Navbar)
10. Render AdminModal as children AdminModalContainer somewhere (e.g in layout)
11. 4 different dev_readme.md

If you need modal in modal repeat 5-10 with ProfileModal
