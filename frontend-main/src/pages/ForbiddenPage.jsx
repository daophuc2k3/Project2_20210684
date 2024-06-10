import IconForbidden from "@components/shared/IconForbidden";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Metadata from "@components/shared/Metadata";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Metadata title={"403"} />

        <Box sx={{ mt: 3, mb: 10, textAlign: "center" }}>
          <Typography fontWeight={"bold"} fontSize={28} textAlign={"center"}>
            Forbidden
          </Typography>
          <Typography mt={2} color="text.secondary">
            {"Sorry you don't have access"}
          </Typography>

          <Link to={"/football"}>Go to Home</Link>
        </Box>

        <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
          <img src="/forbidden/forbidden1.png" width={250} loading="lazy" />
          <img src="/forbidden/forbidden2.webp" width={300} loading="lazy" />
          <IconForbidden />
        </Stack>
      </Box>
    </Container>
  );
};

export default ForbiddenPage;
