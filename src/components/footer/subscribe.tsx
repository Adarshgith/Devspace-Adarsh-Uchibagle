'use client';
import { useEffect } from 'react';

interface Props {
  jotFormId: string;
}

const SubscribeForm = ({jotFormId}: Props) => {
  useEffect(() => {

    // Create the script tag
    const jotFormScript = document.createElement('script');
    jotFormScript.src = `https://form.jotform.com/jsform/${jotFormId}`; // Replace with your JotForm ID
    jotFormScript.type = 'text/javascript';
    jotFormScript.async = true;

    // Insert the script into the document
    const scriptContainer = document.getElementById('subscribeForm');
    if (scriptContainer) {
      scriptContainer.innerHTML = ''; // Clear any existing content
      scriptContainer.appendChild(jotFormScript); // Append the new script
    } 
  }, []);

  return (
    <div className="w-[41%] max-md:w-full xl:min-h-[220px] rounded-lg overflow-hidden">
      <div id="subscribeForm" className="" aria-labelledby="subscribeFormLabel"></div>
    </div>
  );
};

export default SubscribeForm;
