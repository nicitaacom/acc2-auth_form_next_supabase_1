import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface DarkModeStore {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

type SetState = (fn: (prevState: DarkModeStore) => DarkModeStore) => void

export const toggleDarkMode = (darkMode: DarkModeStore) => {
  return (darkMode.isDarkMode = !darkMode.isDarkMode)
}

export const darkMode = (set: SetState): DarkModeStore => ({
  isDarkMode: true,
  toggleDarkMode() {
    set((state: DarkModeStore) => ({
      ...state,
      isDarkMode: toggleDarkMode(state),
    }))
  },
})

const useDarkMode = create(devtools(persist(darkMode, { name: "darkMode" })))

export default useDarkMode
