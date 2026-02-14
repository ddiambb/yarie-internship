
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftFallback from "../images/nftImage.jpg";

const ItemDetails = () => {
const { nftId } = useParams();
const [item, setItem] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
window.scrollTo(0, 0);
}, [nftId]);

useEffect(() => {
if (!nftId) return;

setLoading(true);

fetch(
`https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
)
.then((res) => res.json())
.then((data) => setItem(data && typeof data === "object" ? data : null))
.catch((err) => {
console.error("itemDetails error:", err);
setItem(null);
})
.finally(() => setLoading(false));
}, [nftId]);

const title = loading ? "Loading..." : item?.title ?? "Untitled";
const imgSrc = item?.nftImage || nftFallback;
const price = item?.price ?? "0.00";
const likes = item?.likes ?? "0";
const views = item?.views ?? "0";
const desc = item?.description ?? "";

const ownerName = item?.ownerName ?? "Unknown";
const ownerId = item?.ownerId ?? item?.authorId ?? "";
const ownerImage = item?.ownerImage ?? item?.authorImage ?? AuthorImage;

const creatorName = item?.creatorName ?? "Unknown";
const creatorId = item?.authorId ?? "";
const creatorImage = item?.authorImage ?? AuthorImage;

return (
<div id="wrapper">
<div className="no-bottom no-top" id="content">
<div id="top" />

<section aria-label="section" className="mt90 sm-mt-0">
<div className="container">
<div className="row">
<div className="col-md-6 text-center">
{loading ? (
<div className="skeleton skeleton-image" />
) : (
<img
src={imgSrc}
className="img-fluid img-rounded mb-sm-30 nft-image"
alt=""
/>
)}
</div>

<div className="col-md-6">
<div className="item_info">
<h2>{title}</h2>

<div className="item_info_counts">
<div className="item_info_views">
<i className="fa fa-eye" /> {views}
</div>
<div className="item_info_like">
<i className="fa fa-heart" /> {likes}
</div>
</div>

<p>{desc}</p>

<div className="d-flex flex-row">
<div className="mr40">
<h6>Owner</h6>
<div className="item_author">
<div className="author_list_pp">
{ownerId ? (
<Link to={`/author/${ownerId}`}>
<img className="lazy" src={ownerImage} alt="" />
<i className="fa fa-check" />
</Link>
) : (
<img className="lazy" src={ownerImage} alt="" />
)}
</div>
<div className="author_list_info">
{ownerId ? (
<Link to={`/author/${ownerId}`}>{ownerName}</Link>
) : (
<span>{ownerName}</span>
)}
</div>
</div>
</div>
</div>

<div className="de_tab tab_simple">
<div className="de_tab_content">
<h6>Creator</h6>
<div className="item_author">
<div className="author_list_pp">
{creatorId ? (
<Link to={`/author/${creatorId}`}>
<img
className="lazy"
src={creatorImage}
alt=""
/>
<i className="fa fa-check" />
</Link>
) : (
<img className="lazy" src={creatorImage} alt="" />
)}
</div>
<div className="author_list_info">
{creatorId ? (
<Link to={`/author/${creatorId}`}>
{creatorName}
</Link>
) : (
<span>{creatorName}</span>
)}
</div>
</div>
</div>

<div className="spacer-40" />

<h6>Price</h6>
<div className="nft-item-price">
<img src={EthImage} alt="" />
<span>{price}</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</div>
);
};

export default ItemDetails;
