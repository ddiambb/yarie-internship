import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthorImageFallback from "../../images/author_thumbnail.jpg";
import nftImageFallback from "../../images/nftImage.jpg";

const AuthorItems = ({ authorName, authorImage }) => {
const { authorId } = useParams();

const [authorItems, setAuthorItems] = useState([]);
const [loading, setLoading] = useState(true);

const placeholders = useMemo(() => new Array(8).fill(null), []);

useEffect(() => {
let isMounted = true;

if (!authorId) {
setAuthorItems([]);
setLoading(false);
return;
}

setLoading(true);

// ✅ correct param name: author=...
const url =
"https://us-central1-nft-cloud-functions.cloudfunctions.net/authorItems?author=" +
encodeURIComponent(authorId);

fetch(url)
.then((res) => res.json())
.then((data) => {
if (!isMounted) return;
setAuthorItems(Array.isArray(data) ? data : []);
})
.catch((err) => console.error("authorItems error:", err))
.finally(() => {
if (!isMounted) return;
setLoading(false);
});

return () => {
isMounted = false;
};
}, [authorId]);

const listToRender = loading ? placeholders : authorItems;

return (
<div className="de_tab_content">
<div className="tab-1">
<div className="row">
{listToRender.map((item, index) => {
const isPlaceholder = loading || !item;


const nftId = item?.nftId ?? item?.id ?? item?._id ?? "";
const title = item?.title ?? item?.nftName ?? "Untitled";
const priceValue = Number(item?.price);
const priceText = Number.isFinite(priceValue) ? priceValue.toFixed(2) : "0.00";
const likes = item?.likes ?? 0;


const aImg =
item?.authorImage ?? authorImage ?? AuthorImageFallback;

const nImg =
item?.nftImage ?? item?.image ?? item?.imageUrl ?? nftImageFallback;

return (
<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={nftId || index}>
<div className="nft__item">
<div className="author_list_pp">
<Link
to={isPlaceholder ? "#" : `/author/${authorId}`}
onClick={(e) => isPlaceholder && e.preventDefault()}
>
<img className="lazy" src={aImg} alt={authorName || "Author"} />
<i className="fa fa-check"></i>
</Link>
</div>

<div className="nft__item_wrap">
<div className="nft__item_extra">
<div className="nft__item_buttons">
<button disabled={isPlaceholder}>Buy Now</button>
<div className="nft__item_share">
<h4>Share</h4>
<a href="#" onClick={(e) => e.preventDefault()}>
<i className="fa fa-facebook fa-lg"></i>
</a>
<a href="#" onClick={(e) => e.preventDefault()}>
<i className="fa fa-twitter fa-lg"></i>
</a>
<a href="#" onClick={(e) => e.preventDefault()}>
<i className="fa fa-envelope fa-lg"></i>
</a>
</div>
</div>
</div>

<Link
to={isPlaceholder || !nftId ? "#" : `/item-details/${nftId}`}
onClick={(e) => (isPlaceholder || !nftId) && e.preventDefault()}
>
<img src={nImg} className="lazy nft__item_preview" alt={title} />
</Link>
</div>

<div className="nft__item_info">
<Link
to={isPlaceholder || !nftId ? "#" : `/item-details/${nftId}`}
onClick={(e) => (isPlaceholder || !nftId) && e.preventDefault()}
>
<h4>{isPlaceholder ? "Loading..." : title}</h4>
</Link>

<div className="nft__item_price">{isPlaceholder ? "0.00" : priceText} ETH</div>

<div className="nft__item_like">
<i className="fa fa-heart"></i>
<span>{isPlaceholder ? 0 : likes}</span>
</div>
</div>
</div>
</div>
);
})}

{!loading && authorId && authorItems.length === 0 && (
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
