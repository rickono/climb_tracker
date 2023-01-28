import React from 'react';

const SelectMultiple = ({
  options,
  label,
}: {
  options: {
    value: string;
    label: string;
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }[];
  label: string;
}) => {
  return (
    <div className='form-control'>
      <p className='text-sm font-medium text-gray-600'>{label}</p>
      {options.map((option) => (
        <label
          className='label cursor-pointer justify-start gap-4'
          key={option.value}
        >
          <input
            type='checkbox'
            checked={option.checked}
            className='checkbox checkbox-primary'
            onChange={option.onChange}
          />
          <span className='label-text'>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default SelectMultiple;
