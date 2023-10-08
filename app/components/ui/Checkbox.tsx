import { BsCheckLg } from "react-icons/bs"
import { twMerge } from "tailwind-merge"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isChecked: boolean
  onChange: () => void
  label: string
  labelClassName?: string
  disabled?:boolean
}

export function Checkbox({ isChecked = false, onChange, label, labelClassName = "",disabled, ...props }: CheckboxProps) {
  return (
    <div className={`checkbox-container ${disabled && 'opacity-50 cursor-default pointer-events-none'}`}>
      <input
        className={`cursor-pointer bg-foreground`}
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
        <BsCheckLg className="absolute left-[2px] bottom-[3px] text-black pointer-events-none select-none" />
      )}
    </div>
  )
}
