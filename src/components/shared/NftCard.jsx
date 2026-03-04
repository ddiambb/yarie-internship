import React from "react";
import { Link } from "react-router-dom";
import nftImageFallback from "../../images/nftImage.jpg";

const NftCard = ({ item, loading }) => {

if (loading || !item) {
return (
<div className="nft__item">
<div className="nft__item_wrap">
<div className="skeleton skeleton-image" style={{ height: 220 }} />
</div>

<div className="nft__item_info">
<div className="skeleton skeleton-title" style={{ height: 18, marginBottom: 10 }} />
<div className="skeleton skeleton-subtitle" style={{ height: 14, width: "60%" }} />
</div>
</div>
);
}

const id = item.nftId ?? item.id ?? item._id;
const title = item.title ?? "NFT Item";
const price = item.price ?? 0;
const likes = item.likes ?? 0;

const image =
item.nftImage || item.image || item.imageUrl || item.img || nftImageFallback;

return (
<div className="nft__item">
<div className="nft__item_wrap">
<Link to={id ? `/item-details/${id}` : "#"}>
<img src={image} className="nft__item_preview" alt={title} />
</Link>
</div>

<div className="nft__item_info">
<Link to={id ? `/item-details/${id}` : "#"}>
<h4>{title}</h4>
</Link>

<div className="nft__item_price">{Number(price).toFixed(2)} ETH</div>

<div className="nft__item_like">
<i className="fa fa-heart" /> <span>{likes}</span>
</div>
</div>
</div>
);
};

export default NftCard;
