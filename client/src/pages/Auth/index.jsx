import React, { useState } from 'react';
import DynamicAuthForm from '../../components/AuthForm';

const Auth = () => {
    const [formType, setFormType] = useState('login');

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='flex flex-col items-center justify-between'>
                <h1>Welcome to <span className='text-2xl font-bold'>SmartSchooler</span></h1>
                <DynamicAuthForm formType={formType} setFormType={setFormType} />
                <div className="mt-4">
                    {formType === 'login' ? (
                        <button
                            onClick={() => setFormType('signup')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Don't have an account? Sign up
                        </button>
                    ) : (
                        <button
                            onClick={() => setFormType('login')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Already have an account? Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
