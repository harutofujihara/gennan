import React, { FC, useState } from "react";
import ReactDOM from "react-dom";
import { Gennan, Usage } from "../../src";
import {
  ChakraProvider,
  Box,
  Center,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
  Link,
  Code,
  Textarea,
  Heading,
  Text,
  Button,
  Spacer,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  useDisclosure,
  useBreakpointValue,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { RepeatIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { GennanCore, GridNum } from "gennan-core";

export const initGennanCode = (gridNum: 9 | 13 | 19 = 19) =>
  `(;FF[4]SZ[${gridNum}]CA[UTF-8]KM[6.5]),0,1:1,${gridNum}`;

const App: FC = () => {
  return (
    // <div style={{ width: "40%", margin: "auto" }}>
    <ChakraProvider>
      <Page />
    </ChakraProvider>
  );
};

const Page = () => {
  const toast = useToast();

  const [viewBoardGennanCode, setViewBoardGennanCode] = useState(
    "(;FF[4]GN[Game name]GM[1]SZ[19]CA[UTF-8]PB[Ichiriki Ryo]PW[Xie Ke]KM[7.5]RE[W+R];B[qd]C[test1]TR[dd](;W[pp]C[test2]TR[dd];B[cd]C[test3]LB[qd:A][pp:B][aa:C];W[cp];B[eq];W[dq];B[ep];W[cn];B[ip];W[oc];B[fc];W[pe];B[qe];W[pf];B[qg];W[nq];B[ld];W[fd];B[gd];W[ec];B[ed];W[fe];B[dc];W[gc];B[eb];W[fb];B[pg];W[ec];B[do];W[co];B[fc];W[gq];B[hc];W[ec];B[op];W[oq];B[fc];W[qf];B[rf];W[ec];B[qp];W[po];B[fc];W[re];B[rd];W[ec];B[qo];W[ee];B[fc];W[rg];B[se];W[ec];B[pn];W[dd];B[pq];W[oo];B[pr];W[on];B[om];W[nm];B[pm];W[mn];B[ng];W[go];B[db];W[ce];B[gb];W[fc];B[bd];W[qq];B[rq];W[bb];B[be];W[cf];B[bf];W[ch];B[cg];W[dg];B[bg];W[di];B[ib];W[ea];B[cc];W[hn];B[jn];W[mc];B[lc];W[md];B[dm];W[hl];B[fo];W[fn];B[fm];W[en];B[dn];W[bl];B[cl];W[bk];B[ck];W[cj];B[gm];W[gn];B[ej];W[gj];B[ei];W[eh];B[gi];W[hi];B[dj];W[fi];B[bj];W[ci];B[bm];W[bi];B[cm];W[dr];B[er];W[eo];B[dp];W[br];B[el];W[hm];B[fk];W[or];B[qr];W[kp];B[lo];W[ln];B[kq];W[lp];B[hr];W[gr];B[lq];W[mp];B[hp];W[gp];B[jr];W[mr];B[lr];W[ks];B[nl];W[jp];B[le];W[qb];B[rb];W[pd];B[qc];W[mf];B[ll];W[mg];B[km];W[id];B[ie];W[da];B[df];W[de];B[ca];W[fa];B[cb];W[je];B[jd];W[jc];B[kd];W[ic];B[hd];W[he];B[if];W[jb];B[hb];W[ia];B[ge];W[gf];B[hf];W[ga];B[gg];W[ff];B[kg];W[nh];B[eg];W[dh];B[ki];W[jo];B[og];W[lh];B[kh];W[nf];B[oi];W[ni];B[nj];W[oh];B[pi];W[ha];B[lb];W[mj];B[mi];W[nk];B[li];W[mh];B[oj];W[ph];B[qh];W[qi];B[qj];W[ri];B[rh];W[mb];B[pb];W[ob];B[mm];W[he];B[nn];W[no];B[ao];W[bp];B[ih];W[hg];B[hh];W[gh];B[ds];W[cs];B[es];W[gs];B[fg];W[kk];B[jk];W[jj];B[ij];W[jl];B[ik];W[ok];B[pj];W[kl];B[il];W[lm];B[kn];W[nm];B[ma];W[na];B[nn];W[dk];B[gl];W[nm];B[ap];W[aq];B[nn];W[gk];B[em];W[nm];B[cq];W[lk];B[ml];W[mk];B[nn];W[mo])(;W[pq])),0,1:1,19"
  );
  const { onCopy: onCopyViewGC } = useClipboard(viewBoardGennanCode);
  const onCopyViewBoardGennanCode = () => {
    onCopyViewGC();
    toast({
      title: "Copied gennan code",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };
  const [viewBoardGennanKey, setViewBoardGennanKey] = useState(uuidv4());

  const handleViewBoardGennanCodeChange = (e: any) => {
    let inputValue = e.target.value;
    setViewBoardGennanCode(inputValue);
    setViewBoardGennanCode(inputValue);
    setViewBoardGennanKey(uuidv4());
  };

  const [editBoardGennanCode, setEditBoardGennanCode] = useState(
    "(;FF[4]GN[Game name]GM[1]SZ[19]CA[UTF-8]PB[Ichiriki Ryo]PW[Xie Ke]KM[7.5]RE[W+R];B[qd]C[test1]TR[dd](;W[pp]C[test2]TR[dd];B[cd]C[test3]LB[qd:A][pp:B][aa:C];W[cp];B[eq];W[dq];B[ep];W[cn];B[ip];W[oc];B[fc];W[pe];B[qe];W[pf];B[qg];W[nq];B[ld];W[fd];B[gd];W[ec];B[ed];W[fe];B[dc];W[gc];B[eb];W[fb];B[pg];W[ec];B[do];W[co];B[fc];W[gq];B[hc];W[ec];B[op];W[oq];B[fc];W[qf];B[rf];W[ec];B[qp];W[po];B[fc];W[re];B[rd];W[ec];B[qo];W[ee];B[fc];W[rg];B[se];W[ec];B[pn];W[dd];B[pq];W[oo];B[pr];W[on];B[om];W[nm];B[pm];W[mn];B[ng];W[go];B[db];W[ce];B[gb];W[fc];B[bd];W[qq];B[rq];W[bb];B[be];W[cf];B[bf];W[ch];B[cg];W[dg];B[bg];W[di];B[ib];W[ea];B[cc];W[hn];B[jn];W[mc];B[lc];W[md];B[dm];W[hl];B[fo];W[fn];B[fm];W[en];B[dn];W[bl];B[cl];W[bk];B[ck];W[cj];B[gm];W[gn];B[ej];W[gj];B[ei];W[eh];B[gi];W[hi];B[dj];W[fi];B[bj];W[ci];B[bm];W[bi];B[cm];W[dr];B[er];W[eo];B[dp];W[br];B[el];W[hm];B[fk];W[or];B[qr];W[kp];B[lo];W[ln];B[kq];W[lp];B[hr];W[gr];B[lq];W[mp];B[hp];W[gp];B[jr];W[mr];B[lr];W[ks];B[nl];W[jp];B[le];W[qb];B[rb];W[pd];B[qc];W[mf];B[ll];W[mg];B[km];W[id];B[ie];W[da];B[df];W[de];B[ca];W[fa];B[cb];W[je];B[jd];W[jc];B[kd];W[ic];B[hd];W[he];B[if];W[jb];B[hb];W[ia];B[ge];W[gf];B[hf];W[ga];B[gg];W[ff];B[kg];W[nh];B[eg];W[dh];B[ki];W[jo];B[og];W[lh];B[kh];W[nf];B[oi];W[ni];B[nj];W[oh];B[pi];W[ha];B[lb];W[mj];B[mi];W[nk];B[li];W[mh];B[oj];W[ph];B[qh];W[qi];B[qj];W[ri];B[rh];W[mb];B[pb];W[ob];B[mm];W[he];B[nn];W[no];B[ao];W[bp];B[ih];W[hg];B[hh];W[gh];B[ds];W[cs];B[es];W[gs];B[fg];W[kk];B[jk];W[jj];B[ij];W[jl];B[ik];W[ok];B[pj];W[kl];B[il];W[lm];B[kn];W[nm];B[ma];W[na];B[nn];W[dk];B[gl];W[nm];B[ap];W[aq];B[nn];W[gk];B[em];W[nm];B[cq];W[lk];B[ml];W[mk];B[nn];W[mo])(;W[pq])),0,1:1,19"
  );
  const { onCopy: onCopyEditGC } = useClipboard(editBoardGennanCode);
  const onCopyEditBoardGennanCode = () => {
    onCopyEditGC();
    toast({
      title: "Copied gennan code",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };
  const [editBoardGennanKey, setEditBoardGennanKey] = useState(uuidv4());
  const [editBoardUsage, setEditBoardUsage] = useState<Usage>("edit");

  const handleEditBoardGennanCodeChange = (e: any) => {
    let inputValue = e.target.value;
    setEditBoardGennanCode(inputValue);
    setEditBoardGennanCode(inputValue);
    setEditBoardUsage("edit");
    setEditBoardGennanKey(uuidv4());
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [gridNum, setGridNum] = useState<GridNum>(19);
  const openInitBoardDialog = (gridNum: GridNum = 19) => {
    setGridNum(gridNum);
    onOpen();
  };
  const initBoard = () => {
    setEditBoardGennanCode(initGennanCode(gridNum));
    setEditBoardGennanKey(uuidv4());
    setEditBoardUsage("new");
    onClose();
  };

  // size
  const isLargerThanSm = useBreakpointValue({ base: true });
  const smOrMd = isLargerThanSm ? "md" : "sm";

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Initialize editing board?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to initialize editing board? The current board
            state will be deleted.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="teal" ml={3} onClick={initBoard}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Box p={{ base: "1rem", md: "5rem 10rem" }} bg="gray.100">
        <Heading mb="2rem">Gennan</Heading>
        <Text>Gennan is a Baduk board component for React.</Text>
        <Text>
          <Link
            href="https://godokoro.net/articles/01F7GN9EB5NV5JA3M1FTJCY2MV"
            isExternal
          >
            How to use ? <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>

        <Text mt="1rem">
          Gennan uses original notation{" "}
          <Link
            href="https://godokoro.net/articles/01F7NNXHAN102VTX0W5CCT7WKH#baduk-board"
            isExternal
          >
            Gennan Code <ExternalLinkIcon mx="2px" />
          </Link>{" "}
          to express board state.
        </Text>
        <Text>The format of the code is below.</Text>
        <Code colorScheme="blackAlpha">
          @[gennan]([sgf], [path], [Fulcrum point], [side size])
        </Code>

        {/* <Text>
          <Link
            href="https://godokoro.net/articles/01F7NNXHAN102VTX0W5CCT7WKH#baduk-board"
            isExternal
          >
            More details <ExternalLinkIcon mx="2px" />
          </Link>
        </Text> */}

        {/* <Box mt="2rem">
          <Text>You can install by</Text>
          <Code colorScheme="blackAlpha">$ npm install gennan</Code>
          <Text>or</Text>
          <Code colorScheme="blackAlpha">$ yarn add gennan</Code>
        </Box> */}
        <Box mt="1rem">
          <Link
            href="https://github.com/harutofujihara/gennan/tree/master"
            isExternal
          >
            <Button leftIcon={<ExternalLinkIcon />} bg="white" size="sm">
              Github
            </Button>
          </Link>
        </Box>

        <Heading mt="2rem" size={smOrMd}>
          View game
        </Heading>
        <Box d={{ base: "block", md: "flex" }} mt="2rem">
          {/* <Flex> */}

          <Box d="block" w={{ base: "100%", md: "55%" }}>
            <Gennan
              key={viewBoardGennanKey}
              gennanCode={viewBoardGennanCode}
              usage="viewWide"
              onGennanCodeChanged={setViewBoardGennanCode}
            />
          </Box>

          <Spacer />

          <Box w={{ base: "100%", md: "40%" }} mt={{ base: "1rem", md: 0 }}>
            <Textarea
              resize="none"
              h={{ base: "200px", md: "100%" }}
              bg="white"
              value={viewBoardGennanCode}
              onChange={handleViewBoardGennanCodeChange}
            />

            <Flex mt="0.5rem">
              <Spacer />
              <Button
                colorScheme="teal"
                size="sm"
                leftIcon={<CopyIcon />}
                onClick={onCopyViewBoardGennanCode}
              >
                Copy gennan code
              </Button>
            </Flex>
          </Box>
        </Box>

        <Heading mt="5rem" size={smOrMd}>
          Edit game
        </Heading>
        <Flex p="1rem 0">
          <Button
            size="sm"
            bg="white"
            leftIcon={<RepeatIcon />}
            mr="1rem"
            onClick={() => openInitBoardDialog(9)}
          >
            9
          </Button>
          <Button
            size="sm"
            bg="white"
            leftIcon={<RepeatIcon />}
            mr="1rem"
            onClick={() => openInitBoardDialog(13)}
          >
            13
          </Button>
          <Button
            size="sm"
            bg="white"
            leftIcon={<RepeatIcon />}
            onClick={() => openInitBoardDialog(19)}
          >
            19
          </Button>
        </Flex>

        <Box d={{ base: "block", md: "flex" }}>
          <Box w={{ base: "100%", md: "40%" }}>
            <Gennan
              key={editBoardGennanKey}
              gennanCode={editBoardGennanCode}
              usage={editBoardUsage}
              onGennanCodeChanged={setEditBoardGennanCode}
            />
          </Box>
          <Spacer />
          <Box
            d="block"
            w={{ base: "100%", md: "40%" }}
            mt={{ base: "1rem", md: 0 }}
          >
            <Box h="90%" pos={{ base: "static", md: "relative" }}>
              <Textarea
                pos={{ base: "static", md: "absolute" }}
                bottom="0"
                resize="none"
                h={{ base: "200px", md: "70%" }}
                bg="white"
                value={editBoardGennanCode}
                onChange={handleEditBoardGennanCodeChange}
              />
            </Box>
            <Flex mt="0.5rem">
              <Spacer />
              <Button
                colorScheme="teal"
                size="sm"
                leftIcon={<CopyIcon />}
                onClick={onCopyEditBoardGennanCode}
              >
                Copy gennan code
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
