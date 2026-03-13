import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import AuthorImageFallback from "../../images/author_thumbnail.jpg";
import nftImageFallback from "../../images/nftImage.jpg";

const pickFirst = (...vals) => {
for (const v of vals) {
if (v === 0) return 0;
if (typeof v === "string" && v.trim() !== "") return v;
if (v !== undefined && v !== null && typeof v !== "string") return v;
}
return "";
};

const AuthorItems = ({
authorId = "",
authorName = "",
authorImage = "",
items = [],
loading = false,
}) => {
const placeholders = useMemo(() => new Array(8).fill(null), []);
const listToRender = loading ? placeholders : items;

return (
<div className="de_tab_content">
<div className="tab-1">
<div className="row">
{listToRender.map((item, index) => {
const isPlaceholder = loading || !item;

const nftId = pickFirst(item?.nftId, item?.id, item?._id, "");
const title = pickFirst(item?.title, item?.nftName, "Untitled");

const priceValue = Number(pickFirst(item?.price, 0));
const priceText = Number.isFinite(priceValue)
? priceValue.toFixed(2)
: "0.00";

const likes = Number(pickFirst(item?.likes, item?.likeCount, 0)) || 0;

const cardAuthorId = String(authorId || "").trim();
const cardAuthorLink = cardAuthorId ? `/author/${cardAuthorId}` : "#";

// The author-items endpoint only gives minimal NFT data,
// so use the current page author's avatar here.
const aImg = authorImage || AuthorImageFallback;
const aName = authorName || "Author";

const nImg =
pickFirst(
item?.nftImage,
item?.imageUrl,
item?.previewImage,
item?.thumbnail,
item?.img,
item?.cover
) || nftImageFallback;

return (
<div
className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
key={nftId || index}
>
<div className="nft__item">
<div className="author_list_pp">
<Link
to={isPlaceholder || !cardAuthorId ? "#" : cardAuthorLink}
state={isPlaceholder ? undefined : { item }}
onClick={(e) =>
(isPlaceholder || !cardAuthorId) && e.preventDefault()
}
>
<img className="lazy" src={aImg} alt={aName} />
<i className="fa fa-check"></i>
</Link>
</div>

<div className="nft__item_wrap">
<div className="nft__item_extra">
<div className="nft__item_buttons">
<button disabled={isPlaceholder}>Buy Now</button>

<div className="nft__item_share">
<h4>Share</h4>
<a href="/" onClick={(e) => e.preventDefault()}>
<i className="fa fa-facebook fa-lg"></i>
</a>
<a href="/" onClick={(e) => e.preventDefault()}>
<i className="fa fa-twitter fa-lg"></i>
</a>
<a href="/" onClick={(e) => e.preventDefault()}>
<i className="fa fa-envelope fa-lg"></i>
</a>
</div>
</div>
</div>

<Link
to={isPlaceholder || !nftId ? "#" : `/item-details/${nftId}`}
state={isPlaceholder ? undefined : { item }}
onClick={(e) =>
(isPlaceholder || !nftId) && e.preventDefault()
}
>
<img
src={nImg}
className="lazy nft__item_preview"
alt={title}
/>
</Link>
</div>

<div className="nft__item_info">
<Link
to={isPlaceholder || !nftId ? "#" : `/item-details/${nftId}`}
state={isPlaceholder ? undefined : { item }}
onClick={(e) =>
(isPlaceholder || !nftId) && e.preventDefault()
}
>
<h4>{isPlaceholder ? "Loading..." : title}</h4>
</Link>

<div className="nft__item_price">
{isPlaceholder ? "0.00" : priceText} ETH
</div>

<div className="nft__item_like">
<i className="fa fa-heart"></i>
<span>{isPlaceholder ? 0 : likes}</span>
</div>
</div>
</div>
</div>
);
})}

{!loading && Array.isArray(items) && items.length === 0 && (
<div className="col-md-12" style={{ marginTop: 10, opacity: 0.8 }}>
No items found for this author.
</div>
)}
</div>
</div>
</div>
);
};

export default AuthorItems;
