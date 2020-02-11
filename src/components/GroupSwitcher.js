import React from 'react';
import styled from 'styled-components';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';

import { ProductContext } from '../context';

const GroupSwitcher = ({
  groups,
  activeGroup,
  onGroupChange,
}) => {
  const { getTheme } = React.useContext(ProductContext);
  const handleGroupChange = (_, groupID) => onGroupChange(groupID);

  return (
    <Tabs
      getTheme={getTheme}
      value={activeGroup}
      onChange={handleGroupChange}
      variant="scrollable"
    >
      {groups.map(group => (
        <Tab
          getTheme={getTheme}
          value={group.id}
          key={group.id}
          color="secondary"
          textColor="secondary"
          label={group.name}
        />
      ))}
    </Tabs>
  );
}

const Tabs = styled(MUITabs)`
  padding: 30px 0;
  color: ${props => props.getTheme('colorAccent')};
  
  & .MuiTabs-flexContainer {
    justify-content: center;
  };
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    color: ${props => props.getTheme('colorAccentText')};
    font-family: ${props => props.getTheme('fontFamily')};
  };
`;

export { GroupSwitcher };
