import React from 'react';

const Form = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };
  return (
    <form className='flex flex-col justify-start gap-2' onSubmit={submitForm}>
      {children}
    </form>
  );
};

export default Form;
