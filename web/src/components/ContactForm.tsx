import React, { useState } from 'react';
import { send } from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

import { submitContactForm } from '../lib/graphql';
import { isValidEmail } from '../lib/utils';

const PUBLIC_KEY = (import.meta.env.PUBLIC_EMAIL_KEY as string) || '';
const SERVICE_ID = (import.meta.env.PUBLIC_EMAIL_SERVICE_ID as string) || '';
const TEMPLATE_ID = (import.meta.env.PUBLIC_EMAIL_TEMPLATE_ID as string) || '';

export const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Function to handle submit contact form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!message || !name || !email) {
      toast.error('All fields are required!');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const formattedFormData = {
      Name: name,
      Email: email,
      Message: message,
    };

    setLoading(true);
    try {
      await submitContactForm(formattedFormData);
      await send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name,
          email,
          message,
        },
        PUBLIC_KEY
      );
      toast.success('Your message has been sent!');
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="mt-3 flex flex-col gap-5">
        <input
          type="text"
          name="name"
          placeholder="Your name*"
          className="border-border border-opacity-75 focus:border-opacity-0 focus:ring-primary w-full border px-3 py-2 text-[0.9rem] font-thin italic focus:ring-2 focus:outline-hidden"
        />
        <input
          type="text"
          name="email"
          placeholder="Your email*"
          className="border-border border-opacity-75 focus:border-opacity-0 focus:ring-primary w-full border px-3 py-2 text-[0.9rem] font-thin italic focus:ring-2 focus:outline-hidden"
        />
        <textarea
          name="message"
          placeholder="Write message*"
          className="border-border border-opacity-75 focus:border-opacity-0 focus:ring-primary min-h-[150px] w-full border px-3 py-2 text-[0.9rem] font-thin italic focus:ring-2 focus:outline-hidden"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-[225px] self-start bg-linear-to-r from-teal-500 to-teal-800 px-1 py-2 text-xs tracking-wider text-white hover:from-teal-800 hover:to-teal-500 hover:font-medium"
      >
        {loading ? 'Sending...' : 'SEND MESSAGE'}
      </button>
      <Toaster />
    </form>
  );
};
