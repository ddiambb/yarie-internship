import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorImageFallback from "../images/author_thumbnail.jpg";

const Author = () => {
const { authorId } = useParams();

const [author, setAuthor] = useState(null);
const [loading, setLoading] = useState(true);
const [isFollowing, setIsFollowing] = useState(false);

const isPlaceholder = useMemo(() => loading || !authorId, [loading, authorId]);

useEffect(() => {
window.scrollTo(0, 0);
}, [authorId]);

useEffect(() => {
let isMounted = true;

if (!authorId) {
setAuthor(null);
setLoading(false);
return;
}

setLoading(true);

const url =
"https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=" +
encodeURIComponent(authorId);

fetch(url)
.then((res) => {
if (!res.ok) {
throw new Error(`Author request failed: ${res.status}`);
}
return res.json();
})
.then((data) => {
if (!isMounted) return;
setAuthor(data && typeof data === "object" ? data : null);
setIsFollowing(false);
})
.catch((err) => {
console.error("author error:", err);
if (!isMounted) return;
setAuthor(null);
})
.finally(() => {
if (!isMounted) return;
setLoading(false);
});

return () => {
isMounted = false;
};
}, [authorId]);

const name = author?.authorName ?? "Unknown";
const tag = author?.tag ?? "";
const wallet = author?.address ?? author?.walletAddress ?? author?.wallet ?? "";
const image = author?.authorImage ?? AuthorImageFallback;


const authorNfts =
author?.nfts ??
author?.items ??
author?.authorItems ??
author?.authorNfts ??
author?.nftCollection ??
[];

const baseFollowers = Number(author?.followers ?? 0);
const followers = Number.isFinite(baseFollowers)
? baseFollowers + (isFollowing ? 1 : 0)
: isFollowing
? 1
: 0;

const onToggleFollow = () => {
if (isPlaceholder) return;
setIsFollowing((prev) => !prev);
};

return (
<div id="wrapper">
<div className="no-bottom no-top" id="content">
<div id="top"></div>

<section
id="profile_banner"
aria-label="section"
className="text-light"
style={{ background: `url(${AuthorBanner}) top` }}
></section>

<section aria-label="section">
<div className="container">
<div className="row">
<div className="col-md-12">
<div className="d_profile de-flex">
<div className="de-flex-col">
<div className="profile_avatar">
<img src={image} alt={name} />
<i className="fa fa-check"></i>

<div className="profile_name">
<h4>
{isPlaceholder ? "Loading..." : name}

<span className="profile_username">
{isPlaceholder
? ""
: tag
? `@${tag}`
: `@${String(name).toLowerCase().replace(/\s+/g, "")}`}
</span>

<span style={{ display: "block", marginTop: 6, opacity: 0.85 }}>
{isPlaceholder || !wallet ? "" : wallet}
</span>
</h4>
</div>
</div>
</div>

<div className="profile_follow de-flex">
<div className="de-flex-col">
<div className="profile_follower">
{isPlaceholder ? "..." : followers} followers
</div>

<button
type="button"
className="btn-main"
onClick={onToggleFollow}
disabled={isPlaceholder}
>
{isFollowing ? "Unfollow" : "Follow"}
</button>
</div>
</div>
</div>
</div>

<div className="col-md-12">
<div className="de_tab tab_simple">
<AuthorItems
authorId={authorId}
authorName={name}
authorImage={image}
items={Array.isArray(authorNfts) ? authorNfts : []}
loading={loading}
/>
</div>
</div>

{!loading && authorId && !author && (
<div className="col-md-12" style={{ marginTop: 12, color: "#c00" }}>
Couldn’t load this author. Check the endpoint / ID.
</div>
)}
</div>
</div>
</section>
</div>
</div>
);
};

export default Author;
