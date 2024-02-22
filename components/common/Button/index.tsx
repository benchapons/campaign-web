import React, { FC, memo, MouseEventHandler, useMemo } from 'react';

interface ButtonProps {
  theme?: 'primary' | 'secondary' | 'info' | 'outline-primary' | 'warning' | 'danger';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  name: string;
  isFull?: boolean;
  isSmall?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  testId?: string;
}

const Button: FC<ButtonProps> = ({
  theme = 'primary',
  disabled,
  className,
  children,
  isFull,
  isSmall = false,
  name = '',
  type = 'button',
  testId = '',
  onClick,
}) => {
  const styles = useMemo(
    () => ({
      primary: `h-10 bg-blue-sea text-white border border-white hover:bg-blue-sea/75`,
      secondary: `h-10 bg-white text-blue-sea border border-blue-pacific/50 hover:bg-blue-fresh/20 hover:border-blue-pacific`,
      info: `h-10 bg-blue-fresh/40 text-blue-sea hover:bg-blue-fresh`,
      warning: 'h-10 bg-blue-fresh/80 border border-blue-cobalt text-blue-cobalt',
      disabled: `h-10 bg-gray-gainsboro text-gray border border-transparent cursor-not-allowed`,
      'outline-primary': `bg-blue-fresh/20 text-blue-cobalt border border-blue-fresh  hover:bg-blue-fresh/30`,
      danger: `h-10 bg-red-light/20 text-red border border-red-light  hover:bg-red-light/30`,
    }),
    [theme]
  );

  return (
    <button
      className={`flex justify-center items-center rounded-md shadow px-5 ${
        disabled ? styles.disabled : styles[theme]
      } ${className} ${isFull ? 'w-full' : isSmall ? '' : 'min-w-[120px]'} `}
      disabled={disabled}
      onClick={onClick}
      type={type}
      name={name}
      test-id={testId}
    >
      {children}
    </button>
  );
};

export default memo(Button);
