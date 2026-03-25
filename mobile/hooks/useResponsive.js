import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const contentWidth = isDesktop ? 800 : isTablet ? 600 : '100%';
  const padding = isTablet ? 40 : 16;
  const cardPadding = isTablet ? 28 : 16;
  const fontSize = { sm: isTablet ? 14 : 12, md: isTablet ? 16 : 14, lg: isTablet ? 20 : 17, xl: isTablet ? 28 : 24 };
  return { width, isTablet, isDesktop, contentWidth, padding, cardPadding, fontSize };
}
