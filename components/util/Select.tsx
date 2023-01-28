import React from 'react';

const Select = ({
  label,
  name,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <div className='form-control'>
      <label htmlFor={name}>
        <span className='font-medium text-gray-600 text-sm'>{label}</span>
      </label>
      <select
        className='select select-bordered w-full max-w-xs select-sm'
        onChange={onChange}
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
