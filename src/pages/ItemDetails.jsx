import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
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

const normalizeOwner = (raw) => {
const id = String(
pickFirst(
raw?.ownerId,
raw?.authorId,
raw?.id,
raw?._id,
raw?.userId
) || ""
).trim();

const name = String(
pickFirst(
raw?.ownerName,
raw?.authorName,
raw?.name,
raw?.username,
raw?.displayName
) || ""
).trim();

const image = pickFirst(
raw?.ownerImage,
raw?.authorImage,
raw?.avatar,
raw?.profileImage,
raw?.image
);

return {
id,
name: name || "Unknown",
image: image || AuthorImageFallback,
};
};

const normalizeCreator = (raw) => {
const id = String(
pickFirst(
raw?.creatorId,
raw?.authorId,
raw?.id,
raw?._id,
raw?.userId
) || ""
).trim();

const name = String(
pickFirst(
raw?.creatorName,
raw?.authorName,
raw?.name,
raw?.username,
raw?.displayName
) || ""
).trim();

const image = pickFirst(
raw?.creatorImage,
raw?.authorImage,
raw?.avatar,
raw?.profileImage,
raw?.image
);

return {
id,
name: name || "Unknown",
image: image || AuthorImageFallback,
};
};

const ItemDetails = () => {
const { itemId } = useParams();
const location = useLocation();
const clickedItem = location.state?.item;
const clickedSeller = location.state?.seller;

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
.then((res) => {
if (!res.ok) {
throw new Error(`Item details request failed: ${res.status}`);
}
return res.json();
})
.then((data) => {
if (!isMounted) return;
setItem(data && typeof data === "object" ? data : null);
})
.catch((err) => {
console.error("itemDetails error:", err);
if (!isMounted) return;
setItem(null);
})
.finally(() => {
if (!isMounted) return;
setLoading(false);
});

return () => {
isMounted = false;
};
}, [itemId]);

const title = pickFirst(
clickedItem?.title,
item?.title,
item?.name,
"NFT Item"
);

const description = pickFirst(item?.description, item?.desc, "");

const price =
Number(
pickFirst(
clickedItem?.price,
item?.price,
item?.currentBid,
item?.ethPrice,
0
)
) || 0;

const likes =
Number(pickFirst(clickedItem?.likes, item?.likes, item?.likeCount, 0)) || 0;

const views = Number(pickFirst(item?.views, item?.viewCount, 0)) || 0;

const image =
pickFirst(
clickedItem?.nftImage,
item?.nftImage,
item?.imageUrl,
item?.image,
item?.img,
item?.cover,
item?.thumbnail
) || nftImageFallback;

const owner = normalizeOwner(
pickFirst(
item?.owner,
item?.ownerInfo,
item?.ownerData,
{
ownerId:
clickedSeller?.authorId ??
clickedItem?.authorId ??
item?.ownerId,
authorId:
clickedSeller?.authorId ??
clickedItem?.authorId ??
item?.ownerId,
ownerName:
clickedSeller?.authorName ??
clickedItem?.authorName ??
item?.ownerName,
authorName:
clickedSeller?.authorName ??
clickedItem?.authorName ??
item?.ownerName,
ownerImage:
clickedSeller?.authorImage ??
clickedItem?.authorImage ??
item?.ownerImage,
authorImage:
clickedSeller?.authorImage ??
clickedItem?.authorImage ??
item?.ownerImage,
}
)
);

const creator = normalizeCreator(
pickFirst(
item?.creator,
item?.creatorInfo,
item?.creatorData,
{
creatorId: item?.creatorId,
authorId: item?.creatorId,
creatorName: item?.creatorName,
authorName: item?.creatorName,
creatorImage: item?.creatorImage,
authorImage: item?.creatorImage,
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
