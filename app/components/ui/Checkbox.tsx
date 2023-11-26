import { BsCheckLg } from "react-icons/bs"
import { twMerge } from "tailwind-merge"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isChecked: boolean
  onChange: () => void
  label: string
  labelClassName?: string
  disabled?: boolean
}

export function Checkbox({ isChecked, onChange, label, labelClassName = "", disabled, ...props }: CheckboxProps) {
  return (
    <div className={twMerge(`checkbox-container`, disabled && "opacity-50 cursor-default pointer-events-none")}>
      <input
        className="bg-foreground cursor-pointer"
        type="checkbox"
        id="check"
        checked={isChecked}
        onChange={onChange}
        {...props}
      />
      <label className={`${labelClassName} font-secondary text-sm select-none cursor-pointer`} onClick={onChange}>
        {label}
      </label>
      {isChecked && (
        <BsCheckLg className="absolute left-[2px] bottom-[2px] text-black select-none pointer-events-none" />
      )}
    </div>
  )
}
