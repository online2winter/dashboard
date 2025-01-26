/**
* @typedef {Object} ButtonProps
* @property {React.ReactNode} children - Button content
* @property {function} [onClick] - Click handler function
* @property {string} [className] - Additional CSS classes
* @property {Object} [props] - Additional props to pass to button element
*/

/**
* Basic button component with default styling
* @param {ButtonProps} props
* @returns {JSX.Element}
*/
const Button = ({ children, onClick, className = '', ...props }) => {
return (
    <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium
        bg-blue-600 text-white
        hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}`}
    {...props}
    >
    {children}
    </button>
);
};

export default Button;

