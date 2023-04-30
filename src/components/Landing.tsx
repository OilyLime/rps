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
`;

const Box = styled.div`
  width: 60%;
  height: 60%;
  background-color: white;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  background-color: #f5f0ea;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const ImagesContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 0 10px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const NewGameButton = styled.button`
  width: 20%;
  background-color: #2c3e50;
  color: #f5f0ea;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #5d3f31;
  }
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const response = await fetch("game/new", { method: "GET" });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      const gameId = await response.text();
      navigate(`/play/${gameId}`);
    } catch (error) {
      setLoading(false);
      console.error("Error creating game:", error);
    }
  };

  return (
    <Block>
      <Box>
        <Container>
          <ImagesContainer>
            <ImageWrapper>
              <Image src="/rock.png" />
            </ImageWrapper>
            <ImageWrapper>
              <Image src="/paper.png" />
            </ImageWrapper>
            <ImageWrapper>
              <Image src="/scissors.png" />
            </ImageWrapper>
          </ImagesContainer>
          <NewGameButton onClick={handleCreateGame} disabled={loading}>
            {loading ? "Loading..." : "Play"}
          </NewGameButton>
        </Container>
      </Box>
    </Block>
  );
};

export default Landing;
