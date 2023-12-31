import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useMediaQuery } from "react-responsive";
import CardPlace from "./cardplace";
import { setCenter, setZoom } from "../store/setupSlice";

import Arrow from "../Assets-1/arrow-left-white.svg";
import MenuIcon from "@mui/icons-material/Menu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Review from "@mui/icons-material/Reviews";
import PriceIcon from "@mui/icons-material/PriceCheck";
import MapIcon from "@mui/icons-material/Map";

import style from "../style/Sidebar.module.css";

export default function SideBar() {
  const { zoom_default, middle, marks } = useSelector((state) => state.setup.setup);
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);
  const [expand, setExpand] = useState(false);
  const [hide, setHide] = useState(false);
  const sidebarRef = useRef(null);

  // Responsive
  const isResponsive = useMediaQuery({ maxWidth: 992 });

  function getSelected(value) {
    setSelected(value);
    dispatch(setCenter([value.lot, value.lat]));
    dispatch(setZoom(18));
  }

  function removeSelected() {
    setSelected(null);
    dispatch(setCenter(middle.cordinate));
    dispatch(setZoom(zoom_default));
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpand(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className={style.sidebar} ref={sidebarRef}>
      {selected ? (
        <section className={style.place_list_container}>
          {isResponsive ? (
            <>
              <div className={`${style.content_information} ${hide ? style.hide : ""}`}>
                <div style={{ position: "relative" }}>
                  <button
                    className={style.back_button}
                    style={{ top: "15px" }}
                    onClick={() => {
                      removeSelected();
                      setExpand(true);
                    }}
                  >
                    <img src={Arrow} alt="arrow icon" />
                  </button>
                </div>
                <button
                  className={`${style.content_back_button} ${hide ? style.hide : ""}`}
                  onClick={() => {
                    setHide(!hide);
                    setExpand(!expand);
                  }}
                >
                  <img src={Arrow} alt="arrow icon" />
                </button>
                <img src={selected.images[0]} alt="thumb-detail" />

                <div className={style.place_information}>
                  <div className={style.base_info}>
                    <p>{selected.name}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span>Coffee Shop</span>
                      <span>{selected.hour}</span>
                    </div>
                  </div>
                  <ul className={style.place_more_info}>
                    <li>
                      <LocationOnIcon sx={{ color: "#FF9505", width: "32px" }} />
                      <span>{selected.address}</span>
                    </li>
                    <li>
                      <MapIcon sx={{ color: "#FF9505", width: "32px" }} />
                      <span>{`Lot: ${selected.lot}, Lat: ${selected.lat}`}</span>
                    </li>
                    <li>
                      <Review sx={{ color: "#FF9505", width: "32px" }} />
                      <span>{selected.review}</span>
                    </li>
                    <li>
                      <PriceIcon sx={{ color: "#FF9505", width: "32px" }} />
                      <span>{selected.price}</span>
                    </li>
                  </ul>

                  <div className={style.place_photo_section}>
                    <p>Gambar Asli Coffee Shop</p>
                    <div className={style.images_container}>
                      {selected.images?.map((image) => (
                        <img key={image} src={image} alt="thumb-detail" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                className={style.back_button}
                onClick={() => {
                  removeSelected();
                  setExpand(true);
                }}
              >
                <img src={Arrow} alt="arrow icon" />
              </button>
              <img src={selected.images[0]} alt="thumb-detail" />
              <div className={style.place_information}>
                <div className={style.base_info}>
                  <p>{selected.name}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span>Coffee Shop</span>
                    <span>{selected.hour}</span>
                  </div>
                </div>
                <ul className={style.place_more_info}>
                  <li>
                    <LocationOnIcon sx={{ color: "#FF9505", width: "32px" }} />
                    <span>{selected.address}</span>
                  </li>
                  <li>
                    <MapIcon sx={{ color: "#FF9505", width: "32px" }} />
                    <span>{`Lot: ${selected.lot}, Lat: ${selected.lat}`}</span>
                  </li>
                  <li>
                    <PriceIcon sx={{ color: "#FF9505", width: "32px" }} />
                    <span>{selected.price}</span>
                  </li>
                  <li>
                    <Review sx={{ color: "#FF9505", width: "32px" }} />
                    <span>{selected.review}</span>
                  </li>
                </ul>
                <div className={style.place_photo_section}>
                  <p>Lihat Lebih Lanjut</p>
                  {/* Map Photo */}
                  <div className={style.images_container}>
                    {selected.images?.map((image) => (
                      <img key={image} src={image} alt="thumb-detail" />
                    ))}
                  </div>
                </div>
                <div className={style.place_photo_section}>
                  <p>Pilih Menu Idamanmu!</p>
                  {/* Map Photo */}
                  <div className={style.images_container}>
                    {selected.menus?.map((image) => (
                      <img key={image} src={image} alt="thumb-detail" />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className={`${style.place_list_container}`}>
          {isResponsive ? (
            <>
              <div className={style.menu_icon}>
                <MenuIcon className={style.icon_sidebar} onClick={() => setExpand(!expand)} />
              </div>

              <div className={`${style.content} ${expand ? style.show : ""}`}>
                {marks.map((mark, index) => (
                  <CardPlace data={mark} key={index} getSelected={getSelected} />
                ))}
              </div>
            </>
          ) : (
            marks.map((mark, index) => <CardPlace data={mark} key={index} getSelected={getSelected} />)
          )}
        </section>
      )}
    </aside>
  );
}
