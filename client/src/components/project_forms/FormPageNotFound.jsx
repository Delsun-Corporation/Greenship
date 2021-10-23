import React from 'react';
import {FormFooter} from '../FormLayouts';

function FormPageNotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center align-middle">
          <img
                src="https://firebasestorage.googleapis.com/v0/b/ina-website-326209.appspot.com/o/resource%2FEmpty_State_Background.svg?alt=media&token=89e118d7-ea2b-40de-9718-4922a3f38ec2"
                alt="No Project"
                className="w-1/2 h-48 mb-4"
              />
          <h1 className="font-body text-center font-bold text-charcoal text-2xl">404 Page Not Found</h1>
        </div>
    )
}

export default FormPageNotFound
