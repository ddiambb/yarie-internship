import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import AuthorImageFallback from "../images/author_thumbnail.jpg";
import nftImageFallback from "../images/nftImage.jpg";

const pickFirst = (...vals) => {
for (const v of vals) {
if (v === 0) return 0;
if (typeof v === "string" && v.trim() !== "") return v;
if (v !== undefined && v !== null && typeof v !== "string") return v;
}
return "";
};

const normalizePerson = (raw) => {
const id = String(
pickFirst(
raw?.authorId,
raw?.id,
raw?._id,
raw?.userId,
raw?.ownerId,
raw?.creatorId
) || ""
).trim();

const name = String(
pickFirst(
raw?.authorName,
raw?.name,
raw?.username,
raw?.displayName,
raw?.ownerName,
raw?.creatorName
) || ""
).trim();

const image = pickFirst(raw?.authorImage, raw?.image, raw?.avatar, raw?.profileImage);

return {
id,
name: name || "Unknown",
image: image || AuthorImageFallback,
};
};

const ItemDetails = () => {
const { itemId } = useParams();

const [item, setItem] = useState(null);
const [loading, setLoading] = useState(true);

const isPlaceholder = useMemo(() => loading || !itemId, [loading, itemId]);

useEffect(() => {
window.scrollTo(0, 0);
}, [itemId]);

useEffect(() => {
let isMounted = true;

if (!itemId) {
setItem(null);
setLoading(false);
return;
}

setLoading(true);

const url =
"https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=" +
encodeURIComponent(itemId);

fetch(url)
.then((res) => res.json())
.then((data) => {
if (!isMounted) return;
setItem(data && typeof data === "object" ? data : null);
})
.catch((err) => console.error("itemDetails error:", err))
.finally(() => {
if (!isMounted) return;
setLoading(false);
});

return () => {
isMounted = false;
};
}, [itemId]);

// Basic fields
const title = item?.title || item?.name || "NFT Item";
const description = item?.description || item?.desc || "";
const price = Number(pickFirst(item?.price, item?.currentBid, item?.ethPrice, 0)) || 0;
const likes = Number(pickFirst(item?.likes, item?.likeCount, 0)) || 0;
const views = Number(pickFirst(item?.views, item?.viewCount, 0)) || 0;

const image =
pickFirst(
item?.nftImage,
item?.image,
item?.imageUrl,
item?.img,
item?.cover,
item?.thumbnail
) || nftImageFallback;


const owner = normalizePerson(
pickFirst(
item?.owner,
item?.ownerInfo,
item?.ownerData,
item?.author,
{
ownerId: item?.ownerId,
ownerName: item?.ownerName,
image: item?.ownerImage,
},
{
authorId: item?.authorId,
authorName: item?.authorName,
authorImage: item?.authorImage,
}
)
);


const creator = normalizePerson(
pickFirst(
item?.creator,
item?.creatorInfo,
item?.creatorData,
item?.author, 
{
creatorId: item?.creatorId,
creatorName: item?.creatorName,
image: item?.creatorImage,
},
{
authorId: item?.authorId,
authorName: item?.authorName,
authorImage: item?.authorImage,
}
)
);

const ownerLink = owner.id ? `/author/${owner.id}` : "#";
const creatorLink = creator.id ? `/author/${creator.id}` : "#";

return (
<div id="wrapper">
<div className="no-bottom no-top" id="content">
<div id="top" />

<section aria-label="section" className="mt90 sm-mt-0">
<div className="container">
<div className="row">
<div className="col-md-6 text-center">
<img
src={image}
className="img-fluid img-rounded mb-sm-30 nft-image"
alt={title}
/>

{isPlaceholder && (
<div style={{ marginTop: 12, opacity: 0.7 }}>
Loading item details…
</div>
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

<p>{description}</p>

<div className="d-flex flex-row">
<div className="mr40">
<h6>Owner</h6>

<div className="item_author">
<div className="author_list_pp">
<Link
to={isPlaceholder || !owner.id ? "#" : ownerLink}
onClick={(e) =>
(isPlaceholder || !owner.id) && e.preventDefault()
}
>
<img className="lazy" src={owner.image} alt={owner.name} />
<i className="fa fa-check" />
</Link>
</div>

<div className="author_list_info">
<Link
to={isPlaceholder || !owner.id ? "#" : ownerLink}
onClick={(e) =>
(isPlaceholder || !owner.id) && e.preventDefault()
}
>
{owner.name}
</Link>
</div>
</div>
</div>
</div>

<div className="de_tab tab_simple">
<div className="de_tab_content">
<h6>Creator</h6>

<div className="item_author">
<div className="author_list_pp">
<Link
to={isPlaceholder || !creator.id ? "#" : creatorLink}
onClick={(e) =>
(isPlaceholder || !creator.id) && e.preventDefault()
}
>
<img
className="lazy"
src={creator.image}
alt={creator.name}
/>
<i className="fa fa-check" />
</Link>
</div>

<div className="author_list_info">
<Link
to={isPlaceholder || !creator.id ? "#" : creatorLink}
onClick={(e) =>
(isPlaceholder || !creator.id) && e.preventDefault()
}
>
{creator.name}
</Link>
</div>
</div>

<div className="spacer-40" />

<h6>Price</h6>
<div className="nft-item-price">
<img src={EthImage} alt="ETH" />
<span>{Number(price).toFixed(2)}</span>
</div>
</div>

{!loading && itemId && !item && (
<div style={{ marginTop: 12, color: "#c00" }}>
Couldn’t load item #{itemId}. Check the endpoint or itemId.
</div>
)}
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
