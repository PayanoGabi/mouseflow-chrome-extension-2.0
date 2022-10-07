import React from 'react';
import styled from '@emotion/styled';
import SessionControls from '../../views/Panel/SessionControls';


interface HeaderProps {
  version?: string;
}

const Brand = styled.strong`
  margin-left: 0.5em;
  margin-right: auto;
  font-size: 1.25em;
`;

const Button = styled.button`
  background-color: unset;
  border: 1px solid;
  border-radius: 2px;
  height: 28px;
  margin-bottom: 4px;
`;

const Header = styled.header`
  color: rgb(0 0 0 / 85%);
  height: 32px;
  border-bottom: 1px solid;
  border-color: rgb(0 0 0 / 25%);
`;

const Root: React.FC<HeaderProps> = function() {
  return (
    <Header className="Header">
      <Brand>Mouseflow</Brand>
    </Header>
  );
};

export default Root;
