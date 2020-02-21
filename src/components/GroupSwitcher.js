import React from 'react';
import styled from 'styled-components';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';

const GroupSwitcher = ({
  groups,
  activeGroup,
  onGroupChange,
}) => {
  const handleGroupChange = (_, groupID) => onGroupChange(groupID);

  return (
    <Tabs
      value={activeGroup}
      onChange={handleGroupChange}
      variant="scrollable"
    >
      {groups.map(group => (
        <Tab
          value={group.id}
          key={group.id}
          color="secondary"
          textColor="secondary"
          label={group.label}
        />
      ))}
    </Tabs>
  );
}

const Tabs = styled(MUITabs)`
  padding: 30px 0;
  color: ${props => props.theme.colorAccent};
  
  & .MuiTabs-flexContainer {
    justify-content: center;
  };
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    color: ${props => props.theme.colorAccentText};
    font-family: ${props => props.theme.fontFamily};
  };
`;

export { GroupSwitcher };
