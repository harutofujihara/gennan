import { useBreakpointValue } from "@chakra-ui/react";

const useSmOrMdSize = () => {
  const isLargerThanSm = useBreakpointValue({ base: false, md: true });
  const size = isLargerThanSm ? "md" : "sm";
  return { size };
};

const useXsOrSmSize = () => {
  const isLargerThanSm = useBreakpointValue({ base: false, md: true });
  const size = isLargerThanSm ? "sm" : "xs";
  return { size };
};

const useMdOrLgSize = () => {
  const isLargerThanSm = useBreakpointValue({ base: false, md: true });
  const size = isLargerThanSm ? "lg" : "md";
  return { size };
};

const useLgOrXlSize = () => {
  const isLargerThanSm = useBreakpointValue({ base: false, md: true });
  const size = isLargerThanSm ? "xl" : "lg";
  return { size };
};

export { useSmOrMdSize, useXsOrSmSize, useLgOrXlSize, useMdOrLgSize };
