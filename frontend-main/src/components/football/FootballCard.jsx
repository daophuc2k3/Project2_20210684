import { FootballStatus } from "@constant/football";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { formatPrice } from "@utils/format";
import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FootballCard = ({ images, item, onBookingNow = (values) => {} }) => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <Grid item xs={3}>
      <Card sx={{ minHeight: 400 }}>
        <CardContent>
          <Box
            component={Swiper}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            sx={{ height: "100%" }}
          >
            {images.map((image, i) => (
              <SwiperSlide key={i} style={{ height: "100%" }}>
                <Box
                  component={"img"}
                  src={image}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              </SwiperSlide>
            ))}

            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20"></circle>
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Box>

          <Box my={2}>
            <Typography
              variant="h6"
              noWrap
            >{`${item.name} (Số ${item.number})`}</Typography>
            <Typography>{`Category: ${item.category?.name}`}</Typography>
            <Typography>{`Total people: ${item.category?.quantity}`}</Typography>
            <Typography>{`Price 1 hour: ${formatPrice(
              item.price
            )}`}</Typography>
            <Typography
              color={
                item.status === FootballStatus.available ? "green" : "error"
              }
              fontWeight={700}
            >{`Status: ${item.status}`}</Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => onBookingNow(item)}
            disabled={item.status === FootballStatus.maintain}
          >
            Book now
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FootballCard;
