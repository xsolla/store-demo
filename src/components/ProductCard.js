import React from "react";
import styled, { css } from "styled-components";
import Colorer from "color";
import Dotdotdot from 'react-dotdotdot'

import Collapse from "@material-ui/core/Collapse";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const ProductCard = ({
  order,
  image,
  name,
  value,
  description,
  actionButtonContent,
  getTheme,
  onAction,
}) => {
  const [isHovered, setHovered] = React.useState(false);
  const [cardShown, setCardShown] = React.useState(false);
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  React.useEffect(() => {
    if (!cardShown) {
      setTimeout(() => setCardShown(true), order * 100);
    }
  });

  return (
    <CardAppear hovered={isHovered} getTheme={getTheme} shown={cardShown}>
      <Card
        getTheme={getTheme}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardImage image={image}/>
        <CardDescription>
          <CardTitle>{name}</CardTitle>
          <Collapse in={isHovered} timeout="auto" collapsedHeight="50px">
            {isHovered
              ? description
              : (
              <Dotdotdot animate clamp={2}>
                {description}
              </Dotdotdot>
            )}
          </Collapse>
        </CardDescription>
        <CardFooter getTheme={getTheme}>
          <CardQuantity getTheme={getTheme}>
            {value}
          </CardQuantity>
          <Button
            getTheme={getTheme}
            variant="contained"
            onClick={onAction}
          >
            {actionButtonContent}
          </Button>
        </CardFooter>
      </Card>
    </CardAppear>
  );
};

const CardAppear = styled.div`
  position: relative;
  z-index: ${props => props.hovered ? 1 : 0};
  width: ${props => `${props.getTheme("cardWidth")}px`};
  height: ${props => `${props.getTheme("cardWidth")}px`};
  padding: ${props => props.getTheme("padding")};
  margin: 16px;
  transition: transform 350ms ease-out, opacity 150ms ease-out;
  ${props => !props.shown && css`
    opacity: 0;
    transform: translateY(20px) scale(1);`
  }
`;

const Card = styled.div`
  position: absolute;
  color: ${props => props.getTheme("colorText")};
  display: flex;
  flex-direction: column;
  width: ${props => `${props.getTheme("cardWidth")}px`};
  min-height: ${props => `${props.getTheme("cardWidth")}px`};
  flex-shrink: 0;
  flex-grow: 1;
  background: transparent;
  transition: box-shadow, background ${props => props.getTheme("transitionStyle")};
  border-radius: ${props => props.getTheme("borderRadius")};
  padding: ${props => props.getTheme("padding")};

  &:hover {
    z-index: 1;
    background: ${props => props.getTheme("colorBg")};
    box-shadow: ${props => props.getTheme("boxShadow")};
  }
`;

const CardDescription = styled(CardContent)`
  min-height: 66px;
  overflow: hidden;
  flex-grow: 0;
  padding-bottom: 0 !important;
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CardFooter = styled.div`
  ${props =>
    !props.cardType &&
    css`
      display: flex;
      align-items: center;
      border-top: 1px solid
        ${props =>
        Colorer(props.getTheme("colorText"))
            .alpha(0.1)
            .string()};
      padding: 8px 0 0 0;
      margin: 0px 16px 0 16px;
    `}
  ${props =>
    props.cardType &&
    css`
      padding: 16px 0;
      width: 160px;
      display: grid;
      grid-template-columns: auto;
      grid-row-gap: 8px;
      place-content: start start;
    `}
`;

const CardImage = styled.div`
  display: block;
  margin-top: 8px;
  min-height: 120px;
  flex-grow: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const CardQuantity = styled.div`
  flex-grow: 1;
  color: ${props => props.getTheme("colorAccent")};
  font-weight: 600;
`;

export { ProductCard };
