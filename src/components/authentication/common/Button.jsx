
export default function ({  onClick, disabled, loading = false, children, variant = 'primary', className = '' }) {
  const baseClasses = "w-[150px] h-[39px] rounded-[45px] text-[16px] font-semibold flex items-center justify-center transition-all duration-300"
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-br from-primary to-quaternary text-white hover:from-quaternary hover:to-primary"
    : "box-border border-2 border-primary text-primary hover:bg-primary hover:text-white"
  
  const disabledClasses = disabled 
    ? "opacity-60 cursor-not-allowed hover:from-primary hover:to-quaternary hover:cursor-not-allowed" 
    : "";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseClasses} ${variantClasses} ${className} ${disabledClasses}`}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        children
      )}
    </button>
  )
}
