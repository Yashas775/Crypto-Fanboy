import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { Button } from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { CoinList } from "../config/api";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function FavCoinsTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [coin, setCoin] = useState();

  const { currency, symbol, user, setAlert, watchlist, setWatchlist } =
    CryptoState();

  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
  });

  const classes = useStyles();
  const history = useHistory();

  const addToWatchlist = async (row) => {
    let state = watchlist.findIndex((ele) => ele.id === row.id);

    if (state === -1) {
      watchlist.push(row);

      const coinRef = doc(db, "favs", user.uid);

      try {
        await setDoc(coinRef, { items: watchlist }, { merge: true });

        setAlert({
          open: true,
          message: `${row.name} Added to the Favs !`,
          type: "success",
        });
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const removeFromWatchlist = async (row) => {
    setWatchlist(watchlist.filter((ele) => ele.id !== row.id));

    try {
      const coinRef = doc(db, "favs", user.uid);
      await setDoc(
        coinRef,
        { items: watchlist.filter((ele) => ele.id !== row.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${row.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices
        </Typography>

        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#7678ed" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#7678ed" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap", " "].map(
                    (head) => (
                      <TableCell
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        align={head === "Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {watchlist
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    let index = watchlist.findIndex((ele) => ele.id === row.id);

                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow className={classes.row} key={row.name}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                        <TableCell align="right">
                          {
                            <Button
                              variant="outlined"
                              style={{
                                width: "100",
                                height: 40,
                                backgroundColor:
                                  index !== -1 ? "#ef233c" : "#7678ed",
                                color: index !== -1 ? "white" : "black",
                              }}
                              onClick={
                                index !== -1
                                  ? () => removeFromWatchlist(row)
                                  : () => addToWatchlist(row)
                              }
                            >
                              {index !== -1 ? "Untrack" : "track"}
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <div
          style={{
            width: "100",
            height: 40,
          }}
        ></div>
        {/* Comes from @material-ui/lab */}
      </Container>
    </ThemeProvider>
  );
}
