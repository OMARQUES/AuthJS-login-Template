const dashboardLayout = ( {children} : {children: React.ReactNode} ) => {
    return (
        <div className="flex flex-col gap-y-4">
            <nav className="bg-black text-white">Navbar</nav>
            {children}
        </div>
    )
}

export default dashboardLayout;