
import React from 'react';

// This higher-order component adds the missing event handlers that TypeScript requires
export function withMaterialTailwindProps<T>(Component: React.ComponentType<T>) {
  const WithProps = (props: any) => {
    const enhancedProps = {
      ...props,
      onPointerEnterCapture: () => {},
      onPointerLeaveCapture: () => {},
    };
    
    return <Component {...enhancedProps} />;
  };
  
  return WithProps;
}

// Re-export wrapped Material Tailwind components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  Navbar,
  Input,
  Textarea,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Chip,
} from "@material-tailwind/react";

export const MTButton = withMaterialTailwindProps(Button);
export const MTCard = withMaterialTailwindProps(Card);
export const MTCardBody = withMaterialTailwindProps(CardBody);
export const MTCardHeader = withMaterialTailwindProps(CardHeader);
export const MTTypography = withMaterialTailwindProps(Typography);
export const MTIconButton = withMaterialTailwindProps(IconButton);
export const MTMenu = withMaterialTailwindProps(Menu);
export const MTMenuHandler = withMaterialTailwindProps(MenuHandler);
export const MTMenuList = withMaterialTailwindProps(MenuList);
export const MTMenuItem = withMaterialTailwindProps(MenuItem);
export const MTAvatar = withMaterialTailwindProps(Avatar);
export const MTDrawer = withMaterialTailwindProps(Drawer);
export const MTList = withMaterialTailwindProps(List);
export const MTListItem = withMaterialTailwindProps(ListItem);
export const MTListItemPrefix = withMaterialTailwindProps(ListItemPrefix);
export const MTNavbar = withMaterialTailwindProps(Navbar);
export const MTInput = withMaterialTailwindProps(Input);
export const MTTextarea = withMaterialTailwindProps(Textarea);
export const MTTabs = withMaterialTailwindProps(Tabs);
export const MTTabsHeader = withMaterialTailwindProps(TabsHeader);
export const MTTabsBody = withMaterialTailwindProps(TabsBody);
export const MTTab = withMaterialTailwindProps(Tab);
export const MTTabPanel = withMaterialTailwindProps(TabPanel);
export const MTChip = withMaterialTailwindProps(Chip);
