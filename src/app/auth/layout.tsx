const AuthLayout = ({children} : {
    children: React.ReactNode
}) => {
    return(
        <div className="h-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-300 to-green-800">
            {children}
        </div>
    )
}

export default AuthLayout