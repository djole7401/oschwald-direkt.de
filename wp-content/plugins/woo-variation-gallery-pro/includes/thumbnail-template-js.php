<?php
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
?>

<script type="text/html" id="tmpl-woo-variation-gallery-thumbnail-template">
    <# hasVideo = (  data.video_link ) ? 'wvg-gallery-video-thumbnail' : '' #>
    <div class="wvg-gallery-thumbnail-image {{hasVideo}}">
        <div>
            <img width="{{data.gallery_thumbnail_src_w}}" height="{{data.gallery_thumbnail_src_h}}" src="{{data.gallery_thumbnail_src}}" alt="{{data.alt}}" title="{{data.title}}" data-caption="{{data.caption}}" data-src="{{data.full_src}}" />
        </div>
    </div>
</script>