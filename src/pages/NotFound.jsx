import React from 'react'

const NotFound = () => {
    return (
        <div className='min-h-screen section-light flex items-center justify-center'>
            <div className="text-center">
                <h1 className='text-4xl md:text-5xl font-bold mb-6 text-heading'>Page not found</h1>
	            <p className='text-xl text-body'>Error 404: The page you're looking for does not exist!</p>
            </div>
        </div>
    )
}

export default NotFound;
