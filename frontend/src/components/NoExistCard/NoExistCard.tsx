import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

interface NoExistCardProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}

const NoExistCard: React.FC<NoExistCardProps> = ({ title, message, buttonText, buttonLink }) => {
  return (
      <>
          <div style={{height: '420px'}}/>
          <Box
              sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                  textAlign: "center",
                  color: "#555",
              }}
          >
              <Card
                  sx={{
                      maxWidth: 400,
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
              >
                  <CardContent>
                      <Typography
                          variant="h5"
                          component="div"
                          sx={{marginBottom: "16px", fontWeight: "bold", color: "#333"}}
                      >
                          {title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{marginBottom: "20px"}}>
                          {message}
                      </Typography>
                      <Link to={buttonLink} style={{textDecoration: "none"}}>
                          <Button
                              variant="contained"
                              sx={{
                                  backgroundColor: "#1976d2",
                                  color: "#fff",
                                  "&:hover": {
                                      backgroundColor: "#155a9c",
                                  },
                              }}
                          >
                              {buttonText}
                          </Button>
                      </Link>
                  </CardContent>
              </Card>
          </Box></>
  );
};

export default NoExistCard;
