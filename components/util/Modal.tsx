import React from 'react';

const Modal = ({
  children,
  id,
  buttonText,
  buttonClass,
  modalOpen,
  setModalOpen,
}: {
  children: React.ReactNode;
  id: string;
  buttonText: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonClass?: string;
}) => {
  return (
    <>
      <label htmlFor={id} className={`${buttonClass ?? 'btn'}`}>
        {buttonText}
      </label>

      {/* Put this part before </body> tag */}
      <input
        type='checkbox'
        id={id}
        className='modal-toggle'
        checked={modalOpen}
        onChange={() => setModalOpen(!modalOpen)}
      />
      <label htmlFor={id} className='modal cursor-pointer'>
        <label className='modal-box relative' htmlFor=''>
          {children}
        </label>
      </label>
    </>
  );
};

export default Modal;
