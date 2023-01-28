import React from 'react';

const Input = ({
  label,
  name,
  placeholder,
  size = 'sm',
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  size?: 'sm' | 'md' | 'lg';
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  const sizeClass = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };
  return (
    <div className='form-control'>
      <label htmlFor={name}>
        <span className='font-medium text-gray-600 text-sm'>{label}</span>
      </label>
      <input
        name={name}
        type='text'
        placeholder={placeholder}
        className={`input input-bordered w-full max-w-xs ${sizeClass[size]}`}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
