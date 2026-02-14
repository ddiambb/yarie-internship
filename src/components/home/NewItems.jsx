import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftFallback from "../../images/nftImage.jpg";

const NewItems = () => {
const [newItems, setNewItems] = useState([]);
const [loading, setLoading] = useState(true);
const [now, setNow] = useState(Date.now());
const placeholders = useMemo(() => new Array(4).fill(null), []);

useEffect(() => {
setLoading(true);

fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems")
.then((res) => res.json())
.then((data) => setNewItems(Array.isArray(data) ? data : []))
.catch((err) => console.error("newItems error:", err))
.finally(() => setLoading(false));
}, []);

useEffect(() => {
  const timer = setInterval(() => {
    setNow(Date.now());
     }, 1000);
     return () => clearInterval(timer);
  }, []);

const listToRender = loading ? placeholders : newItems;
const getExpiryMs = (item) => {
const raw =
item?.expiryDate ??
item?.expiry_date ??
item?.expiresAt ??
item?.expiry ??
null;

const n = Number(raw);
if (!Number.isFinite(n) || n <= 0) return null;
return n < 1_000_000_000_000 ? n * 1000 : n;
};

const formatCountdown = (expiryMs) => {
if (!expiryMs) return "--";

const msLeft = expiryMs - now;
if (msLeft <= 0) return "Expired";

const totalSeconds = Math.floor(msLeft / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;

const pad = (v) => String(v).padStart(2, "0");
return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

  
return (
<section id="section-items" className="no-bottom">
<div className="container">
<div className="row">
<div className="col-lg-12">
<div className="text-center">
<h2>New Items</h2>
<div className="small-border bg-color-2" />
</div>
</div>
</div>

<div className="row">
{listToRender.map((item, index) => {
const isPlaceholder = loading || !item;
const nftId = item?.nftId ?? "";
const authorId = item?.authorId ?? "";

return (
<div
className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
key={item?.nftId ?? item?.id ?? index}
>
<div className="nft__item">
<div className="author_list_pp">
{isPlaceholder ? (
<div className="skeleton skeleton-avatar" />
) : (
<Link
to={`/author/${authorId}`}
data-bs-toggle="tooltip"
data-bs-placement="top"
title={`Creator: ${item?.title ?? "Creator"}`}
>
<img
className="lazy"
src={item?.authorImage || AuthorImage}
alt=""
/>
<i className="fa fa-check" />
</Link>
)}
</div>
<div className="de_countdown">
  {isPlaceholder ? "--" : formatCountdown(getExpiryMs(item))}
  </div>
<div className="nft__item_wrap">
<div className="nft__item_extra">
<div className="nft__item_buttons">
<button type="button">Buy Now</button>
<div className="nft__item_share">
<h4>Share</h4>
<button type="button" aria-label="Facebook">
<i className="fa fa-facebook fa-lg" />
</button>
<button type="button" aria-label="Twitter">
<i className="fa fa-twitter fa-lg" />
</button>
<button type="button" aria-label="Email">
<i className="fa fa-envelope fa-lg" />
</button>
</div>
</div>
</div>

{isPlaceholder ? (
<img
src={nftFallback}
className="lazy nft__item_preview"
alt=""
/>
) : (
<Link to={`/item-details/${nftId}`}>
<img
src={item?.nftImage || nftFallback}
className="lazy nft__item_preview"
alt=""
/>
</Link>
)}
</div>
<div className="nft__item_info">
{isPlaceholder ? (
<h4>Loading...</h4>
) : (
<Link to={`/item-details/${nftId}`}>
<h4>{item?.title ?? "Untitled"}</h4>
</Link>
)}

<div className="nft__item_price">
{isPlaceholder ? "0.00" : item?.price ?? "0.00"} ETH
</div>

<div className="nft__item_like">
<i className="fa fa-heart" />
<span>{isPlaceholder ? "0" : item?.likes ?? "0"}</span>
</div>
</div>
</div>
</div>
);
})}
</div>
</div>
</section>
);
};

export default NewItems;
