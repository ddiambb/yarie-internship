import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImageFallback from "../../images/author_thumbnail.jpg";

const pickFirst = (...vals) => {
for (const v of vals) {
if (v === 0) return 0;
if (typeof v === "string" && v.trim() !== "") return v;
if (v !== undefined && v !== null && typeof v !== "string") return v;
}
return "";
};

const TopSellers = () => {
const [topSellers, setTopSellers] = useState([]);
const [loading, setLoading] = useState(true);

const placeholders = new Array(12).fill(null);

useEffect(() => {
let isMounted = true;
setLoading(true);

fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers")
.then((res) => res.json())
.then((data) => {
if (!isMounted) return;
setTopSellers(Array.isArray(data) ? data : []);
})
.catch((err) => console.error("topSellers error:", err))
.finally(() => {
if (!isMounted) return;
setLoading(false);
});

return () => {
isMounted = false;
};
}, []);

const listToRender = loading ? placeholders : topSellers;

return (
<section id="section-popular" className="pb-5">
<div className="container">
<div className="row">
<div className="col-lg-12">
<div className="text-center">
<h2>Top Sellers</h2>
<div className="small-border bg-color-2"></div>
</div>
</div>

<div className="col-md-12">
<ol className="author_list">
{listToRender.map((seller, index) => {
const isPlaceholder = loading || !seller;
const keyId = seller?.id ?? seller?.authorId ?? index;

const authorId = String(pickFirst(seller?.authorId, seller?.id, "")).trim();
const authorLink = authorId ? `/author/${authorId}` : "#";

const authorName = pickFirst(
seller?.authorName,
seller?.name,
seller?.username,
"Unknown"
);

const authorImage =
pickFirst(
seller?.authorImage,
seller?.avatar,
seller?.profileImage,
seller?.image
) || AuthorImageFallback;

const priceValue = Number(pickFirst(seller?.price, 0));
const priceText = Number.isFinite(priceValue)
? priceValue.toFixed(1)
: "0.0";

return (
<li key={keyId} className={isPlaceholder ? "skeleton-li" : ""}>
<div className="author_list_pp">
<Link
to={isPlaceholder || !authorId ? "#" : authorLink}
state={
isPlaceholder
? undefined
: {
seller,
from: "top-sellers",
}
}
onClick={(e) =>
(isPlaceholder || !authorId) && e.preventDefault()
}
>
<img
className="pp-author"
src={isPlaceholder ? AuthorImageFallback : authorImage}
alt={isPlaceholder ? "" : authorName}
/>
<i className="fa fa-check"></i>
</Link>
</div>

<div className="author_list_info">
{isPlaceholder ? (
<>
<div className="skeleton skeleton-title" />
<div className="skeleton skeleton-subtitle" />
</>
) : (
<>
<Link
to={authorLink}
state={{
seller,
from: "top-sellers",
}}
>
{authorName}
</Link>
<span>{priceText} ETH</span>
</>
)}
</div>
</li>
);
})}
</ol>
</div>
</div>
</div>
</section>
);
};

export default TopSellers;
