import React from 'react';

interface HeaderProps {
  version?: string;
}

const Header: React.FC<HeaderProps> = function({ version }) {
  return (
    <header className="Header">
      <h4 className="text-success">{`Mouseflow ${version ? version : ''}`}</h4>
    </header>
  );
};

export default Header;
