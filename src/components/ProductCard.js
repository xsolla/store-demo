import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import Dotdotdot from 'react-dotdotdot'

import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import MUICardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

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
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <CardAppear hovered={isHovered} getTheme={getTheme}>
      <Grow in timeout={500} delay={order * 100}>
        <Card
          getTheme={getTheme}
          hovered={isHovered}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CardImage image={image}/>
          <CardContent>
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
          </CardContent>
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
      </Grow>
    </CardAppear>
  );
};

const CardAppear = styled.div`
  position: relative;
  z-index: ${props => props.hovered ? 1 : 0};
  width: ${props => `${props.getTheme('cardWidth')}px`};
  height: ${props => `${props.getTheme('cardWidth')}px`};
  padding: ${props => props.getTheme('padding')};
  margin: 16px;
`;

const Card = styled.div`
  position: absolute;
  color: ${props => props.getTheme('colorText')};
  display: flex;
  flex-direction: column;
  width: ${props => `${props.getTheme('cardWidth')}px`};
  min-height: ${props => `${props.getTheme('cardWidth')}px`};
  background-color: ${props => props.hovered ? props.getTheme('colorBg') : 'transparent'};
  box-shadow: ${props => props.hovered ? props.getTheme('boxShadow') : 'none'};
  transition: box-shadow, background-color ${props => props.getTheme('transitionStyle')};
  border-radius: ${props => props.getTheme('borderRadius')};
  padding: ${props => props.getTheme('padding')};
`;

const CardContent = styled(MUICardContent)`
  min-height: 66px;
  overflow: hidden;
  flex-grow: 0;
  padding-bottom: 0;
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bolder;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${props => Colorer(props.getTheme('colorText')).alpha(0.1).string()};
  padding: 8px 0 0 0;
  margin: 0px 16px 0 16px;
`;

const CardImage = styled.div`
  display: block;
  margin-top: 8px;
  height: 120px;
  flex-shrink: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const CardQuantity = styled.div`
  flex-grow: 1;
  color: ${props => props.getTheme('colorAccent')};
  font-weight: 600;
`;

export { ProductCard };
