import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const Container = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-around;
flex-wrap: wrap;
width: 100%;
height: 100%; /* Add this to ensure the container takes the full height */
`

const ImagesContainer = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
width: 100%;
padding: 0 10px;
`

const Image = styled.img`
max-width: 300px;
width: 100%;
height: auto;
`

const NewGameButton = styled.button`
width:20%;
background-color: #2C3E50;
color: #F5F0EA;
border: none;
border-radius: 25px;
padding: 10px 20px;
font-size: 16px;
cursor: pointer;
margin-top: 20px;
&:hover {
  background-color: #5D3F31;
}
border-radius: 5px;
box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
`

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('game/new', { method: 'GET' });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message)
      }
      const gameId = await response.text();
      navigate(`/play/${gameId}`);
    } catch (error) {
      setLoading(false);
      console.error('Error creating game:', error);
    }
  };

  return (
    <Block>
    <Box>
    <Container>
        <ImagesContainer>
            <Image src="/rock.png" />
            <Image src="/paper.png" />
            <Image src="/scissors.png" />
        </ImagesContainer>
      <NewGameButton onClick={handleCreateGame} disabled={loading}>
        {loading ? 'Loading...' : 'Play'}
      </NewGameButton>
    </Container>  
      </Box>  
    </Block>
    
  );
};

export default Landing;