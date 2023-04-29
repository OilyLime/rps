import React from "react";
import styled from "styled-components";

interface ContainerProps {
  children: React.ReactNode;
}

const Block = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
width: 100vw;
overflow: wrap;
`

const Box = styled.div`
width: 60%;
height: 60%;
background-color: white;
border-radius: 5px;
box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
background-color: #F5F0EA
`

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Block>
      <Box>
        {children}
      </Box>
    </Block>
  );
};

export default Container;