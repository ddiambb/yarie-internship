import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
return (
<footer className="footer-light">
<div className="container">
<div className="row">
{/* Column 1 */}
<div className="col-md-3 col-sm-6 col-xs-12">
<div className="widget">
<h5>Marketplace</h5>
<ul>
<li><span className="no-cursor">All NFTs</span></li>
<li><span className="no-cursor">Art</span></li>
<li><span className="no-cursor">Music</span></li>
<li><span className="no-cursor">Domain Names</span></li>
<li><span className="no-cursor">Virtual World</span></li>
<li><span className="no-cursor">Collectibles</span></li>
</ul>
</div>
</div>

{/* Column 2 */}
<div className="col-md-3 col-sm-6 col-xs-12">
<div className="widget">
<h5>Resources</h5>
<ul>
<li><span className="no-cursor">Help Center</span></li>
<li><span className="no-cursor">Partners</span></li>
<li><span className="no-cursor">Suggestions</span></li>
<li><span className="no-cursor">Discord</span></li>
<li><span className="no-cursor">Docs</span></li>
<li><span className="no-cursor">Newsletter</span></li>
</ul>
</div>
</div>

{/* Column 3 */}
<div className="col-md-3 col-sm-6 col-xs-12">
<div className="widget">
<h5>Community</h5>
<ul>
<li><span className="no-cursor">Community</span></li>
<li><span className="no-cursor">Documentation</span></li>
<li><span className="no-cursor">Brand Assets</span></li>
<li><span className="no-cursor">Blog</span></li>
<li><span className="no-cursor">Forum</span></li>
<li><span className="no-cursor">Mailing List</span></li>
</ul>
</div>
</div>

{/* Column 4 */}
<div className="col-md-3 col-sm-6 col-xs-12">
<div className="widget">
<h5>Ultraverse</h5>
<ul>
{/* ONLY use Link when you have a REAL route */}
<li><Link to="/" className="no-cursor">Home</Link></li>
<li><span className="no-cursor">Explore</span></li>
<li><span className="no-cursor">Contact</span></li>
</ul>
</div>
</div>
</div>

<div className="spacer-20" />
<div className="row">
<div className="col-md-12 text-center">
<div className="footer__logo">ULTRAVERSE NFT WORLD</div>
<div>© Copyright 2022</div>
</div>
</div>
</div>
</footer>
);
};

export default Footer;
